document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       1. CUSTOM CURSOR
    ============================================================ */
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let rafId  = null;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (dot) {
            dot.style.left = mouseX + 'px';
            dot.style.top  = mouseY + 'px';
        }
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        if (ring) {
            ring.style.left = ringX + 'px';
            ring.style.top  = ringY + 'px';
        }
        rafId = requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect
    const hoverTargets = document.querySelectorAll('a, button, .proj-card, .about-kpi, .atag, .pf-btn');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => ring && ring.classList.add('hovering'));
        el.addEventListener('mouseleave', () => ring && ring.classList.remove('hovering'));
    });

    /* ============================================================
       2. PARTICLE CANVAS
    ============================================================ */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, particles = [];
        const COUNT = 70;
        const CONNECT_DIST = 110;
        const COLORS = ['rgba(249,115,22,', 'rgba(251,146,60,', 'rgba(255,255,255,'];

        function resize() {
            W = canvas.width  = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        }

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x  = Math.random() * W;
                this.y  = Math.random() * H;
                this.vx = (Math.random() - 0.5) * 0.35;
                this.vy = (Math.random() - 0.5) * 0.35;
                this.r  = Math.random() * 1.5 + 0.5;
                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
                this.alpha = Math.random() * 0.4 + 0.15;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > W) this.vx *= -1;
                if (this.y < 0 || this.y > H) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.alpha + ')';
                ctx.fill();
            }
        }

        function init() {
            particles = Array.from({ length: COUNT }, () => new Particle());
        }

        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECT_DIST) {
                        const alpha = (1 - dist / CONNECT_DIST) * 0.14;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(249,115,22,${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function loop() {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => { p.update(); p.draw(); });
            drawLines();
            requestAnimationFrame(loop);
        }

        resize();
        init();
        loop();
        window.addEventListener('resize', () => { resize(); init(); });
    }

    /* ============================================================
       3. NAVBAR SCROLL
    ============================================================ */
    const navbar = document.getElementById('navbar');
    function handleNavbarScroll() {
        if (window.scrollY > 30) {
            navbar && navbar.classList.add('scrolled');
        } else {
            navbar && navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    /* ============================================================
       4. MOBILE HAMBURGER
    ============================================================ */
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    hamburger && hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu && mobileMenu.classList.toggle('open');
    });

    document.querySelectorAll('.mob-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger && hamburger.classList.remove('open');
            mobileMenu && mobileMenu.classList.remove('open');
        });
    });

    /* ============================================================
       5. SCROLL SPY NAV
    ============================================================ */
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-link');

    function updateNavSpy() {
        const scrollY = window.pageYOffset;
        sections.forEach(sec => {
            const top    = sec.offsetTop - 100;
            const bottom = top + sec.offsetHeight;
            const id     = sec.getAttribute('id');
            if (scrollY >= top && scrollY < bottom) {
                navLinks.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-link[data-section="${id}"]`);
                active && active.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', updateNavSpy, { passive: true });
    updateNavSpy();

    /* ============================================================
       6. TYPEWRITER EFFECT
    ============================================================ */
    const typeEl = document.getElementById('typewriter-word');
    const words  = ['Scale.', 'Convert.', 'Delight.', 'Perform.', 'Inspire.'];
    let wIdx = 0, cIdx = 0, deleting = false;

    function typeLoop() {
        if (!typeEl) return;
        const word = words[wIdx];
        if (!deleting) {
            typeEl.textContent = word.slice(0, ++cIdx);
            if (cIdx === word.length) {
                deleting = true;
                setTimeout(typeLoop, 1800);
                return;
            }
        } else {
            typeEl.textContent = word.slice(0, --cIdx);
            if (cIdx === 0) {
                deleting = false;
                wIdx = (wIdx + 1) % words.length;
            }
        }
        setTimeout(typeLoop, deleting ? 55 : 90);
    }
    setTimeout(typeLoop, 1200);

    /* ============================================================
       7. COUNT-UP ANIMATION
    ============================================================ */
    function countUp(el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        if (!target) return;
        const duration = 1400;
        const startTime = performance.now();
        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(ease * target);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    const countEls = document.querySelectorAll('[data-count]');
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                countUp(e.target);
                countObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.4 });
    countEls.forEach(el => countObserver.observe(el));

    /* ============================================================
       8. SCROLL REVEAL
    ============================================================ */
    const revealEls = document.querySelectorAll('.reveal-up');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                revealObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));

    /* ============================================================
       9. SKILL BAR ANIMATION
    ============================================================ */
    const skillFills = document.querySelectorAll('.skill-fill');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const w = e.target.getAttribute('data-width');
                e.target.style.width = w + '%';
                skillObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.3 });
    skillFills.forEach(el => skillObserver.observe(el));

    /* ============================================================
       10. PROJECT FILTER
    ============================================================ */
    const filterBtns = document.querySelectorAll('.pf-btn');
    const projCards  = document.querySelectorAll('.proj-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            projCards.forEach(card => {
                const cat = card.getAttribute('data-category');
                const show = filter === 'all' || cat === filter;
                card.style.display = show ? 'flex' : 'none';
                if (show) {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = '';
                    }, 30);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                }
            });
            // Reset rail scroll
            const rail = document.getElementById('projects-rail');
            if (rail) rail.scrollLeft = 0;
            updateRailDots();
        });
    });

    /* ============================================================
       10b. PROJECT CATEGORY TABS (ALL / MOBILE / WEB)
    ============================================================ */
    const tabBtns = document.querySelectorAll('.proj-tab-btn');
    const mobileShowcase = document.getElementById('mobile-apps-container');
    const webShowcase = document.getElementById('web-apps-container');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const target = btn.getAttribute('data-tab');

            if (target === 'all') {
                if (mobileShowcase) mobileShowcase.style.display = 'block';
                if (webShowcase) webShowcase.style.display = 'block';
            } else if (target === 'mobile') {
                if (mobileShowcase) mobileShowcase.style.display = 'block';
                if (webShowcase) webShowcase.style.display = 'none';
            } else if (target === 'web') {
                if (mobileShowcase) mobileShowcase.style.display = 'none';
                if (webShowcase) webShowcase.style.display = 'block';
            }
        });
    });

    /* ============================================================
       11. PROJECTS RAIL NAVIGATION
    ============================================================ */
    const rail = document.getElementById('projects-rail');
    const prevBtn = document.getElementById('rail-prev');
    const nextBtn = document.getElementById('rail-next');
    const dots    = document.querySelectorAll('.rdot');

    function updateRailDots() {
        if (!rail || !dots.length) return;
        const cardW    = 340 + 24; // card width + gap
        const idx      = Math.round(rail.scrollLeft / cardW);
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    prevBtn && prevBtn.addEventListener('click', () => {
        if (rail) rail.scrollBy({ left: -360, behavior: 'smooth' });
    });
    nextBtn && nextBtn.addEventListener('click', () => {
        if (rail) rail.scrollBy({ left: 360, behavior: 'smooth' });
    });

    rail && rail.addEventListener('scroll', updateRailDots, { passive: true });

    // Dot click
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            if (rail) rail.scrollTo({ left: i * (340 + 24), behavior: 'smooth' });
        });
    });

    /* ============================================================
       12. HERO VISUAL PARALLAX
    ============================================================ */
    const heroVisual = document.getElementById('hero-visual');
    window.addEventListener('scroll', () => {
        if (!heroVisual) return;
        const scrollY = window.pageYOffset;
        heroVisual.style.transform = `translateY(${scrollY * 0.08}px)`;
    }, { passive: true });

    /* ============================================================
       13. CONTACT FORM — AJAX via Formspree
    ============================================================ */
    const form       = document.getElementById('contact-form');
    const submitBtn  = document.getElementById('form-submit-btn');
    const btnText    = document.getElementById('btn-text');
    const btnIcon    = document.getElementById('btn-icon');

    // Create feedback message element
    const feedbackEl = document.createElement('div');
    feedbackEl.id = 'form-feedback';
    feedbackEl.style.cssText = `
        margin-top: 1rem;
        padding: 0.85rem 1.2rem;
        border-radius: 10px;
        font-size: 0.95rem;
        font-weight: 500;
        display: none;
        align-items: center;
        gap: 0.5rem;
    `;
    form && form.appendChild(feedbackEl);

    form && form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Stop default page redirect

        // Set loading state
        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Sending...';
        if (btnIcon) btnIcon.className = 'ri-loader-4-line spin-icon';
        feedbackEl.style.display = 'none';

        try {
            const data = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            const json = await response.json().catch(() => ({}));
            const isSuccess = response.ok && json.success !== 'false' && json.success !== false;

            if (isSuccess) {
                // ✅ Success
                feedbackEl.style.display = 'flex';
                feedbackEl.style.background = 'rgba(52, 211, 153, 0.12)';
                feedbackEl.style.border = '1px solid rgba(52, 211, 153, 0.35)';
                feedbackEl.style.color = '#34d399';
                feedbackEl.innerHTML = '<i class="ri-checkbox-circle-fill"></i> Message sent! I\'ll get back to you soon.';
                form.reset();
                if (btnText) btnText.textContent = 'Message Sent!';
                if (btnIcon) btnIcon.className = 'ri-checkbox-circle-fill';
                submitBtn.style.background = 'linear-gradient(135deg, #34d399, #059669)';
                // Reset button after 5 seconds
                setTimeout(() => {
                    if (submitBtn) submitBtn.disabled = false;
                    if (btnText) btnText.textContent = 'Send Message';
                    if (btnIcon) btnIcon.className = 'ri-send-plane-fill';
                    submitBtn.style.background = '';
                }, 5000);
            } else {
                // ❌ Form error response
                const msg = json.message || (json.errors ? json.errors.map(e => e.message).join(', ') : 'Something went wrong. Please email me directly.');
                feedbackEl.style.display = 'flex';
                feedbackEl.style.background = 'rgba(248, 113, 113, 0.12)';
                feedbackEl.style.border = '1px solid rgba(248, 113, 113, 0.35)';
                feedbackEl.style.color = '#f87171';
                feedbackEl.innerHTML = `<i class="ri-error-warning-fill"></i> ${msg}`;
                if (submitBtn) submitBtn.disabled = false;
                if (btnText) btnText.textContent = 'Send Message';
                if (btnIcon) btnIcon.className = 'ri-send-plane-fill';
            }
        } catch (err) {
            // ❌ Network error
            feedbackEl.style.display = 'flex';
            feedbackEl.style.background = 'rgba(248, 113, 113, 0.12)';
            feedbackEl.style.border = '1px solid rgba(248, 113, 113, 0.35)';
            feedbackEl.style.color = '#f87171';
            feedbackEl.innerHTML = '<i class="ri-wifi-off-fill"></i> Network error. Please try again or email me directly.';
            if (submitBtn) submitBtn.disabled = false;
            if (btnText) btnText.textContent = 'Send Message';
            if (btnIcon) btnIcon.className = 'ri-send-plane-fill';
        }
    });

    /* ============================================================
       14. HERO TILT on mouse move
    ============================================================ */
    const heroSection = document.getElementById('home');
    heroSection && heroSection.addEventListener('mousemove', (e) => {
        if (!heroVisual) return;
        const rect = heroSection.getBoundingClientRect();
        const cx   = rect.width / 2;
        const cy   = rect.height / 2;
        const dx   = (e.clientX - rect.left - cx) / cx;
        const dy   = (e.clientY - rect.top  - cy) / cy;
        heroVisual.style.transform = `perspective(900px) rotateX(${-dy * 4}deg) rotateY(${dx * 5}deg)`;
    });
    heroSection && heroSection.addEventListener('mouseleave', () => {
        if (heroVisual) {
            heroVisual.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
        }
    });

    /* ============================================================
       15. 3D CARD TILT on project cards
    ============================================================ */
    const tiltCards = document.querySelectorAll('.proj-card, .about-kpi');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const dx = (e.clientX - rect.left - cx) / cx;
            const dy = (e.clientY - rect.top  - cy) / cy;
            card.style.transform = `perspective(600px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) translateY(-4px)`;
            // Move glow toward cursor
            const glow = card.querySelector('.proj-card-glow');
            if (glow) {
                glow.style.left = `${((e.clientX - rect.left) / rect.width) * 100 - 40}%`;
                glow.style.top  = `${((e.clientY - rect.top)  / rect.height) * 100 - 40}%`;
            }
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* ============================================================
       16. SHOWCASE IMAGE micro-parallax on scroll
    ============================================================ */
    const showcaseImgs = document.querySelectorAll('.showcase-img-wrap');
    window.addEventListener('scroll', () => {
        showcaseImgs.forEach(img => {
            const rect = img.getBoundingClientRect();
            const viewH = window.innerHeight;
            if (rect.bottom < 0 || rect.top > viewH) return;
            const progress = (viewH - rect.top) / (viewH + rect.height);
            const offset = (progress - 0.5) * 30;
            img.style.transform = `translateY(${offset}px)`;
        });
    }, { passive: true });

    /* ============================================================
       17. FLOATING BACK-TO-TOP BUTTON
    ============================================================ */
    const btt = document.createElement('button');
    btt.id = 'back-to-top';
    btt.setAttribute('aria-label', 'Back to top');
    btt.innerHTML = '<i class="ri-arrow-up-line"></i>';
    document.body.appendChild(btt);

    window.addEventListener('scroll', () => {
        btt.classList.toggle('btt-visible', window.scrollY > 600);
    }, { passive: true });

    btt.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ============================================================
       18. ACTIVE SHOWCASE ITEM highlight on scroll
    ============================================================ */
    const showcaseItems = document.querySelectorAll('.showcase-item');
    const showcaseObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('showcase-active');
            } else {
                e.target.classList.remove('showcase-active');
            }
        });
    }, { threshold: 0.3 });
    showcaseItems.forEach(item => showcaseObserver.observe(item));

    /* ============================================================
       19. VALARPAY IMAGE SLIDER
    ============================================================ */
    const sliderImgs = document.querySelectorAll('#valarpay-slider .slider-img');
    const sliderDots = document.querySelectorAll('#valarpay-slider .slider-dot');
    let currentSlide = 0;

    function goToSlide(idx) {
        sliderImgs[currentSlide].classList.remove('slider-img-active');
        sliderDots[currentSlide].classList.remove('active');
        currentSlide = idx % sliderImgs.length;
        sliderImgs[currentSlide].classList.add('slider-img-active');
        sliderDots[currentSlide].classList.add('active');
    }

    if (sliderImgs.length > 1) {
        setInterval(() => goToSlide(currentSlide + 1), 3000);
    }

    sliderDots.forEach((dot, i) => {
        dot.addEventListener('click', () => goToSlide(i));
    });

    /* ============================================================
       20. BRANTRO IMAGE SLIDER
    ============================================================ */
    const brantroImgs = document.querySelectorAll('#brantro-slider .slider-img');
    const brantroDots = document.querySelectorAll('#brantro-slider .slider-dot');
    let brantroSlide = 0;

    function gotoBrantroSlide(idx) {
        brantroImgs[brantroSlide].classList.remove('slider-img-active');
        brantroDots[brantroSlide].classList.remove('active');
        brantroSlide = idx % brantroImgs.length;
        brantroImgs[brantroSlide].classList.add('slider-img-active');
        brantroDots[brantroSlide].classList.add('active');
    }

    if (brantroImgs.length > 1) {
        setInterval(() => gotoBrantroSlide(brantroSlide + 1), 3500);
    }

    brantroDots.forEach((dot, i) => {
        dot.addEventListener('click', () => gotoBrantroSlide(i));
    });

    /* ============================================================
       21. UBI IMAGE SLIDER
    ============================================================ */
    const ubiImgs = document.querySelectorAll('#ubi-slider .slider-img');
    const ubiDots = document.querySelectorAll('#ubi-slider .slider-dot');
    let ubiSlide = 0;

    function gotoUbiSlide(idx) {
        ubiImgs[ubiSlide].classList.remove('slider-img-active');
        ubiDots[ubiSlide].classList.remove('active');
        ubiSlide = idx % ubiImgs.length;
        ubiImgs[ubiSlide].classList.add('slider-img-active');
        ubiDots[ubiSlide].classList.add('active');
    }

    if (ubiImgs.length > 1) {
        setInterval(() => gotoUbiSlide(ubiSlide + 1), 4000);
    }

    ubiDots.forEach((dot, i) => {
        dot.addEventListener('click', () => gotoUbiSlide(i));
    });

});
