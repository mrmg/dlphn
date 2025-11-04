import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestore, collection, query, orderBy, getDocs, deleteDoc, doc, writeBatch as firestoreWriteBatch, getDoc } from 'firebase/firestore';
import { getAnalytics, logEvent } from 'firebase/analytics';

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
const db = getFirestore(app);
const functions = getFunctions(app);
const analytics = getAnalytics(app);

// Analytics tracking functions
function trackEvent(eventName, parameters = {}) {
    try {
        logEvent(analytics, eventName, {
            ...parameters,
            page: 'character_gallery',
            timestamp: new Date().toISOString()
        });
        console.log('Analytics event:', eventName, parameters);
    } catch (error) {
        console.warn('Analytics tracking error:', error);
    }
}

function trackPageView() {
    trackEvent('page_view', {
        page_title: 'Character Gallery',
        page_location: '/horrid/gallery'
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Track page view
    trackPageView();
    
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const gallery = document.getElementById('gallery');
    const emptyGallery = document.getElementById('emptyGallery');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalPrompt = document.getElementById('modalPrompt');
    const closeModal = document.querySelector('.close-button');
    const recreateBtn = document.getElementById('recreateBtn');
    const printBtn = document.getElementById('printBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    
    // Modal navigation elements
    const prevModalBtn = document.getElementById('prevModalBtn');
    const nextModalBtn = document.getElementById('nextModalBtn');
    
    // Pagination elements
    const pagination = document.getElementById('pagination');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInfo = document.getElementById('pageInfo');
    
    // Gallery display
    const currentGalleryNameElement = document.getElementById('currentGalleryName');
    
    let characters = [];
    let currentCharacter = null;
    let currentCharacterIndex = -1;
    let galleries = [];
    let currentGalleryName = 'choose';
    let showAllImages = false;
    
    // Pagination variables
    const CHARACTERS_PER_PAGE = 8;


    // Gallery management functions
    async function loadGalleries() {
        try {
            const storedGalleries = localStorage.getItem('horrid_galleries');
            if (storedGalleries) {
                galleries = JSON.parse(storedGalleries);
            } else {
                galleries = [
                    { id: 'choose', name: 'CHOOSE', created: new Date().toISOString() },
                    { id: 'default', name: 'Default', created: new Date().toISOString() },
                    { id: 'monster', name: 'Monster', created: new Date().toISOString() }
                ];
                localStorage.setItem('horrid_galleries', JSON.stringify(galleries));
            }
            
            // Load current gallery from Firebase
            await loadCurrentGallery();
            
            updateGallerySelectors();
        } catch (error) {
            console.error('Error loading galleries:', error);
        }
    }

    // Load current gallery setting from Firebase
    async function loadCurrentGallery() {
        try {
            const currentGalleryDoc = await getDoc(doc(db, 'settings', 'currentGallery'));
            if (currentGalleryDoc.exists()) {
                const data = currentGalleryDoc.data();
                currentGalleryName = data.galleryId || 'choose';
            } else {
                currentGalleryName = 'choose';
            }
            
            // Update the display text
            updateGalleryDisplay();
        } catch (error) {
            console.error('Error loading current gallery:', error);
            currentGalleryName = 'choose';
            updateGalleryDisplay();
        }
    }

    // Update the gallery display text
    function updateGalleryDisplay() {
        if (currentGalleryName === 'choose') {
            currentGalleryNameElement.textContent = 'CHOOSE';
        } else {
            // Find the gallery name from the galleries array
            const gallery = galleries.find(g => g.id === currentGalleryName);
            currentGalleryNameElement.textContent = gallery ? gallery.name : currentGalleryName.toUpperCase();
        }
    }


    let currentPage = 1;
    let totalPages = 1;

    // Load characters from Firestore
    async function loadCharacters() {
        try {
            showLoading();
            hideError();
            
            const charactersRef = collection(db, 'characterQueries');
            const q = query(charactersRef, orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            
            characters = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.status === 'completed' && data.imageUrl) {
                    // Filter by gallery if not showing all images
                    // Only show characters that match the current gallery
                    // Characters without a gallery field should only appear in 'default' gallery
                    if (currentGalleryName === 'choose' || 
                        (currentGalleryName === 'default' && (!data.gallery || data.gallery === 'default')) ||
                        (currentGalleryName === 'monster' && data.gallery === 'monster') ||
                        (currentGalleryName !== 'default' && currentGalleryName !== 'monster' && data.gallery === currentGalleryName)) {
                        characters.push({
                            id: doc.id,
                            ...data
                        });
                    }
                }
            });
            
            hideLoading();
            
            if (characters.length === 0) {
                showEmptyGallery();
            } else {
                displayCharacters();
                
                // Check for deep link parameter after displaying
                const urlParams = new URLSearchParams(window.location.search);
                const viewCharacterId = urlParams.get('view');
                
                if (viewCharacterId) {
                    const targetCharacter = characters.find(c => c.id === viewCharacterId);
                    if (targetCharacter) {
                        // Find which page the character is on
                        const targetCharacterIndex = characters.findIndex(c => c.id === viewCharacterId);
                        if (targetCharacterIndex !== -1) {
                            currentPage = Math.floor(targetCharacterIndex / CHARACTERS_PER_PAGE) + 1;
                            displayCharacters(); // Re-render with correct page
                        }
                        
                        // Open the specific character
                        setTimeout(() => {
                            openModal(targetCharacter);
                        }, 500);
                    }
                }
            }
            
        } catch (err) {
            console.error('Error loading characters:', err);
            hideLoading();
            showError('Failed to load characters. Please try again!');
        }
    }

    // Display characters in grid with pagination
    function displayCharacters() {
        gallery.innerHTML = '';
        
        // Calculate pagination
        totalPages = Math.ceil(characters.length / CHARACTERS_PER_PAGE);
        const startIndex = (currentPage - 1) * CHARACTERS_PER_PAGE;
        const endIndex = startIndex + CHARACTERS_PER_PAGE;
        const charactersToShow = characters.slice(startIndex, endIndex);
        
        // Display characters for current page
        charactersToShow.forEach(character => {
            const card = createCharacterCard(character);
            gallery.appendChild(card);
        });
        
        // Update pagination controls
        updatePaginationControls();
        
        gallery.style.display = 'grid';
        emptyGallery.style.display = 'none';
        pagination.style.display = characters.length > CHARACTERS_PER_PAGE ? 'flex' : 'none';
    }

    // Update pagination controls
    function updatePaginationControls() {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    // Go to previous page
    function goToPreviousPage() {
        if (currentPage > 1) {
            currentPage--;
            displayCharacters();
            trackEvent('character_gallery_pagination', {
                action: 'previous',
                page: currentPage,
                event_category: 'gallery_actions'
            });
        }
    }

    // Go to next page
    function goToNextPage() {
        if (currentPage < totalPages) {
            currentPage++;
            displayCharacters();
            trackEvent('character_gallery_pagination', {
                action: 'next',
                page: currentPage,
                event_category: 'gallery_actions'
            });
        }
    }

    // Create character card element
    function createCharacterCard(character) {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.onclick = () => openModal(character);
        
        const img = document.createElement('img');
        img.src = character.imageUrl;
        img.alt = 'Character Image';
        img.className = 'character-image';
        img.loading = 'lazy';
        
        const creator = document.createElement('div');
        creator.className = 'character-creator';
        creator.style.textAlign = 'center';
        creator.style.fontSize = '1.2em';
        creator.style.fontWeight = 'bold';
        creator.innerHTML = `<div style="color: #2196F3;">Created by:</div><div style="color: #F44336; font-size: 1.5em">${character.creatorName || 'Anonymous'}</div>`;
        
        card.appendChild(img);
        card.appendChild(creator);
        
        return card;
    }

    // Open modal with character details
    function openModal(character) {
        currentCharacter = character;
        currentCharacterIndex = characters.findIndex(c => c.id === character.id);
        modalImage.src = character.imageUrl;
        modalImage.alt = 'Character Image';
        modalPrompt.textContent = character.characterDescription || 'No description available';
        
        trackEvent('character_gallery_view', {
            character_id: character.id,
            has_creator_name: !!character.creatorName,
            event_category: 'gallery_actions'
        });
        
        // Update modal prompt label to include creator
        const promptLabel = document.querySelector('.modal-prompt-label');
        if (character.creatorName && character.creatorName !== 'Anonymous') {
            promptLabel.textContent = `${character.creatorName}`;
        } else {
            promptLabel.textContent = 'Anonymous';
        }
        
        // Hide admin controls (admin access is now only via /horrid/admin)
        deleteBtn.style.display = 'none';
        
        // Update navigation button states
        updateNavigationButtons();
        
        imageModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Update URL with deep link
        const newUrl = `${window.location.pathname}?view=${character.id}`;
        window.history.pushState({}, '', newUrl);
    }

    // Close modal
    function closeModalHandler() {
        imageModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentCharacter = null;
        currentCharacterIndex = -1;
        
        // Clear URL parameter when closing modal
        const url = new URL(window.location);
        url.searchParams.delete('view');
        window.history.pushState({}, '', url);
    }

    // Update navigation button states
    function updateNavigationButtons() {
        if (currentCharacterIndex === -1) {
            prevModalBtn.disabled = true;
            nextModalBtn.disabled = true;
            return;
        }
        
        prevModalBtn.disabled = currentCharacterIndex === 0;
        nextModalBtn.disabled = currentCharacterIndex === characters.length - 1;
    }

    // Navigate to previous character
    function navigateToPrevious() {
        if (currentCharacterIndex > 0) {
            const prevCharacter = characters[currentCharacterIndex - 1];
            openModal(prevCharacter);
            
            trackEvent('character_gallery_navigate', {
                direction: 'previous',
                character_id: prevCharacter.id,
                event_category: 'gallery_actions'
            });
        }
    }

    // Navigate to next character
    function navigateToNext() {
        if (currentCharacterIndex < characters.length - 1) {
            const nextCharacter = characters[currentCharacterIndex + 1];
            openModal(nextCharacter);
            
            trackEvent('character_gallery_navigate', {
                direction: 'next',
                character_id: nextCharacter.id,
                event_category: 'gallery_actions'
            });
        }
    }

    // Recreate character (load prompt into editor)
    function recreateCharacter() {
        if (currentCharacter && currentCharacter.characterDescription) {
            // Store the prompt in localStorage and redirect to character creator
            const description = currentCharacter.characterDescription;
            localStorage.setItem('characterDescription', description);
            localStorage.setItem('recreateMode', 'true');
            window.location.href = '/horrid';
        }
    }

    // Print character
    function printCharacter() {
        if (currentCharacter) {
            // Create a new window for printing
            const printWindow = window.open('', '_blank');
            const printContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Character Print - ${currentCharacter.characterDescription}</title>
                    <style>
                        body {
                            font-family: 'Dacherry', sans-serif;
                            margin: 0;
                            padding: 20px;
                            background-color: white;
                            text-align: center;
                        }
                        .character-container {
                            max-width: 600px;
                            margin: 0 auto;
                        }
                        .character-image {
                            width: 100%;
                            max-width: 500px;
                            height: auto;
                            border: 6px solid #000;
                            border-radius: 20px;
                            margin: 20px 0;
                            box-shadow: 0 8px 0 #000;
                        }
                        .character-prompt {
                            background-color: #FFF3E0;
                            border: 4px solid #FF9800;
                            border-radius: 20px;
                            padding: 30px;
                            margin: 20px 0;
                            font-size: 1.5em;
                            font-weight: normal;
                            color: #E65100;
                            position: relative;
                            text-align: center;
                        }
                        .character-prompt::before {
                            content: '"';
                            font-size: 4em;
                            color: #FF9800;
                            position: absolute;
                            top: -20px;
                            left: 30px;
                        }
                        .character-prompt::after {
                            content: '"';
                            font-size: 4em;
                            color: #FF9800;
                            position: absolute;
                            bottom: -30px;
                            right: 30px;
                        }
                        .character-title {
                            color: #2196F3;
                            font-size: 2.5em;
                            font-weight: normal;
                            text-shadow: 3px 3px 0 #000;
                            margin-bottom: 20px;
                        }
                        .character-subtitle {
                            color: #9C27B0;
                            font-size: 1.2em;
                            font-weight: normal;
                            text-shadow: 1px 1px 0 #000;
                            margin-bottom: 30px;
                        }
                        @media print {
                            body { margin: 0; padding: 10px; }
                            .character-container { max-width: 100%; }
                        }
                    </style>
                </head>
                <body>
                    <div class="character-container">
                        <h1 class="character-title">HORRIBLE HENRY'S CHARACTER</h1>
                        <p class="character-subtitle">Created by: ${currentCharacter.creatorName || 'Anonymous'}</p>
                        <img src="${currentCharacter.imageUrl}" alt="Character Image" class="character-image">
                        <div class="character-prompt">${currentCharacter.characterDescription}</div>
                    </div>
                </body>
                </html>
            `;
            
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    }

    // Download character image
    function downloadCharacter() {
        if (currentCharacter) {
            const link = document.createElement('a');
            link.href = currentCharacter.imageUrl;
            link.download = `horrible-henry-character-${currentCharacter.id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    // Share character link
    function shareCharacter() {
        if (currentCharacter) {
            const shareUrl = `${window.location.origin}/horrid/gallery?view=${currentCharacter.id}`;
            
            // Try to use Web Share API if available
            if (navigator.share) {
                navigator.share({
                    title: 'Check out this amazing character!',
                    text: `Created by ${currentCharacter.creatorName || 'Anonymous'}: "${currentCharacter.characterDescription}"`,
                    url: shareUrl
                }).catch(err => {
                    console.log('Error sharing:', err);
                    fallbackShare(shareUrl);
                });
            } else {
                fallbackShare(shareUrl);
            }
            
            trackEvent('character_gallery_share', {
                character_id: currentCharacter.id,
                event_category: 'gallery_actions'
            });
        }
    }

    // Fallback share method
    function fallbackShare(shareUrl) {
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Link copied to clipboard! Share it with others to view this character directly.');
        }).catch(() => {
            // If clipboard fails, show the URL in a prompt
            prompt('Copy this link to share the character:', shareUrl);
        });
    }

    // Delete character (admin only - function kept for compatibility but button is hidden)
    async function deleteCharacter() {
        if (!currentCharacter) return;
        
        if (confirm('Are you sure you want to delete this character? This action cannot be undone!')) {
            try {
                trackEvent('character_gallery_delete_start', {
                    character_id: currentCharacter.id,
                    event_category: 'gallery_actions'
                });
                
                // Call Cloud Function to delete character
                const functions = getFunctions();
                const deleteCharacterFunction = httpsCallable(functions, 'deleteCharacter');
                
                await deleteCharacterFunction({
                    characterId: currentCharacter.id
                });
                
                trackEvent('character_gallery_delete_success', {
                    character_id: currentCharacter.id,
                    event_category: 'gallery_actions'
                });
                
                // Remove from local array
                characters = characters.filter(c => c.id !== currentCharacter.id);
                
                // Refresh display
                if (characters.length === 0) {
                    showEmptyGallery();
                } else {
                    displayCharacters();
                }
                
                // Close modal
                closeModalHandler();
                
                // Show success message
                console.log('Character deleted successfully!');
                
            } catch (err) {
                console.error('Error deleting character:', err);
            }
        }
    }


    // Event listeners
    closeModal.onclick = closeModalHandler;
    recreateBtn.onclick = recreateCharacter;
    printBtn.onclick = printCharacter;
    downloadBtn.onclick = downloadCharacter;
    shareBtn.onclick = shareCharacter;
    deleteBtn.onclick = deleteCharacter;
    
    
    // Modal navigation event listeners
    prevModalBtn.onclick = navigateToPrevious;
    nextModalBtn.onclick = navigateToNext;
    
    // Pagination event listeners
    prevBtn.onclick = goToPreviousPage;
    nextBtn.onclick = goToNextPage;
    
    // Close modal when clicking outside
    imageModal.onclick = (e) => {
        if (e.target === imageModal) {
            closeModalHandler();
        }
    };
    
    // Close modal with Escape key and navigation with arrow keys
    document.addEventListener('keydown', (e) => {
        if (imageModal.style.display === 'block') {
            if (e.key === 'Escape') {
                closeModalHandler();
            } else if (e.key === 'ArrowLeft' && !prevModalBtn.disabled) {
                navigateToPrevious();
            } else if (e.key === 'ArrowRight' && !nextModalBtn.disabled) {
                navigateToNext();
            }
        }
    });

    // Helper functions
    function showLoading() {
        loading.style.display = 'block';
        gallery.style.display = 'none';
        emptyGallery.style.display = 'none';
    }

    function hideLoading() {
        loading.style.display = 'none';
    }

    function showError(message) {
        error.textContent = message;
        error.style.display = 'block';
    }

    function hideError() {
        error.style.display = 'none';
    }

    function showEmptyGallery() {
        emptyGallery.style.display = 'block';
        gallery.style.display = 'none';
    }

    // Check if we're coming from recreate mode
    if (localStorage.getItem('recreateMode') === 'true') {
        localStorage.removeItem('recreateMode');
        // Silently load the prompt without showing an alert
    }
    
    // Load galleries and characters on page load
    loadGalleries();
    loadCharacters();
});