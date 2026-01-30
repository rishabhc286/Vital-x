/**
 * Health Data Service
 * Handles all health-related data operations for Vital-X
 * Includes: Menstruation, Health Roadmap, Health Timeline, Diet, Mental Health, etc.
 */

const HealthDataService = {
    // ==================== MENSTRUATION TRACKING ====================

    /**
     * Save menstruation cycle data
     * @param {string} userId - User's UID
     * @param {object} cycleData - Cycle information
     * @returns {Promise<object>} - Result object
     */
    async saveMenstruationCycle(userId, cycleData) {
        try {
            const docRef = await db.collection('menstruationData').add({
                userId: userId,
                lastPeriodDate: cycleData.lastPeriodDate,
                cycleLength: cycleData.cycleLength || 28,
                periodDuration: cycleData.periodDuration || 5,
                symptoms: cycleData.symptoms || [],
                flow: cycleData.flow || 'medium',
                mood: cycleData.mood || [],
                notes: cycleData.notes || '',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Menstruation cycle saved:', docRef.id);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('❌ Error saving menstruation cycle:', error);
            return { success: false, error: error };
        }
    },

    /**
     * Get menstruation history
     * @param {string} userId - User's UID
     * @param {number} limit - Number of records to retrieve
     * @returns {Promise<object>} - Menstruation history
     */
    async getMenstruationHistory(userId, limit = 12) {
        try {
            const snapshot = await db.collection('menstruationData')
                .where('userId', '==', userId)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();

            const history = [];
            snapshot.forEach(doc => {
                history.push({ id: doc.id, ...doc.data() });
            });

            console.log('✅ Menstruation history retrieved:', history.length, 'records');
            return { success: true, data: history };
        } catch (error) {
            console.error('❌ Error getting menstruation history:', error);
            return { success: false, error: error };
        }
    },

    /**
     * Update menstruation settings
     * @param {string} userId - User's UID
     * @param {object} settings - Menstruation settings
     * @returns {Promise<object>} - Result object
     */
    async updateMenstruationSettings(userId, settings) {
        try {
            await db.collection('users').doc(userId).update({
                'healthDetails.menstruation': settings,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Menstruation settings updated');
            return { success: true };
        } catch (error) {
            console.error('❌ Error updating menstruation settings:', error);
            return { success: false, error: error };
        }
    },

    // ==================== HEALTH ROADMAP ====================

    /**
     * Save health roadmap
     * @param {string} userId - User's UID
     * @param {object} roadmapData - Roadmap information
     * @returns {Promise<object>} - Result object
     */
    async saveHealthRoadmap(userId, roadmapData) {
        try {
            await db.collection('healthRoadmaps').doc(userId).set({
                userId: userId,
                goal: roadmapData.goal,
                startDate: roadmapData.startDate,
                weeks: roadmapData.weeks || [],
                currentWeek: roadmapData.currentWeek || 1,
                completedSteps: roadmapData.completedSteps || [],
                progress: roadmapData.progress || 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            console.log('✅ Health roadmap saved');
            return { success: true };
        } catch (error) {
            console.error('❌ Error saving health roadmap:', error);
            return { success: false, error: error };
        }
    },

    /**
     * Get health roadmap
     * @param {string} userId - User's UID
     * @returns {Promise<object>} - Roadmap data
     */
    async getHealthRoadmap(userId) {
        try {
            const doc = await db.collection('healthRoadmaps').doc(userId).get();

            if (doc.exists) {
                console.log('✅ Health roadmap retrieved');
                return { success: true, data: doc.data() };
            } else {
                console.log('⚠️ No health roadmap found');
                return { success: true, data: null };
            }
        } catch (error) {
            console.error('❌ Error getting health roadmap:', error);
            return { success: false, error: error };
        }
    },

    /**
     * Update roadmap progress
     * @param {string} userId - User's UID
     * @param {object} progressData - Progress update
     * @returns {Promise<object>} - Result object
     */
    async updateRoadmapProgress(userId, progressData) {
        try {
            await db.collection('healthRoadmaps').doc(userId).update({
                currentWeek: progressData.currentWeek,
                completedSteps: progressData.completedSteps,
                progress: progressData.progress,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Roadmap progress updated');
            return { success: true };
        } catch (error) {
            console.error('❌ Error updating roadmap progress:', error);
            return { success: false, error: error };
        }
    },

    // ==================== HEALTH TIMELINE ====================

    /**
     * Save health timeline entry
     * @param {string} userId - User's UID
     * @param {object} timelineData - Timeline entry
     * @returns {Promise<object>} - Result object
     */
    async saveTimelineEntry(userId, timelineData) {
        try {
            const docRef = await db.collection('healthTimeline').add({
                userId: userId,
                date: timelineData.date,
                healthDebtScore: timelineData.healthDebtScore,
                lifestyleScore: timelineData.lifestyleScore,
                riskTrend: timelineData.riskTrend,
                metrics: {
                    sleep: timelineData.sleep || 0,
                    diet: timelineData.diet || 0,
                    exercise: timelineData.exercise || 0,
                    stress: timelineData.stress || 0,
                    hydration: timelineData.hydration || 0
                },
                notes: timelineData.notes || '',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Timeline entry saved:', docRef.id);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('❌ Error saving timeline entry:', error);
            return { success: false, error: error };
        }
    },

    /**
     * Get health timeline
     * @param {string} userId - User's UID
     * @param {number} days - Number of days to retrieve
     * @returns {Promise<object>} - Timeline data
     */
    async getHealthTimeline(userId, days = 30) {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const snapshot = await db.collection('healthTimeline')
                .where('userId', '==', userId)
                .where('date', '>=', startDate.toISOString().split('T')[0])
                .orderBy('date', 'desc')
                .get();

            const timeline = [];
            snapshot.forEach(doc => {
                timeline.push({ id: doc.id, ...doc.data() });
            });

            console.log('✅ Health timeline retrieved:', timeline.length, 'entries');
            return { success: true, data: timeline };
        } catch (error) {
            console.error('❌ Error getting health timeline:', error);
            return { success: false, error: error };
        }
    },

    // ==================== DIET & NUTRITION ====================

    /**
     * Save meal entry
     * @param {string} userId - User's UID
     * @param {object} mealData - Meal information
     * @returns {Promise<object>} - Result object
     */
    async saveMeal(userId, mealData) {
        try {
            const docRef = await db.collection('meals').add({
                userId: userId,
                date: mealData.date,
                mealType: mealData.mealType, // breakfast, lunch, dinner, snack
                foodItems: mealData.foodItems || [],
                calories: mealData.calories || 0,
                macros: {
                    protein: mealData.protein || 0,
                    carbs: mealData.carbs || 0,
                    fats: mealData.fats || 0
                },
                imageUrl: mealData.imageUrl || null,
                notes: mealData.notes || '',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Meal saved:', docRef.id);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('❌ Error saving meal:', error);
            return { success: false, error: error };
        }
    },

    /**
     * Get meals for a date range
     * @param {string} userId - User's UID
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {Promise<object>} - Meals data
     */
    async getMeals(userId, startDate, endDate) {
        try {
            const snapshot = await db.collection('meals')
                .where('userId', '==', userId)
                .where('date', '>=', startDate)
                .where('date', '<=', endDate)
                .orderBy('date', 'desc')
                .orderBy('timestamp', 'desc')
                .get();

            const meals = [];
            snapshot.forEach(doc => {
                meals.push({ id: doc.id, ...doc.data() });
            });

            console.log('✅ Meals retrieved:', meals.length, 'entries');
            return { success: true, data: meals };
        } catch (error) {
            console.error('❌ Error getting meals:', error);
            return { success: false, error: error };
        }
    },

    // ==================== MENTAL HEALTH ====================

    /**
     * Save mental health check-in
     * @param {string} userId - User's UID
     * @param {object} checkInData - Check-in information
     * @returns {Promise<object>} - Result object
     */
    async saveMentalHealthCheckIn(userId, checkInData) {
        try {
            const docRef = await db.collection('mentalHealthCheckIns').add({
                userId: userId,
                date: checkInData.date,
                mood: checkInData.mood,
                energy: checkInData.energy,
                sleepQuality: checkInData.sleepQuality,
                stressTriggers: checkInData.stressTriggers || [],
                gratitude: checkInData.gratitude || '',
                notes: checkInData.notes || '',
                wellnessScore: checkInData.wellnessScore || 0,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Mental health check-in saved:', docRef.id);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('❌ Error saving mental health check-in:', error);
            return { success: false, error: error };
        }
    },

    /**
     * Get mental health history
     * @param {string} userId - User's UID
     * @param {number} days - Number of days to retrieve
     * @returns {Promise<object>} - Mental health history
     */
    async getMentalHealthHistory(userId, days = 30) {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const snapshot = await db.collection('mentalHealthCheckIns')
                .where('userId', '==', userId)
                .where('date', '>=', startDate.toISOString().split('T')[0])
                .orderBy('date', 'desc')
                .get();

            const history = [];
            snapshot.forEach(doc => {
                history.push({ id: doc.id, ...doc.data() });
            });

            console.log('✅ Mental health history retrieved:', history.length, 'entries');
            return { success: true, data: history };
        } catch (error) {
            console.error('❌ Error getting mental health history:', error);
            return { success: false, error: error };
        }
    },

    // ==================== AI DIAGNOSIS HISTORY ====================

    /**
     * Save AI diagnosis result
     * @param {string} userId - User's UID
     * @param {object} diagnosisData - Diagnosis information
     * @returns {Promise<object>} - Result object
     */
    async saveDiagnosisResult(userId, diagnosisData) {
        try {
            const docRef = await db.collection('aiDiagnosis').add({
                userId: userId,
                date: diagnosisData.date,
                symptoms: diagnosisData.symptoms || [],
                riskCategories: diagnosisData.riskCategories || {},
                recommendations: diagnosisData.recommendations || [],
                overallRisk: diagnosisData.overallRisk || 'low',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ AI diagnosis saved:', docRef.id);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('❌ Error saving AI diagnosis:', error);
            return { success: false, error: error };
        }
    },

    /**
     * Get diagnosis history
     * @param {string} userId - User's UID
     * @param {number} limit - Number of records to retrieve
     * @returns {Promise<object>} - Diagnosis history
     */
    async getDiagnosisHistory(userId, limit = 10) {
        try {
            const snapshot = await db.collection('aiDiagnosis')
                .where('userId', '==', userId)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();

            const history = [];
            snapshot.forEach(doc => {
                history.push({ id: doc.id, ...doc.data() });
            });

            console.log('✅ Diagnosis history retrieved:', history.length, 'records');
            return { success: true, data: history };
        } catch (error) {
            console.error('❌ Error getting diagnosis history:', error);
            return { success: false, error: error };
        }
    },

    // ==================== CHAT HISTORY ====================

    /**
     * Save chat message
     * @param {string} userId - User's UID
     * @param {object} messageData - Message information
     * @returns {Promise<object>} - Result object
     */
    async saveChatMessage(userId, messageData) {
        try {
            const docRef = await db.collection('chatHistory').add({
                userId: userId,
                role: messageData.role, // 'user' or 'assistant'
                message: messageData.message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Chat message saved:', docRef.id);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('❌ Error saving chat message:', error);
            return { success: false, error: error };
        }
    },

    /**
     * Get chat history
     * @param {string} userId - User's UID
     * @param {number} limit - Number of messages to retrieve
     * @returns {Promise<object>} - Chat history
     */
    async getChatHistory(userId, limit = 50) {
        try {
            const snapshot = await db.collection('chatHistory')
                .where('userId', '==', userId)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();

            const history = [];
            snapshot.forEach(doc => {
                history.push({ id: doc.id, ...doc.data() });
            });

            // Reverse to show oldest first
            history.reverse();

            console.log('✅ Chat history retrieved:', history.length, 'messages');
            return { success: true, data: history };
        } catch (error) {
            console.error('❌ Error getting chat history:', error);
            return { success: false, error: error };
        }
    },

    // ==================== DASHBOARD DATA ====================

    /**
     * Get dashboard summary
     * @param {string} userId - User's UID
     * @returns {Promise<object>} - Dashboard data
     */
    async getDashboardData(userId) {
        try {
            // Get latest timeline entry
            const timelineSnapshot = await db.collection('healthTimeline')
                .where('userId', '==', userId)
                .orderBy('date', 'desc')
                .limit(1)
                .get();

            let latestTimeline = null;
            if (!timelineSnapshot.empty) {
                latestTimeline = timelineSnapshot.docs[0].data();
            }

            // Get today's meals
            const today = new Date().toISOString().split('T')[0];
            const mealsSnapshot = await db.collection('meals')
                .where('userId', '==', userId)
                .where('date', '==', today)
                .get();

            let totalCalories = 0;
            mealsSnapshot.forEach(doc => {
                totalCalories += doc.data().calories || 0;
            });

            // Get latest mental health check-in
            const mentalHealthSnapshot = await db.collection('mentalHealthCheckIns')
                .where('userId', '==', userId)
                .orderBy('date', 'desc')
                .limit(1)
                .get();

            let latestMentalHealth = null;
            if (!mentalHealthSnapshot.empty) {
                latestMentalHealth = mentalHealthSnapshot.docs[0].data();
            }

            console.log('✅ Dashboard data retrieved');
            return {
                success: true,
                data: {
                    timeline: latestTimeline,
                    todayCalories: totalCalories,
                    mentalHealth: latestMentalHealth
                }
            };
        } catch (error) {
            console.error('❌ Error getting dashboard data:', error);
            return { success: false, error: error };
        }
    },

    // ==================== UTILITY FUNCTIONS ====================

    /**
     * Delete user data (for account deletion)
     * @param {string} userId - User's UID
     * @returns {Promise<object>} - Result object
     */
    async deleteUserData(userId) {
        try {
            const batch = db.batch();
            const collections = [
                'menstruationData',
                'healthRoadmaps',
                'healthTimeline',
                'meals',
                'mentalHealthCheckIns',
                'aiDiagnosis',
                'chatHistory'
            ];

            for (const collectionName of collections) {
                const snapshot = await db.collection(collectionName)
                    .where('userId', '==', userId)
                    .get();

                snapshot.forEach(doc => {
                    batch.delete(doc.ref);
                });
            }

            await batch.commit();
            console.log('✅ User data deleted');
            return { success: true };
        } catch (error) {
            console.error('❌ Error deleting user data:', error);
            return { success: false, error: error };
        }
    }
};

// Make HealthDataService available globally
window.HealthDataService = HealthDataService;
console.log('💚 Health Data Service loaded');
