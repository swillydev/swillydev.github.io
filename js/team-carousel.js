// Team Carousel and Popup Functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Team carousel script loaded');

    // Team carousel functionality
    const teamCarouselTrack = document.querySelector('.team-carousel-track');
    const teamCards = document.querySelectorAll('.team-card');
    const prevButton = document.querySelector('.team-carousel-button.prev');
    const nextButton = document.querySelector('.team-carousel-button.next');

    if (teamCarouselTrack && teamCards.length > 0) {
        // Convert NodeList to Array for easier manipulation
        const teamCardsArray = Array.from(teamCards);
        let currentIndex = 0;
        let isAnimating = false; // Flag to prevent multiple animations at once

        // Function to create 3-card mobile carousel with centered active card
        function createMobileCarousel() {
            const totalCards = teamCardsArray.length;

            // Hide all cards first
            teamCardsArray.forEach(card => {
                card.style.display = 'none';
                card.style.position = 'absolute';
                card.style.left = '50%';
                card.style.transform = 'translateX(-50%)';
                card.style.transformOrigin = 'center';
                card.style.transition = 'all 0.5s ease';
                card.style.zIndex = '1';
                card.style.opacity = '0.7';
                card.classList.remove('active-card');

                // Add click event to each card
                card.onclick = null; // Remove any existing click handlers
            });

            // Calculate indices for left, center, and right cards
            // Using modulo to ensure we always wrap around at the edges
            const leftIndex = (currentIndex - 1 + totalCards) % totalCards;
            const centerIndex = currentIndex;
            const rightIndex = (currentIndex + 1) % totalCards;

            // Get the cards
            const leftCard = teamCardsArray[leftIndex];
            const centerCard = teamCardsArray[centerIndex];
            const rightCard = teamCardsArray[rightIndex];

            // Show all three cards
            leftCard.style.display = 'flex';
            centerCard.style.display = 'flex';
            rightCard.style.display = 'flex';

            // Position and style left card - further reduced offset for mobile
            leftCard.style.transform = 'translateX(calc(-50% - 70px)) rotate(-30deg)';
            leftCard.style.zIndex = '2';

            // Position and style center (active) card
            centerCard.style.transform = 'translateX(-50%) scale(1.1)';
            centerCard.style.zIndex = '3';
            centerCard.style.opacity = '1';
            centerCard.classList.add('active-card');

            // Position and style right card - further reduced offset for mobile
            rightCard.style.transform = 'translateX(calc(-50% + 70px)) rotate(30deg)';
            rightCard.style.zIndex = '2';

            // Add click handlers to side cards
            leftCard.onclick = function() {
                if (!isAnimating) {
                    navigateToCard(leftIndex);
                }
            };

            rightCard.onclick = function() {
                if (!isAnimating) {
                    navigateToCard(rightIndex);
                }
            };

            console.log(`Mobile carousel: Left=${leftIndex+1}, Center=${centerIndex+1}, Right=${rightIndex+1}`);
        }

        // Function to navigate to a specific card in mobile view
        function navigateToCard(index) {
            if (isAnimating) return;
            isAnimating = true;

            const totalCards = teamCardsArray.length;
            const oldIndex = currentIndex;

            // Ensure index wraps around using modulo
            // This creates a circular carousel that can go infinitely in either direction
            index = ((index % totalCards) + totalCards) % totalCards;

            // Determine if we're moving forward or backward
            const isMovingBackward = (oldIndex === 0 && index === totalCards - 1) ||
                                    (index < oldIndex && !(oldIndex === totalCards - 1 && index === 0));

            // Hide all cards first
            teamCardsArray.forEach(card => {
                card.style.display = 'none';
                card.style.position = 'absolute';
                card.style.left = '50%';
                card.style.transformOrigin = 'center';
                card.style.transition = 'all 0.5s ease';
                card.style.zIndex = '1';
                card.style.opacity = '0.7';
                card.classList.remove('active-card');
                card.onclick = null; // Remove any existing click handlers
            });

            // Calculate indices for left, center, and right cards
            const leftIndex = (index - 1 + totalCards) % totalCards;
            const centerIndex = index;
            const rightIndex = (index + 1) % totalCards;

            // Get the cards
            const leftCard = teamCardsArray[leftIndex];
            const centerCard = teamCardsArray[centerIndex];
            const rightCard = teamCardsArray[rightIndex];

            // Show all three cards
            leftCard.style.display = 'flex';
            centerCard.style.display = 'flex';
            rightCard.style.display = 'flex';

            // First set initial positions without transitions
            teamCardsArray.forEach(card => {
                card.style.transition = 'none';
            });

            if (isMovingBackward) {
                // Moving backward - animate from right to left
                // The card that was in center moves to right
                const oldCenterCard = teamCardsArray[oldIndex];
                oldCenterCard.style.display = 'flex';

                // Initial positions for animation - further reduced offsets for mobile
                leftCard.style.transform = 'translateX(calc(-50% - 140px)) rotate(-30deg)';
                leftCard.style.opacity = '0';

                centerCard.style.transform = 'translateX(calc(-50% - 70px)) rotate(-30deg)';
                centerCard.style.opacity = '0.7';

                oldCenterCard.style.transform = 'translateX(-50%) scale(1.1)';
                oldCenterCard.style.zIndex = '3';
                oldCenterCard.style.opacity = '1';

                rightCard.style.transform = 'translateX(calc(-50% + 70px)) rotate(30deg)';
                rightCard.style.zIndex = '2';
                rightCard.style.opacity = '0.7';

                // Force reflow to ensure initial positions are applied
                void leftCard.offsetWidth;

                // Re-enable transitions
                teamCardsArray.forEach(card => {
                    card.style.transition = 'all 0.5s ease';
                });

                // Animate to final positions - further reduced offsets for mobile
                leftCard.style.transform = 'translateX(calc(-50% - 70px)) rotate(-30deg)';
                leftCard.style.opacity = '0.7';
                leftCard.style.zIndex = '2';

                centerCard.style.transform = 'translateX(-50%) scale(1.1)';
                centerCard.style.zIndex = '3';
                centerCard.style.opacity = '1';
                centerCard.classList.add('active-card');

                oldCenterCard.style.transform = 'translateX(calc(-50% + 70px)) rotate(30deg)';
                oldCenterCard.style.zIndex = '2';
                oldCenterCard.style.opacity = '0.7';

                // Hide the old right card if it's not the new right card
                if (oldIndex !== rightIndex) {
                    setTimeout(() => {
                        const oldRightIndex = (oldIndex + 1) % totalCards;
                        if (oldRightIndex !== leftIndex && oldRightIndex !== centerIndex && oldRightIndex !== rightIndex) {
                            teamCardsArray[oldRightIndex].style.display = 'none';
                        }
                    }, 500);
                }
            } else {
                // Moving forward - animate from left to right
                const oldCenterCard = teamCardsArray[oldIndex];
                oldCenterCard.style.display = 'flex';

                // Initial positions for animation - further reduced offsets for mobile
                leftCard.style.transform = 'translateX(calc(-50% - 70px)) rotate(-30deg)';
                leftCard.style.zIndex = '2';
                leftCard.style.opacity = '0.7';

                oldCenterCard.style.transform = 'translateX(-50%) scale(1.1)';
                oldCenterCard.style.zIndex = '3';
                oldCenterCard.style.opacity = '1';

                centerCard.style.transform = 'translateX(calc(-50% + 70px)) rotate(30deg)';
                centerCard.style.opacity = '0.7';
                centerCard.style.zIndex = '2';

                rightCard.style.transform = 'translateX(calc(-50% + 140px)) rotate(30deg)';
                rightCard.style.opacity = '0';
                rightCard.style.zIndex = '1';

                // Force reflow to ensure initial positions are applied
                void rightCard.offsetWidth;

                // Re-enable transitions
                teamCardsArray.forEach(card => {
                    card.style.transition = 'all 0.5s ease';
                });

                // Animate to final positions - further reduced offsets for mobile
                leftCard.style.transform = 'translateX(calc(-50% - 70px)) rotate(-30deg)';
                leftCard.style.zIndex = '2';

                oldCenterCard.style.transform = 'translateX(calc(-50% - 70px)) rotate(-30deg)';
                oldCenterCard.style.zIndex = '2';
                oldCenterCard.style.opacity = '0.7';

                centerCard.style.transform = 'translateX(-50%) scale(1.1)';
                centerCard.style.zIndex = '3';
                centerCard.style.opacity = '1';
                centerCard.classList.add('active-card');

                rightCard.style.transform = 'translateX(calc(-50% + 70px)) rotate(30deg)';
                rightCard.style.zIndex = '2';
                rightCard.style.opacity = '0.7';

                // Hide the old left card if it's not the new left card
                if (oldIndex !== leftIndex) {
                    setTimeout(() => {
                        const oldLeftIndex = (oldIndex - 1 + totalCards) % totalCards;
                        if (oldLeftIndex !== leftIndex && oldLeftIndex !== centerIndex && oldLeftIndex !== rightIndex) {
                            teamCardsArray[oldLeftIndex].style.display = 'none';
                        }
                    }, 500);
                }
            }

            // Add click handlers to side cards
            leftCard.onclick = function() {
                if (!isAnimating) {
                    navigateToCard(leftIndex);
                }
            };

            rightCard.onclick = function() {
                if (!isAnimating) {
                    navigateToCard(rightIndex);
                }
            };

            // Update current index
            currentIndex = index;

            // Reset animation flag after transition completes
            setTimeout(() => {
                isAnimating = false;
            }, 500);

            console.log(`Navigated to card ${index + 1} of ${totalCards} (${isMovingBackward ? 'backward' : 'forward'})`);
        }

        // Function to set up desktop carousel
        function setupDesktopCarousel() {
            // Reset all card styles
            teamCardsArray.forEach(card => {
                card.style.transform = '';
                card.style.zIndex = '';
                card.style.opacity = '';
                card.style.display = '';
                card.style.position = '';
                card.style.transformOrigin = '';
                card.style.left = '';
                card.style.right = '';
                card.style.margin = '';
                card.style.transition = '';
                card.classList.remove('active-card');
                card.onclick = null; // Remove click handlers
            });

            // Show navigation buttons
            if (prevButton) prevButton.style.display = 'flex';
            if (nextButton) nextButton.style.display = 'flex';

            console.log('Desktop carousel initialized');
        }

        // Function to initialize the carousel based on viewport size
        function initCarousel() {
            if (window.innerWidth <= 768) {
                // Mobile view - create 3-card carousel
                createMobileCarousel();

                // Hide navigation buttons on mobile - use card clicks and swipe instead
                if (prevButton) {
                    prevButton.style.display = 'none';
                }

                if (nextButton) {
                    nextButton.style.display = 'none';
                }
            } else {
                // Desktop view - use original carousel
                setupDesktopCarousel();

                // Set up desktop navigation
                if (prevButton) {
                    prevButton.onclick = function(e) {
                        e.preventDefault();
                        scrollToCard(currentIndex - 1);
                    };
                }

                if (nextButton) {
                    nextButton.onclick = function(e) {
                        e.preventDefault();
                        scrollToCard(currentIndex + 1);
                    };
                }
            }
        }

        // Function to scroll to a specific card (for desktop view)
        function scrollToCard(index) {
            const totalCards = teamCardsArray.length;

            // For desktop, we don't wrap around but stop at the edges
            if (index < 0) index = 0;
            if (index >= totalCards) index = totalCards - 1;

            // Update current index
            currentIndex = index;

            // Scroll to the card
            teamCardsArray[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });

            console.log(`Scrolling to card ${index + 1} of ${totalCards}`);
        }

        // Initialize the carousel
        initCarousel();

        // Add touch swipe functionality
        let touchStartX = 0;
        let touchEndX = 0;

        teamCarouselTrack.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        teamCarouselTrack.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;

            // Determine swipe direction
            const swipeDistance = touchStartX - touchEndX;

            // Only process significant swipes
            if (Math.abs(swipeDistance) > 50) {
                if (window.innerWidth <= 768) {
                    // Mobile view
                    if (swipeDistance > 0) {
                        // Swipe left - go to next
                        navigateToCard(currentIndex + 1);
                    } else {
                        // Swipe right - go to previous
                        navigateToCard(currentIndex - 1);
                    }
                } else {
                    // Desktop view
                    if (swipeDistance > 0) {
                        // Swipe left - go to next
                        scrollToCard(currentIndex + 1);
                    } else {
                        // Swipe right - go to previous
                        scrollToCard(currentIndex - 1);
                    }
                }
            }
        }, { passive: true });

        // Handle window resize
        window.addEventListener('resize', function() {
            // Reinitialize carousel on resize
            initCarousel();
        });
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
                quote: "Estate planning is about protecting your family's future and ensuring your wishes are respected.",
                bio: "Emma Williams brings a compassionate approach to wills and probate matters, helping clients navigate what can be a difficult and emotional process. With 8 years of experience in estate planning, Emma provides clear and practical advice on wills, trusts, powers of attorney, and estate administration. She takes the time to understand each client's unique circumstances and family dynamics to create tailored solutions that protect their assets and provide for their loved ones. Emma is particularly skilled at handling complex estates and contentious probate matters."
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
