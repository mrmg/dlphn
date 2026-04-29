# Dolphin Kids vs Parents - Project Integration Addendum

This addendum translates the PRD into concrete repository changes for `dlphn`.

## 1) Route strategy (local + remote)

Use a dedicated namespace:

- `/kids-vs-parents`
- `/kids-vs-parents/*`

Implementation notes:

1. Add entry page `kids-vs-parents/index.html`.
2. Add feature code under `kids-vs-parents/src/`.
3. Add Vite input in `vite.config.js`:
   - `kids-vs-parents: 'kids-vs-parents/index.html'`
4. Add Firebase Hosting rewrites in `firebase.json`:
   - `/kids-vs-parents` -> `/kids-vs-parents/index.html`
   - `/kids-vs-parents/**` -> `/kids-vs-parents/index.html`
5. Add matching Vite middleware rewrite for local deep-link support.

Result: same URLs work in local dev (`http://localhost:3000`) and production (`https://dlphn.app`).

## 2) Firebase integration

Reuse existing setup:

- `src/firebase.js`
- `src/services/firebase.js`
- Firebase project `dolphin-thursday`

Do not introduce another Firebase project or duplicate config files.

## 3) Firestore and Storage structure

Add dedicated collections for this feature:

- `kvpQuizzes/{quizSlug}`
- `kvpQuizzes/{quizSlug}/questions/{questionId}`
- `kvpQuizzes/{quizSlug}/submissions/{submissionId}`
- `kvpQuizzes/{quizSlug}/aggregates/current`
- `kvpQuizPacks/{packId}` (optional template layer)

Recommended Storage paths:

- `kvp-quizzes/{quizSlug}/questions/{questionId}/...` (media assets)
- `kvp-quizzes/{quizSlug}/branding/...`

## 4) Security rules direction

Current project rules are broad for legacy microsites. For this feature:

- Parent clients can read active quiz + question docs.
- Parent clients can write only their own submission docs.
- Parent clients cannot read aggregate docs.
- Admin-only write access for kids score, reset, export, and media mutation.
- Aggregate writes should be Cloud Function controlled where possible.

## 5) Multi-quiz requirement

The app must stay quiz-agnostic:

- Never hardcode `battle-1066` in route logic.
- Always resolve `quizSlug` from URL.
- Seed at least one non-Hastings quiz to validate generic UI and scoring.
- Keep result and admin views generic across topics.

## 6) Suggested initial migration sequence

1. Add route and page scaffolding.
2. Add Firestore collection wrappers and slug-based data loading.
3. Seed two quizzes (Battle + one other topic).
4. Add admin controls and aggregate calculation.
5. Tighten Firestore/Storage rules for new collections.
