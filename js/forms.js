/**
 * forms.js - Form handling and input formatting for LogicMorrow
 *
 * Obsługuje:
 * 1. Formatowanie numeru telefonu (+48 xxx xxx xxx)
 * 2. Wysyłkę formularzy kontaktowych do webhooka
 * 3. Honeypot anty-botowy
 * 4. Stan sukcesu — formularz zastępowany komunikatem z ikonką
 */

const WEBHOOK_URL = 'https://n8n.systemtargowy.pl/webhook/kontakty-st-lm';

// ---------------------------------------------------------------------------
// 1. Phone number formatter (+48 xxx xxx xxx)
// ---------------------------------------------------------------------------

function initPhoneFormatter() {
    document.querySelectorAll('input[type="tel"], #form-phone').forEach(input => {
        input.addEventListener('input', (e) => {
            const el = e.target;
            let digits = el.value.replace(/\D/g, '');

            if (digits.startsWith('48')) digits = digits.substring(2);
            if (digits.length > 9)       digits = digits.substring(0, 9);
            if (digits.length === 0) { el.value = ''; return; }

            let formatted = '+48';
            if (digits.length > 0) formatted += ' ' + digits.substring(0, 3);
            if (digits.length > 3) formatted += ' ' + digits.substring(3, 6);
            if (digits.length > 6) formatted += ' ' + digits.substring(6, 9);

            el.value = formatted;
        });
    });
}

// ---------------------------------------------------------------------------
// 2. Success state — zastępuje formularz komunikatem z ikonką
// ---------------------------------------------------------------------------

function showSuccess(form) {
    const wrapper = form.closest('.consultation__form-wrapper') || form.parentElement;

    const successHtml = `
        <div class="form-success" role="alert" aria-live="polite">
            <div class="form-success__icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="24" fill="var(--color-success, #22c55e)" opacity="0.12"/>
                    <circle cx="24" cy="24" r="18" fill="var(--color-success, #22c55e)" opacity="0.18"/>
                    <path d="M14 24.5l7 7 13-14" stroke="var(--color-success, #22c55e)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h3 class="form-success__title">Dziękujemy za wiadomość!</h3>
            <p class="form-success__text">Odezwiemy się najszybciej jak to tylko możliwe — zazwyczaj w ciągu 24&nbsp;godzin roboczych.</p>
        </div>
    `;

    // Zamień tylko formularz, zostaw sekcję "bezpośredni kontakt" jeśli istnieje
    form.style.transition = 'opacity 0.3s ease';
    form.style.opacity = '0';
    setTimeout(() => {
        form.insertAdjacentHTML('afterend', successHtml);
        form.remove();
    }, 300);
}

// ---------------------------------------------------------------------------
// 3. Webhook submission
// ---------------------------------------------------------------------------

async function getClientIp() {
    try {
        const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) });
        const data = await res.json();
        return data.ip || null;
    } catch {
        return null;
    }
}

function setButtonLoading(btn, loading) {
    if (loading) {
        btn.disabled = true;
        btn.dataset.originalText = btn.textContent;
        btn.textContent = 'Wysyłanie…';
    } else {
        btn.disabled = false;
        btn.textContent = btn.dataset.originalText || 'Wyślij';
    }
}

function showError(form) {
    let msg = form.querySelector('.form-error-msg');
    if (!msg) {
        msg = document.createElement('p');
        msg.className = 'form-error-msg';
        msg.style.cssText = 'color:#ef4444;font-size:.875rem;margin-top:.5rem;';
        form.appendChild(msg);
    }
    msg.textContent = 'Coś poszło nie tak. Spróbuj jeszcze raz lub napisz na kontakt@logicmorrow.pl';
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;

    // Honeypot check
    const hp = form.querySelector('.form-hp input');
    if (hp && hp.checked) {
        console.warn('Bot detected via honeypot.');
        return;
    }

    const email   = (form.querySelector('#form-email')   || {}).value?.trim() || '';
    const phone   = (form.querySelector('#form-phone')   || {}).value?.trim() || '';
    const message = (form.querySelector('#form-subject') || {}).value?.trim() || '';

    if (!email || !phone || !message) return;

    const btn = form.querySelector('button[type="submit"]');
    setButtonLoading(btn, true);

    const ip         = await getClientIp();
    const source_url = window.location.href;

    try {
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, phone, message, ip, source_url }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        showSuccess(form);
    } catch (err) {
        console.error('Webhook error:', err);
        setButtonLoading(btn, false);
        showError(form);
    }
}

// ---------------------------------------------------------------------------
// 4. Init
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    initPhoneFormatter();

    document.querySelectorAll('form.consultation__form, form#contact-form').forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
});
