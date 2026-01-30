/**
 * User Service
 * Handles all user profile and health data operations
 */

const UserService = {
    /**
     * Save health details for a user
     * @param {string} userId - User's UID
     * @param {object} healthData - Health information
     * @returns {Promise<object>} - Result object with success status
     */
    async saveHealthDetails(userId, healthData) {
        try {
            await db.collection('users').doc(userId).update({
                healthDetails: {
                    age: healthData.age,
                    height: healthData.height,
                    weight: healthData.weight,
                    gender: healthData.gender,
                    bmi: healthData.bmi || this.calculateBMI(healthData.height, healthData.weight),
                    smokingHabit: healthData.smokingHabit,
                    alcoholConsumption: healthData.alcoholConsumption,
                    sleepQuality: healthData.sleepQuality,
                    medicalCondition: healthData.medicalCondition,
                    // Avatar data
                    avatar: healthData.avatar || 'avatar1',
                    avatarEmoji: healthData.avatarEmoji || '👨‍💼',
                    avatarName: healthData.avatarName || 'Professional',
                    // Medical History
                    bloodType: healthData.bloodType || 'Not set',
                    allergies: healthData.allergies || 'None known',
                    currentMedications: healthData.currentMedications || 'None',
                    pastSurgeries: healthData.pastSurgeries || 'None',
                    familyHistory: healthData.familyHistory || 'No significant family history',
                    // Menstruation data (if applicable)
                    menstruation: healthData.menstruation || null
                },
                profileComplete: true,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Health details saved successfully');
            return { success: true };
        } catch (error) {
            console.error('❌ Error saving health details:', error);
            return { success: false, error: error };
        }
    },

    /**
     * Get user profile data
     * @param {string} userId - User's UID
     * @returns {Promise<object>} - User profile data
     */
    async getUserProfile(userId) {
        try {
            const userDoc = await db.collection('users').doc(userId).get();

            if (userDoc.exists) {
                console.log('✅ User profile retrieved successfully');
                return { success: true, data: userDoc.data() };
            } else {
                console.warn('⚠️ User profile not found');
                return { success: false, error: 'User not found' };
            }
        } catch (error) {
            console.error('❌ Error getting user profile:', error);
            return { success: false, error: error };
        }
    },

    /**
     * Update user profile
     * @param {string} userId - User's UID
     * @param {object} profileData - Profile data to update
     * @returns {Promise<object>} - Result object with success status
     */
    async updateProfile(userId, profileData) {
        try {
            await db.collection('users').doc(userId).update({
                ...profileData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Profile updated successfully');
            return { success: true };
        } catch (error) {
            console.error('❌ Error updating profile:', error);
            return { success: false, error: error };
        }
    },

    /**
     * Calculate BMI
     * @param {number} height - Height in cm
     * @param {number} weight - Weight in kg
     * @returns {number} - BMI value
     */
    calculateBMI(height, weight) {
        if (!height || !weight) return null;
        const heightInMeters = height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    },

    /**
     * Save additional health data (for tracking)
     * @param {string} userId - User's UID
     * @param {object} healthData - Health tracking data
     * @returns {Promise<object>} - Result object with success status
     */
    async saveHealthTracking(userId, healthData) {
        try {
            await db.collection('healthTracking').add({
                userId: userId,
                ...healthData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Health tracking data saved');
            return { success: true };
        } catch (error) {
            console.error('❌ Error saving health tracking:', error);
            return { success: false, error: error };
        }
    },

    /**
     * Get health tracking history
     * @param {string} userId - User's UID
     * @param {number} limit - Number of records to retrieve
     * @returns {Promise<object>} - Health tracking data
     */
    async getHealthHistory(userId, limit = 30) {
        try {
            const snapshot = await db.collection('healthTracking')
                .where('userId', '==', userId)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();

            const history = [];
            snapshot.forEach(doc => {
                history.push({ id: doc.id, ...doc.data() });
            });

            console.log('✅ Health history retrieved');
            return { success: true, data: history };
        } catch (error) {
            console.error('❌ Error getting health history:', error);
            return { success: false, error: error };
        }
    }
};

// Make UserService available globally
window.UserService = UserService;
console.log('👤 User Service loaded');
