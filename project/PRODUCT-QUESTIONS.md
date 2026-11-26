# Product questions

Open questions about what the product should be. They record use cases and hypotheses, not decisions. Mark an item resolved only with evidence from real users.

## Single-place, single-timeline need (Nov 26, 2026, from a history teacher's reply)

A teacher who received the WWII/Holocaust list replied that she teaches the Nazi rise to power in Germany through legislation, with an event almost every month of 1933, and asked whether the map reaches that level of detail. She also teaches Italian unification.

What we assumed vs what she asked:

- We assumed people compare several timelines side by side. She wants one timeline.
- We focused on the map. Her topic is one place (Germany, one parliament), so a map adds little.
- Month resolution was missing. Added: optional `month` on events; timelines spanning 3 years or less with a month step by month (see `schema/event-list-v1.schema.json`).

Open questions:

1. Why doesn't she use an existing timeline maker with no map? Ask her. Candidate answers: speed of building, Hebrew/RTL, sourced events, showing it in class, or she did not look.
2. Do we serve a timeline without a map? Existing tools probably cover the plain case. But users are already in our system, so offering it may still be worth it.
3. Our novelty is the map. Is a single timeline without comparison also part of the product? His current view: yes.
4. If yes, how: a timeline-only view in the app, or timelines carried through an export (see EXPORT01 in BACKLOG.md: print/image export, timeline-only view, embedding)?
5. How would she present it (screen or projector, phone, print, image in a slide) and what must each event show (date, short text, source, image)? Her answers should drive the design.

Existing timeline tools (general purpose, none checked in depth for Hebrew/RTL or free-plan limits):

- TimelineJS (Knight Lab): https://timeline.knightlab.com/
- Tiki-Toki: https://www.tiki-toki.com/
- Sutori: https://www.sutori.com/en/
- Timetoast and TimeGlider (see roundups below)
- MindOnMap timeline creator: https://www.mindonmap.com/he/timeline-creator/
- Roundups: https://www.educatorstechnology.com/2022/07/history-timeline-for-teachers.html , https://blog.uvm.edu/ctl-timelines/tools/ , https://www.lilachbullock.com/free-timeline-makers/

Existing sources for the 1933 topic (non-interactive timelines): Yad Vashem timeline https://www.yadvashem.org/he/holocaust/resource-center/timeline.html , USHMM "1933: Key Dates" https://encyclopedia.ushmm.org/content/en/article/1933-key-dates

## ניתוח שימוש ברשימות (לא נבנה)

- היום ה-analytics ב-PostHog משתמש רק במאפיינים קבועים; ערכים חופשיים אסורים בעיצוב.
- כדי לדעת אילו רשימות נפתחות צריך אירוע `list_view` עם מפתח הרשימה.
- אפשרות א: רשימת מפתחות מותרים (allowlist) שנוצרת מהקטלוג, בלי שרת. נשארת אנונימית ותחומה. מבחן בודק שהרשימה שווה למפתחות הקטלוג.
- אפשרות ב: שרת שאוסף ערכים חופשיים. משטח פרטיות גדול יותר ותחזוקה.
- המלצה: אפשרות א, וספירה רק בבחירה או פתיחה מפורשת של רשימה.
