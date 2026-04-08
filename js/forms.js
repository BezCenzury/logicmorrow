/**
 * forms.js - Form handling and input formatting for LogicMorrow
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Phone number formatter (+48 xxx xxx xxx)
    const phoneInputs = document.querySelectorAll('input[type="tel"], #form-phone');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const el = e.target;
            // Get all digits from the input
            let digits = el.value.replace(/\D/g, '');
            
            // If the digits start with 48, we assume it's the prefix and strip it
            // This prevents doubling when +48 is already there
            if (digits.startsWith('48')) {
                digits = digits.substring(2);
            }
            
            // Limit to 9 digits (standard Polish number)
            if (digits.length > 9) {
                digits = digits.substring(0, 9);
            }
            
            if (digits.length === 0) {
                el.value = '';
                return;
            }
            
            // Always rebuild with +48
            let formatted = '+48';
            
            if (digits.length > 0) {
                formatted += ' ' + digits.substring(0, 3);
            }
            if (digits.length > 3) {
                formatted += ' ' + digits.substring(3, 6);
            }
            if (digits.length > 6) {
                formatted += ' ' + digits.substring(6, 9);
            }
            
            el.value = formatted;
        });

        // Initialize on input if it's currently empty or just +48
        // User starts typing, we catch it in 'input' anyway
    });

    // 2. Honeypot check (Generic)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const hp = form.querySelector('#hp-check, .form-hp input');
            if (hp && hp.checked) {
                e.preventDefault();
                console.warn('Spam detected.');
            }
        });
    });
});
