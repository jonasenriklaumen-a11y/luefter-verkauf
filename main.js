/* =========================================
   Arctic P12 Pro – main.js
   ========================================= */

// ── Scroll reveal ──────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings inside same parent
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Navbar scroll effect ───────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Hero parallax (subtle) ─────────────────
const heroImg = document.getElementById('hero-img');
if (heroImg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroImg.style.transform = `translateY(${y * 0.08}px)`;
  }, { passive: true });
}

// ── Color switcher ─────────────────────────
const colorBtns = document.querySelectorAll('.color-btn');
const galleryMainImg = document.getElementById('gallery-main-img');
const colorOverlay = document.getElementById('color-overlay');
const featureOverlay1 = document.getElementById('feature-overlay-1');
const featureOverlay2 = document.getElementById('feature-overlay-2');
const thumbsContainer = document.querySelector('.gallery-thumbs');
let currentColor = 'white';

colorBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const color = btn.dataset.color;
    if (color === currentColor) return;
    currentColor = color;

    // Update active button
    colorBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Toggle overlays for black mode
    const isBlack = color === 'black';
    [colorOverlay, featureOverlay1, featureOverlay2].forEach(overlay => {
      if (overlay) overlay.classList.toggle('black-mode', isBlack);
    });

    // Thumb overlays
    if (thumbsContainer) {
      thumbsContainer.classList.toggle('black-mode-thumbs', isBlack);
    }

    // Hero img tint
    if (heroImg) {
      heroImg.style.filter = isBlack ? 'brightness(0.25) contrast(1.1)' : 'none';
    }
  });
});

// ── Gallery thumbnail switcher ─────────────
const thumbs = document.querySelectorAll('.thumb');
thumbs.forEach(thumb => {
  thumb.addEventListener('click', () => {
    const src = thumb.dataset.src;
    if (!galleryMainImg || !src) return;

    // Fade out → switch → fade in
    galleryMainImg.style.opacity = '0';
    setTimeout(() => {
      galleryMainImg.src = src;
      galleryMainImg.style.opacity = '1';
    }, 220);

    // Active state
    thumbs.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
  });
});

// ── Spec cards stagger on scroll ───────────
const specCards = document.querySelectorAll('.spec-card');
const specObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = [...document.querySelectorAll('.spec-card')];
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add('visible'), i * 70);
        });
        specObserver.disconnect();
      }
    });
  },
  { threshold: 0.1 }
);
const specsSection = document.querySelector('.specs-section');
if (specsSection) specObserver.observe(specsSection);

// ── Contact form ───────────────────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
if (contactForm && formSuccess) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Wird gesendet…';
    btn.disabled = true;

    // Simulate network delay
    setTimeout(() => {
      contactForm.style.display = 'none';
      formSuccess.classList.add('visible');
    }, 1200);
  });
}

// ── Smooth scroll for anchor links ─────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Button ripple effect ───────────────────
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;
      border-radius:50%;background:rgba(255,255,255,0.3);
      transform:scale(0);animation:ripple 0.5s ease-out forwards;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      pointer-events:none;
    `;
    if (!this.style.position || this.style.position === 'static') {
      this.style.position = 'relative';
    }
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Inject ripple keyframe
const style = document.createElement('style');
style.textContent = '@keyframes ripple{to{transform:scale(2.5);opacity:0}}';
document.head.appendChild(style);
