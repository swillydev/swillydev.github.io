// Phone number formatter for mobile view
document.addEventListener('DOMContentLoaded', function() {
    // Only run on mobile devices
    if (window.innerWidth <= 768) {
        const phoneNumbers = document.querySelectorAll('.phone-number');
        
        // Check if we have the second phone number with multiple numbers
        if (phoneNumbers.length > 1) {
            const directLineNumber = phoneNumbers[1];
            
            // Get the text content
            const text = directLineNumber.innerHTML;
            
            // Check if it contains a slash (indicating multiple numbers)
            if (text.includes('/')) {
                // Split the text at the slash
                const parts = text.split('/');
                
                // Get the prefix (24 HOUR DIRECT LINE:)
                const prefix = text.split('</em>')[0] + '</em>';
                
                // Create the new format with each number on its own line
                const newText = `${prefix} ${parts[0].trim()}<br>${prefix} ${parts[1].trim()}`;
                
                // Update the HTML
                directLineNumber.innerHTML = newText;
            }
        }
    }
});
