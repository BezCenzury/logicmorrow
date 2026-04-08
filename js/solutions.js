/* ============================================================
   SOLUTIONS.JS — Logika przełączania zakładek w sekcji rozwiązań
   ============================================================ */

function initSolutionsTabs() {
    const tabs = document.querySelectorAll('.solutions__tab');
    const contents = document.querySelectorAll('.solutions__content');

    if (!tabs.length || !contents.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const solutionId = tab.getAttribute('data-solution');

            // Usuń aktywność ze wszystkich
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Dodaj aktywność wybranej zakładce
            tab.classList.add('active');
            
            // Dodaj aktywność wybranemu kontentowi
            const activeContent = document.getElementById(`solution-${solutionId}`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initSolutionsTabs);
