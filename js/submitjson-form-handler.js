/**
 * SubmitJSON Form Handler
 * Handles form submissions and sends data to SubmitJSON.
 */

// Create a global variable to track if the form handler has been initialized
let submitJSONHandlerInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
    // Prevent multiple initializations
    if (submitJSONHandlerInitialized) {
        console.log("SubmitJSON Form Handler already initialized, skipping");
        return;
    }

    submitJSONHandlerInitialized = true;
    console.log("SubmitJSON Form Handler loaded");

    // Your SubmitJSON API key and endpoint
    const SUBMITJSON_API_KEY = "sjk_34a90ac217634513850f5545abed1359"; // Replace this with your actual API key from SubmitJSON dashboard
    const SUBMITJSON_ENDPOINT = "0lH1d4Dr5"; // Replace this with your actual endpoint slug from SubmitJSON dashboard

    // Prevent multiple submissions
    let isSubmitting = false;

    // Handle all contact forms
    document.querySelectorAll('#contact_form, #popup_contact_form').forEach(form => {
        // Remove any existing event listeners (to prevent duplicates)
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);

        // Add a data attribute to mark this form as handled
        newForm.setAttribute('data-submitjson-initialized', 'true');

        newForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Prevent multiple submissions
            if (isSubmitting) {
                console.log('Form submission already in progress');
                return;
            }

            isSubmitting = true;

            // Get form data
            const formData = new FormData(e.target);
            const formDataObj = Object.fromEntries(formData);

            // Add timestamp and page info
            formDataObj.timestamp = new Date().toISOString();
            formDataObj.page = window.location.pathname;

            try {
                // Show loading toast
                if (typeof toast !== 'undefined') {
                    // Clear any existing toasts first
                    const toastContainer = document.getElementById('toast-container');
                    if (toastContainer) {
                        toastContainer.innerHTML = '';
                    }

                    // Show info message
                    toast.info('Sending your message...');
                } else {
                    console.log('Toast notification system not available');
                }

                console.log('Submitting form data to SubmitJSON:', formDataObj);

                // Send data to SubmitJSON
                const response = await fetch(`https://api.submitjson.com/v1/submit/${SUBMITJSON_ENDPOINT}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': SUBMITJSON_API_KEY
                    },
                    body: JSON.stringify({ data: formDataObj })
                });

                try {
                    // Parse the response
                    const result = await response.json();
                    console.log('SubmitJSON response:', result);

                    // Check if response is ok
                    if (!response.ok) {
                        console.warn(`HTTP warning: status: ${response.status}, message: ${result.message || 'Unknown error'}`);
                    }

                    // If we have a result ID or the response is OK, consider it a success
                    if (result.id || response.ok) {
                        // Show success toast
                        if (typeof toast !== 'undefined') {
                            // Clear any existing toasts first
                            const toastContainer = document.getElementById('toast-container');
                            if (toastContainer) {
                                toastContainer.innerHTML = '';
                            }

                            // Show success message
                            toast.success('Thank you for your message. We will get back to you soon!');
                        } else {
                            console.log('Form submitted successfully');
                        }

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
                        if (typeof toast !== 'undefined') {
                            toast.error('There was an error sending your message. Please try again later.');
                        } else {
                            console.error('Form submission failed');
                        }
                    }
                } catch (parseError) {
                    console.error('Error parsing response:', parseError);

                    // If the response status is OK, still consider it a success
                    if (response.ok) {
                        // Show success toast
                        if (typeof toast !== 'undefined') {
                            // Clear any existing toasts first
                            const toastContainer = document.getElementById('toast-container');
                            if (toastContainer) {
                                toastContainer.innerHTML = '';
                            }

                            // Show success message
                            toast.success('Thank you for your message. We will get back to you soon!');
                        } else {
                            console.log('Form submitted successfully despite parsing error');
                        }

                        // Reset the form
                        e.target.reset();
                    } else {
                        // Show error toast
                        if (typeof toast !== 'undefined') {
                            toast.error('There was an error sending your message. Please try again later.');
                        } else {
                            console.error('Form submission failed with parsing error');
                        }
                    }
                }
            } catch (error) {
                console.error('Error:', error);

                // Show error toast
                if (typeof toast !== 'undefined') {
                    // Clear any existing toasts first
                    const toastContainer = document.getElementById('toast-container');
                    if (toastContainer) {
                        toastContainer.innerHTML = '';
                    }

                    toast.error('There was an error sending your message. Please try again later.');
                } else {
                    console.error('Form submission error:', error.message);
                }
            } finally {
                // Reset submission flag
                isSubmitting = false;
            }
        });
    });
});
