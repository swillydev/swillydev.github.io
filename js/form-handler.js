/**
 * Form Handler for MongoDB Integration
 * Handles form submissions and sends data to the MongoDB backend.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Determine if we're running locally
    const isLocalDevelopment = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';

    // Use a CORS proxy for local development
    const apiUrl = isLocalDevelopment
        ? 'https://cors-anywhere.herokuapp.com/https://haleys-contact.onrender.com/api/submit-form'
        : 'https://haleys-contact.onrender.com/api/submit-form';

    console.log('Using API URL:', apiUrl);

    // Handle all contact forms
    document.querySelectorAll('#contact_form, #popup_contact_form').forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(e.target);

            try {
                // Show loading toast
                toast.show('Sending your message...', 'info');

                // Show detailed debug info in console
                console.log('Submitting form to:', apiUrl);
                console.log('Form data:', Object.fromEntries(formData));

                // Send data to backend
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                        // Don't set Content-Type with FormData as the browser will set it with the boundary
                    },
                    mode: 'cors',
                    credentials: 'omit' // Changed from 'same-origin' to 'omit' to avoid CORS preflight issues
                });

                const result = await response.json();

                if (result.status === 'success') {
                    // Show success toast
                    toast.success('Thank you for your message. We will get back to you soon!');

                    // Reset the form
                    e.target.reset();

                    // If this is the popup form, close the popup
                    if (e.target.id === 'popup_contact_form') {
                        const popup = document.getElementById('contact-popup-overlay');
                        if (popup) {
                            popup.classList.remove('active');
                        }
                    }
                } else {
                    // Show error toast
                    toast.error(result.message || 'There was an error sending your message. Please try again later.');
                }
            } catch (error) {
                console.error('Error:', error);

                // More detailed error logging
                if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                    console.error('Network error: Could not connect to the server. The server might be down or there might be a CORS issue.');
                    toast.error('Network error: Could not connect to the server. Please try again later.');
                } else if (error.name === 'SyntaxError') {
                    console.error('Response parsing error: The server response was not valid JSON.');
                    toast.error('Server error: Received an invalid response. Please try again later.');
                } else {
                    // Generic error
                    toast.error('There was an error sending your message. Please try again later.');
                }

                // Log additional information that might help debugging
                console.log('API URL:', apiUrl);
                console.log('Form data keys:', [...formData.keys()]);
            }
        });
    });
});
