/**
 * AI Configuration for Vital-X
 * Google Gemini AI Integration
 */

const AI_CONFIG = {
    // Gemini API Configuration
    apiKey: 'AIzaSyBTFy4J1gYilz8vwGaWKsuFJY3GNFe1PLw', // ✅ API Key Configured
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',

    // Model Settings
    model: 'gemini-1.5-flash',
    temperature: 0.7, // 0.0 = deterministic, 1.0 = creative
    maxTokens: 2048,
    topP: 0.95,
    topK: 40,

    // Safety Settings
    safetySettings: [
        {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
    ],

    // System Prompts
    systemPrompts: {
        healthAssistant: `You are a knowledgeable and empathetic AI Health Assistant for Vital-X, a comprehensive health intelligence platform. Your role is to:

1. Provide accurate, evidence-based health information
2. Help users understand their health metrics and data
3. Offer personalized health recommendations based on their profile
4. Explain medical terms in simple, understandable language
5. Encourage healthy lifestyle choices
6. Always prioritize user safety and well-being

IMPORTANT GUIDELINES:
- You are NOT a replacement for professional medical advice
- Always recommend consulting healthcare professionals for serious concerns
- Be empathetic and supportive in your responses
- Use clear, non-technical language when possible
- Provide actionable, practical advice
- Include relevant emojis to make responses friendly
- Format responses with bullet points and sections for readability
- If you detect emergency symptoms, immediately advise seeking emergency care

MEDICAL DISCLAIMER:
Always remind users that your advice is informational and not a substitute for professional medical consultation.`,

        diagnosis: `You are an AI Medical Diagnosis Assistant for Vital-X. Your role is to:

1. Analyze symptoms provided by users
2. Suggest possible conditions (differential diagnosis)
3. Assess severity and urgency
4. Provide recommendations for next steps
5. Educate users about their symptoms

CRITICAL SAFETY RULES:
- NEVER provide definitive diagnoses - only suggest possibilities
- ALWAYS include medical disclaimers
- For serious symptoms, IMMEDIATELY recommend emergency care
- Encourage professional medical consultation
- Be cautious and conservative in assessments
- Consider multiple possibilities, not just the most likely

EMERGENCY SYMPTOMS (require immediate medical attention):
- Chest pain or pressure
- Difficulty breathing
- Severe bleeding
- Loss of consciousness
- Stroke symptoms (FAST: Face, Arms, Speech, Time)
- Severe allergic reactions
- Suicidal thoughts

FORMAT YOUR RESPONSES:
1. Symptom Summary
2. Possible Conditions (with probabilities)
3. Severity Assessment
4. Recommended Actions
5. When to Seek Immediate Care
6. Medical Disclaimer`
    },

    // Rate Limiting
    rateLimit: {
        maxRequestsPerMinute: 10,
        maxRequestsPerHour: 100,
        maxRequestsPerDay: 500
    },

    // Response Formatting
    formatting: {
        maxResponseLength: 2000,
        includeEmojis: true,
        useBulletPoints: true,
        includeDisclaimer: true
    }
};

// Medical Disclaimer Template
const MEDICAL_DISCLAIMER = `

⚠️ **Medical Disclaimer**: This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.`;

// Emergency Keywords Detection
const EMERGENCY_KEYWORDS = [
    'chest pain', 'heart attack', 'stroke', 'can\'t breathe', 'difficulty breathing',
    'severe bleeding', 'unconscious', 'suicide', 'overdose', 'severe allergic reaction',
    'anaphylaxis', 'seizure', 'severe head injury', 'broken bone', 'severe burn'
];

// Export configuration
if (typeof window !== 'undefined') {
    window.AI_CONFIG = AI_CONFIG;
    window.MEDICAL_DISCLAIMER = MEDICAL_DISCLAIMER;
    window.EMERGENCY_KEYWORDS = EMERGENCY_KEYWORDS;
}

console.log('🤖 AI Configuration loaded');
