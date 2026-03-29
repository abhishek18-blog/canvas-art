
        // Initialize Lucide Icons
        lucide.createIcons();

        document.addEventListener('DOMContentLoaded', () => {

            // ==========================================
            // 0. THEME TOGGLE LOGIC - PROPER IMPLEMENTATION
            // ==========================================
            
            // Initialize theme from localStorage or system preference
            function initializeTheme() {
                const savedTheme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                
                // Default to light mode, but respect saved preference
                const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark;
                
                if (!shouldBeDark) {
                    document.body.classList.add('light-mode');
                    localStorage.setItem('theme', 'light');
                } else {
                    document.body.classList.remove('light-mode');
                    localStorage.setItem('theme', 'dark');
                }
                updateThemeIcons();
            }
            
            // Update icon visibility and accessibility
            function updateThemeIcons() {
                const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
                const isDarkMode = !document.body.classList.contains('light-mode');
                
                toggleBtns.forEach(btn => {
                    const sun = btn.querySelector('.light-icon');
                    const moon = btn.querySelector('.dark-icon');
                    
                    if (sun && moon) {
                        if (isDarkMode) {
                            // In dark mode, sun is active
                            sun.style.opacity = '1';
                            sun.style.transform = 'scale(1) rotate(0deg)';
                            moon.style.opacity = '0.4';
                            moon.style.transform = 'scale(0.8)';
                            btn.setAttribute('aria-label', 'Switch to Light Mode');
                        } else {
                            // In light mode, moon is active
                            moon.style.opacity = '1';
                            moon.style.transform = 'scale(1) rotate(0deg)';
                            sun.style.opacity = '0.4';
                            sun.style.transform = 'scale(0.8)';
                            btn.setAttribute('aria-label', 'Switch to Dark Mode');
                        }
                    }
                });
            }
            
            // Initialize theme on page load
            initializeTheme();
            
            // Setup theme toggle buttons
            const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
            toggleBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Toggle the light-mode class
                    const isNowLight = document.body.classList.toggle('light-mode');
                    
                    // Save preference
                    localStorage.setItem('theme', isNowLight ? 'light' : 'dark');
                    
                    // Update all icon states
                    updateThemeIcons();
                    
                    // Add a subtle animation effect
                    btn.style.transform = 'scale(0.95) rotate(-20deg)';
                    setTimeout(() => {
                        btn.style.transform = '';
                    }, 300);
                });
                
                // Keyboard support (Enter/Space)
                btn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        btn.click();
                    }
                });
            });
            
            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    if (e.matches) {
                        document.body.classList.remove('light-mode');
                    } else {
                        document.body.classList.add('light-mode');
                    }
                    updateThemeIcons();
                }
            });

            // ==========================================
            // 1. MOBILE MENU LOGIC
            // ==========================================
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');

            if (mobileMenuButton && mobileMenu) {
                // Toggle Menu Open/Close
                mobileMenuButton.addEventListener('click', () => {
                    const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
                    mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
                    mobileMenu.style.display = isExpanded ? 'none' : 'block';
                });

                // Close Menu when clicking ANY Link OR Button inside it
                const mobileLinks = mobileMenu.querySelectorAll('a, button');
                mobileLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        // Don't close if it's the login button (let auth handler handle it)
                        // allowing the user to see the change to "Logout"
                        if (link.id !== 'login-btn-mobile') {
                            mobileMenu.style.display = 'none';
                            mobileMenuButton.setAttribute('aria-expanded', 'false');
                        }
                    });
                });
            }

            // ==========================================
            // 2. FULLSCREEN IMAGE MODAL LOGIC
            // ==========================================
            const modal = document.getElementById('image-modal');
            const modalImg = document.getElementById('modal-image');
            const closeModal = document.getElementById('close-modal');

            // Select all images inside product cards, featured projects and the hero image
            const zoomableImages = document.querySelectorAll('.product-card img, .featured-card img, #home img.object-cover');

            zoomableImages.forEach(img => {
                img.addEventListener('click', function (e) {
                    if (modal && modalImg) {
                        modalImg.src = this.src;
                        modal.classList.remove('hidden');
                        modal.classList.add('flex');
                        document.body.style.overflow = 'hidden';
                    }
                });
            });

            const hideModal = () => {
                if (modal) {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                    document.body.style.overflow = 'auto';
                }
            };

            if (closeModal) closeModal.addEventListener('click', hideModal);
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) hideModal();
                });
            }

            // ==========================================
            // 3. PAYMENT MODAL LOGIC
            // ==========================================
            const paymentModal = document.getElementById('payment-modal');
            const closePaymentBtn = document.getElementById('close-payment-modal');
            const paymentTriggers = document.querySelectorAll('.payment-trigger');

            const showPayment = (e) => {
                if (e) e.preventDefault();
                if (paymentModal) {
                    paymentModal.classList.remove('hidden');
                    paymentModal.classList.add('flex');
                    document.body.style.overflow = 'hidden';
                }
            };

            const hidePayment = () => {
                if (paymentModal) {
                    paymentModal.classList.add('hidden');
                    paymentModal.classList.remove('flex');
                    document.body.style.overflow = 'auto';
                }
            };

            // Attach to all payment buttons
            paymentTriggers.forEach(btn => btn.addEventListener('click', showPayment));

            if (closePaymentBtn) closePaymentBtn.addEventListener('click', hidePayment);
            if (paymentModal) {
                paymentModal.addEventListener('click', (e) => {
                    if (e.target === paymentModal) hidePayment();
                });
            }

            // ==========================================
            // 4. CATEGORY FILTER LOGIC
            // ==========================================
            const filterButtons = document.querySelectorAll('.filter-btn');
            const categorySections = {
                'mandala': document.getElementById('mandala'),
                'bottle': document.getElementById('bottle'),
                'embroidery': document.getElementById('embroidery'),
                'warli': document.getElementById('warli'),
                'giftcards': document.getElementById('giftcards'),
                'lippan': document.getElementById('lippan'),
                'frames': document.getElementById('frames'),
            };

            function setActiveButton(filterValue) {
                filterButtons.forEach(btn => {
                    if (btn.getAttribute('data-filter') === filterValue) {
                        btn.classList.remove('bg-gray-800', 'text-gray-300');
                        btn.classList.add('bg-amber-500', 'text-gray-900', 'shadow-lg', 'shadow-amber-500/50');
                    } else {
                        btn.classList.add('bg-gray-800', 'text-gray-300');
                        btn.classList.remove('bg-amber-500', 'text-gray-900', 'shadow-lg', 'shadow-amber-500/50');
                    }
                });
            }

            const searchInput = document.getElementById('art-search');

            function updateVisibility() {
                const term = searchInput ? searchInput.value.toLowerCase().trim() : '';
                const activeFilterBtn = document.querySelector('.filter-btn.bg-amber-500');
                const activeFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

                for (const [key, section] of Object.entries(categorySections)) {
                    if (!section) continue;
                    
                    let hasVisibleCards = false;
                    // Some featured sections outside might not use .product-card exactly, but all our defined galleries do.
                    const cards = section.querySelectorAll('.product-card');

                    cards.forEach(card => {
                        const text = card.innerText.toLowerCase();
                        if (term === '' || text.includes(term)) {
                            card.style.display = '';
                            hasVisibleCards = true;
                        } else {
                            card.style.display = 'none';
                        }
                    });

                    // Check if it belongs to current filter
                    if ((activeFilter !== 'all' && activeFilter !== key) || !hasVisibleCards) {
                        section.classList.add('hidden');
                    } else {
                        section.classList.remove('hidden');
                        if (!searchInput || !searchInput.value) {
                             section.animate([
                                { opacity: 0, transform: 'translateY(20px)' },
                                { opacity: 1, transform: 'translateY(0)' }
                             ], { duration: 300, fill: 'forwards' });
                        }
                    }
                }
            }

            filterButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const filterValue = btn.getAttribute('data-filter');
                    setActiveButton(filterValue);
                    updateVisibility();
                });
            });

            if (searchInput) {
                searchInput.addEventListener('input', () => {
                    updateVisibility();
                });
            }

            // Handle links from any anchors to auto-filter if needed
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    const href = this.getAttribute('href');
                    if (href.length > 1) {
                        const targetId = href.substring(1);
                        if (categorySections[targetId]) {
                            setActiveButton(targetId);
                            updateVisibility();
                        }
                    }
                });
            });

            // Global Escape Key to close ANY modal
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    hideModal();   // Image Modal
                    hidePayment(); // Payment Modal
                }
            });

        });
    