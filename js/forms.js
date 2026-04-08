/**
 * forms.js - Form handling and input formatting for LogicMorrow
 *
 * Obsługuje:
 * 1. Formatowanie numeru telefonu (+48 xxx xxx xxx)
 * 2. Wysyłkę formularzy kontaktowych do webhooka
 */

const WEBHOOK_URL = 'https://n8n.systemtargowy.pl/webhook/kontakty-st-lm';

// ---------------------------------------------------------------------------
// 1. Phone number formatter (+48 xxx xxx xxx)
// ---------------------------------------------------------------------------

function initPhoneFormatter() {
    const phoneInputs = document.querySelectorAll('input[type="tel"], #form-phone');

    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const el = e.target;
            let digits = el.value.replace(/\D/g, '');

            if (digits.startsWith('48')) {
                digits = digits.substring(2);
            }
            if (digits.length > 9) {
                digits = digits.substring(0, 9);
            }
            if (digits.length === 0) {
                el.value = '';
                return;
            }

            let formatted = '+48';
            if (digits.length > 0) formatted += ' ' + digits.substring(0, 3);
            if (digits.length > 3) formatted += ' ' + digits.substring(3, 6);
            if (digits.length > 6) formatted += ' ' + digits.substring(6, 9);

            el.value = formatted;
        });
    });
}

// ---------------------------------------------------------------------------
// 2. Webhook submission
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

function setFormState(form, state) {
    const btn = form.querySelector('button[type="submit"]');

    if (state === 'loading') {
        btn.disabled = true;
        btn.dataset.originalText = btn.textContent;
        btn.textContent = 'Wysyłanie…';
    }

    if (state === 'success') {
        btn.disabled = true;
        btn.textContent = 'Wysłano — odezwiemy się wkrótce';
        btn.classList.add('btn--success');
        form.querySelectorAll('input, textarea').forEach(el => el.disabled = true);
    }

    if (state === 'error') {
        btn.disabled = false;
        btn.textContent = btn.dataset.originalText || 'Wyślij';
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;

    // Honeypot check
    const hp = form.querySelector('#hp-check, .form-hp input');
    if (hp && hp.checked) {
        console.warn('Spam detected.');
        return;
    }

    const email   = (form.querySelector('#form-email')   || {}).value?.trim() || '';
    const phone   = (form.querySelector('#form-phone')   || {}).value?.trim() || '';
    const message = (form.querySelector('#form-subject') || {}).value?.trim() || '';

    if (!email || !phone || !message) return;

    setFormState(form, 'loading');

    const ip         = await getClientIp();
    const source_url = window.location.href;

    const payload = { email, phone, message, ip, source_url };

    try {
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        setFormState(form, 'success');
    } catch (err) {
        console.error('Webhook error:', err);
        setFormState(form, 'error');

        const errorMsg = form.querySelector('.form-error-msg');
        if (!errorMsg) {
            const msg = document.createElement('p');
            msg.className = 'form-error-msg';
            msg.textContent = 'Coś poszło nie tak. Spróbuj jeszcze raz lub napisz bezpośrednio na kontakt@logicmorrow.pl';
            msg.style.cssText = 'color:#ef4444;font-size:.875rem;margin-top:.5rem;';
            form.appendChild(msg);
        }
    }
}

// ---------------------------------------------------------------------------
// 3. Init
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    initPhoneFormatter();

    document.querySelectorAll('form.consultation__form, form#contact-form').forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
});
