import { birthdayRound } from './rounds/birthday-tv-film-v1.js';
const rounds = { [birthdayRound.id]: birthdayRound };
export function getRound(quizId) {
  return rounds[quizId] || null;
}
export function devFixtureRound() {
  return null;
}
