/* ============================================================
   ANIMATIONS.JS — Animacje przy przewijaniu strony
   Używa Intersection Observer API (bez bibliotek zewnętrznych)
   ============================================================ */

/**
 * Elementy z klasą [data-animate] otrzymują klasę "visible"
 * w momencie, gdy wchodzą w viewport.
 */

function initAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    if (!elements.length) return;

    // Respektuj preferencje dostępności (redukcja ruchu)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        elements.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver(onIntersect, {
        threshold: 0.12,
        rootMargin: '0px 0px -48px 0px'
    });

    elements.forEach(el => {
        const delay = el.dataset.delay || 0;
        el.style.transitionDelay = `${delay}ms`;
        observer.observe(el);
    });
}

function onIntersect(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animacja jednorazowa
    });
}

/* --- Efekt Typewriter (Maszyna do pisania) --- */
function initTypewriter() {
    const elements = document.querySelectorAll('.typewriter');
    elements.forEach(el => {
        const text = el.getAttribute('data-text');
        if (!text) return;
        
        const words = JSON.parse(text);
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                el.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                el.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 1500; // Pauza na końcu słowa
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        type();
    });
}

/* --- Globalne klasy CSS dla animacji --- */
(function injectAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        [data-animate] {
            opacity: 0;
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        [data-animate="fade-up"]    { transform: translateY(24px); }
        [data-animate="fade-in"]    { transform: none; }
        [data-animate="slide-left"] { transform: translateX(-24px); }
        [data-animate="slide-right"]{ transform: translateX(24px); }

        [data-animate].visible {
            opacity: 1;
            transform: none;
        }

        .typewriter::after {
            content: '|';
            animation: blink 0.7s infinite;
            margin-left: 2px;
            color: var(--color-primary);
        }

        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
})();

/* --- Uruchomienie --- */
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initTypewriter();
});
