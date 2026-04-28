document.addEventListener('DOMContentLoaded', () => {
    const triggers = document.querySelectorAll('.js-open-system-modal');
    
    triggers.forEach(trigger => {
        const modalId = trigger.getAttribute('data-modal-target');
        if (!modalId) return;
        const modal = document.getElementById(modalId);
        if(!modal) return;
        
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(modal);
        });
        
        // Ensure standard role and tabindex for accessibility
        trigger.setAttribute('role', 'button');
        trigger.setAttribute('tabindex', '0');
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(modal);
            }
        });
    });

    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        const carouselContainer = modal.querySelector('.modal-carousel');
        if (carouselContainer) {
            carouselContainer.scrollTo(0, 0);
        }
    }
    
    const closeModals = () => {
        const activeModals = document.querySelectorAll('.custom-modal-overlay.active');
        activeModals.forEach(modal => {
            modal.classList.remove('active');
            
            // Stop any media playing inside the modal
            const videos = modal.querySelectorAll('video');
            videos.forEach(vid => vid.pause());

            // Reload iframes (YouTube embeds) to stop playback — pause() doesn't apply to iframes
            const iframes = modal.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                iframe.src = iframe.src;
            });
        });
        document.body.style.overflow = '';
    };
    
    // Close buttons logic inside modal
    document.addEventListener('click', (e) => {
        if (e.target.closest('.custom-modal-close') || e.target.classList.contains('custom-modal-overlay')) {
            closeModals();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModals();
        }
    });

    // We can keep the carousel logic globally for any modal that has it
    const allModals = document.querySelectorAll('.custom-modal-overlay');
    allModals.forEach(modal => {
        const carouselContainer = modal.querySelector('.modal-carousel');
        const dots = modal.querySelectorAll('.modal-carousel-dot');
        
        if (carouselContainer && dots.length > 0) {
            const prevBtn = modal.querySelector('.modal-carousel-arrow--prev');
            const nextBtn = modal.querySelector('.modal-carousel-arrow--next');

            carouselContainer.addEventListener('scroll', () => {
                let index = Math.round(carouselContainer.scrollLeft / carouselContainer.clientWidth);
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            });

            dots.forEach((dot, i) => {
                dot.addEventListener('click', () => {
                    carouselContainer.scrollTo({
                        left: i * carouselContainer.clientWidth,
                        behavior: 'smooth'
                    });
                });
            });

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    carouselContainer.scrollBy({
                        left: -carouselContainer.clientWidth,
                        behavior: 'smooth'
                    });
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    carouselContainer.scrollBy({
                        left: carouselContainer.clientWidth,
                        behavior: 'smooth'
                    });
                });
            }
        }
    });
});
