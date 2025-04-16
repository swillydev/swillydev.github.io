/**
 * Form Handler for MongoDB Integration
 * Handles form submissions and sends data to the MongoDB backend.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Determine API URL based on environment
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const apiUrl = isLocalhost
        ? 'http://localhost:5000/api/submit-form'
        : 'https://haleys-contact-form.onrender.com/api/submit-form';

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

                // Send data to backend
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    body: formData,
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
                // Show error toast
                toast.error('There was an error sending your message. Please try again later.');
            }
        });
    });
});
