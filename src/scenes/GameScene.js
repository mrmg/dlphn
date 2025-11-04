import { getHighScores, saveScore } from '../services/scoreService.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        Object.defineProperty(this, "dolphin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "playerName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: localStorage.getItem('playerName') || ''
        });
        Object.defineProperty(this, "nameInput", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "nameInputText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "nameInputContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "pipes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "items", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "score", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "hiScore", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "scoreText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hiScoreText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "gameOver", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "gameStarted", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "background", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "gameWidth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "gameHeight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "startText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "topBoundary", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "bottomBoundary", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "gameTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "initialGap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0.6
        }); // Initial gap size as percentage of screen height
        Object.defineProperty(this, "minGap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0.2
        }); // Minimum gap size as percentage of screen height
        Object.defineProperty(this, "gapDecreaseRate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0.0005
        }); // How quickly the gap decreases over time
        Object.defineProperty(this, "basePipeSpeed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 150
        }); // Base speed of pipe movement (slower start)
        Object.defineProperty(this, "baseItemSpeed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        }); // Base speed of item movement (slower start)
        Object.defineProperty(this, "speedStep", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0.2
        }); // How much speed increases each step
        Object.defineProperty(this, "speedLevel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        }); // Current speed level
        Object.defineProperty(this, "currentSpeedMultiplier", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        }); // Start at base speed
        Object.defineProperty(this, "speedLevelText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "timerText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "timeScore", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        }); // Score from time survived
        Object.defineProperty(this, "itemPoints", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                'homework': 100,
                'pe-kit': 50,
                'swimming-kit': 75,
                'pe-shorts': 25,
                'goggles': 30
            }
        });
        Object.defineProperty(this, "startButton", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "gameOverContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "backgroundMusic", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "startSound", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "collectSound", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dolphinSound", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "muteButton", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isMuted", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    preload() {
        // Load game assets
        this.load.image('background', 'assets/background.png');
        this.load.image('dolphin', 'assets/dolphin.png');
        this.load.image('homework', 'assets/homework.png');
        this.load.image('pe-kit', 'assets/pe-kit.png');
        this.load.image('swimming-kit', 'assets/swimming-kit.png');
        this.load.image('pe-shorts', 'assets/pe-shorts.png');
        this.load.image('goggles', 'assets/goggles.png');
        this.load.image('pipe', 'assets/pipe.png');
        this.load.image('bubble', 'assets/bubble.png');
        // Load sounds
        this.load.audio('loop', 'assets/loop.mp3');
        this.load.audio('start', 'assets/start.mp3');
        this.load.audio('collect', 'assets/collect.mp3');
        this.load.audio('dolphin', 'assets/dolphin.mp3');
    }
    create() {
        // Load hi-score from localStorage
        const savedHiScore = localStorage.getItem('hiScore');
        this.hiScore = savedHiScore ? parseInt(savedHiScore, 10) : 0;
        // Create hi-score text (centered)
        this.hiScoreText = this.add.text(this.gameWidth / 2, 15, 'Hi-Score: ' + this.hiScore, {
            fontSize: `20px`,
            color: '#000',
            fontFamily: 'Arial',
            stroke: '#fff',
            strokeThickness: 4
        }).setOrigin(0.5, 0).setDepth(1000);
        // Create score text (centered)
        this.scoreText = this.add.text(this.gameWidth / 2, 40, 'Score: 0', {
            fontSize: `20px`,
            color: '#000',
            fontFamily: 'Arial',
            stroke: '#fff',
            strokeThickness: 4
        }).setOrigin(0.5, 0).setDepth(1000);
        // Create speed level text (centered)
        this.speedLevelText = this.add.text(this.gameWidth / 2, 65, 'Speed: 1', {
            fontSize: `20px`,
            color: '#000',
            fontFamily: 'Arial',
            stroke: '#fff',
            strokeThickness: 4
        }).setOrigin(0.5, 0).setDepth(1000);
        
        // Create timer text (centered)
        this.timerText = this.add.text(this.gameWidth / 2, 90, 'Time: 0:00', {
            fontSize: `20px`,
            color: '#000',
            fontFamily: 'Arial',
            stroke: '#fff',
            strokeThickness: 4
        }).setOrigin(0.5, 0).setDepth(1000);
        // Reset game state
        this.gameOver = false;
        this.gameStarted = false;
        this.score = 0;
        this.timeScore = 0;
        this.gameTime = 0;
        this.speedLevel = 1;
        this.currentSpeedMultiplier = 1;
        // Store game dimensions
        this.gameWidth = this.scale.width;
        this.gameHeight = this.scale.height;
        // Add scrolling background
        this.background = this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight, 'background')
            .setOrigin(0, 0);
        // Create boundaries as static physics groups
        this.topBoundary = this.physics.add.staticGroup();
        this.bottomBoundary = this.physics.add.staticGroup();
        const topBound = this.topBoundary.create(0, 0, 'pipe');
        topBound.setSize(this.gameWidth, 1).setVisible(false);
        const bottomBound = this.bottomBoundary.create(0, this.gameHeight, 'pipe');
        bottomBound.setSize(this.gameWidth, 1).setVisible(false);

        // Create dolphin with larger scale
        this.dolphin = this.physics.add.sprite(this.gameWidth * 0.2, this.gameHeight * 0.5, 'dolphin')
            .setScale(this.gameWidth * 0.003)
            .setOrigin(0.5);
        // Set up dolphin physics with smaller hit box
        this.dolphin.setGravityY(800);
        this.dolphin.setBounce(0.2);
        this.dolphin.setCollideWorldBounds(false);
        this.dolphin.setSize(this.dolphin.width * 0.8, this.dolphin.height * 0.8);

        // Create items group as regular sprites
        this.items = this.add.group();
        this.createItems();
        // Create pipes group
        this.pipes = this.add.group();
        this.createPipes();
        // Add speed level text
       
        // Create start screen UI
        this.createStartScreen();
        // Set up collisions
        this.physics.add.collider(this.dolphin, this.topBoundary, this.handleGameOver, undefined, this);
        this.physics.add.collider(this.dolphin, this.bottomBoundary, this.handleGameOver, undefined, this);
        // Set up input handlers
        if (this.input.keyboard) {
            this.input.keyboard.on('keydown-SPACE', this.handleJump, this);
        }
        this.input.on('pointerdown', this.handleJump, this);
        // Initialize sounds
        this.backgroundMusic = this.sound.add('loop', { loop: true, volume: 0.5 });
        this.startSound = this.sound.add('start', { volume: 0.7 });
        this.collectSound = this.sound.add('collect', { volume: 0.7 });
        this.dolphinSound = this.sound.add('dolphin', { volume: 0.7 });
        // Create mute button
        this.createMuteButton();
        
        // Create back to menu button
        this.createBackToMenuButton();
        // Apply current mute state to sounds
        if (this.isMuted) {
            if (this.backgroundMusic) {
                this.backgroundMusic.setVolume(0);
            }
            if (this.startSound) {
                this.startSound.setVolume(0);
            }
            if (this.collectSound) {
                this.collectSound.setVolume(0);
            }
            if (this.dolphinSound) {
                this.dolphinSound.setVolume(0);
            }
            // Update speaker icon to show muted state
            const speakerIcon = this.muteButton?.getAt(1);
            speakerIcon.setText('🔇');
        }
        // Pause the game initially
        this.physics.pause();

        // Spawn initial set of pipes
        const spawnInitialPipes = () => {
            const currentGap = this.initialGap;
            const gapHeight = this.gameHeight * currentGap;
            const centerY = Phaser.Math.Between(this.gameHeight * 0.2 + gapHeight / 2, this.gameHeight * 0.8 - gapHeight / 2);
            
            // Create top pipe container
            const topPipeContainer = this.add.container(this.gameWidth + 100, centerY - gapHeight / 2);
            // Create top pipe
            const topPipe = this.add.sprite(0, 0, 'pipe');
            topPipe.setScale(this.gameWidth * 0.0016);
            topPipe.setOrigin(0.5, 1);
            topPipeContainer.add([topPipe]);
            this.pipes.add(topPipeContainer);
            
            // Create bottom pipe container
            const bottomPipeContainer = this.add.container(this.gameWidth + 100, centerY + gapHeight / 2);
            // Create bottom pipe
            const bottomPipe = this.add.sprite(0, 0, 'pipe');
            bottomPipe.setScale(this.gameWidth * 0.0016);
            bottomPipe.setOrigin(0.5, 0);
            bottomPipe.setFlipY(true);
            bottomPipeContainer.add([bottomPipe]);
            this.pipes.add(bottomPipeContainer);
        };

        spawnInitialPipes();
    }
    update(time, delta) {
        if (!this.gameStarted || this.gameOver)
            return;
        // Update game time
        this.gameTime += delta;
        // Add time-based score (1 point per second)
        this.timeScore = Math.floor(this.gameTime / 1000);
        this.updateScore();
        
        // Update timer display
        this.updateTimer();
        // Check if it's time to increase speed (every 10 seconds)
        const newSpeedLevel = Math.floor(this.gameTime / 10000) + 1;
        if (newSpeedLevel > this.speedLevel) {
            this.speedLevel = newSpeedLevel;
            this.speedLevelText.setText(`Speed: ${this.speedLevel}`);
            // Visual feedback for speed increase
            this.tweens.add({
                targets: this.speedLevelText,
                scale: 1.5,
                duration: 200,
                yoyo: true,
                ease: 'Power2'
            });
            // Smoothly transition to new speed over 3 seconds
            this.tweens.add({
                targets: this,
                currentSpeedMultiplier: this.speedLevel,
                duration: 3000,
                ease: 'Sine.easeInOut'
            });
        }
        // Scroll background faster as game progresses
        this.background.tilePositionX += (2 * this.currentSpeedMultiplier) / 5;
        // Rotate dolphin based on velocity
        if (this.dolphin.body) {
            this.dolphin.angle = this.dolphin.body.velocity.y * 0.1;
        }

        // Track pipes that need to be destroyed
        const pipesToDestroy = [];

        // Move pipes and check collisions
        this.pipes.getChildren().forEach((pipeContainer) => {
            pipeContainer.x -= this.basePipeSpeed * this.currentSpeedMultiplier * (delta / 1000);
            // Get the pipe sprite from the container
            const pipe = pipeContainer.getAt(0);
            // Check collision with dolphin
            if (this.checkPipeCollision(this.dolphin, pipeContainer)) {
                this.handleGameOver();
            }
            // Check if pipe has left the screen
            if (pipeContainer.x < -pipe.width) {
                pipesToDestroy.push(pipeContainer);
            }
        });

        // If we have exactly 2 pipes to destroy, it's a complete set
        if (pipesToDestroy.length === 2) {
            pipesToDestroy.forEach(pipe => pipe.destroy());
            
            // Spawn new pipes
            const currentGap = Math.max(this.minGap, this.initialGap - (this.gameTime * this.gapDecreaseRate));
            const gapHeight = this.gameHeight * currentGap;
            const centerY = Phaser.Math.Between(this.gameHeight * 0.2 + gapHeight / 2, this.gameHeight * 0.8 - gapHeight / 2);
            
            // Create top pipe container
            const topPipeContainer = this.add.container(this.gameWidth + 100, centerY - gapHeight / 2);
            // Create top pipe
            const topPipe = this.add.sprite(0, 0, 'pipe');
            topPipe.setScale(this.gameWidth * 0.0016);
            topPipe.setOrigin(0.5, 1);
            topPipeContainer.add([topPipe]);
            this.pipes.add(topPipeContainer);
            
            // Create bottom pipe container
            const bottomPipeContainer = this.add.container(this.gameWidth + 100, centerY + gapHeight / 2);
            // Create bottom pipe
            const bottomPipe = this.add.sprite(0, 0, 'pipe');
            bottomPipe.setScale(this.gameWidth * 0.0016);
            bottomPipe.setOrigin(0.5, 0);
            bottomPipe.setFlipY(true);
            bottomPipeContainer.add([bottomPipe]);
            this.pipes.add(bottomPipeContainer);
        }

        // Move items horizontally at fixed heights and check collisions
        this.items.getChildren().forEach((item) => {
            const sprite = item;
            // Only move horizontally, maintain fixed y position
            sprite.x -= this.basePipeSpeed * this.currentSpeedMultiplier * (delta / 1000);
            // Check collision with dolphin
            if (this.checkItemCollision(this.dolphin, sprite)) {
                this.collectItem(this.dolphin, sprite);
            }
            // Fade out items before destroying
            if (sprite.x < -sprite.width) {
                this.tweens.add({
                    targets: sprite,
                    alpha: 0,
                    duration: 300,
                    ease: 'Power2',
                    onComplete: () => sprite.destroy()
                });
            }
        });
    }
    checkPipeCollision(dolphin, pipeContainer) {
        if (!dolphin.body)
            return false;
        const dolphinBounds = {
            left: dolphin.body.x,
            right: dolphin.body.x + dolphin.body.width,
            top: dolphin.body.y,
            bottom: dolphin.body.y + dolphin.body.height
        };

        // Get the pipe sprite from the container
        const pipe = pipeContainer.getAt(0);

        // Calculate pipe bounds based on its position and scale
        const pipeWidth = pipe.width * pipe.scaleX * 0.6; // Reduced from 0.9 to 0.6 for narrower collision
        const pipeHeight = pipe.height * pipe.scaleY;
        
        // Calculate pipe bounds based on its position and origin
        const pipeBounds = {
            left: pipeContainer.x - pipeWidth / 2,
            right: pipeContainer.x + pipeWidth / 2,
            top: pipeContainer.y - (pipeHeight * (pipe.flipY ? 0 : 1)), // If flipped, measure from bottom
            bottom: pipeContainer.y + (pipeHeight * (pipe.flipY ? 1 : 0)) // If flipped, measure from top
        };

        return !(dolphinBounds.right < pipeBounds.left ||
            dolphinBounds.left > pipeBounds.right ||
            dolphinBounds.bottom < pipeBounds.top ||
            dolphinBounds.top > pipeBounds.bottom);
    }
    checkItemCollision(dolphin, item) {
        if (!dolphin.body)
            return false;
        const dolphinBounds = {
            left: dolphin.body.x,
            right: dolphin.body.x + dolphin.body.width,
            top: dolphin.body.y,
            bottom: dolphin.body.y + dolphin.body.height
        };
        // Calculate item bounds based on its position and display size, with 80% of size
        const itemWidth = item.width * item.scaleX * 0.8;
        const itemHeight = item.height * item.scaleY * 0.8;
        const itemBounds = {
            left: item.x - itemWidth / 2,
            right: item.x + itemWidth / 2,
            top: item.y - itemHeight / 2,
            bottom: item.y + itemHeight / 2
        };
        return !(dolphinBounds.right < itemBounds.left ||
            dolphinBounds.left > itemBounds.right ||
            dolphinBounds.bottom < itemBounds.top ||
            dolphinBounds.top > itemBounds.bottom);
    }
    handleInput() {
        if (this.gameOver) {
            // Store mute state before clearing
            const wasMuted = this.isMuted;
            // Clear all game objects except mute button
            this.items.clear(true, true);
            this.pipes.clear(true, true);
            this.dolphin.destroy();
            this.scoreText.destroy();
            this.background.destroy();
            this.topBoundary.clear(true, true);
            this.bottomBoundary.clear(true, true);
            this.gameOverContainer.destroy();
            // Destroy the mute button container but keep its state
            if (this.muteButton) {
                this.muteButton.destroy();
                this.muteButton = undefined;
            }
            // Restart the scene
            this.scene.restart();
            // Restore mute state after restart
            this.isMuted = wasMuted;
            return;
        }
    }
    handleJump() {
        if (!this.gameStarted || this.gameOver)
            return;
        this.jump();
    }
    startGame() {
        this.gameStarted = true;
        this.startButton.destroy();
        this.physics.resume();
        // Reset timer
        this.gameTime = 0;
        this.updateTimer();
        this.dolphinSound.play();
        // Start background music if not muted
        if (!this.isMuted) {
            this.backgroundMusic.play();
        }
    }
    jump() {
        if (this.gameOver || !this.gameStarted)
            return;
        this.dolphin.setVelocityY(-400);
    }
    createItems() {
        const itemTypes = ['homework', 'pe-kit', 'swimming-kit', 'pe-shorts', 'goggles'];
        const spawnItem = () => {
            if (this.gameOver || !this.gameStarted)
                return;

            const x = this.gameWidth + 150; // Start off screen
            
            // Simple random height between 20% and 80% of screen height
            const safeY = Phaser.Math.Between(this.gameHeight * 0.2, this.gameHeight * 0.8);
            
            const itemType = itemTypes[Phaser.Math.Between(0, itemTypes.length - 1)];
            // Create as regular sprite instead of physics sprite
            const item = this.add.sprite(x, safeY, itemType);
            item.setScale(this.gameWidth * 0.0015); // Half the previous size
            item.setOrigin(0.5); // Center the item
            item.alpha = 0; // Start invisible
            this.items.add(item);
            // Fade in item
            this.tweens.add({
                targets: item,
                alpha: 1,
                duration: 300,
                ease: 'Power2'
            });
        };

        // Spawn items periodically
        this.time.addEvent({
            delay: 2000,
            callback: spawnItem,
            callbackScope: this,
            loop: true
        });
    }
    createPipes() {
        const spawnPipe = () => {
            if (this.gameOver || !this.gameStarted)
                return;
            // Calculate current gap size based on game time
            const currentGap = Math.max(this.minGap, this.initialGap - (this.gameTime * this.gapDecreaseRate));
            const gapHeight = this.gameHeight * currentGap;
            const centerY = Phaser.Math.Between(this.gameHeight * 0.2 + gapHeight / 2, this.gameHeight * 0.8 - gapHeight / 2);
            
            // Create top pipe container
            const topPipeContainer = this.add.container(this.gameWidth + 100, centerY - gapHeight / 2);
            // Create top pipe
            const topPipe = this.add.sprite(0, 0, 'pipe');
            topPipe.setScale(this.gameWidth * 0.0016);
            topPipe.setOrigin(0.5, 1);
            topPipeContainer.add([topPipe]);
            this.pipes.add(topPipeContainer);
            
            // Create bottom pipe container
            const bottomPipeContainer = this.add.container(this.gameWidth + 100, centerY + gapHeight / 2);
            // Create bottom pipe
            const bottomPipe = this.add.sprite(0, 0, 'pipe');
            bottomPipe.setScale(this.gameWidth * 0.0016);
            bottomPipe.setOrigin(0.5, 0);
            bottomPipe.setFlipY(true);
            bottomPipeContainer.add([bottomPipe]);
            this.pipes.add(bottomPipeContainer);
            
            // Fade in pipes
            this.tweens.add({
                targets: [topPipe, bottomPipe],
                alpha: 1,
                duration: 500,
                ease: 'Power2'
            });
        };

        // Initial pipe spawn
        spawnPipe();
    }
    updateScore() {
        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);
        if (this.score > this.hiScore) {
            this.hiScore = this.score;
            this.hiScoreText.setText('Hi-Score: ' + this.hiScore);
            localStorage.setItem('hiScore', this.hiScore.toString());
        }
    }
    
    updateTimer() {
        const seconds = Math.floor(this.gameTime / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedTime = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        this.timerText.setText(`Time: ${formattedTime}`);
    }
    collectItem(dolphin, item) {
        const points = this.itemPoints[item.texture.key] || 10;
        this.score += points;
        this.updateScore();
        
        // Play collect sound if not muted
        if (!this.isMuted) {
            this.collectSound.play();
        }
        
        // Calculate bubble emission point (right side of dolphin's nose)
        const bubbleX = dolphin.x + (dolphin.width * 0.4); // Adjust this multiplier to fine-tune the position
        const bubbleY = dolphin.y;
        
        // Create bubble particles
        const particles = this.add.particles(bubbleX, bubbleY, 'bubble', {
            speed: { min: 100, max: 250 },
            angle: { min: 270, max: 290 },
            scale: { start: Phaser.Math.FloatBetween(0.2, 0.4), end: 0 },
            lifespan: { min: 1000, max: 2000 },
            quantity: 20,
            alpha: { start: 0.8, end: 0 },
            emitting: false // Don't start emitting immediately
        });

        // Emit particles in bursts
        particles.explode(5); // Emit 5 particles at once

        // Auto-destroy particles after animation
        this.time.delayedCall(1000, () => {
            particles.destroy();
        });
        
        // Visual feedback for points
        const pointsText = this.add.text(item.x, item.y, `+${points}`, {
            fontSize: `${this.gameWidth * 0.04}px`,
            color: '#00ff00'
        }).setOrigin(0.5).setDepth(1000);

        // Animate points text
        this.tweens.add({
            targets: pointsText,
            y: item.y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => pointsText.destroy()
        });

        item.destroy();
    }
    handleGameOver() {
        if (this.gameOver)
            return;
        this.gameOver = true;
        this.physics.pause();
        // Stop background music if it's playing
        if (this.backgroundMusic.isPlaying) {
            this.backgroundMusic.stop();
        }
        // Play start sound if not muted
        if (!this.isMuted) {
            this.startSound.play();
        }
        // Reset game time and speed
        this.gameTime = 0;
        this.speedLevel = 1;
        this.currentSpeedMultiplier = 1;
        // Create game over screen
        this.createGameOverScreen();
    }
    createStartScreen() {
        // Create container for start screen
        this.startButton = this.add.container(this.gameWidth / 2, this.gameHeight / 2).setDepth(1000);
        // Add background panel
        const panel = this.add.rectangle(0, 0, this.gameWidth * 0.8, this.gameHeight * 0.4, 0x000000, 0.7)
            .setOrigin(0.5);
        // Add title text
        const title = this.add.text(0, -this.gameHeight * 0.1, 'Dolphin Thursdays', {
            fontSize: `${this.gameWidth * 0.08}px`,
            color: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        // Create buttons container
        const buttonsContainer = this.add.container(0, 0);

        // Start Game Button
        const startButton = this.add.rectangle(0, -35, 200, 50, 0x4CAF50);
        const startText = this.add.text(0, -35, 'Start Game', { 
            fontSize: '24px', 
            fill: '#fff' 
        }).setOrigin(0.5);
        startButton.setInteractive();
        startButton.on('pointerdown', () => {
            this.startGame();
        });

        // Leaderboard Button
        const leaderboardButton = this.add.rectangle(0, 35, 200, 50, 0x2196F3);
        const leaderboardText = this.add.text(0, 35, 'Leaderboard', { 
            fontSize: '24px', 
            fill: '#fff' 
        }).setOrigin(0.5);
        leaderboardButton.setInteractive();
        leaderboardButton.on('pointerdown', () => {
            this.scene.start('LeaderboardScene');
        });

        // Add hover effects
        [startButton, leaderboardButton].forEach(button => {
            button.on('pointerover', () => {
                button.setAlpha(0.8);
            });
            button.on('pointerout', () => {
                button.setAlpha(1);
            });
        });

        // Add all elements to the buttons container
        buttonsContainer.add([
            startButton, startText,
            leaderboardButton, leaderboardText
        ]);

        // Add the buttons container to the main container
        this.startButton.add([panel, title, buttonsContainer]);
    }
    createGameOverScreen() {
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;

        // Create semi-transparent background overlay
        const bg = this.add.rectangle(0, 0, gameWidth, gameHeight, 0x000000, 0.7)
            .setOrigin(0);

        // Create game over panel
        const panel = this.add.rectangle(gameWidth / 2, gameHeight / 2, gameWidth * 0.8, gameHeight * 0.6, 0x000000, 0.9)
            .setOrigin(0.5)
            .setStrokeStyle(4, 0xffffff);

        // Add game over text
        this.add.text(gameWidth / 2, gameHeight * 0.3, 'GAME OVER', {
            fontSize: `${gameWidth * 0.08}px`,
            color: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Add final score text
        this.add.text(gameWidth / 2, gameHeight * 0.45, `FINAL SCORE: ${this.score}`, {
            fontSize: `${gameWidth * 0.06}px`,
            color: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Add survival time text
        const seconds = Math.floor(this.gameTime / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const survivalTime = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        this.add.text(gameWidth / 2, gameHeight * 0.52, `SURVIVAL TIME: ${survivalTime}`, {
            fontSize: `${gameWidth * 0.05}px`,
            color: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Check if this is a high score
        this.checkHighScore().then(isHighScore => {
            if (isHighScore) {
                // Show high score message
                this.add.text(gameWidth / 2, gameHeight * 0.55, 'NEW HIGH SCORE!', {
                    fontSize: `${gameWidth * 0.05}px`,
                    color: '#ffd700',
                    fontFamily: 'Arial',
                    stroke: '#000000',
                    strokeThickness: 4
                }).setOrigin(0.5);

                // Create name input UI
                this.createNameInputUI();
            } else {
                // Show play again button
                this.createPlayAgainButton();
            }
        });
    }

    async checkHighScore() {
        try {
            const scores = await getHighScores(1);
            return scores.length === 0 || this.score > scores[0].score;
        } catch (error) {
            console.error('Error checking high score:', error);
            return false;
        }
    }

    createNameInputUI() {
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;

        // Create input background
        const inputBg = this.add.rectangle(gameWidth / 2, gameHeight * 0.65, gameWidth * 0.4, gameHeight * 0.1, 0xffffff)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.showNameInput());

        // Get saved initials from localStorage or use default text
        const savedInitials = localStorage.getItem('playerName');
        const displayText = savedInitials || 'ENTER INITIALS';

        // Add input label
        const inputLabel = this.add.text(gameWidth / 2, gameHeight * 0.65, displayText, {
            fontSize: `${gameWidth * 0.03}px`,
            color: '#000000',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // If we have saved initials, set them as the current player name
        if (savedInitials) {
            this.playerName = savedInitials;
        }

        // Create skip button (now on the left)
        const skipButton = this.add.rectangle(gameWidth * 0.35, gameHeight * 0.8, gameWidth * 0.2, gameHeight * 0.08, 0xf44336)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => skipButton.setFillStyle(0xd32f2f))
            .on('pointerout', () => skipButton.setFillStyle(0xf44336))
            .on('pointerdown', () => this.skipScoreSubmission());

        this.add.text(gameWidth * 0.35, gameHeight * 0.8, 'SKIP', {
            fontSize: `${gameWidth * 0.04}px`,
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Create submit button (now on the right)
        const submitButton = this.add.rectangle(gameWidth * 0.65, gameHeight * 0.8, gameWidth * 0.2, gameHeight * 0.08, 0x4CAF50)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => submitButton.setFillStyle(0x45a049))
            .on('pointerout', () => submitButton.setFillStyle(0x4CAF50))
            .on('pointerdown', () => this.submitScore());

        this.add.text(gameWidth * 0.65, gameHeight * 0.8, 'SUBMIT', {
            fontSize: `${gameWidth * 0.04}px`,
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Store reference to input label for updating
        this.nameInputLabel = inputLabel;
    }

    createPlayAgainButton() {
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;

        const playAgainButton = this.add.rectangle(gameWidth / 2, gameHeight * 0.7, gameWidth * 0.4, gameHeight * 0.1, 0x4CAF50)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => playAgainButton.setFillStyle(0x45a049))
            .on('pointerout', () => playAgainButton.setFillStyle(0x4CAF50))
            .on('pointerdown', () => this.scene.restart());

        this.add.text(gameWidth / 2, gameHeight * 0.7, 'PLAY AGAIN', {
            fontSize: `${gameWidth * 0.05}px`,
            color: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
    }

    showNameInput() {
        const name = prompt('Enter your initials (1-3 characters):');
        if (name) {
            const trimmedName = name.trim().toUpperCase();
            if (trimmedName.length >= 1 && trimmedName.length <= 3) {
                this.playerName = trimmedName;
                // Update the input label to show the entered initials
                if (this.nameInputLabel) {
                    this.nameInputLabel.setText(trimmedName);
                }
                // Save to localStorage for future use
                localStorage.setItem('playerName', trimmedName);
            } else {
                alert('Please enter 1-3 characters');
                this.showNameInput();
            }
        }
    }

    async submitScore() {
        if (!this.playerName) {
            alert('Please enter your initials first');
            return;
        }

        try {
            console.log('Submitting score:', { score: this.score, name: this.playerName });
            await saveScore({
                score: this.score,
                name: this.playerName
            });
            console.log('Score submitted successfully');
            // Save name to localStorage for future use
            localStorage.setItem('playerName', this.playerName);
            this.showPlayAgainScreen();
        } catch (error) {
            console.error('Error saving score:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            alert('Error saving score. Please try again.');
        }
    }

    skipScoreSubmission() {
        this.showPlayAgainScreen();
    }

    showPlayAgainScreen() {
        // Clear the game over screen elements but preserve the background
        this.children.list.forEach(child => {
            // Skip the background and any other elements we want to preserve
            if (child !== this.background && child !== this.muteButton) {
                child.destroy();
            }
        });

        // Show the play again screen
        this.createGameOverScreen();
    }
    createMuteButton() {
        // Create container for mute button
        this.muteButton = this.add.container(this.gameWidth * 0.95, this.gameHeight * 0.02).setDepth(1000);
        // Create button background
        const buttonBg = this.add.circle(0, 0, this.gameWidth * 0.03, 0x000000, 0.7)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => buttonBg.setFillStyle(0x000000, 0.8))
            .on('pointerout', () => buttonBg.setFillStyle(0x000000, 0.7))
            .on('pointerdown', () => this.toggleMute());
        // Create speaker icon
        const speakerIcon = this.add.text(0, 0, '🔊', {
            fontSize: `${this.gameWidth * 0.03}px`
        }).setOrigin(0.5);
        // Add elements to container
        this.muteButton.add([buttonBg, speakerIcon]);
    }
    toggleMute() {
        this.isMuted = !this.isMuted;
        const volume = this.isMuted ? 0 : 0.7;
        if (this.backgroundMusic) {
            this.backgroundMusic.setVolume(volume);
        }
        if (this.startSound) {
            this.startSound.setVolume(this.isMuted ? 0 : 0.7);
        }
        if (this.collectSound) {
            this.collectSound.setVolume(this.isMuted ? 0 : 0.7);
        }
        if (this.dolphinSound) {
            this.dolphinSound.setVolume(this.isMuted ? 0 : 0.7);
        }
        // Update speaker icon
        const speakerIcon = this.muteButton?.getAt(1);
        speakerIcon.setText(this.isMuted ? '🔇' : '🔊');
        // If muting and music is playing, stop it
        if (this.isMuted && this.backgroundMusic.isPlaying) {
            this.backgroundMusic.stop();
        }
        // If unmuting and game is running, start music
        else if (!this.isMuted && this.gameStarted && !this.gameOver) {
            this.backgroundMusic.play();
        }
    }
    
    createBackToMenuButton() {
        // Create container for back to menu button
        this.backToMenuButton = this.add.container(this.gameWidth * 0.05, this.gameHeight * 0.02).setDepth(1000);
        
        // Create button background
        const buttonBg = this.add.circle(0, 0, this.gameWidth * 0.03, 0x000000, 0.7)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => buttonBg.setFillStyle(0x000000, 0.8))
            .on('pointerout', () => buttonBg.setFillStyle(0x000000, 0.7))
            .on('pointerdown', () => this.goBackToMenu());
        
        // Create back arrow icon
        const backIcon = this.add.text(0, 0, '←', {
            fontSize: `${this.gameWidth * 0.04}px`,
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Add elements to container
        this.backToMenuButton.add([buttonBg, backIcon]);
    }
    
    goBackToMenu() {
        // Stop all sounds
        if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
            this.backgroundMusic.stop();
        }
        
        // Navigate back to the main menu
        window.location.hash = '#menu';
    }
    createNameInput() {
        // Create container for name input
        this.nameInputContainer = this.add.container(this.gameWidth / 2, this.gameHeight * 0.2).setDepth(1001);
        
        // Add background for input
        const inputBg = this.add.rectangle(0, 0, this.gameWidth * 0.4, this.gameHeight * 0.15, 0x000000, 0.8)
            .setOrigin(0.5);
        
        // Add instruction text
        const instructionText = this.add.text(0, -this.gameHeight * 0.05, 'ENTER INITIALS (1-3 CHARS)', {
            fontSize: `${this.gameWidth * 0.03}px`,
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Add name input text
        this.nameInputText = this.add.text(0, this.gameHeight * 0.01, this.playerName || '___', {
            fontSize: `${this.gameWidth * 0.05}px`,
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Add submit button
        const submitButton = this.add.rectangle(0, this.gameHeight * 0.08, this.gameWidth * 0.2, this.gameHeight * 0.06, 0x4CAF50)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => submitButton.setFillStyle(0x45a049))
            .on('pointerout', () => submitButton.setFillStyle(0x4CAF50))
            .on('pointerdown', () => this.submitHighScore());

        const submitText = this.add.text(0, this.gameHeight * 0.08, 'SUBMIT', {
            fontSize: `${this.gameWidth * 0.03}px`,
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Add skip button
        const skipButton = this.add.rectangle(this.gameWidth * 0.15, this.gameHeight * 0.08, this.gameWidth * 0.15, this.gameHeight * 0.06, 0x666666)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => skipButton.setFillStyle(0x555555))
            .on('pointerout', () => skipButton.setFillStyle(0x666666))
            .on('pointerdown', () => this.skipNameInput());

        const skipText = this.add.text(this.gameWidth * 0.15, this.gameHeight * 0.08, 'SKIP', {
            fontSize: `${this.gameWidth * 0.03}px`,
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Add all elements to container
        this.nameInputContainer.add([inputBg, instructionText, this.nameInputText, submitButton, submitText, skipButton, skipText]);

        // Set up keyboard input
        this.input.keyboard.on('keydown', (event) => {
            if (this.nameInputContainer && this.nameInputText) {
                const key = event.key.toUpperCase();
                if (key.length === 1 && /[A-Z\s]/.test(key)) {
                    let currentName = this.nameInputText.text.replace(/_/g, '');
                    if (currentName.length < 3) {
                        currentName += key;
                        while (currentName.length < 3) {
                            currentName += '_';
                        }
                        this.nameInputText.setText(currentName);
                        this.playerName = currentName.replace(/_/g, '');
                    }
                } else if (event.key === 'Backspace') {
                    let currentName = this.nameInputText.text.replace(/_/g, '');
                    if (currentName.length > 0) {
                        currentName = currentName.slice(0, -1);
                        while (currentName.length < 3) {
                            currentName += '_';
                        }
                        this.nameInputText.setText(currentName);
                        this.playerName = currentName.replace(/_/g, '');
                    }
                }
            }
        });
    }
    submitHighScore() {
        if (this.playerName && this.playerName.length > 0 && this.playerName.length <= 3) {
            // Save name to localStorage
            localStorage.setItem('playerName', this.playerName);
            
            // Submit score to Firebase
            const scoreData = {
                name: this.playerName,
                score: this.score + this.timeScore,
                timestamp: new Date().toISOString()
            };
            
            // Import and use the score service
            import('../services/scoreService.js').then(module => {
                module.saveScore(scoreData).then(() => {
                    this.nameInputContainer.destroy();
                }).catch(error => {
                    console.error('Error saving score:', error);
                });
            });
        }
    }
    skipNameInput() {
        this.nameInputContainer.destroy();
    }
}
