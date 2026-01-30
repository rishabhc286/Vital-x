/**
 * Firebase Configuration
 * This file contains the Firebase project configuration
 */

const firebaseConfig = {
    apiKey: "AIzaSyDqwBVGK9aGSiSGUJhkL2qVvzBOY1Nt9Lo",
    authDomain: "vital-x-4f9fd.firebaseapp.com",
    projectId: "vital-x-4f9fd",
    storageBucket: "vital-x-4f9fd.firebasestorage.app",
    messagingSenderId: "883081773332",
    appId: "1:883081773332:web:c5f19d241efe229a770201",
    measurementId: "G-Q1TTVF98ZG"
};

// Initialize Firebase
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
}

// Export Firebase services
window.auth = firebase.auth();
window.db = firebase.firestore();
window.storage = firebase.storage();

// Enable Firestore offline persistence
db.enablePersistence()
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('⚠️ Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
            console.warn('⚠️ The current browser does not support offline persistence');
        }
    });

console.log('🔥 Firebase config loaded');
