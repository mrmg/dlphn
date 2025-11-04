import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { generateMemoryImage } from './services/imageService.js';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD-35jua6EQ5md0fL1f7Bd4nnpz2wKXlUU",
  authDomain: "dolphin-thursday.firebaseapp.com",
  projectId: "dolphin-thursday",
  storageBucket: "dolphin-thursday.firebasestorage.app",
  messagingSenderId: "885293763604",
  appId: "1:885293763604:web:5f87d5cfcce0a43c33eb01"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const result = document.getElementById('result');
    const imageContainer = document.getElementById('imageContainer');

    generateBtn.addEventListener('click', async () => {
        const peMemory = document.getElementById('peMemory').value.trim();
        const swimmingMemory = document.getElementById('swimmingMemory').value.trim();
        const homeworkMemory = document.getElementById('homeworkMemory').value.trim();

        if (!peMemory || !swimmingMemory || !homeworkMemory) {
            error.textContent = 'Please fill in all three memories!';
            error.style.display = 'block';
            return;
        }

        // Hide previous results
        error.style.display = 'none';
        result.style.display = 'none';
        
        // Show loading
        loading.style.display = 'block';
        generateBtn.disabled = true;

        try {
            console.log('Generating image...');
            const imageResult = await generateMemoryImage({
                peMemory,
                swimmingMemory,
                homeworkMemory
            });

            console.log('Image generated successfully:', imageResult);

            // Hide loading
            loading.style.display = 'none';
            
            // Display the image
            if (imageResult.contentType === 'image/svg+xml') {
                // For SVG, decode and display directly
                const svgData = atob(imageResult.imageData);
                imageContainer.innerHTML = svgData;
            } else {
                // For PNG, create img element
                const img = document.createElement('img');
                img.src = `data:${imageResult.contentType};base64,${imageResult.imageData}`;
                img.alt = 'Generated Memory Art';
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.borderRadius = '10px';
                imageContainer.innerHTML = '';
                imageContainer.appendChild(img);
            }

            // Add metadata information
            const metaInfo = document.createElement('div');
            metaInfo.style.marginTop = '15px';
            metaInfo.style.fontSize = '14px';
            metaInfo.style.color = '#666';
            metaInfo.innerHTML = `
                <p><strong>Generation Method:</strong> ${imageResult.method === 'vertex_ai' ? 'AI Generated (Vertex AI)' : 'Artistic Fallback (SVG)'}</p>
                <p><strong>Query ID:</strong> ${imageResult.queryId}</p>
                <p><strong>Storage URL:</strong> <a href="${imageResult.imageUrl}" target="_blank">View Full Size</a></p>
                <p><em>Your memories and generated art have been saved to Firebase!</em></p>
            `;
            imageContainer.appendChild(metaInfo);

            // Show result
            result.style.display = 'block';

        } catch (err) {
            console.error('Error generating image:', err);
            loading.style.display = 'none';
            error.textContent = 'Error generating image: ' + err.message;
            error.style.display = 'block';
        } finally {
            generateBtn.disabled = false;
        }
    });
}); 