// public/js/main.js – DivyaSetu Frontend Scripts

document.addEventListener('DOMContentLoaded', () => {

    // ── Hide loading spinner ─────────────────────────────────────
    const spinner = document.getElementById('spinner');
    if (spinner) {
        window.addEventListener('load', () => {
            setTimeout(() => spinner.classList.add('hidden'), 400);
        });
        // Fallback: hide after 2s regardless
        setTimeout(() => spinner.classList.add('hidden'), 2000);
    }

    // ── Mobile nav toggle ────────────────────────────────────────
    const toggle   = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            toggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
        });
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
            }
        });
    }

    // ── Mark active nav link ─────────────────────────────────────
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.startsWith(href) && href !== '/') {
            link.classList.add('active-link');
            link.style.color = 'var(--saffron)';
            link.style.background = 'var(--saffron-light)';
        }
    });

    // ── Auto-dismiss flash messages ──────────────────────────────
    const flash = document.getElementById('flash-msg');
    if (flash) {
        setTimeout(() => {
            flash.style.transition = 'opacity 0.5s ease, height 0.4s ease';
            flash.style.opacity = '0';
            flash.style.overflow = 'hidden';
            flash.style.height = '0';
            flash.style.padding = '0';
            setTimeout(() => flash.remove(), 500);
        }, 4500);
    }

    // ── Intersection Observer for scroll animations ──────────────
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // ── Hero particle effect ─────────────────────────────────────
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) createParticle(particlesContainer);
    }

    // ── Admin sidebar active link ────────────────────────────────
    document.querySelectorAll('.admin-nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            document.querySelectorAll('.admin-nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });

    // ── Smooth scroll for anchor links ──────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ── Temple card image lazy load fallback ─────────────────────
    document.querySelectorAll('img[onerror]').forEach(img => {
        img.addEventListener('error', function() {
            this.src = '/images/temple-placeholder.svg';
        });
    });

    // ── Table row hover (admin) ──────────────────────────────────
    document.querySelectorAll('.data-table tbody tr').forEach(row => {
        row.style.cursor = 'default';
    });

    // ── Navbar scroll effect ─────────────────────────────────────
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 4px 30px rgba(255,153,51,0.25)';
            } else {
                navbar.style.boxShadow = '0 2px 20px rgba(255,153,51,0.15)';
            }
        }, { passive: true });
    }
});

// ── Hero particles ───────────────────────────────────────────
function createParticle(container) {
    const el = document.createElement('div');
    const size = 2 + Math.random() * 4;
    el.style.cssText = `
        position: absolute;
        width: ${size}px; height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 153, 51, ${0.2 + Math.random() * 0.5});
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: particleFloat ${4 + Math.random() * 6}s ease-in-out infinite;
        animation-delay: ${Math.random() * 4}s;
    `;
    container.appendChild(el);
}

// Inject particle keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
        33% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
        66% { transform: translateY(-10px) translateX(-8px); opacity: 0.5; }
    }
`;
document.head.appendChild(style);
