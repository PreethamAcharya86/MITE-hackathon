/* ═══════════════════════════════════════════════════════════
   AI VibeX — script.js
   Particle canvas, cursor tracking, scroll animations,
   navbar behaviour, AOS, hamburger menu, criteria bars
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── 1. CUSTOM CURSOR ─────────────────────────────────── */
  if (window.innerWidth > 768) {
    const cursorGlow = document.getElementById('cursor-glow');
    const cursorRing = document.getElementById('cursor-ring');
    const cursorDot  = document.getElementById('cursor-dot');

    // Current raw mouse position (dot follows this exactly)
    let mx = window.innerWidth / 2,  my = window.innerHeight / 2;
    // Ring interpolation position (lags behind)
    let rx = mx, ry = my;
    // Glow interpolation position (lags even more)
    let gx = mx, gy = my;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    // Click states
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

    // Hover states on all interactive elements
    const interactables = 'a, button, input, textarea, select, label, [role="button"], .tl-card, .strip-card, .flow-card, .why-card';
    document.querySelectorAll(interactables).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    function animateCursor() {
      // Dot: instant (no lerp — crisp exact tracking)
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top  = my + 'px';

      // Ring: responsive and snappy tracking (speed factor 0.42)
      rx += (mx - rx) * 0.42;
      ry += (my - ry) * 0.42;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';

      // Glow: smooth fast ambient tracking (speed factor 0.22)
      gx += (mx - gx) * 0.22;
      gy += (my - gy) * 0.22;
      cursorGlow.style.left = gx + 'px';
      cursorGlow.style.top  = gy + 'px';

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hide cursors when mouse leaves window
    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity  = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity  = '1';
      cursorRing.style.opacity = '1';
    });
  }

  /* ─── 2. PARTICLE CANVAS ───────────────────────────────── */
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initParticles();
  });

  const PARTICLE_COUNT = window.innerWidth < 768 ? 50 : 120;
  let particles = [];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.r    = Math.random() * 1.5 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color  = Math.random() > 0.5
        ? `rgba(139,92,246,${this.opacity})`
        : `rgba(34,211,238,${this.opacity})`;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > W) this.speedX *= -1;
      if (this.y < 0 || this.y > H) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  const CONNECTION_DIST = 120;
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
          ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
          ctx.lineWidth   = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  let animFrameId;
  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animFrameId = requestAnimationFrame(animate);
  }

  initParticles();
  animate();

  /* ─── 3. NAVBAR & MOBILE NAVIGATION ─────────────────────── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  let lastScroll  = 0;

  function closeMobileNav() {
    if (hamburger && hamburger.classList.contains('open')) {
      hamburger.classList.remove('open');
      if (navLinks) navLinks.classList.remove('open');
      document.body.classList.remove('nav-open');
    }
  }

  function openMobileNav() {
    if (hamburger && navLinks) {
      hamburger.classList.add('open');
      navLinks.classList.add('open');
      document.body.classList.add('nav-open');
    }
  }

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Auto-close mobile dropdown when user scrolls down
    if (hamburger && hamburger.classList.contains('open') && Math.abs(scrollY - lastScroll) > 8) {
      closeMobileNav();
    }

    lastScroll = scrollY;
  }, { passive: true });

  /* ─── 4. HAMBURGER MENU ────────────────────────────────── */
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (hamburger.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close menu when any nav item is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close when tapping/clicking outside the menu
    document.addEventListener('click', (e) => {
      if (hamburger.classList.contains('open') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        closeMobileNav();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileNav();
      }
    });

    // Close when swiping / scrolling on touch devices
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (hamburger.classList.contains('open') && e.touches && e.touches.length > 0) {
        const touchCurrentY = e.touches[0].clientY;
        if (Math.abs(touchCurrentY - touchStartY) > 25) {
          closeMobileNav();
        }
      }
    }, { passive: true });

    // Clean up if screen is rotated or resized to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMobileNav();
      }
    }, { passive: true });
  }

  /* ─── 5. AOS (ANIMATE ON SCROLL) ──────────────────────── */
  function initAOS() {
    const aosEls = document.querySelectorAll('[data-aos]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el  = entry.target;
          const delay = parseInt(el.dataset.aosDelay || '0', 10);
          setTimeout(() => el.classList.add('aos-animate'), delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' });

    aosEls.forEach(el => {
      // If already in viewport or close to it on load, animate immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('aos-animate');
      } else {
        observer.observe(el);
      }
    });
  }

  /* ─── 6. CRITERIA BAR ANIMATION ────────────────────────── */
  function initCriteriaBars() {
    const fills = document.querySelectorAll('.criteria-fill');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    fills.forEach(el => observer.observe(el));
  }

  /* ─── 7. SMOOTH ACTIVE NAV LINK ────────────────────────── */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinkEls = document.querySelectorAll('.nav-link:not(.nav-cta)');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinkEls.forEach(a => a.style.color = '');
          const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (activeLink) activeLink.style.color = '#a78bfa';
        }
      });
    }, { rootMargin: '-40% 0px -40% 0px' });

    sections.forEach(s => observer.observe(s));
  }

  /* ─── 8. DYNAMIC SPOTLIGHT & 3D TILT ON CARDS ───────────── */
  function initTilt() {
    const tiltEls = document.querySelectorAll('.why-card, .strip-card, .tl-card, .flow-card, .register-card');
    tiltEls.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Set CSS custom properties for radial spotlight beam
        el.style.setProperty('--mouse-x', `${mouseX}px`);
        el.style.setProperty('--mouse-y', `${mouseY}px`);

        // Compute 3D tilt
        const x = (mouseX / rect.width)  - 0.5;
        const y = (mouseY / rect.height) - 0.5;
        el.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';

        // Remove active-hover from connected timeline dot if present
        const item = el.closest('.timeline-item');
        if (item) {
          const dot = item.querySelector('.tl-dot');
          if (dot) dot.classList.remove('active-hover');
        }
      });

      el.addEventListener('mouseenter', () => {
        el.style.transition = 'none';

        // Highlight connected timeline dot
        const item = el.closest('.timeline-item');
        if (item) {
          const dot = item.querySelector('.tl-dot');
          if (dot) dot.classList.add('active-hover');
        }
      });
    });
  }

  /* ─── SCROLL PROGRESS BAR ──────────────────────────────── */
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0) {
        const pct = (window.scrollY / scrollable) * 100;
        bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
      }
    }, { passive: true });
  }

  /* ─── 9. HERO PARALLAX ─────────────────────────────────── */
  function initParallax() {
    const heroImg = document.querySelector('.hero-bg-img');
    const orbs    = document.querySelectorAll('.orb');
    if (!heroImg) return;

    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      heroImg.style.transform = `translateY(${sy * 0.3}px)`;
      orbs.forEach((orb, i) => {
        orb.style.transform = `translateY(${sy * (0.1 + i * 0.05)}px)`;
      });
    });
  }

  /* ─── 10. FLOATING PARTICLES ON MOUSE ─────────────────── */
  function initMouseParticles() {
    if (window.innerWidth <= 768) return;
    const hero = document.querySelector('.hero');
    if (!hero) return;

    hero.addEventListener('mousemove', throttle((e) => {
      const dot = document.createElement('div');
      dot.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 4px; height: 4px;
        border-radius: 50%;
        background: ${Math.random() > 0.5 ? '#8b5cf6' : '#22d3ee'};
        pointer-events: none;
        z-index: 4;
        opacity: 1;
        transition: all 1s ease;
        transform: translate(-50%, -50%);
      `;
      document.body.appendChild(dot);
      requestAnimationFrame(() => {
        dot.style.opacity   = '0';
        dot.style.transform = `translate(${(Math.random()-0.5)*60 - 50}%, ${-Math.random()*60 - 50}%)`;
        dot.style.width     = '2px';
        dot.style.height    = '2px';
      });
      setTimeout(() => dot.remove(), 1000);
    }, 60));
  }

  /* ─── 11. REGISTER BUTTON RIPPLE ───────────────────────── */
  function initRipple() {
    document.querySelectorAll('.btn-primary').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const rect   = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size   = Math.max(rect.width, rect.height);
        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          width: ${size}px; height: ${size}px;
          background: rgba(255,255,255,0.2);
          top: ${e.clientY - rect.top - size/2}px;
          left: ${e.clientX - rect.left - size/2}px;
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        `;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
      });
    });

    const style = document.createElement('style');
    style.textContent = `@keyframes ripple { to { transform: scale(2.5); opacity: 0; } }`;
    document.head.appendChild(style);
  }

  /* ─── 12. TYPING EFFECT FOR HERO TAGLINE ──────────────── */
  function initTypingEffect() {
    const tagline = document.querySelector('.hero-tagline');
    if (!tagline) return;
    const text = tagline.textContent;
    tagline.textContent = '';
    tagline.style.borderRight = '2px solid var(--clr-purple)';
    tagline.style.animation   = 'none';
    let i = 0;
    const type = () => {
      if (i < text.length) {
        tagline.textContent += text[i++];
        setTimeout(type, 35);
      } else {
        tagline.style.borderRight = 'none';
      }
    };
    setTimeout(type, 800);
  }

  /* ─── UTILITY: THROTTLE ────────────────────────────────── */
  function throttle(fn, limit) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= limit) { last = now; fn.apply(this, args); }
    };
  }

  /* ─── INIT ALL ─────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initAOS();
    initCriteriaBars();
    initActiveNav();
    initTilt();
    initParallax();
    initMouseParticles();
    initRipple();
    initTypingEffect();
  });

})();
