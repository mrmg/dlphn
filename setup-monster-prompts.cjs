const admin = require('firebase-admin');

// Initialize Firebase Admin with application default credentials
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'dolphin-thursday'
  });
}

const db = admin.firestore();

async function setupMonsterPrompts() {
  console.log('Setting up monster prompt templates...');

  const monsterTemplates = [
    {
      name: 'Horrid Henry Monster Basic',
      template: 'A Horrid Henry style monster illustration: ${monsterDescription}. Style: ${randomStyle}. The monster should be colorful, playful, and child-friendly with bold black outlines, bright vibrant colors (especially yellow, blue, green, purple, and red), exaggerated features like big eyes and sharp teeth, and a mischievous but friendly personality. Clean background, high contrast, easy to see details. IMPORTANT: Do not include any text, words, letters, numbers, or written content in the image. This must be a pure illustration without any text elements.',
      active: true,
      category: 'basic',
      description: 'Basic Horrid Henry style monster generation'
    },
    {
      name: 'Horrid Henry Monster Detailed',
      template: 'Create a mischievous monster in the style of Horrid Henry books: ${monsterDescription}. Art style: ${randomStyle}. The illustration should feature thick black outlines, bright saturated colors (yellow background, electric blue, lime green, purple, red accents), exaggerated cartoon features, sharp triangular teeth, big expressive eyes, spiky elements, and dynamic energy. Make it playful, child-friendly, and full of personality. Clean, uncluttered background with high contrast. IMPORTANT: Do not include any text, words, letters, numbers, or written content in the image. This must be a pure illustration without any text elements.',
      active: true,
      category: 'detailed',
      description: 'Detailed Horrid Henry style with more specific instructions'
    },
    {
      name: 'Horrid Henry Monster Playful',
      template: 'Draw a fun monster inspired by Horrid Henry: ${monsterDescription}. Style: ${randomStyle}. Use bold cartoon art with thick black outlines, bright colors (yellow, blue, green, purple, red), exaggerated features, sharp teeth, big eyes, spiky hair or spikes, and a mischievous grin. The monster should look playful and energetic, like it\'s up to some fun trouble. Clean background, high contrast, child-friendly design. IMPORTANT: Do not include any text, words, letters, numbers, or written content in the image. This must be a pure illustration without any text elements.',
      active: true,
      category: 'playful',
      description: 'Emphasizes playful and mischievous characteristics'
    },
    {
      name: 'Horrid Henry Monster Scary-Fun',
      template: 'Illustrate a monster in Horrid Henry style: ${monsterDescription}. Art style: ${randomStyle}. Make it look scary but fun - with sharp teeth, big eyes, spiky elements, and bold colors (yellow, blue, green, purple, red). Use thick black outlines, exaggerated cartoon features, and a mischievous expression. The monster should be intimidating but not frightening, more like a playful troublemaker. Clean background, high contrast. IMPORTANT: Do not include any text, words, letters, numbers, or written content in the image. This must be a pure illustration without any text elements.',
      active: true,
      category: 'scary-fun',
      description: 'Balances scary elements with fun, child-friendly design'
    },
    {
      name: 'Horrid Henry Monster Colorful',
      template: 'Create a vibrant monster in Horrid Henry book style: ${monsterDescription}. Style: ${randomStyle}. Use bright, saturated colors with thick black outlines - yellow background, electric blue, lime green, rich purple, bright red. Include exaggerated cartoon features, sharp triangular teeth, big round eyes, spiky elements, and dynamic poses. Make it colorful, cheerful, and full of energy. Clean background, high contrast, child-friendly.',
      active: true,
      category: 'colorful',
      description: 'Emphasizes bright, vibrant color palette'
    }
  ];

  try {
    // Clear existing templates
    console.log('Clearing existing monster templates...');
    const existingTemplates = await db.collection('monsterTemplates').get();
    const batch = db.batch();
    
    existingTemplates.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    if (!existingTemplates.empty) {
      await batch.commit();
      console.log('Cleared existing templates');
    }

    // Add new templates
    console.log('Adding new monster templates...');
    const addBatch = db.batch();
    
    monsterTemplates.forEach(template => {
      const docRef = db.collection('monsterTemplates').doc();
      addBatch.set(docRef, {
        ...template,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    await addBatch.commit();
    console.log('Successfully added monster templates!');
    
    // Verify templates were added
    const verifyTemplates = await db.collection('monsterTemplates').get();
    console.log(`Verified: ${verifyTemplates.size} templates added`);
    
    verifyTemplates.forEach(doc => {
      const data = doc.data();
      console.log(`- ${data.name} (${data.category})`);
    });

  } catch (error) {
    console.error('Error setting up monster templates:', error);
  }
}

// Run the setup
setupMonsterPrompts()
  .then(() => {
    console.log('Monster prompt setup complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });