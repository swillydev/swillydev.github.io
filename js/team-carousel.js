// Team Carousel and Popup Functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Team carousel script loaded');

    // Function to check if element is in viewport with more tolerance
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const tolerance = 50; // Add some tolerance to consider partially visible elements
        return (
            rect.left >= -tolerance &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) + tolerance &&
            rect.top >= -tolerance &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + tolerance
        );
    }
    // Team carousel scroll functionality
    const teamCarouselTrack = document.querySelector('.team-carousel-track');
    const teamCards = document.querySelectorAll('.team-card');
    const prevButton = document.querySelector('.team-carousel-button.prev');
    const nextButton = document.querySelector('.team-carousel-button.next');

    if (teamCarouselTrack && teamCards.length > 0) {
        // Function to calculate card width based on viewport
        function calculateCardWidth() {
            // Determine how many cards to show based on viewport width
            let cardsToShow = 3; // Default for desktop

            if (window.innerWidth <= 768) {
                cardsToShow = 1; // Show 1 card on mobile
            } else if (window.innerWidth <= 1024) {
                cardsToShow = 2; // Show 2 cards on tablet
            }

            // Calculate card width including gap
            // We want to scroll exactly one card at a time
            return teamCarouselTrack.offsetWidth / Math.min(cardsToShow, teamCards.length);
        }

        // Initial calculation
        let cardWidth = calculateCardWidth();

        // Recalculate on window resize
        window.addEventListener('resize', () => {
            cardWidth = calculateCardWidth();
        });

        // Function to update card visibility based on viewport
        function updateCardVisibility() {
            console.log('Updating card visibility');
            let visibleCardFound = false;

            teamCards.forEach((card, index) => {
                if (isInViewport(card)) {
                    console.log(`Card ${index + 1} is in viewport`);
                    card.classList.add('in-view');
                    visibleCardFound = true;
                } else {
                    // Only remove in-view class if we're not on mobile
                    if (window.innerWidth > 768 || visibleCardFound) {
                        card.classList.remove('in-view');
                    }
                }
            });

            // If no cards are visible (especially on mobile), make the first one visible
            if (!visibleCardFound && teamCards.length > 0) {
                console.log('No visible cards found, making first card visible');
                teamCards[0].classList.add('in-view');
            }
        }

        // Set initial visibility
        updateCardVisibility();

        // Make first card visible by default
        if (teamCards.length > 0) {
            console.log('Making first card visible by default');
            teamCards[0].classList.add('in-view');
            // Ensure it's actually visible in the DOM
            teamCards[0].style.opacity = '1';
            teamCards[0].style.display = 'block';
        }

        // Scroll to next/previous card
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                teamCarouselTrack.scrollBy({
                    left: -cardWidth,
                    behavior: 'smooth'
                });

                // Update card visibility after scrolling
                setTimeout(updateCardVisibility, 500);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                teamCarouselTrack.scrollBy({
                    left: cardWidth,
                    behavior: 'smooth'
                });

                // Update card visibility after scrolling
                setTimeout(updateCardVisibility, 500);
            });
        }

        // Update card visibility on scroll
        teamCarouselTrack.addEventListener('scroll', () => {
            updateCardVisibility();
        });

        // Add touch swipe functionality for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        let isSwiping = false;

        teamCarouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            isSwiping = true;
        }, { passive: true });

        teamCarouselTrack.addEventListener('touchmove', (e) => {
            if (isSwiping) {
                // Prevent page scrolling while swiping the carousel
                if (Math.abs(e.changedTouches[0].screenX - touchStartX) > 10) {
                    e.preventDefault();
                }
            }
        }, { passive: false });

        teamCarouselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            isSwiping = false;
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50; // Minimum distance to register as a swipe
            const swipeDistance = Math.abs(touchStartX - touchEndX);

            // Only process significant swipes
            if (swipeDistance > swipeThreshold) {
                if (touchStartX - touchEndX > 0) {
                    // Swipe left - go to next
                    teamCarouselTrack.scrollBy({
                        left: cardWidth,
                        behavior: 'smooth'
                    });
                    console.log('Swiped left - showing next card');

                    // Update card visibility after swiping
                    setTimeout(updateCardVisibility, 500);
                } else {
                    // Swipe right - go to previous
                    teamCarouselTrack.scrollBy({
                        left: -cardWidth,
                        behavior: 'smooth'
                    });
                    console.log('Swiped right - showing previous card');

                    // Update card visibility after swiping
                    setTimeout(updateCardVisibility, 500);
                }
            }
        }
    }

    // Team member popup functionality
    const seeMoreButtons = document.querySelectorAll('.see-more-btn');
    const teamPopupOverlay = document.querySelector('.team-popup-overlay');
    const teamPopupClose = document.querySelector('.team-popup-close');

    if (seeMoreButtons.length > 0 && teamPopupOverlay) {
        // Open popup when clicking "See More" button
        seeMoreButtons.forEach(button => {
            button.addEventListener('click', function() {
                console.log('See More button clicked for', this.getAttribute('data-member-id'));
                // Get team member data from data attributes
                const teamMemberId = this.getAttribute('data-member-id');
                const teamMemberData = getTeamMemberData(teamMemberId);

                if (teamMemberData) {
                    populateTeamPopup(teamMemberData);
                    console.log('Adding active class to popup overlay');
                    teamPopupOverlay.classList.add('active');
                    console.log('Popup overlay classes after adding active:', teamPopupOverlay.classList);
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                }
            });
        });

        // Close popup when clicking the close button
        if (teamPopupClose) {
            teamPopupClose.addEventListener('click', function() {
                teamPopupOverlay.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            });
        }

        // Close popup when clicking outside the content
        teamPopupOverlay.addEventListener('click', function(e) {
            if (e.target === teamPopupOverlay) {
                teamPopupOverlay.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }

    // Function to get team member data by ID
    function getTeamMemberData(memberId) {
        // This would typically come from an API or database
        // For now, we'll use a static object with team member data
        const teamMembers = {
            'member1': {
                id: 'member1',
                name: 'Natasha Wilson',
                title: 'Senior Partner',
                area: 'Criminal Law',
                email: 'natasha@haleys-solicitors.co.uk',
                phone: '0121 285 3211',
                image: '/images/lady.jpg',
                quote: 'Justice is not just about the law, but about how we apply it to protect the rights of every individual.',
                bio: 'Natasha Wilson is a highly experienced criminal law solicitor with over 15 years of experience in handling complex criminal cases. She has successfully represented clients in high-profile cases and has a reputation for her meticulous attention to detail and passionate advocacy. Natasha specializes in serious crime, fraud, and regulatory offenses. She is known for her ability to build strong relationships with clients and provide clear, practical advice during difficult times.'
            },
            'member2': {
                id: 'member2',
                name: 'James Thompson',
                title: 'Partner',
                area: 'Immigration Law',
                email: 'james@haleys-solicitors.co.uk',
                phone: '0121 285 3212',
                image: '/images/man.png',
                quote: 'Immigration law is about helping people build new lives and contribute to our society.',
                bio: 'James Thompson has specialized in immigration law for over 10 years, helping individuals and families navigate the complex UK immigration system. He has extensive experience in all aspects of immigration, including asylum applications, appeals, and judicial reviews. James is particularly passionate about family reunification cases and has helped countless families stay together despite challenging circumstances. His clients appreciate his empathetic approach and his ability to explain complex legal matters in simple terms.'
            },
            'member3': {
                id: 'member3',
                name: 'Sarah Johnson',
                title: 'Associate Solicitor',
                area: 'Road Traffic Cases',
                email: 'sarah@haleys-solicitors.co.uk',
                phone: '0121 285 3213',
                image: '/images/girl2.svg',
                quote: 'Every traffic case deserves a thorough defense, regardless of how minor it may seem.',
                bio: 'Sarah Johnson is a dedicated road traffic solicitor who has helped hundreds of clients retain their driving licenses and fight unfair penalties. With a background in both criminal and civil litigation, Sarah brings a unique perspective to traffic law cases. She has a remarkable success rate in challenging speeding tickets, defending drink driving allegations, and representing clients in careless driving cases. Sarah is known for her strategic approach and her ability to identify procedural errors that can lead to case dismissals.'
            },
            'member4': {
                id: 'member4',
                name: 'Michael Chen',
                title: 'Senior Solicitor',
                area: 'Criminal Appeals',
                email: 'michael@haleys-solicitors.co.uk',
                phone: '0121 285 3214',
                image: '/images/man2.webp',
                quote: 'Appeals are about ensuring justice was truly served, not just procedurally followed.',
                bio: 'Michael Chen specializes in criminal appeals and has successfully overturned numerous convictions throughout his 12-year career. His analytical mind and thorough research skills make him particularly effective in identifying grounds for appeal that others might miss. Michael has appeared before the Court of Appeal on numerous occasions and has developed a reputation for his persuasive written and oral advocacy. He is passionate about correcting miscarriages of justice and has been involved in several high-profile appeal cases that have resulted in changes to legal precedent.'
            },
            'member5': {
                id: 'member5',
                name: 'Emma Williams',
                title: 'Solicitor',
                area: 'Wills and Probate',
                email: 'emma@haleys-solicitors.co.uk',
                phone: '0121 285 3215',
                image: '/images/girl3.webp',
                quote: 'Estate planning is about protecting your family's future and ensuring your wishes are respected.',
                bio: 'Emma Williams brings a compassionate approach to wills and probate matters, helping clients navigate what can be a difficult and emotional process. With 8 years of experience in estate planning, Emma provides clear and practical advice on wills, trusts, powers of attorney, and estate administration. She takes the time to understand each client's unique circumstances and family dynamics to create tailored solutions that protect their assets and provide for their loved ones. Emma is particularly skilled at handling complex estates and contentious probate matters.'
            }
        };

        return teamMembers[memberId];
    }

    // Function to populate the team popup with member data
    function populateTeamPopup(memberData) {
        const popupName = document.querySelector('.team-popup-name');
        const popupTitle = document.querySelector('.team-popup-title');
        const popupArea = document.querySelector('.team-popup-area');
        const popupEmail = document.querySelector('.team-popup-email');
        const popupPhone = document.querySelector('.team-popup-phone');
        const popupImage = document.querySelector('.team-popup-image img');
        const popupQuote = document.querySelector('.team-popup-quote');
        const popupBio = document.querySelector('.team-popup-bio');

        if (popupName) popupName.textContent = memberData.name;
        if (popupTitle) popupTitle.textContent = memberData.title;
        if (popupArea) popupArea.textContent = memberData.area;
        if (popupEmail) popupEmail.textContent = memberData.email;
        if (popupPhone) popupPhone.textContent = memberData.phone;
        if (popupImage) popupImage.src = memberData.image;
        if (popupQuote) popupQuote.textContent = memberData.quote;
        if (popupBio) popupBio.textContent = memberData.bio;
    }
});
