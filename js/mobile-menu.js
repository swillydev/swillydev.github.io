// Check if we're on a mobile device
const isMobile = () => window.innerWidth <= 768;

// Direct toggle function for the always-visible-dropdown
function toggleAlwaysVisibleDropdown() {
    console.log('toggleAlwaysVisibleDropdown called');
    const alwaysVisibleDropdown = document.getElementById('alwaysVisibleDropdown');
    
    if (alwaysVisibleDropdown) {
        if (alwaysVisibleDropdown.classList.contains('hidden')) {
            // Show dropdown
            alwaysVisibleDropdown.classList.remove('hidden');
            console.log('Dropdown shown');
        } else {
            // Hide dropdown with animation
            // Hide all dropdown content first
            const dropdownContent = alwaysVisibleDropdown.querySelector('.dropdown-content.show');
            const dropdownToggle = alwaysVisibleDropdown.querySelector('.dropdown-toggle.active');

            if (dropdownContent) {
                dropdownContent.classList.remove('show');
            }

            if (dropdownToggle) {
                dropdownToggle.classList.remove('active');
            }

            // Add a class to hide the dropdown with animation
            alwaysVisibleDropdown.classList.add('hiding');

            // After animation completes, hide the dropdown
            setTimeout(function() {
                alwaysVisibleDropdown.classList.remove('hiding');
                alwaysVisibleDropdown.classList.add('hidden');
            }, 300);
            
            console.log('Dropdown hidden');
        }
    } else {
        console.error('alwaysVisibleDropdown not found');
    }
}

function openNav() {
    console.log('openNav called, isMobile:', isMobile());

    if (isMobile()) {
        // Mobile behavior - show the always visible dropdown
        const alwaysVisibleDropdown = document.getElementById('alwaysVisibleDropdown');
        if (alwaysVisibleDropdown) {
            // Only show if it's currently hidden
            if (alwaysVisibleDropdown.classList.contains('hidden')) {
                alwaysVisibleDropdown.classList.remove('hidden');
            } else {
                // If it's already visible, toggle it closed
                toggleAlwaysVisibleDropdown();
            }
        }
    } else {
        // Desktop behavior - side panel
        const sidebar = document.getElementById("mySidebar");
        const overlay = document.getElementById("sidebar-overlay");

        console.log('Desktop elements:', sidebar, overlay);

        sidebar.style.width = "250px";
        overlay.classList.add("show");
        document.body.style.backgroundColor = "rgba(0,0,0,0.4)";

        console.log('Sidebar opened');
    }
}

function closeNav() {
    console.log('closeNav called');

    if (isMobile()) {
        // Mobile behavior - hide the always visible dropdown
        const alwaysVisibleDropdown = document.getElementById('alwaysVisibleDropdown');

        if (alwaysVisibleDropdown && !alwaysVisibleDropdown.classList.contains('hidden')) {
            // Hide all dropdown content first
            const dropdownContent = alwaysVisibleDropdown.querySelector('.dropdown-content.show');
            const dropdownToggle = alwaysVisibleDropdown.querySelector('.dropdown-toggle.active');

            if (dropdownContent) {
                dropdownContent.classList.remove('show');
            }

            if (dropdownToggle) {
                dropdownToggle.classList.remove('active');
            }

            // Add a class to hide the dropdown with animation
            alwaysVisibleDropdown.classList.add('hiding');

            // After animation completes, hide the dropdown
            setTimeout(function() {
                alwaysVisibleDropdown.classList.remove('hiding');
                alwaysVisibleDropdown.classList.add('hidden');
            }, 300);
        }
    } else {
        // Desktop behavior
        const sidebar = document.getElementById("mySidebar");
        const overlay = document.getElementById("sidebar-overlay");

        sidebar.style.width = "0";
        overlay.classList.remove("show");
        document.body.style.backgroundColor = "white";

        console.log('Sidebar closed');
    }
}

// Initialize mobile menu functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Handle always visible dropdown toggle as a tab
    const practiceAreasToggle = document.getElementById('practiceAreasToggle');
    const practiceAreasDropdown = document.getElementById('practiceAreasDropdown');

    if (practiceAreasToggle && practiceAreasDropdown) {
        // Function to toggle dropdown
        function toggleDropdown(e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('Toggle dropdown called');

            // Toggle active state for tab-like appearance
            practiceAreasToggle.classList.toggle('active');

            // Toggle content visibility with animation
            if (practiceAreasDropdown.classList.contains('show')) {
                // If it's open, start closing animation
                practiceAreasDropdown.style.maxHeight = '0px';

                // Remove show class after animation completes
                setTimeout(function() {
                    practiceAreasDropdown.classList.remove('show');
                }, 300);
            } else {
                // If it's closed, show it first then animate
                practiceAreasDropdown.classList.add('show');

                // Set max height for animation
                practiceAreasDropdown.style.maxHeight = practiceAreasDropdown.scrollHeight + 'px';
            }
        }

        // Add click event
        practiceAreasToggle.addEventListener('click', toggleDropdown);

        // Add touch events specifically for mobile
        practiceAreasToggle.addEventListener('touchstart', function(e) {
            // Just prevent default to avoid double-firing
            e.preventDefault();
        });

        practiceAreasToggle.addEventListener('touchend', toggleDropdown);
    }

    // Add event listener to the menu toggle button - multiple approaches for redundancy
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        console.log('Menu toggle found:', menuToggle);

        // Method 1: Direct click and touch handlers for better mobile support
        ['click', 'touchstart'].forEach(function(eventType) {
            menuToggle.addEventListener(eventType, function(e) {
                console.log('Menu toggle ' + eventType + ' via event listener');
                e.preventDefault();
                openNav();
            });
        });

        // Method 2: Direct click and touch handlers for the image
        const toggleImg = document.getElementById('toggle');
        if (toggleImg) {
            ['click', 'touchstart'].forEach(function(eventType) {
                toggleImg.addEventListener(eventType, function(e) {
                    console.log('Toggle image ' + eventType);
                    e.preventDefault();
                    e.stopPropagation();
                    openNav();
                });
            });
        }
    }

    // Handle mobile dropdown toggles
    const mobileDropdownToggles = document.querySelectorAll('.mobile-menu-dropdown-toggle');
    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            // Toggle active class
            this.classList.toggle('active');

            // Get the dropdown content
            const dropdownContent = this.nextElementSibling;

            // Toggle show class
            dropdownContent.classList.toggle('show');
        });
    });

    // Close navigation when clicking outside
    document.addEventListener('click', function(event) {
        if (isMobile()) {
            // Close dropdown when clicking outside
            if (!event.target.matches('.dropdown-toggle') &&
                !event.target.closest('.dropdown-content') &&
                !event.target.closest('#practiceAreasToggle') &&
                !event.target.closest('.always-visible-dropdown')) {
                const practiceAreasDropdown = document.getElementById('practiceAreasDropdown');
                const practiceAreasToggle = document.getElementById('practiceAreasToggle');

                if (practiceAreasDropdown && practiceAreasDropdown.classList.contains('show')) {
                    // Start closing animation
                    practiceAreasDropdown.style.maxHeight = '0px';

                    // Remove active state from toggle
                    if (practiceAreasToggle) {
                        practiceAreasToggle.classList.remove('active');
                    }

                    // Remove show class after animation completes
                    setTimeout(function() {
                        practiceAreasDropdown.classList.remove('show');
                    }, 300);
                }
            }

            // Close the entire dropdown menu when clicking outside
            if (!event.target.matches('#toggle') &&
                !event.target.matches('.openbtn') &&
                !event.target.closest('.always-visible-dropdown') &&
                !event.target.closest('#menuToggle')) {
                const alwaysVisibleDropdown = document.getElementById('alwaysVisibleDropdown');

                if (alwaysVisibleDropdown && !alwaysVisibleDropdown.classList.contains('hidden')) {
                    // Hide all dropdown content first
                    const dropdownContent = alwaysVisibleDropdown.querySelector('.dropdown-content.show');
                    const dropdownToggle = alwaysVisibleDropdown.querySelector('.dropdown-toggle.active');

                    if (dropdownContent) {
                        dropdownContent.classList.remove('show');
                    }

                    if (dropdownToggle) {
                        dropdownToggle.classList.remove('active');
                    }

                    // Add a class to hide the dropdown with animation
                    alwaysVisibleDropdown.classList.add('hiding');

                    // After animation completes, hide the dropdown
                    setTimeout(function() {
                        alwaysVisibleDropdown.classList.remove('hiding');
                        alwaysVisibleDropdown.classList.add('hidden');
                    }, 300);
                }
            }

            // Show the dropdown when clicking the toggle button
            if (event.target.matches('#toggle') || event.target.matches('.openbtn') || event.target.closest('#menuToggle')) {
                const alwaysVisibleDropdown = document.getElementById('alwaysVisibleDropdown');

                if (alwaysVisibleDropdown && window.innerWidth <= 768) {
                    alwaysVisibleDropdown.classList.remove('hidden');
                }
            }
        }
    });

    // Also add touch event for better mobile support
    document.addEventListener('touchend', function(event) {
        if (isMobile()) {
            // Close dropdown when touching outside
            if (!event.target.matches('.dropdown-toggle') &&
                !event.target.closest('.dropdown-content') &&
                !event.target.closest('#practiceAreasToggle') &&
                !event.target.closest('.always-visible-dropdown')) {
                const practiceAreasDropdown = document.getElementById('practiceAreasDropdown');
                const practiceAreasToggle = document.getElementById('practiceAreasToggle');

                if (practiceAreasDropdown && practiceAreasDropdown.classList.contains('show')) {
                    // Start closing animation
                    practiceAreasDropdown.style.maxHeight = '0px';

                    // Remove active state from toggle
                    if (practiceAreasToggle) {
                        practiceAreasToggle.classList.remove('active');
                    }

                    // Remove show class after animation completes
                    setTimeout(function() {
                        practiceAreasDropdown.classList.remove('show');
                    }, 300);
                }
            }

            // Close the entire dropdown menu when touching outside
            if (!event.target.matches('#toggle') &&
                !event.target.matches('.openbtn') &&
                !event.target.closest('.always-visible-dropdown') &&
                !event.target.closest('#menuToggle')) {
                const alwaysVisibleDropdown = document.getElementById('alwaysVisibleDropdown');

                if (alwaysVisibleDropdown && !alwaysVisibleDropdown.classList.contains('hidden')) {
                    // Hide all dropdown content first
                    const dropdownContent = alwaysVisibleDropdown.querySelector('.dropdown-content.show');
                    const dropdownToggle = alwaysVisibleDropdown.querySelector('.dropdown-toggle.active');

                    if (dropdownContent) {
                        dropdownContent.classList.remove('show');
                    }

                    if (dropdownToggle) {
                        dropdownToggle.classList.remove('active');
                    }

                    // Add a class to hide the dropdown with animation
                    alwaysVisibleDropdown.classList.add('hiding');

                    // After animation completes, hide the dropdown
                    setTimeout(function() {
                        alwaysVisibleDropdown.classList.remove('hiding');
                        alwaysVisibleDropdown.classList.add('hidden');
                    }, 300);
                }
            }

            // Show the dropdown when touching the toggle button
            if (event.target.matches('#toggle') || event.target.matches('.openbtn') || event.target.closest('#menuToggle')) {
                const alwaysVisibleDropdown = document.getElementById('alwaysVisibleDropdown');

                if (alwaysVisibleDropdown && window.innerWidth <= 768) {
                    alwaysVisibleDropdown.classList.remove('hidden');
                }
            }
        }
    });

    // Handle overlay clicks
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeNav);
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    // Close sidebar when switching between mobile and desktop views
    closeNav();
});
