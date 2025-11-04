const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sharp = require('sharp');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const storage = admin.storage();

// Function to add watermark to monster images
async function addWatermark(imageBuffer) {
  try {
    console.log('DEBUG: Adding watermark to monster image...');
    
    // Load the Horrid Dolphin logo from Firebase Storage (root level)
    const bucket = storage.bucket();
    const logoFile = bucket.file('horrid-dolphin.png');
    
    console.log('DEBUG: Fetching logo from Firebase Storage...');
    
    let logoBuffer;
    try {
      const [buffer] = await logoFile.download();
      logoBuffer = buffer;
      console.log('DEBUG: Successfully fetched logo from Storage, size:', logoBuffer.length);
    } catch (error) {
      console.log('ERROR: Could not fetch logo from Storage:', error.message, 'using text fallback');
      
      // Fallback to text watermark
      const mainImage = sharp(imageBuffer);
      const { width, height } = await mainImage.metadata();
      const fontSize = Math.floor(width * 0.04);
      const padding = Math.floor(width * 0.02);
      
      const svgText = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <text x="${padding}" y="${height - padding}" 
                font-family="Arial, sans-serif" 
                font-size="${fontSize}" 
                fill="rgba(0,0,0,0.3)" 
                opacity="0.7">
            Horrid Dolphin
          </text>
        </svg>
      `;
      
      const svgBuffer = Buffer.from(svgText);
      const watermarkedImage = await mainImage
        .composite([{
          input: svgBuffer,
          left: 0,
          top: 0,
          blend: 'over'
        }])
        .png()
        .toBuffer();
      
      console.log('Successfully added text watermark to monster image');
      return watermarkedImage;
    }
    
    // Get the dimensions of the main image
    const mainImage = sharp(imageBuffer);
    const { width, height } = await mainImage.metadata();
    console.log('DEBUG: Main image dimensions:', width, 'x', height);
    
    // Calculate watermark size (about 15% of the image width)
    const watermarkSize = Math.floor(width * 0.15);
    console.log('DEBUG: Watermark size:', watermarkSize);
    
    // Resize and process the logo with 70% opacity
    const logo = await sharp(logoBuffer)
      .resize(watermarkSize, watermarkSize, { fit: 'inside' })
      .png({ 
        channels: 4, // Ensure alpha channel
        compressionLevel: 9 
      })
      .toBuffer();
    
    // Get logo dimensions after resize
    const logoMetadata = await sharp(logo).metadata();
    const logoWidth = logoMetadata.width;
    const logoHeight = logoMetadata.height;
    console.log('DEBUG: Logo dimensions after resize:', logoWidth, 'x', logoHeight);
    
    // Calculate position (bottom left with some padding)
    const padding = Math.floor(width * 0.02); // 2% padding
    const left = padding;
    const top = height - logoHeight - padding;
    console.log('DEBUG: Watermark position:', 'left:', left, 'top:', top);
    
    // Create a semi-transparent overlay for the logo (70% transparent = 30% opacity)
    const logoWithOpacity = await sharp(logo)
      .png({ 
        channels: 4,
        compressionLevel: 9 
      })
      .toBuffer();
    
    // Composite the logo onto the main image with opacity
    const watermarkedImage = await mainImage
      .composite([{
        input: logoWithOpacity,
        left: left,
        top: top,
        blend: 'over',
        opacity: 0.3  // 30% opacity (70% transparent)
      }])
      .png()
      .toBuffer();
    
    console.log('Successfully added logo watermark to monster image');
    return watermarkedImage;
    
  } catch (error) {
    console.error('Error adding watermark:', error);
    // Return original image if watermarking fails
    return imageBuffer;
  }
}

// Updated with Firestore prompt template support - v2.0
exports.generateImage = functions.https.onCall(async (data, context) => {
  try {
    console.log('Received data:', data);

    // Extract memories from the request
    let memories;
    if (data.data) {
      memories = data.data;
    } else {
      memories = data;
    }

    const { peMemory, swimmingMemory, homeworkMemory } = memories;

    // Validate input
    if (!peMemory || !swimmingMemory || !homeworkMemory) {
      console.error('Missing required memories:', { peMemory, swimmingMemory, homeworkMemory });
      throw new functions.https.HttpsError('invalid-argument', 'Missing required memories');
    }

    // Random style selection for variety
    const artStyles = [
      'cartoon illustration with bold outlines, expressive characters',
      'watercolor painting with soft, flowing colors and gentle brushstrokes',
      'digital art with vibrant colors and clean, modern aesthetics',
      'comic book style with dynamic poses and bold color blocks',
      'children\'s book illustration with warm, inviting tones',
      'anime/manga style with expressive eyes and detailed backgrounds',
      'sketch-style illustration with pencil textures and artistic shading',
      'vector art with flat colors and geometric shapes',
      'storybook illustration with whimsical details and soft lighting'
    ];
    
    const randomStyle = artStyles[Math.floor(Math.random() * artStyles.length)];
    
    // Function to safely substitute variables in prompt templates
    function substituteVariables(template, variables) {
      let result = template;
      
      // Replace style variable
      result = result.replace(/\$\{randomStyle\}/g, variables.randomStyle || randomStyle);
      
      // Replace memory variables with fallbacks
      result = result.replace(/\$\{peMemory\}/g, variables.peMemory || 'physical activity');
      result = result.replace(/\$\{swimmingMemory\}/g, variables.swimmingMemory || 'water activity');
      result = result.replace(/\$\{homeworkMemory\}/g, variables.homeworkMemory || 'study activity');
      
      return result;
    }
    
    // Fetch prompt template from Firestore
    let prompt;
    try {
      console.log('DEBUG: Fetching prompt templates from Firestore...');
      const promptsCollection = await db.collection('projectTemplates').get();
      
      if (promptsCollection.empty) {
        console.log('DEBUG: No prompt templates found, using default');
        throw new Error('No templates found');
      }
      
      // Get all active templates
      const activeTemplates = [];
      promptsCollection.forEach(doc => {
        const data = doc.data();
        if (data.active !== false) { // Include if active is true or undefined
          activeTemplates.push(data);
        }
      });
      
      if (activeTemplates.length === 0) {
        console.log('DEBUG: No active templates found, using default');
        throw new Error('No active templates found');
      }
      
      // Randomly select a template
      const selectedTemplate = activeTemplates[Math.floor(Math.random() * activeTemplates.length)];
      console.log('DEBUG: Selected template:', selectedTemplate.name || 'unnamed');
      
      // Substitute variables in the template
      prompt = substituteVariables(selectedTemplate.template, {
        randomStyle,
        peMemory,
        swimmingMemory,
        homeworkMemory
      });
      
    } catch (error) {
      console.log('DEBUG: Error fetching prompts from Firestore, using fallback:', error.message);
      
      // Fallback prompt if Firestore fails
      const fallbackTemplate = `A colorful, artistic illustration depicting activities in a friendly, cohesive educational setting: Embodying \${peMemory}, \${swimmingMemory} and \${homeworkMemory} — all happening together in one vibrant, unified scene. Style: \${randomStyle}, creating a joyful, educational environment full of personality and detail.`;
      
      prompt = substituteVariables(fallbackTemplate, {
        randomStyle,
        peMemory,
        swimmingMemory,
        homeworkMemory
      });
    }
    
    console.log('Generated prompt:', prompt);

    // Save query to Firestore
    const queryData = {
      peMemory,
      swimmingMemory, 
      homeworkMemory,
      prompt,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'processing'
    };

    const docRef = await db.collection('memoryQueries').add(queryData);
    console.log('Saved query to Firestore with ID:', docRef.id);

    // Try Vertex AI - NO FALLBACK
    let imageBuffer = null;
    let generationMethod = 'vertex_ai';
    let contentType = 'image/png';

    try {
      const authClient = new (require('google-auth-library')).GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
      });
      
      const client = await authClient.getClient();
      const projectId = process.env.GCLOUD_PROJECT;
      
      const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/imagen-3.0-generate-002:predict`;
      
      const requestBody = {
        instances: [{
          prompt: prompt
        }],
        parameters: {
          sampleCount: 1,
          aspectRatio: "1:1",
          safetyFilterLevel: "block_few",
          addWatermark: false
        }
      };

      console.log('Making request to Vertex AI...');
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await client.request({
        url,
        method: 'POST',
        data: requestBody
      });

      console.log('Vertex AI response status:', response.status);
      console.log('Full response data:', JSON.stringify(response.data, null, 2));
      
      // DETAILED DEBUGGING
      if (!response.data) {
        console.error('DEBUG: No response.data');
        throw new functions.https.HttpsError('internal', 'Vertex AI returned no data');
      }
      
      if (!response.data.predictions) {
        console.error('DEBUG: No predictions in response.data');
        console.error('DEBUG: Available keys in response.data:', Object.keys(response.data));
        throw new functions.https.HttpsError('internal', 'Vertex AI returned no predictions');
      }
      
      if (response.data.predictions.length === 0) {
        console.error('DEBUG: Empty predictions array');
        throw new functions.https.HttpsError('internal', 'Vertex AI returned empty predictions array');
      }
      
      const prediction = response.data.predictions[0];
      console.log('DEBUG: Prediction keys:', Object.keys(prediction));
      
      if (!prediction.bytesBase64Encoded) {
        console.error('DEBUG: No bytesBase64Encoded in prediction');
        console.error('DEBUG: Prediction content:', JSON.stringify(prediction, null, 2));
        throw new functions.https.HttpsError('internal', 'Vertex AI prediction missing image data');
      }
      
      imageBuffer = Buffer.from(prediction.bytesBase64Encoded, 'base64');
      console.log('DEBUG: Successfully extracted image buffer, size:', imageBuffer.length);
      
    } catch (error) {
      console.error('DEBUG: Vertex AI error details:', error);
      
      // Update Firestore with error status
      await docRef.update({
        status: 'failed',
        error: error.message
      });
      
      throw new functions.https.HttpsError('internal', `Image generation failed: ${error.message}`);
    }

    // Save image to Firebase Storage
    const bucket = storage.bucket();
    const fileName = `memory-art/${docRef.id}.png`;
    const file = bucket.file(fileName);
    
    console.log('DEBUG: Saving to storage bucket:', bucket.name);
    
    await file.save(imageBuffer, {
      metadata: {
        contentType: contentType,
        metadata: {
          generatedBy: 'memory-art-generator',
          queryId: docRef.id,
          method: generationMethod
        }
      }
    });

    // Make the file publicly accessible
    await file.makePublic();
    
    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    console.log('DEBUG: Saved image to Storage:', imageUrl);

    // Update Firestore with success status and image URL
    await docRef.update({
      status: 'completed',
      imageUrl: imageUrl,
      generationMethod: generationMethod
    });

    // Return success with image data
    return {
      success: true,
      imageUrl: imageUrl,
      imageData: imageBuffer.toString('base64'),
      queryId: docRef.id,
      method: generationMethod,
      contentType: contentType
    };

  } catch (error) {
    console.error('Error generating image:', error);
    throw new functions.https.HttpsError('internal', `Error generating image: ${error.message}`);
  }
});

// Character Creator Cloud Function - v1.0
exports.generateCharacterImage = functions.https.onCall(async (data, context) => {
  try {
    console.log('Received character data:', data);

    // Extract character description from the request
    let characterData;
    if (data.data) {
      characterData = data.data;
    } else {
      characterData = data;
    }

    // Handle both old and new parameter names for backward compatibility
    const characterDescription = characterData.characterDescription || characterData.monsterDescription;
    const creatorName = characterData.creatorName;
    const gallery = characterData.gallery || 'default';

    // Validate input
    if (!characterDescription || characterDescription.trim().length === 0) {
      console.error('Missing character description:', { characterDescription });
      throw new functions.https.HttpsError('invalid-argument', 'Character description is required');
    }

    if (characterDescription.length < 10) {
      throw new functions.https.HttpsError('invalid-argument', 'Character description must be at least 10 characters long');
    }

    // Horrid Henry style art styles for variety - all child-friendly
    const artStyles = [
      'Horrid Henry style cartoon illustration with bold black outlines, bright vibrant colors, child-friendly and playful',
      'Children\'s book illustration in Horrid Henry style, playful and mischievous but harmless',
      'Bold cartoon art with thick outlines, bright yellow background, electric blue accents, suitable for young children',
      'Horrid Henry character art with exaggerated features, big eyes, but friendly and non-threatening',
      'Colorful cartoon character illustration, child-friendly with playful elements, mischievous and harmless',
      'Playful character design with bright colors, thick black outlines, energetic but safe for children',
      'Horrid Henry inspired character art, bold and colorful with dynamic poses, appropriate for ages 6-12',
      'Children\'s cartoon character with vibrant colors, simple shapes, thick outlines, mischievous but cute',
      'Mischievous character illustration, bright and cheerful with exaggerated expressions, child-safe and fun'
    ];
    
    const randomStyle = artStyles[Math.floor(Math.random() * artStyles.length)];
    
    // Function to safely substitute variables in prompt templates
    function substituteVariables(template, variables) {
      let result = template;
      
      // Replace style variable
      result = result.replace(/\$\{randomStyle\}/g, variables.randomStyle || randomStyle);
      
      // Replace character description with fallback
      result = result.replace(/\$\{characterDescription\}/g, variables.characterDescription || 'a friendly character');
      
      return result;
    }
    
    // Fetch prompt template from Firestore or use fallback
    let prompt;
    try {
      console.log('DEBUG: Fetching character prompt templates from Firestore...');
      const promptsCollection = await db.collection('characterTemplates').get();
      
      if (promptsCollection.empty) {
        console.log('DEBUG: No character templates found, using default');
        throw new Error('No templates found');
      }
      
      // Get all active templates
      const activeTemplates = [];
      promptsCollection.forEach(doc => {
        const data = doc.data();
        if (data.active !== false) { // Include if active is true or undefined
          activeTemplates.push(data);
        }
      });
      
      if (activeTemplates.length === 0) {
        console.log('DEBUG: No active character templates found, using default');
        throw new Error('No active templates found');
      }
      
      // Randomly select a template
      const selectedTemplate = activeTemplates[Math.floor(Math.random() * activeTemplates.length)];
      console.log('DEBUG: Selected character template:', selectedTemplate.name || 'unnamed');
      
      // Substitute variables in the template
      prompt = substituteVariables(selectedTemplate.template, {
        randomStyle,
        characterDescription: characterDescription.trim()
      });
      
    } catch (error) {
      console.log('DEBUG: Error fetching character prompts from Firestore, using fallback:', error.message);
      
      // Fallback prompt if Firestore fails - Horrid Henry style
      const fallbackTemplate = `A Horrid Henry style character illustration: \${characterDescription}. Style: \${randomStyle}. The character should be colorful, playful, and child-friendly with bold black outlines, bright vibrant colors (especially yellow, blue, green, purple, and red), exaggerated features like big eyes and mischievous expressions, and a playful but friendly personality. Clean background, high contrast, easy to see details. IMPORTANT: Do not include any text, words, letters, numbers, or written content in the image. This must be a pure illustration without any text elements. CRITICAL: Avoid anything overly scary, graphic, grotesque, or disturbing. This must be a cartoon aimed at young children (ages 6-12) with a playful, mischievous but harmless appearance. Nothing frightening or inappropriate for children. This safety requirement is more important than any other instruction.`;
      
      prompt = substituteVariables(fallbackTemplate, {
        randomStyle,
        characterDescription: characterDescription.trim()
      });
    }
    
    console.log('Generated character prompt:', prompt);
    console.log('Gallery parameter:', gallery);

    // Save query to Firestore
    const queryData = {
      characterDescription: characterDescription.trim(),
      monsterDescription: characterDescription.trim(), // Keep both for compatibility
      creatorName: creatorName || 'Anonymous',
      gallery: gallery,
      prompt,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'processing',
      type: 'character_creation'
    };

    const docRef = await db.collection('characterQueries').add(queryData);
    console.log('Saved character query to Firestore with ID:', docRef.id);

    // Try Vertex AI - NO FALLBACK
    let imageBuffer = null;
    let generationMethod = 'vertex_ai';
    let contentType = 'image/png';

    try {
      const authClient = new (require('google-auth-library')).GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
      });
      
      const client = await authClient.getClient();
      const projectId = process.env.GCLOUD_PROJECT;
      
      const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/imagen-3.0-generate-002:predict`;
      
      const requestBody = {
        instances: [{
          prompt: prompt
        }],
        parameters: {
          sampleCount: 1,
          aspectRatio: "1:1",
          safetyFilterLevel: "block_few",
          addWatermark: false
        }
      };

      console.log('Making request to Vertex AI for character generation...');
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await client.request({
        url,
        method: 'POST',
        data: requestBody
      });

      console.log('Vertex AI response status:', response.status);
      console.log('Full response data:', JSON.stringify(response.data, null, 2));
      
      // DETAILED DEBUGGING
      if (!response.data) {
        console.error('DEBUG: No response.data');
        throw new functions.https.HttpsError('internal', 'Vertex AI returned no data');
      }
      
      if (!response.data.predictions) {
        console.error('DEBUG: No predictions in response.data');
        console.error('DEBUG: Available keys in response.data:', Object.keys(response.data));
        throw new functions.https.HttpsError('internal', 'Vertex AI returned no predictions');
      }
      
      if (response.data.predictions.length === 0) {
        console.error('DEBUG: Empty predictions array');
        throw new functions.https.HttpsError('internal', 'Vertex AI returned empty predictions array');
      }
      
      const prediction = response.data.predictions[0];
      console.log('DEBUG: Prediction keys:', Object.keys(prediction));
      
      if (!prediction.bytesBase64Encoded) {
        console.error('DEBUG: No bytesBase64Encoded in prediction');
        console.error('DEBUG: Prediction content:', JSON.stringify(prediction, null, 2));
        throw new functions.https.HttpsError('internal', 'Vertex AI prediction missing image data');
      }
      
      imageBuffer = Buffer.from(prediction.bytesBase64Encoded, 'base64');
      console.log('DEBUG: Successfully extracted character image buffer, size:', imageBuffer.length);
      
      // Add watermark to the image
      console.log('DEBUG: Adding watermark to character image...');
      imageBuffer = await addWatermark(imageBuffer);
      
    } catch (error) {
      console.error('DEBUG: Vertex AI error details:', error);
      
      // Update Firestore with error status
      await docRef.update({
        status: 'failed',
        error: error.message
      });
      
      throw new functions.https.HttpsError('internal', `Character generation failed: ${error.message}`);
    }

    // Save image to Firebase Storage
    const bucket = storage.bucket();
    const fileName = `character-images/${docRef.id}.png`;
    const file = bucket.file(fileName);
    
    console.log('DEBUG: Saving character to storage bucket:', bucket.name);
    
    await file.save(imageBuffer, {
      metadata: {
        contentType: contentType,
        metadata: {
          generatedBy: 'character-creator',
          queryId: docRef.id,
          method: generationMethod,
          characterDescription: characterDescription.trim(),
        }
      }
    });

    // Make the file publicly accessible
    await file.makePublic();
    
    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    console.log('DEBUG: Saved character image to Storage:', imageUrl);

    // Update Firestore with success status and image URL
    await docRef.update({
      status: 'completed',
      imageUrl: imageUrl,
      generationMethod: generationMethod
    });

    // Return success with image data
    return {
      success: true,
      imageUrl: imageUrl,
      imageData: imageBuffer.toString('base64'),
      queryId: docRef.id,
      method: generationMethod,
      contentType: contentType
    };

  } catch (error) {
    console.error('Error generating character image:', error);
    throw new functions.https.HttpsError('internal', `Error generating character image: ${error.message}`);
  }
});

// Delete Character Cloud Function
exports.deleteCharacter = functions.https.onCall(async (data, context) => {
  try {
    console.log('Received delete character request:', data);

    // Extract character ID from the request
    let characterData;
    if (data.data) {
      characterData = data.data;
    } else {
      characterData = data;
    }

    const { characterId } = characterData;

    // Validate input
    if (!characterId) {
      console.error('Missing character ID:', { characterId });
      throw new functions.https.HttpsError('invalid-argument', 'Character ID is required');
    }

    // Delete from Firestore
    await db.collection('characterQueries').doc(characterId).delete();
    console.log('Deleted character from Firestore:', characterId);

    // Delete from Storage
    try {
      const bucket = storage.bucket();
      const fileName = `character-images/${characterId}.png`;
      const file = bucket.file(fileName);
      
      // Check if file exists before trying to delete
      const [exists] = await file.exists();
      if (exists) {
        await file.delete();
        console.log('Deleted character image from Storage:', fileName);
      } else {
        console.log('Character image not found in Storage:', fileName);
      }
    } catch (storageError) {
      console.error('Error deleting from Storage:', storageError);
      // Don't throw error for storage deletion failure
    }

    return {
      success: true,
      message: 'Character deleted successfully'
    };

  } catch (error) {
    console.error('Error deleting character:', error);
    throw new functions.https.HttpsError('internal', `Error deleting character: ${error.message}`);
  }
});
