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

    hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        adjustSidebarHeight();
    });

    window.addEventListener('resize', adjustSidebarHeight);
    adjustSidebarHeight();
});

const count = document.querySelector(".page-views");
async function updateViewerCount() {
    let resp = await fetch("https://vdozaflmfqf7t5bs5ez2lthoqm0qkivc.lambda-url.ap-south-1.on.aws/");
    let views = await resp.json();
    count.innerHTML = `Total Views👀: ${views}`;
}
updateViewerCount();

document.getElementById('hamburger').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('active');
});

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