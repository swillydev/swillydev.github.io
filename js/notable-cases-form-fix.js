/**
 * Direct Form Fix for Notable Cases Page
 * This script directly targets the form on the notable-cases.html page
 * and ensures it's clickable by applying inline styles and event handlers.
 */

// Execute immediately when the script loads
(function() {
    console.log('Notable Cases Form Fix loaded');

    // Function to fix the form
    function fixForm() {
        console.log('Fixing form on notable-cases.html');

        // Get the form and container
        const form = document.getElementById('contact_form');
        const container = document.getElementById('container');

        if (!form || !container) {
            console.error('Form or container not found, retrying in 500ms');
            setTimeout(fixForm, 500);
            return;
        }

        console.log('Form and container found, applying fixes');

        // Apply styles to the container
        container.style.position = 'relative';
        container.style.zIndex = '9999';
        container.style.pointerEvents = 'auto';

        // Apply styles to the form
        form.style.position = 'relative';
        form.style.zIndex = '10000';
        form.style.pointerEvents = 'auto';

        // Get all form fields
        const formFields = form.querySelectorAll('input, select, textarea');

        formFields.forEach(field => {
            console.log('Fixing field:', field.id || field.name);

            // Apply inline styles to ensure the field is clickable
            field.style.pointerEvents = 'auto';
            field.style.cursor = field.tagName.toLowerCase() === 'input' && field.type === 'submit' ? 'pointer' : 'text';
            field.style.position = 'relative';
            field.style.zIndex = '10001';

            // Add event listeners
            field.addEventListener('click', function(e) {
                console.log('Field clicked:', field.id || field.name);
                e.stopPropagation();
                field.focus();
            });

            // Add touch events for mobile devices
            field.addEventListener('touchstart', function(e) {
                console.log('Field touchstart:', field.id || field.name);
                // Highlight the field to show it's tappable
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.stopPropagation();
            });

            field.addEventListener('touchend', function(e) {
                console.log('Field touchend:', field.id || field.name);
                // Reset background and focus the field
                this.style.backgroundColor = '';
                setTimeout(() => {
                    this.focus();
                }, 50);
                e.stopPropagation();
            });

            // Force the field to be clickable
            field.setAttribute('tabindex', '0');
        });

        // Add a click event listener to the form
        form.addEventListener('click', function(e) {
            console.log('Form clicked');
        });

        // Don't add a submit event listener to avoid conflicts with the main form handler

        console.log('Form fix applied');
    }

    // Fix the form when the DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixForm);
    } else {
        fixForm();
    }

    // Fix the form again after a short delay to ensure it's applied
    setTimeout(fixForm, 1000);

    // Fix the form again after the page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(fixForm, 500);

        // Special fix for mobile devices
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            console.log('Mobile device detected, applying special fixes for notable-cases page');

            setTimeout(function() {
                // Get the form and container
                const form = document.getElementById('contact_form');
                const container = document.getElementById('container');

                if (!form || !container) return;

                // Apply enhanced mobile styles to container and form
                container.style.zIndex = '9999';
                container.style.pointerEvents = 'auto';

                form.style.zIndex = '10000';
                form.style.pointerEvents = 'auto';

                // Get all form fields
                const mobileFields = form.querySelectorAll('input[type="text"], input[type="email"], textarea, select');

                mobileFields.forEach(field => {
                    // Apply enhanced mobile styles
                    field.style.zIndex = '20000';
                    field.style.touchAction = 'auto';
                    field.style.webkitAppearance = 'none';
                    field.style.appearance = 'none';
                    field.style.webkitTapHighlightColor = 'rgba(124, 47, 132, 0.3)';
                    field.style.pointerEvents = 'auto';

                    // Make sure the field is above everything else
                    field.style.position = 'relative';
                    field.style.zIndex = '20000';
                });

                // Make container divs completely transparent to touches
                const mobileContainers = form.querySelectorAll('.name, .email, .telephone, .subject, .message, .submit');
                mobileContainers.forEach(container => {
                    container.style.pointerEvents = 'none';
                    container.style.touchAction = 'none';
                    container.style.zIndex = '1';
                });
            }, 1500);
        }
    });
})();
