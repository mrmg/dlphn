import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, getDocs, deleteDoc, doc, writeBatch as firestoreWriteBatch, getDoc, setDoc } from 'firebase/firestore';

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
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// DOM Elements
const authContainer = document.getElementById('authContainer');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginFormElement = document.getElementById('loginFormElement');
const registerFormElement = document.getElementById('registerFormElement');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const logoutBtn = document.getElementById('logoutBtn');
const adminEmail = document.getElementById('adminEmail');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const googleRegisterBtn = document.getElementById('googleRegisterBtn');

// Error/Success Messages
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const registerErrorMessage = document.getElementById('registerErrorMessage');
const registerSuccessMessage = document.getElementById('registerSuccessMessage');

// Gallery Management
const newGalleryName = document.getElementById('newGalleryName');
const createGallery = document.getElementById('createGallery');
const currentGallery = document.getElementById('currentGallery');
const deleteGallery = document.getElementById('deleteGallery');
const galleryStatus = document.getElementById('galleryStatus');
const setCurrentGallery = document.getElementById('setCurrentGallery');


// User Management
const refreshUsersBtn = document.getElementById('refreshUsersBtn');
const userStatus = document.getElementById('userStatus');
const usersList = document.getElementById('usersList');

// Character Management
const bulkActions = document.getElementById('bulkActions');
const selectedCount = document.getElementById('selectedCount');
const selectAllBtn = document.getElementById('selectAllBtn');
const deselectAllBtn = document.getElementById('deselectAllBtn');
const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
const characterStatus = document.getElementById('characterStatus');
const characterGrid = document.getElementById('characterGrid');
const loading = document.getElementById('loading');
const characterGalleryFilter = document.getElementById('characterGalleryFilter');
const refreshCharactersBtn = document.getElementById('refreshCharactersBtn');

// State
let galleries = [];
let characters = [];
let selectedCharacters = new Set();
let users = [];
let currentUser = null;
let currentCharacterGallery = 'all';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check auth state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            currentUser = user;
            checkAdminStatus(user);
        } else {
            // User is signed out
            showAuthForms();
        }
    });

    // Load initial data
    loadGalleries();
    loadCharacters();
    loadCurrentGallerySetting();
});

// Auth Functions
function showAuthForms() {
    authContainer.style.display = 'block';
    adminDashboard.style.display = 'none';
    showLoginForm();
}

async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Check if this is a new user and create registration record
        const userDoc = await getDoc(doc(db, 'userRegistrations', user.uid));
        if (!userDoc.exists()) {
            await setDoc(doc(db, 'userRegistrations', user.uid), {
                email: user.email,
                uid: user.uid,
                createdAt: new Date(),
                status: 'pending',
                isAdmin: false
            });
            
            showSuccess('Google sign-in successful! Your account is pending admin approval.');
            
            // Sign out the user since they need admin approval
            setTimeout(async () => {
                await signOut(auth);
            }, 2000);
        } else {
            showSuccess('Google sign-in successful!');
        }
    } catch (error) {
        console.error('Google sign-in error:', error);
        if (error.code === 'auth/popup-closed-by-user') {
            showError('Sign-in cancelled');
        } else {
            showError('Google sign-in failed: ' + error.message);
        }
    }
}

async function checkAdminStatus(user) {
    try {
        // Check if user is admin by looking up their UID in Firestore
        const userDoc = await getDoc(doc(db, 'admins', user.uid));
        
        if (userDoc.exists() && userDoc.data().isAdmin) {
            showAdminDashboard(user);
            loadUsers(); // Load users for admin management
        } else {
            // User is not admin, show access denied
            showAccessDenied();
        }
    } catch (error) {
        console.error('Error checking admin status:', error);
        showAccessDenied();
    }
}

function showAdminDashboard(user) {
    authContainer.style.display = 'none';
    adminDashboard.style.display = 'block';
    adminEmail.textContent = user.email;
}

function showAccessDenied() {
    authContainer.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h2 style="color: #F44336; margin-bottom: 20px;">Access Denied</h2>
            <p style="margin-bottom: 20px;">You don't have admin privileges. Please contact an administrator.</p>
            <button onclick="window.location.href='/horrid/gallery'" class="form-button secondary">Go to Gallery</button>
            <button onclick="signOut(auth)" class="form-button danger" style="margin-left: 10px;">Logout</button>
        </div>
    `;
    authContainer.style.display = 'block';
    adminDashboard.style.display = 'none';
}

function showLoginForm() {
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    clearMessages();
}

function showRegisterForm() {
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
    clearMessages();
}

function clearMessages() {
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    registerErrorMessage.style.display = 'none';
    registerSuccessMessage.style.display = 'none';
}

function showError(message, isRegister = false) {
    const errorEl = isRegister ? registerErrorMessage : errorMessage;
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

function showSuccess(message, isRegister = false) {
    const successEl = isRegister ? registerSuccessMessage : successMessage;
    successEl.textContent = message;
    successEl.style.display = 'block';
}

// Event Listeners
showRegister.addEventListener('click', showRegisterForm);
showLogin.addEventListener('click', showLoginForm);
googleLoginBtn.addEventListener('click', signInWithGoogle);
googleRegisterBtn.addEventListener('click', signInWithGoogle);

loginFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        showSuccess('Login successful!');
    } catch (error) {
        showError('Login failed: ' + error.message);
    }
});

registerFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showError('Passwords do not match', true);
        return;
    }
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create user registration record
        await setDoc(doc(db, 'userRegistrations', user.uid), {
            email: user.email,
            uid: user.uid,
            createdAt: new Date(),
            status: 'pending',
            isAdmin: false
        });
        
        showSuccess('Registration successful! Your account is pending admin approval.', true);
        
        // Sign out the user since they need admin approval
        setTimeout(async () => {
            await signOut(auth);
        }, 2000);
        
    } catch (error) {
        showError('Registration failed: ' + error.message, true);
    }
});

logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Logout error:', error);
    }
});

// User Management Functions
async function loadUsers() {
    try {
        showLoading(true);
        
        // Get all users from Firebase Auth (this requires Admin SDK, so we'll use a different approach)
        // For now, we'll store user registrations in Firestore
        const usersRef = collection(db, 'userRegistrations');
        const q = query(usersRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        users = [];
        querySnapshot.forEach((doc) => {
            users.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        displayUsers();
        showLoading(false);
        
    } catch (error) {
        console.error('Error loading users:', error);
        showStatus('Error loading users: ' + error.message, 'error', 'user');
        showLoading(false);
    }
}

function displayUsers() {
    usersList.innerHTML = '';
    
    if (users.length === 0) {
        usersList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No users found</p>';
        return;
    }
    
    users.forEach(user => {
        const userCard = createUserCard(user);
        usersList.appendChild(userCard);
    });
}

function createUserCard(user) {
    const card = document.createElement('div');
    card.className = `user-card ${user.status || 'pending'}`;
    
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    
    const email = document.createElement('div');
    email.className = 'user-email';
    email.textContent = user.email;
    
    const status = document.createElement('div');
    status.className = 'user-status';
    
    const statusBadge = document.createElement('span');
    if (user.isAdmin) {
        statusBadge.className = 'admin-badge';
        statusBadge.textContent = 'Admin';
    } else if (user.status === 'approved') {
        statusBadge.className = 'admin-badge';
        statusBadge.textContent = 'Approved';
    } else if (user.status === 'rejected') {
        statusBadge.className = 'pending-badge';
        statusBadge.textContent = 'Rejected';
    } else {
        statusBadge.className = 'pending-badge';
        statusBadge.textContent = 'Pending';
    }
    
    status.appendChild(statusBadge);
    
    const date = document.createElement('div');
    date.className = 'user-date';
    if (user.createdAt) {
        const dateObj = user.createdAt.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
        date.textContent = `Registered: ${dateObj.toLocaleDateString()}`;
    }
    
    userInfo.appendChild(email);
    userInfo.appendChild(status);
    userInfo.appendChild(date);
    
    const actions = document.createElement('div');
    actions.className = 'user-actions';
    
    if (!user.isAdmin && user.status !== 'rejected') {
        const approveBtn = document.createElement('button');
        approveBtn.className = 'action-btn approve-btn';
        approveBtn.innerHTML = '✓';
        approveBtn.title = 'Approve as Admin';
        approveBtn.onclick = () => approveUser(user.id);
        
        const rejectBtn = document.createElement('button');
        rejectBtn.className = 'action-btn reject-btn';
        rejectBtn.innerHTML = '✗';
        rejectBtn.title = 'Reject User';
        rejectBtn.onclick = () => rejectUser(user.id);
        
        actions.appendChild(approveBtn);
        actions.appendChild(rejectBtn);
    }
    
    card.appendChild(userInfo);
    card.appendChild(actions);
    
    return card;
}

async function approveUser(userId) {
    try {
        // Update user status in Firestore
        await setDoc(doc(db, 'userRegistrations', userId), {
            status: 'approved',
            isAdmin: true,
            approvedBy: currentUser.uid,
            approvedAt: new Date()
        }, { merge: true });
        
        // Also add to admins collection
        await setDoc(doc(db, 'admins', userId), {
            isAdmin: true,
            approvedBy: currentUser.uid,
            approvedAt: new Date()
        });
        
        showStatus('User approved as admin', 'success', 'user');
        loadUsers(); // Refresh the list
        
    } catch (error) {
        console.error('Error approving user:', error);
        showStatus('Error approving user: ' + error.message, 'error', 'user');
    }
}

async function rejectUser(userId) {
    try {
        // Update user status in Firestore
        await setDoc(doc(db, 'userRegistrations', userId), {
            status: 'rejected',
            rejectedBy: currentUser.uid,
            rejectedAt: new Date()
        }, { merge: true });
        
        showStatus('User rejected', 'success', 'user');
        loadUsers(); // Refresh the list
        
    } catch (error) {
        console.error('Error rejecting user:', error);
        showStatus('Error rejecting user: ' + error.message, 'error', 'user');
    }
}

// Event Listeners
refreshUsersBtn.addEventListener('click', loadUsers);

// Character Management
refreshCharactersBtn.addEventListener('click', loadCharacters);

characterGalleryFilter.addEventListener('change', (e) => {
    currentCharacterGallery = e.target.value;
    loadCharacters();
});

// Load galleries for character filter
function loadCharacterGalleries() {
    try {
        const storedGalleries = localStorage.getItem('horrid_galleries');
        if (storedGalleries) {
            const galleries = JSON.parse(storedGalleries);
            characterGalleryFilter.innerHTML = '<option value="all">All Galleries</option>';
            
            galleries.forEach(gallery => {
                const option = document.createElement('option');
                option.value = gallery.id;
                option.textContent = gallery.name;
                characterGalleryFilter.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading character galleries:', error);
    }
}

// Set current gallery
setCurrentGallery.addEventListener('click', async () => {
    const selectedGallery = currentGallery.value;
    if (!selectedGallery) {
        showStatus('Please select a gallery', 'error', 'gallery');
        return;
    }
    
    try {
        // Store the current gallery in Firebase
        await setDoc(doc(db, 'settings', 'currentGallery'), {
            galleryId: selectedGallery,
            updatedBy: currentUser.uid,
            updatedAt: new Date()
        });
        
        showStatus(`Current gallery set to: ${selectedGallery}`, 'success', 'gallery');
        
    } catch (error) {
        console.error('Error setting current gallery:', error);
        showStatus('Error setting current gallery: ' + error.message, 'error', 'gallery');
    }
});

// Load current gallery setting for admin display
async function loadCurrentGallerySetting() {
    try {
        const currentGalleryDoc = await getDoc(doc(db, 'settings', 'currentGallery'));
        if (currentGalleryDoc.exists()) {
            const data = currentGalleryDoc.data();
            currentGallery.value = data.galleryId || '';
        } else {
            currentGallery.value = '';
        }
    } catch (error) {
        console.error('Error loading current gallery setting:', error);
        currentGallery.value = '';
    }
}

// Gallery Management
async function loadGalleries() {
    try {
        // Load galleries from characterQueries collection
        const charactersRef = collection(db, 'characterQueries');
        const charactersSnapshot = await getDocs(charactersRef);
        
        // Extract unique galleries from character data
        const gallerySet = new Set();
        charactersSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.gallery) {
                gallerySet.add(data.gallery);
            }
        });
        
        // Convert to gallery objects
        galleries = Array.from(gallerySet).map(galleryId => ({
            id: galleryId,
            name: galleryId.charAt(0).toUpperCase() + galleryId.slice(1), // Capitalize first letter
            created: new Date().toISOString()
        }));
        
        // Add default galleries if they don't exist
        if (!galleries.find(g => g.id === 'default')) {
            galleries.unshift({ id: 'default', name: 'Default', created: new Date().toISOString() });
        }
        if (!galleries.find(g => g.id === 'monster')) {
            galleries.push({ id: 'monster', name: 'Monster', created: new Date().toISOString() });
        }
        
        console.log('Loaded galleries from characterQueries:', galleries);
        
        updateGallerySelectors();
        loadCharacterGalleries(); // Also load galleries for character filter
    } catch (error) {
        console.error('Error loading galleries:', error);
        // Fallback to default galleries on error
        galleries = [
            { id: 'default', name: 'Default', created: new Date().toISOString() },
            { id: 'monster', name: 'Monster', created: new Date().toISOString() }
        ];
        updateGallerySelectors();
        loadCharacterGalleries();
    }
}

function updateGallerySelectors() {
    currentGallery.innerHTML = '<option value="">Select gallery to manage</option>';
    
    galleries.forEach(gallery => {
        const option = document.createElement('option');
        option.value = gallery.id;
        option.textContent = gallery.name;
        currentGallery.appendChild(option);
    });
}

createGallery.addEventListener('click', async () => {
    const name = newGalleryName.value.trim();
    if (!name) {
        showStatus('Please enter a gallery name', 'error', 'gallery');
        return;
    }
    
    if (galleries.find(g => g.name.toLowerCase() === name.toLowerCase())) {
        showStatus('Gallery already exists', 'error', 'gallery');
        return;
    }
    
    const newGallery = {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        created: new Date().toISOString()
    };
    
    // Add gallery to local array (it will be saved when characters are created with this gallery)
    galleries.push(newGallery);
    updateGallerySelectors();
    newGalleryName.value = '';
    
    // Automatically set the new gallery as current
    currentGallery.value = newGallery.id;
    await setDoc(doc(db, 'settings', 'currentGallery'), {
        galleryId: newGallery.id,
        updatedBy: currentUser.uid,
        updatedAt: new Date()
    });
    
    showStatus(`Gallery "${name}" created and set as current`, 'success', 'gallery');
});

deleteGallery.addEventListener('click', async () => {
    const selectedGallery = currentGallery.value;
    if (selectedGallery === 'default') {
        showStatus('Cannot delete default gallery', 'error', 'gallery');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete the "${galleries.find(g => g.id === selectedGallery)?.name}" gallery?`)) {
        return;
    }
    
    // Remove gallery from local array
    galleries = galleries.filter(g => g.id !== selectedGallery);
    updateGallerySelectors();
    showStatus('Gallery deleted successfully', 'success', 'gallery');
});






// Character Management
async function loadCharacters() {
    try {
        showLoading(true);
        
        const charactersRef = collection(db, 'characterQueries');
        const q = query(charactersRef, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        
        characters = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.status === 'completed' && data.imageUrl) {
                // Filter by gallery if not showing all
                if (currentCharacterGallery === 'all' || 
                    (currentCharacterGallery === 'default' && (!data.gallery || data.gallery === 'default')) ||
                    (currentCharacterGallery !== 'all' && currentCharacterGallery !== 'default' && data.gallery === currentCharacterGallery)) {
                    characters.push({
                        id: doc.id,
                        ...data
                    });
                }
            }
        });
        
        displayCharacters();
        showLoading(false);
        
    } catch (error) {
        console.error('Error loading characters:', error);
        showStatus('Error loading characters: ' + error.message, 'error', 'character');
        showLoading(false);
    }
}

function displayCharacters() {
    characterGrid.innerHTML = '';
    selectedCharacters.clear();
    updateBulkActions();
    
    characters.forEach(character => {
        const card = createCharacterCard(character);
        characterGrid.appendChild(card);
    });
}

function createCharacterCard(character) {
    const card = document.createElement('div');
    card.className = 'character-card';
    card.dataset.characterId = character.id;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'character-checkbox';
    checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            selectedCharacters.add(character.id);
        } else {
            selectedCharacters.delete(character.id);
        }
        updateBulkActions();
    });
    
    const img = document.createElement('img');
    img.src = character.imageUrl;
    img.alt = 'Character Image';
    img.className = 'character-image';
    img.loading = 'lazy';
    
    const info = document.createElement('div');
    info.className = 'character-info';
    
    const creator = document.createElement('div');
    creator.className = 'character-creator';
    creator.textContent = `Created by: ${character.creatorName || 'Anonymous'}`;
    
    const gallery = document.createElement('div');
    gallery.className = 'character-gallery';
    gallery.textContent = `Gallery: ${character.gallery || 'default'}`;
    gallery.style.fontSize = '0.8em';
    gallery.style.color = '#666';
    
    const method = document.createElement('div');
    method.className = 'character-method';
    method.textContent = `Method: ${character.generationMethod || 'unknown'}`;
    method.style.fontSize = '0.8em';
    method.style.color = '#666';
    
    const date = document.createElement('div');
    date.className = 'character-date';
    if (character.timestamp) {
        const dateObj = character.timestamp.toDate ? character.timestamp.toDate() : new Date(character.timestamp);
        date.textContent = `Created: ${dateObj.toLocaleDateString()}`;
    } else {
        date.textContent = 'Recently created';
    }
    date.style.fontSize = '0.8em';
    date.style.color = '#666';
    
    info.appendChild(creator);
    info.appendChild(gallery);
    info.appendChild(method);
    info.appendChild(date);
    
    card.appendChild(checkbox);
    card.appendChild(img);
    card.appendChild(info);
    
    return card;
}

function updateBulkActions() {
    const count = selectedCharacters.size;
    selectedCount.textContent = `${count} selected`;
    
    if (count > 0) {
        bulkActions.classList.add('active');
    } else {
        bulkActions.classList.remove('active');
    }
}

selectAllBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.character-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
        selectedCharacters.add(checkbox.closest('.character-card').dataset.characterId);
    });
    updateBulkActions();
});

deselectAllBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.character-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    selectedCharacters.clear();
    updateBulkActions();
});

bulkDeleteBtn.addEventListener('click', async () => {
    if (selectedCharacters.size === 0) {
        showStatus('No characters selected', 'error', 'character');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete ${selectedCharacters.size} characters? This action cannot be undone!`)) {
        return;
    }
    
    try {
        showStatus('Deleting characters...', 'info', 'character');
        
        // Delete in batches
        const characterIds = Array.from(selectedCharacters);
        const batchSize = 500;
        
        for (let i = 0; i < characterIds.length; i += batchSize) {
            const batchChunk = characterIds.slice(i, i + batchSize);
            const firestoreBatch = firestoreWriteBatch(db);
            
            batchChunk.forEach(characterId => {
                const docRef = doc(db, 'characterQueries', characterId);
                firestoreBatch.delete(docRef);
            });
            
            await firestoreBatch.commit();
        }
        
        // Remove from local array
        characters = characters.filter(c => !selectedCharacters.has(c.id));
        
        // Refresh display
        displayCharacters();
        showStatus(`Successfully deleted ${characterIds.length} characters`, 'success', 'character');
        
    } catch (error) {
        console.error('Error deleting characters:', error);
        showStatus('Error deleting characters: ' + error.message, 'error', 'character');
    }
});

// Utility Functions
function showStatus(message, type, section) {
    let statusEl;
    switch (section) {
        case 'gallery':
            statusEl = galleryStatus;
            break;
        case 'character':
            statusEl = characterStatus;
            break;
        default:
            return;
    }
    
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
    statusEl.style.display = 'block';
    
    // Hide after 5 seconds
    setTimeout(() => {
        statusEl.style.display = 'none';
    }, 5000);
}

function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
}