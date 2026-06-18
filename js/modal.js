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

    // ----------------------------------------------------------
    // Nawigacja MIĘDZY projektami (poprzedni / następny)
    // Pozwala przeskakiwać między case studies bez zamykania okna.
    // ----------------------------------------------------------
    const projectModals = Array.from(triggers)
        .map(t => document.getElementById(t.getAttribute('data-modal-target')))
        .filter((m, i, arr) => m && arr.indexOf(m) === i);

    if (projectModals.length > 1) {
        const total = projectModals.length;

        const goToProject = (idx) => {
            if (idx < 0 || idx >= total) return;
            const current = projectModals.find(m => m.classList.contains('active'));
            const target = projectModals[idx];
            if (current === target) return;
            if (current) current.classList.remove('active');
            target.classList.add('active');
            document.body.style.overflow = 'hidden';
            const car = target.querySelector('.modal-carousel');
            if (car) car.scrollTo(0, 0);
            const right = target.querySelector('.custom-modal-right');
            if (right) right.scrollTop = 0;
        };

        projectModals.forEach((modal, i) => {
            const right = modal.querySelector('.custom-modal-right');
            if (!right || right.querySelector('.modal-projnav')) return;

            const nav = document.createElement('div');
            nav.className = 'modal-projnav';
            nav.innerHTML =
                '<button type="button" class="modal-projnav__btn" data-proj="prev" aria-label="Poprzedni projekt">' +
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>' +
                '<span>Poprzedni</span></button>' +
                '<span class="modal-projnav__counter">Projekt <strong>' + (i + 1) + '</strong> z ' + total + '</span>' +
                '<button type="button" class="modal-projnav__btn" data-proj="next" aria-label="Następny projekt">' +
                '<span>Następny</span>' +
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
                '</button>';
            right.prepend(nav);

            const prevBtn = nav.querySelector('[data-proj="prev"]');
            const nextBtn = nav.querySelector('[data-proj="next"]');
            prevBtn.disabled = (i === 0);
            nextBtn.disabled = (i === total - 1);
            prevBtn.addEventListener('click', () => goToProject(i - 1));
            nextBtn.addEventListener('click', () => goToProject(i + 1));
        });

        // Strzałki klawiatury przełączają projekty, gdy modal jest otwarty
        document.addEventListener('keydown', (e) => {
            const active = projectModals.find(m => m.classList.contains('active'));
            if (!active) return;
            const idx = projectModals.indexOf(active);
            if (e.key === 'ArrowRight') { e.preventDefault(); goToProject(idx + 1); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); goToProject(idx - 1); }
        });
    }
});
