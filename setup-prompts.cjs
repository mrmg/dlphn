// Setup script to initialize Firestore with prompt templates
// Run this with: node setup-prompts.cjs

const admin = require('firebase-admin');

// Initialize Firebase Admin with explicit project ID
admin.initializeApp({
  projectId: 'dolphin-thursday'
});
const db = admin.firestore();

const promptTemplates = [
  {
    name: 'Original School Activities',
    template: `A colorful, artistic illustration depicting activities in a friendly, cohesive educational setting: Embodying \${peMemory}, \${swimmingMemory} and \${homeworkMemory} — all happening together in one vibrant, unified scene. Style: \${randomStyle}, creating a joyful, educational environment full of personality and detail.`,
    active: true,
    description: 'Simple, clean prompt focusing on school activities'
  },
  {
    name: 'Detailed School Scene',
    template: `A vibrant illustration showing school activities: \${peMemory} during physical education, \${swimmingMemory} in swimming activities, and \${homeworkMemory} during study time. Include school items like colorful rucksacks, PE kit tops, and homework folders. Add a "Dolphin Thursdays" logo on a banner or shirt. Style: \${randomStyle}, with bright colors and educational atmosphere.`,
    active: true,
    description: 'More detailed prompt with specific school items and branding'
  },
  {
    name: 'Abstract Memory Art',
    template: `An artistic interpretation of three memories: \${peMemory}, \${swimmingMemory}, and \${homeworkMemory}. Create an abstract composition that captures the essence of these experiences. Style: \${randomStyle}, with flowing forms and vibrant colors that represent the emotions of these memories.`,
    active: true,
    description: 'Abstract artistic interpretation of memories'
  },
  {
    name: 'Simple Test',
    template: `A simple cartoon drawing of a happy dog playing in a park.`,
    active: false,
    description: 'Simple test prompt that always works (for debugging)'
  },
  {
    name: 'Playground Scene',
    template: `A cheerful playground scene showing kids engaged in \${peMemory}, \${swimmingMemory}, and \${homeworkMemory}. The scene should be welcoming and fun, with playground equipment and school elements visible. Style: \${randomStyle}, emphasizing joy and learning.`,
    active: true,
    description: 'Playground-focused scene with activities'
  }
];

async function setupPrompts() {
  console.log('Setting up prompt templates in Firestore...');
  
  try {
    const batch = db.batch();
    
    for (const template of promptTemplates) {
      const docRef = db.collection('promptTemplates').doc();
      batch.set(docRef, {
        ...template,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    await batch.commit();
    console.log(`✅ Successfully added ${promptTemplates.length} prompt templates!`);
    
    // List the templates
    console.log('\n📝 Templates added:');
    promptTemplates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.name} (${template.active ? 'Active' : 'Inactive'})`);
      console.log(`   ${template.description}`);
    });
    
    console.log('\n🎯 You can now modify these templates in the Firebase Console under Firestore > promptTemplates');
    console.log('💡 Set active: false to disable a template, or add new ones with your own prompts!');
    
  } catch (error) {
    console.error('❌ Error setting up templates:', error);
  }
  
  process.exit(0);
}

setupPrompts(); 