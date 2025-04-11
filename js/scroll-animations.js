/**
 * Scroll Animations
 * This script handles fade-in animations for page sections as they scroll into view.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Create the intersection observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
        }
      });
    },
    {
      threshold: 0.1, // Element becomes visible when 10% is in view
      rootMargin: '0px'
    }
  );

  // Find all sections with the fade-in-section class
  const sections = document.querySelectorAll('.fade-in-section');
  
  // Observe each section
  sections.forEach((section, index) => {
    // Add a slight delay for staggered effect if needed
    section.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(section);
  });

  // Find all sections that should have fade-in animations but don't have the class yet
  const potentialSections = [
    // Common section selectors across the site
    '.contact-section',
    '.about-section',
    '.location-section',
    '.contact-container',
    '.contact-info-block',
    '.contact-form',
    '.map-container',
    '.content-container > section'
  ];

  // Add fade-in-section class to these elements if they exist
  potentialSections.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
      if (!element.classList.contains('fade-in-section')) {
        element.classList.add('fade-in-section');
        element.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(element);
      }
    });
  });
});
