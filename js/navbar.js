/* ============================================================
   NAVBAR.JS — Interaktywność nawigacji
   Wywoływany przez loader.js po wstrzyknięciu navbar.html
   ============================================================ */

/**
 * Główna funkcja inicjalizująca navbar.
 * Wywoływana z loader.js po wstrzyknięciu komponentu.
 */
function initNavbar() {
    setActiveLink();
    initHamburger();
    initScrollBehavior();
}

/* --- Aktywny link (podświetlenie bieżącej strony) --- */

function setActiveLink() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.navbar__link, .navbar__mobile-link');

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        // Normalizacja: /index.html i / traktowane jako strona główna
        const isHome = (currentPath === '/' || currentPath.endsWith('/index.html'));
        const isHomeLink = (href === '/index.html' || href === '/');

        if (isHome && isHomeLink) {
            link.classList.add('active');
        } else if (!isHome && currentPath.includes(href) && href !== '/index.html') {
            link.classList.add('active');
        }
    });
}

/* --- Hamburger (mobile menu) --- */

function initHamburger() {
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });

    // Zamknij menu po kliknięciu w link mobilny
    mobileMenu.querySelectorAll('.navbar__mobile-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Zamknij menu po kliknięciu poza nim
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('open') &&
            !mobileMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    function closeMenu() {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
    }
}

/* --- Scroll behavior (cień i tło po przewinięciu) --- */

function initScrollBehavior() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Sprawdź od razu przy załadowaniu strony
}
