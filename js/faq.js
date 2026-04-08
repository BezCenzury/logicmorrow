/**
 * FAQ Accordion Script
 * Managing the vertical expandable FAQ tiles with 'one-open' logic.
 */

function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-accordion__item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-accordion__header');
        if (header && !header.hasAttribute('aria-expanded')) {
            header.setAttribute('aria-expanded', 'false');
        }
        
        header.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all others
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('open');
                    const otherHeader = otherItem.querySelector('.faq-accordion__header');
                    if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current
            item.classList.toggle('open');
            header.setAttribute('aria-expanded', String(!isOpen));
        });
    });
}

document.addEventListener('DOMContentLoaded', initFaqAccordion);
