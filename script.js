/**
 * IBUKUN TAIWO — MISSION CONTROL
 * Portfolio JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {

    // ===== Particle System =====
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    function createParticles() {
        if (!particlesContainer) return;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (10 + Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    createParticles();

    // ===== Custom Cursor =====
    const cursor = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursor-dot');

    if (cursor && cursorDot && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.12;
            cursorY += (mouseY - cursorY) * 0.12;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects
        const hoverables = document.querySelectorAll(
            'a, button, .skill-node, .project-card, .cert-card, .module-card, .timeline-entry'
        );

        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });
    }

    // ===== Header Scroll Effect =====
    const header = document.getElementById('header');

    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    // ===== Mobile Menu =====
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuClose = document.getElementById('menu-close');
    const menuItems = document.querySelectorAll('.menu-item');

    function openMenu() {
        menuBtn.classList.add('active');
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    function toggleMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        if (mobileMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMenu);
        menuBtn.addEventListener('touchend', toggleMenu);
    }

    if (menuClose) {
        menuClose.addEventListener('click', (e) => {
            e.preventDefault();
            closeMenu();
        });
        menuClose.addEventListener('touchend', (e) => {
            e.preventDefault();
            closeMenu();
        });
    }

    menuItems.forEach(item => {
        item.addEventListener('click', closeMenu);
        item.addEventListener('touchend', (e) => {
            e.preventDefault();
            closeMenu();
            // Navigate after closing
            const href = item.getAttribute('href');
            if (href) {
                setTimeout(() => {
                    window.location.hash = href;
                }, 100);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // ===== Smooth Scroll =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===== Active Nav Link =====
    const sections = document.querySelectorAll('section[id]');
    const navNodes = document.querySelectorAll('.nav-node');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navNodes.forEach(node => {
                    node.classList.remove('active');
                    if (node.getAttribute('href') === `#${id}`) {
                        node.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // ===== Skill Node Colors =====
    const skillNodes = document.querySelectorAll('.skill-node');

    skillNodes.forEach(node => {
        const color = node.dataset.color;
        if (color) {
            node.addEventListener('mouseenter', () => {
                node.style.setProperty('--node-color', color);
                node.style.setProperty('--node-glow', color + '40');
            });
        }
    });

    // ===== Dynamic Footer Year =====
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    // ===== Intersection Observer for Animations =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.module-section, .module-card, .timeline-entry, .project-card').forEach(el => {
        observer.observe(el);
    });

    // ===== Metric Bar Animation =====
    const metricObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.metric-bar').forEach(bar => {
        metricObserver.observe(bar);
    });

    // ===== Parallax Effect for Grid Background =====
    const gridGlow = document.querySelector('.grid-glow');

    if (gridGlow) {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.scrollY;
                    gridGlow.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.1}px))`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ===== Mouse Move Effect on Hero Dashboard =====
    const dashboardFrame = document.querySelector('.dashboard-frame');

    if (dashboardFrame && window.matchMedia('(pointer: fine)').matches) {
        const heroSection = document.querySelector('.hero-command');

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            dashboardFrame.style.transform = `
                perspective(1000px)
                rotateY(${x * 5}deg)
                rotateX(${-y * 5}deg)
            `;
        });

        heroSection.addEventListener('mouseleave', () => {
            dashboardFrame.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
        });
    }

});

// ===== Experience Toggle =====
function toggleExp(button) {
    const details = button.nextElementSibling;
    const isOpen = details.classList.contains('show');

    // Close all others
    document.querySelectorAll('.entry-details.show').forEach(el => {
        el.classList.remove('show');
        el.previousElementSibling.classList.remove('active');
    });

    if (!isOpen) {
        details.classList.add('show');
        button.classList.add('active');
    }
}

// Attach touch events to toggle buttons after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.entry-toggle').forEach(btn => {
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleExp(btn);
        });
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleExp(btn);
        });
    });
});

// ===== Visitor Counter =====
const API_ENDPOINT = 'https://vthy0avz3m.execute-api.us-east-1.amazonaws.com/prod/visitors';
let counterUpdated = false;

async function updateVisitorCount() {
    if (counterUpdated) return;
    counterUpdated = true;

    const counterElement = document.getElementById('visitor-count');
    if (!counterElement) return;

    try {
        // Get current count
        const getResponse = await fetch(API_ENDPOINT, {
            method: 'GET',
            mode: 'cors',
            headers: { 'Accept': 'application/json' }
        });

        if (getResponse.ok) {
            const getData = await getResponse.json();
            if (getData.count !== undefined) {
                animateCount(counterElement, 0, getData.count);
            }
        }

        // Increment
        await fetch(API_ENDPOINT, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

    } catch (error) {
        counterElement.textContent = '—';
    }
}

function animateCount(element, start, end) {
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Initialize visitor counter after delay
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(updateVisitorCount, 1000);
});
