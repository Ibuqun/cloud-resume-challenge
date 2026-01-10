/* ===========================================
   IBUKUN TAIWO — PORTFOLIO
   JavaScript
   =========================================== */

// --- Smooth Scroll Navigation ---
document.querySelectorAll('.nav a, .logo').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// --- DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileClose = document.getElementById('mobile-close');
    const scrollProgress = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav a');

    // --- Mobile Menu ---
    function toggleMobileMenu() {
        const isActive = sidebar.classList.contains('active');

        sidebar.classList.toggle('active');
        hamburger.classList.toggle('active');

        if (mobileOverlay) {
            mobileOverlay.classList.toggle('active');
        }

        document.body.style.overflow = isActive ? '' : 'hidden';
    }

    function closeMobileMenu() {
        sidebar.classList.remove('active');
        hamburger.classList.remove('active');
        if (mobileOverlay) {
            mobileOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMobileMenu);
    mobileClose.addEventListener('click', closeMobileMenu);

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking nav links on mobile
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // --- Scroll Progress ---
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = scrollPercent + '%';
    }

    // --- Active Nav Link ---
    function updateActiveNavLink() {
        let currentSection = '';
        const scrollPosition = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (href === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // --- Intersection Observer for Animations ---
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

    // Observe section containers
    document.querySelectorAll('.section-container, .hero-content').forEach(el => {
        observer.observe(el);
    });

    // --- Scroll Events ---
    window.addEventListener('scroll', () => {
        updateScrollProgress();
        updateActiveNavLink();
    }, { passive: true });

    // Initial calls
    updateScrollProgress();
    updateActiveNavLink();

    // --- Dynamic Footer Year ---
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
});

// --- Visitor Counter API ---
const API_ENDPOINT = 'https://vthy0avz3m.execute-api.us-east-1.amazonaws.com/prod/visitors';

let counterUpdated = false;

async function updateViewerCount() {
    if (counterUpdated) return;
    counterUpdated = true;

    const counterElement = document.getElementById('visitor-count');
    if (!counterElement) return;

    // Get current count
    try {
        const getResponse = await fetch(API_ENDPOINT, {
            method: 'GET',
            mode: 'cors',
            headers: { 'Accept': 'application/json' }
        });

        if (getResponse.ok) {
            const getData = await getResponse.json();
            if (getData.count !== undefined) {
                counterElement.textContent = getData.count.toLocaleString();
            }
        } else {
            counterElement.textContent = '—';
            return;
        }
    } catch (error) {
        counterElement.textContent = '—';
        return;
    }

    // Increment count
    try {
        const postResponse = await fetch(API_ENDPOINT, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (postResponse.ok) {
            const updatedData = await postResponse.json();
            if (updatedData.count !== undefined) {
                counterElement.textContent = updatedData.count.toLocaleString();
            }
        }
    } catch (error) {
        // Silently keep current count
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateViewerCount, 1000);
});

// --- Experience Toggle ---
function toggleContent(contentId, e) {
    const content = document.getElementById(contentId);
    const button = e.currentTarget;
    const buttonText = button.querySelector('.toggle-text');

    if (content.style.display === 'none' || !content.style.display) {
        content.style.display = 'block';
        buttonText.textContent = 'Hide details';
        button.classList.add('expanded');
    } else {
        content.style.display = 'none';
        buttonText.textContent = 'View details';
        button.classList.remove('expanded');
    }
}
