/* script.js - Victor Queiroz Portfolio */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio System Initialized...');

    // Smooth scroll para âncoras internas
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Efeito de revelação fade-in simples ao scroll, com leve escalonamento
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = entry.target.dataset.revealDelay || '0s';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const scrollSections = document.querySelectorAll('.section-scroll, .activity-card');
    scrollSections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        if (section.classList.contains('activity-card')) {
            section.dataset.revealDelay = Math.min(index * 0.08, 0.32) + 's';
        }
        observer.observe(section);
    });

    // Sistema de abas por Trimestre (usado nas páginas de matérias)
    const trimestreTabsWrapper = document.querySelector('.trimestre-tabs');
    if (trimestreTabsWrapper) {
        const buttons = trimestreTabsWrapper.querySelectorAll('.trimestre-btn');
        const panels = document.querySelectorAll('.trimestre-content');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTrimestre = btn.dataset.trimestre;

                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                panels.forEach(panel => {
                    if (panel.dataset.trimestre === targetTrimestre) {
                        panel.classList.add('active');
                        // Reativa as animações dos cards dentro da aba exibida
                        panel.querySelectorAll('.activity-card').forEach((card, i) => {
                            card.style.transitionDelay = Math.min(i * 0.08, 0.32) + 's';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        });
                    } else {
                        panel.classList.remove('active');
                    }
                });
            });
        });
    }
});
