/* ============================================================
   RESULTS-CAROUSEL.JS — Biblioteka rozwiązań (case studies)
   Przewijany tor + kropki (aktywny slajd) + strzałki prev/next.
   Samodzielny: jeśli sekcji nie ma na stronie, kończy bez błędu.
   ============================================================ */

(function () {
    function initResultsCarousel() {
        const root = document.querySelector('.results');
        if (!root) return;

        const track = root.querySelector('.results__track');
        const cards = Array.from(root.querySelectorAll('.results-card'));
        const dotsWrap = root.querySelector('.results__dots');
        const prevBtn = root.querySelector('.results__arrow--prev');
        const nextBtn = root.querySelector('.results__arrow--next');

        if (!track || cards.length === 0) return;

        // --- Generuj kropki na podstawie liczby kart ---
        const dots = cards.map(function (_, i) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'results__dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Pokaż wdrożenie ' + (i + 1));
            dot.addEventListener('click', function () {
                scrollToIndex(i);
            });
            if (dotsWrap) dotsWrap.appendChild(dot);
            return dot;
        });

        function cardStep() {
            // Szerokość karty + odstęp (gap) między kartami
            if (cards.length < 2) return cards[0].offsetWidth;
            return cards[1].offsetLeft - cards[0].offsetLeft;
        }

        function currentIndex() {
            const step = cardStep() || 1;
            return Math.round(track.scrollLeft / step);
        }

        function scrollToIndex(i) {
            const clamped = Math.max(0, Math.min(cards.length - 1, i));
            track.scrollTo({ left: clamped * cardStep(), behavior: 'smooth' });
        }

        function update() {
            const idx = currentIndex();
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === idx);
            });
            if (prevBtn) prevBtn.disabled = idx <= 0;
            if (nextBtn) nextBtn.disabled = idx >= cards.length - 1;
        }

        // --- Nawigacja strzałkami ---
        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                scrollToIndex(currentIndex() - 1);
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                scrollToIndex(currentIndex() + 1);
            });
        }

        // --- Synchronizacja kropek przy przewijaniu (debounce przez rAF) ---
        let ticking = false;
        track.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                update();
                ticking = false;
            });
        });

        window.addEventListener('resize', update);
        update();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initResultsCarousel);
    } else {
        initResultsCarousel();
    }
})();
