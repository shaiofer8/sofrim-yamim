// Monetization (Epic 3). Loaded last (AD-1) -- may reference globals
// defined in app.js/notifications.js, never the reverse.

// AD-4: purchase state lives in its own dedicated localStorage key, never
// mixed into the events key. Shape (locked by AD-4, keep as-is):
// { adsRemoved: boolean, verifiedAt: ISO-timestamp }.
// Note on the name: "verifiedAt" is a client-side clock reading taken
// when the Payment Request flow completes, not proof of a server-side
// receipt check -- AD-3 means this app has no server to check against
// at all. It records *when* the purchase completed, not an independent
// verification of it; Story 3.3's listPurchases()-based restore is what
// re-confirms ownership against Play's own records on cold start.
const PURCHASE_KEY = "sofrim-yamim.purchase.v1";

function savePurchaseState(adsRemoved) {
  localStorage.setItem(PURCHASE_KEY, JSON.stringify({ adsRemoved, verifiedAt: new Date().toISOString() }));
}

// AD-4: the ONLY sanctioned way to check purchase state. Every other
// piece of code that needs to know (including this file's own banner
// logic below) must call this helper, never read the localStorage key
// directly -- keeps the storage shape free to evolve behind one seam.
function hasRemovedAds() {
  try {
    const state = JSON.parse(localStorage.getItem(PURCHASE_KEY));
    return state?.adsRemoved === true;
  } catch (err) {
    console.debug("[sofrim-yamim] hasRemovedAds: corrupted/missing purchase state, defaulting to false:", err);
    return false; // corrupted/missing state -- default to showing ads, not silently removing them
  }
}

// Story 3.1 / AD-9: billing.js owns *whether* #ad-banner is visible, never
// its existence or contents -- that element and its AdSense <ins> markup
// are static HTML (index.html), never created/destroyed/rewritten here.
const adBannerEl = document.getElementById("ad-banner");

// Public seam: Story 3.2 (purchase flow) and Story 3.3 (restore-on-
// cold-start) both call this after they change what hasRemovedAds()
// would return, so the banner (and whether an ad gets requested at all)
// updates immediately without a page reload.
function refreshAdBanner() {
  if (!adBannerEl) return;
  const removed = hasRemovedAds();
  adBannerEl.hidden = removed;
  if (!removed) {
    // The <ins> markup is static, but *requesting* an ad into it is not
    // -- a paying user (once Story 3.2 exists) should never cause this
    // network/battery cost just because the hidden slot still exists in
    // the DOM. Each push() asks AdSense to fill one ad slot; calling it
    // more than once for the same <ins> is harmless (a no-op) but there's
    // no need to either, so this only ever runs on the visible path.
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.debug("[sofrim-yamim] adsbygoogle push failed (non-blocking, expected with the placeholder client id):", err);
    }
  }
}

refreshAdBanner();

// Story 3.2 / AD-4: one-time "remove ads" purchase. ONLY Payment Request
// API + getDigitalGoodsService('https://play.google.com/billing') --
// never a native SDK, never an independent payment server (AD-3: no
// team-owned server exists in this app at all).
//
// ⚠️ Unverified against a real device: the Digital Goods API only exists
// inside a real TWA installed from Google Play (Chrome 101+) -- it is
// not present in any desktop/mobile browser tab, including every
// environment this was built and tested in. The overall shape below
// (getDigitalGoodsService -> getDetails -> PaymentRequest.show() ->
// PaymentResponse.details.purchaseToken -> complete()) follows Google's
// documented pattern for Play Billing via the web, but the exact
// response field names, and two states this can't fully handle without a
// real device to check the exact API shape against -- a PENDING (not yet
// finalized, e.g. delayed payment methods) purchaseState, and a
// canMakePayment() pre-flight check before showing the sheet -- need
// confirming against a real installed TWA before this ships to users
// (Epic 4 territory). "Already owned" retries are intentionally not
// special-cased here either: Story 3.3's listPurchases() (cold-start
// restore) is the real fix for that class of problem, not a purchase-
// retry-time patch that would duplicate what that story builds properly.
// What's verified here is everything *around* the one real API call:
// feature-detection, the UI state machine, and the billing.js
// integration (see spec for what was actually tested, via a mocked API).
const PRODUCT_SKU = "remove_ads"; // must match the product id registered in Play Console (Story 4.x) -- not yet created

const purchaseBtn = document.getElementById("purchaseBtn");
const purchaseBtnLabel = purchaseBtn?.querySelector(".purchase-btn-label");
const purchaseSpinner = purchaseBtn?.querySelector(".purchase-spinner");
const purchaseErrorEl = document.getElementById("purchaseError");

function digitalGoodsAvailable() {
  return "getDigitalGoodsService" in window && "PaymentRequest" in window;
}

function setPurchaseButtonState(state) {
  // "idle" | "pending" | "done"
  if (!purchaseBtn) return;
  purchaseBtn.disabled = state !== "idle";
  purchaseBtn.classList.toggle("done", state === "done"); // visually distinct from "pending" -- flat, not the gradient+spinner combo, so a glance (or a screenshot) can't mistake "in progress" for "already owned"
  purchaseBtn.setAttribute("aria-busy", String(state === "pending"));
  purchaseSpinner.hidden = state !== "pending";
  if (state === "done") {
    purchaseBtnLabel.textContent = "הפרסומות הוסרו.";
  }
}

async function purchaseRemoveAds() {
  if (!digitalGoodsAvailable() || !purchaseBtn) return;

  purchaseErrorEl.hidden = true;
  setPurchaseButtonState("pending");

  try {
    const service = await window.getDigitalGoodsService("https://play.google.com/billing");
    const [itemDetails] = await service.getDetails([PRODUCT_SKU]);
    if (!itemDetails) throw new Error(`SKU "${PRODUCT_SKU}" not found in the store listing`);

    const request = new PaymentRequest(
      [{ supportedMethods: "https://play.google.com/billing", data: { sku: PRODUCT_SKU } }],
      { total: { label: itemDetails.title, amount: itemDetails.price } }
    );
    const response = await request.show();
    const purchaseToken = response.details?.purchaseToken;

    if (!purchaseToken) {
      // Tell the Payment Handler this didn't actually work *before*
      // treating it as a failure on our side -- complete() must be
      // called exactly once either way.
      await response.complete("fail");
      throw new Error("Payment completed but no purchaseToken was returned");
    }

    // Persist + reflect the unlock BEFORE telling the Payment Handler
    // "success" (the reverse order this shipped with initially): if the
    // token exists, the purchase is real regardless of what complete()
    // does next, so a user must never end up charged with the app still
    // showing ads because complete() itself happened to throw.
    //
    // Non-consumable (a one-time unlock, not spent/repeated) -- no
    // service.consume() call, matching Play Billing's documented
    // distinction between consumable and non-consumable digital goods.
    savePurchaseState(true);
    refreshAdBanner();
    setPurchaseButtonState("done");
    if (typeof announce === "function") announce("הפרסומות הוסרו.");

    // Isolated in its own try/catch, deliberately outside the outer
    // catch below: the purchase is already recorded and reflected in the
    // UI at this point, so a failure here is just the payment sheet not
    // dismissing cleanly (cosmetic), never a reason to revert the
    // already-correct "done" state or show a "purchase failed" error for
    // something that, from the user's perspective, already succeeded.
    try {
      await response.complete("success");
    } catch (completeErr) {
      console.debug("[sofrim-yamim] response.complete() failed after a successful purchase (cosmetic only):", completeErr);
    }
  } catch (err) {
    if (err?.name === "AbortError") {
      // The user closed the payment sheet themselves -- "changed my
      // mind" isn't a failure, and showing the generic error text here
      // would misrepresent a deliberate cancellation as something broken.
      console.debug("[sofrim-yamim] purchase cancelled by user:", err);
      setPurchaseButtonState("idle");
      return;
    }
    console.debug("[sofrim-yamim] purchase failed (non-blocking -- the free app keeps working):", err);
    purchaseErrorEl.textContent = "הרכישה לא הושלמה. נסו שוב.";
    // Unhiding a role="alert" element announces it natively -- no
    // separate announce() call needed (unlike the success path above,
    // which has no equivalent native semantic to lean on).
    purchaseErrorEl.hidden = false;
    setPurchaseButtonState("idle");
  }
}

function refreshPurchaseButton() {
  if (!purchaseBtn) return;
  purchaseErrorEl.hidden = true; // don't carry a stale error across dialog re-opens, matching refreshSettingsDialog()'s own full-recompute pattern (notifications.js)
  if (!digitalGoodsAvailable()) {
    purchaseBtn.hidden = true; // not a TWA -- a purchase could never complete here, don't show a dead-end button
    return;
  }
  purchaseBtn.hidden = false;
  const alreadyOwned = hasRemovedAds();
  setPurchaseButtonState(alreadyOwned ? "done" : "idle");
  if (!alreadyOwned) refreshPurchaseLabelPrice();
}

// index.html's static "$1.99" label is a fallback/placeholder -- Play
// Billing shows the real, region-localized price/currency in the native
// payment sheet itself (built from itemDetails.price at purchase time),
// which won't always be USD. Best-effort sync the visible label to match
// before the user ever taps it, so the Settings row doesn't advertise a
// different number than what the payment sheet actually charges.
async function refreshPurchaseLabelPrice() {
  try {
    const service = await window.getDigitalGoodsService("https://play.google.com/billing");
    const [itemDetails] = await service.getDetails([PRODUCT_SKU]);
    if (itemDetails?.price?.value && itemDetails?.price?.currency && purchaseBtnLabel) {
      purchaseBtnLabel.textContent = `הסרת פרסומות — ${itemDetails.price.value} ${itemDetails.price.currency}`;
    }
  } catch (err) {
    console.debug("[sofrim-yamim] could not fetch live price, keeping the static label:", err);
  }
}

purchaseBtn?.addEventListener("click", purchaseRemoveAds);
document.addEventListener("sofrim-yamim:settings-opened", refreshPurchaseButton);
