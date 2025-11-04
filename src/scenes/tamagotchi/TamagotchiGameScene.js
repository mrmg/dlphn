import Phaser from 'phaser';

export class TamagotchiGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TamagotchiGameScene' });
        
        // Pet stats (0-100)
        this.homework = 100;      // Decreases over time, feed with homework
        this.peKit = 100;         // Decreases over time, dress with PE kit
        this.swimmingKit = 100;   // Decreases over time, give swimming items
        
        // Pet state
        this.isDressed = false;
        this.isWearingSwimGear = false;
        this.currentSwimGear = null; // 'goggles', 'towel', 'crocs', 'trunks'
        this.peKitCondition = 'clean'; // 'clean', 'dirty', 'very_dirty'
        this.currentMood = 'very_happy'; // very_happy, happy, content, worried, sad, very_sad, exhausted
        this.lastUpdate = 0;
        this.animationFrame = 0;
        this.blinkFrame = 0;
        this.mouthFrame = 0;
        
        // ASCII Art definitions
        this.asciiArt = {
            // Eye variations for blinking animation
            eyes: {
                open: "◕   ◕",
                halfClosed: "◔   ◔", 
                closed: "─   ─",
                sleepy: "╺   ╺",
                worried: "◉   ◉",
                sad: "◕   ◕"
            },
            
            // Mouth variations for different moods and animation
            mouths: {
                very_happy: ["◡◡◡", "◡ ◡", "◡◡◡"],
                happy: ["◡◡", "◡", "◡◡"],
                content: ["◡", "─", "◡"],
                worried: ["───", "∩∩", "───"],
                sad: ["∩∩∩", "∩∩", "∩∩∩"],
                very_sad: ["∪∪∪", "∪∪", "∪∪∪"],
                exhausted: ["zzz...", "Zzz..", "ZZZ.."]
            },
            
            // PE Kit states
            peKitDisplay: {
                none: ["     ", "     "],
                clean: ["┌───┐", "│👕│"],
                dirty: ["┌~~~┐", "│👕│"],
                veryDirty: ["┌###┐", "│👕│"]
            },
            
            // Swimming gear display
            swimGearDisplay: {
                none: ["     ", "     "],
                goggles: ["◉═══◉", "     "],
                towel: ["╔═══╗", "║~~~║"],
                crocs: ["  👟👟 ", "     "],
                trunks: ["🩱🩱🩱", "     "]
            },
            
            // Homework folder
            homework: [
                "╔═════════════════╗",
                "║   📚 HOMEWORK   ║",
                "║                 ║",
                "║  Math: ✓        ║",
                "║  English: ✗     ║",
                "║  Science: ✗     ║",
                "║                 ║",
                "╚═════════════════╝"
            ]
        };
        
        // Animation timers
        this.blinkTimer = 0;
        this.mouthTimer = 0;
        
        // Sound cooldown
        this.lastDolphinSoundTime = 0;
        this.dolphinSoundCooldown = 15000; // 15 seconds
        
        // Mute state
        this.isMuted = false;
        
        // Water spout state
        this.isSprayingWater = false;
        
        // Mini-game state
        this.currentMiniGame = null;
        this.miniGameItems = [];
        this.collectedItems = [];
        
        // Game over state
        this.gameOver = false;
        this.graceTimer = null;
        this.graceTimeLeft = 0;
        this.graceReason = null;
    }

    resetGameState() {
        // Reset pet stats to full
        this.homework = 100;
        this.peKit = 100;
        this.swimmingKit = 100;
        
        // Reset pet state
        this.isDressed = false;
        this.isWearingSwimGear = false;
        this.currentSwimGear = null;
        this.peKitCondition = 'clean';
        this.currentMood = 'very_happy';
        this.lastUpdate = 0;
        
        // Reset animation states
        this.animationFrame = 0;
        this.blinkFrame = 0;
        this.mouthFrame = 0;
        this.blinkTimer = 0;
        this.mouthTimer = 0;
        
        // Reset sound state
        this.lastDolphinSoundTime = 0;
        this.isMuted = false;
        this.isSprayingWater = false;
        
        // Reset mini-game state
        this.currentMiniGame = null;
        this.miniGameItems = [];
        this.collectedItems = [];
        
        // Reset game over state
        this.gameOver = false;
        this.graceTimer = null;
        this.graceTimeLeft = 0;
        this.graceReason = null;
        
        // Reset dolphin position variables
        this.originalX = null;
        this.originalY = null;
        
        // Clean up any existing timers or events
        if (this.blinkEvent) {
            this.blinkEvent.remove();
            this.blinkEvent = null;
        }
        
        if (this.peKitRemovalTimer) {
            this.peKitRemovalTimer.remove();
            this.peKitRemovalTimer = null;
        }
        
        if (this.swimGearTimer) {
            this.swimGearTimer.remove();
            this.swimGearTimer = null;
        }
        
        // Clean up input event listeners from previous sessions
        if (this.input) {
            this.input.removeAllListeners();
        }
        
        // Clean up grace period elements
        this.cancelGracePeriod();
        
        // Clean up any mini-game items
        this.cleanupMiniGame();
        
        // Clean up animated bubbles
        if (this.animatedBubbles) {
            this.animatedBubbles.forEach(bubble => {
                if (bubble && bubble.active) {
                    bubble.destroy();
                }
            });
            this.animatedBubbles = [];
        }
        
        // Clean up floating animation tweens
        if (this.floatingTween) {
            this.floatingTween.stop();
            this.floatingTween = null;
        }
        
        if (this.horizontalFloatTween) {
            this.horizontalFloatTween.stop();
            this.horizontalFloatTween = null;
        }
        
        // Reset UI references
        this.characterArea = null;
        this.characterLines = [];
        this.statusText = null;
        this.countdownText = null;
        this.timerBackground = null;
        this.survivalTimerText = null;
        this.survivalTimerBackground = null;
        this.bestTimeText = null;
        this.bestTimeBackground = null;
        this.homeworkBar = null;
        this.peKitBar = null;
        this.swimmingKitBar = null;
        this.homeworkBarBg = null;
        this.peKitBarBg = null;
        this.swimmingKitBarBg = null;
        this.actionButtons = [];
        this.homeworkButton = null;
        this.peKitButton = null;
        this.swimKitButton = null;
        this.muteButton = null;
        this.speakerIcon = null;
        this.dolphinSound = null;
        
        // Reset critical warning elements
        this.criticalOverlay = null;
        this.criticalWarningContainer = null;
        this.criticalTitle = null;
        this.criticalMessage = null;
        this.criticalCountdown = null;
        
        // Reset swim bag elements
        this.swimBagDropButton = null;
        this.swimBagX = null;
        this.swimBagY = null;
        this.swimBagElements = null;
        
        // Reset homework return elements
        this.homeworkReturnButton = null;
        this.homeworkReturnElements = null;
    }

    preload() {
        // Load dolphin sound
        this.load.audio('dolphin', 'assets/dolphin.mp3');
        
        // Load bubble image for backgrounds
        this.load.image('bubble', 'assets/bubble.png');
    }

    create() {
        const { width, height } = this.cameras.main;
        
        // Reset all game state to ensure clean start
        this.resetGameState();
        
        // Get game mode from registry (default to standard if not set)
        this.gameMode = this.registry.get('gameMode') || 'standard';
        
        // Create background based on game mode
        this.createBackground();
        
        // Title (moved down to avoid overlap)
        this.add.text(width/2, 55, '🐬 DOLPHIN TAMAGOTCHI 🐬', {
            fontSize: '20px',
            fontFamily: 'monospace',
            fill: '#00ffff',
            stroke: '#ffffff',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        // Countdown timer with high depth and background for visibility (moved down)
        this.timerBackground = this.add.rectangle(width/2, 80, 300, 25, 0x000000, 0.7)
            .setDepth(10000); // Ensure it's always on top
        
        this.countdownText = this.add.text(width/2, 80, '', {
            fontSize: '16px',
            fontFamily: 'monospace',
            fill: '#ffff00',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(10001); // Higher than background
        
        // Initialize countdown
        this.updateCountdownTimer();

        // Create survival timer displays
        this.createSurvivalTimers();

        // Create status bars
        this.createStatusBars();
        
        // Create main character display
        this.createCharacterDisplay();
        
        // Create interaction buttons
        this.createInteractionButtons();
        
        // Create back button
        this.createBackButton(width/2, height - 30);
        
        // Create mute button
        this.createMuteButton();
        
        // Initialize sounds
        this.dolphinSound = this.sound.add('dolphin', { volume: 0.7 });
        
        // Start the game loop
        this.lastUpdate = this.time.now;
        this.updatePetNeeds();
        
        // Start tracking play time for Matt mode unlock
        this.startPlayTimeTracking();
        
        // Track session start time for game over screen
        this.sessionStartTime = Date.now();
        
        // Reset difficulty tracking
        this.lastDifficultyMultiplier = 1.0;
        
        // Enable crazy visual effects if in Matt mode
        this.addMattModeClickEffects();
    }

    createBackground() {
        const { width, height } = this.cameras.main;
        
        if (this.gameMode === 'standard') {
            // Standard: Plain dark blue background
            this.add.rectangle(width/2, height/2, width, height, 0x001122);
            
        } else if (this.gameMode === 'advanced') {
            // Advanced: Dark blue background with static bubbles
            this.add.rectangle(width/2, height/2, width, height, 0x000044);
            
            // Add static bubbles
            this.createStaticBubbles();
            
        } else if (this.gameMode === 'matt') {
            // Matt: Dark green background with animated bubbles
            this.add.rectangle(width/2, height/2, width, height, 0x003300);
            
            // Add animated bubbles
            this.createAnimatedBubbles();
        }
    }
    
    createStaticBubbles() {
        const { width, height } = this.cameras.main;
        const bubbleCount = 8; // Fewer bubbles for subtle effect
        
        for (let i = 0; i < bubbleCount; i++) {
            const x = Phaser.Math.Between(50, width - 50);
            const y = Phaser.Math.Between(50, height - 50);
            const size = Phaser.Math.FloatBetween(0.3, 0.8);
            const alpha = Phaser.Math.FloatBetween(0.1, 0.3);
            
            const bubble = this.add.image(x, y, 'bubble')
                .setScale(size)
                .setAlpha(alpha)
                .setDepth(-1); // Behind everything else
        }
    }
    
    createAnimatedBubbles() {
        const { width, height } = this.cameras.main;
        const bubbleCount = 15; // More bubbles for chaotic effect
        
        // Store animated bubbles for cleanup
        this.animatedBubbles = [];
        
        for (let i = 0; i < bubbleCount; i++) {
            this.createSingleAnimatedBubble();
        }
        
        // Create new bubbles periodically in Matt mode
        this.time.addEvent({
            delay: Phaser.Math.Between(2000, 4000),
            callback: () => {
                if (this.gameMode === 'matt') { // Only if still in Matt mode
                    this.createSingleAnimatedBubble();
                }
            },
            loop: true
        });
    }
    
    createSingleAnimatedBubble() {
        const { width, height } = this.cameras.main;
        
        // Start bubbles from bottom
        const startX = Phaser.Math.Between(0, width);
        const startY = height + 50;
        const size = Phaser.Math.FloatBetween(0.2, 1.0);
        const alpha = Phaser.Math.FloatBetween(0.2, 0.5);
        
        const bubble = this.add.image(startX, startY, 'bubble')
            .setScale(size)
            .setAlpha(alpha)
            .setDepth(-1); // Behind everything else
        
        this.animatedBubbles.push(bubble);
        
        // Animate bubble floating up
        this.tweens.add({
            targets: bubble,
            y: -50, // Float off screen
            duration: Phaser.Math.Between(8000, 15000), // Slow float
            ease: 'Linear',
            onComplete: () => {
                // Remove from array and destroy
                const index = this.animatedBubbles.indexOf(bubble);
                if (index > -1) {
                    this.animatedBubbles.splice(index, 1);
                }
                bubble.destroy();
            }
        });
        
        // Add horizontal drift
        this.tweens.add({
            targets: bubble,
            x: startX + Phaser.Math.Between(-100, 100),
            duration: Phaser.Math.Between(8000, 15000),
            ease: 'Sine.easeInOut'
        });
        
        // Add subtle scaling animation
        this.tweens.add({
            targets: bubble,
            scaleX: size * 1.2,
            scaleY: size * 1.2,
            duration: Phaser.Math.Between(3000, 6000),
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Add alpha pulsing
        this.tweens.add({
            targets: bubble,
            alpha: alpha * 0.5,
            duration: Phaser.Math.Between(2000, 4000),
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createStatusBars() {
        const { width } = this.cameras.main;
        const startY = 120; // Moved down to accommodate repositioned title/timer
        const barWidth = 200;
        const barHeight = 20;
        
        // Homework bar
        this.add.text(width/2 - 120, startY, '📚 HOMEWORK:', {
            fontSize: '16px',
            fontFamily: 'monospace',
            fill: '#ffff00'
        });
        
        this.homeworkBarBg = this.add.rectangle(width/2 + 20, startY + 10, barWidth, barHeight, 0x333333);
        this.homeworkBar = this.add.rectangle(width/2 + 20 - barWidth/2, startY + 10, barWidth, barHeight, 0x00ff00).setOrigin(0, 0.5);
        
        // PE Kit bar
        this.add.text(width/2 - 120, startY + 40, '👕 PE KIT:', {
            fontSize: '16px',
            fontFamily: 'monospace',
            fill: '#ff8800'
        });
        
        this.peKitBarBg = this.add.rectangle(width/2 + 20, startY + 50, barWidth, barHeight, 0x333333);
        this.peKitBar = this.add.rectangle(width/2 + 20 - barWidth/2, startY + 50, barWidth, barHeight, 0x00ff00).setOrigin(0, 0.5);
        
        // Swimming Kit bar
        this.add.text(width/2 - 120, startY + 80, '🏊 SWIM KIT:', {
            fontSize: '16px',
            fontFamily: 'monospace',
            fill: '#0088ff'
        });
        
        this.swimmingKitBarBg = this.add.rectangle(width/2 + 20, startY + 90, barWidth, barHeight, 0x333333);
        this.swimmingKitBar = this.add.rectangle(width/2 + 20 - barWidth/2, startY + 90, barWidth, barHeight, 0x00ff00).setOrigin(0, 0.5);
    }

    createCharacterDisplay() {
        const { width, height } = this.cameras.main;
        
        // Main character area
        this.characterArea = this.add.container(width/2, height/2 - 20);
        
        // Store original center position
        this.originalX = width/2;
        this.originalY = height/2 - 20;
        
        // Create text objects for each line of the ASCII art (now 12 lines total)
        this.characterLines = [];
        for (let i = 0; i < 12; i++) {
            const line = this.add.text(0, (i - 5.5) * 15, '', {
                fontSize: '14px',
                fontFamily: 'monospace',
                fill: '#00ffff',
                stroke: '#000044',
                strokeThickness: 1
            }).setOrigin(0.5);
            this.characterLines.push(line);
            this.characterArea.add(line);
        }
        
        // Status text with word wrapping
        this.statusText = this.add.text(width/2, height/2 + 120, 'Your dolphin is happy!', {
            fontSize: '16px',
            fontFamily: 'monospace',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
            align: 'center',
            wordWrap: { 
                width: width - 100, // 50 pixels margin on each side
                useAdvancedWrap: true 
            }
        }).setOrigin(0.5);
        
        // Update initial character
        this.updateCharacterDisplay();
    }

    createInteractionButtons() {
        const { width, height } = this.cameras.main;
        const buttonY = height - 120;
        
        // Store references to action buttons for show/hide
        this.homeworkButton = this.createActionButton(width/2 - 150, buttonY, '📚\nHOMEWORK', 0x4CAF50, () => this.handleHomeworkAction());
        
        // PE Kit button - store reference for drag target
        this.peKitButton = this.createActionButton(width/2, buttonY, '👕\nPE KIT', 0xFF9800, () => this.handlePEKitAction());
        
        // Swimming Kit button - store reference for drag target
        this.swimKitButton = this.createActionButton(width/2 + 150, buttonY, '🏊\nSWIM KIT', 0x2196F3, () => this.handleSwimKitAction());
        
        // Store all action buttons for easy show/hide
        this.actionButtons = [this.homeworkButton, this.peKitButton, this.swimKitButton];
    }

    createActionButton(x, y, text, color, callback) {
        const button = this.add.rectangle(x, y, 80, 60, color)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(2, 0xffffff);

        const buttonText = this.add.text(x, y, text, {
            fontSize: '12px',
            fontFamily: 'monospace',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Hover effects
        button.on('pointerover', () => {
            button.setScale(1.1);
            buttonText.setScale(1.1);
        });

        button.on('pointerout', () => {
            button.setScale(1);
            buttonText.setScale(1);
        });

        // Action
        button.on('pointerdown', callback);

        return { button, text: buttonText };
    }

    createBackButton(x, y) {
        const button = this.add.rectangle(x, y, 120, 40, 0x666666)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(2, 0xffffff);

        const buttonText = this.add.text(x, y, 'BACK TO MENU', {
            fontSize: '14px',
            fontFamily: 'monospace',
            fill: '#ffffff'
        }).setOrigin(0.5);

        button.on('pointerover', () => button.setFillStyle(0x888888));
        button.on('pointerout', () => button.setFillStyle(0x666666));
        button.on('pointerdown', () => {
            // Clean up any running mini-games before switching scenes
            this.cleanupMiniGame();
            // Go back to mode selection instead of main menu
            this.scene.start('ModeSelectionScene');
        });
    }
    
    createMuteButton() {
        const { width, height } = this.cameras.main;
        
        // Create container for mute button (bottom left)
        this.muteButton = this.add.container((width * 0.05)+10, (height * 0.95)+10).setDepth(1000);
        
        // Create button background
        const buttonBg = this.add.circle(0, 0, 25, 0x000000, 0.7)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(2, 0xffffff)
            .on('pointerover', () => buttonBg.setFillStyle(0x000000, 0.8))
            .on('pointerout', () => buttonBg.setFillStyle(0x000000, 0.7))
            .on('pointerdown', () => this.toggleMute());
        
        // Create speaker icon
        this.speakerIcon = this.add.text(0, 0, '🔊', {
            fontSize: '20px',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        // Add elements to container
        this.muteButton.add([buttonBg, this.speakerIcon]);
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        // Update speaker icon
        this.speakerIcon.setText(this.isMuted ? '🔇' : '🔊');
        
        // Update dolphin sound volume
        if (this.dolphinSound) {
            this.dolphinSound.setVolume(this.isMuted ? 0 : 0.7);
        }
        
        // Visual feedback
        this.showFeedback(this.isMuted ? '🔇 Muted' : '🔊 Unmuted', 0x888888);
    }

    createSurvivalTimers() {
        const { width } = this.cameras.main;
        
        // Current session timer (left side)
        this.survivalTimerBackground = this.add.rectangle(120, 25, 180, 20, 0x000000, 0.7)
            .setDepth(9999);
        
        this.survivalTimerText = this.add.text(120, 25, 'Survived: 0s', {
            fontSize: '12px',
            fontFamily: 'monospace',
            fill: '#00ff00',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5).setDepth(10000);
        
        // Best time for current mode (right side)
        this.bestTimeBackground = this.add.rectangle(width - 120, 25, 180, 20, 0x000000, 0.7)
            .setDepth(9999);
        
        // Load best time for current mode
        const bestTime = this.getBestTime(this.gameMode);
        const bestTimeDisplay = bestTime > 0 ? this.formatSurvivalTime(bestTime) : 'No record';
        
        this.bestTimeText = this.add.text(width - 120, 25, `Best: ${bestTimeDisplay}`, {
            fontSize: '12px',
            fontFamily: 'monospace',
            fill: '#ffd700',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5).setDepth(10000);
        
        // Track difficulty for console logging
        this.lastDifficultyMultiplier = 1.0;
        
        // Start updating survival timer
        this.updateSurvivalTimer();
    }

    getBestTime(gameMode) {
        const key = `dolphinTamagotchi_best_${gameMode}`;
        return parseInt(localStorage.getItem(key) || '0');
    }

    setBestTime(gameMode, timeMs) {
        const key = `dolphinTamagotchi_best_${gameMode}`;
        localStorage.setItem(key, timeMs.toString());
    }

    updateSurvivalTimer() {
        if (this.gameOver || !this.survivalTimerText) return;
        
        const currentTime = Date.now() - this.sessionStartTime;
        const timeString = this.formatSurvivalTime(currentTime);
        
        this.survivalTimerText.setText(`Survived: ${timeString}`);
        
        // Check for difficulty changes and log to console
        const survivalTimeSeconds = currentTime / 1000;
        const difficultyMultiplier = this.calculateDifficultyMultiplier(survivalTimeSeconds);
        
        // Log difficulty changes to console (round to 1 decimal place for comparison)
        const roundedDifficulty = Math.round(difficultyMultiplier * 10) / 10;
        const roundedLastDifficulty = Math.round(this.lastDifficultyMultiplier * 10) / 10;
        
        if (roundedDifficulty !== roundedLastDifficulty) {
            console.log(`🐬 [${this.gameMode.toUpperCase()}] Difficulty increased: ${roundedLastDifficulty}x → ${roundedDifficulty}x (${timeString})`);
            this.lastDifficultyMultiplier = difficultyMultiplier;
        }
        
        // Schedule next update
        this.time.delayedCall(1000, () => {
            this.updateSurvivalTimer();
        });
    }

    updateCharacterDisplay() {
        // Determine current mood based on homework primarily, then other stats
        if (this.homework > 90) {
            this.currentMood = 'very_happy';
        } else if (this.homework > 70) {
            this.currentMood = 'happy';
        } else if (this.homework > 50) {
            this.currentMood = 'content';
        } else if (this.homework > 30) {
            this.currentMood = 'worried';
        } else if (this.homework > 10) {
            this.currentMood = 'sad';
        } else if (this.homework > 0) {
            this.currentMood = 'very_sad';
        } else {
            this.currentMood = 'exhausted';
        }
        
        // Update PE kit condition based on PE kit meter
        if (this.peKit > 70) {
            this.peKitCondition = 'clean';
        } else if (this.peKit > 30) {
            this.peKitCondition = 'dirty';
        } else {
            this.peKitCondition = 'very_dirty';
        }
        
        // Build dynamic ASCII art
        const dolphinArt = this.buildDolphinArt();
        
        // Update each line
        for (let i = 0; i < this.characterLines.length; i++) {
            if (i < dolphinArt.length) {
                this.characterLines[i].setText(dolphinArt[i]);
            } else {
                this.characterLines[i].setText('');
            }
        }
        
        // Update status text
        this.updateStatusText();
    }
    
    buildDolphinArt() {
        // Get current eye state (for blinking animation)
        let eyeState = 'open';
        if (this.currentMood === 'exhausted') {
            eyeState = 'sleepy';
        } else if (this.currentMood === 'worried') {
            eyeState = 'worried';
        } else if (this.blinkFrame > 0) {
            eyeState = this.blinkFrame === 1 ? 'halfClosed' : 'closed';
        }
        
        // Get current mouth animation frame with error checking
        const mouthFrames = this.asciiArt.mouths[this.currentMood] || this.asciiArt.mouths.content || ['◡'];
        let currentMouth = mouthFrames[this.mouthFrame % mouthFrames.length] || '◡';
        
        // Center the mouth based on its length
        const mouthPadding = Math.max(0, (5 - currentMouth.length) / 2);
        currentMouth = ' '.repeat(Math.floor(mouthPadding)) + currentMouth + ' '.repeat(Math.ceil(mouthPadding));
        
        // Get PE kit display with error checking
        let peDisplay = ['     ', '     ']; // Default empty
        if (this.isDressed && this.asciiArt.peKitDisplay[this.peKitCondition]) {
            peDisplay = this.asciiArt.peKitDisplay[this.peKitCondition];
        } else if (this.asciiArt.peKitDisplay.none) {
            peDisplay = this.asciiArt.peKitDisplay.none;
        }
            
        // Get swim gear display with error checking
        let swimDisplay = ['     ', '     ']; // Default empty
        if (this.isWearingSwimGear && this.currentSwimGear && this.asciiArt.swimGearDisplay[this.currentSwimGear]) {
            swimDisplay = this.asciiArt.swimGearDisplay[this.currentSwimGear];
        } else if (this.asciiArt.swimGearDisplay.none) {
            swimDisplay = this.asciiArt.swimGearDisplay.none;
        }
        
        // Get eyes with error checking
        const eyeDisplay = this.asciiArt.eyes[eyeState] || '◕   ◕';
        
        // Build the complete ASCII art
        return [
            this.isSprayingWater ? '   ∼∼∼∼∼   ' : '           ',  // Water spout (when active)
            peDisplay[0] || '     ',           // PE kit top line
            `    ${eyeDisplay}    `,           // Eyes
            `  \\   ◡   /  `,                  // Cheeks (always same)
            `     ─────     `,                 // Blowhole separation line
            ` ╱           ╲`,                  // Head top
            `│  ~~~   ~~~ │`,                  // Side fins
            `│     ${currentMouth}    │`,      // Mouth area
            ` ╲___________╱`,                  // Head bottom
            `    ~~~   ~~~  `,                 // Tail
            swimDisplay[0] || '     ',         // Swim gear line 1
            swimDisplay[1] || '     '          // Swim gear line 2
        ];
    }

    updateStatusText() {
        let status = '';
        let priority = '';
        
        // Priority status messages
        if (this.homework < 20) priority = 'URGENT: Needs homework! 📚⚠️ ';
        else if (this.peKit < 20) priority = 'URGENT: PE kit is filthy! 👕💨 ';
        else if (this.swimmingKit < 20) priority = 'URGENT: Wants to swim badly! 🏊💦 ';
        
        // Regular status messages
        if (this.homework < 30) status += 'Needs homework! ';
        if (this.peKit < 30) status += 'PE kit getting dirty! ';
        if (this.swimmingKit < 30) status += 'Wants swimming gear! ';
        
        // Show gear status
        if (this.isDressed) {
            status += `Wearing ${this.peKitCondition} PE kit! `;
        }
        if (this.isWearingSwimGear && this.currentSwimGear) {
            status += `Has ${this.currentSwimGear}! `;
        }
        
        // If no immediate needs, show mood
        if (priority === '' && status === '') {
            switch (this.currentMood) {
                case 'very_happy':
                    status = 'Your dolphin is absolutely delighted! 🐬✨🌟';
                    break;
                case 'happy':
                    status = 'Your dolphin is very happy! 🐬✨';
                    break;
                case 'content':
                    status = 'Your dolphin is content. 🐬😊';
                    break;
                case 'worried':
                    status = 'Your dolphin looks worried... 🐬😟';
                    break;
                case 'sad':
                    status = 'Your dolphin is feeling sad... 🐬💧';
                    break;
                case 'very_sad':
                    status = 'Your dolphin is very upset! 🐬😢';
                    break;
                case 'exhausted':
                    status = 'Your dolphin is completely exhausted! 🐬💤';
                    break;
            }
        }
        
        this.statusText.setText(priority + status);
    }

    updateStatusBars() {
        const barWidth = 200;
        
        // Homework bar
        this.homeworkBar.displayWidth = (this.homework / 100) * barWidth;
        this.homeworkBar.setFillStyle(this.homework > 50 ? 0x00ff00 : this.homework > 25 ? 0xffff00 : 0xff0000);
        
        // PE Kit bar
        this.peKitBar.displayWidth = (this.peKit / 100) * barWidth;
        this.peKitBar.setFillStyle(this.peKit > 50 ? 0x00ff00 : this.peKit > 25 ? 0xffff00 : 0xff0000);
        
        // Swimming Kit bar
        this.swimmingKitBar.displayWidth = (this.swimmingKit / 100) * barWidth;
        this.swimmingKitBar.setFillStyle(this.swimmingKit > 50 ? 0x00ff00 : this.swimmingKit > 25 ? 0xffff00 : 0xff0000);
    }

    calculateDifficultyMultiplier(survivalTimeSeconds) {
        // Progressive difficulty that increases over time
        // Different scaling for each game mode
        let difficultyMultiplier = 1.0;
        
        if (this.gameMode === 'standard') {
            // Standard mode: Gentle increase, caps at 2.5x after 5 minutes
            difficultyMultiplier = 1 + (survivalTimeSeconds / 300) * 1.5; // +1.5x over 5 minutes
            difficultyMultiplier = Math.min(difficultyMultiplier, 2.5);
            
        } else if (this.gameMode === 'advanced') {
            // Advanced mode: Slower start but steeper curve, caps at 3x after 6 minutes
            difficultyMultiplier = 1 + Math.pow(survivalTimeSeconds / 360, 1.5) * 2; // Exponential curve
            difficultyMultiplier = Math.min(difficultyMultiplier, 3.0);
            
        } else if (this.gameMode === 'matt') {
            // Matt mode: Aggressive scaling, caps at 4x after 4 minutes
            difficultyMultiplier = 1 + (survivalTimeSeconds / 240) * 3; // +3x over 4 minutes
            difficultyMultiplier = Math.min(difficultyMultiplier, 4.0);
        }
        
        return difficultyMultiplier;
    }

    updatePetNeeds() {
        // Decrease stats (every 2 seconds)
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                // Calculate progressive difficulty multiplier based on survival time
                const survivalTimeSeconds = (Date.now() - this.sessionStartTime) / 1000;
                const progressiveMultiplier = this.calculateDifficultyMultiplier(survivalTimeSeconds);
                
                // Adjust base depletion rates based on game mode
                let basePEDepletion = 10;       // Standard: ~20 seconds
                let baseHomeworkDepletion = 8;  // Standard: ~25 seconds  
                let baseSwimDepletion = 4;      // Standard: ~50 seconds
                
                if (this.gameMode === 'advanced') {
                    // Advanced mode starts slower but scales up
                    basePEDepletion = 6;        // Advanced: ~33 seconds initially
                    baseHomeworkDepletion = 5;  // Advanced: ~40 seconds initially
                    baseSwimDepletion = 2.5;    // Advanced: ~80 seconds initially
                } else if (this.gameMode === 'matt') {
                    // Matt mode starts faster and scales up quickly
                    basePEDepletion = 12;       // Matt: ~16 seconds initially
                    baseHomeworkDepletion = 10; // Matt: ~20 seconds initially
                    baseSwimDepletion = 5;      // Matt: ~40 seconds initially
                }
                
                // Apply progressive difficulty to depletion rates
                const finalPEDepletion = basePEDepletion * progressiveMultiplier;
                const finalHomeworkDepletion = baseHomeworkDepletion * progressiveMultiplier;
                const finalSwimDepletion = baseSwimDepletion * progressiveMultiplier;
                
                // Only decrease meters that aren't currently being played in mini-games
                if (this.currentMiniGame !== 'pe') {
                    this.peKit = Math.max(0, this.peKit - finalPEDepletion);
                }
                if (this.currentMiniGame !== 'homework') {
                    this.homework = Math.max(0, this.homework - finalHomeworkDepletion);
                }
                if (this.currentMiniGame !== 'swim') {
                    this.swimmingKit = Math.max(0, this.swimmingKit - finalSwimDepletion);
                }
                
                this.updateStatusBars();
                this.updateCharacterDisplay();
                
                // Check for game over condition
                this.checkGameOver();
            },
            loop: true
        });
        
        // Update countdown timer every second
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.updateCountdownTimer();
            },
            loop: true
        });
        
        // Blinking animation (every 3-6 seconds, randomized)
        const createBlink = () => {
            if (this.currentMood !== 'exhausted') { // Don't blink when exhausted
                this.blinkFrame = 1;
                this.updateCharacterDisplay();
                
                // Half-close eyes for 100ms
                this.time.delayedCall(100, () => {
                    this.blinkFrame = 2;
                    this.updateCharacterDisplay();
                    
                    // Fully close for 100ms
                    this.time.delayedCall(100, () => {
                        this.blinkFrame = 1;
                        this.updateCharacterDisplay();
                        
                        // Half-open for 100ms
                        this.time.delayedCall(100, () => {
                            this.blinkFrame = 0;
                            this.updateCharacterDisplay();
                        });
                    });
                });
            }
        };
        
        this.blinkEvent = this.time.addEvent({
            delay: Phaser.Math.Between(3000, 6000),
            callback: () => {
                createBlink();
                // Randomize next blink time
                this.blinkEvent.delay = Phaser.Math.Between(3000, 6000);
            },
            loop: true
        });
        
        // Mouth animation (every 1-2 seconds)
        this.time.addEvent({
            delay: 1500,
            callback: () => {
                this.mouthFrame = (this.mouthFrame + 1) % 3;
                this.updateCharacterDisplay();
            },
            loop: true
        });
        
        // Happy dolphin sounds (check every 5 seconds)
        this.time.addEvent({
            delay: 5000,
            callback: () => {
                this.checkForHappySounds();
            },
            loop: true
        });
        
        // Keep dolphin in bounds check (every 2 seconds)
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.keepDolphinInBounds();
            },
            loop: true
        });
        
        // Gentle floating animation to keep dolphin lively
        this.startFloatingAnimation();
    }
    
    startFloatingAnimation() {
        // Very subtle floating motion within a small area
        const floatRange = 15; // pixels
        
        this.floatingTween = this.tweens.add({
            targets: this.characterArea,
            y: this.originalY + floatRange,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Add a slight horizontal drift
        this.time.delayedCall(1500, () => {
            this.horizontalFloatTween = this.tweens.add({
                targets: this.characterArea,
                x: this.originalX + floatRange,
                duration: 4000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    giveHomework() {
        this.homework = Math.min(100, this.homework + 30);
        
        // Create animated homework folder
        this.animateHomework();
        
        // Dolphin reaction animation
        this.animateDolphinReaction('homework');
        
        this.showFeedback('📚 Homework completed! +30', 0x4CAF50);
        this.updateStatusBars();
        this.updateCharacterDisplay();
        
        // Check for happy sounds after homework (with small delay for mood update)
        this.time.delayedCall(500, () => this.checkForHappySounds());
    }
    
    animateHomework() {
        const { width, height } = this.cameras.main;
        
        // Create homework folder that flies in from the left
        const homeworkLines = this.asciiArt.homework;
        const homeworkContainer = this.add.container(-200, height/2 - 50);
        
        // Create each line of the homework ASCII
        const textObjects = [];
        homeworkLines.forEach((line, index) => {
            const text = this.add.text(0, index * 16, line, {
                fontSize: '12px',
                fontFamily: 'monospace',
                fill: '#ffff00',
                stroke: '#000000',
                strokeThickness: 1
            }).setOrigin(0.5);
            textObjects.push(text);
            homeworkContainer.add(text);
        });
        
        // Animate homework flying to dolphin
        this.tweens.add({
            targets: homeworkContainer,
            x: width/2 + 100,
            y: height/2 - 20,
            duration: 800,
            ease: 'Power2.easeOut',
            onComplete: () => {
                // Create sparkle effect
                this.createSparkleEffect(width/2 + 100, height/2 - 20);
                
                // Wait 0.5 seconds before fading out homework
                this.time.delayedCall(500, () => {
                    this.tweens.add({
                        targets: textObjects,
                        alpha: 0,
                        scale: 0.5,
                        duration: 400,
                        ease: 'Power2.easeIn',
                        onComplete: () => {
                            homeworkContainer.destroy();
                        }
                    });
                });
            }
        });
        
        // Add rotation for extra flair
        this.tweens.add({
            targets: homeworkContainer,
            rotation: 0.3,
            duration: 800,
            ease: 'Sine.easeInOut'
        });
    }

    dressPEKit() {
        this.peKit = 100; // Fresh PE kit = 100% clean
        this.isDressed = true;
        this.peKitCondition = 'clean';
        
        // Create dressing animation
        this.animatePEKitDressing();
        
        // Dolphin reaction animation
        this.animateDolphinReaction('pekit');
        
        this.showFeedback('👕 Fresh PE kit! 100%', 0xFF9800);
        this.updateStatusBars();
        this.updateCharacterDisplay();
        
        // Check for happy sounds after PE kit change
        this.time.delayedCall(500, () => this.checkForHappySounds());
        
        // PE kit stays on but gets dirty over time based on PE kit meter
        // Remove PE kit when it gets very dirty (below 20)
        if (this.peKitRemovalTimer) {
            this.peKitRemovalTimer.remove();
        }
        
        this.peKitRemovalTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.peKit < 20) {
                    this.isDressed = false;
                    this.showFeedback('PE kit too dirty! Removed automatically.', 0xff4444);
                    this.updateCharacterDisplay();
                    this.peKitRemovalTimer.remove();
                }
            },
            loop: true
        });
    }
    
    animatePEKitDressing() {
        const { width, height } = this.cameras.main;
        
        // Create PE shirt that drops from above
        const shirtText = this.add.text(width/2, height/2 - 150, '👕', {
            fontSize: '40px',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        // Create PE shorts that come from the side
        const shortsText = this.add.text(width/2 + 150, height/2, '🩳', {
            fontSize: '35px',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        // Animate shirt dropping down
        this.tweens.add({
            targets: shirtText,
            y: height/2 - 50,
            duration: 600,
            ease: 'Bounce.easeOut',
            onComplete: () => {
                // Wait 0.5 seconds before flash effect
                this.time.delayedCall(500, () => {
                    this.tweens.add({
                        targets: shirtText,
                        alpha: 0,
                        scale: 2,
                        duration: 300,
                        onComplete: () => shirtText.destroy()
                    });
                });
            }
        });
        
        // Animate shorts sliding in
        this.tweens.add({
            targets: shortsText,
            x: width/2,
            y: height/2 + 20,
            duration: 500,
            delay: 200,
            ease: 'Power2.easeOut',
            onComplete: () => {
                // Wait 0.5 seconds before flash effect
                this.time.delayedCall(500, () => {
                    this.tweens.add({
                        targets: shortsText,
                        alpha: 0,
                        scale: 2,
                        duration: 300,
                        onComplete: () => shortsText.destroy()
                    });
                });
            }
        });
        
        // Add some spin to the clothes
        this.tweens.add({
            targets: [shirtText, shortsText],
            rotation: Math.PI * 2,
            duration: 800,
            ease: 'Power1.easeOut'
        });
    }

    giveSwimmingKit() {
        this.swimmingKit = Math.min(100, this.swimmingKit + 20);
        const items = ['goggles', 'towel', 'crocs', 'trunks'];
        const randomItem = items[Math.floor(Math.random() * items.length)];
        
        this.isWearingSwimGear = true;
        this.currentSwimGear = randomItem;
        
        // Create swimming item animation
        this.animateSwimmingItem(randomItem);
        
        // Dolphin reaction animation
        this.animateDolphinReaction('swimming');
        
        this.showFeedback(`🏊 Got ${randomItem}! +20`, 0x2196F3);
        this.updateStatusBars();
        this.updateCharacterDisplay();
        
        // Check for happy sounds after swimming gear
        this.time.delayedCall(500, () => this.checkForHappySounds());
        
        // Remove swim gear after some time
        if (this.swimGearTimer) {
            this.swimGearTimer.remove();
        }
        
        this.swimGearTimer = this.time.delayedCall(8000, () => {
            this.isWearingSwimGear = false;
            this.currentSwimGear = null;
            this.updateCharacterDisplay();
        });
    }
    
    animateSwimmingItem(itemType) {
        const { width, height } = this.cameras.main;
        
        // Item emojis for each type
        const itemEmojis = {
            goggles: '🥽',
            towel: '🏖️',
            crocs: '🩴',
            trunks: '🩱'
        };
        
        const emoji = itemEmojis[itemType];
        
        // Create the swimming item that bubbles up from below
        const itemText = this.add.text(width/2, height + 100, emoji, {
            fontSize: '45px',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        // Create water splash effect
        this.createWaterSplash(width/2, height/2 + 60);
        
        // Animate item floating up with bubbles
        this.tweens.add({
            targets: itemText,
            y: height/2 - 30,
            duration: 1000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                // Item equip flash
                this.tweens.add({
                    targets: itemText,
                    scale: 1.5,
                    alpha: 0,
                    duration: 500,
                    ease: 'Power2.easeOut',
                    onComplete: () => itemText.destroy()
                });
                
                // Create sparkle effect when equipped
                this.createSparkleEffect(width/2, height/2 - 30);
            }
        });
        
        // Add floating motion
        this.tweens.add({
            targets: itemText,
            x: width/2 + 20,
            duration: 500,
            yoyo: true,
            repeat: 1,
            ease: 'Sine.easeInOut'
        });
        
        // Add rotation
        this.tweens.add({
            targets: itemText,
            rotation: 0.3,
            duration: 1000,
            ease: 'Sine.easeInOut'
        });
    }

    createSparkleEffect(x, y) {
        const sparkles = ['✨', '⭐', '💫', '🌟', '✦'];
        
        for (let i = 0; i < 8; i++) {
            const sparkle = this.add.text(x, y, sparkles[i % sparkles.length], {
                fontSize: '20px',
                fontFamily: 'monospace'
            }).setOrigin(0.5);
            
            // Random direction and distance
            const angle = (i / 8) * Math.PI * 2;
            const distance = Phaser.Math.Between(40, 80);
            const targetX = x + Math.cos(angle) * distance;
            const targetY = y + Math.sin(angle) * distance;
            
            this.tweens.add({
                targets: sparkle,
                x: targetX,
                y: targetY,
                alpha: 0,
                scale: 0.2,
                duration: 800,
                delay: i * 50,
                ease: 'Power2.easeOut',
                onComplete: () => sparkle.destroy()
            });
            
            // Add rotation
            this.tweens.add({
                targets: sparkle,
                rotation: Math.PI * 2,
                duration: 800,
                delay: i * 50,
                ease: 'Power1.easeOut'
            });
        }
    }
    
    createWaterSplash(x, y) {
        const waterDrops = ['💧', '💦', '🌊'];
        
        for (let i = 0; i < 6; i++) {
            const drop = this.add.text(x, y, waterDrops[i % waterDrops.length], {
                fontSize: '16px',
                fontFamily: 'monospace'
            }).setOrigin(0.5);
            
            // Random splash directions
            const angle = (i / 6) * Math.PI + Math.PI; // Upward semicircle
            const distance = Phaser.Math.Between(30, 60);
            const targetX = x + Math.cos(angle) * distance;
            const targetY = y + Math.sin(angle) * distance;
            
            this.tweens.add({
                targets: drop,
                x: targetX,
                y: targetY,
                alpha: 0,
                duration: 600,
                delay: i * 30,
                ease: 'Power2.easeOut',
                onComplete: () => drop.destroy()
            });
        }
    }
    
    animateDolphinReaction(type) {
        const reactions = {
            homework: () => {
                // Happy bounce
                this.tweens.add({
                    targets: this.characterArea,
                    y: this.originalY - 20,
                    duration: 300,
                    yoyo: true,
                    ease: 'Power2.easeOut',
                    onComplete: () => {
                        // Ensure we return to original position
                        this.resetDolphinPosition();
                    }
                });
                
                // Temporary super happy expression
                this.forceExpression('very_happy', 2000);
            },
            pekit: () => {
                // Spin animation
                this.tweens.add({
                    targets: this.characterArea,
                    rotation: Math.PI * 2,
                    duration: 800,
                    ease: 'Power2.easeOut',
                    onComplete: () => {
                        this.characterArea.rotation = 0;
                        // Ensure we return to original position
                        this.resetDolphinPosition();
                    }
                });
                
                // Excited expression
                this.forceExpression('happy', 1500);
            },
            swimming: () => {
                // Swimming motion (controlled side to side within bounds)
                const { width } = this.cameras.main;
                const maxMove = Math.min(50, width * 0.1); // Max 10% of screen width or 50px
                
                this.tweens.add({
                    targets: this.characterArea,
                    x: this.originalX + maxMove,
                    duration: 400,
                    yoyo: true,
                    repeat: 2,
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        // Ensure we return to original position
                        this.resetDolphinPosition();
                    }
                });
                
                // Content expression
                this.forceExpression('content', 1500);
            }
        };
        
        if (reactions[type]) {
            reactions[type]();
        }
    }
    
    resetDolphinPosition() {
        // Stop any existing floating animations to prevent conflicts
        if (this.floatingTween) {
            this.floatingTween.stop();
        }
        if (this.horizontalFloatTween) {
            this.horizontalFloatTween.stop();
        }
        
        // Smoothly return to original center position
        this.tweens.add({
            targets: this.characterArea,
            x: this.originalX,
            y: this.originalY,
            duration: 200,
            ease: 'Power1.easeOut',
            onComplete: () => {
                // Restart gentle floating animation after reset
                this.time.delayedCall(500, () => {
                    this.startFloatingAnimation();
                });
            }
        });
    }
    
    keepDolphinInBounds() {
        const { width, height } = this.cameras.main;
        const margin = 50; // Keep dolphin at least 50px from edges
        
        // Check and correct X position
        if (this.characterArea.x < margin) {
            this.characterArea.x = margin;
        } else if (this.characterArea.x > width - margin) {
            this.characterArea.x = width - margin;
        }
        
        // Check and correct Y position
        if (this.characterArea.y < margin) {
            this.characterArea.y = margin;
        } else if (this.characterArea.y > height - margin) {
            this.characterArea.y = height - margin;
        }
    }
    
    forceExpression(mood, duration) {
        const originalMood = this.currentMood;
        this.currentMood = mood;
        this.updateCharacterDisplay();
        
        this.time.delayedCall(duration, () => {
            this.currentMood = originalMood;
            this.updateCharacterDisplay();
        });
    }

    showFeedback(text, color) {
        const { width, height } = this.cameras.main;
        
        const feedback = this.add.text(width/2, height/2 + 80, text, {
            fontSize: '16px',
            fontFamily: 'monospace',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
            backgroundColor: color,
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
        
        // Wait 0.5 seconds before starting fade animation
        this.time.delayedCall(500, () => {
            this.tweens.add({
                targets: feedback,
                y: height/2 + 40,
                alpha: 0,
                duration: 2000,
                ease: 'Power2',
                onComplete: () => feedback.destroy()
            });
        });
    }

    updateCountdownTimer() {
        const now = new Date();
        const target = new Date();
        
        // Set target to 15:35 (3:35 PM) today
        target.setHours(15, 35, 0, 0);
        
        // If it's already past 15:35 today, set target for tomorrow
        if (now > target) {
            target.setDate(target.getDate() + 1);
        }
        
        const timeLeft = target.getTime() - now.getTime();
        
        if (timeLeft <= 0) {
            this.countdownText.setText('⏰ PICKUP TIME! Dolphin must go!');
            this.countdownText.setFill('#ff0000');
            return;
        }
        
        // Calculate hours, minutes, and seconds
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Format the time string
        let timeString = '';
        if (hours > 0) {
            timeString = `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
            timeString = `${minutes}m ${seconds}s`;
        } else {
            timeString = `${seconds}s`;
        }
        
        // Color coding based on urgency
        let color = '#ffff00'; // Default yellow
        if (timeLeft < 5 * 60 * 1000) { // Less than 5 minutes
            color = '#ff0000'; // Red
        } else if (timeLeft < 30 * 60 * 1000) { // Less than 30 minutes
            color = '#ff8800'; // Orange
        }
        
        this.countdownText.setText(`🚌 Pickup in: ${timeString} (15:35)`);
        this.countdownText.setFill(color);
    }

    checkForHappySounds() {
        const currentTime = this.time.now;
        
        // Only play sounds if dolphin is very happy, not muted, and cooldown has passed
        if (this.currentMood === 'very_happy' && 
            !this.isMuted &&
            currentTime - this.lastDolphinSoundTime > this.dolphinSoundCooldown) {
            
            // 30% chance to play the sound when conditions are met
            if (Math.random() < 0.3) {
                this.dolphinSound.play();
                this.lastDolphinSoundTime = currentTime;
                
                // Trigger water spout effect
                this.startWaterSpout();
                
                // Add visual feedback when sound plays
                this.showFeedback('🐬 *Happy dolphin noises* 🐬', 0x00BFFF);
                
                // Extra sparkle effect for sound
                this.createSparkleEffect(this.cameras.main.width/2, this.cameras.main.height/2 - 20);
            }
        }
    }
    
    startWaterSpout() {
        // Start the water spout effect
        this.isSprayingWater = true;
        this.updateCharacterDisplay();
        
        // Create water droplet effects around the spout
        this.createWaterSpout();
        
        // Stop the water spout after 2 seconds
        this.time.delayedCall(2000, () => {
            this.isSprayingWater = false;
            this.updateCharacterDisplay();
        });
    }
    
    createWaterSpout() {
        const { width, height } = this.cameras.main;
        const spoutX = width/2;
        const spoutY = height/2 - 80; // Above the dolphin
        
        // Create multiple water droplets shooting upward
        for (let i = 0; i < 8; i++) {
            const droplet = this.add.text(spoutX + (i - 4) * 8, spoutY, '💧', {
                fontSize: '12px',
                fontFamily: 'monospace'
            }).setOrigin(0.5);
            
            // Animate droplets shooting up then falling
            this.tweens.add({
                targets: droplet,
                y: spoutY - 40,
                x: spoutX + (i - 4) * 15,
                duration: 800,
                ease: 'Power2.easeOut',
                onComplete: () => {
                    // Fall down
                    this.tweens.add({
                        targets: droplet,
                        y: spoutY + 20,
                        alpha: 0,
                        duration: 600,
                        ease: 'Power2.easeIn',
                        onComplete: () => droplet.destroy()
                    });
                }
            });
            
            // Add delay between droplets for more realistic effect
            this.time.delayedCall(i * 100, () => {
                // Start the animation when it's this droplet's turn
            });
        }
    }

    // Helper functions to show/hide action buttons
    hideActionButtons() {
        this.actionButtons.forEach(buttonObj => {
            if (buttonObj && buttonObj.button) {
                buttonObj.button.setVisible(false).disableInteractive();
                buttonObj.text.setVisible(false);
            }
        });
    }
    
    showActionButtons() {
        this.actionButtons.forEach(buttonObj => {
            if (buttonObj && buttonObj.button) {
                buttonObj.button.setVisible(true).setInteractive();
                buttonObj.text.setVisible(true);
            }
        });
    }

    // Action handlers that check game mode
    handleHomeworkAction() {
        if (this.gameMode === 'advanced' || this.gameMode === 'matt') {
            this.startHomeworkMiniGame();
        } else {
            this.giveHomework();
        }
    }
    
    handlePEKitAction() {
        if (this.gameMode === 'advanced' || this.gameMode === 'matt') {
            this.startPEKitMiniGame();
        } else {
            this.dressPEKit();
        }
    }
    
    handleSwimKitAction() {
        if (this.gameMode === 'advanced' || this.gameMode === 'matt') {
            this.startSwimKitMiniGame();
        } else {
            this.giveSwimmingKit();
        }
    }

    // Mini-game implementations
    startSwimKitMiniGame() {
        if (this.currentMiniGame) {
            this.cleanupMiniGame(); // Clean up any existing mini-game
        }
        
        // Cancel grace period when starting mini-game
        this.cancelGracePeriod();
        
        this.currentMiniGame = 'swim';
        this.collectedItems = [];
        
        const { width, height } = this.cameras.main;
        
        // Matt mode has more items to collect
        const items = this.gameMode === 'matt' 
            ? ['🥽', '🏖️', '🩴', '🩱', '🧴', '☂️'] // goggles, towel, crocs, trunks, sunscreen, umbrella
            : ['🥽', '🏖️', '🩴', '🩱']; // goggles, towel, crocs, trunks
        
        this.showFeedback('Drag all swim items to the SWIM BAG button!', 0x2196F3);
        
        // Hide action buttons during mini-game
        this.hideActionButtons();
        
        // Create visual swim bag
        this.createSwimBag();
        
        // Create draggable items around the screen
        items.forEach((emoji, index) => {
            const x = Phaser.Math.Between(50, width - 50);
            
            // For advanced mode, constrain items between gauges and bag
            let y;
            if (this.gameMode === 'advanced') {
                // Spawn below the status gauges (y > 200) and above the bag (y < height - 250)
                const minY = 200; // Below the status bars
                const maxY = height - 250; // Above the swim bag with buffer
                y = Phaser.Math.Between(minY, Math.max(minY + 50, maxY));
            } else {
                // Standard and Matt modes use full area
                y = Phaser.Math.Between(100, height - 200);
            }
            
            const item = this.add.text(x, y, emoji, {
                fontSize: '30px',
                fontFamily: 'monospace'
            }).setOrigin(0.5);
            
            // Make item draggable with proper bounds
            item.setInteractive({ 
                draggable: true, 
                useHandCursor: true,
                pixelPerfect: false,
                alphaTolerance: 1
            });
            // Set item type based on game mode
            const itemTypes = this.gameMode === 'matt' 
                ? ['goggles', 'towel', 'crocs', 'trunks', 'sunscreen', 'umbrella']
                : ['goggles', 'towel', 'crocs', 'trunks'];
            item.itemType = itemTypes[index];
            
            // Add enhanced glow effect
            item.setStroke('#00ffff', 4);
            
            // Create glowing background circle
            const glowCircle = this.add.circle(x, y, 25, 0x00ffff, 0.3).setDepth(-1);
            item.glowCircle = glowCircle;
            
            // Pulsing glow animation
            this.tweens.add({
                targets: [glowCircle],
                alpha: { from: 0.3, to: 0.6 },
                scale: { from: 1, to: 1.2 },
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Store original position for snapping back if needed
            item.originalX = x;
            item.originalY = y;
            item.isDragging = false;
            
            // Drag events with better error handling
            item.on('dragstart', (pointer) => {
                item.isDragging = true;
                item.setScale(1.2);
                item.setTint(0xffff00);
                item.setDepth(1000); // Bring to front
                if (item.glowCircle) {
                    item.glowCircle.setDepth(999);
                }
            });
            
            item.on('drag', (pointer, dragX, dragY) => {
                if (item.isDragging && item.active) {
                    // Constrain to screen bounds
                    const boundedX = Phaser.Math.Clamp(dragX, 30, width - 30);
                    const boundedY = Phaser.Math.Clamp(dragY, 50, height - 50);
                    item.setPosition(boundedX, boundedY);
                    // Move glow circle with item
                    if (item.glowCircle) {
                        item.glowCircle.setPosition(boundedX, boundedY);
                    }
                }
            });
            
            item.on('dragend', () => {
                if (item.active) {
                    item.isDragging = false;
                    item.setScale(1);
                    item.clearTint();
                    item.setDepth(0);
                    if (item.glowCircle) {
                        item.glowCircle.setDepth(-1);
                    }
                    this.checkItemDrop(item);
                }
            });
            
            // Add pointer down for mobile support
            item.on('pointerdown', () => {
                if (!item.isDragging) {
                    item.setScale(1.1);
                }
            });
            
            item.on('pointerup', () => {
                if (!item.isDragging) {
                    item.setScale(1);
                }
            });
            
            this.miniGameItems.push(item);
        });
    }
    
    createSwimBag() {
        const { width, height } = this.cameras.main;
        
        // Position the bag in the center-bottom area
        const bagX = width/2;
        const bagY = height - 180;
        
        // Create interactive bag button (similar to action buttons)
        this.swimBagDropButton = this.add.rectangle(bagX, bagY, 120, 100, 0x2196F3)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(3, 0xffffff);
        
        // Create bag text
        const bagText = this.add.text(bagX, bagY - 15, 'SWIM BAG', {
            fontSize: '14px',
            fontFamily: 'monospace',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        // Create bag icon
        const bagIcon = this.add.text(bagX, bagY + 10, '🏊‍♀️', {
            fontSize: '24px',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        // Create instruction text
        const instructionText = this.add.text(bagX, bagY + 35, 'Drop items here!', {
            fontSize: '10px',
            fontFamily: 'monospace',
            fill: '#cccccc',
            align: 'center'
        }).setOrigin(0.5);
        
        // Hover effects
        this.swimBagDropButton.on('pointerover', () => {
            this.swimBagDropButton.setScale(1.05);
            bagText.setScale(1.05);
            bagIcon.setScale(1.05);
            instructionText.setScale(1.05);
            this.swimBagDropButton.setFillStyle(0x42A5F5);
        });
        
        this.swimBagDropButton.on('pointerout', () => {
            this.swimBagDropButton.setScale(1);
            bagText.setScale(1);
            bagIcon.setScale(1);
            instructionText.setScale(1);
            this.swimBagDropButton.setFillStyle(0x2196F3);
        });
        
        // Pulsing animation for button
        this.tweens.add({
            targets: this.swimBagDropButton,
            alpha: { from: 0.8, to: 1 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Store bag position for drop detection
        this.swimBagX = bagX;
        this.swimBagY = bagY;
        
        // Store references for hiding/showing
        this.swimBagElements = [this.swimBagDropButton, bagText, bagIcon, instructionText];
        
        // Add all elements to cleanup list
        this.miniGameItems.push(this.swimBagDropButton, bagText, bagIcon, instructionText);
    }
    
    hideSwimBag() {
        if (this.swimBagElements) {
            this.swimBagElements.forEach(element => {
                if (element && element.setVisible) {
                    element.setVisible(false);
                    if (element.disableInteractive) {
                        element.disableInteractive();
                    }
                }
            });
        }
    }

    checkItemDrop(item) {
        if (!item.active || !this.swimBagX) return;
        
        const distance = Phaser.Math.Distance.Between(
            item.x, item.y,
            this.swimBagX, this.swimBagY
        );
        
        if (distance < 80) { // Close enough to the swim bag
            // Item collected!
            this.collectedItems.push(item.itemType);
            
            // Disable further interaction
            item.disableInteractive();
            
            // Animate item and glow circle into bag
            const animTargets = [item];
            if (item.glowCircle) {
                animTargets.push(item.glowCircle);
            }
            
            this.tweens.add({
                targets: animTargets,
                x: this.swimBagX,
                y: this.swimBagY,
                scale: 0.5,
                alpha: 0,
                duration: 300,
                ease: 'Power2.easeIn',
                onComplete: () => {
                    if (item.active) {
                        item.destroy();
                    }
                    if (item.glowCircle && item.glowCircle.active) {
                        item.glowCircle.destroy();
                    }
                    this.checkSwimGameComplete();
                }
            });
            
            // Visual feedback
            this.createSparkleEffect(this.swimBagX, this.swimBagY);
        }
    }
    
    checkSwimGameComplete() {
        const requiredItems = this.gameMode === 'matt' ? 6 : 4;
        if (this.collectedItems.length >= requiredItems) {
            // All items collected!
            this.completeSwimMiniGame();
        }
    }
    
    completeSwimMiniGame() {
        this.currentMiniGame = null;
        this.miniGameItems = [];
        
        // Give swimming kit reward
        this.swimmingKit = Math.min(100, this.swimmingKit + 25);
        this.showFeedback('🏊 Swim kit complete! +25', 0x2196F3);
        
        // Show action buttons again and hide swim bag
        this.showActionButtons();
        this.hideSwimBag();
        
        // Trigger original animations
        this.animateDolphinReaction('swimming');
        this.updateStatusBars();
        this.updateCharacterDisplay();
        this.time.delayedCall(500, () => this.checkForHappySounds());
    }
    
    startPEKitMiniGame() {
        if (this.currentMiniGame) {
            this.cleanupMiniGame(); // Clean up any existing mini-game
        }
        
        // Cancel grace period when starting mini-game
        this.cancelGracePeriod();
        
        this.currentMiniGame = 'pe';
        this.showFeedback('Quick! Catch the falling PE kit!', 0xFF9800);
        
        // Hide action buttons during mini-game
        this.hideActionButtons();
        
        const { width, height } = this.cameras.main;
        let itemsCaught = 0;
        let itemsProcessed = 0; // Track total items that have been caught or missed
        
        // Matt mode has more items and faster drops
        const totalItems = this.gameMode === 'matt' ? 5 : 3;
        const dropDuration = this.gameMode === 'matt' ? 2000 : 3000; // Faster in Matt mode
        
        // Drop PE items from the top
        const dropItem = (emoji, delay) => {
            this.time.delayedCall(delay, () => {
                const x = Phaser.Math.Between(100, width - 100);
                const item = this.add.text(x, 50, emoji, {
                    fontSize: '35px',
                    fontFamily: 'monospace'
                }).setOrigin(0.5);
                
                item.setInteractive({ useHandCursor: true });
                item.setStroke('#ffffff', 2);
                
                // Falling animation
                this.tweens.add({
                    targets: item,
                    y: height - 150,
                    duration: dropDuration,
                    ease: 'Power1.easeIn',
                    onComplete: () => {
                        if (!item.caught) {
                            item.setTint(0xff0000);
                            itemsProcessed++;
                            this.time.delayedCall(500, () => {
                                item.destroy();
                                this.checkPEGameComplete(itemsCaught, itemsProcessed, totalItems);
                            });
                        }
                    }
                });
                
                // Click to catch
                item.on('pointerdown', () => {
                    if (!item.caught && item.active) {
                        item.caught = true;
                        itemsCaught++;
                        itemsProcessed++;
                        
                        // Disable further interaction
                        item.disableInteractive();
                        
                        this.tweens.add({
                            targets: item,
                            scale: 1.5,
                            alpha: 0,
                            duration: 300,
                            onComplete: () => {
                                if (item.active) {
                                    item.destroy();
                                }
                                this.checkPEGameComplete(itemsCaught, itemsProcessed, totalItems);
                            }
                        });
                        
                        this.createSparkleEffect(item.x, item.y);
                    }
                });
                
                this.miniGameItems.push(item);
            });
        };
        
        if (this.gameMode === 'matt') {
            // Matt mode: 5 items dropping faster
            dropItem('👕', 300);  // Shirt
            dropItem('🩳', 800);  // Shorts  
            dropItem('👟', 1300); // Shoes
            dropItem('🧦', 1800); // Socks
            dropItem('🎽', 2300); // Tank top
        } else {
            // Standard/Advanced mode: 3 items
            dropItem('👕', 500);  // Shirt
            dropItem('🩳', 1500); // Shorts  
            dropItem('👟', 2500); // Shoes
        }
    }
    
    checkPEGameComplete(itemsCaught, itemsProcessed, totalItems) {
        if (itemsProcessed >= totalItems) {
            // All items have been processed (caught or missed)
            if (itemsCaught >= totalItems) {
                // All items were caught - success!
                this.completePEMiniGame();
            } else {
                // Some items were missed - failure!
                this.failPEMiniGame(itemsCaught, totalItems);
            }
        }
    }
    
    failPEMiniGame(itemsCaught, totalItems) {
        this.currentMiniGame = null;
        this.miniGameItems.forEach(item => item.destroy());
        this.miniGameItems = [];
        
        const itemsMissed = totalItems - itemsCaught;
        this.showFeedback(`💔 PE kit failed! Caught ${itemsCaught}/${totalItems} items`, 0xff4444);
        
        // Show action buttons again
        this.showActionButtons();
        
        this.updateStatusBars();
        this.updateCharacterDisplay();
    }
    
    completePEMiniGame() {
        this.currentMiniGame = null;
        this.miniGameItems.forEach(item => item.destroy());
        this.miniGameItems = [];
        
        // Give PE kit reward
        this.peKit = 100;
        this.isDressed = true;
        this.peKitCondition = 'clean';
        
        this.showFeedback('👕 PE kit caught! 100%', 0xFF9800);
        
        // Show action buttons again
        this.showActionButtons();
        this.animateDolphinReaction('pekit');
        this.updateStatusBars();
        this.updateCharacterDisplay();
        this.time.delayedCall(500, () => this.checkForHappySounds());
        
        // Set up PE kit degradation
        if (this.peKitRemovalTimer) {
            this.peKitRemovalTimer.remove();
        }
        
        this.peKitRemovalTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.peKit < 20) {
                    this.isDressed = false;
                    this.showFeedback('PE kit too dirty! Removed automatically.', 0xff4444);
                    this.updateCharacterDisplay();
                    this.peKitRemovalTimer.remove();
                }
            },
            loop: true
        });
    }
    
    startHomeworkMiniGame() {
        if (this.currentMiniGame) {
            this.cleanupMiniGame(); // Clean up any existing mini-game
        }
        
        // Cancel grace period when starting mini-game
        this.cancelGracePeriod();
        
        this.currentMiniGame = 'homework';
        this.showFeedback('Answer math questions until homework > 80%!', 0x4CAF50);
        
        // Hide action buttons during mini-game
        this.hideActionButtons();
        
        const { width, height } = this.cameras.main;
        
        // Generate math problem based on game mode
        let num1, num2, correctAnswer, problemText;
        
        if (this.gameMode === 'matt') {
            // Harder math for Matt mode
            const operations = ['+', '-', '×', '÷'];
            const operation = Phaser.Utils.Array.GetRandom(operations);
            
            switch (operation) {
                case '+':
                    num1 = Phaser.Math.Between(10, 25);
                    num2 = Phaser.Math.Between(10, 25);
                    correctAnswer = num1 + num2;
                    problemText = `${num1} + ${num2} = ?`;
                    break;
                case '-':
                    num1 = Phaser.Math.Between(15, 30);
                    num2 = Phaser.Math.Between(5, num1 - 1);
                    correctAnswer = num1 - num2;
                    problemText = `${num1} - ${num2} = ?`;
                    break;
                case '×':
                    num1 = Phaser.Math.Between(2, 8);
                    num2 = Phaser.Math.Between(2, 8);
                    correctAnswer = num1 * num2;
                    problemText = `${num1} × ${num2} = ?`;
                    break;
                case '÷':
                    correctAnswer = Phaser.Math.Between(2, 12);
                    num2 = Phaser.Math.Between(2, 8);
                    num1 = correctAnswer * num2;
                    problemText = `${num1} ÷ ${num2} = ?`;
                    break;
            }
        } else {
            // Simple addition for standard and advanced modes
            num1 = Phaser.Math.Between(1, 10);
            num2 = Phaser.Math.Between(1, 10);
            correctAnswer = num1 + num2;
            problemText = `${num1} + ${num2} = ?`;
        }
        
        // Create problem display
        const problemDisplay = this.add.text(width/2, height/2 - 60, problemText, {
            fontSize: '24px',
            fontFamily: 'monospace',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Create answer options
        const answers = [correctAnswer];
        while (answers.length < 3) {
            const wrongAnswer = correctAnswer + Phaser.Math.Between(-3, 3);
            if (wrongAnswer !== correctAnswer && wrongAnswer > 0 && !answers.includes(wrongAnswer)) {
                answers.push(wrongAnswer);
            }
        }
        
        // Shuffle answers
        Phaser.Utils.Array.Shuffle(answers);
        
        // Create answer buttons
        answers.forEach((answer, index) => {
            const button = this.add.rectangle(
                width/2 + (index - 1) * 100, 
                height/2, 
                80, 50, 
                0x4CAF50
            ).setInteractive({ useHandCursor: true });
            
            const buttonText = this.add.text(
                width/2 + (index - 1) * 100, 
                height/2, 
                answer.toString(), 
                {
                    fontSize: '20px',
                    fontFamily: 'monospace',
                    fill: '#ffffff'
                }
            ).setOrigin(0.5);
            
            button.on('pointerdown', () => {
                this.handleHomeworkButtonClick(button, buttonText, answer, correctAnswer);
            });
            
            this.miniGameItems.push(button, buttonText);
        });
        
        this.miniGameItems.push(problemDisplay);
        
        // Create return button
        this.createHomeworkReturnButton();
    }
    
    createHomeworkReturnButton() {
        const { width, height } = this.cameras.main;
        
        // Position the return button in the bottom area
        const returnX = width/2;
        const returnY = height - 180;
        
        // Create interactive return button (similar to swim bag button)
        this.homeworkReturnButton = this.add.rectangle(returnX, returnY, 120, 80, 0x666666)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(3, 0xffffff);
        
        // Create return text
        const returnText = this.add.text(returnX, returnY - 10, 'RETURN', {
            fontSize: '14px',
            fontFamily: 'monospace',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        // Create return icon
        const returnIcon = this.add.text(returnX, returnY + 15, '🔙', {
            fontSize: '20px',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        // Hover effects
        this.homeworkReturnButton.on('pointerover', () => {
            this.homeworkReturnButton.setScale(1.05);
            returnText.setScale(1.05);
            returnIcon.setScale(1.05);
            this.homeworkReturnButton.setFillStyle(0x888888);
        });
        
        this.homeworkReturnButton.on('pointerout', () => {
            this.homeworkReturnButton.setScale(1);
            returnText.setScale(1);
            returnIcon.setScale(1);
            this.homeworkReturnButton.setFillStyle(0x666666);
        });
        
        // Click handler - exit homework mini-game
        this.homeworkReturnButton.on('pointerdown', () => {
            this.exitHomeworkMiniGame();
        });
        
        // Store references for cleanup
        this.homeworkReturnElements = [this.homeworkReturnButton, returnText, returnIcon];
        
        // Add all elements to cleanup list
        this.miniGameItems.push(this.homeworkReturnButton, returnText, returnIcon);
    }
    
    exitHomeworkMiniGame() {
        this.currentMiniGame = null;
        this.miniGameItems.forEach(item => item.destroy());
        this.miniGameItems = [];
        
        this.showFeedback('📚 Homework session ended.', 0x888888);
        
        // Show action buttons again
        this.showActionButtons();
        
        this.updateStatusBars();
        this.updateCharacterDisplay();
    }
    
    handleHomeworkButtonClick(button, buttonText, answer, correctAnswer) {
        if (!button.active) return;
        
        // Disable all buttons temporarily to prevent multiple clicks
        this.miniGameItems.forEach(item => {
            if (item.input && item.input.enabled) {
                item.disableInteractive();
            }
        });
        
        if (answer === correctAnswer) {
            // Correct answer visual feedback
            button.setFillStyle(0x00ff00); // Bright green
            button.setScale(1.3);
            buttonText.setScale(1.3);
            buttonText.setTint(0xffffff);
            
            // Sparkle effect on correct answer
            this.createSparkleEffect(button.x, button.y);
            
            // Show homework folder animation immediately instead of checkmark
            this.animateHomework();
            
            // Proceed much faster without checkmark delay
            this.time.delayedCall(300, () => {
                this.handleCorrectHomeworkAnswer();
            });
            
        } else {
            // Wrong answer visual feedback
            button.setFillStyle(0xff4444); // Bright red
            button.setScale(1.3);
            buttonText.setScale(1.3);
            buttonText.setTint(0xffffff);
            
            // Add X or error indicator
            const errormark = this.add.text(button.x, button.y - 70, '✗ WRONG!', {
                fontSize: '20px',
                fontFamily: 'monospace',
                fill: '#ff4444',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5).setAlpha(0);
            
            this.tweens.add({
                targets: errormark,
                alpha: 1,
                scale: { from: 0.3, to: 1.3 },
                duration: 400,
                ease: 'Back.easeOut'
            });
            
            // Shake animation for wrong answer
            this.tweens.add({
                targets: [button, buttonText],
                x: button.x + 15,
                duration: 120,
                yoyo: true,
                repeat: 3,
                ease: 'Power2.easeInOut'
            });
            
            // Reset button after feedback
            this.time.delayedCall(900, () => {
                if (button.active && errormark.active) {
                    button.setFillStyle(0x4CAF50);
                    button.setScale(1);
                    buttonText.setScale(1);
                    buttonText.clearTint();
                    errormark.destroy();
                    
                    // Re-enable all buttons
                    this.miniGameItems.forEach(item => {
                        if (item.input) {
                            item.setInteractive();
                        }
                    });
                }
            });
        }
    }

    handleCorrectHomeworkAnswer() {
        // Give homework reward for correct answer
        this.homework = Math.min(100, this.homework + 15);
        this.updateStatusBars();
        this.updateCharacterDisplay();
        
        // Visual feedback for correct answer
        this.showFeedback('📚 Correct! +15', 0x4CAF50);
        
        // Check if homework is over 80%
        if (this.homework > 80) {
            // Complete the mini-game
            this.completeHomeworkMiniGame();
        } else {
            // Generate a new question after a short delay
            this.time.delayedCall(1000, () => {
                this.generateNewHomeworkQuestion();
            });
        }
    }
    
    generateNewHomeworkQuestion() {
        // Clean up current question elements
        this.miniGameItems.forEach(item => {
            if (item && item.active) {
                item.destroy();
            }
        });
        this.miniGameItems = [];
        
        // Generate math problem based on game mode (same logic as startHomeworkMiniGame)
        const { width, height } = this.cameras.main;
        let num1, num2, correctAnswer, problemText;
        
        if (this.gameMode === 'matt') {
            // Harder math for Matt mode
            const operations = ['+', '-', '×', '÷'];
            const operation = Phaser.Utils.Array.GetRandom(operations);
            
            switch (operation) {
                case '+':
                    num1 = Phaser.Math.Between(10, 25);
                    num2 = Phaser.Math.Between(10, 25);
                    correctAnswer = num1 + num2;
                    problemText = `${num1} + ${num2} = ?`;
                    break;
                case '-':
                    num1 = Phaser.Math.Between(15, 30);
                    num2 = Phaser.Math.Between(5, num1 - 1);
                    correctAnswer = num1 - num2;
                    problemText = `${num1} - ${num2} = ?`;
                    break;
                case '×':
                    num1 = Phaser.Math.Between(2, 8);
                    num2 = Phaser.Math.Between(2, 8);
                    correctAnswer = num1 * num2;
                    problemText = `${num1} × ${num2} = ?`;
                    break;
                case '÷':
                    correctAnswer = Phaser.Math.Between(2, 12);
                    num2 = Phaser.Math.Between(2, 8);
                    num1 = correctAnswer * num2;
                    problemText = `${num1} ÷ ${num2} = ?`;
                    break;
            }
        } else {
            // Simple addition for standard and advanced modes
            num1 = Phaser.Math.Between(1, 10);
            num2 = Phaser.Math.Between(1, 10);
            correctAnswer = num1 + num2;
            problemText = `${num1} + ${num2} = ?`;
        }
        
        // Create problem display
        const problemDisplay = this.add.text(width/2, height/2 - 60, problemText, {
            fontSize: '24px',
            fontFamily: 'monospace',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Create answer options
        const answers = [correctAnswer];
        while (answers.length < 3) {
            const wrongAnswer = correctAnswer + Phaser.Math.Between(-3, 3);
            if (wrongAnswer !== correctAnswer && wrongAnswer > 0 && !answers.includes(wrongAnswer)) {
                answers.push(wrongAnswer);
            }
        }
        
        // Shuffle answers
        Phaser.Utils.Array.Shuffle(answers);
        
        // Create answer buttons
        answers.forEach((answer, index) => {
            const button = this.add.rectangle(
                width/2 + (index - 1) * 100, 
                height/2, 
                80, 50, 
                0x4CAF50
            ).setInteractive({ useHandCursor: true });
            
            const buttonText = this.add.text(
                width/2 + (index - 1) * 100, 
                height/2, 
                answer.toString(), 
                {
                    fontSize: '20px',
                    fontFamily: 'monospace',
                    fill: '#ffffff'
                }
            ).setOrigin(0.5);
            
            button.on('pointerdown', () => {
                this.handleHomeworkButtonClick(button, buttonText, answer, correctAnswer);
            });
            
            this.miniGameItems.push(button, buttonText);
        });
        
        this.miniGameItems.push(problemDisplay);
        
        // Re-create return button for new question
        this.createHomeworkReturnButton();
    }
    
    completeHomeworkMiniGame() {
        this.currentMiniGame = null;
        this.miniGameItems.forEach(item => item.destroy());
        this.miniGameItems = [];
        
        this.showFeedback('📚 Homework session complete! Well done!', 0x4CAF50);
        
        // Show action buttons again
        this.showActionButtons();
        
        this.animateDolphinReaction('homework');
        this.updateStatusBars();
        this.updateCharacterDisplay();
        this.time.delayedCall(500, () => this.checkForHappySounds());
    }

    // Cleanup function for mini-games
    cleanupMiniGame() {
        if (this.currentMiniGame) {
            this.miniGameItems.forEach(item => {
                if (item && item.active) {
                    // Remove all event listeners first
                    if (item.removeAllListeners) {
                        item.removeAllListeners();
                    }
                    // Disable interactivity to prevent further events
                    if (item.disableInteractive) {
                        item.disableInteractive();
                    }
                    // Clean up glow circles for swim items
                    if (item.glowCircle && item.glowCircle.active) {
                        item.glowCircle.destroy();
                    }
                    // Destroy the item
                    item.destroy();
                }
            });
            
            // Clean up swim bag
            if (this.swimBagDropButton && this.swimBagDropButton.active) {
                this.swimBagDropButton.destroy();
                this.swimBagDropButton = null;
                this.swimBagX = null;
                this.swimBagY = null;
            }
            
            // Clean up homework return button
            if (this.homeworkReturnButton && this.homeworkReturnButton.active) {
                this.homeworkReturnButton.destroy();
                this.homeworkReturnButton = null;
            }
            
            this.miniGameItems = [];
            this.collectedItems = [];
            this.currentMiniGame = null;
        }
    }

    update() {
        // Any continuous updates can go here
    }

    destroy() {
        // Clean up mini-games when scene is destroyed
        this.cleanupMiniGame();
        
        // Clean up grace period
        this.cancelGracePeriod();
        
        // Clean up animated bubbles
        if (this.animatedBubbles) {
            this.animatedBubbles.forEach(bubble => {
                if (bubble && bubble.active) {
                    bubble.destroy();
                }
            });
            this.animatedBubbles = [];
        }
        
        super.destroy();
    }
    
    startPlayTimeTracking() {
        this.playTimeStart = Date.now();
        
        // Save play time every 5 seconds
        this.time.addEvent({
            delay: 5000,
            callback: this.savePlayTime,
            callbackScope: this,
            loop: true
        });
    }
    
    savePlayTime() {
        const sessionTime = Date.now() - this.playTimeStart;
        const existingTime = parseInt(localStorage.getItem('dolphinTamagotchiPlayTime') || '0');
        const totalTime = existingTime + sessionTime;
        localStorage.setItem('dolphinTamagotchiPlayTime', totalTime.toString());
        
        // Reset session timer
        this.playTimeStart = Date.now();
    }
    
    createASCIIParticleExplosion(x, y) {
        if (this.gameMode !== 'matt') return; // Only in Matt mode
        
        const asciiChars = ['*', '#', '@', '&', '%', '$', '!', '?', '~', '^', '+', '=', '<', '>', '|', '\\', '/', '_', '-', '`', '\'', '"', ':', ';', ',', '.'];
        const particleCount = Phaser.Math.Between(15, 25);
        
        for (let i = 0; i < particleCount; i++) {
            const char = Phaser.Utils.Array.GetRandom(asciiChars);
            
            // Create ASCII particle
            const particle = this.add.text(x, y, char, {
                fontSize: Phaser.Math.Between(14, 24) + 'px',
                fontFamily: 'monospace',
                fill: '#' + Phaser.Display.Color.HSVColorWheel()[Math.floor(Math.random() * 360)].color.toString(16).padStart(6, '0'),
                stroke: '#000000',
                strokeThickness: 1
            }).setOrigin(0.5);
            
            // Random direction and velocity
            const angle = Math.random() * Math.PI * 2;
            const speed = Phaser.Math.Between(100, 300);
            const velocityX = Math.cos(angle) * speed;
            const velocityY = Math.sin(angle) * speed;
            
            // Initial rotation
            particle.rotation = Math.random() * Math.PI * 2;
            
            // Animate the particle
            this.tweens.add({
                targets: particle,
                x: x + velocityX * 0.5,
                y: y + velocityY * 0.5,
                alpha: 0,
                scale: { from: 1, to: 0.2 },
                rotation: particle.rotation + (Math.random() * 6 - 3),
                duration: Phaser.Math.Between(800, 1500),
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });
            
            // Add gravity effect
            this.tweens.add({
                targets: particle,
                y: particle.y + 50,
                duration: Phaser.Math.Between(800, 1500),
                ease: 'Power1.easeIn'
            });
        }
    }
    
    addMattModeClickEffects() {
        if (this.gameMode !== 'matt') return;
        
        // Add global click listener for crazy effects
        this.input.on('pointerdown', (pointer) => {
            this.createASCIIParticleExplosion(pointer.x, pointer.y);
            
            // Random chance for extra effects
            if (Math.random() < 0.3) {
                this.createRandomGlitchEffect();
            }
        });
    }
    
    createRandomGlitchEffect() {
        if (this.gameMode !== 'matt') return;
        
        const { width, height } = this.cameras.main;
        const effects = [
            () => this.createFloatingText(),
            () => this.createColorFlash(),
            () => this.createScreenShake()
        ];
        
        const randomEffect = Phaser.Utils.Array.GetRandom(effects);
        randomEffect();
    }
    
    createFloatingText() {
        const { width, height } = this.cameras.main;
        const messages = ['MATT MODE!', 'CHAOS!', 'WILD!', '🔥🔥🔥', 'EXTREME!', '!!!', '???', 'WOW!'];
        const message = Phaser.Utils.Array.GetRandom(messages);
        
        const x = Phaser.Math.Between(50, width - 50);
        const y = Phaser.Math.Between(50, height - 50);
        
        const text = this.add.text(x, y, message, {
            fontSize: '20px',
            fontFamily: 'monospace',
            fill: '#ff00ff',
            stroke: '#ffff00',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: text,
            y: y - 100,
            alpha: 0,
            scale: { from: 0.5, to: 2 },
            rotation: Math.PI * 2,
            duration: 2000,
            ease: 'Power2.easeOut',
            onComplete: () => text.destroy()
        });
    }
    
    createColorFlash() {
        const flash = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 
            Phaser.Display.Color.HSVColorWheel()[Math.floor(Math.random() * 360)].color, 0.3
        ).setOrigin(0, 0).setDepth(500); // Lower depth so timer stays visible
        
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 300,
            onComplete: () => flash.destroy()
        });
    }
    
    createScreenShake() {
        this.cameras.main.shake(200, 0.02);
    }
    
    checkGameOver() {
        // Don't check during mini-games or if already game over
        if (this.gameOver || this.currentMiniGame) return;
        
        // Check which meter(s) are at 0
        const zeroMeters = [];
        if (this.homework <= 0) zeroMeters.push('homework');
        if (this.peKit <= 0) zeroMeters.push('PE kit');
        if (this.swimmingKit <= 0) zeroMeters.push('swimming kit');
        
        if (zeroMeters.length > 0) {
            // If grace timer isn't already running, start it
            if (!this.graceTimer) {
                this.startGracePeriod(zeroMeters);
            }
        } else {
            // All meters are above 0, cancel grace period if running
            if (this.graceTimer) {
                this.cancelGracePeriod();
            }
        }
    }
    
    startGracePeriod(zeroMeters) {
        this.graceTimeLeft = 5; // 5 seconds
        this.graceReason = zeroMeters;
        
        // Show critical warning
        this.showCriticalWarning();
        
        // Start countdown timer
        this.graceTimer = this.time.addEvent({
            delay: 1000, // Every second
            callback: () => {
                this.graceTimeLeft--;
                this.updateCriticalWarning();
                
                if (this.graceTimeLeft <= 0) {
                    // Time's up - game over
                    this.gameOver = true;
                    this.hideCriticalWarning();
                    this.showGameOverScreen();
                    this.graceTimer.remove();
                    this.graceTimer = null;
                }
            },
            repeat: 4 // Run 5 times total (0-4)
        });
    }
    
    cancelGracePeriod() {
        if (this.graceTimer) {
            this.graceTimer.remove();
            this.graceTimer = null;
        }
        this.graceTimeLeft = 0;
        this.graceReason = null;
        this.hideCriticalWarning();
    }
    
    showCriticalWarning() {
        const { width, height } = this.cameras.main;
        
        // Create warning overlay
        this.criticalOverlay = this.add.rectangle(0, 0, width, height, 0xff0000, 0.2)
            .setOrigin(0, 0)
            .setDepth(500);
        
        // Create warning text container
        this.criticalWarningContainer = this.add.container(width/2, height/2 - 150).setDepth(501);
        
        // Warning title
        this.criticalTitle = this.add.text(0, -30, '⚠️ CRITICAL WARNING ⚠️', {
            fontSize: '24px',
            fontFamily: 'monospace',
            fill: '#ff0000',
            stroke: '#ffffff',
            strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5);
        
        // Warning message
        const reason = this.graceReason.join(' and ');
        this.criticalMessage = this.add.text(0, 0, `${reason.toUpperCase()} AT ZERO!`, {
            fontSize: '18px',
            fontFamily: 'monospace',
            fill: '#ffffff',
            stroke: '#ff0000',
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5);
        
        // Countdown timer
        this.criticalCountdown = this.add.text(0, 30, `GAME OVER IN: ${this.graceTimeLeft}`, {
            fontSize: '20px',
            fontFamily: 'monospace',
            fill: '#ffff00',
            stroke: '#000000',
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5);
        
        // Add to container
        this.criticalWarningContainer.add([this.criticalTitle, this.criticalMessage, this.criticalCountdown]);
        
        // Pulsing animation
        this.tweens.add({
            targets: this.criticalWarningContainer,
            scale: { from: 1, to: 1.1 },
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Screen shake
        this.cameras.main.shake(5000, 0.01); // Gentle shake for 5 seconds
    }
    
    updateCriticalWarning() {
        if (this.criticalCountdown) {
            this.criticalCountdown.setText(`GAME OVER IN: ${this.graceTimeLeft}`);
            
            // Increase urgency as time runs out
            if (this.graceTimeLeft <= 2) {
                this.criticalCountdown.setFill('#ff0000');
                this.criticalCountdown.setFontSize('24px');
            }
        }
    }
    
    hideCriticalWarning() {
        if (this.criticalOverlay) {
            this.criticalOverlay.destroy();
            this.criticalOverlay = null;
        }
        if (this.criticalWarningContainer) {
            this.criticalWarningContainer.destroy();
            this.criticalWarningContainer = null;
        }
        this.criticalTitle = null;
        this.criticalMessage = null;
        this.criticalCountdown = null;
    }
    
    showGameOverScreen() {
        const { width, height } = this.cameras.main;
        
        // Clean up any running mini-games
        this.cleanupMiniGame();
        
        // Hide action buttons
        this.hideActionButtons();
        
        // Calculate survival time
        const survivalTime = Date.now() - this.sessionStartTime;
        const survivalTimeText = this.formatSurvivalTime(survivalTime);
        
        // Check for new best time
        const currentBest = this.getBestTime(this.gameMode);
        const isNewBest = survivalTime > currentBest;
        if (isNewBest) {
            this.setBestTime(this.gameMode, survivalTime);
        }
        
        // Create semi-transparent overlay
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8)
            .setOrigin(0, 0)
            .setDepth(1000);
        
        // Game Over title
        const gameOverTitle = this.add.text(width/2, height/2 - 120, '💀 GAME OVER 💀', {
            fontSize: '32px',
            fontFamily: 'monospace',
            fill: '#ff0000',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5).setDepth(1001);
        
        // Survival time display with best time indicator
        const survivalDisplayText = isNewBest 
            ? `🏆 NEW BEST TIME! 🏆\n${survivalTimeText}`
            : `You survived for:\n${survivalTimeText}`;
        
        const survivalText = this.add.text(width/2, height/2 - 60, survivalDisplayText, {
            fontSize: '20px',
            fontFamily: 'monospace',
            fill: isNewBest ? '#ffd700' : '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5).setDepth(1001);
        
        // Game mode display
        const modeText = this.add.text(width/2, height/2 - 10, `Playing in ${this.gameMode.toUpperCase()} MODE`, {
            fontSize: '16px',
            fontFamily: 'monospace',
            fill: this.gameMode === 'matt' ? '#ff4444' : this.gameMode === 'advanced' ? '#4444ff' : '#44ff44',
            stroke: '#000000',
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5).setDepth(1001);
        
        // Previous best time display (if not a new best)
        let bestTimeText = null;
        if (!isNewBest && currentBest > 0) {
            const previousBestText = this.formatSurvivalTime(currentBest);
            bestTimeText = this.add.text(width/2, height/2 + 10, `Previous best: ${previousBestText}`, {
                fontSize: '14px',
                fontFamily: 'monospace',
                fill: '#cccccc',
                stroke: '#000000',
                strokeThickness: 1,
                align: 'center'
            }).setOrigin(0.5).setDepth(1001);
        }
        
        // Failure reason
        const failureReason = this.graceReason ? this.graceReason.join(' and ') : 'all needs';
        const failureText = this.add.text(width/2, height/2 + (bestTimeText ? 30 : 15), `Failure: ${failureReason} reached zero`, {
            fontSize: '14px',
            fontFamily: 'monospace',
            fill: '#ff8888',
            stroke: '#000000',
            strokeThickness: 1,
            align: 'center'
        }).setOrigin(0.5).setDepth(1001);
        
        // Dolphin's final state
        const finalStateText = this.add.text(width/2, height/2 + (bestTimeText ? 50 : 35), '🐬 Your dolphin is completely exhausted! 💤', {
            fontSize: '14px',
            fontFamily: 'monospace',
            fill: '#cccccc',
            stroke: '#000000',
            strokeThickness: 1,
            align: 'center'
        }).setOrigin(0.5).setDepth(1001);
        
        // Back to menu button
        const backButton = this.add.rectangle(width/2, height/2 + 90, 200, 50, 0x666666)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(3, 0xffffff)
            .setDepth(1001);
        
        const backButtonText = this.add.text(width/2, height/2 + 90, 'BACK TO MODE SELECT', {
            fontSize: '14px',
            fontFamily: 'monospace',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setDepth(1001);
        
        // Try again button (same mode)
        const tryAgainButton = this.add.rectangle(width/2, height/2 + 150, 160, 50, 0x4CAF50)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(3, 0xffffff)
            .setDepth(1001);
        
        const tryAgainButtonText = this.add.text(width/2, height/2 + 150, 'TRY AGAIN', {
            fontSize: '14px',
            fontFamily: 'monospace',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setDepth(1001);
        
        // Button hover effects
        backButton.on('pointerover', () => {
            backButton.setFillStyle(0x888888);
            backButton.setScale(1.05);
            backButtonText.setScale(1.05);
        });
        
        backButton.on('pointerout', () => {
            backButton.setFillStyle(0x666666);
            backButton.setScale(1);
            backButtonText.setScale(1);
        });
        
        tryAgainButton.on('pointerover', () => {
            tryAgainButton.setFillStyle(0x66BB6A);
            tryAgainButton.setScale(1.05);
            tryAgainButtonText.setScale(1.05);
        });
        
        tryAgainButton.on('pointerout', () => {
            tryAgainButton.setFillStyle(0x4CAF50);
            tryAgainButton.setScale(1);
            tryAgainButtonText.setScale(1);
        });
        
        // Button click handlers
        backButton.on('pointerdown', () => {
            this.scene.start('ModeSelectionScene');
        });
        
        tryAgainButton.on('pointerdown', () => {
            // Restart the same game mode
            this.scene.restart();
        });
        
        // Animate elements appearing
        const gameOverElements = [gameOverTitle, survivalText, modeText, failureText, finalStateText, backButton, backButtonText, tryAgainButton, tryAgainButtonText];
        if (bestTimeText) {
            gameOverElements.splice(3, 0, bestTimeText); // Insert after modeText
        }
        
        gameOverElements.forEach((element, index) => {
            element.setAlpha(0);
            element.setScale(0.5);
            
            this.tweens.add({
                targets: element,
                alpha: 1,
                scale: 1,
                duration: 500,
                delay: index * 100,
                ease: 'Back.easeOut'
            });
        });
        
        // Pulse animation for game over title
        this.tweens.add({
            targets: gameOverTitle,
            scale: { from: 1, to: 1.1 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    formatSurvivalTime(timeMs) {
        const totalSeconds = Math.floor(timeMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        } else {
            return `${seconds}s`;
        }
    }
} 