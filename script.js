document.querySelectorAll('.sidebar nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
    });
});


window.addEventListener('resize', function () {
    document.querySelectorAll('section').forEach(section => {
        section.style.minHeight = `${window.innerHeight}px`;
    });
});

window.dispatchEvent(new Event('resize'));

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileClose = document.getElementById('mobile-close');
    const scrollProgress = document.getElementById('scroll-progress');

    function adjustSidebarHeight() {
        if (window.innerWidth <= 768) {
            const headerHeight = document.querySelector('.sidebar-header').offsetHeight;
            const socialHeight = document.querySelector('.socials').offsetHeight;

            const availableHeight = window.innerHeight - headerHeight - socialHeight;
            sidebar.style.height = `${availableHeight}px`;
        } else {
            sidebar.style.height = '100vh';
        }
    }

    function toggleMobileMenu() {
        const isActive = sidebar.classList.contains('active');
        
        sidebar.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Only use overlay on larger mobile screens where needed
        if (mobileOverlay && window.innerWidth > 480) {
            mobileOverlay.classList.toggle('active');
        }
        
        // Prevent body scroll when menu is open
        if (!isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    function closeMobileMenu() {
        sidebar.classList.remove('active');
        hamburger.classList.remove('active');
        if (mobileOverlay) {
            mobileOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }

    // Event listeners
    hamburger.addEventListener('click', toggleMobileMenu);
    mobileClose.addEventListener('click', closeMobileMenu);
    
    // Close menu when clicking overlay (if it exists)
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Close menu when clicking nav links on mobile
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    // Add swipe gesture support
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    sidebar.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    sidebar.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        
        // If swiping left and we've moved enough, start closing
        if (deltaX < -50 && sidebar.classList.contains('active')) {
            e.preventDefault();
            const translateX = Math.max(deltaX, -window.innerWidth);
            sidebar.style.transform = `translateX(${translateX}px)`;
        }
    });

    sidebar.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const deltaX = currentX - startX;
        
        // If swiped left enough, close the menu
        if (deltaX < -100) {
            closeMobileMenu();
        }
        
        // Reset transform
        sidebar.style.transform = '';
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        adjustSidebarHeight();
        
        // Close mobile menu when switching to desktop
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    adjustSidebarHeight();

    // Dynamic Footer Year
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    // Scroll progress indicator
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    document.querySelectorAll('section, .card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Enhanced scroll event
    window.addEventListener('scroll', () => {
        updateScrollProgress();
        
        // Add parallax effect to floating icons
        const floatingIcons = document.querySelectorAll('.floating-icons i');
        const scrolled = window.pageYOffset;
        
        floatingIcons.forEach((icon, index) => {
            const rate = scrolled * -0.5 * (index % 3 + 1);
            icon.style.transform = `translateY(${rate}px)`;
        });
    });

    // Initialize scroll progress
    updateScrollProgress();
});

const API_ENDPOINT = 'https://vthy0avz3m.execute-api.us-east-1.amazonaws.com/prod/visitors';

let counterUpdated = false;

async function updateViewerCount() {
    if (counterUpdated) return;
    counterUpdated = true;
    
    const counterElement = document.getElementById('visitor-count');
    if (!counterElement) return;
    
    let currentCount = 0;
    
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
                currentCount = getData.count;
                counterElement.textContent = currentCount;
            }
        } else {
            counterElement.textContent = '--';
            return;
        }
    } catch (error) {
        counterElement.textContent = '--';
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
                counterElement.textContent = updatedData.count;
            }
        }
        // Silently keep current count if POST fails
    } catch (error) {
        // Silently keep current count if error occurs
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateViewerCount, 1000);
});

// Debug functions removed for production build


document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    
    function updateActiveNavLink() {
        let currentSection = '';
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        // Find which section is currently in view
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });
        
        // Update active state on nav links
        navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (href === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Initial check on page load
    updateActiveNavLink();
    
    // Update on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Update on resize
    window.addEventListener('resize', updateActiveNavLink);
});

// Add this to your script.js file if you prefer in-page expansion
document.querySelectorAll('.experience-card').forEach(card => {
    card.addEventListener('click', function() {
        // Remove active class from all cards
        document.querySelectorAll('.experience-card').forEach(c => 
            c.classList.remove('active'));
        
        // Add active class to clicked card
        this.classList.add('active');
    });
});

function toggleContent(contentId, e) {
    const content = document.getElementById(contentId);
    const button = e.currentTarget;
    const buttonText = button.querySelector('.read-more-text');

    if (content.style.display === 'none' || !content.style.display) {
        content.style.display = 'block';
        buttonText.textContent = '← Click to collapse';
    } else {
        content.style.display = 'none';
        buttonText.textContent = 'Click to read more →';
    }
}