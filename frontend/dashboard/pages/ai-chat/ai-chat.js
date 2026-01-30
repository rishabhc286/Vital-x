/**
 * AI Chat - Real-Time Integration with Gemini AI
 * Provides conversational health assistance with database persistence
 */

let currentUser = null;
let chatHistory = [];

// ================= AUTHENTICATION & DATA LOADING =================
async function checkAuthAndLoadData() {
    try {
        currentUser = await AuthService.checkAuth();

        if (!currentUser) {
            window.location.href = '../../../auth/login.html';
            return;
        }

        console.log('✅ User authenticated:', currentUser.uid);
        await loadChatHistory();
        displayWelcomeMessage();

    } catch (error) {
        console.error('❌ Error loading data:', error);
        window.location.href = '../../../auth/login.html';
    }
}

// ================= LOAD CHAT HISTORY =================
async function loadChatHistory() {
    try {
        const result = await HealthDataService.getChatHistory(currentUser.uid, 50);

        if (result.success && result.data.length > 0) {
            chatHistory = result.data;
            console.log('✅ Chat history loaded:', chatHistory.length, 'messages');
            displayChatHistory();
        } else {
            console.log('ℹ️ No chat history found');
            chatHistory = [];
        }
    } catch (error) {
        console.error('❌ Error loading chat history:', error);
        chatHistory = [];
    }
}

// ================= DISPLAY CHAT HISTORY =================
function displayChatHistory() {
    const chatMessages = document.getElementById('chatMessages');

    // Clear existing messages except welcome
    chatMessages.innerHTML = '';

    // Display historical messages
    chatHistory.forEach(msg => {
        addMessageToUI(msg.message, msg.isUser ? 'user' : 'ai', false);
    });

    scrollToBottom();
}

// ================= DISPLAY WELCOME MESSAGE =================
function displayWelcomeMessage() {
    const chatMessages = document.getElementById('chatMessages');

    // Only show welcome if no history
    if (chatHistory.length === 0) {
        const welcomeMsg = `Hello! I'm your AI Health Assistant powered by Google Gemini. I can help you understand your health data, provide recommendations, and answer questions about your wellness. How can I assist you today?`;
        addMessageToUI(welcomeMsg, 'ai', false);
    }
}

// ================= SEND MESSAGE =================
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    // Clear input
    input.value = '';

    // Add user message to UI
    addMessageToUI(message, 'user');

    // Show typing indicator
    showTypingIndicator();

    try {
        // Get AI response
        const response = await window.aiService.chat(message, currentUser.uid);

        // Hide typing indicator
        hideTypingIndicator();

        // Add AI response to UI
        addMessageToUI(response, 'ai');

        // Save both messages to database
        await saveChatMessage(message, true);
        await saveChatMessage(response, false);

    } catch (error) {
        console.error('❌ Error getting AI response:', error);
        hideTypingIndicator();

        const errorMsg = `I apologize, but I'm experiencing technical difficulties. ${error.message}\n\nPlease try again in a moment, or consult with a healthcare professional for immediate assistance.`;
        addMessageToUI(errorMsg, 'ai');
    }
}

// ================= SEND QUICK MESSAGE =================
async function sendQuickMessage(message) {
    const input = document.getElementById('chatInput');
    input.value = message;
    await sendMessage();
}

// ================= ADD MESSAGE TO UI =================
function addMessageToUI(text, type, saveToHistory = true) {
    const chatMessages = document.getElementById('chatMessages');

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = type === 'user' ? '👤' : '🤖';

    const content = document.createElement('div');
    content.className = 'message-content';

    const messageText = document.createElement('div');
    messageText.className = 'message-text';

    // Format text with markdown-like styling
    messageText.innerHTML = formatMessage(text);

    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    content.appendChild(messageText);
    content.appendChild(messageTime);

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);

    chatMessages.appendChild(messageDiv);

    // Add to local history
    if (saveToHistory) {
        chatHistory.push({
            message: text,
            isUser: type === 'user',
            timestamp: new Date()
        });
    }

    scrollToBottom();
}

// ================= FORMAT MESSAGE =================
function formatMessage(text) {
    // Convert markdown-like formatting to HTML
    let formatted = text
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Bullet points
        .replace(/^- (.+)$/gm, '• $1')
        // Line breaks
        .replace(/\n/g, '<br>')
        // Emojis stay as-is
        .replace(/⚠️/g, '<span class="warning-emoji">⚠️</span>')
        .replace(/🚨/g, '<span class="emergency-emoji">🚨</span>');

    return formatted;
}

// ================= SAVE CHAT MESSAGE =================
async function saveChatMessage(message, isUser) {
    try {
        const chatData = {
            message: message,
            isUser: isUser,
            timestamp: new Date()
        };

        await HealthDataService.saveChatMessage(currentUser.uid, chatData);
        console.log('✅ Chat message saved');
    } catch (error) {
        console.error('❌ Error saving chat message:', error);
    }
}

// ================= TYPING INDICATOR =================
function showTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    indicator.style.display = 'block';
    scrollToBottom();
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    indicator.style.display = 'none';
}

// ================= SCROLL TO BOTTOM =================
function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

// ================= HANDLE KEY PRESS =================
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// ================= CLEAR CHAT =================
async function clearChat() {
    if (!confirm('Are you sure you want to clear the chat history? This cannot be undone.')) {
        return;
    }

    try {
        // Clear from database
        const chatRef = db.collection('chatHistory').doc(currentUser.uid).collection('messages');
        const snapshot = await chatRef.get();

        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        // Clear local history
        chatHistory = [];

        // Clear UI
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';

        // Show welcome message
        displayWelcomeMessage();

        console.log('✅ Chat cleared');

    } catch (error) {
        console.error('❌ Error clearing chat:', error);
        alert('Failed to clear chat. Please try again.');
    }
}

// ================= SIDEBAR TOGGLE =================
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

// ================= INITIALIZE =================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔵 AI Chat page loading...');

    // Check if AI service is available
    if (!window.aiService) {
        console.error('❌ AI Service not loaded');
        alert('AI Service is not available. Please refresh the page.');
        return;
    }

    console.log('✅ AI Service ready');

    await checkAuthAndLoadData();

    // Focus on input
    document.getElementById('chatInput').focus();

    console.log('✅ AI Chat page loaded');
});

// Make functions globally available
window.sendMessage = sendMessage;
window.sendQuickMessage = sendQuickMessage;
window.handleKeyPress = handleKeyPress;
window.clearChat = clearChat;
window.toggleSidebar = toggleSidebar;

console.log('💚 AI Chat Real-Time Integration loaded');
