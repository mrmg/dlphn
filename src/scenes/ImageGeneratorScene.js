import { generateMemoryImage } from '../services/imageService';

export class ImageGeneratorScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ImageGeneratorScene' });
        this.memories = {
            peMemory: '',
            swimmingMemory: '',
            homeworkMemory: ''
        };
    }

    create() {
        // Add title
        this.add.text(400, 50, 'Memory Image Generator', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Create input fields
        this.createInputField('PE Memory', 150);
        this.createInputField('Swimming Memory', 250);
        this.createInputField('Homework Memory', 350);

        // Create generate button
        const generateButton = this.add.text(400, 450, 'Generate Image', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#4a90e2',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();

        generateButton.on('pointerdown', () => this.generateImage());
    }

    createInputField(label, y) {
        // Add label
        this.add.text(200, y, label, {
            fontSize: '20px',
            fill: '#fff'
        }).setOrigin(0, 0.5);

        // Create input field
        const input = document.createElement('input');
        input.type = 'text';
        input.style.width = '400px';
        input.style.height = '30px';
        input.style.padding = '5px';
        input.style.fontSize = '16px';

        const element = this.add.dom(400, y + 30, input);
        element.setOrigin(0.5);

        // Store reference to input
        this[`${label.toLowerCase().replace(' ', '')}Input`] = input;
    }

    async generateImage() {
        // Get values from inputs
        this.memories.peMemory = this.peMemoryInput.value;
        this.memories.swimmingMemory = this.swimmingMemoryInput.value;
        this.memories.homeworkMemory = this.homeworkMemoryInput.value;

        try {
            // Show loading state
            const loadingText = this.add.text(400, 500, 'Generating image...', {
                fontSize: '20px',
                fill: '#fff'
            }).setOrigin(0.5);

            // Generate image
            const result = await generateMemoryImage(this.memories);

            // Remove loading text
            loadingText.destroy();

            if (result.success) {
                // Display the generated image
                // Note: You'll need to handle the image data appropriately
                // This is a placeholder for the actual image display logic
                this.add.text(400, 500, 'Image generated successfully!', {
                    fontSize: '20px',
                    fill: '#fff'
                }).setOrigin(0.5);
            }
        } catch (error) {
            console.error('Error generating image:', error);
            this.add.text(400, 500, 'Error generating image. Please try again.', {
                fontSize: '20px',
                fill: '#ff0000'
            }).setOrigin(0.5);
        }
    }
} 