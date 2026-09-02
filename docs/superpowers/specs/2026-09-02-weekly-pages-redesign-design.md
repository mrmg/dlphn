# Weekly pages redesign (Year 4, Reception, Gallery)

Date: 2026-09-02. Site: https://dlphn.app (Firebase project `dolphin-thursday`, Vite multi-page build, `dist/` committed and deployed).

## Design read

Reading this as: redesign-preserve of a family "what's on this week at school" poster site, for two parents and two kids, with a playful-premium dark language, leaning toward native CSS + a self-hosted geometric sans (Outfit) + restrained motion.

Dials (taste-skill): current site reads roughly VARIANCE 3 / MOTION 2 / DENSITY 5. Target: VARIANCE 4 / MOTION 4 / DENSITY 4. Preserve mode: same routes, same nav labels, same data contracts.

## Audit of the current pages

Brand tokens today: Inter loaded from Google, purple-navy gradient surfaces (`#1a1a3e` to `#0f0f2a`), gold accent on the Year 3 page and green on Reception, emoji for weather, chips and nav icons, a side "tab" toggle for the project hub, 400 lines of CSS and JS duplicated between `index.html` and `reception.html`.

Functional defects found:

- `/reception` has no Firebase rewrite, so production falls through to the `**` catch-all and serves the Games page. The Reception page is unreachable on the live site.
- The Year 3 / Reception switch is `display:none` on the home page, so there is no way to reach Reception from `/`.
- `dist/index.html` is newer than `index.html` (the weekly update wrote the 6-12 July data, image and chip rules straight into `dist`). Three poster images and `data.json` exist only in `dist` and would be wiped by the next `vite build`.
- Weekly pages have no favicon links, description or Open Graph tags.
- On mobile the day strip shows four of seven days and never scrolls to today.
- Zoom and nav code are copy-pasted per page.

## Decisions

### Scope

Redesign `index.html` (Year 4 and Reception views) and `gallery.html` with shared styles and scripts; retire `reception.html`. Fix routing. Preserve the weekly-update contract. Leave games, card, horrid, kids-vs-parents, half-term-fighter, ideas and the swimming page untouched.

### One page, URL-selected year group

Year 4 and Reception are views of the same page, never mixed by default:

- `/` shows Year 4.
- `/?reception` or `/#reception` shows Reception instead (aliases `rec`).
- Naming both, for example `/?year4&reception`, is the optional extra: both day strips stack under the shared poster, each with a small title row. This is URL-only and not offered in the dropdown.
- `/reception` (the old separate page) 301-redirects to `/?reception`.

A `<details>`-based dropdown in the header next to the wordmark shows the current view and offers Year 4 and Reception. Clicking an option updates the URL with `pushState` and re-renders without a reload; plain links still work without JavaScript. Back/forward and hash changes re-render. Year 3 is gone everywhere.

### Visual system

- Font: Outfit variable (400-700), self-hosted under `public/fonts/`, `font-display: swap`, tabular numerals for dates and temperatures.
- Surfaces: one cool navy family. `--bg #0b1120`, `--bg-2 #111a2e`, `--bg-3 #18233b`, hairlines at 8 percent white. No purple gradient. A faint accent-tinted radial wash at the top of the page breaks the flatness.
- Accent: one per page, set as a CSS variable on `<body data-year>`. Year 4 keeps its gold heritage as a desaturated amber `#f2c14e`. Reception uses mint `#7ad6a8`. The accent appears on the year pill, the today column and current-page states only.
- Chip colours stay semantic (kit, school, kids, parents, birthday; forest, PE, music, French, event for Reception) but are unified to one desaturated palette on translucent fills.
- Radius scale: containers 14px, controls 10px, chips pill.
- Motion: 240ms `cubic-bezier(.16,1,.3,1)`. Poster fades in on load, chips rise in with a 40ms stagger, the menu sheet slides with staggered links, buttons scale on press. All animation is disabled under `prefers-reduced-motion`.
- Icons: Phosphor (regular weight) SVG markup inlined for menu, close, caret, gallery, arrows. No emoji in the chrome. Weather emoji remain because they are data written by the weekly update.
- No em or en dashes in strings the site controls. Date ranges use a hyphen.

### Layout

Header, 64px desktop and 56px mobile: wordmark "Dolphin School" plus the year dropdown on the left, week badge (label plus date range as plain text) and a menu button on the right.

Poster: fills the remaining height. In landscape containers the poster is shown whole (contain) over a blurred, dimmed copy of itself. In portrait it covers and can be panned, as today. Pinch, double-tap and double-click zoom are kept. A gallery button sits bottom-right on the poster.

Day cards (revised 2026-09-02 after feedback that the first pass was too conservative): the bottom bar is a row of seven cards on a translucent surface with a hairline and inner highlight. Each card has the day and date, a weather block (Phosphor weather icon in a tinted square mapped from the emoji or condition text, plus a large temperature) and the day's activities as icon-led rows, one Phosphor glyph per activity chosen from the label (swimming, kit, forest school, music, French, birthday, party, cricket, lunch, times, last day, trips) with the colour class as fallback. Today's card is wider, accent-tinted and carries a "Today" tag. Weekend cards are narrower and quieter. Weekdays with nothing on say "Nothing on". On mobile the row scrolls horizontally with snap, two cards visible, auto-centred on today.

Canvas: the page background is a deep ocean gradient with a fixed film-grain overlay, the header is transparent, and the poster sits in a rounded, framed panel with a soft shadow.

Menu sheet: a right-hand panel replaces the floating side tab. Groups: "This week" (Year 4, Reception, Gallery) and "Projects" (Card, Games, Horrid, Swimming, Kids vs Parents, Half Term Fighter, Ideas). Backdrop click, close button and Escape close it. Focus moves into the sheet on open and back to the button on close.

Gallery: same header with a "This week" back link. Grid of poster figures at 3:2 with captions below the image. The most recent poster spans two columns on wide screens. Clicking opens a native `<dialog>` lightbox with previous and next controls, keyboard arrows and Escape.

### Data contracts preserved for the weekly update

- `index.html` keeps a classic (non-module) inline `<script>` holding `WEEK_DATA` in the same shape as today (`year`, `startMonth`, `startDay`, `weekLabel`, `days[]` with `name`, `date`, optional `month`, `weather`, `temp`, `activities[]`). Vite leaves classic inline scripts untouched, so editing `dist/index.html` still works.
- The chip classification regexes move into a `CHIP_RULES` array in the same inline script so they remain editable.
- Element ids `weekBadge`, `dateRange`, `zoomImg` and `dayStrip` are unchanged.
- `weekLabel` of a single letter renders as "Week A"; any other string (for example "Half Term") renders verbatim. The old hard-coded May half-term check is removed.
- `gallery.html` keeps the inline `posters` array.
- The Reception timetable and Week A reference date live in the same inline script block in `index.html`.
- `public/data.json` and the three dist-only posters are copied into `public/` so builds no longer destroy them.

### Routing

- `firebase.json`: 301 redirect `/reception` to `/?reception`.
- `vite.config.js`: dev and preview middleware redirects `/reception` the same way and maps `/gallery`, `/games`, `/ideas` to their HTML files so clean URLs work locally.

### Files

- `src/site.css`: tokens, fonts, header, dropdown, poster, day strip, sheet, gallery, lightbox, responsive rules.
- `src/site.js`: icons, menu sheet, year dropdown, zoom, day rendering, URL view selection, Reception timetable and weather merge, week-page bootstrap.
- `index.html`, `gallery.html`: new markup using the shared modules.
- `firebase.json`, `vite.config.js`: routing.

### Verification

- `npm run build` succeeds and `dist/index.html` still contains the editable `WEEK_DATA` block.
- Playwright screenshots of `/`, `/?reception`, `/?year4&reception` and `/gallery` at 1440x900 and 390x844 against `vite preview`, including the open dropdown and menu sheet.
- Firebase hosting emulator confirms `/reception` redirects to `/?reception`.
- Grep the three pages for em and en dashes in site-controlled strings.

### Out of scope

Deploying to Firebase (left for the owner), the games and project sub-apps, a new poster for September, light mode (the posters are designed for a dark frame and the site has always been dark).

## Revision 2026-09-02 (evening): header switch, scoped menu, per-year posters

- The header dropdown is replaced by a segmented control (Year 4 | Reception) with a sliding accent thumb. It switches the view in place on both the weekly page and the gallery.
- The menu sheet is rebuilt on every view change and scoped to the year group: a "Year group" switcher with a check on the current one, a "This week / Poster gallery" pair for that year, and a "<Year> projects" list. Reception has no projects yet and says so.
- Posters are per year group. The `<img id="zoomImg">` stays the Year 4 poster (weekly-update contract). `RECEPTION_POSTER` in the inline block supplies the Reception poster, or `null` for an empty panel.
- The gallery is per year group: `/gallery` is Year 4 (`posters`), `/gallery?reception` is Reception (`receptionPosters`), each with its own empty state.
- `RECEPTION_DAY_OVERRIDES` (added by the weekly update) replaces the recurring timetable for specific dates.
