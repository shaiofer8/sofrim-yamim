// Monetization (Epic 3). Loaded last (AD-1) -- may reference globals
// defined in app.js/notifications.js, never the reverse.

// 2026-08-22, שי: הוחלט להשבית מונטיזציה לגמרי בזמן בדיקות-הבודקים --
// גם באנר הפרסומות (ממילא מוסתר כרגע, ר' isPlaceholderAdClient למטה) וגם
// כפתור הרכישה (שכן מוצג בפועל בטלפון אמיתי דרך Digital Goods API,
// למרות שאין עדיין AdSense אמיתי -- שני מנגנונים נפרדים). המטרה: פונקציונליות
// מלאה וחינמית לבודקים בשלב הזה, בלי שום משטח-מונטיזציה גלוי. דגל יחיד,
// לא תיקון-קוד פזור -- להחזיר ל-true כשרוצים להפעיל מונטיזציה מחדש.
const MONETIZATION_ENABLED = false;

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
const adInsEl = adBannerEl?.querySelector("ins.adsbygoogle");

// True until index.html's placeholder ca-pub-0000000000000000 is replaced
// with a real AdSense client id. Found the hard way: calling push({}) for
// this slot doesn't just silently fail the ad *request* (the pre-existing
// assumption below) -- the adsbygoogle.js SDK still actively manages the
// <ins>'s container sizing while it tries, and sets its own inline
// `!important` height on #ad-banner itself based on that guess. With no
// real ad ever able to fill, that guess has nothing real to size against
// and reserved ~390px (most of the screen) on a real device -- no CSS
// max-height can win against an inline !important set by someone else's
// script. Skipping push() entirely for the placeholder id is the actual
// fix: the SDK never touches the slot's sizing if it's never asked to
// fill it.
const isPlaceholderAdClient = adInsEl?.dataset.adClient === "ca-pub-0000000000000000";

// Public seam: Story 3.2 (purchase flow) and Story 3.3 (restore-on-
// cold-start) both call this after they change what hasRemovedAds()
// would return, so the banner (and whether an ad gets requested at all)
// updates immediately without a page reload.
function refreshAdBanner() {
  if (!adBannerEl) return;
  if (!MONETIZATION_ENABLED) {
    adBannerEl.hidden = true;
    return;
  }
  const removed = hasRemovedAds();
  adBannerEl.hidden = removed || isPlaceholderAdClient;
  if (!removed && !isPlaceholderAdClient) {
    // The <ins> markup is static, but *requesting* an ad into it is not
    // -- a paying user (once Story 3.2 exists) should never cause this
    // network/battery cost just because the hidden slot still exists in
    // the DOM. Each push() asks AdSense to fill one ad slot; calling it
    // more than once for the same <ins> is harmless (a no-op) but there's
    // no need to either, so this only ever runs on the visible path.
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.debug("[sofrim-yamim] adsbygoogle push failed (non-blocking):", err);
    }
  }
}

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

// The purchase flow needs both APIs; the restore check (below) only ever
// calls listPurchases() -- gating it on PaymentRequest too would risk
// skipping a valid restore in a hypothetical environment that exposes
// Digital Goods without also exposing Payment Request.
function digitalGoodsServiceAvailable() {
  return "getDigitalGoodsService" in window;
}

function digitalGoodsAvailable() {
  return digitalGoodsServiceAvailable() && "PaymentRequest" in window;
}

// Set for the duration of an actual purchase attempt (native payment
// sheet potentially open) so a concurrently-resolving restorePurchases()
// (below) never clobbers the "pending" button UI underneath it.
let purchaseInProgress = false;

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
  if (!MONETIZATION_ENABLED || !digitalGoodsAvailable() || !purchaseBtn) return;

  purchaseInProgress = true;
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
  } finally {
    purchaseInProgress = false;
  }
}

function refreshPurchaseButton() {
  if (!purchaseBtn) return;
  if (!MONETIZATION_ENABLED) {
    purchaseBtn.hidden = true;
    return;
  }
  if (purchaseErrorEl) purchaseErrorEl.hidden = true; // don't carry a stale error across dialog re-opens, matching refreshSettingsDialog()'s own full-recompute pattern (notifications.js)
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

// Story 3.3 / AD-4: restore on every cold start (and again whenever the
// app returns to the foreground -- a purchase can complete via Play
// while this PWA instance sits backgrounded) -- a user with a valid
// purchase on a new device/reinstall must not have to buy again just
// because sofrim-yamim.purchase.v1 is empty there. listPurchases() asks
// Play directly instead of trusting the local cache alone. This is also
// the real fix for Story 3.2's deferred "already owned" retry problem: a
// failed purchase attempt for an already-owned SKU self-corrects the
// next time the app cold-starts, without needing special-case handling
// in the purchase flow itself.
//
// Only requires the Digital Goods half of digitalGoodsAvailable() --
// this never opens a payment sheet, so it doesn't need PaymentRequest.
//
// ⚠️ Same real-device caveat as the purchase flow above: `owned` here
// treats *any* listPurchases() entry matching PRODUCT_SKU as fully
// owned, with no handling of a PENDING (not yet finalized) entry --
// unverified against a real device, see deferred-work.md.
let restoreCheckInFlight = false;

async function restorePurchases() {
  if (!digitalGoodsServiceAvailable()) return;
  if (restoreCheckInFlight) return; // cold-start + a rapid visibilitychange could otherwise race
  restoreCheckInFlight = true;
  try {
    const service = await window.getDigitalGoodsService("https://play.google.com/billing");
    const purchases = await service.listPurchases();
    // listPurchases() is documented to return only currently-valid
    // purchases (a cancelled/refunded one wouldn't appear) -- for this
    // app's single non-consumable SKU, presence alone means "owned."
    const owned = Array.isArray(purchases) && purchases.some((p) => p?.itemId === PRODUCT_SKU);
    if (owned && !hasRemovedAds()) {
      savePurchaseState(true);
      if (typeof announce === "function") announce("הפרסומות הוסרו."); // same outcome as a manual purchase (Story 3.2) -- same announcement, in case this resolves while the user isn't even looking at Settings
    }
  } catch (err) {
    // Silent per AD-6-style convention: this is a background
    // reconciliation check, never a blocker for anything else in the app.
    console.debug("[sofrim-yamim] restorePurchases failed (non-blocking):", err);
  } finally {
    restoreCheckInFlight = false;
  }
}

// Cold start: restorePurchases() runs BEFORE the *first* refreshAdBanner()
// call, per AD-4/epics.md's explicit requirement that the restore check
// must settle before the banner's show/hide decision is finalized, so a
// returning user doesn't see a flicker of an already-purchased banner.
// This is cheap for the vast majority of users (no Digital Goods API at
// all -- digitalGoodsServiceAvailable() short-circuits synchronously);
// only real TWA users, who this exists for, actually wait on a
// listPurchases() round-trip.
(async () => {
  await restorePurchases();
  refreshAdBanner();
})();

// Foreground return: re-check (a purchase could complete via Play while
// this PWA sits backgrounded), then refresh both seams -- but never
// clobber the purchase button while an actual purchase attempt has a
// native payment sheet potentially still open (purchaseInProgress).
document.addEventListener("visibilitychange", async () => {
  if (document.visibilityState !== "visible") return;
  await restorePurchases();
  refreshAdBanner();
  if (!purchaseInProgress) refreshPurchaseButton();
});

// 2026-08-22: עם NOTIFICATIONS_ENABLED (notifications.js) ו-
// MONETIZATION_ENABLED (למעלה) שניהם false, דיאלוג ההגדרות התרוקן לגמרי
// (רק כותרת + כפתור-סגירה) -- מסתירים את כפתור ⚙️ עצמו במקום להשאיר
// דיאלוג-ריק. חי כאן (הקובץ האחרון בסדר-הטעינה, AD-1) כי זה הקובץ היחיד
// שרואה את שני הדגלים; אם אחד מהם יחזור ל-true, הכפתור חוזר להופיע
// אוטומטית -- אין דגל שלישי נפרד לשכוח.
const settingsBtnEl = document.getElementById("settingsBtn");
if (settingsBtnEl && !NOTIFICATIONS_ENABLED && !MONETIZATION_ENABLED) {
  settingsBtnEl.hidden = true;
}
