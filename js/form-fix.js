/**
 * Form Fix JavaScript
 * This script ensures form fields are clickable by adding event listeners
 * and fixing any potential issues with overlapping elements.
 */

// Global variable to track if the form fix has been applied
let formFixApplied = false;

document.addEventListener('DOMContentLoaded', function() {
    // Prevent multiple initializations
    if (formFixApplied) {
        console.log('Form Fix JS already applied, skipping');
        return;
    }

    formFixApplied = true;
    console.log('Form Fix JS loaded');

    // Get all form elements
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        console.log('Processing form:', form.id);

        // Skip if this form already has the fix applied
        if (form.hasAttribute('data-form-fix-applied')) {
            console.log('Form already has fix applied, skipping:', form.id);
            return;
        }

        // Mark this form as having the fix applied
        form.setAttribute('data-form-fix-applied', 'true');

        // Disable pointer events on all form container divs
        const formContainers = form.querySelectorAll('.name, .email, .telephone, .subject, .message, .submit');
        formContainers.forEach(container => {
            container.style.pointerEvents = 'none';
        });

        // Get all input fields, selects, and textareas in the form
        const formFields = form.querySelectorAll('input, select, textarea');

        formFields.forEach(field => {
            // Skip if this field already has event listeners added
            if (field.hasAttribute('data-event-listeners-added')) {
                return;
            }

            // Mark this field as having event listeners added
            field.setAttribute('data-event-listeners-added', 'true');

            // Add a click event listener to each field
            field.addEventListener('click', function(e) {
                console.log('Field clicked:', field.id || field.name);
                // Prevent event propagation to ensure the click is captured by the field
                e.stopPropagation();

                // Focus the field
                field.focus();
            });

            // Add a mousedown event listener to each field
            field.addEventListener('mousedown', function(e) {
                console.log('Field mousedown:', field.id || field.name);
                // Prevent event propagation
                e.stopPropagation();
            });

            // Add a mouseup event listener to each field
            field.addEventListener('mouseup', function(e) {
                console.log('Field mouseup:', field.id || field.name);
                // Prevent event propagation
                e.stopPropagation();
            });

            // Add a focus event listener to each field
            field.addEventListener('focus', function() {
                console.log('Field focused:', field.id || field.name);
            });

            // Set inline styles to ensure the field is clickable
            field.style.pointerEvents = 'auto';
            field.style.cursor = field.tagName.toLowerCase() === 'input' && field.type === 'submit' ? 'pointer' : 'text';
            field.style.position = 'relative';
            field.style.zIndex = '10001';
        });

        // Don't add a submit event listener to avoid conflicts with the main form handler
    });

    // Add a click event listener to the document to check if clicks are being captured
    document.addEventListener('click', function(e) {
        console.log('Document clicked at:', e.clientX, e.clientY);
        console.log('Target:', e.target.tagName, e.target.id || e.target.className);
    });

    // Fix for any potential overlapping elements
    const overlayFix = document.createElement('style');
    overlayFix.textContent = `
        #container {
            position: relative !important;
            z-index: 9999 !important;
        }

        form {
            position: relative !important;
            z-index: 10000 !important;
        }

        input, select, textarea {
            position: relative !important;
            z-index: 10001 !important;
            pointer-events: auto !important;
            cursor: text !important;
        }

        input[type="submit"] {
            cursor: pointer !important;
        }

        .name, .email, .telephone, .subject, .message, .submit {
            position: relative !important;
            z-index: 1001 !important;
            pointer-events: none !important;
        }

        /* Ensure labels don't block input fields */
        form label {
            pointer-events: none !important;
        }
    `;

    document.head.appendChild(overlayFix);

    // Force all form fields to be clickable after a short delay
    setTimeout(function() {
        // Disable pointer events on all form container divs again (in case they were re-enabled)
        const formContainers = document.querySelectorAll('.name, .email, .telephone, .subject, .message, .submit');
        formContainers.forEach(container => {
            container.style.pointerEvents = 'none';
        });

        // Re-enable pointer events on all form fields
        const allFormFields = document.querySelectorAll('input, select, textarea');
        allFormFields.forEach(field => {
            field.style.pointerEvents = 'auto';
            field.style.cursor = field.tagName.toLowerCase() === 'input' && field.type === 'submit' ? 'pointer' : 'text';
            field.style.position = 'relative';
            field.style.zIndex = '10001';
        });
    }, 500);

    // Do it again after a longer delay to ensure it's applied
    setTimeout(function() {
        // Disable pointer events on all form container divs again (in case they were re-enabled)
        const formContainers = document.querySelectorAll('.name, .email, .telephone, .subject, .message, .submit');
        formContainers.forEach(container => {
            container.style.pointerEvents = 'none';
        });

        // Re-enable pointer events on all form fields
        const allFormFields = document.querySelectorAll('input, select, textarea');
        allFormFields.forEach(field => {
            field.style.pointerEvents = 'auto';
            field.style.cursor = field.tagName.toLowerCase() === 'input' && field.type === 'submit' ? 'pointer' : 'text';
            field.style.position = 'relative';
            field.style.zIndex = '10001';
        });
    }, 1000);
});
