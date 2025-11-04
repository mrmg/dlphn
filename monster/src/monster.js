import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { generateMonsterImage } from './services/monsterService.js';

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
const analytics = getAnalytics(app);

// Analytics tracking functions
function trackEvent(eventName, parameters = {}) {
    try {
        logEvent(analytics, eventName, {
            ...parameters,
            page: 'monster_creator',
            timestamp: new Date().toISOString()
        });
        console.log('Analytics event:', eventName, parameters);
    } catch (error) {
        console.warn('Analytics tracking error:', error);
    }
}

function trackPageView() {
    trackEvent('page_view', {
        page_title: 'Monster Creator',
        page_location: '/monster/'
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Track page view
    trackPageView();
    
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const ideasBtn = document.getElementById('ideasBtn');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const result = document.getElementById('result');
    const imageContainer = document.getElementById('imageContainer');
    const monsterDescription = document.getElementById('monsterDescription');
    const characterCount = document.getElementById('characterCount');
    const printBtn = document.getElementById('printBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const metadata = document.getElementById('metadata');
    
    // Ideas modal elements
    const ideasModal = document.getElementById('ideasModal');
    const ideasClose = document.querySelector('.ideas-close');
    const closeIdeasBtn = document.getElementById('closeIdeasBtn');
    
    // Mode toggle elements
    const modeToggle = document.getElementById('modeToggle');
    const detailedMode = document.getElementById('detailedMode');
    const eyesDescription = document.getElementById('eyesDescription');
    const headsDescription = document.getElementById('headsDescription');
    const armsDescription = document.getElementById('armsDescription');
    const legsDescription = document.getElementById('legsDescription');
    
    // Speech-to-text elements
    const microphoneBtn = document.getElementById('microphoneBtn');
    const speechTimer = document.getElementById('speechTimer');
    const speechStatus = document.getElementById('speechStatus');
    
    let isDetailedMode = false;
    let isRecording = false;
    let recognition = null;
    let recordingTimer = null;
    let silenceTimer = null;
    const SILENCE_TIMEOUT = 2500; // 2.5 seconds

    // Initialize speech recognition
    function initSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            microphoneBtn.style.display = 'none';
            return false;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        // Improved speech recognition settings
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1; // Only get the best result
        
        // Set silence timeout to 2.5 seconds (2500ms)
        if ('webkitSpeechRecognition' in window) {
            recognition.continuous = true;
            // WebKit specific settings for longer silence detection
            recognition.interimResults = true;
        }
        
        // Store the original text before voice input starts
        let originalText = '';
        let accumulatedFinalText = '';

        recognition.onstart = () => {
            isRecording = true;
            microphoneBtn.classList.add('recording');
            speechTimer.style.display = 'block';
            speechStatus.style.display = 'block';
            speechStatus.textContent = 'Listening...';
            
            // Clear existing text and start fresh for each voice session
            originalText = '';
            accumulatedFinalText = '';
            
            // Clear the textarea immediately when starting new voice session
            monsterDescription.value = '';
            characterCount.textContent = '0 / 500 characters';
            characterCount.classList.remove('warning');
            
            startRecordingTimer();
            startSilenceTimer();
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            // Process results from the resultIndex onwards (new results only)
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                const isFinal = event.results[i].isFinal;
                
                if (isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            // Reset silence timer on any speech activity
            if (finalTranscript || interimTranscript) {
                resetSilenceTimer();
            }

            // Accumulate final transcripts
            if (finalTranscript) {
                accumulatedFinalText += finalTranscript;
            }

            // Build the complete text for display
            let completeText = originalText + accumulatedFinalText;
            
            // Add current interim transcript for real-time display
            if (interimTranscript) {
                completeText += interimTranscript;
            }
            
            // Update the textarea content in real-time
            monsterDescription.value = completeText;
            
            // Update character count
            const count = monsterDescription.value.length;
            characterCount.textContent = `${count} / 500 characters`;
            if (count > 450) {
                characterCount.classList.add('warning');
            } else {
                characterCount.classList.remove('warning');
            }
            
            // Trigger input event to update any other listeners
            monsterDescription.dispatchEvent(new Event('input'));
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            
            // Don't stop on certain recoverable errors
            if (event.error === 'no-speech' || event.error === 'audio-capture') {
                console.log('Recoverable error, continuing...');
                speechStatus.textContent = 'No speech detected, keep talking...';
                return;
            }
            
            stopRecording();
            speechStatus.textContent = 'Error: ' + event.error;
            setTimeout(() => {
                speechStatus.style.display = 'none';
            }, 3000);
        };

        recognition.onend = () => {
            // Speech recognition ended (likely due to 2.5 second silence timeout)
            if (isRecording) {
                console.log('Speech recognition ended due to silence timeout');
                stopRecording();
            }
        };

        return true;
    }

    // Start recording timer (30 seconds max)
    function startRecordingTimer() {
        let timeLeft = 30;
        speechTimer.textContent = `${timeLeft}s`;
        
        recordingTimer = setInterval(() => {
            timeLeft--;
            speechTimer.textContent = `${timeLeft}s`;
            
            if (timeLeft <= 0) {
                stopRecording();
            }
        }, 1000);
    }

    // Start silence timer (2.5 seconds)
    function startSilenceTimer() {
        clearSilenceTimer();
        silenceTimer = setTimeout(() => {
            if (isRecording) {
                console.log('Silence timeout reached, stopping recording');
                stopRecording();
            }
        }, SILENCE_TIMEOUT);
    }

    // Reset silence timer
    function resetSilenceTimer() {
        if (isRecording) {
            startSilenceTimer();
        }
    }

    // Clear silence timer
    function clearSilenceTimer() {
        if (silenceTimer) {
            clearTimeout(silenceTimer);
            silenceTimer = null;
        }
    }

    // Stop recording
    function stopRecording() {
        isRecording = false;
        
        if (recognition) {
            try {
                recognition.stop();
            } catch (error) {
                console.log('Error stopping recognition:', error);
            }
        }
        
        microphoneBtn.classList.remove('recording');
        speechTimer.style.display = 'none';
        speechStatus.style.display = 'none';
        
        if (recordingTimer) {
            clearInterval(recordingTimer);
            recordingTimer = null;
        }
        
        clearSilenceTimer();
    }

    // Microphone button click handler
    microphoneBtn.addEventListener('click', () => {
        if (isRecording) {
            stopRecording();
            trackEvent('monster_speech_stop', {
                event_category: 'speech_to_text'
            });
        } else {
            if (recognition) {
                recognition.start();
                trackEvent('monster_speech_start', {
                    event_category: 'speech_to_text'
                });
            } else {
                speechStatus.style.display = 'block';
                speechStatus.textContent = 'Speech not supported';
                trackEvent('monster_speech_error', {
                    error: 'not_supported',
                    event_category: 'speech_to_text'
                });
                setTimeout(() => {
                    speechStatus.style.display = 'none';
                }, 3000);
            }
        }
    });

    // Initialize speech recognition on page load
    initSpeechRecognition();

    // Character counting with visual feedback
    monsterDescription.addEventListener('input', () => {
        const count = monsterDescription.value.length;
        const maxLength = 500;
        
        characterCount.textContent = `${count} / ${maxLength} characters`;
        
        if (count > maxLength * 0.9) {
            characterCount.classList.add('warning');
        } else {
            characterCount.classList.remove('warning');
        }
    });

    // Mode toggle functionality
    modeToggle.addEventListener('click', () => {
        isDetailedMode = !isDetailedMode;
        
        if (isDetailedMode) {
            detailedMode.style.display = 'block';
            modeToggle.textContent = 'Switch to Standard Mode';
            trackEvent('monster_mode_switch', {
                mode: 'detailed',
                event_category: 'ui_interaction'
            });
        } else {
            detailedMode.style.display = 'none';
            modeToggle.textContent = 'Switch to Detailed Mode';
            trackEvent('monster_mode_switch', {
                mode: 'standard',
                event_category: 'ui_interaction'
            });
        }
    });

    // Generate monster image
    generateBtn.addEventListener('click', async () => {
        const description = monsterDescription.value.trim();
        const creatorName = document.getElementById('creatorName').value.trim();

        if (!description) {
            showError('Please describe your monster! We need to know what to create!');
            trackEvent('monster_generation_error', {
                error: 'no_description',
                event_category: 'monster_generation'
            });
            return;
        }

        if (description.length < 10) {
            showError('Please give us more details about your monster! The more you tell us, the better it will look!');
            trackEvent('monster_generation_error', {
                error: 'description_too_short',
                description_length: description.length,
                event_category: 'monster_generation'
            });
            return;
        }

        // Build enhanced description for detailed mode
        let enhancedDescription = description;
        if (isDetailedMode) {
            const eyes = eyesDescription.value.trim();
            const heads = headsDescription.value.trim();
            const arms = armsDescription.value.trim();
            const legs = legsDescription.value.trim();
            
            if (eyes || heads || arms || legs) {
                enhancedDescription += ' Eyes: ' + (eyes || 'not specified') + 
                                    ' Head: ' + (heads || 'not specified') + 
                                    ' Arms: ' + (arms || 'not specified') + 
                                    ' Legs: ' + (legs || 'not specified');
            }
        }

        // Track generation attempt
        trackEvent('monster_generation_start', {
            mode: isDetailedMode ? 'detailed' : 'standard',
            description_length: description.length,
            has_creator_name: !!creatorName,
            event_category: 'monster_generation'
        });

        // Hide previous results and show loading
        hideAllSections();
        showLoading();

        try {
            console.log('Generating monster with description:', enhancedDescription);
            const imageResult = await generateMonsterImage({
                monsterDescription: enhancedDescription,
                creatorName: creatorName || 'Anonymous'
            });

            console.log('Monster generated successfully:', imageResult);
            
            // Track successful generation
            trackEvent('monster_generation_success', {
                mode: isDetailedMode ? 'detailed' : 'standard',
                description_length: description.length,
                has_creator_name: !!creatorName,
                image_url: imageResult.imageUrl,
                event_category: 'monster_generation'
            });
            
            // Clear all fields after successful generation
            clearAllFields();
            
            // Redirect to gallery with the specific monster view
            window.location.href = `/monster/gallery?view=${imageResult.queryId}`;

        } catch (err) {
            console.error('Error generating monster:', err);
            showError('Oops! Something went wrong creating your monster. Please try again!');
            
            // Track generation error
            trackEvent('monster_generation_error', {
                error: 'api_error',
                error_message: err.message || 'Unknown error',
                mode: isDetailedMode ? 'detailed' : 'standard',
                event_category: 'monster_generation'
            });
        } finally {
            // Don't hide loading since we're redirecting
            // hideLoading();
        }
    });

    // Print functionality
    printBtn.addEventListener('click', () => {
        trackEvent('monster_print', {
            event_category: 'monster_actions'
        });
        window.print();
    });

    // Download functionality
    downloadBtn.addEventListener('click', () => {
        const img = imageContainer.querySelector('img');
        if (img) {
            trackEvent('monster_download', {
                event_category: 'monster_actions'
            });
            const link = document.createElement('a');
            link.href = img.src;
            link.download = `horrible-henry-monster-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });

    // Clear button functionality
    clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all fields? This will remove all your work!')) {
            trackEvent('monster_clear_all', {
                event_category: 'ui_interaction'
            });
            clearAllFields();
            hideAllSections();
        }
    });

    // Ideas button functionality
    ideasBtn.addEventListener('click', () => {
        trackEvent('monster_ideas_open', {
            event_category: 'ui_interaction'
        });
        ideasModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    // Close ideas modal
    function closeIdeasModal() {
        ideasModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Ideas modal event listeners
    ideasClose.onclick = closeIdeasModal;
    closeIdeasBtn.onclick = closeIdeasModal;
    
    // Close modal when clicking outside
    ideasModal.onclick = (e) => {
        if (e.target === ideasModal) {
            closeIdeasModal();
        }
    };
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && ideasModal.style.display === 'block') {
            closeIdeasModal();
        }
    });

    // Helper functions
    function clearAllFields() {
        // Stop any ongoing recording
        if (isRecording) {
            stopRecording();
        }
        
        // Clear main description
        monsterDescription.value = '';
        characterCount.textContent = '0 / 500 characters';
        characterCount.classList.remove('warning');
        
        // Clear detailed mode fields
        eyesDescription.value = '';
        headsDescription.value = '';
        armsDescription.value = '';
        legsDescription.value = '';
        
        // Clear name field
        document.getElementById('creatorName').value = '';
        
        // Clear localStorage
        localStorage.removeItem('monsterDescription');
        localStorage.removeItem('recreateMode');
        
        // Reset mode to standard
        if (isDetailedMode) {
            modeToggle.click();
        }
        
        // Clear any accumulated voice text
        if (typeof accumulatedFinalText !== 'undefined') {
            accumulatedFinalText = '';
        }
        if (typeof originalText !== 'undefined') {
            originalText = '';
        }
    }

    function showError(message) {
        error.textContent = message;
        error.style.display = 'block';
        generateBtn.disabled = false;
    }

    function hideAllSections() {
        error.style.display = 'none';
        result.style.display = 'none';
        loading.style.display = 'none';
    }

    function showLoading() {
        loading.style.display = 'block';
        generateBtn.disabled = true;
    }

    function hideLoading() {
        loading.style.display = 'none';
        generateBtn.disabled = false;
    }

    function displayResult(imageResult, originalDescription) {
        // Clear previous content
        imageContainer.innerHTML = '';

        // Create and display the image
        const img = document.createElement('img');
        img.src = `data:${imageResult.contentType};base64,${imageResult.imageData}`;
        img.alt = 'Generated Monster';
        img.className = 'monster-image';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        
        imageContainer.appendChild(img);

        // Add print-friendly description section
        const descriptionDiv = document.createElement('div');
        descriptionDiv.className = 'monster-description';
        const creatorName = document.getElementById('creatorName').value.trim();
        const nameText = creatorName ? ` by ${creatorName}` : '';
        descriptionDiv.innerHTML = `
            <h3>Monster Description${nameText}</h3>
            <p>${originalDescription || 'No description available'}</p>
        `;
        imageContainer.appendChild(descriptionDiv);

        // Add metadata
        metadata.innerHTML = `
            <div style="text-align: center;">
                <p><strong>Generation Method:</strong> ${imageResult.method === 'vertex_ai' ? 'AI Generated (Vertex AI)' : 'Artistic Fallback'}</p>
                <p><strong>🆔 Monster ID:</strong> ${imageResult.queryId}</p>
                <p><strong>Full Size:</strong> <a href="${imageResult.imageUrl}" target="_blank" style="color: #9C27B0; text-decoration: none; font-weight: normal;">View Full Size Image</a></p>
                <p style="margin-top: 10px; font-style: italic; color: #666;">Your monster has been saved to the cloud!</p>
            </div>
        `;

        // Show result
        result.style.display = 'block';

        // Add gallery link to metadata with deep linking
        const galleryLink = document.createElement('div');
        galleryLink.style.cssText = 'text-align: center; margin-top: 15px;';
        galleryLink.innerHTML = `
            <a href="/monster/gallery?view=${imageResult.queryId}" style="background-color: #9C27B0; color: white; border: 3px solid #000; padding: 10px 20px; border-radius: 15px; text-decoration: none; font-weight: normal; display: inline-block; margin: 5px;">
                View in Gallery
            </a>
        `;
        metadata.appendChild(galleryLink);

        // Scroll to result
        result.scrollIntoView({ behavior: 'smooth' });
    }

    // Add some fun interactions
    monsterDescription.addEventListener('focus', () => {
        monsterDescription.style.borderColor = '#4CAF50';
        monsterDescription.style.boxShadow = '0 0 15px rgba(76, 175, 80, 0.5)';
    });

    monsterDescription.addEventListener('blur', () => {
        monsterDescription.style.borderColor = '#000';
        monsterDescription.style.boxShadow = 'none';
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to generate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (!generateBtn.disabled) {
                generateBtn.click();
            }
        }
    });

    // Add some fun sound effects (visual feedback)
    generateBtn.addEventListener('mouseenter', () => {
        generateBtn.style.transform = 'translateY(-3px) scale(1.05)';
    });

    generateBtn.addEventListener('mouseleave', () => {
        if (!generateBtn.disabled) {
            generateBtn.style.transform = 'translateY(0) scale(1)';
        }
    });

    // Auto-save description to localStorage
    monsterDescription.addEventListener('input', () => {
        localStorage.setItem('monsterDescription', monsterDescription.value);
    });

    // Load saved description on page load
    const savedDescription = localStorage.getItem('monsterDescription');
    if (savedDescription) {
        monsterDescription.value = savedDescription;
        monsterDescription.dispatchEvent(new Event('input')); // Trigger character count update
    }
});