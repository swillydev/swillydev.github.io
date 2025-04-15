// Function to highlight the current page in the sidebar navigation
document.addEventListener('DOMContentLoaded', function() {
    // Get the current page URL
    const currentPage = window.location.pathname;
    
    // Get all sidebar navigation links
    const sidebarLinks = document.querySelectorAll('.sidebar ul li a');
    
    // Loop through all links and check if they match the current page
    sidebarLinks.forEach(link => {
        // Get the href attribute
        const href = link.getAttribute('href');
        
        // Check if the href matches the current page
        if (href) {
            // Convert both to lowercase for case-insensitive comparison
            const hrefPath = href.toLowerCase();
            const currentPageLower = currentPage.toLowerCase();
            
            // Check if the current page ends with the href (handles both relative and absolute paths)
            if (currentPageLower.endsWith(hrefPath) || 
                (hrefPath === 'index.html' && (currentPageLower === '/' || currentPageLower.endsWith('/html/')))) {
                // Add active class to the parent li element
                link.parentElement.classList.add('active');
            } else {
                // Remove active class if it exists
                link.parentElement.classList.remove('active');
            }
        }
    });
    
    // Special handling for dropdown items
    const dropdownLinks = document.querySelectorAll('.dropdown-content a');
    
    dropdownLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if (href) {
            const hrefPath = href.toLowerCase();
            const currentPageLower = currentPage.toLowerCase();
            
            if (currentPageLower.endsWith(hrefPath)) {
                // If a dropdown link is active, also mark its parent dropdown as active
                const dropdownParent = link.closest('.dropdown').parentElement;
                if (dropdownParent) {
                    dropdownParent.classList.add('active');
                }
            }
        }
    });
});
