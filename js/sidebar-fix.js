// Fix for desktop sidebar to show over navbars and take 30% of viewport width
document.addEventListener('DOMContentLoaded', function() {
    // Remove any inline scripts that define openNav and closeNav functions
    // This prevents conflicts with our overridden functions
    const scripts = document.querySelectorAll('script:not([src])');
    scripts.forEach(script => {
        if (script.textContent.includes('function openNav()') ||
            script.textContent.includes('function closeNav()')) {
            // Don't actually remove the script, just note that we found it
            console.log('Found inline navigation script');
        }
    });
    // Override the openNav function for desktop
    window.originalOpenNav = window.openNav;

    window.openNav = function() {
        // Check if we're on mobile
        if (window.innerWidth <= 768) {
            // Use original mobile behavior
            if (typeof window.originalOpenNav === 'function') {
                window.originalOpenNav();
            } else if (typeof window.toggleMobileMenu === 'function') {
                window.toggleMobileMenu();
            }
        } else {
            // Desktop behavior - side panel with 30% width
            const sidebar = document.getElementById("mySidebar");
            const overlay = document.getElementById("sidebar-overlay");

            if (sidebar) {
                sidebar.style.width = "30vw"; // 30% of viewport width
                sidebar.style.minWidth = "300px"; // Ensure minimum width for content

                // Update any click handlers that check for sidebar width
                document.querySelectorAll('.sidebar').forEach(sb => {
                    sb.setAttribute('data-width', '30vw');
                });

                if (overlay) {
                    overlay.classList.add("show");
                }

                // Add overlay to body
                document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
            }
        }
    };

    // Update the check for sidebar width in click handlers
    const updateClickHandlers = function() {
        const clickHandlers = document.querySelectorAll('[onclick*="closeNav()"]');
        clickHandlers.forEach(handler => {
            handler.setAttribute('onclick', 'closeNav()');
        });

        // Update event listeners that check for sidebar width
        document.querySelectorAll('.sidebar').forEach(sidebar => {
            if (sidebar) {
                // Create a MutationObserver to watch for style changes
                const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.attributeName === 'style') {
                            // Update any references to "250px" in the DOM
                            document.querySelectorAll('[data-sidebar-width]').forEach(el => {
                                el.setAttribute('data-sidebar-width', sidebar.style.width);
                            });

                            // Update any click handlers that check for specific width
                            const scripts = document.querySelectorAll('script');
                            scripts.forEach(script => {
                                if (script.textContent.includes('sidebar.style.width === "250px"')) {
                                    // We can't modify script content directly, but we can add a global variable
                                    window.sidebarWidth = sidebar.style.width;
                                }
                            });
                        }
                    });
                });

                // Start observing
                observer.observe(sidebar, { attributes: true });
            }
        });
    };

    // Call the update function
    updateClickHandlers();

    // Add the sidebar overlay if it doesn't exist
    if (!document.getElementById('sidebar-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'sidebar-overlay';
        overlay.className = 'sidebar-overlay';
        overlay.addEventListener('click', closeNav);
        document.body.appendChild(overlay);
    }

    // Override click handlers that check for sidebar width
    const originalDocumentAddEventListener = document.addEventListener;
    document.addEventListener = function(type, listener, options) {
        if (type === 'click' || type === 'touchstart') {
            const wrappedListener = function(event) {
                // Set a global variable for the sidebar width
                if (document.getElementById('mySidebar')) {
                    window.sidebarWidth = document.getElementById('mySidebar').style.width;
                }
                return listener.apply(this, arguments);
            };
            return originalDocumentAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalDocumentAddEventListener.call(this, type, listener, options);
    };

    // Override the closeNav function to ensure it works properly
    window.originalCloseNav = window.closeNav;

    window.closeNav = function() {
        console.log('Global closeNav called');
        // Check if we're on mobile
        if (window.innerWidth <= 768) {
            // Use original mobile behavior
            if (typeof window.originalCloseNav === 'function') {
                window.originalCloseNav();
            } else {
                const mobileMenu = document.getElementById("mobileMenu");
                const mobileOverlay = document.getElementById("mobileOverlay");

                if (mobileMenu && mobileMenu.classList.contains("open")) {
                    mobileMenu.classList.remove("open");
                    if (mobileOverlay) mobileOverlay.classList.remove("show");
                    document.body.style.overflow = "";
                }
            }
        } else {
            // Desktop behavior
            const sidebar = document.getElementById("mySidebar");
            const overlay = document.getElementById("sidebar-overlay");

            if (sidebar) {
                // Force width to 0 to ensure it's closed
                sidebar.style.width = "0";
                sidebar.style.minWidth = "0";

                // Remove any classes that might keep it open
                sidebar.classList.remove('open');

                // Hide the overlay
                if (overlay) {
                    overlay.classList.remove("show");
                    overlay.style.display = "none";
                }

                // Reset body background
                document.body.style.backgroundColor = "white";

                console.log('Sidebar closed with width:', sidebar.style.width);
            }
        }

        // Also check for any other sidebar elements that might be open
        document.querySelectorAll('.sidebar').forEach(sidebar => {
            if (sidebar && sidebar.style.width && sidebar.style.width !== "0" && sidebar.style.width !== "0px") {
                sidebar.style.width = "0";
                sidebar.style.minWidth = "0";
                console.log('Additional sidebar closed');
            }
        });
    };

    // Fix click outside detection for all pages
    const handleOutsideClick = function(event) {
        if (!window.isMobile || !window.isMobile()) {
            // Desktop behavior
            const sidebar = document.getElementById('mySidebar');
            const toggleBtn = document.querySelector('.openbtn');
            const overlay = document.getElementById('sidebar-overlay');

            // Check if sidebar is open (any width greater than 0)
            const isSidebarOpen = sidebar && sidebar.style.width &&
                                 (sidebar.style.width !== "0px" && sidebar.style.width !== "0") &&
                                 (parseFloat(sidebar.style.width) > 0 || sidebar.style.width.includes('vw'));

            console.log('Sidebar width:', sidebar ? sidebar.style.width : 'no sidebar', 'Is open:', isSidebarOpen);

            if (isSidebarOpen &&
                !sidebar.contains(event.target) &&
                event.target !== toggleBtn &&
                (!toggleBtn || !toggleBtn.contains(event.target))) {
                console.log('Closing sidebar from click outside');
                closeNav();
            }

            // Also close when clicking on the overlay
            if (overlay && event.target === overlay) {
                console.log('Closing sidebar from overlay click');
                closeNav();
            }
        }
    };

    // Add both click and touch event listeners
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    // Style the sidebar overlay
    const style = document.createElement('style');
    style.textContent = `
        /* Ensure sidebar is above all other elements */
        .sidebar {
            z-index: 9999 !important; /* Higher z-index to show over navbars */
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            height: 100% !important;
        }

        .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9998; /* Just below the sidebar */
            display: none;
            cursor: pointer; /* Show pointer cursor to indicate clickable */
        }

        .sidebar-overlay.show {
            display: block;
        }

        /* Update sidebar close button */
        .sidebar .closebtn {
            position: absolute;
            top: 0;
            right: 25px;
            font-size: 36px;
            margin-left: 50px;
            color: white;
            text-decoration: none;
            z-index: 10000; /* Above the sidebar */
            cursor: pointer; /* Show pointer cursor to indicate clickable */
        }
    `;
    document.head.appendChild(style);

    // Make sure all sidebar overlays have click handlers
    document.querySelectorAll('.sidebar-overlay').forEach(overlay => {
        overlay.addEventListener('click', closeNav);
    });

    // Ensure sidebar is closed when the page loads
    const sidebar = document.getElementById('mySidebar');
    if (sidebar) {
        sidebar.style.width = "0";
        sidebar.style.minWidth = "0";
        console.log('Sidebar closed on page load');
    }

    // Add a global click handler to close any open sidebars
    window.closeSidebar = function() {
        closeNav();
    };

    // Add a keyboard shortcut (Escape key) to close the sidebar
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeNav();
        }
    });
});
