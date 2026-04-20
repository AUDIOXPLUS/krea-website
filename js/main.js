/* ============================================
   KREA Audio — Main JS (Multi-page)
   ============================================ */

(function () {
    'use strict';

    // --- Language ---
    let currentLang = localStorage.getItem('krea-lang') || 'en';

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('krea-lang', lang);
        document.documentElement.lang = lang;

        document.querySelectorAll('.lang-option').forEach(el => {
            el.classList.toggle('active', el.dataset.lang === lang);
        });

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = translations[lang]?.[key];
            if (text) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else {
                    el.textContent = text;
                }
            }
        });
    }

    // Init language
    setLanguage(currentLang);

    document.querySelectorAll('.lang-option').forEach(el => {
        el.addEventListener('click', () => setLanguage(el.dataset.lang));
    });

    // --- Hamburger menu ---
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Scroll animations ---
    const animElements = document.querySelectorAll('.anim-fade');

    if ('IntersectionObserver' in window && animElements.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const siblings = entry.target.parentElement.querySelectorAll('.anim-fade');
                    let idx = Array.from(siblings).indexOf(entry.target);
                    entry.target.style.transitionDelay = (idx * 0.12) + 's';
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' });

        animElements.forEach(el => observer.observe(el));

        // Fallback
        setTimeout(() => {
            animElements.forEach(el => {
                if (!el.classList.contains('visible')) el.classList.add('visible');
            });
        }, 2500);
    }

    // --- Modals ---
    const overlay = document.getElementById('modalOverlay');
    if (overlay) {
        document.querySelectorAll('[data-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = document.getElementById(btn.dataset.modal);
                if (modal) {
                    overlay.classList.add('active');
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        function closeModal() {
            overlay.classList.remove('active');
            overlay.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
            document.body.style.overflow = '';
        }

        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
        document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', closeModal));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    }

    // --- Gallery infinite scroll ---
    const strip = document.querySelector('.gallery-strip');
    if (strip) {
        strip.innerHTML += strip.innerHTML;
    }

    // --- Contact form ---
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.form-submit');
            const originalText = btn.textContent;
            btn.textContent = currentLang === 'it' ? 'Invio in corso...' : 'Sending...';
            btn.disabled = true;
            btn.style.opacity = '0.6';

            fetch(form.action, {
                method: 'POST',
                body: new FormData(form)
            })
            .then(r => r.json())
            .then(data => {
                if (data.status === 'ok') {
                    btn.textContent = currentLang === 'it' ? 'Grazie! Ti contatteremo personalmente.' : 'Thank you! We will contact you personally.';
                    form.reset();
                } else {
                    btn.textContent = currentLang === 'it' ? 'Errore. Riprova.' : 'Error. Please retry.';
                }
            })
            .catch(() => {
                btn.textContent = currentLang === 'it' ? 'Errore. Riprova.' : 'Error. Please retry.';
            })
            .finally(() => {
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.opacity = '1';
                }, 4000);
            });
        });
    }

})();
