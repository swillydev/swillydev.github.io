// Case animations for notable cases page
document.addEventListener('DOMContentLoaded', function() {
    // Get all case cards
    const caseCards = document.querySelectorAll('.case-card');
    
    // Function to check if an element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 && 
            rect.bottom >= 0
        );
    }
    
    // Function to add animation class when element is in viewport
    function animateOnScroll() {
        caseCards.forEach(card => {
            if (isInViewport(card) && !card.classList.contains('animate')) {
                card.classList.add('animate');
            }
        });
    }
    
    // Run once on page load to animate elements already in view
    animateOnScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);
});
