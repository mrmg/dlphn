import fs from 'fs';
import { createCanvas } from 'canvas';

// Create assets directory if it doesn't exist
if (!fs.existsSync('src/assets')) {
    fs.mkdirSync('src/assets', { recursive: true });
}

// Function to create a simple image
function createImage(filename, width, height, color, text = '') {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);

    // Add text if provided
    if (text) {
        ctx.fillStyle = '#000000';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, width/2, height/2);
    }

    // Save the image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`src/assets/${filename}.png`, buffer);
}

// Create assets
createImage('background', 800, 600, '#87CEEB', 'Background');
createImage('dolphin', 100, 50, '#00BFFF', 'Dolphin');
createImage('homework', 60, 80, '#FFB6C1', 'HW');
createImage('pe-kit', 60, 80, '#000080', 'PE');
createImage('swimming-kit', 60, 80, '#00CED1', 'SWIM');
createImage('pipe', 80, 400, '#228B22', 'Pipe'); 