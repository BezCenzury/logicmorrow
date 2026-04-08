/* ============================================================
   ROI-CALCULATOR.JS — Kalkulator strat manualnych
   Uświadamia klientowi ile pieniędzy przepala na procesach
   ============================================================ */

/**
 * Inicjalizacja kalkulatora.
 * Wywoływana na stronie głównej (index.html).
 */
function initROICalculator() {
    const form   = document.getElementById('roi-calculator');
    const result = document.getElementById('roi-result');
    if (!form || !result) return;

    const inputs = form.querySelectorAll('input[type="range"], input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', calculateWaste);
    });

    calculateWaste(); // Oblicz wartości domyślne przy załadowaniu
}

/**
 * Logika obliczeń strat.
 * Dane wejściowe: pracownicy, godziny/tydzień na manualny proces, stawka godzinowa.
 * Dane wyjściowe: roczny koszt procesu, miesięczna strata.
 */
function calculateWaste() {
    // --- Odczyt wartości z formularza ---
    const employees  = getInputValue('roi-employees',  1);
    const hoursWeek  = getInputValue('roi-hours',      5);
    const hourlyRate = getInputValue('roi-rate',       50);

    // --- Obliczenia ---
    const hoursYearTotal = employees * hoursWeek * 52;
    const annualCost     = hoursYearTotal * hourlyRate;
    const monthlyCost    = annualCost / 12;

    // --- Aktualizacja widoku ---
    setOutput('roi-monthly-cost',   formatPLN(monthlyCost));
    setOutput('roi-annual-cost',    formatPLN(annualCost));
    setOutput('roi-hours-year',     `${hoursYearTotal.toLocaleString('pl-PL')} h`);
}

/* --- Pomocnicze --- */

function getInputValue(id, fallback) {
    const el = document.getElementById(id);
    return el ? (parseFloat(el.value) || fallback) : fallback;
}

function setOutput(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function formatPLN(value) {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
        maximumFractionDigits: 0
    }).format(value);
}

/* --- Uruchomienie --- */
document.addEventListener('DOMContentLoaded', initROICalculator);
