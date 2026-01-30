/**
 * Authentication Service
 * Handles all authentication operations with Firebase
 */

const AuthService = {
    /**
     * Sign up a new user with email and password
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @param {object} userData - Additional user data (firstName, lastName)
     * @returns {Promise<object>} - Result object with success status
     */
    async signUp(email, password, userData) {
        try {
            console.log('🔵 Starting signup process for:', email);

            // Create user with email and password
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            console.log('✅ Firebase Auth user created:', user.uid);

            // Update user profile with display name
            await user.updateProfile({
                displayName: userData.displayName || `${userData.firstName} ${userData.lastName}`
            });
            console.log('✅ User profile updated with display name');

            // Create user document in Firestore
            console.log('🔵 Creating Firestore document for user:', user.uid);
            const userDocData = {
                uid: user.uid,
                email: email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                displayName: userData.displayName || `${userData.firstName} ${userData.lastName}`,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                profileComplete: false
            };

            await db.collection('users').doc(user.uid).set(userDocData);
            console.log('✅ Firestore document created successfully');

            // Verify the document was created
            const docCheck = await db.collection('users').doc(user.uid).get();
            if (docCheck.exists) {
                console.log('✅ Document verified in Firestore:', docCheck.data());
            } else {
                console.error('❌ Document not found after creation!');
            }

            console.log('✅ User signup completed successfully:', user.uid);
            return { success: true, user: user };
        } catch (error) {
            console.error('❌ Sign up error:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            return { success: false, error: error };
        }
    },

    /**
     * Sign in with email and password
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Promise<object>} - Result object with success status
     */
    async signIn(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            console.log('✅ User signed in successfully:', userCredential.user.uid);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('❌ Sign in error:', error);
            return { success: false, error: error };
        }
    },

    /**
     * Sign in with Google
     * @returns {Promise<object>} - Result object with success status
     */
    async signInWithGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const userCredential = await auth.signInWithPopup(provider);
            const user = userCredential.user;

            // Check if user document exists
            const userDoc = await db.collection('users').doc(user.uid).get();

            if (!userDoc.exists) {
                // Create user document for new Google users
                await db.collection('users').doc(user.uid).set({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    profileComplete: false
                });
            }

            console.log('✅ Google sign in successful:', user.uid);
            return { success: true, user: user };
        } catch (error) {
            console.error('❌ Google sign in error:', error);
            return { success: false, error: error };
        }
    },

    /**
     * Sign out the current user
     * @returns {Promise<object>} - Result object with success status
     */
    async signOut() {
        try {
            await auth.signOut();
            console.log('✅ User signed out successfully');
            return { success: true };
        } catch (error) {
            console.error('❌ Sign out error:', error);
            return { success: false, error: error };
        }
    },

    /**
     * Get current user
     * @returns {object|null} - Current user or null
     */
    getCurrentUser() {
        return auth.currentUser;
    },

    /**
     * Check if user is authenticated
     * @returns {Promise<object|null>} - User object or null
     */
    async checkAuth() {
        return new Promise((resolve) => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                unsubscribe();
                resolve(user);
            });
        });
    },

    /**
     * Send password reset email
     * @param {string} email - User's email
     * @returns {Promise<object>} - Result object with success status
     */
    async resetPassword(email) {
        try {
            await auth.sendPasswordResetEmail(email);
            console.log('✅ Password reset email sent');
            return { success: true };
        } catch (error) {
            console.error('❌ Password reset error:', error);
            return { success: false, error: error };
        }
    }
};

// Make AuthService available globally
window.AuthService = AuthService;
window.authService = AuthService; // Lowercase alias for convenience
console.log('🔐 Auth Service loaded');
