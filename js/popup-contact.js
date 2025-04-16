/**
 * Popup Contact Form
 * Shows a popup contact form when the cursor moves toward the top of the screen
 * Only shows once per page visit
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize popup state for this page visit
  let popupShown = false;

  let mouseY = 0;
  let lastMouseY = 0;
  let movingUp = false;

  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    mouseY = e.clientY;

    // Detect if mouse is moving upward
    movingUp = mouseY < lastMouseY;

    // If mouse is near the top of the screen (top 10%) and moving up
    if (mouseY < window.innerHeight * 0.1 && movingUp && !popupShown) {
      showPopup();
    }

    lastMouseY = mouseY;
  });

  // Show the popup
  function showPopup() {
    const popup = document.getElementById('contact-popup-overlay');
    if (popup && !popupShown) {
      popup.classList.add('active');
      popupShown = true;

      // No need to store in sessionStorage since we only care about this page visit
    }
  }

  // Close the popup when clicking the close button
  const closeButton = document.querySelector('.popup-close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      const popup = document.getElementById('contact-popup-overlay');
      popup.classList.remove('active');
      // We don't reset popupShown to false since we only want to show it once per page visit
    });
  }

  // Close the popup when clicking outside the content
  const popupOverlay = document.getElementById('contact-popup-overlay');
  if (popupOverlay) {
    popupOverlay.addEventListener('click', (e) => {
      if (e.target === popupOverlay) {
        popupOverlay.classList.remove('active');
        // We don't reset popupShown to false since we only want to show it once per page visit
      }
    });
  }


  // Note: Form submission is now handled by form-handler.js
  // This code is kept for backward compatibility
  // The popup closing is still handled here
  const popupForm = document.getElementById('popup_contact_form');
  if (popupForm) {
    // We only handle the popup closing here
    // The actual form submission is handled in form-handler.js
  }
});
