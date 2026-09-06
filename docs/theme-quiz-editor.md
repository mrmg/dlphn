# Theme quiz editor guide

## Publish a round

1. Set `WEEKLY_QUIZ` in `index.html`:
   `enabled: true`, `weekId: 'YYYY-MM-DD'` (Monday of the displayed week),
   `quizId: 'birthday-tv-film-v1'`, `views: ['year4']`.
2. Artwork: export approved image to `public/thisweek/birthday-band-v1.webp`
   (~1600-1920px wide, <=500KB), new version suffix on every change.
   Manifest `poster.src` must match; hosting caches media for a year.
3. Clips: place 10 trimmed MP3s in
   `public/theme-quiz/birthday-tv-film-v1/q01-v1.mp3` … `q10-v1.mp3`.
   6-12s musical phrases, 44.1kHz 128-192kbps, stripped metadata,
   neutral names, <=300KB each. Record measured durations in the manifest.
4. Manifest `src/theme-quiz/rounds/birthday-tv-film-v1.js`:
   `status: 'ready'` only after listening checks pass for all 10.
   Bump `version` on any audio/question/option/answer change and rename files.

## Disable

Set `enabled: false`. The homepage keeps the current poster; no audio is requested.

## Preview (dev only)

`npm run dev -- --host 127.0.0.1 --port 3018` then open
`/?themeQuizPreview=1`. Uses a 2-question clearly labelled fixture and the
docs preview image. Never available in production builds.

## Checks

`npm run test:theme-quiz` then `npm run build -- --outDir /tmp/dlphn-theme-quiz-build`
and `QA_BASE=<preview-url> npm run qa:theme-quiz`. Never run `deploy` as a test.
