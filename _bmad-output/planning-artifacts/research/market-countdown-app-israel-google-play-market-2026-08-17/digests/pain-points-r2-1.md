# Pain Points Research — Round 2

Scope: sharpened queries after Round 1 harvest — direct-fetch attempts on Play Store/aggregator pages (mostly blocked), followed by targeted searches on ads/notifications, Hebrew-calendar ads, and named apps from the brief (Countdown Star, ChronoLite).

## Findings

- **Ad-related complaints recur across multiple, unrelated countdown/countdown-widget apps: "way too many ads," "you get an ad if you click anything," "Ads ads ads," and one app charging $15/week to remove ads.** [Source: Google Search result synthesis across several Google Play "Countdown Widget"-family listings, accessed 2026-08-17, https://play.google.com/store/apps/details?id=me.gira.widget.countdown&hl=en]. Confidence: medium (pattern corroborated across ≥3 distinct app listings surfaced in the same search, not a single anecdote). Class: pain-point.

- **A "Countdown Widget" app drew a review stating the app was "held hostage by invasive ads that won't close," with the reviewer saying they "didn't even get to see the app" before giving up.** [Source: Google Search result synthesis of Google Play "Countdown Widget" listing, accessed 2026-08-17, https://play.google.com/store/apps/details?id=com.cg.android.countdown&hl=en]. Confidence: medium. Class: pain-point.

- **A different "Countdown Widget" app drew a 1-star review describing notification spam: after unlocking a 4x4 widget via a rewarded ad, the app pushed a notification "every 5 seconds," and tapping it forced another ad before "doing nothing"; the reviewer wrote "I couldn't block it and if I tried to turn it off the app wouldn't work" and gave "1 star and delete."** [Source: Google Search result synthesis of a Google Play Countdown Widget listing, accessed 2026-08-17, search query "countdown app Play Store 1 star ads notification"]. Confidence: medium (specific, quoted, but not independently re-verified by direct page read). Class: pain-point.

- **"Time Until: Countdowns, Widget" ad complaint from Round 1 is corroborated again in Round 2 via an independent query: "ads are now annoying," ads shown are "often Temu" branded, forced when editing a countdown.** [Source: Google Search result synthesis, Google Play "Time Until: Countdowns, Widget," accessed 2026-08-17, https://play.google.com/store/apps/details?id=com.brunoschalch.timeuntil&hl=en_US]. Confidence: medium — now meets 2-source rule via two independently issued search queries returning the same quoted phrasing. Class: pain-point.

- **"Countdown Star" (com.joemerrill.android.countdownstar), one of the brief's named apps, holds a comparatively strong 4.19-star rating (~1.6K reviews) and is generally praised for simplicity and customizable backgrounds — but a review notes the Android version has fewer features than iOS, specifically lacking a widget and an auto-sorting events list that iOS has.** [Source: Google Search result synthesis of AppBrain "Countdown Star" page and Google Play listing, accessed 2026-08-17, https://www.appbrain.com/app/countdown-star/com.joemerrill.android.countdownstar and https://play.google.com/store/apps/details?id=com.joemerrill.android.countdownstar&hl=en_US]. Confidence: low-medium (single review mention, direct AppBrain fetch was blocked with 403). Class: feature-request.

- **"ChronoLite," one of the apps named in the brief, could not be located as a distinct, identifiable app in either English or Hebrew search results** — searches surfaced only a differently-named app ("Chrono Countdown") with no relation established. Confidence: n/a. Class: other (see Could not find).

- **Hebrew-language calendar app "לוח שנה עברי לועזי" and related Hebrew calendar apps show "mixed" reviews: some users complain about advertisements interrupting calendar use ("פרסומות מרובות שמפריעות"), while others find the app "very useful, pleasant and easy to use" for Torah study/prayer times.** [Source: Google Search result synthesis, query "לוח שנה עברי לועזי ביקורות פרסומות," accessed 2026-08-17, https://www.kipa.co.il/%D7%9C%D7%95%D7%97-%D7%A9%D7%A0%D7%94/]. Confidence: medium — corroborates the Round 1 finding on the same app category from an independent query. Class: pain-point.

## Leads

- The ads-complaint pattern is now corroborated across at least 5 distinct app listings (Time Until, two different "Countdown Widget" apps, general countdown app search, Hebrew calendar apps) spanning both the target category (countdown) and the adjacent category (Hebrew calendar) — this looks like the single strongest, most cross-app-corroborated pain point so far, and squarely supports Sofrim Yamim's planned "banner ads only, no forced rewarded-ad interruptions" positioning.
- Android-vs-iOS feature parity gap noted for Countdown Star (no widget, no auto-sort on Android) — since Sofrim Yamim is Android-only (Google Play/TWA), this is not a direct competitive threat but confirms Android countdown-app users are already primed to expect widgets and auto-sorted event lists as baseline features.
- Direct primary-source fetching of Google Play / App Store review sections is consistently blocked (403/404, or JS-rendered content not captured) — every finding to date is a Search-engine synthesis of listing pages, not a directly re-read primary page. This is a methodological limitation to flag prominently, not a gap in the underlying pattern (the same quotes recur verbatim across independently phrased queries, which is the available corroboration substitute).
- Still no direct evidence of RTL/Hebrew-translation-specific bugs inside a countdown app (as distinct from ad complaints on Hebrew calendar apps) — carrying this open question into Round 3.

## Could not find

- Could not directly fetch review content from: Google Play "Time Until" listing (returned only nav/header), justuseapp.com Countdown App reviews page (403), unstar.app Countdown negative-reviews page (403), Google Play "לוח שנה עברי לועזי" listing (404), mako.co.il calendar-apps article (400), AppBrain Countdown Star page (403).
- No app matching "ChronoLite" was found under that name on Google Play or the App Store.
- No RTL-rendering-bug-specific complaint found yet for any countdown app (English or Hebrew source).
