/* ============================================================
   COUNTER.JS — Animacja „liczenia od 0" dla paska zbiorczych liczb
   Odpala się, gdy element wjedzie w widok (IntersectionObserver).
   Cel czyta z data-target; jednostka (+ / %) jest osobnym spanem
   i pozostaje statyczna. Szanuje prefers-reduced-motion.
   ============================================================ */

(function () {
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function animateCount(el, target, duration) {
        const start = performance.now();
        function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            el.textContent = Math.round(target * easeOutCubic(p)).toString();
            if (p < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = target.toString();
            }
        }
        requestAnimationFrame(tick);
    }

    function init() {
        const nums = Array.prototype.slice.call(
            document.querySelectorAll('.stats-band__num')
        );
        if (!nums.length) return;

        // Zapamiętaj cel (z data-target lub z tekstu)
        nums.forEach(function (el) {
            if (!el.dataset.target) el.dataset.target = el.textContent.trim();
        });

        const reduce =
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Brak animacji: pokaż finalne liczby od razu
        if (reduce || !('IntersectionObserver' in window)) {
            nums.forEach(function (el) {
                el.textContent = el.dataset.target;
            });
            return;
        }

        // Start od zera, animuj po wejściu w widok
        nums.forEach(function (el) {
            el.textContent = '0';
        });

        const observer = new IntersectionObserver(
            function (entries, obs) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    animateCount(el, parseInt(el.dataset.target, 10) || 0, 1600);
                    obs.unobserve(el);
                });
            },
            { threshold: 0.4 }
        );

        nums.forEach(function (el) {
            observer.observe(el);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
