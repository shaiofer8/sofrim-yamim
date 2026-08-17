# Pain Points Research — Round 1

Scope: broad mapping queries (~5 words), English + Hebrew, on countdown/day-counter apps and Hebrew-calendar apps.

## Findings

- **"Time Until: Countdowns, Widget" (Google Play) forces users to watch an ad — often for Temu — when editing/creating a new countdown, and users call this "annoying."** [Source: Google Search result synthesis of Google Play "Time Until: Countdowns, Widget" listing (com.brunoschalch.timeuntil), accessed 2026-08-17, https://play.google.com/store/apps/details?id=com.brunoschalch.timeuntil&hl=en_US]. Confidence: medium (quote surfaced via search snippet, not independently re-verified by direct page read — direct fetch of the Play listing failed to return review text). Class: pain-point.

- **The same app limits free users to 6 countdowns and only offers ad removal via a monthly subscription that reviewers call "way too high," with no one-time purchase option to remove ads and unlock limits.** [Source: Google Search result synthesis of Google Play "Time Until: Countdowns, Widget" listing, accessed 2026-08-17, https://play.google.com/store/apps/details?id=com.brunoschalch.timeuntil&hl=en_US]. Confidence: medium. Class: pain-point / feature-request (directly relevant: validates demand for a one-time "remove ads" IAP instead of subscription).

- **"Day Counter. Count Up & Down" (Google Play, com.bitsens.daytracker) users report the home-screen widget is "useless" and that they cannot find a way to modify the widget to select which timer/countdown it displays.** [Source: Google Search result synthesis of Google Play "Day Counter. Count Up & Down" listing, accessed 2026-08-17, https://play.google.com/store/apps/details?id=com.bitsens.daytracker&hl=en_US]. Confidence: medium. Class: pain-point.

- **Hebrew-language calendar apps "הלוח העברי" (3M+ downloads) and "לוח שנה עברי" (developer Kobi Snir) both draw reviewer complaints about an "unreasonable amount of ads" ("כמות בלתי סבירה של פרסומות") and ads appearing "at every step of using the app" ("בכל צעד").** [Source: Google Search result synthesis covering Apple App Store listings for "הלוח העברי - לוח שנה יהודי" and "לוח שנה עברי," accessed 2026-08-17, https://apps.apple.com/il/app/%D7%94%D7%9C%D7%95%D7%97-%D7%94%D7%A2%D7%91%D7%A8%D7%99-%D7%9C%D7%95%D7%97-%D7%A9%D7%A0%D7%94-%D7%99%D7%94%D7%95%D7%93%D7%99/id356559317?l=he]. Confidence: medium. Class: pain-point. Note: adjacent category (Hebrew/Jewish calendar, not countdown), but same publisher-population as Sofrim Yamim's target users.

- **Users of mainstream Hebrew calendar apps report difficulty setting recurring annual events pinned to the Hebrew date (e.g. yahrzeit/memorial days, Hebrew-calendar birthdays) — this is called out as a distinct, unresolved friction point separate from the ads complaint.** [Source: Google Search result synthesis of Hebrew calendar app searches, accessed 2026-08-17, general query "אפליקציה לוח שנה עברי חגים ביקורות"]. Confidence: low-medium (single-round synthesis, not yet traced to a specific quoted review — see Round 3 for corroboration via editorial sources). Class: pain-point / feature-request.

## Leads

- Strong signal that "no one-time purchase to remove ads" is an explicit, named complaint on a leading countdown app — worth stress-testing against Sofrim Yamim's planned one-time IAP pricing model (this looks like direct differentiation ammunition).
- The Hebrew-date recurring-event gap (yahrzeit, Hebrew birthdays) looks like the most promising "underserved niche" thread — needs primary-source corroboration in Round 2/3, ideally from Play Store reviews or Hebrew tech press, not just search synthesis.
- Widget reliability is a recurring named complaint theme across at least 2 unrelated apps already (Time Until implicitly via ads-on-edit; Day Counter's unusable widget) — worth tracking as a cross-app pattern in Round 2.
- Named apps still needing direct investigation per brief: "Countdown Star," "ChronoLite," "Day Counter" — not yet covered in Round 1.

## Could not find

- Could not retrieve actual Google Play review text (reviewer name, star rating, date) via direct WebFetch of Play Store listing URLs — Play Store review sections are JavaScript-rendered and returned only navigation/header content, not review bodies. All Round 1 findings are Google-Search-synthesized snippets referencing the listing, not independently re-read primary text.
- No direct evidence yet, in Round 1, of RTL-rendering bugs or Hebrew-mistranslation complaints specifically inside a countdown/day-counter app (as opposed to a general Hebrew calendar app).
