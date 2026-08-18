// Monetization (Epic 3). Loaded last (AD-1) -- may reference globals
// defined in app.js/notifications.js, never the reverse.

// AD-4: purchase state lives in its own dedicated localStorage key, never
// mixed into the events key. Shape: { adsRemoved: boolean, verifiedAt:
// ISO-timestamp }. Story 3.2 (not yet built) is what actually writes
// this after a successful Payment Request API + Digital Goods API flow;
// for now (Story 3.1) this is read-only, always resolving to "no
// purchase" until that story exists.
const PURCHASE_KEY = "sofrim-yamim.purchase.v1";

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
