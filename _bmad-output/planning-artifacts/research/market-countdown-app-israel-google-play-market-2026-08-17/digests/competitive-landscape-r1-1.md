## Findings

- **The global countdown/event-counter app category on Google Play is large, mature, and fragmented across many small indie titles rather than dominated by one or two players** — broad search surfaced at least 9 distinct actively-marketed apps (Time Until, Countdown to Anything, Days To, Final Countdown, Countdown Widget [me.gira], Countdown Days App & Widget [smsr], Big Days, Countdown Time - Event Widget, Countdown Widget [cg.android]). [Source: Google Search results aggregating Play Store listings, accessed 2026-08-17, https://play.google.com/store/apps/details?id=com.brunoschalch.timeuntil and sibling listings]. Confidence: high. Class: competitor.

- **"Countdown to Anything" (com.jupli.countdowntoanything) is a leading global countdown app**, free with icons for birthdays/holidays/weddings/baby due dates, praised in reviews for a full-featured free tier. [Source: Google Play, "Countdown to Anything", accessed 2026-08-17, https://play.google.com/store/apps/details?id=com.jupli.countdowntoanything&hl=en_US]. Confidence: medium (store-listing marketing copy, stats not yet confirmed at time of writing this digest — see round 2 for confirmed numbers). Class: competitor.

- **"Time Until: Countdowns, Widget" (com.brunoschalch.timeuntil) markets itself broadly as a countdown timer / past-event tracker for holidays and personal milestones**, with home-screen widgets as a core feature. [Source: Google Play, "Time Until: Countdowns, Widget", accessed 2026-08-17, https://play.google.com/store/apps/details?id=com.brunoschalch.timeuntil&hl=en_US]. Confidence: medium (listing description; numeric stats confirmed in round 2). Class: competitor.

- **No dedicated, purpose-built "Israeli/Jewish-holiday countdown" app surfaced in either English or Hebrew Play Store searches.** Hebrew-language queries ("ספירה לאחור אפליקציה עברית", "ספירה לאחור לחגים אפליקציה") returned only generic countdown/timer apps (mostly non-Israeli developers, Hebrew-localized store listings only) — e.g. "ימי ספירה לאחור", "ספירה לאחור כרונומטר & יישומון", "ספירה לאחור - ספירת ימים", "ספירה לאחור בסטטוס בר Pro", "Big Days". None of these are built around Jewish/Israeli holidays specifically. [Source: Google Search (site: play.google.com via Hebrew queries), accessed 2026-08-17]. Confidence: medium (absence-of-evidence claim from search coverage, not exhaustive). Class: competitor/substitute gap.

- **Hebrew calendar apps exist as an adjacent category** (not countdown-specific) that could compete for the same attention/budget: "לוח שנה עברי לועזי" (com.kiki.hebrewcalendar) and "לוח שנה עברי" (com.kobisnir.hebrewcalendar) both surfaced, offering Hebrew/Gregorian date conversion, Shabbat times, and Jewish holiday display — adjacent substitutes rather than direct countdown competitors. [Source: Google Play search results, accessed 2026-08-17, https://play.google.com/store/apps/details?id=com.kiki.hebrewcalendar and https://play.google.com/store/apps/details?id=com.kobisnir.hebrewcalendar]. Confidence: medium (listing existence confirmed; traction data pending, see round 2). Class: competitor.

- **Google Calendar itself has a built-in Hebrew calendar overlay** (Settings > Alternative Calendar > Hebrew), which syncs across Android and shows Hebrew dates, holidays, and Torah portions — a zero-cost, pre-installed substitute requiring no new app download. [Source: Google Search result summarizing Google Calendar settings documentation, accessed 2026-08-17, referenced via query "לוח שנה עברי אפליקציה אנדרואיד"]. Confidence: low (search-engine-synthesized summary, not a directly fetched primary Google support page in this round — recommend re-verification). Class: substitute.

## Leads

- Need confirmed install/rating/last-update numbers for: Time Until, Countdown to Anything, Days To, Final Countdown, Countdown Days App & Widget (smsr), Countdown Widget (me.gira), Big Days — pursued in round 2 via direct Play Store fetch.
- Need to determine whether com.kiki.hebrewcalendar is still live on Google Play (initial direct fetch attempts 404'd) — possible delisting, worth confirming in round 2.
- WebFetch against play.google.com URLs returns truncated/incomplete content directly; a text-proxy (r.jina.ai) route was found to work for retrieving full listing text — used in round 2.
- No direct evidence yet on: WhatsApp group reminders, physical planners, or "do nothing" as competing behavior for Israeli holiday-tracking specifically — flagged for round 2 or another dimension.
- No funding/acquisition/job-posting evidence gathered yet for any competitor's developer — flagged for round 2.

## Could not find

- Could not find any Play Store listing framed explicitly around Jewish/Israeli holiday countdown (e.g. "days until Rosh Hashanah/Pesach app") in either English or Hebrew search — this may itself be a market-gap signal, but is an absence-of-evidence finding, not confirmed by direct enumeration of the full Play Store catalog.
- Could not find concrete install/rating numbers in this round (search snippets did not reliably surface them; deferred to round 2 direct-fetch approach).
