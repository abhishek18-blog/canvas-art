
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
        import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, signInAnonymously, updateProfile, signInWithCustomToken }
            from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
        import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc }
            from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

        // Use dynamic config if available, fallback to hardcoded (safety)
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
            apiKey: "AIzaSyCX9UhQBUEpphnQipRjSnOP77iXXGVkkNA",
            authDomain: "artisans-canvas-65ced.firebaseapp.com",
            projectId: "artisans-canvas-65ced",
            storageBucket: "artisans-canvas-65ced.firebasestorage.app",
            messagingSenderId: "929975655858",
            appId: "1:929975655858:web:2a5a35852f99a3bcae58ab",
            measurementId: "G-JZQ74WYXEY"
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        const provider = new GoogleAuthProvider();

        // Define App ID globally for paths
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

        // AUTH INIT: Ensure anonymous login immediately for read access
        const initAuth = async () => {
            try {
                // Only sign in if no user is present at all
                if (!auth.currentUser) {
                    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                        try {
                            await signInWithCustomToken(auth, __initial_auth_token);
                        } catch (tokenError) {
                            console.warn("Custom token auth failed, trying anonymous:", tokenError);
                            await signInAnonymously(auth);
                        }
                    } else {
                        try {
                            await signInAnonymously(auth);
                        } catch (anonErr) {
                            console.warn("Anonymous sign-in restricted, likely waiting for user login.", anonErr);
                        }
                    }
                }
            } catch (e) {
                console.error("Auth initialization failed", e);
            }
        };
        initAuth();

        // STANDARDIZED LOGIN HANDLER
        const handleLogin = async () => {
            try {
                await signInWithPopup(auth, provider);
            } catch (error) {
                console.error("Login failed:", error);

                if (error.code === 'auth/unauthorized-domain' || error.code === 'auth/operation-not-allowed') {
                    try {
                        let user = auth.currentUser;
                        if (!user) {
                            const cred = await signInAnonymously(auth);
                            user = cred.user;
                        }

                        await updateProfile(user, {
                            displayName: "Guest Reviewer",
                            photoURL: "https://ui-avatars.com/api/?name=Guest&background=fbbf24&color=111827"
                        });

                        window.location.reload();
                    } catch (anonErr) {
                        console.error("Guest fallback failed", anonErr);
                        alert("Login failed. Please refresh and try again.");
                    }
                } else {
                    alert("Login Error: " + error.message);
                }
            }
        };

        let currentUser = null;
        let currentReviewsSnapshot = null;
        let unsubscribeReviews = null;

        const renderReviews = () => {
            const reviewsGrid = document.getElementById('reviews-grid');
            if (!reviewsGrid || !currentReviewsSnapshot) return;

            if (currentReviewsSnapshot.empty) {
                reviewsGrid.innerHTML = `<p class="col-span-full text-center text-gray-500">No reviews yet.</p>`;
                return;
            }

            reviewsGrid.innerHTML = "";

            // Client-side sorting because composite indexes are restricted
            const reviews = [];
            currentReviewsSnapshot.forEach(doc => {
                reviews.push({ id: doc.id, ...doc.data() });
            });

            // Sort desc by timestamp
            reviews.sort((a, b) => {
                const tA = a.timestamp ? a.timestamp.toMillis() : 0;
                const tB = b.timestamp ? b.timestamp.toMillis() : 0;
                return tB - tA;
            });

            reviews.forEach((data) => {
                const stars = '★'.repeat(data.rating || 5);

                let deleteBtn = "";
                if (currentUser && data.uid && currentUser.uid === data.uid) {
                    deleteBtn = `
                    <button onclick="window.deleteReview('${data.id}')" 
                        class="absolute top-3 right-3 p-2 bg-black/20 hover:bg-red-500/80 rounded-full text-gray-400 hover:text-white transition z-10" title="Delete Review">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>`;
                }

                reviewsGrid.innerHTML += `
                    <div class="bg-[#111827] p-4 rounded-lg border border-gray-700 relative group">
                        ${deleteBtn}
                        <div class="flex items-center mb-2">
                            <img src="${data.photo || 'https://via.placeholder.com/40'}" class="w-8 h-8 rounded-full mr-2 border border-gray-600">
                            <div>
                                <h4 class="text-white text-sm font-bold">${data.name || 'Anonymous'}</h4>
                                <div class="text-amber-400 text-xs tracking-widest">${stars}</div>
                            </div>
                        </div>
                        <p class="text-gray-300 text-sm italic">"${data.text}"</p>
                    </div>`;
            });
        };

        window.deleteReview = async (reviewId) => {
            if (confirm("Are you sure you want to delete this review?")) {
                try {
                    // Correct path for private user data OR public shared data. Reviews are usually public.
                    // Using public data path as per requirement.
                    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'reviews', reviewId));
                } catch (error) {
                    console.error("Delete failed", error);
                    alert("Could not delete. Check console.");
                }
            }
        };

        onAuthStateChanged(auth, (user) => {
            currentUser = user;

            // Clean up previous listener
            if (unsubscribeReviews) {
                unsubscribeReviews();
                unsubscribeReviews = null;
            }

            // Only fetch data if user is authenticated (anonymous or logged in)
            if (user) {
                const reviewsGrid = document.getElementById('reviews-grid');
                if (reviewsGrid) {
                    // CORRECT PATH: /artifacts/{appId}/public/data/reviews
                    // REMOVED orderBy() to prevent index errors
                    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'reviews'));

                    unsubscribeReviews = onSnapshot(q, (snapshot) => {
                        currentReviewsSnapshot = snapshot;
                        renderReviews();
                    }, (error) => {
                        console.error("Snapshot error:", error);
                    });
                }
            } else {
                currentReviewsSnapshot = null;
                renderReviews();
            }

            const modalForm = document.getElementById('modal-review-form');
            const modalLoginPrompt = document.getElementById('modal-login-prompt');

            const uiDesktop = document.getElementById('user-info-desktop');
            const loginDesktop = document.getElementById('login-btn-desktop');
            const loginMobile = document.getElementById('login-btn-mobile');
            const uiMobile = document.getElementById('user-info-mobile');
            const mobileName = document.getElementById('user-name-mobile');
            const mobileEmail = document.getElementById('user-email-mobile');
            const mobilePhoto = document.getElementById('user-photo-mobile');

            const isGuestOrLogged = user && (user.displayName || !user.isAnonymous);

            if (isGuestOrLogged) {
                if (modalForm) modalForm.classList.remove('hidden');
                if (modalLoginPrompt) modalLoginPrompt.classList.add('hidden');

                if (uiDesktop) {
                    uiDesktop.classList.remove('hidden');
                    uiDesktop.classList.add('flex');
                    document.getElementById('user-name-desktop').innerText = user.displayName ? user.displayName.split(' ')[0] : 'Guest';
                    document.getElementById('user-photo-desktop').src = user.photoURL;
                }
                if (loginDesktop) loginDesktop.classList.add('hidden');

                if (loginMobile) loginMobile.classList.add('hidden');
                if (uiMobile) {
                    uiMobile.classList.remove('hidden');
                    uiMobile.classList.add('flex');
                    if (mobileName) mobileName.innerText = user.displayName ? user.displayName.split(' ')[0] : 'Guest';
                    if (mobileEmail) mobileEmail.innerText = user.email || (user.isAnonymous ? 'guest@artisan.com' : 'user@example.com');
                    if (mobilePhoto) mobilePhoto.src = user.photoURL;
                }

            } else {
                if (modalForm) modalForm.classList.add('hidden');
                if (modalLoginPrompt) modalLoginPrompt.classList.remove('hidden');

                if (uiDesktop) uiDesktop.classList.add('hidden');
                if (loginDesktop) loginDesktop.classList.remove('hidden');

                if (loginMobile) loginMobile.classList.remove('hidden');
                if (uiMobile) uiMobile.classList.add('hidden');
            }
        });

        const reviewsModal = document.getElementById('reviews-modal');
        const stickyBtn = document.getElementById('sticky-review-btn');
        const navBtn = document.getElementById('nav-review-btn');
        const closeBtn = document.getElementById('close-reviews-modal');
        const navBtnMobile = document.getElementById('nav-review-btn-mobile');

        const toggleModal = (show) => {
            if (show) {
                reviewsModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            } else {
                reviewsModal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        };

        if (stickyBtn) stickyBtn.addEventListener('click', () => toggleModal(true));
        if (navBtn) navBtn.addEventListener('click', () => toggleModal(true));
        if (navBtnMobile) navBtnMobile.addEventListener('click', () => toggleModal(true));
        if (closeBtn) closeBtn.addEventListener('click', () => toggleModal(false));
        if (reviewsModal) reviewsModal.addEventListener('click', (e) => {
            if (e.target === reviewsModal) toggleModal(false);
        });

        const loginBtnDesktop = document.getElementById('login-btn-desktop');
        const logoutBtnDesktop = document.getElementById('logout-btn-desktop');
        const loginBtnMobile = document.getElementById('login-btn-mobile');
        const logoutBtnMobile = document.getElementById('logout-btn-mobile');
        const modalLoginBtn = document.getElementById('modal-login-btn');

        if (loginBtnDesktop) loginBtnDesktop.onclick = handleLogin;
        if (loginBtnMobile) loginBtnMobile.onclick = handleLogin;
        if (modalLoginBtn) modalLoginBtn.onclick = handleLogin;

        if (logoutBtnDesktop) logoutBtnDesktop.onclick = () => signOut(auth).then(() => window.location.reload());
        if (logoutBtnMobile) logoutBtnMobile.onclick = () => signOut(auth).then(() => window.location.reload());

        const reviewForm = document.getElementById('review-form');
        const starBtns = document.querySelectorAll('.star-btn');
        const ratingInput = document.getElementById('rating-input');

        starBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.getAttribute('data-value');
                if (ratingInput) ratingInput.value = val;
                starBtns.forEach(star => {
                    if (star.getAttribute('data-value') <= val) {
                        star.classList.remove('text-gray-500');
                        star.classList.add('text-amber-400');
                    } else {
                        star.classList.add('text-gray-500');
                        star.classList.remove('text-amber-400');
                    }
                });
            });
        });

        if (reviewForm) {
            reviewForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const text = document.getElementById('review-text').value;
                const rating = ratingInput ? ratingInput.value : 0;

                if (!currentUser) return alert("Please login first.");
                if (!text || rating == 0) return alert("Please add text and a rating.");

                try {
                    // CORRECT PATH: /artifacts/{appId}/public/data/reviews
                    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'reviews'), {
                        uid: currentUser.uid,
                        name: currentUser.displayName,
                        photo: currentUser.photoURL,
                        text: text,
                        rating: parseInt(rating),
                        timestamp: serverTimestamp()
                    });
                    reviewForm.reset();
                    if (ratingInput) ratingInput.value = 0;
                    starBtns.forEach(s => {
                        s.classList.add('text-gray-500');
                        s.classList.remove('text-amber-400');
                    });
                } catch (err) {
                    console.error(err);
                    alert("Error posting review.");
                }
            });
        }
    