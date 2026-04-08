/* ============================================================
   LOADER.JS — Dynamiczne ładowanie globalnych komponentów
   Wstrzykuje navbar.html i footer.html na każdej podstronie.
   Zmiana komponentu w jednym miejscu = globalna zmiana.
   ============================================================ */

/**
 * Ładuje plik HTML i wstrzykuje go do wskazanego elementu.
 * @param {string} url       - Ścieżka do pliku komponentu
 * @param {string} elementId - ID elementu-kontenera w DOM
 */
async function loadComponent(url, elementId) {
    const container = document.getElementById(elementId);
    if (!container) return;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Nie można załadować: ${url}`);
        const html = await response.text();
        container.innerHTML = html;
    } catch (error) {
        console.warn('[loader.js]', error.message);
    }
}

/**
 * Inicjalizacja — ładuje navbar i footer, potem uruchamia
 * zależne moduły (navbar.js musi działać po wstrzyknięciu HTML).
 */
async function initComponents() {
    const isBookingPage = document.body.dataset.page === 'konsultacja';

    // Ładujemy navbar globalny
    await loadComponent('/components/navbar.html', 'navbar-placeholder');
    
    // Jeśli to strona konsultacji — dodajemy klasę wariantu jasnego
    if (isBookingPage) {
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.classList.add('navbar--light');
    }

    // Uruchom logikę navbar dopiero po wstrzyknięciu HTML
    if (typeof initNavbar === 'function') initNavbar();

    await loadComponent('/components/footer.html', 'footer-placeholder');
}

// Uruchom po załadowaniu DOM
document.addEventListener('DOMContentLoaded', initComponents);
