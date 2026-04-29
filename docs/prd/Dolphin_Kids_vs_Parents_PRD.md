**Dolphin Kids vs Parents**

Product Requirements Document

*Mobile-first Firebase quiz microsite for reusable Kids vs Parents school challenges*

> Audience: 8-year-old children, parents, teachers, and an admin/organiser.
>
> Core idea: kids answer as one team, parents answer individually, each parent sees their own score vs the Kids score, while the overall parent average remains admin-only.
>
> Build target: fast MVP suitable for agent-swarm implementation using an existing Firebase project.

# 1. Executive summary

Dolphin Kids vs Parents is a slick mobile web app for school-trip quizzes where children compete as a team against their parents. The first edition can be themed around the Battle of Hastings and the children's live visit to Battle, but the architecture must support many quiz themes without code or route rewrites. The app should feel exciting, polished, and game-like for 8-year-olds, while still looking premium enough that parents enjoy using it.

Parents access a no-login quiz link, optionally enter a name, answer multiple-choice questions, and submit. After submission, each parent sees their own score compared with the Kids Team score. They must not see the parent average, number of parent entries, or overall parent leaderboard. Admin sees everything.

| **Decision** | **Requirement** |
|--------------|-----------------|
| Frontend     | Mobile-first responsive web app in this repo's existing Vite multi-page setup. Optimised for WhatsApp in-app browser, Safari iOS, Chrome Android, and desktop admin usage. |
| Backend      | Reuse current Firebase project (`dolphin-thursday`) and existing SDK setup. Use Firestore for quiz config/submissions/results, Firebase Storage for media, Firebase Hosting for deployment, and optional Cloud Functions for server-side scoring/admin actions. |
| Auth         | No user login. Use a secret admin key or signed admin link for organiser-only routes. |
| Media        | Questions must support image now, with future-compatible fields for audio and video. |
| Routing      | Add a dedicated microsite route namespace (`/kids-vs-parents/...`) that resolves consistently in both local Vite dev and Firebase Hosting rewrites. |
| Content      | Data model and UI must be quiz-agnostic; Battle of Hastings is seed content only, not a hardcoded app identity. |
| Title        | Dolphin Kids vs Parents. |
| Tone         | Fun, cheeky, confident, child-friendly, and theme-flexible (history now, other topics later). |

# 1.1 Project-specific implementation baseline

This PRD is adapted to the current `dlphn` repository structure and deployment model:

- App architecture is a multi-entry Vite project (not a single SPA router-only app).
- Hosting is Firebase Hosting with explicit rewrites in `firebase.json`.
- Firebase project and web config already exist in `src/firebase.js` and `src/services/firebase.js`.
- Existing Firestore and Storage rules are permissive for legacy microsites; this feature should introduce scoped collections and tighter rules for quiz data.
- Local development target is `http://localhost:3000` via `npm run dev`; production target is `https://dlphn.app`.

# 2. Goals and non-goals

## 2.1 Goals

- Create a polished same-day quiz experience that feels custom to each school trip or topic.

- Allow quiz packs to encode "kids advantage" context (trip knowledge, photo-based clues, class vocabulary) while remaining generic across subjects.

- Allow parents to play individually without login and without seeing the aggregate parent score.

- Allow the organiser to view live results and manage the quiz from a private admin route.

- Support images in questions immediately, and design the data model to support audio/video without rework.

- Make the UI feel like a miniature game: big cards, animations, badges, shield motifs, confetti, and dramatic win/loss copy.

## 2.2 Non-goals for MVP

- No full account system or parent authentication.

- No payment, email collection, or long-term user profiles.

- No complex anti-cheat beyond light duplicate handling and hidden aggregate results.

- No teacher content-management system beyond a simple JSON/config/admin-edit path unless agents can add it safely after MVP.

# 3. Users and personas

| **Persona**         | **Needs**                                                                                   | **UX notes**                                                                              |
|---------------------|---------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| Child / Kids Team   | Answer as a team, understand questions quickly, enjoy seeing the Kids score beat grown-ups. | Large text, playful language, shield/battle visuals, no dense paragraphs.                 |
| Parent Player       | Open from WhatsApp, play quickly, maybe enter a name, see personal score vs Kids.           | Mobile-first, no login, clear buttons, witty but kind result messages.                    |
| Teacher / Organiser | Submit Kids Team score, view live aggregate results, reset if needed.                       | Private admin view, simple controls, confidence that parents cannot see aggregate scores. |
| AI Agent Developer  | Implement independently against testable requirements.                                      | Clear phases, data model, route list, acceptance criteria, and test cases.                |

# 4. Core product flows

## 4.1 Parent flow

1.  Open shared URL, for example `/kids-vs-parents/quiz/battle-1066?player=parent` (or another quiz slug).

2.  See landing screen with title, short challenge copy, and optional name input.

3.  Tap Start Quiz.

4.  Answer 10-15 multiple-choice questions, one per screen.

5.  Question screens may include image, audio, or video media.

6.  Submit answers.

7.  See personal result: own score vs latest Kids Team score. If Kids score is not entered yet, show own score and a check-back-later message.

8.  Parent result must not reveal parent average, parent count, leaderboard, or overall group winner.

## 4.2 Kids Team flow

9.  Organiser opens kids entry URL with admin key, for example `/kids-vs-parents/kids/battle-1066?key=SECRET`.

10. Interface shows same quiz, optimised for read-aloud / group answers.

11. Organiser selects answer for each question on behalf of Kids Team.

12. Submit stores or replaces the official Kids Team result for the quiz.

13. Confirmation shows Kids score and a clear note that parent results will compare against this score.

## 4.3 Admin flow

14. Organiser opens `/kids-vs-parents/admin/battle-1066?key=SECRET`.

15. Dashboard displays Kids score, parent average, parent count, highest parent score, lowest parent score, recent submissions, and current overall winner.

16. Admin can copy parent quiz URL and kids entry URL.

17. Admin can toggle public final reveal, reset parent submissions, reset Kids score, and export CSV.

18. Admin can inspect media loading status for questions.

# 5. Interface requirements

## 5.1 Visual direction

The app should be “super sexy and slick” while still appropriate for 8-year-olds. Think premium children's game UI rather than school worksheet. The visual style should combine Dolphin School identity, shields, Battle of Hastings motifs, bright cards, soft motion, and readable typography.

- Use a bold hero title: Dolphin Kids vs Parents.

- Use a battle theme without violence-heavy imagery: shields, banners, maps, parchment cards, castle/abbey silhouettes, crossed pencils/shields, cheerful medieval motifs.

- Use large tap targets: minimum 44px high, preferably 56px+ for answer options.

- Use animated transitions between questions, but keep them fast and non-distracting.

- Use celebratory result states: confetti for parent win/draw/kids win, but phrase kids win as playful rather than shaming parents.

- Use high contrast and avoid tiny text over images.

- Use one-handed mobile layout first; desktop/admin can be wider.

## 5.2 Suggested colour and typography

| **Element**     | **Recommendation**                                                                                                                          |
|-----------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| Primary colours | Deep ocean blue, bright dolphin cyan, warm gold, parchment cream, shield red accents.                                                       |
| Typography      | Use a friendly modern rounded font for UI if available; otherwise system font with strong weights. Avoid fake medieval fonts for body text. |
| Cards           | Rounded 20-28px cards, subtle shadows, high contrast answer buttons.                                                                        |
| Buttons         | Primary CTA should feel like a game button: large, tactile, animated press state.                                                           |
| Icons           | Shield, dolphin, crown, scroll, map pin, flag, star.                                                                                        |

# 6. Routes and screens

All feature routes should live under a dedicated namespace so this microsite does not collide with existing `/card`, `/ideas`, `/horrid`, and `/games` routes.

| **Route** | **Purpose** | **Access** |
|-----------|-------------|------------|
| `/kids-vs-parents` | Landing page (role choice, quiz picker, or direct deep link handling). | Public |
| `/kids-vs-parents/quiz/:quizSlug?player=parent` | Parent quiz start and question flow. | Public |
| `/kids-vs-parents/result/:quizSlug/:submissionId` | Parent personal result page (own score vs Kids only). | Public but unguessable ID |
| `/kids-vs-parents/kids/:quizSlug?key=SECRET` | Kids Team answer entry mode. | Admin key |
| `/kids-vs-parents/admin/:quizSlug?key=SECRET` | Admin dashboard. | Admin key |
| `/kids-vs-parents/final/:quizSlug` | Optional public final reveal if enabled. | Public only when reveal flag is true |

## 6.1 Local + remote route parity requirements

To ensure these routes work in both environments:

- Add a dedicated HTML entry point at `kids-vs-parents/index.html` with feature JS in `kids-vs-parents/src/...`.
- Add Vite build input for this page in `vite.config.js` (same pattern as other microsites).
- Add Firebase Hosting rewrites:
  - `/kids-vs-parents` -> `/kids-vs-parents/index.html`
  - `/kids-vs-parents/**` -> `/kids-vs-parents/index.html` (for in-app path handling)
- Add matching Vite dev middleware rewrite so deep links load in local dev.
- Keep root redirect behavior (`/` -> `/card`) unchanged to avoid regressions in current site navigation.

# 7. Firebase data model

Use Firestore for structured quiz data and Firebase Storage for media files. Reuse the current Firebase app initialization and project configuration already in this repository. Use Cloud Functions where possible for server-side scoring and admin-only mutations; otherwise implement carefully in client with Firestore rules and a non-sensitive MVP key. For production-quality operation, admin actions should be server-side.

## 7.0 Collection namespace for this feature

To avoid collisions with existing project collections, this feature should use a dedicated namespace:

- `kvpQuizzes/{quizSlug}`
- `kvpQuizzes/{quizSlug}/questions/{questionId}`
- `kvpQuizzes/{quizSlug}/submissions/{submissionId}`
- `kvpQuizzes/{quizSlug}/adminEvents/{eventId}` (optional audit trail)
- `kvpQuizzes/{quizSlug}/aggregates/current`
- `kvpQuizPacks/{packId}` (optional reusable templates across quizzes)

## 7.1 Firestore collections

kvpQuizzes/{quizSlug}  
title: string  
theme: string  
topic: string  
description?: string  
coverImageUrl?: string  
slug: string  
isActive: boolean  
showPublicResults: boolean  
createdAt: timestamp  
updatedAt: timestamp  
kidsResultId: string \| null  
settings: {  
maxQuestions: number  
showParentOwnScore: boolean  
showParentVsKids: boolean  
hideParentAggregates: boolean  
}  
packId?: string  
  
kvpQuizPacks/{packId}  
name: string  
topic: string  
version: number  
questionCount: number  
createdAt: timestamp  
updatedAt: timestamp  
  
kvpQuizzes/{quizSlug}/questions/{questionId}  
order: number  
text: string  
hint?: string  
options: \[{ id: string, text: string }\]  
correctOptionId: string  
explanation: string  
media?: {  
type: 'image' \| 'audio' \| 'video'  
url: string  
altText?: string  
caption?: string  
thumbnailUrl?: string  
}  
tags?: string\[\]  
quizTopicTags?: string\[\]  
kidAdvantage?: boolean  
active: boolean  
  
kvpQuizzes/{quizSlug}/submissions/{submissionId}  
playerType: 'parent' \| 'kids'  
name?: string  
answers: \[{ questionId: string, selectedOptionId: string, isCorrect: boolean }\]  
score: number  
maxScore: number  
percentage: number  
createdAt: timestamp  
clientInfo?: {  
userAgent?: string  
approximateDevice?: string  
}  
quizSlug: string  
quizTitleSnapshot: string  
  
kvpQuizzes/{quizSlug}/aggregates/current  
kidsScore?: number  
kidsMaxScore?: number  
kidsPercentage?: number  
kidsSubmissionId?: string  
parentCount: number  
parentAverageScore: number  
parentAveragePercentage: number  
parentHighestScore: number  
parentLowestScore: number  
updatedAt: timestamp

# 8. Security and privacy requirements

- No children's personal data should be collected. Kids play as a team only.

- Parent name is optional and can be nickname/blank. Do not ask for email or phone number.

- Admin routes require a secret key. For production-quality implementation, verify admin actions in Cloud Functions using an environment variable, not client-side only.

- Public result pages must only show the parent's own submission plus Kids score. They must not expose parent aggregates.

- Firestore rules should prevent public clients from writing aggregate documents directly.

- Media uploads should be handled by admin only. Public clients only read approved media URLs.

# 9. Functional requirements and acceptance criteria

## FR1 Landing page

Create an engaging landing screen with title, challenge premise, optional parent name entry, and clear start button.

Acceptance criteria:

- Given a user opens the parent URL on mobile, when the page loads, then the title “Dolphin Kids vs Parents” is visible above the fold.

- Given the user leaves name blank, when they start and submit the quiz, then the submission succeeds.

- Given the page is viewed at 390px width, then no horizontal scrolling occurs.

## FR2 Quiz question screen

Display one question at a time with multiple-choice answers and optional media.

Acceptance criteria:

- Given a question has four options, then all options are visible as large tap targets.

- Given a question has image media, then the image loads above the question and has alt text.

- Given a user selects an option, then the selected option is visually distinct before moving on.

## FR3 Navigation and progress

Show progress and support a smooth next/back flow.

Acceptance criteria:

- Given a 12-question quiz, then question 4 displays progress equivalent to “Question 4 of 12”.

- Given the user goes back, then their previous answer remains selected.

- Given all questions are answered, then the submit button becomes available.

## FR4 Scoring

Calculate score reliably from stored correct answers.

Acceptance criteria:

- Given 12 questions and 8 correct answers, then the stored score is 8 and maxScore is 12.

- Given scoring occurs, then users cannot alter score via client payload alone if Cloud Functions are implemented.

- Given an invalid question ID is submitted, then the submission is rejected or ignored safely.

## FR5 Parent result page

Show own score vs Kids Team score only.

Acceptance criteria:

- Given Kids score exists and parent scored 8/12 while Kids scored 10/12, then page says Kids beat them by 2 points.

- Given Kids score does not exist, then page shows own score and “Kids score not entered yet” style message.

- Given a parent views result page, then parent average, parent count, and leaderboard are not present in the DOM or API response.

## FR6 Kids Team mode

Allow organiser to submit official Kids Team answers.

Acceptance criteria:

- Given admin key is valid, then organiser can access Kids Team quiz.

- Given Kids Team submits a new result, then the official Kids score updates.

- Given Kids Team resubmits, then admin dashboard uses latest Kids result only.

## FR7 Admin dashboard

Show live operational results and controls.

Acceptance criteria:

- Given parent submissions exist, then admin sees parent count, average, highest and lowest score.

- Given Kids result exists, then admin sees Kids score and current overall winner.

- Given admin clicks copy parent link, then the correct public URL is copied.

## FR8 Media support

Support image now and audio/video fields for future use.

Acceptance criteria:

- Given a question has media.type=image, then it renders as responsive image.

- Given media.type=audio, then app renders an accessible audio player or a graceful unsupported placeholder if not implemented in MVP.

- Given media.type=video, then app renders a responsive video player or a graceful unsupported placeholder if not implemented in MVP.

## FR9 Admin reset/export

Allow organiser to manage same-day event safely.

Acceptance criteria:

- Given admin confirms reset parent submissions, then parent submissions are cleared or archived and aggregates recalculate.

- Given admin clicks export CSV, then a CSV containing parent name, score, maxScore, percentage, and createdAt downloads.

- Given a non-admin attempts reset/export, then the action fails.

## FR10 Public final reveal

Optional final group result page.

Acceptance criteria:

- Given showPublicResults=false, then /final does not show group result.

- Given showPublicResults=true, then /final shows Kids score, parent average, and winner.

- Given final reveal is enabled, parent result pages may include a link to final result.

# 10. Implementation plan for agent swarm

| **Phase**                             | **Work**                                                                                                                                                | **Exit criteria**                                                                                                                                 |
|---------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| Phase 0 - Project inspection          | Inspect existing Firebase setup, hosting config, framework, env vars, and local dev commands. Produce a short README update with how to run and deploy. | \['Repo can run locally.', 'Firebase project/config is documented.', 'No secrets are committed.'\]                                                |
| Phase 1 - Data model and seed content | Create Firestore structure, seed Battle quiz, add 12 initial questions including shield/photo placeholders.                                             | \['Seed script creates quiz and questions.', 'Question order is deterministic.', 'Media fields can be null without breaking UI.'\]                |
| Phase 2 - Parent mobile quiz UI       | Build landing, quiz, answer selection, progress, submission, and result routing.                                                                        | \['Works on 390px mobile viewport.', 'Blank parent name accepted.', 'Submission creates Firestore document.'\]                                    |
| Phase 3 - Kids Team mode              | Build protected Kids Team answer-entry flow.                                                                                                            | \['Invalid key blocks access.', 'Valid key allows submit.', 'Latest Kids score available to parent result pages.'\]                               |
| Phase 4 - Admin dashboard             | Build private results dashboard with aggregate stats and controls.                                                                                      | \['Admin sees aggregate stats.', 'Parents cannot access admin stats.', 'Copy links work.'\]                                                       |
| Phase 5 - Media support and polish    | Add image upload/link support, media rendering, loading states, transitions, confetti, error handling.                                                  | \['Images render correctly.', 'Broken media shows fallback.', 'UI passes basic accessibility checks.'\]                                           |
| Phase 6 - QA and deployment           | Test end-to-end, deploy to Firebase Hosting, verify on real phones.                                                                                     | \['Parent flow passes on iPhone and Android.', 'Admin dashboard works on desktop/mobile.', 'No aggregate data appears in parent API responses.'\] |

# 11. Starter quiz pack content (Battle example)

Use these as one starter quiz pack. Implementation must support multiple packs/quizzes with the same UI and data model, and allow image URLs to be added later.

| **\#** | **Question**                                               | **Options**                                                                                  | **Correct**                  |
|--------|------------------------------------------------------------|----------------------------------------------------------------------------------------------|------------------------------|
| 1      | What year was the Battle of Hastings?                      | 1066; 1666; 1966; 1016                                                                       | 1066                         |
| 2      | Who won the Battle of Hastings?                            | William of Normandy; King Harold; Henry VIII; Julius Caesar                                  | William of Normandy          |
| 3      | Where did William come from?                               | Normandy; Scotland; Wales; Spain                                                             | Normandy                     |
| 4      | What was Harold's army famous for forming?                 | Shield wall; Pyramid; Dragon circle; Tunnel                                                  | Shield wall                  |
| 5      | Which shield shape is most closely linked with the Saxons? | Round; Kite-shaped; Square; Triangle                                                         | Round                        |
| 6      | Which army was known for kite-shaped shields?              | Normans; Saxons; Tudors; Romans                                                              | Normans                      |
| 7      | What was the battle fought over?                           | Who would be king of England; Who owned the moon; Who invented chips; Who had the best horse | Who would be king of England |
| 8      | What famous picture-story tells the Norman conquest?       | Bayeux Tapestry; Magna Carta; Rosetta Stone; Domesday Book                                   | Bayeux Tapestry              |
| 9      | What appeared in the sky in 1066 and was seen as an omen?  | Halley's Comet; Hot-air balloon; Rainbow dragon; Space station                               | Halley's Comet               |
| 10     | Was the battle fought in modern Hastings town centre?      | No, near what is now Battle; Yes, on the pier; Yes, on the beach; No, in London              | No, near what is now Battle  |
| 11     | The Bayeux Tapestry is technically...                      | An embroidered cloth; A woven tapestry; A stone carving; A wooden painting                   | An embroidered cloth         |
| 12     | PHOTO QUESTION: What is this?                              | Battle Abbey; Roman fort; Victorian railway tunnel; Tudor palace                             | Battle Abbey                 |

# 12. Result copy examples

| **State**          | **Copy**                                                                                                                               |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| Parent beats Kids  | You scored 11/12. The Kids scored 10/12. You beat the Kids by 1 point. Suspicious. Very suspicious. The Witan may need to investigate. |
| Draw               | You scored 10/12. The Kids scored 10/12. A tense standoff on the battlefield. No one breaks the shield wall today.                     |
| Kids beat Parent   | You scored 8/12. The Kids scored 10/12. The Kids beat you by 2 points. The shield wall holds. Back to history class with you.          |
| Kids score pending | You scored 8/12. The Kids' official score has not been entered yet. Check back later for your battlefield result.                      |

# 13. Test plan

## Unit tests

- Score calculation returns correct score/maxScore/percentage.

- Winner copy returns correct message for win/draw/loss/pending.

- Question validation rejects missing selected answers.

## Integration tests

- Parent completes quiz and creates submission.

- Kids submission updates official Kids score.

- Admin aggregate recalculates after submissions.

- Parent result endpoint does not return aggregate stats.

## E2E tests

- Complete parent quiz on mobile viewport.

- Submit Kids Team score using admin key.

- Open parent result before and after Kids score exists.

- Admin resets parent submissions after confirmation.

## Accessibility checks

- All images have alt text or decorative role.

- Answer buttons can be selected by keyboard.

- Colour contrast passes WCAG AA for text.

- Audio/video controls have labels when implemented.

## Device checks

- iPhone Safari.

- Android Chrome.

- WhatsApp in-app browser.

- Desktop Chrome for admin.

# 14. Image generation prompt pack

Use these as separate prompts when generating assets. Keep all visuals free of real human faces/children. Prefer icons, mascots, shields, banners, and playful objects.

| **Asset**                | **Prompt**                                                                                                                                                                                                                                                                                                                        |
|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Logo - main app icon     | Create a polished mobile app logo for “Dolphin Kids vs Parents”. No people. A cheerful dolphin mascot leaping over a medieval shield, with subtle Battle of Hastings inspiration, bright ocean blue and gold palette, clean vector-style 3D icon, rounded square app icon, premium children's game feel, readable at small size.  |
| Hero banner              | Create a wide mobile web hero banner for “Dolphin Kids vs Parents”. No people. A playful battlefield quiz scene with a dolphin mascot, Norman kite shield, Saxon round shield, parchment quiz cards, Battle Abbey silhouette in the distance, bright polished 3D cartoon style, fun for 8-year-olds but sleek enough for parents. |
| Kids win badge           | Create a celebratory badge reading “Kids Win!” with a dolphin, shield wall, gold stars, blue and red banners, high-quality 3D cartoon game UI style, transparent background, no people.                                                                                                                                           |
| Parents win badge        | Create a playful badge reading “Parents Win!” with a crown, scroll, shield, and cheeky sparkle effects, premium mobile game UI style, transparent background, no people.                                                                                                                                                          |
| Draw badge               | Create a dramatic “Shield Wall Holds!” draw badge with two shields touching, gold trim, parchment ribbon, polished 3D cartoon style, transparent background, no people.                                                                                                                                                           |
| Question card background | Create a reusable mobile quiz card background: parchment panel with subtle map texture, blue/gold border, small dolphin and shield motifs in corners, clean empty centre for text, high-end children's app UI, no people.                                                                                                         |
| Loading mascot           | Create a cute dolphin mascot dressed as a tiny medieval quiz herald, holding a scroll and shield, polished 3D cartoon style, transparent background, no people.                                                                                                                                                                   |
| Favicon/simple mark      | Create a simple flat vector mark combining a dolphin fin and medieval shield, blue and gold, no text, suitable for favicon and small UI icon, transparent background.                                                                                                                                                             |

# 15. Master build prompt for agents

Copy this prompt into your coding agent/orchestrator along with this PRD:

You are building “Dolphin Kids vs Parents”, a mobile-first Firebase-backed quiz microsite for a school-trip Kids vs Parents challenge. Firebase is already set up. Implement the PRD exactly, prioritising a slick child-friendly mobile UI, no-login parent flow, Kids Team score entry, and an admin dashboard. Parents must see their own score vs Kids score after submitting, but must never see parent average, parent count, leaderboard, or overall parent group status. Support image media now and design data structures for audio/video. Use testable acceptance criteria from the PRD. Work in small commits by phase, update README with run/deploy commands, and include seed data for the initial Battle of Hastings quiz.

# 16. Risks and mitigations

| **Risk**                                     | **Mitigation**                                                                                                                                          |
|----------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| Admin key leaks in parent chat               | Use obscure key and keep aggregate admin route separate. For stronger version, implement Cloud Function admin auth or Firebase Auth for organiser only. |
| Parents submit multiple times                | Accept for MVP or store localStorage submission ID and warn on repeat. Admin can export/inspect duplicates.                                             |
| Kids score not entered before parents finish | Parent result page supports pending Kids score and can update when revisited.                                                                           |
| Images from teacher arrive late              | Seed photo placeholder questions and allow quick URL replacement.                                                                                       |
| Poor mobile performance with media           | Compress images, use thumbnails for video, lazy-load media, and keep quiz assets small.                                                                 |

# 17. MVP delivery checklist

- Parent link works without login.

- Kids entry link works with admin key.

- Admin dashboard shows live aggregate results.

- Parent result shows own score vs Kids only.

- Questions support images and tolerate missing media.

- Seed process supports at least one additional non-Hastings quiz to validate quiz-agnostic routing and rendering.

- Works on mobile and WhatsApp browser.

- README includes local run, seed, test, and deploy commands.

- Firestore rules or Cloud Functions prevent public aggregate tampering.

- Firebase Hosting deployment is verified.
