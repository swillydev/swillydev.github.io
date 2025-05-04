document.addEventListener('DOMContentLoaded', () => {
    // Testimonials Carousel Functionality
    initTestimonialsCarousel();

    function initTestimonialsCarousel() {
        const track = document.querySelector('.carousel-track');
        const prevButton = document.querySelector('.carousel-button.prev');
        const nextButton = document.querySelector('.carousel-button.next');
        const cards = document.querySelectorAll('.testimonial-card');

        if (!track || !cards.length) return;

        // Make sure the track has the right CSS properties for free-flowing drag
        track.style.scrollBehavior = 'auto';
        track.style.scrollSnapType = 'none';

        // Calculate number of cards to show based on screen width
        const getVisibleCards = () => {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        };

        let currentIndex = 0;
        let mouseDown = false;
        let startX = 0;
        let startScrollLeft = 0;
        let isDragging = false;

        // Update navigation buttons state
        const updateButtons = () => {
            if (!prevButton || !nextButton) return;

            const visibleCards = getVisibleCards();
            const maxIndex = cards.length - visibleCards;

            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex >= maxIndex;

            prevButton.style.opacity = prevButton.disabled ? '0.5' : '1';
            nextButton.style.opacity = nextButton.disabled ? '0.5' : '1';
        };

        // Scroll to a specific card index
        const scrollToIndex = (index) => {
            const visibleCards = getVisibleCards();
            const maxIndex = cards.length - visibleCards;
            currentIndex = Math.max(0, Math.min(index, maxIndex));

            // Enable smooth scrolling temporarily for button navigation
            track.style.scrollBehavior = 'smooth';

            const cardWidth = track.offsetWidth / visibleCards;
            const gapWidth = 32; // Gap between cards

            track.scrollTo({
                left: currentIndex * (cardWidth + gapWidth),
                behavior: 'smooth'
            });

            // Reset to auto after animation completes for free-flowing drag
            setTimeout(() => {
                track.style.scrollBehavior = 'auto';
            }, 500);

            updateButtons();
        };

        // Add button click handlers
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                scrollToIndex(currentIndex - 1);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                scrollToIndex(currentIndex + 1);
            });
        }

        // Mouse down event - start tracking drag
        track.addEventListener('mousedown', (e) => {
            mouseDown = true;
            isDragging = false;
            startX = e.pageX;
            startScrollLeft = track.scrollLeft;
            e.preventDefault();
        });

        // Mouse move event - direct 1:1 movement with the mouse
        track.addEventListener('mousemove', (e) => {
            if (!mouseDown) return;

            // Calculate distance moved
            const x = e.pageX;
            const distance = x - startX;

            // Consider any movement a drag for immediate response
            if (Math.abs(distance) > 0) {
                isDragging = true;

                // Direct 1:1 movement with the mouse - no animation or delay
                track.scrollLeft = startScrollLeft - distance;
            }

            e.preventDefault();
        });

        // Mouse up event - end drag without snapping
        document.addEventListener('mouseup', () => {
            if (mouseDown) {
                mouseDown = false;

                // If it was a drag, just update the current index
                if (isDragging) {
                    const visibleCards = getVisibleCards();
                    const cardWidth = track.offsetWidth / visibleCards;
                    const gapWidth = 32;
                    const fullCardWidth = cardWidth + gapWidth;

                    // Calculate the current index based on scroll position
                    const scrollPosition = track.scrollLeft;
                    const index = Math.floor(scrollPosition / fullCardWidth);

                    // Just update the current index without forcing a snap
                    currentIndex = index;
                    updateButtons();
                }
            }
        });

        // Mouse leave event - end drag if mouse leaves the track
        track.addEventListener('mouseleave', () => {
            if (mouseDown) {
                mouseDown = false;
            }
        });

        // Prevent click events from firing after drag
        track.addEventListener('click', (e) => {
            if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
            }
        });

        // Update on window resize
        window.addEventListener('resize', () => {
            // Reset scroll position and update buttons
            updateButtons();
        });

        // Initialize
        updateButtons();
    }
  });
  // Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Sidebar functionality
  window.openNav = function() {
      document.getElementById("mySidebar").style.width = "250px";
      document.getElementById("main").style.marginLeft = "250px";

      // Add overlay
      const overlay = document.createElement('div');
      overlay.id = 'sidebar-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
      overlay.style.zIndex = '99';
      overlay.style.display = 'block';
      document.body.appendChild(overlay);

      // Lock body scrolling when sidebar is open
      document.body.style.overflow = 'hidden';

      // Close sidebar when clicking overlay
      overlay.addEventListener('click', closeNav);
  };

  window.closeNav = function() {
      document.getElementById("mySidebar").style.width = "0";
      document.getElementById("main").style.marginLeft = "0";

      // Remove overlay
      const overlay = document.getElementById('sidebar-overlay');
      if (overlay) {
          document.body.removeChild(overlay);
      }

      // Restore body scrolling
      document.body.style.overflow = '';
  };

  // Add touch/mobile-friendly dropdown toggle
  const dropdownButtons = document.querySelectorAll('.dropbtn');

  dropdownButtons.forEach(button => {
      button.addEventListener('click', function(e) {
          // For touch devices, toggle instead of hover
          if (window.innerWidth <= 576) {
              e.preventDefault();

              // Find the associated dropdown content
              const dropdownContent = this.nextElementSibling;

              // Toggle the 'show' class
              if (dropdownContent.classList.contains('show')) {
                  dropdownContent.classList.remove('show');
              } else {
                  // Close all dropdowns first
                  document.querySelectorAll('.dropdown-content').forEach(content => {
                      content.classList.remove('show');
                  });

                  // Open this dropdown
                  dropdownContent.classList.add('show');
              }
          }
      });
  });

  // Handle window resize events
  window.addEventListener('resize', function() {
      if (window.innerWidth > 576) {
          // Remove any applied 'show' classes when returning to larger screens
          document.querySelectorAll('.dropdown-content').forEach(content => {
              content.classList.remove('show');
          });
      }
  });

  // Add accessibility support
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(dropdown => {
      const button = dropdown.querySelector('.dropbtn');
      const content = dropdown.querySelector('.dropdown-content');
      const links = content.querySelectorAll('a');

      // Add ARIA attributes
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-haspopup', 'true');
      content.setAttribute('aria-label', 'submenu');

      button.addEventListener('click', function() {
          const expanded = this.getAttribute('aria-expanded') === 'true';
          this.setAttribute('aria-expanded', !expanded);
      });

      // Allow keyboard navigation through dropdown items
      links.forEach((link, index) => {
          link.addEventListener('keydown', function(e) {
              if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  if (index < links.length - 1) {
                      links[index + 1].focus();
                  }
              } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  if (index > 0) {
                      links[index - 1].focus();
                  } else {
                      button.focus();
                  }
              } else if (e.key === 'Escape') {
                  button.focus();
                  button.setAttribute('aria-expanded', 'false');
                  content.classList.remove('show');
              }
          });
      });
  });

  // Make the hero section responsive to viewport height
  function adjustHeroHeight() {
      const hero = document.getElementById('hero');
      if (hero) {
          const windowHeight = window.innerHeight;
          const minHeight = Math.min(windowHeight * 0.7, 700); // 70% of viewport height, max 700px
          hero.style.height = `${minHeight}px`;
      }
  }

  // Run on page load and resize
  adjustHeroHeight();
  window.addEventListener('resize', adjustHeroHeight);
});




// Add form handling to all contact forms
document.querySelectorAll('#contact_form').forEach(form => {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const response = await fetch('form-process.php', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.status === 'success') {
                alert('Thank you for your message. We will get back to you soon!');
                e.target.reset();
            } else {
                alert('There was an error sending your message. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error sending your message. Please try again later.');
        }
    });
});

  document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px'
    }
  );

  // Target all major sections
  const sections = [
    document.querySelector('#hero'),
    document.querySelector('#practice-areas-section'),
    document.querySelector('#contact-form'),
    document.querySelector('.testimonials-section'),
    document.querySelector('.location-section')
  ];

  sections.forEach(section => {
    if (section) {
      section.classList.add('fade-in-section');
      observer.observe(section);
    }
  });

  // Handle practice area cards individually for staggered effect
  const practiceAreas = document.querySelectorAll('.practice-area');
  practiceAreas.forEach((area, index) => {
    area.classList.add('fade-in-section');
    area.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(area);
  });

  // Handle testimonial cards individually
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  testimonialCards.forEach((card, index) => {
    card.classList.add('fade-in-section');
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);
  });
});

function adjustTestimonialText() {
    const blockquotes = document.querySelectorAll('.testimonial-card blockquote');

    blockquotes.forEach(blockquote => {
        const content = blockquote.querySelector('.quote-content');
        if (!content) return;

        // Start with the maximum font size
        let fontSize = 0.9;
        content.style.fontSize = `${fontSize}em`;

        // Reduce font size until content fits
        while (content.scrollHeight > blockquote.clientHeight && fontSize > 0.6) {
            fontSize -= 0.05;
            content.style.fontSize = `${fontSize}em`;
        }

        // If still doesn't fit, truncate with ellipsis
        if (content.scrollHeight > blockquote.clientHeight) {
            content.style.display = '-webkit-box';
            content.style.webkitLineClamp = '8';
            content.style.webkitBoxOrient = 'vertical';
            content.style.overflow = 'hidden';
        }
    });
}

// Run on page load and window resize
document.addEventListener('DOMContentLoaded', () => {
    // Wrap existing testimonial text in a content div
    document.querySelectorAll('.testimonial-card blockquote').forEach(blockquote => {
        const text = blockquote.innerHTML;
        blockquote.innerHTML = `<div class="quote-content">${text}</div>`;
    });

    adjustTestimonialText();

    // Add debounced resize listener
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(adjustTestimonialText, 250);
    });

    // Run after carousel slide
    const track = document.querySelector('.carousel-track');
    if (track) {
        track.addEventListener('scroll', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(adjustTestimonialText, 250);
        });
    }
});
