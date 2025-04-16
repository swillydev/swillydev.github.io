/**
 * Toast Notification System
 * A simple toast notification system for displaying success and error messages.
 */

class ToastNotification {
    constructor() {
        this.createToastContainer();
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
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                }

                .toast {
                    min-width: 250px;
                    margin-top: 10px;
                    padding: 15px;
                    border-radius: 4px;
                    color: white;
                    font-family: 'Urbanist', sans-serif;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    animation: slideIn 0.3s ease-in-out;
                }

                .toast-success {
                    background-color: #4CAF50;
                }

                .toast-error {
                    background-color: #F44336;
                }

                .toast-info {
                    background-color: #2196F3;
                }

                .toast-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                    margin-left: 10px;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes fadeOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Show a toast notification
    show(message, type = 'success', duration = 5000) {
        const toastContainer = document.getElementById('toast-container');

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
    }

    // Remove a toast notification with animation
    removeToast(toast) {
        toast.style.animation = 'fadeOut 0.3s ease-in-out';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // Show a success toast
    success(message, duration = 5000) {
        this.show(message, 'success', duration);
    }

    // Show an error toast
    error(message, duration = 5000) {
        this.show(message, 'error', duration);
    }
}

// Create a global toast instance
const toast = new ToastNotification();
