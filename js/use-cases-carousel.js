/* ============================================================
   USE-CASES-CAROUSEL.JS — Karuzela scenariuszy "przed i po"
   Używa CSS scroll-snap + JS do nawigacji strzałkami i kropkami
   ============================================================ */

function initUseCasesCarousel() {
    const track = document.querySelector('.use-cases__track');
    if (!track) return;

    const cards   = Array.from(track.querySelectorAll('.use-case-card'));
    const btnPrev = document.querySelector('.use-cases__nav--prev');
    const btnNext = document.querySelector('.use-cases__nav--next');
    const dots    = Array.from(document.querySelectorAll('.use-cases__dot'));
    const total   = cards.length;
    let current   = 0;

    function goTo(index) {
        current = Math.max(0, Math.min(index, total - 1));
        track.scrollTo({ left: current * track.clientWidth, behavior: 'smooth' });
        syncUI();
    }

    function syncUI() {
        dots.forEach((dot, i) => {
            dot.classList.toggle('use-cases__dot--active', i === current);
            dot.setAttribute('aria-current', i === current ? 'true' : 'false');
        });
        if (btnPrev) btnPrev.disabled = current === 0;
        if (btnNext) btnNext.disabled = current === total - 1;
    }

    // Strzałki
    btnPrev?.addEventListener('click', () => goTo(current - 1));
    btnNext?.addEventListener('click', () => goTo(current + 1));

    // Kropki
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // Synchronizacja po scroll (touch-swipe i natywny scroll)
    let scrollTimer;
    track.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            const index = Math.round(track.scrollLeft / track.clientWidth);
            if (index !== current) {
                current = index;
                syncUI();
            }
        }, 80);
    }, { passive: true });

    // Klawiatura: strzałki lewo/prawo gdy karuzela ma focus
    track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
    });

    syncUI();
}

document.addEventListener('DOMContentLoaded', initUseCasesCarousel);
