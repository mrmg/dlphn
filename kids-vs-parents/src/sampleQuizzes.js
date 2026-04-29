export const sampleQuizzes = {
  'east-sussex': {
    quiz: {
      slug: 'east-sussex',
      title: 'East Sussex Quiz',
      topic: 'Local History & Geography',
      isActive: true
    },
    questions: [
      {
        id: 'q1',
        order: 1,
        text: 'What year was the Battle of Hastings?',
        hint: 'Think about the Norman Conquest',
        options: [
          { id: 'a', text: '1066' },
          { id: 'b', text: '1666' },
          { id: 'c', text: '1966' },
          { id: 'd', text: '1016' }
        ],
        correctOptionId: 'a',
        explanation: 'The Battle of Hastings was fought on 14 October 1066.'
      },
      {
        id: 'q2',
        order: 2,
        text: 'Who won the Battle of Hastings?',
        hint: 'He later became known as "the Conqueror"',
        options: [
          { id: 'a', text: 'King Harold' },
          { id: 'b', text: 'William of Normandy' },
          { id: 'c', text: 'Henry VIII' },
          { id: 'd', text: 'Julius Caesar' }
        ],
        correctOptionId: 'b',
        explanation: 'William of Normandy (later William the Conqueror) defeated King Harold.'
      },
      {
        id: 'q3',
        order: 3,
        text: 'Which shield shape is most closely linked with the Saxons?',
        media: {
          type: 'image',
          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Anglo-Saxon_Shield_%28composite%29.png/800px-Anglo-Saxon_Shield_%28composite%29.png',
          altText: 'A round Anglo-Saxon shield',
          caption: 'Anglo-Saxon shield design'
        },
        options: [
          { id: 'a', text: 'Round' },
          { id: 'b', text: 'Kite-shaped' },
          { id: 'c', text: 'Square' },
          { id: 'd', text: 'Triangular' }
        ],
        correctOptionId: 'a',
        explanation: 'Saxon warriors used round wooden shields, often with a metal boss in the centre.'
      },
      {
        id: 'q4',
        order: 4,
        text: 'Which army was known for kite-shaped shields?',
        options: [
          { id: 'a', text: 'Saxons' },
          { id: 'b', text: 'Normans' },
          { id: 'c', text: 'Romans' },
          { id: 'd', text: 'Vikings' }
        ],
        correctOptionId: 'b',
        explanation: 'The Normans used long kite-shaped shields that protected their legs while on horseback.'
      },
      {
        id: 'q5',
        order: 5,
        text: 'What famous picture-story tells of the Norman conquest?',
        media: {
          type: 'image',
          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Bayeux_Tapestry_scene57_Harold_death.jpg/1024px-Bayeux_Tapestry_scene57_Harold_death.jpg',
          altText: 'A section of the Bayeux Tapestry showing the battle',
          caption: 'The Bayeux Tapestry tells the story of the Norman conquest'
        },
        options: [
          { id: 'a', text: 'Bayeux Tapestry' },
          { id: 'b', text: 'Rosetta Stone' },
          { id: 'c', text: 'Domesday Book' },
          { id: 'd', text: 'Magna Carta' }
        ],
        correctOptionId: 'a',
        explanation: 'The Bayeux Tapestry is a 70-metre-long embroidered cloth depicting the events leading to the conquest.'
      },
      {
        id: 'q6',
        order: 6,
        text: 'What was the Battle of Hastings fought over?',
        options: [
          { id: 'a', text: 'Who invented chips' },
          { id: 'b', text: 'Who would be king of England' },
          { id: 'c', text: 'Who owned the land' },
          { id: 'd', text: 'Who had the best horse' }
        ],
        correctOptionId: 'b',
        explanation: 'Both William and Harold claimed the English throne after King Edward the Confessor died.'
      },
      {
        id: 'q7',
        order: 7,
        text: 'Where exactly was the Battle of Hastings fought?',
        hint: 'It is not actually in Hastings town itself',
        options: [
          { id: 'a', text: 'On Hastings Pier' },
          { id: 'b', text: 'Near what is now Battle' },
          { id: 'c', text: 'On the beach at Hastings' },
          { id: 'd', text: 'In Hastings Castle' }
        ],
        correctOptionId: 'b',
        explanation: 'The battle was fought about 7 miles northwest of Hastings, near the present-day town of Battle.'
      },
      {
        id: 'q8',
        order: 8,
        text: 'What building marks the site of the battle today?',
        media: {
          type: 'image',
          url: '',
          altText: 'Battle Abbey in East Sussex',
          caption: 'The high altar of Battle Abbey marks where King Harold fell'
        },
        options: [
          { id: 'a', text: 'Battle Abbey' },
          { id: 'b', text: 'Bodiam Castle' },
          { id: 'c', text: 'Herstmonceux Castle' },
          { id: 'd', text: 'Lewes Priory' }
        ],
        correctOptionId: 'a',
        explanation: 'William the Conqueror built Battle Abbey on the site, with the high altar marking where Harold fell.'
      },
      {
        id: 'q9',
        order: 9,
        text: 'What appeared in the sky in 1066 and was seen as an omen?',
        options: [
          { id: 'a', text: 'A solar eclipse' },
          { id: 'b', text: 'Halley\'s Comet' },
          { id: 'c', text: 'The Northern Lights' },
          { id: 'd', text: 'A shooting star' }
        ],
        correctOptionId: 'b',
        explanation: 'Halley\'s Comet appeared in 1066 and was seen as a bad omen for King Harold. It is depicted on the Bayeux Tapestry.'
      },
      {
        id: 'q10',
        order: 10,
        text: 'The Bayeux Tapestry is technically what?',
        options: [
          { id: 'a', text: 'An embroidered cloth' },
          { id: 'b', text: 'A woven tapestry' },
          { id: 'c', text: 'A stone carving' },
          { id: 'd', text: 'A painted scroll' }
        ],
        correctOptionId: 'a',
        explanation: 'Despite its name, the Bayeux Tapestry is actually an embroidered cloth, not a woven tapestry.'
      },
      {
        id: 'q11',
        order: 11,
        text: 'What is the county town of East Sussex?',
        options: [
          { id: 'a', text: 'Brighton' },
          { id: 'b', text: 'Lewes' },
          { id: 'c', text: 'Eastbourne' },
          { id: 'd', text: 'Hastings' }
        ],
        correctOptionId: 'b',
        explanation: 'Lewes is the county town of East Sussex, famous for its castle and bonfire celebrations.'
      },
      {
        id: 'q12',
        order: 12,
        text: 'Which famous white cliffs are in East Sussex?',
        media: {
          type: 'image',
          url: '',
          altText: 'The Seven Sisters cliffs in East Sussex',
          caption: 'The iconic white chalk cliffs of the Seven Sisters'
        },
        options: [
          { id: 'a', text: 'White Cliffs of Dover' },
          { id: 'b', text: 'Seven Sisters' },
          { id: 'c', text: 'Beachy Head' },
          { id: 'd', text: 'Old Harry Rocks' }
        ],
        correctOptionId: 'b',
        explanation: 'The Seven Sisters are a series of chalk cliffs between Seaford and Eastbourne in East Sussex.'
      },
      {
        id: 'q13',
        order: 13,
        text: 'Which seaside resort in East Sussex has a famous pier and Royal Pavilion?',
        options: [
          { id: 'a', text: 'Hastings' },
          { id: 'b', text: 'Brighton' },
          { id: 'c', text: 'Eastbourne' },
          { id: 'd', text: 'Bexhill-on-Sea' }
        ],
        correctOptionId: 'b',
        explanation: 'Brighton is famous for its Royal Pavilion, pier, and vibrant seafront.'
      },
      {
        id: 'q14',
        order: 14,
        text: 'What castle in East Sussex is surrounded by a moat and looks like something from a fairy tale?',
        media: {
          type: 'image',
          url: '',
          altText: 'Bodiam Castle with its wide moat',
          caption: 'Bodiam Castle, a 14th-century moated castle near Robertsbridge'
        },
        options: [
          { id: 'a', text: 'Bodiam Castle' },
          { id: 'b', text: 'Arundel Castle' },
          { id: 'c', text: 'Lewes Castle' },
          { id: 'd', text: 'Hastings Castle' }
        ],
        correctOptionId: 'a',
        explanation: 'Bodiam Castle is a stunning 14th-century moated castle near Robertsbridge, built by Sir Edward Dalyngrigge.'
      },
      {
        id: 'q15',
        order: 15,
        text: 'What is the highest point in East Sussex?',
        options: [
          { id: 'a', text: 'Beachy Head' },
          { id: 'b', text: 'Ditchling Beacon' },
          { id: 'c', text: 'Crowborough Beacon' },
          { id: 'd', text: 'Ashdown Forest' }
        ],
        correctOptionId: 'b',
        explanation: 'Ditchling Beacon is the highest point in East Sussex at 248 metres, offering views across the South Downs.'
      },
      {
        id: 'q16',
        order: 16,
        text: 'Which famous children\'s author lived in Ashdown Forest and set his stories there?',
        options: [
          { id: 'a', text: 'A.A. Milne' },
          { id: 'b', text: 'J.K. Rowling' },
          { id: 'c', text: 'Roald Dahl' },
          { id: 'd', text: 'Enid Blyton' }
        ],
        correctOptionId: 'a',
        explanation: 'A.A. Milne wrote the Winnie-the-Pooh stories, set in Ashdown Forest in East Sussex.'
      },
      {
        id: 'q17',
        order: 17,
        text: 'What natural landmark in Hastings was formed by erosion and has a famous hole through it?',
        media: {
          type: 'image',
          url: '',
          altText: 'Photo question — natural rock arch',
          caption: 'A natural arch formed by coastal erosion'
        },
        options: [
          { id: 'a', text: 'Durdle Door' },
          { id: 'b', text: 'The Needles' },
          { id: 'c', text: 'The Stade' },
          { id: 'd', text: 'Ecclesbourne Glen' }
        ],
        correctOptionId: 'c',
        explanation: 'The Stade is Hastings\' famous shingle beach and home to Europe\'s largest fleet of beach-launched fishing boats.'
      },
      {
        id: 'q18',
        order: 18,
        text: 'What annual event in Lewes is famous for its fiery processions?',
        options: [
          { id: 'a', text: 'Lewes Bonfire Night' },
          { id: 'b', text: 'Brighton Festival' },
          { id: 'c', text: 'Hastings Pirate Day' },
          { id: 'd', text: 'Glyndebourne Opera' }
        ],
        correctOptionId: 'a',
        explanation: 'Lewes Bonfire Night is the UK\'s biggest 5th November celebration, with spectacular fire processions through the town.'
      },
      {
        id: 'q19',
        order: 19,
        text: 'What ancient trackway runs across the South Downs through East Sussex?',
        options: [
          { id: 'a', text: 'The Ridgeway' },
          { id: 'b', text: 'The South Downs Way' },
          { id: 'c', text: 'The Pilgrims\' Way' },
          { id: 'd', text: 'Hadrian\'s Wall Path' }
        ],
        correctOptionId: 'b',
        explanation: 'The South Downs Way is a 160km National Trail running from Winchester to Eastbourne across the South Downs.'
      },
      {
        id: 'q20',
        order: 20,
        text: 'In the Battle of Hastings, roughly how many soldiers fought altogether?',
        options: [
          { id: 'a', text: 'Around 2,000' },
          { id: 'b', text: 'Around 7,000–14,000' },
          { id: 'c', text: 'Around 50,000' },
          { id: 'd', text: 'Around 100,000' }
        ],
        correctOptionId: 'b',
        explanation: 'Historians estimate roughly 7,000–14,000 soldiers fought at Hastings — William had about 7,000 and Harold about 7,000.'
      }
    ]
  },
  'space-explorers': {
    quiz: {
      slug: 'space-explorers',
      title: 'Space Explorers Quiz',
      topic: 'Science',
      isActive: false
    },
    questions: [
      {
        id: 'sq1',
        order: 1,
        text: 'Which planet is known as the Red Planet?',
        options: [
          { id: 'a', text: 'Mars' },
          { id: 'b', text: 'Venus' },
          { id: 'c', text: 'Saturn' },
          { id: 'd', text: 'Jupiter' }
        ],
        correctOptionId: 'a',
        explanation: 'Mars appears red because of iron oxide (rust) on its surface.'
      },
      {
        id: 'sq2',
        order: 2,
        text: 'What force keeps planets in orbit around the sun?',
        options: [
          { id: 'a', text: 'Magnetism' },
          { id: 'b', text: 'Gravity' },
          { id: 'c', text: 'Wind pressure' },
          { id: 'd', text: 'Friction' }
        ],
        correctOptionId: 'b',
        explanation: 'Gravity is the force that pulls objects toward each other, keeping planets in orbit.'
      },
      {
        id: 'sq3',
        order: 3,
        text: 'What do you call a rock that enters Earth\'s atmosphere and burns up?',
        media: {
          type: 'image',
          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Leonid_Meteor.jpg/1024px-Leonid_Meteor.jpg',
          altText: 'A meteor streaking across the night sky',
          caption: 'A meteor burning up in Earth\'s atmosphere'
        },
        options: [
          { id: 'a', text: 'Meteor' },
          { id: 'b', text: 'Asteroid' },
          { id: 'c', text: 'Comet' },
          { id: 'd', text: 'Planetoid' }
        ],
        correctOptionId: 'a',
        explanation: 'When a meteoroid enters the atmosphere, the streak of light it creates is called a meteor (shooting star).'
      }
    ]
  }
};
