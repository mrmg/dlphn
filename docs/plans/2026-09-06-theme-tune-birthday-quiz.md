# Birthday band and theme-tune quiz: implementation handoff

Prepared 6 September 2026. This is a repository-specific implementation specification, not an implemented feature. The accompanying artwork is a first pass for owner review. No application source or deployment has been changed by this planning task.

## 1. Outcome and boundaries

Turn the weekly poster into the entrance to a short, satisfying 80s/90s TV-and-film theme-tune quiz. A central play button on the birthday-band photograph opens the quiz within the weekly homepage. Ten short clips, four plausible choices each, one point per correct answer. Aim for most intended players to score 5 or 6 out of 10; verify that with people rather than promising a difficulty level from titles alone.

Build with the app's existing vanilla JavaScript, Vite and CSS. Use a native modal dialog and one HTML audio element. No framework migration, Phaser scene, audio library, login, Firestore writes, leaderboard, MP3 upload service or new public route. Keep the existing Kids vs Parents quiz separate: its parent/kids submissions and Firebase dependency are unnecessary here. Answers in this client-side family game are inspectable; no claim of cheat prevention.

The owner requested a plan and artwork first. A future implementation agent should implement this specification through a locally reviewable, tested feature. Do not deploy or change school dates/events as part of that implementation unless subsequently instructed. Finish the functioning shell and tests even when final MP3s are still pending; clearly report asset readiness separately.

### Working defaults, deliberately editable

- Four musicians: birthday boy with guitar on the left; lead singer front centre; drummer on the right; double keyboard player at the back. This interprets the user's correction from guitar to drums on the right.
- Title: **Name That Theme**. Subtitle: **The birthday edition**. Do not invent the birthday boy's name or exact age.
- Ten questions, four choices, no time limit, unlimited replay of the same excerpt, explicit answer confirmation and immediate answer reveal. Expected session: about 3 minutes, subject to playtesting.
- Initial homepage availability: Year 4 only. Reception and its artwork stay as configured; `views` makes sharing this quiz with Reception a one-line choice later. Combined view uses the existing primary view.
- Week/date association must be chosen by the weekly editor. The current source has 31 Aug-6 Sep 2026; the request could mean that week or the next update. Do not assume the document date is the publication week.
- Final tune selection and excerpt timing remain editorial decisions. The candidate round below is ready for discussion, not a verified audio pack.

## 2. Read these files before coding

Paths are relative to the repository root. Search function names rather than trusting line numbers after edits.

| File / anchor | Verified current behaviour | Implementation implication |
| --- | --- | --- |
| `index.html`: `#poster`, `#zoomWrap`, `#zoomImg`, inline data, module bootstrap | Weekly poster, timetable, year-group configuration | Preserve these IDs and all existing weekly data shapes. Add an optional feature config to the editable classic script. |
| `src/site.js`: `initWeekPage()` | Builds per-view posters, chooses `models[0]`, handles segmented/menu switches, popstate and hashchange | Integrate quiz eligibility here, using the already selected primary view. |
| `src/site.js`: `initZoom()` | Image transforms, pinch/pan, double tap/click; landscape containers contain and portrait containers cover | Add an optional fit policy, defaulting to current behaviour. Birthday artwork requires contain even on portrait screens. |
| `src/site.js`: `initMenu()`, `initChrome()`, `readViews()` | Shared menu and URL handling; menu object has `shut()` internally | Do not add an independent year parser or route manager. Avoid competing Escape/focus behaviour. |
| `src/site.css`: tokens, `.week-page`, `.poster`, `.zoom-wrap` | Outfit font, navy/gold/mint palette; viewport-height layout with hidden body overflow | New dialog needs its own scrolling; quiz controls must be siblings of `.zoom-wrap`. |
| `src/gallery.js`, `gallery.html` | Gallery uses a native dialog; separate `posters` / `receptionPosters` arrays | Follow established dialog styling conventions; gallery images alone do not acquire quiz controls. |
| `kids-vs-parents/src/services/quizService.js` | Four-option ID-based answers, scoring plus Firebase imports | Reuse the idea of stable IDs, not the service import or submission flow. |
| `vite.config.js`, `firebase.json` | Vite multi-page build, Firebase catch-all to Games; `public/` copied into `dist/` | Inline homepage feature needs no rewrites or new build entry. A missing MP3 may return HTML under hosting rewrites. |
| `firebase.json`: headers | Images and MP3s cached for one year | Use new versioned filenames whenever an image or clip changes. |
| `package.json` | `dev`, `build`, `deploy`, `preview`; Playwright already installed, no general test script | Use Node's test runner and a focused Playwright script; avoid an unnecessary test framework. |
| `docs/superpowers/specs/2026-09-02-weekly-pages-redesign-design.md` | History and preserved weekly-editor contracts | Current source wins where the earlier design differs. |

At planning time `git status --short` showed a pre-existing modification to `dist/index.html`. Preserve it. Before running a build, capture a byte-for-byte backup and compare its weekly data with source so a later deployment cannot overwrite an update. A worktree alone does not include uncommitted changes: inspect that difference first. For validation without replacing the working `dist/`, use `npm run build -- --outDir /tmp/dlphn-theme-quiz-build` and preview that output. Never run the `deploy` script as a test.

## 3. Artwork handoff

Preview: `docs/plans/assets/birthday-band-v1.png`. Exact generation prompt: `docs/plans/assets/birthday-band-prompt.txt`. Generated with the built-in image tool. The original remains under the generator's storage; the repository copy is self-contained.

The first pass shows four middle-aged men with matching red T-shirts/shorts, white piping/trainers, a smiling rotund birthday guitarist, birthday hat, singer's rock wig, Ghostbusters cap, Grange Hill cap, two keyboards and neon barn decorations. It is a fictional group, not a likeness of supplied friends. The far-right background portrait reads as a different 80s TV star rather than specifically Hannibal, so refine it if that detail matters. Do not treat this first pass as approved or silently replace the live poster.

For the approved version, export a web-size image to `public/thisweek/birthday-band-v1.webp`, keeping the original preview in docs. Target roughly 1600-1920 pixels wide and <=500 KB, with visibly clean faces and white piping; use a version suffix for revisions. Do not stretch it. Use alt text: “Four men in matching red outfits playing a birthday gig in a neon-lit barn.”

The generated image has no baked-in play button. The app supplies the real control. The entire group must remain visible at the default zoom, including the left guitarist and right drummer. Use contain plus the existing blurred backdrop. Pinch and double-tap zoom still work on the picture outside the quiz control. The play control remains fixed to the poster, not transformed with the image.

## 4. Exact interface behaviour

### Homepage entrance

When eligible, show one `.theme-quiz-launcher` overlay, a sibling of `.zoom-wrap` inside `#poster`. Centre it at 50% / 50%; a roughly 72px circular play button, white icon on a dark translucent surface, clear border and a restrained pink/cyan halo. Under it place “Name That Theme” and “10 TV & film themes. How many do you know?” on a small dark backing that stays legible over red clothing. Avoid covering a face; if inspection of the approved artwork requires it, allow a single poster-specific vertical position token.

Keep the existing bottom-right gallery button. Overlay container uses `pointer-events:none`; the actual button uses `pointer-events:auto` and `touch-action:manipulation`. Minimum touch target 48px; launch button `type=button`, `aria-haspopup=dialog`, `aria-controls=themeQuizDialog`, accessible name “Play Name That Theme”. Do not turn the whole poster into a button. Use `hidden` while ineligible and explicitly support `[hidden]{display:none}` within the scoped styles.

First tap opens the dialog at question one and attempts that clip directly within the same click handler. There is no redundant welcome screen. The launcher later reads “Continue quiz” for an incomplete attempt and “View your score” for a completed one. Reopening does not automatically resume sound.

If optional quiz code/config is absent or invalid, the school page still works. The launcher must not advertise a round that cannot run. In production leave the current poster in place when the feature is disabled.

### Dialog layout and visual treatment

Append a single `<dialog id="themeQuizDialog" class="theme-quiz">` to `body`; use `showModal()` so the school interface becomes inert. Do not place the dialog inside the zoom wrapper. Label it with its visible heading. Style only `.theme-quiz` and `.theme-quiz-*` selectors; no broad button/dialog rules.

Desktop: centred panel max-width 640px, width `calc(100% - 32px)`, max-height `calc(100dvh - 32px)`, 20px radius, 24px interior padding, dark navy background, subtle cyan/pink border details. At <=720px: width `calc(100% - 16px)`, max-height accounting for top/bottom safe areas, 16px radius and padding. Body content scrolls vertically; header and action footer remain reachable. In very short landscape viewports the whole panel may scroll instead of trapping content behind a fixed footer. No horizontal overflow at 320px or 200% zoom.

Use the existing Outfit font and navy surfaces. Keep the school header's gold/mint logic untouched. Quiz-only accent tokens: cyan `#67e8f9`, pink `#f472b6`, success `#86efac`; dark ink on bright buttons. Verify text/focus contrast over actual surfaces. Progress is a simple line or ten markers; do not add a fake audio waveform. At most a gentle control transition using existing duration/easing; no flashing neon. Honour reduced motion.

Question content, in order:

1. Header: “Name That Theme”, small “The birthday edition”, visible close button named “Close quiz”.
2. “Question 1 of 10” and “Score: 0”. Compact progress indicator with accessible value text.
3. Heading “Which TV show or film is this from?”
4. Clip controls: large play/pause button, “Replay from start”, elapsed and total clip time, visual progress. No track title, cover art, filename, artist or answer hint.
5. Four native radio inputs styled as answer cards inside a fieldset/legend. Two columns above 480px, one below. Entire label clickable, min-height 52px, multiline titles never truncated. Selected state is distinct from correct/incorrect state.
6. Footer: “Lock in answer” (disabled until a choice exists), and a secondary “Skip question”.

Selecting a radio only selects it. Locking records it once, stops audio, disables edits and reveals “Correct!” or “The answer was [title]”, with one brief recognition note. Both the chosen wrong option and correct option get text/icon labels, not colour alone. Skip immediately records a skipped answer worth zero, stops playback and reveals the answer. Replace the primary action with “Next question”, or “See my score” on question ten. No automatic advance.

Next question resets clip time and selection and presents “Play clip”; it does not start sound automatically. Unlimited replay always replays exactly the same excerpt, without score penalties. No back navigation to change locked answers. Player may close whenever needed; closing pauses audio and preserves progress.

### Results and sharing

Show score as “6 / 10” and “60%”, with one of these bands: 0-3 “A few deep cuts in there.”; 4-6 “A very respectable trip down memory lane.”; 7-8 “You know your theme tunes.”; 9-10 “Theme-tune royalty.” These are presentation bands, not changes to scoring.

Show correct, incorrect and skipped counts, and expandable answer review with question number, chosen answer / “Skipped”, correct answer and recognition note. Review is text-only in v1, avoiding a second audio controller. Buttons: “Share score”, “Play again”, “Back to this week”. Replay creates a new attempt with the same question order and newly shuffled options; reset only on explicit “Play again”.

Share only on the player's click. Text: `I got 6/10 on Name That Theme! Can you beat me?` plus the current week's homepage URL with its year selection preserved and preview/QA parameters removed. No answers in shared text. Feature-detect native Web Share; treat user cancellation silently. Otherwise copy text if clipboard is available, or show selectable text and a copy instruction. Use the browser sharing/clipboard APIs only from the user action; see [MDN share()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share).

### Accessibility and focus

On opening, focus the question heading with `tabindex=-1`; use native modal focus containment. On next/reveal/results, move focus to the new heading or feedback element once; never steal focus for audio progress. Use a small polite live region for loading/playback error and answer result, not per-second announcements. Native radios provide arrow-key selection. All controls work by Tab and Enter/Space. Close button and Escape use one cleanup path and return focus to the launcher; if it has become hidden after a view change, focus the active year link instead. Keep overlay clicks inside the panel from dismissing it; v1 closes only via the visible close action or Escape. No special browser-back history entry for the dialog.

A native modal dialog provides top-layer display and makes the rest of the document inert; implement its label and focus deliberately. Reference: [MDN dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog). Explanatory text such as “This round uses audio. Play with someone who can listen if that helps.” may sit beneath the controls; do not expose a transcript that gives away the answer before submission. Remove `maximum-scale=1.0` and `user-scalable=no` from this homepage viewport meta so browser zoom is allowed; preserve `viewport-fit=cover`. Retest poster gestures.

## 5. Data and module contracts

Create these narrowly scoped files:

| Path | Responsibility |
| --- | --- |
| `src/theme-quiz/index.js` | One controller: launcher, dialog rendering, interaction and lifecycle. |
| `src/theme-quiz/state.js` | Pure manifest validation, attempt validation, option shuffle, transitions and derived score. No DOM/Firebase. |
| `src/theme-quiz/audio.js` | Owns one HTML audio element, playback state and cleanup. |
| `src/theme-quiz/storage.js` | Guarded localStorage read/write with a memory fallback. |
| `src/theme-quiz/rounds/birthday-tv-film-v1.js` | Bundled static manifest; clip URLs use `/theme-quiz/...`. |
| `src/theme-quiz/styles.css` | Scoped launcher/dialog styles; imported once by the feature. |
| `public/theme-quiz/birthday-tv-film-v1/` | Only prepared final excerpts, named `q01-v1.mp3` ... `q10-v1.mp3`. |
| `scripts/qa-theme-quiz.mjs` | Playwright regression checks and screenshots; real audio fixture for engine validation. |
| `tests/theme-quiz/*.test.js` | Node tests for state, validation and storage. |
| `docs/theme-quiz-editor.md` | Concise next-week setup and audio replacement instructions. |

Static imports of small quiz code/manifest from `site.js` are acceptable for v1; do not load Firebase/Phaser or fetch all MP3s on homepage load. Keep feature initialization isolated with an error boundary so invalid quiz configuration cannot stop the existing weekly render. Avoid asynchronous imports in the first play handler that lose the browser's user activation.

Add to the classic editable block in `index.html`, expose on `window`, and pass as `weeklyQuiz` into `initWeekPage()`:

```js
const WEEKLY_QUIZ = {
  enabled: false, // change only when final artwork + all clips are ready
  weekId: null, // editor sets the weekly Monday: YYYY-MM-DD
  quizId: 'birthday-tv-film-v1',
  views: ['year4']
};
window.WEEKLY_QUIZ = WEEKLY_QUIZ;
```

Resolve `quizId` from a fixed local registry, not from an arbitrary module path. Production eligibility requires enabled=true, a valid manifest marked ready, a configured weekId matching the displayed primary model's Monday, and the primary view in `views`. Compare local calendar date keys, not UTC-converted ISO dates. Base expiry on the displayed week, not the viewer's clock, so a static published week remains internally consistent. If later configured for Reception, derive its displayed Monday from its generated days (Reception is live-date based). A DEV-only `themeQuizPreview=1` may bypass enabled/readiness/week gates for review but must respect the selected view. It must not enable unreleased content in production builds.

Suggested manifest (one fully shaped question; final file has ten):

```js
export const birthdayRound = {
  id: 'birthday-tv-film-v1',
  version: 1,
  status: 'draft', // 'ready' only after editorial/audio validation
  title: 'Name That Theme',
  subtitle: 'The birthday edition',
  poster: {
    src: '/thisweek/birthday-band-v1.webp',
    alt: 'Four men in matching red outfits playing a birthday gig in a neon-lit barn.',
    fit: 'contain'
  },
  questions: [{
    id: 'q01',
    audio: { src: '/theme-quiz/birthday-tv-film-v1/q01-v1.mp3', durationSeconds: 8 },
    options: [
      { id: 'knight-rider', label: 'Knight Rider' },
      { id: 'airwolf', label: 'Airwolf' },
      { id: 'street-hawk', label: 'Street Hawk' },
      { id: 'the-a-team', label: 'The A-Team' }
    ],
    correctOptionId: 'knight-rider',
    explanation: 'That repeating electronic pulse belongs to Knight Rider.',
    difficulty: 'easy'
  }]
};
```

The 8-second value is an example, not a verified crop. Validate unique round/question/option IDs, exactly four distinct labels/options per question, exactly one matching correctOptionId, non-empty title/explanation/URL, same-origin versioned MP3 path and finite positive clip duration (normally 6-12 seconds). All ten entries required for this round's ready status. Invalid manifest disables production launcher and produces a useful development error. Do not render config text with unsanitized innerHTML.

`initThemeQuiz({posterElement, config, round})` returns `{updateContext({primaryView, weekId, eligible}), close(), destroy()}`. Instantiate once during `initWeekPage`, not inside each `render()`. Each existing render computes eligibility, chooses the round poster only when eligible, calls `chrome.poster.setImage(...)`, and updates the controller context. Context changes that alter the active view/week or eligibility close the dialog and pause sound. Repeated renders with identical context must not reset an attempt. Ensure quiz errors cannot block timetable rendering.

Extend `initZoom().setImage(src, alt, emptyText, options = {})` with `options.fit` of `auto` or `contain`, default `auto`. Apply fit options before fitting even when the image URL is unchanged. In `fit()`, `useContain = fitMode === 'contain' || cw / ch >= 1`; reset to `auto` for normal posters. Do not change gallery zoom behaviour. Keep disabled quiz markup/image defaults working without JS.

## 6. State, persistence and audio edge cases

### Attempt model

Question order fixed; shuffle each question's options once per attempt with Fisher-Yates. Store the resulting option-ID order. Never use `sort(() => Math.random() - .5)` or shuffle during render. Scoring compares IDs, never labels or shuffled array indices.

Store under `dlphn:themeQuiz:<round-id>:v<version>`:

```js
{
  schemaVersion: 1,
  roundId: 'birthday-tv-film-v1', roundVersion: 1,
  questionIndex: 0,
  optionOrderByQuestionId: { q01: ['airwolf', 'the-a-team', 'knight-rider', 'street-hawk'] },
  responses: {}, // q01: { optionId:'knight-rider', skipped:false }
  draftOptionId: null,
  completed: false
}
```

Persist selections, locks, skips, next, completion and replay. Derive score and reveal state from validated responses; do not persist a separate mutable score. A locked current question remains on its reveal when reopened/reloaded. An unconfirmed selection survives. Completed attempts reopen at results. Audio always restores stopped at zero. Validate stored permutations against the current manifest, index range, ID membership, contiguous answered prefix, response shape and completion consistency. Corrupt/stale data starts a clean attempt. Changing audio/questions/options/correct answer requires manifest version increment. Title-only typo fixes need not reset progress. localStorage exceptions must fall back to working in-memory play with a quiet “Progress will last until you close this page” message.

Use quiz phases `question`, `revealed`, `results`; keep audio phase separate (`idle`, `loading`, `playing`, `paused`, `ended`, `error`). Closing changes dialog visibility, not quiz phase. Lock/skip is idempotent; double tap cannot score twice. Next works only from revealed. Finish works only after the final locked/skipped response. Score = correct locks / total questions; skips score zero. Never shrink the denominator because a clip failed.

### Audio implementation

One reusable audio element per controller, `preload='none'`, `loop=false`. Do not create one player per question or on every render. Set/load only the current clip when needed. Initial launch may call play synchronously from the click; later playback uses explicit controls. Drive playing UI from the successful play promise/events, not the button click: [MDN HTMLMediaElement.play()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) documents that play can be rejected by browser policy or unsupported media.

Catch `NotAllowedError` with “Tap Play to hear the clip”; unsupported/network failure with “This clip couldn't load. Try again or skip this question.” Retry resets the current media resource and calls play within that retry click. After 12 seconds without playback progress while loading/stalled, offer the same retry/skip choices; this timeout does not lock an answer or advance the question. Stop pending loading timers when playback progresses or controller closes.

Play/pause resumes from current position; Replay pauses, seeks to zero and plays. At ended, display “Play again”. Clamp progress to valid duration; never show NaN/Infinity. Use elapsed/duration from actual media, with manifest duration as a display hint until metadata loads. A simple visual progress bar updates only while playing and is not a seek control in v1.

On answer lock, skip, next, close, results, view/week change, pagehide and visibilitychange to hidden: pause, invalidate any pending play request, clear progress callbacks/loading timers and reset time to zero where appropriate. Reopening always starts at zero. Switching away and returning must never resume automatically. Use a request/generation counter so a late resolved play promise/event from a previous question cannot play sound or alter the current UI. Intentional AbortError after stop/load is not shown as failure. Clean listeners and remove `src`/load on destroy. Test rapid play/close/replay/next specifically.

Export physically trimmed excerpts. Do not serve full theme tracks and rely on currentTime/timeupdate to stop at a guessed endpoint. This eliminates snippet-boundary leakage and keeps downloads small. Strip track-title/artist/album/artwork metadata so OS media interfaces do not reveal answers. Do not set answer-bearing Media Session metadata. Neutral filenames reduce accidental clues but are not security.

A file returning HTTP 200 can still be the Games HTML fallback. QA must check actual decode/playback and MIME/file bytes, not just HEAD success. No background music, sound effects or automatic results fanfare.

## 7. Proposed round for editorial discussion

These are candidates for a UK adult audience familiar with 80s/90s TV and film. They are not claims that specific recordings have been sourced, listened to or calibrated. Clip lengths are starting points; the supplied recording and chosen phrase determine difficulty. Identify the **programme or film**, not composer or song title. Choose original-era title music, not a modern remake, cover, trailer score, dialogue montage or incidental scene cue.

| # | Correct programme/film | Three proposed distractors | Starting excerpt | Intended level / selection reason |
| --- | --- | --- | --- | --- |
| 1 | Knight Rider | Airwolf; Street Hawk; The A-Team | 8 seconds, recognisable synth pulse | Easy opening; all action-series options. |
| 2 | The A-Team | Magnum, P.I.; The Fall Guy; The Dukes of Hazzard | 8 seconds, instrumental title motif without narration | Easy; familiar adventure themes in the same broad TV world. |
| 3 | Beverly Hills Cop | Miami Vice; Fletch; Police Academy | 8 seconds, Axel F instrumental hook | Medium; synth familiarity versus identifying the screen source. |
| 4 | Grange Hill | Byker Grove; Press Gang; The Kids from Degrassi Street | 7 seconds, original familiar title arrangement | Medium; school/youth television. Confirm the actual era/arrangement. |
| 5 | Jurassic Park | E.T. the Extra-Terrestrial; Back to the Future; Hook | 10 seconds, identifiable main theme phrase | Easy; orchestral adventure rather than arbitrary pop distractors. |
| 6 | The Crystal Maze | The Krypton Factor; Interceptor; Treasure Hunt | 8 seconds, theme section without presenter speech | Medium; UK adventure/game-show memory. |
| 7 | Airwolf | Knight Rider; Street Hawk; Miami Vice | 7 seconds, melodic phrase rather than an anonymous opening sound | Medium; similar synth-action choices, without reusing question 1's audio. |
| 8 | Magnum, P.I. | The A-Team; The Rockford Files; The Fall Guy | 7 seconds, familiar main title arrangement | Hard; adjacent detective/action themes. The Rockford Files is an intentional earlier-era distractor, not an 80s/90s correct answer. |
| 9 | The X-Files | Twin Peaks; The Outer Limits; Millennium | 6 seconds, distinctive eerie motif | Medium; a late-round confidence recovery. |
| 10 | The Bill | London's Burning; Casualty; Between the Lines | 7 seconds, title-theme phrase from the intended era | Hard; comparable British drama titles. |

Never put two programmes/films that genuinely share the supplied theme in one set of choices; in particular, avoid a Beverly Hills Cop sequel as a q3 distractor. Repeated labels between questions are allowed, but listen to the full round for elimination clues. Artwork contains A-Team/Magnum decorations; those are intentional atmosphere and may slightly help those questions. Account for this in playtests.

Reserve pool for a different balance: Back to the Future, Ghostbusters (instrumental passage only if the lyric would immediately name it), The Terminator, Twin Peaks, Red Dwarf, DuckTales, Only Fools and Horses, Inspector Gadget. Swap entire questions and review the distractors, not just the correct label. Avoid difficulty coming from obscure remakes, an inaudible mix, microscopic snippets or a phrase with no identifying melody. Avoid added composer/year trivia in reveals unless verified from a reliable source.

### Calibrating 50-60% correctly

Start with 3 easy, 5 medium, 2 hard questions. Heuristic expectations of 80%, 50%, 30% yield an average 5.5/10; this is a planning estimate, not measurement. It does not establish that most individual players will get 5-6.

Have 6-10 representative adults play the exact proposed clips with final artwork, four options, unlimited replay and no hints. Record first-attempt total, correctness per question, ambiguous answers and completion time; do not use repeat attempts for calibration. Aim for median 5-6 and most scores around the middle, with an exploratory mean of 50-60%. With this small sample results are provisional.

If too easy, replace the weakest distractor with a musically comparable option or move the clip to a less obvious but still identifiable phrase. If too hard, include the recognisable motif, lengthen to 10-12 seconds or replace an obscure theme. Change one variable per question and test with fresh listeners. Fix ambiguous questions even if their success rate looks right. Never change scoring, options or clips according to the individual player's previous answers.

### Audio intake checklist for the editor

Keep a small editorial table outside `public/` containing question ID, programme/film, recording/version, supplied source filename, excerpt start/end, final filename, measured duration, listening check, and permission/source note. The owner supplies clips they are entitled to use; do not invent a “short clips are automatically allowed” rule or download tracks during implementation.

For each of the ten questions:

- Receive the source recording or already trimmed MP3. Store full originals outside public hosting; ship only excerpts.
- Listen before selecting the time range. Exact timestamps cannot be specified until the recording is available. Avoid narration, spoken titles, identifying lyrics and source watermarks. Instrumentals are preferred.
- Trim to a clean musical phrase, typically 6-12 seconds. Add tiny boundary fades if needed to remove clicks. Normalise the set by listening and measurement to avoid volume jumps; an initial engineering target around -16 LUFS and <=-1 dBTP is a proposed production choice, not a compliance claim.
- Encode broadly compatible MP3, e.g. 44.1 kHz at 128-192 kbps, strip identifying metadata, and name neutrally (`q01-v1.mp3`). Aim <=300 KB per excerpt, <=3 MB total. Record actual duration in the manifest.
- Play each output on a phone speaker and headphones; match it against the correct answer and all distractors. Verify actual response bytes/MIME and decoding from production-build preview.
- Update manifest version when substantive content changes. Use new filenames for replacement bytes because hosting caches media for a year.

Do not build an upload UI just to solve this one-off content handoff.

## 8. Implementation sequence with completion criteria

Complete these steps in order. Each produces a reviewable piece without depending on unpublished content.

### Task 1: Baseline and configuration

Read the file map, inspect the working tree and save pre-existing `dist/index.html` changes. Capture baseline `/` and `/?reception` at 1440x900 and 390x844. The planning inspection already confirmed a mobile poster container around 370x612px; portrait-cover cropping is real, not hypothetical. Read any subsequently added AGENTS instructions.

Add the manifest registry, disabled inline config and validation. Use draft candidate labels; no fabricated MP3 paths presented as ready. Add Node test command `test:theme-quiz` (`node --test tests/theme-quiz/*.test.js`) and later `qa:theme-quiz` (`node scripts/qa-theme-quiz.mjs`). Don't alter existing commands.

Done when missing/disabled/invalid configuration leaves the homepage and timetable usable, and manifest validation tests cover malformed/duplicate IDs and correct-answer membership.

### Task 2: Pure attempt engine and storage

Implement shuffle, selection, lock, skip, next, finish, replay and scoring as explicit pure transitions. Storage wraps only validated data with try/catch and memory fallback. Inject randomness or a fixed permutation in tests so results are reproducible without changing production behaviour.

Done when a known sequence produces the expected score, double locks cannot add points, skipped answers remain zero, revealed and unfinished states survive reload, corrupt storage resets safely, and version changes invalidate attempts.

### Task 3: Audio controller in isolation

Implement the single player and request counter. Create a short synthetic test audio fixture with no copyrighted recording, served only by the QA harness (e.g. a WAV response intercepted at a fixture URL). Tests explicitly label this as a playback test tone; do not map a test tone to a real theme and pretend it is content validation. Browser-level tests must include actual playback/ended events on valid bytes, not exclusively mocked promises.

Done when normal play/pause/replay/end work, failed playback is recoverable, and close/next/hidden state stop audio even with delayed play requests. Clip load failure must not force an answer or change the total score.

### Task 4: Dialog and question/results UI

Build DOM with stable radio/control elements, scoped CSS and the exact behaviours in section 4. Keep the audio element and listeners alive across renders. Connect to the state engine. Render only the current screen; reveal content does not exist in assistive text before lock/skip. Keep question order stable and option order stable across rerenders/reopens.

Done when ten fixture questions can be completed with keyboard and touch, selection requires explicit confirmation, results/replay/share fallbacks work, and the layout is usable on small/short screens.

### Task 5: Weekly poster integration

Instantiate once in `initWeekPage`, pass the optional config, evaluate eligibility from primary view/week and apply the round image only when eligible. Extend `setImage` fit options, add launcher as a sibling of zoom wrapper, wire close cleanup through native `cancel`/`close` events. Use DEV-only preview with a development-only fixture manifest override for reproducible QA; ensure no fixtures are included in the production bundle/public output.

For DEV review before artwork approval, override the poster URL with `/docs/plans/assets/birthday-band-v1.png` only in the development-preview branch. Vite can serve that repository file during development; it is not a production asset URL. Do not create a production dependency on `docs/`. Generate the final public WebP only after selection. For fixture audio, use a separate clearly labelled QA round with options such as “Test tone A”; never claim those sounds are the real proposed themes.

Done when birthday preview shows all four musicians, play button never triggers zoom, zoom still works elsewhere, gallery/menu/year switches keep working, a changed view closes audio and the disabled state matches baseline. Unknown URL parameters must not alter the existing view parser. Do not add a dialog history entry.

### Task 6: Editorial pack and final media

Use the supplied/approved artwork and recordings, export the versioned web image and ten excerpts, replace duration examples with measured values, complete the editorial table and content playtest. Create `docs/theme-quiz-editor.md` with exact config fields, paths, versioning, preparation and disable instructions.

If approval/MP3s are still absent, keep production disabled and deliver a working DEV preview plus a precise missing-assets list. This is a complete shell, not a ready-to-publish round. The agent should not repeatedly ask to continue coding while waiting for those materials.

Done for publication only when all ten clips are reviewed, artwork is approved, content has no ambiguous answers, and target displayed week/views are set. Do not guess those editorial decisions or deploy.

### Task 7: Integrated QA and handoff

Run Node tests, Playwright checks and a production build into a separate output directory. Use `npm run preview -- --host 127.0.0.1 --port 3018 --strictPort --outDir /tmp/dlphn-theme-quiz-build` for built-asset smoke checks. Use an available dedicated port for development; 3000 may belong to another application (it did during planning). Do not stop unrelated servers.

For enabled-production smoke tests without releasing content, temporarily configure a local isolated checkout with the final round or QA-only fixture configuration. Test the bundled path there, then verify shipped source remains at the intended readiness/enablement. DEV preview query is intentionally unavailable under production preview, so passing it alone cannot exercise the enabled production path. Missing real media still blocks the final audio/content acceptance.

Deliver changed-file summary, passing/failing checks, screenshots, review URL, current asset/enablement status, and any untested real-device limitation. Do not commit or overwrite unrelated modifications. If the repository workflow later needs generated `dist/` changes, reconcile its saved existing edit with the source before generating that final output.

## 9. Required acceptance matrix

| Area | Required checks |
| --- | --- |
| Eligibility | Disabled/missing config; unknown quiz; draft production manifest; matching/nonmatching displayed week; Year 4/Reception/combined views; hash alias; DEV preview override absent from production. |
| Poster | Full four-person composition at default mobile/desktop fit; correct image reversion on view switch; same-URL fit change applies; gallery button usable; pinch/double tap/drag outside launcher; launcher click causes exactly one open. |
| State | All-correct 10/10; all-wrong 0/10; five correct 5/10; skip zero; lock twice once only; no next before reveal; final question/results; restart resets; radio selection alone never scores. |
| Ordering | Four distinct answers each time; correctOptionId still scores after shuffle; same attempt order survives close/reload; replay starts fresh. |
| Persistence | Mid-selection, after reveal, after next and after results reload; corrupt JSON; valid JSON with invalid IDs/permutations; wrong version; storage blocked/quota error. |
| Audio | Actual valid-byte playback and ended event; play/pause/replay; first-tap blocked then manual retry; 404/HTML fallback; unsupported/corrupt bytes; slow/stalled resource; late promise after close; repeated rapid clicks; no overlap; no auto-resume. |
| Lifecycle | Close button, Escape, view switch, popstate/hash change while active, pagehide and tab hidden all stop audio. Reopen restores quiz state with stopped playback. |
| Focus/accessibility | Visible labels/focus; radios with keyboard; lock/skip feedback announced once; dialog focus contained and returned; underlying timetable inert only while modal open; 200% zoom; reduced motion; answer reveal not leaked through alt/ARIA/title text. |
| Layout | 320x568, 390x844, 844x390, 768x1024 and 1440x900; long answer labels; scrolling footer/close reachable; safe areas; no horizontal overflow. |
| Results | Correct score/percentage/counts; review chosen/correct/skipped; Share supported, unsupported and cancelled; clipboard failure selectable text fallback; shared URL contains no QA parameter. |
| Regression | `/`, `/?reception`, `/?year4&reception`, `/#reception`, `/gallery`, `/gallery?reception`, `/games`, `/kids-vs-parents`; menu, year switch, weather/day cards and poster zoom retain behaviour. |
| Build/assets | Build passes; classic editable weekly block survives; correct public paths and decodable audio; no full songs, test fixtures, Firebase/Phaser quiz imports or secret/source metadata added; disabled feature makes zero audio requests. |

Save screenshots for homepage entrance, first question, selected answer, incorrect reveal, final result and mobile/short-viewport dialog. Playwright Chromium plus WebKit is useful; if WebKit binaries are unavailable, report that and retain Chromium coverage. A real iPhone/Safari listen/play/close/reopen check remains necessary before declaring phone audio verified; automated WebKit is not a substitute for that evidence.

## 10. Ready-to-paste instruction for the implementation agent

> Implement `docs/plans/2026-09-06-theme-tune-birthday-quiz.md` in this repository. Treat it as the acceptance specification, follow its file map and ordered tasks, and preserve the existing weekly-update data contracts. Inspect current instructions and working-tree changes first, especially the pre-existing `dist/index.html` edit. Build the vanilla-JS modal audio quiz, integrate its launcher and per-poster contain fit into the current weekly homepage, and run the specified state/audio/browser/build checks. Use the saved band image as a review asset, not implicit approval. If final artwork approval or MP3s are absent, finish and demonstrate the feature with clearly labelled development-only fixtures, keep production disabled, and list the exact missing assets. Do not change timetable events, introduce a backend, deploy, or replace unrelated files. Deliver a working local preview, screenshots, test results and the concise weekly editor guide.
