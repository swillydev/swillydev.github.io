/**
 * Toast Notification System
 * A simple toast notification system for displaying success and error messages.
 */

// Global variable to ensure only one instance of ToastNotification exists
let toastInstance = null;

class ToastNotification {
    constructor() {
        // If an instance already exists, return it instead of creating a new one
        if (toastInstance) {
            console.log('Toast notification instance already exists, returning existing instance');
            return toastInstance;
        }

        console.log('Creating new toast notification instance');
        this.createToastContainer();
        toastInstance = this;
    }

    // Create the toast container if it doesn't exist
    createToastContainer() {
        if (!document.getElementById('toast-container')) {
            const toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            document.body.appendChild(toastContainer);

            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                #toast-container {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    z-index: 99999;
                }

                .toast {
                    min-width: 300px;
                    margin-top: 10px;
                    padding: 15px 20px;
                    border-radius: 6px;
                    color: white;
                    font-family: 'Urbanist', sans-serif;
                    font-weight: 500;
                    font-size: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    animation: slideIn 0.3s ease-in-out;
                    opacity: 1 !important;
                }

                .toast-success {
                    background-color: #4CAF50;
                    border-left: 5px solid #2E7D32;
                }

                .toast-error {
                    background-color: #F44336;
                    border-left: 5px solid #C62828;
                }

                .toast-info {
                    background-color: #2196F3;
                    border-left: 5px solid #0D47A1;
                    color: white;
                    opacity: 1 !important;
                }

                .toast-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-left: 15px;
                    opacity: 0.8;
                    transition: opacity 0.2s;
                }

                .toast-close:hover {
                    opacity: 1;
                }

                @keyframes slideIn {
                    0% {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    50% {
                        transform: translateX(-10px);
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes fadeOut {
                    0% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Show a toast notification
    show(message, type = 'success', duration = 5000) {
        const toastContainer = document.getElementById('toast-container');

        // Clear any existing toasts with the same message to prevent duplicates
        const existingToasts = toastContainer.querySelectorAll('.toast');
        existingToasts.forEach(existingToast => {
            const existingMessage = existingToast.querySelector('div');
            if (existingMessage && existingMessage.textContent === message) {
                this.removeToast(existingToast);
            }
        });

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        // Create message element
        const messageElement = document.createElement('div');
        messageElement.textContent = message;

        // Create close button
        const closeButton = document.createElement('button');
        closeButton.className = 'toast-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => this.removeToast(toast));

        // Append elements to toast
        toast.appendChild(messageElement);
        toast.appendChild(closeButton);

        // Append toast to container
        toastContainer.appendChild(toast);

        // Auto-remove after duration
        setTimeout(() => {
            if (toast.parentNode === toastContainer) {
                this.removeToast(toast);
            }
        }, duration);

        // Return the toast element for reference
        return toast;
    }

    // Remove a toast notification with animation
    removeToast(toast) {
        toast.style.animation = 'fadeOut 0.5s ease-in-out';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 500);
    }

    // Clear all existing toasts
    clearAll() {
        const toastContainer = document.getElementById('toast-container');
        if (toastContainer) {
            // Remove all toasts with animation
            const toasts = toastContainer.querySelectorAll('.toast');
            toasts.forEach(toast => this.removeToast(toast));
        }
    }

    // Show a success toast
    success(message, duration = 5000) {
        // Clear any existing toasts first
        this.clearAll();
        return this.show(message, 'success', duration);
    }

    // Show an error toast
    error(message, duration = 5000) {
        // Clear any existing toasts first
        this.clearAll();
        return this.show(message, 'error', duration);
    }

    // Show an info toast
    info(message, duration = 5000) {
        // Clear any existing toasts first
        this.clearAll();
        return this.show(message, 'info', duration);
    }
}

// Create a global toast instance
const toast = new ToastNotification();
