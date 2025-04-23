/**
 * MongoDB Atlas Form Handler
 * Handles form submissions and sends data directly to MongoDB Atlas.
 */

// MongoDB Atlas API endpoint
const MONGODB_API_URL = "https://data.mongodb-api.com/app/data-lfnxs/endpoint/data/v1/action/insertOne";
const MONGODB_API_KEY = "Ov5CIbOKvGLHLFtQoYxhQJIQdsxgRNBFxlKPYHOgHbvUwKJdWLgHjJ3oHvm3DSFo";

// MongoDB database and collection
const DATABASE = "contact_form_db";
const COLLECTION = "submissions";

document.addEventListener('DOMContentLoaded', function() {
    console.log("MongoDB Form Handler loaded");
    
    // Handle all contact forms
    document.querySelectorAll('#contact_form, #popup_contact_form').forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(e.target);
            const formDataObj = Object.fromEntries(formData);
            
            // Add timestamp
            formDataObj.timestamp = new Date().toISOString();
            
            try {
                // Show loading toast
                if (typeof toast !== 'undefined') {
                    toast.show('Sending your message...', 'info');
                } else {
                    console.log('Toast notification system not available');
                }
                
                console.log('Submitting form data to MongoDB Atlas:', formDataObj);
                
                // Send data to MongoDB Atlas
                const response = await fetch(MONGODB_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': MONGODB_API_KEY,
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        dataSource: "Cluster0",
                        database: DATABASE,
                        collection: COLLECTION,
                        document: formDataObj
                    })
                });
                
                // Check if response is ok
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                console.log('MongoDB response:', result);
                
                if (result.insertedId) {
                    // Show success toast
                    if (typeof toast !== 'undefined') {
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
            } catch (error) {
                console.error('Error:', error);
                
                // Show error toast
                if (typeof toast !== 'undefined') {
                    toast.error('There was an error sending your message. Please try again later.');
                } else {
                    console.error('Form submission error:', error.message);
                }
            }
        });
    });
});
