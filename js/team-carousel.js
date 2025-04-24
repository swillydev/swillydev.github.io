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

        // Set up the carousel for mobile view
        function setupMobileCarousel() {
            if (window.innerWidth <= 768) {
                // Calculate card width including any margins/padding
                const cardWidth = teamCardsArray[0].offsetWidth;

                // Set the track width to accommodate all cards side by side
                teamCarouselTrack.style.width = `${cardWidth * teamCardsArray.length}px`;

                // Position each card side by side
                teamCardsArray.forEach((card, index) => {
                    card.style.position = 'relative';
                    card.style.left = `${index * cardWidth}px`;
                    card.style.display = 'flex';
                    card.style.opacity = '1';
                });
            } else {
                // Reset styles for desktop view
                teamCarouselTrack.style.width = '';
                teamCardsArray.forEach(card => {
                    card.style.position = '';
                    card.style.left = '';
                });
            }
        }

        // Function to slide to a specific card
        function slideToCard(index) {
            // Ensure index is within bounds
            if (index < 0) index = 0;
            if (index >= teamCardsArray.length) index = teamCardsArray.length - 1;

            // Update current index
            currentIndex = index;

            if (window.innerWidth <= 768) {
                // Calculate the scroll position
                const cardWidth = teamCardsArray[0].offsetWidth;
                const scrollPosition = currentIndex * cardWidth;

                // Scroll to the position
                teamCarouselTrack.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });

                console.log(`Sliding to card ${currentIndex + 1} of ${teamCardsArray.length}`);
            } else {
                // On desktop, just scroll to the card
                teamCardsArray[currentIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }

            // Update active card indicator
            updateActiveCard();
        }

        // Function to update which card is active
        function updateActiveCard() {
            teamCardsArray.forEach((card, index) => {
                if (index === currentIndex) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
        }

        // Initialize the carousel
        setupMobileCarousel();
        updateActiveCard();

        // Previous button click handler
        if (prevButton) {
            prevButton.addEventListener('click', function(e) {
                e.preventDefault();
                slideToCard(currentIndex - 1);
            });
        }

        // Next button click handler
        if (nextButton) {
            nextButton.addEventListener('click', function(e) {
                e.preventDefault();
                slideToCard(currentIndex + 1);
            });
        }

        // Handle window resize
        window.addEventListener('resize', function() {
            setupMobileCarousel();
            // After setup, slide to current card
            setTimeout(() => {
                slideToCard(currentIndex);
            }, 100);
        });

        // Add touch swipe functionality for mobile
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
                if (swipeDistance > 0) {
                    // Swipe left - go to next
                    slideToCard(currentIndex + 1);
                } else {
                    // Swipe right - go to previous
                    slideToCard(currentIndex - 1);
                }
            }
        }, { passive: true });

        // Handle scroll events to update current index
        teamCarouselTrack.addEventListener('scroll', function() {
            if (window.innerWidth <= 768) {
                const cardWidth = teamCardsArray[0].offsetWidth;
                const scrollPosition = teamCarouselTrack.scrollLeft;
                const newIndex = Math.round(scrollPosition / cardWidth);

                if (newIndex !== currentIndex) {
                    currentIndex = newIndex;
                    updateActiveCard();
                }
            }
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
