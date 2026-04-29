import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from '../../../src/firebase.js';
import { sampleQuizzes } from '../sampleQuizzes.js';

function withSampleFallback(quizSlug) {
  const sample = sampleQuizzes[quizSlug];
  if (!sample) return null;
  return {
    quiz: sample.quiz,
    questions: sample.questions
  };
}

export async function loadQuizBySlug(quizSlug) {
  try {
    const quizRef = doc(db, 'kvpQuizzes', quizSlug);
    const quizSnap = await getDoc(quizRef);
    if (!quizSnap.exists()) {
      return withSampleFallback(quizSlug);
    }

    const quizData = { id: quizSnap.id, ...quizSnap.data() };
    const questionsRef = collection(db, 'kvpQuizzes', quizSlug, 'questions');
    const questionsQuery = query(questionsRef, orderBy('order', 'asc'));
    const questionsSnap = await getDocs(questionsQuery);
    const questions = questionsSnap.docs.map((item) => ({ id: item.id, ...item.data() }));
    return { quiz: quizData, questions };
  } catch (error) {
    console.warn('Failed to load Firestore quiz, using fallback if available.', error);
    return withSampleFallback(quizSlug);
  }
}

export function scoreAnswers(questions, selectedByQuestionId) {
  const answers = [];
  let score = 0;

  for (const question of questions) {
    const selectedOptionId = selectedByQuestionId[question.id] || null;
    const isCorrect = selectedOptionId === question.correctOptionId;
    if (isCorrect) score += 1;
    answers.push({ questionId: question.id, selectedOptionId, isCorrect });
  }

  const maxScore = questions.length;
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  return { answers, score, maxScore, percentage };
}

export async function submitParentQuiz({ quizSlug, quizTitle, playerName, scoring }) {
  const submissionsRef = collection(db, 'kvpQuizzes', quizSlug, 'submissions');
  const payload = {
    playerType: 'parent',
    name: playerName || '',
    quizSlug,
    quizTitleSnapshot: quizTitle,
    answers: scoring.answers,
    score: scoring.score,
    maxScore: scoring.maxScore,
    percentage: scoring.percentage,
    createdAt: serverTimestamp()
  };
  const submission = await addDoc(submissionsRef, payload);
  return submission.id;
}

export async function submitKidsQuiz({ quizSlug, quizTitle, scoring }) {
  const submissionsRef = collection(db, 'kvpQuizzes', quizSlug, 'submissions');
  const payload = {
    playerType: 'kids',
    name: 'Kids Team',
    quizSlug,
    quizTitleSnapshot: quizTitle,
    answers: scoring.answers,
    score: scoring.score,
    maxScore: scoring.maxScore,
    percentage: scoring.percentage,
    createdAt: serverTimestamp()
  };
  const submission = await addDoc(submissionsRef, payload);
  return submission.id;
}

export async function loadSubmissionById(quizSlug, submissionId) {
  const submissionRef = doc(db, 'kvpQuizzes', quizSlug, 'submissions', submissionId);
  const snap = await getDoc(submissionRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function loadLatestKidsSubmission(quizSlug) {
  const submissionsRef = collection(db, 'kvpQuizzes', quizSlug, 'submissions');
  const latestKidsQuery = query(
    submissionsRef,
    where('playerType', '==', 'kids'),
    orderBy('createdAt', 'desc'),
    limit(1)
  );
  const snap = await getDocs(latestKidsQuery);
  if (snap.empty) return null;
  const first = snap.docs[0];
  return { id: first.id, ...first.data() };
}

export async function loadAdminSummary(quizSlug) {
  const submissionsRef = collection(db, 'kvpQuizzes', quizSlug, 'submissions');
  const parentQuery = query(submissionsRef, where('playerType', '==', 'parent'));
  const parentSnap = await getDocs(parentQuery);
  const parents = parentSnap.docs.map((item) => ({ id: item.id, ...item.data() }));
  const count = parents.length;
  const total = parents.reduce((sum, row) => sum + (Number(row.score) || 0), 0);
  const highest = count ? Math.max(...parents.map((row) => Number(row.score) || 0)) : 0;
  const lowest = count ? Math.min(...parents.map((row) => Number(row.score) || 0)) : 0;
  const average = count ? total / count : 0;
  const recent = parents
    .sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    })
    .slice(0, 10);
  const kidsLatest = await loadLatestKidsSubmission(quizSlug);
  return {
    parentCount: count,
    parentAverageScore: Number(average.toFixed(2)),
    parentHighestScore: highest,
    parentLowestScore: lowest,
    recentParents: recent,
    kidsLatest
  };
}
