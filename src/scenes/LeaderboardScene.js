import { getHighScores } from '../services/scoreService.js';

export class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LeaderboardScene' });
    }

    preload() {
        // Load background image
        this.load.image('background', 'assets/background.png');
    }

    create() {
        // Get game dimensions
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;

        // Add scrolling background
        this.background = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'background')
            .setOrigin(0, 0)
            .setScrollFactor(0);

        // Add title
        this.add.text(gameWidth / 2, gameHeight * 0.1, 'HIGH SCORES', {
            fontSize: `${gameWidth * 0.08}px`,
            color: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Add back button
        const backButton = this.add.rectangle(gameWidth * 0.1, gameHeight * 0.1, gameWidth * 0.2, gameHeight * 0.08, 0x4CAF50)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => backButton.setFillStyle(0x45a049))
            .on('pointerout', () => backButton.setFillStyle(0x4CAF50))
            .on('pointerdown', () => this.scene.start('GameScene'));

        this.add.text(gameWidth * 0.1, gameHeight * 0.1, 'BACK', {
            fontSize: `${gameWidth * 0.04}px`,
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Create loading text
        const loadingText = this.add.text(gameWidth / 2, gameHeight * 0.4, 'LOADING...', {
            fontSize: `${gameWidth * 0.04}px`,
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Fetch and display high scores
        this.displayHighScores(loadingText);
    }

    update() {
        // Scroll background very slowly
        if (this.background) {
            this.background.tilePositionX += 0.1;
        }
    }

    async displayHighScores(loadingText) {
        try {
            console.log('Fetching high scores...');
            const scores = await getHighScores(10);
            console.log('Scores received:', scores);
            
            if (!scores || scores.length === 0) {
                loadingText.setText('NO SCORES YET');
                return;
            }

            loadingText.destroy();

            const gameWidth = this.scale.width;
            const gameHeight = this.scale.height;
            const startY = gameHeight * 0.25;
            const lineHeight = gameHeight * 0.06;

            scores.forEach((score, index) => {
                const y = startY + (index * lineHeight);
                
                // Format score with leading zeros
                const formattedScore = score.score.toString().padStart(6, '0');
                
                // Create the score line with dots
                const name = score.name.padEnd(3, ' ');
                const dots = '.'.repeat(20 - name.length);
                const scoreText = `${name} ${dots} ${formattedScore}`;

                this.add.text(gameWidth / 2, y, scoreText, {
                    fontSize: `${gameWidth * 0.04}px`,
                    color: '#ffffff',
                    fontFamily: 'monospace',
                    stroke: '#000000',
                    strokeThickness: 4
                }).setOrigin(0.5);
            });
        } catch (error) {
            console.error('Error loading high scores:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            loadingText.setText(`ERROR: ${error.message}`);
        }
    }
} 