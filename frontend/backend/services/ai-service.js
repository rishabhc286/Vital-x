/**
 * AI Service for Vital-X
 * Handles all AI-related functionality using Google Gemini API
 */

class AIService {
    constructor() {
        this.config = window.AI_CONFIG;
        this.requestCount = {
            minute: 0,
            hour: 0,
            day: 0
        };
        this.lastReset = {
            minute: Date.now(),
            hour: Date.now(),
            day: Date.now()
        };
    }

    /**
     * Check if request is within rate limits
     */
    checkRateLimit() {
        const now = Date.now();

        // Reset counters if time periods have passed
        if (now - this.lastReset.minute > 60000) {
            this.requestCount.minute = 0;
            this.lastReset.minute = now;
        }
        if (now - this.lastReset.hour > 3600000) {
            this.requestCount.hour = 0;
            this.lastReset.hour = now;
        }
        if (now - this.lastReset.day > 86400000) {
            this.requestCount.day = 0;
            this.lastReset.day = now;
        }

        // Check limits
        if (this.requestCount.minute >= this.config.rateLimit.maxRequestsPerMinute) {
            throw new Error('Rate limit exceeded: Too many requests per minute');
        }
        if (this.requestCount.hour >= this.config.rateLimit.maxRequestsPerHour) {
            throw new Error('Rate limit exceeded: Too many requests per hour');
        }
        if (this.requestCount.day >= this.config.rateLimit.maxRequestsPerDay) {
            throw new Error('Rate limit exceeded: Too many requests per day');
        }

        // Increment counters
        this.requestCount.minute++;
        this.requestCount.hour++;
        this.requestCount.day++;
    }

    /**
     * Detect emergency keywords in user message
     */
    detectEmergency(message) {
        const lowerMessage = message.toLowerCase();
        return window.EMERGENCY_KEYWORDS.some(keyword =>
            lowerMessage.includes(keyword.toLowerCase())
        );
    }

    /**
     * Build health context from user data
     */
    async buildHealthContext(userId) {
        try {
            if (!userId || !window.db) {
                return '';
            }

            const userDoc = await window.db.collection('users').doc(userId).get();
            if (!userDoc.exists) {
                return '';
            }

            const userData = userDoc.data();
            const healthData = userData.healthProfile || {};

            let context = '\n\nUSER HEALTH CONTEXT:\n';

            if (healthData.age) context += `- Age: ${healthData.age} years\n`;
            if (healthData.gender) context += `- Gender: ${healthData.gender}\n`;
            if (healthData.height) context += `- Height: ${healthData.height} cm\n`;
            if (healthData.weight) context += `- Weight: ${healthData.weight} kg\n`;
            if (healthData.bmi) context += `- BMI: ${healthData.bmi}\n`;
            if (healthData.bloodType) context += `- Blood Type: ${healthData.bloodType}\n`;
            if (healthData.allergies) context += `- Allergies: ${healthData.allergies}\n`;
            if (healthData.medicalConditions) context += `- Medical Conditions: ${healthData.medicalConditions}\n`;
            if (healthData.currentMedications) context += `- Current Medications: ${healthData.currentMedications}\n`;

            return context;
        } catch (error) {
            console.error('Error building health context:', error);
            return '';
        }
    }

    /**
     * Call Gemini AI API
     */
    async callGeminiAPI(prompt, systemPrompt = null) {
        try {
            // Check rate limits
            this.checkRateLimit();

            // Check if API key is configured
            if (!this.config.apiKey || this.config.apiKey.length < 20) {
                console.warn('⚠️ Gemini API key not configured. Using fallback responses.');
                return this.getFallbackResponse(prompt);
            }

            // Build full prompt with system context
            const fullPrompt = systemPrompt
                ? `${systemPrompt}\n\nUser Query: ${prompt}`
                : prompt;

            // Prepare request body
            const requestBody = {
                contents: [{
                    parts: [{
                        text: fullPrompt
                    }]
                }],
                generationConfig: {
                    temperature: this.config.temperature,
                    topK: this.config.topK,
                    topP: this.config.topP,
                    maxOutputTokens: this.config.maxTokens,
                },
                safetySettings: this.config.safetySettings
            };

            // Make API call
            const response = await fetch(
                `${this.config.apiEndpoint}?key=${this.config.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Gemini API Error Response:', errorText);
                console.error('❌ Status:', response.status, response.statusText);
                console.error('❌ Request Body:', JSON.stringify(requestBody, null, 2));
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Gemini API Response:', data);

            // Extract response text
            if (data.candidates && data.candidates.length > 0) {
                const candidate = data.candidates[0];
                if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                    return candidate.content.parts[0].text;
                }
            }

            throw new Error('No response generated from AI');

        } catch (error) {
            console.error('❌ Gemini API Error:', error);

            // Return fallback response on error
            return this.getFallbackResponse(prompt);
        }
    }

    /**
     * Get fallback response when API is unavailable
     */
    getFallbackResponse(prompt) {
        const lowerPrompt = prompt.toLowerCase();

        if (lowerPrompt.includes('health status') || lowerPrompt.includes('how am i')) {
            return `I'm currently operating in offline mode. To get personalized AI-powered health insights, please configure the Gemini API key in the backend configuration.

However, I can tell you that monitoring your health regularly is important. Make sure to:
- Track your vital signs daily
- Maintain a balanced diet
- Exercise regularly
- Get adequate sleep
- Stay hydrated

For detailed health analysis, please consult with a healthcare professional.`;
        }

        return `I'm currently operating in offline mode. To enable full AI capabilities, please configure the Gemini API key.

In the meantime, I recommend:
- Using the health tracking features in the dashboard
- Consulting the health resources section
- Speaking with a healthcare professional for medical advice

⚠️ **Note**: For medical emergencies, please call emergency services immediately.`;
    }

    /**
     * Chat with AI Health Assistant
     */
    async chat(message, userId = null) {
        try {
            // Detect emergency
            if (this.detectEmergency(message)) {
                return `🚨 **EMERGENCY DETECTED**

Your message contains keywords that may indicate a medical emergency. 

**IMMEDIATE ACTION REQUIRED:**
1. If you're experiencing a life-threatening emergency, call emergency services (911 or your local emergency number) IMMEDIATELY
2. Do not wait for online advice
3. Seek immediate medical attention

**Common Emergency Symptoms:**
- Chest pain or pressure
- Difficulty breathing
- Severe bleeding
- Loss of consciousness
- Stroke symptoms (Face drooping, Arm weakness, Speech difficulty)
- Severe allergic reactions

Please prioritize your safety and seek professional medical help right away.

${window.MEDICAL_DISCLAIMER}`;
            }

            // Build health context
            const healthContext = await this.buildHealthContext(userId);

            // Create full prompt
            const fullPrompt = `${this.config.systemPrompts.healthAssistant}${healthContext}\n\nUser Message: ${message}`;

            // Get AI response
            let response = await this.callGeminiAPI(fullPrompt);

            // Add disclaimer if configured
            if (this.config.formatting.includeDisclaimer) {
                response += window.MEDICAL_DISCLAIMER;
            }

            return response;

        } catch (error) {
            console.error('Chat error:', error);
            return `I apologize, but I'm experiencing technical difficulties. ${error.message}

Please try again in a moment, or consult with a healthcare professional for immediate assistance.`;
        }
    }

    /**
     * AI Diagnosis based on symptoms
     */
    async diagnose(symptoms, userId = null) {
        try {
            // Detect emergency
            const symptomsText = Array.isArray(symptoms) ? symptoms.join(', ') : symptoms;
            if (this.detectEmergency(symptomsText)) {
                return {
                    emergency: true,
                    message: `🚨 **EMERGENCY SYMPTOMS DETECTED**

Based on the symptoms you've described, this may be a medical emergency.

**SEEK IMMEDIATE MEDICAL ATTENTION:**
- Call emergency services (911) immediately
- Go to the nearest emergency room
- Do not drive yourself if symptoms are severe

Do not wait for online diagnosis. Your safety is the top priority.

${window.MEDICAL_DISCLAIMER}`
                };
            }

            // Build health context
            const healthContext = await this.buildHealthContext(userId);

            // Create diagnosis prompt
            const diagnosisPrompt = `${this.config.systemPrompts.diagnosis}${healthContext}

SYMPTOMS REPORTED:
${symptomsText}

Please provide a comprehensive analysis following the format specified in your instructions.`;

            // Get AI response
            const response = await this.callGeminiAPI(diagnosisPrompt);

            return {
                emergency: false,
                diagnosis: response + window.MEDICAL_DISCLAIMER
            };

        } catch (error) {
            console.error('Diagnosis error:', error);
            return {
                emergency: false,
                error: true,
                message: `I apologize, but I'm unable to process your symptoms at this time. ${error.message}

Please consult with a healthcare professional for proper medical evaluation.${window.MEDICAL_DISCLAIMER}`
            };
        }
    }

    /**
     * Get health recommendations
     */
    async getRecommendations(userId = null) {
        try {
            const healthContext = await this.buildHealthContext(userId);

            const prompt = `${this.config.systemPrompts.healthAssistant}${healthContext}

Based on the user's health profile, provide personalized health recommendations covering:
1. Physical activity and exercise
2. Nutrition and diet
3. Sleep and recovery
4. Stress management
5. Preventive care

Make the recommendations specific, actionable, and achievable.`;

            const response = await this.callGeminiAPI(prompt);
            return response + window.MEDICAL_DISCLAIMER;

        } catch (error) {
            console.error('Recommendations error:', error);
            return `Unable to generate recommendations at this time. Please try again later.`;
        }
    }

    /**
     * Explain health metric
     */
    async explainMetric(metricName, metricValue, userId = null) {
        try {
            const healthContext = await this.buildHealthContext(userId);

            const prompt = `${this.config.systemPrompts.healthAssistant}${healthContext}

Explain the following health metric to the user:
- Metric: ${metricName}
- Current Value: ${metricValue}

Include:
1. What this metric means
2. Normal ranges
3. What the current value indicates
4. Recommendations if needed`;

            return await this.callGeminiAPI(prompt);

        } catch (error) {
            console.error('Metric explanation error:', error);
            return `Unable to explain this metric at this time.`;
        }
    }
}

// Initialize AI Service
window.aiService = new AIService();
console.log('🤖 AI Service initialized');
