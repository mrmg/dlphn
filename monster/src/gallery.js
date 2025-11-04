import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestore, collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
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
            page: 'monster_gallery',
            timestamp: new Date().toISOString()
        });
        console.log('Analytics event:', eventName, parameters);
    } catch (error) {
        console.warn('Analytics tracking error:', error);
    }
}

function trackPageView() {
    trackEvent('page_view', {
        page_title: 'Monster Gallery',
        page_location: '/monster/gallery'
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
    
    // Admin elements
    const adminPanel = document.getElementById('adminPanel');
    const adminToggle = document.getElementById('adminToggle');
    const adminCode = document.getElementById('adminCode');
    const adminLogin = document.getElementById('adminLogin');
    const adminLogout = document.getElementById('adminLogout');
    const adminStatus = document.getElementById('adminStatus');
    
    let monsters = [];
    let currentMonster = null;
    let currentMonsterIndex = -1;
    let isAdmin = false;
    
    // Pagination variables
    const MONSTERS_PER_PAGE = 8;

    // Cookie utility functions
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }

    // Check for existing admin login on page load
    function initializeAdminLogin() {
        const adminCookie = getCookie('monster_admin_logged_in');
        if (adminCookie === 'true') {
            isAdmin = true;
            adminPanel.style.display = 'block';
            adminLogin.style.display = 'none';
            adminLogout.style.display = 'inline-block';
            adminToggle.textContent = 'Hide Admin';
            adminStatus.textContent = 'Logged in as admin';
            adminStatus.style.color = '#4CAF50';
        }
    }

    let currentPage = 1;
    let totalPages = 1;

    // Load monsters from Firestore
    async function loadMonsters() {
        try {
            showLoading();
            hideError();
            
            const monstersRef = collection(db, 'monsterQueries');
            const q = query(monstersRef, orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            
            monsters = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.status === 'completed' && data.imageUrl) {
                    monsters.push({
                        id: doc.id,
                        ...data
                    });
                }
            });
            
            hideLoading();
            
            if (monsters.length === 0) {
                showEmptyGallery();
            } else {
                // Check for deep link parameter before displaying
                const urlParams = new URLSearchParams(window.location.search);
                const viewMonsterId = urlParams.get('view');
                
                if (viewMonsterId) {
                    // Find the target monster and calculate which page it's on
                    const targetMonsterIndex = monsters.findIndex(m => m.id === viewMonsterId);
                    if (targetMonsterIndex !== -1) {
                        // Calculate which page the monster is on
                        currentPage = Math.floor(targetMonsterIndex / MONSTERS_PER_PAGE) + 1;
                    }
                }
                
                displayMonsters();
                
                // Open the specific monster if deep linked
                if (viewMonsterId) {
                    const targetMonster = monsters.find(m => m.id === viewMonsterId);
                    if (targetMonster) {
                        setTimeout(() => {
                            openModal(targetMonster);
                        }, 500); // Small delay to ensure gallery is rendered
                    }
                }
            }
            
        } catch (err) {
            console.error('Error loading monsters:', err);
            hideLoading();
            showError('Failed to load monsters. Please try again!');
        }
    }

    // Display monsters in grid with pagination
    function displayMonsters() {
        gallery.innerHTML = '';
        
        // Calculate pagination
        totalPages = Math.ceil(monsters.length / MONSTERS_PER_PAGE);
        const startIndex = (currentPage - 1) * MONSTERS_PER_PAGE;
        const endIndex = startIndex + MONSTERS_PER_PAGE;
        const monstersToShow = monsters.slice(startIndex, endIndex);
        
        // Display monsters for current page
        monstersToShow.forEach(monster => {
            const card = createMonsterCard(monster);
            gallery.appendChild(card);
        });
        
        // Update pagination controls
        updatePaginationControls();
        
        gallery.style.display = 'grid';
        emptyGallery.style.display = 'none';
        pagination.style.display = monsters.length > MONSTERS_PER_PAGE ? 'flex' : 'none';
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
            displayMonsters();
            trackEvent('monster_gallery_pagination', {
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
            displayMonsters();
            trackEvent('monster_gallery_pagination', {
                action: 'next',
                page: currentPage,
                event_category: 'gallery_actions'
            });
        }
    }

    // Create monster card element
    function createMonsterCard(monster) {
        const card = document.createElement('div');
        card.className = 'monster-card';
        card.onclick = () => openModal(monster);
        
        const img = document.createElement('img');
        img.src = monster.imageUrl;
        img.alt = 'Monster Image';
        img.className = 'monster-image';
        img.loading = 'lazy';
        
        const creator = document.createElement('div');
        creator.className = 'monster-creator';
        creator.textContent = `Created by: ${monster.creatorName || 'Anonymous'}`;
        
        const date = document.createElement('div');
        date.className = 'monster-date';
        if (monster.timestamp) {
            const dateObj = monster.timestamp.toDate ? monster.timestamp.toDate() : new Date(monster.timestamp);
            date.textContent = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString();
        } else {
            date.textContent = 'Recently created';
        }
        
        card.appendChild(img);
        card.appendChild(creator);
        card.appendChild(date);
        
        return card;
    }

    // Open modal with monster details
    function openModal(monster) {
        currentMonster = monster;
        currentMonsterIndex = monsters.findIndex(m => m.id === monster.id);
        modalImage.src = monster.imageUrl;
        modalImage.alt = 'Monster Image';
        modalPrompt.textContent = monster.monsterDescription || 'No description available';
        
        trackEvent('monster_gallery_view', {
            monster_id: monster.id,
            has_creator_name: !!monster.creatorName,
            event_category: 'gallery_actions'
        });
        
        // Update modal prompt label to include creator
        const promptLabel = document.querySelector('.modal-prompt-label');
        if (monster.creatorName && monster.creatorName !== 'Anonymous') {
            promptLabel.textContent = `${monster.creatorName}`;
        } else {
            promptLabel.textContent = 'Anonymous';
        }
        
        // Show/hide admin controls
        if (isAdmin) {
            deleteBtn.style.display = 'inline-block';
        } else {
            deleteBtn.style.display = 'none';
        }
        
        // Update navigation button states
        updateNavigationButtons();
        
        imageModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Update URL with deep link
        const newUrl = `${window.location.pathname}?view=${monster.id}`;
        window.history.pushState({}, '', newUrl);
    }

    // Close modal
    function closeModalHandler() {
        imageModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentMonster = null;
        currentMonsterIndex = -1;
        
        // Clear URL parameter when closing modal
        const url = new URL(window.location);
        url.searchParams.delete('view');
        window.history.pushState({}, '', url);
    }

    // Update navigation button states
    function updateNavigationButtons() {
        if (currentMonsterIndex === -1) {
            prevModalBtn.disabled = true;
            nextModalBtn.disabled = true;
            return;
        }
        
        prevModalBtn.disabled = currentMonsterIndex === 0;
        nextModalBtn.disabled = currentMonsterIndex === monsters.length - 1;
    }

    // Navigate to previous monster
    function navigateToPrevious() {
        if (currentMonsterIndex > 0) {
            const prevMonster = monsters[currentMonsterIndex - 1];
            openModal(prevMonster);
            
            trackEvent('monster_gallery_navigate', {
                direction: 'previous',
                monster_id: prevMonster.id,
                event_category: 'gallery_actions'
            });
        }
    }

    // Navigate to next monster
    function navigateToNext() {
        if (currentMonsterIndex < monsters.length - 1) {
            const nextMonster = monsters[currentMonsterIndex + 1];
            openModal(nextMonster);
            
            trackEvent('monster_gallery_navigate', {
                direction: 'next',
                monster_id: nextMonster.id,
                event_category: 'gallery_actions'
            });
        }
    }

    // Recreate monster (load prompt into editor)
    function recreateMonster() {
        if (currentMonster && currentMonster.monsterDescription) {
            // Store the prompt in localStorage and redirect to monster creator
            localStorage.setItem('monsterDescription', currentMonster.monsterDescription);
            localStorage.setItem('recreateMode', 'true');
            window.location.href = '/monster';
        }
    }

    // Print monster
    function printMonster() {
        if (currentMonster) {
            // Create a new window for printing
            const printWindow = window.open('', '_blank');
            const printContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Monster Print - ${currentMonster.monsterDescription}</title>
                    <style>
                        body {
                            font-family: 'Dacherry', sans-serif;
                            margin: 0;
                            padding: 20px;
                            background-color: white;
                            text-align: center;
                        }
                        .monster-container {
                            max-width: 600px;
                            margin: 0 auto;
                        }
                        .monster-image {
                            width: 100%;
                            max-width: 500px;
                            height: auto;
                            border: 6px solid #000;
                            border-radius: 20px;
                            margin: 20px 0;
                            box-shadow: 0 8px 0 #000;
                        }
                        .monster-prompt {
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
                        .monster-prompt::before {
                            content: '"';
                            font-size: 4em;
                            color: #FF9800;
                            position: absolute;
                            top: -20px;
                            left: 30px;
                        }
                        .monster-prompt::after {
                            content: '"';
                            font-size: 4em;
                            color: #FF9800;
                            position: absolute;
                            bottom: -30px;
                            right: 30px;
                        }
                        .monster-title {
                            color: #2196F3;
                            font-size: 2.5em;
                            font-weight: normal;
                            text-shadow: 3px 3px 0 #000;
                            margin-bottom: 20px;
                        }
                        .monster-subtitle {
                            color: #9C27B0;
                            font-size: 1.2em;
                            font-weight: normal;
                            text-shadow: 1px 1px 0 #000;
                            margin-bottom: 30px;
                        }
                        @media print {
                            body { margin: 0; padding: 10px; }
                            .monster-container { max-width: 100%; }
                        }
                    </style>
                </head>
                <body>
                    <div class="monster-container">
                        <h1 class="monster-title">HORRIBLE HENRY'S MONSTER</h1>
                        <p class="monster-subtitle">Created by: ${currentMonster.creatorName || 'Anonymous'}</p>
                        <img src="${currentMonster.imageUrl}" alt="Monster Image" class="monster-image">
                        <div class="monster-prompt">${currentMonster.monsterDescription}</div>
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

    // Download monster image
    function downloadMonster() {
        if (currentMonster) {
            const link = document.createElement('a');
            link.href = currentMonster.imageUrl;
            link.download = `horrible-henry-monster-${currentMonster.id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    // Share monster link
    function shareMonster() {
        if (currentMonster) {
            const shareUrl = `${window.location.origin}/monster/gallery?view=${currentMonster.id}`;
            
            // Try to use Web Share API if available
            if (navigator.share) {
                navigator.share({
                    title: 'Check out this amazing monster!',
                    text: `Created by ${currentMonster.creatorName || 'Anonymous'}: "${currentMonster.monsterDescription}"`,
                    url: shareUrl
                }).catch(err => {
                    console.log('Error sharing:', err);
                    fallbackShare(shareUrl);
                });
            } else {
                fallbackShare(shareUrl);
            }
            
            trackEvent('monster_gallery_share', {
                monster_id: currentMonster.id,
                event_category: 'gallery_actions'
            });
        }
    }

    // Fallback share method
    function fallbackShare(shareUrl) {
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Link copied to clipboard! Share it with others to view this monster directly.');
        }).catch(() => {
            // If clipboard fails, show the URL in a prompt
            prompt('Copy this link to share the monster:', shareUrl);
        });
    }

    // Delete monster (admin only)
    async function deleteMonster() {
        if (!isAdmin || !currentMonster) return;
        
        if (confirm('Are you sure you want to delete this monster? This action cannot be undone!')) {
            try {
                trackEvent('monster_gallery_delete_start', {
                    monster_id: currentMonster.id,
                    event_category: 'gallery_actions'
                });
                
                // Call Cloud Function to delete monster
                const functions = getFunctions();
                const deleteMonsterFunction = httpsCallable(functions, 'deleteMonster');
                
                await deleteMonsterFunction({
                    monsterId: currentMonster.id
                });
                
                trackEvent('monster_gallery_delete_success', {
                    monster_id: currentMonster.id,
                    event_category: 'gallery_actions'
                });
                
                // Remove from local array
                monsters = monsters.filter(m => m.id !== currentMonster.id);
                
                // Refresh display
                if (monsters.length === 0) {
                    showEmptyGallery();
                } else {
                    displayMonsters();
                }
                
                // Close modal
                closeModalHandler();
                
                // Show success message
                adminStatus.textContent = 'Monster deleted successfully!';
                adminStatus.style.color = '#4CAF50';
                setTimeout(() => {
                    adminStatus.textContent = '';
                }, 3000);
                
            } catch (err) {
                console.error('Error deleting monster:', err);
                adminStatus.textContent = 'Error deleting monster!';
                adminStatus.style.color = '#F44336';
            }
        }
    }

    // Admin authentication
    function checkAdminLogin() {
        const code = adminCode.value.trim();
        if (code === 'DolphinY3') {
            isAdmin = true;
            adminLogin.style.display = 'none';
            adminLogout.style.display = 'inline-block';
            adminCode.style.display = 'none';
            adminStatus.textContent = 'Admin mode activated!';
            adminStatus.style.color = '#4CAF50';
            
            // Set cookie to remember admin login for 30 days
            setCookie('monster_admin_logged_in', 'true', 30);
            
            // Admin mode activated - no visual indicators needed on cards
        } else {
            adminStatus.textContent = 'Invalid code!';
            adminStatus.style.color = '#F44336';
        }
    }

    function adminLogoutHandler() {
        isAdmin = false;
        adminLogin.style.display = 'inline-block';
        adminLogout.style.display = 'none';
        adminCode.style.display = 'inline-block';
        adminCode.value = '';
        adminStatus.textContent = '';
        
        // Clear the admin login cookie
        deleteCookie('monster_admin_logged_in');
        
        // Admin mode deactivated
    }

    // Toggle admin panel visibility
    function toggleAdminPanel() {
        if (adminPanel.style.display === 'none' || adminPanel.style.display === '') {
            adminPanel.style.display = 'block';
            adminToggle.textContent = 'Hide Admin';
        } else {
            adminPanel.style.display = 'none';
            adminToggle.textContent = 'Admin';
        }
    }

    // Event listeners
    closeModal.onclick = closeModalHandler;
    recreateBtn.onclick = recreateMonster;
    printBtn.onclick = printMonster;
    downloadBtn.onclick = downloadMonster;
    shareBtn.onclick = shareMonster;
    deleteBtn.onclick = deleteMonster;
    adminToggle.onclick = toggleAdminPanel;
    adminLogin.onclick = checkAdminLogin;
    adminLogout.onclick = adminLogoutHandler;
    
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

    // Check for existing admin login
    initializeAdminLogin();
    
    // Load monsters on page load
    loadMonsters();
});