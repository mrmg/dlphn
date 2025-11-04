import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-35jua6EQ5md0fL1f7Bd4nnpz2wKXlUU",
  authDomain: "dolphin-thursday.firebaseapp.com",
  projectId: "dolphin-thursday",
  storageBucket: "dolphin-thursday.firebasestorage.app",
  messagingSenderId: "885293763604",
  appId: "1:885293763604:web:5f87d5cfcce0a43c33eb01"
};

// Initialize Firebase
let app;
let db;
let functions;

try {
  console.log('Initializing Firebase...');
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized');
  
  db = getFirestore(app);
  console.log('Firestore initialized');
  
  functions = getFunctions(app);
  console.log('Functions initialized');
  
  // Log the database instance to verify it's created
  console.log('Firestore instance:', db);
} catch (error) {
  console.error('Error initializing Firebase:', error);
  console.error('Error details:', {
    message: error.message,
    code: error.code,
    stack: error.stack
  });
  throw error;
}

export { db, functions, app }; 