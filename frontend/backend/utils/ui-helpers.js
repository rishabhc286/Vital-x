/**
 * UI Helper Utilities
 * Common UI functions for notifications, validation, and error handling
 */

const UIHelpers = {
    /**
     * Show success notification
     * @param {string} message - Success message
     */
    showSuccess(message) {
        this.showNotification(message, 'success');
    },

    /**
     * Show error notification
     * @param {string} message - Error message
     */
    showError(message) {
        this.showNotification(message, 'error');
    },

    /**
     * Show info notification
     * @param {string} message - Info message
     */
    showInfo(message) {
        this.showNotification(message, 'info');
    },

    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info)
     */
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification-toast');
        if (existing) existing.remove();

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;

        // Add to body
        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    /**
     * Get icon for notification type
     * @param {string} type - Notification type
     * @returns {string} - Icon emoji
     */
    getIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        return icons[type] || icons.info;
    },

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} - True if valid
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {object} - Validation result
     */
    validatePassword(password) {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasMinLength = password.length >= 6;

        return {
            isValid: hasUpperCase && hasLowerCase && hasNumbers && hasMinLength,
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            hasMinLength
        };
    },

    /**
     * Handle Firebase error
     * @param {object} error - Firebase error object
     * @returns {string} - User-friendly error message
     */
    handleFirebaseError(error) {
        const errorMessages = {
            'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
            'auth/invalid-email': 'Please enter a valid email address.',
            'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
            'auth/weak-password': 'Password is too weak. Please use a stronger password.',
            'auth/user-disabled': 'This account has been disabled.',
            'auth/user-not-found': 'No account found with this email.',
            'auth/wrong-password': 'Incorrect password. Please try again.',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
            'auth/network-request-failed': 'Network error. Please check your connection.',
            'auth/popup-closed-by-user': 'Sign-in popup was closed before completing.',
            'auth/cancelled-popup-request': 'Only one popup request is allowed at a time.'
        };

        return errorMessages[error.code] || error.message || 'An unexpected error occurred.';
    },

    /**
     * Show loading state on button
     * @param {HTMLElement} button - Button element
     * @param {boolean} loading - Loading state
     * @param {string} loadingText - Text to show when loading
     */
    setButtonLoading(button, loading, loadingText = 'Loading...') {
        if (loading) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.textContent = loadingText;
            button.classList.add('loading');
        } else {
            button.disabled = false;
            button.textContent = button.dataset.originalText || button.textContent;
            button.classList.remove('loading');
        }
    },

    /**
     * Format date
     * @param {Date|string} date - Date to format
     * @returns {string} - Formatted date string
     */
    formatDate(date) {
        if (!date) return 'N/A';
        const d = date instanceof Date ? date : new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
};

// Make UIHelpers available globally
window.UIHelpers = UIHelpers;
console.log('🎨 UI Helpers loaded');
