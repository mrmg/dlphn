export const qaFixtureRound = {
  id: 'qa-fixture-v1',
  version: 1,
  status: 'ready',
  title: 'Name That Theme',
  subtitle: 'QA fixture edition',
  poster: {
    src: '/docs/plans/assets/birthday-band-v1.png',
    alt: 'QA fixture poster.',
    fit: 'contain',
  },
  questions: [
    {
      id: 't01',
      audio: { src: '/theme-quiz/qa-fixture-v1/t01-v1.mp3', durationSeconds: 1 },
      options: [
        { id: 'tone-a', label: 'Test tone A' },
        { id: 'tone-b', label: 'Test tone B' },
        { id: 'tone-c', label: 'Test tone C' },
        { id: 'tone-d', label: 'Test tone D' },
      ],
      correctOptionId: 'tone-a',
      explanation: 'Fixture tone A for playback checks only.',
      difficulty: 'easy',
    },
    {
      id: 't02',
      audio: { src: '/theme-quiz/qa-fixture-v1/t02-v1.mp3', durationSeconds: 1 },
      options: [
        { id: 'tone-a', label: 'Test tone A' },
        { id: 'tone-b', label: 'Test tone B' },
        { id: 'tone-c', label: 'Test tone C' },
        { id: 'tone-d', label: 'Test tone D' },
      ],
      correctOptionId: 'tone-b',
      explanation: 'Fixture tone B for playback checks only.',
      difficulty: 'easy',
    },
  ],
};
