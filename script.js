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
    const tiltEls = document.querySelectorAll('.why-card, .strip-card, .tl-card, .flow-card, .register-card, .contributor-card');
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

  /* ─── 13. COORDINATOR CAROUSEL ──────────────────────────── */
  function initCoordinatorCarousel() {
    const track    = document.getElementById('coordinators-track');
    const row      = track ? track.querySelector('.coordinators-cards-row') : null;
    const btnPrev  = document.getElementById('coord-prev');
    const btnNext  = document.getElementById('coord-next');
    const dotsWrap = document.getElementById('coord-dots');
    if (!track || !row) return;

    let currentIndex = 0;
    let hasNudged    = false;

    // Generate pagination dots
    const cards = row.querySelectorAll('.coordinator-card');
    if (dotsWrap && cards.length > 0) {
      dotsWrap.innerHTML = '';
      cards.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to team slide ${idx + 1}`);
        dot.addEventListener('click', () => {
          row.classList.remove('nudge-anim');
          currentIndex = idx;
          update();
        });
        dotsWrap.appendChild(dot);
      });
    }

    function getCardWidth() {
      const card = row.querySelector('.coordinator-card');
      if (!card) return 0;
      const gap = parseFloat(getComputedStyle(row).gap) || 24;
      return card.offsetWidth + gap;
    }

    function getVisibleCount() {
      const w = getCardWidth();
      return w > 0 ? Math.max(1, Math.floor(track.offsetWidth / w)) : 1;
    }

    function update() {
      const total   = row.querySelectorAll('.coordinator-card').length;
      const visible = getVisibleCount();
      const maxIdx  = Math.max(0, total - visible);
      currentIndex  = Math.min(Math.max(0, currentIndex), maxIdx);
      row.style.transform = `translateX(-${currentIndex * getCardWidth()}px)`;
      if (btnPrev) btnPrev.disabled = currentIndex === 0;
      if (btnNext) btnNext.disabled = currentIndex >= maxIdx;

      // Update dots
      if (dotsWrap) {
        const dots = dotsWrap.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentIndex);
        });
      }
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        row.classList.remove('nudge-anim');
        currentIndex--;
        update();
      });
    }
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        row.classList.remove('nudge-anim');
        currentIndex++;
        update();
      });
    }

    // Touch swipe
    let startX = 0;
    let startY = 0;
    row.addEventListener('touchstart', (e) => {
      row.classList.remove('nudge-anim');
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    row.addEventListener('touchend', (e) => {
      const diffX = startX - e.changedTouches[0].clientX;
      const diffY = startY - e.changedTouches[0].clientY;
      if (Math.abs(diffX) > 30 && Math.abs(diffX) > Math.abs(diffY)) {
        diffX > 0 ? currentIndex++ : currentIndex--;
        update();
      }
    });

    // Initial Peek / Nudge Animation when section enters viewport
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasNudged && currentIndex === 0) {
            hasNudged = true;
            row.classList.add('nudge-anim');
            setTimeout(() => {
              row.classList.remove('nudge-anim');
            }, 1800);
            observer.unobserve(track);
          }
        });
      }, { threshold: 0.2 });
      observer.observe(track);
    }

    window.addEventListener('resize', throttle(update, 150));
    update();
  }

  /* ─── TIMELINE SCROLL PROGRESS FILL + CARD GLOW ──────────── */
  function initTimelineProgressFill() {
    const fill = document.getElementById('tl-progress-fill');
    const timelineSection = document.getElementById('timeline');
    const timelineInner = timelineSection
      ? timelineSection.querySelector('.timeline')
      : null;

    if (!fill || !timelineSection || !timelineInner) return;

    // Collect all timeline items with their cards
    const timelineItems = Array.from(
      timelineInner.querySelectorAll('.timeline-item')
    );

    function updateFill() {
      const sectionRect = timelineInner.getBoundingClientRect();
      const totalHeight = timelineInner.offsetHeight;

      // Viewport midpoint that acts as the "reading line"
      const viewMid = window.innerHeight * 0.55;

      // How far the reading line has traveled INTO the timeline
      const progress = viewMid - sectionRect.top;
      const pct = Math.min(100, Math.max(0, (progress / totalHeight) * 100));

      fill.style.height = pct + '%';

      // Hide the pulsing tip dot when nothing has filled yet
      if (pct < 1) {
        fill.classList.add('tl-fill-hidden');
      } else {
        fill.classList.remove('tl-fill-hidden');
      }

      // ── Card glow: find which item the ball tip is touching ──────
      const fillPx = (pct / 100) * totalHeight;
      const tolerance = 80; // px proximity for glow trigger

      let closestItem = null;
      let closestDist = Infinity;

      timelineItems.forEach(item => {
        const card = item.querySelector('.tl-card');
        if (!card) return;
        // Mid-point of item relative to timelineInner top
        const itemMid = item.offsetTop + item.offsetHeight * 0.35;
        const dist = Math.abs(fillPx - itemMid);
        if (dist < closestDist) {
          closestDist = dist;
          closestItem = item;
        }
      });

      // Apply glow only to the closest card within tolerance
      timelineItems.forEach(item => {
        const card = item.querySelector('.tl-card');
        if (!card) return;
        if (item === closestItem && closestDist < tolerance && pct > 0 && pct < 100) {
          card.classList.add('tl-card--active');
        } else {
          card.classList.remove('tl-card--active');
        }
      });
    }

    window.addEventListener('scroll', updateFill, { passive: true });
    window.addEventListener('resize', updateFill, { passive: true });
    updateFill(); // Run once on load
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
    initCoordinatorCarousel();
    initTimelineProgressFill();
  });

})();

/* ==================== VIBEBOT MASCOT CONTROLLER ==================== */
(function initVibeBot() {
  'use strict';

  function setup() {
    const botRoot = document.getElementById('vibebot-container');
    const actorGroup = document.getElementById('vb-actor-group');
    const bubble = document.getElementById('vibebot-bubble');
    const messageSpan = document.getElementById('vibebot-message');
    const menu = document.getElementById('vibebot-menu');
    const particlesContainer = document.getElementById('vibebot-particles');

    const pupilL = document.getElementById('vb-pupil-left');
    const pupilR = document.getElementById('vb-pupil-right');

    const btnNext = document.getElementById('vb-btn-next');
    const btnRegister = document.getElementById('vb-btn-register');
    const btnTip = document.getElementById('vb-btn-tip');
    const btnDance = document.getElementById('vb-btn-dance');

    if (!botRoot || !actorGroup || !pupilL || !pupilR) return;

    // Config & Section Mappings
    const SECTION_IDS = ['top', 'about', 'timeline', 'flow', 'why', 'register', 'contributors'];
    const SECTION_MESSAGES = {
      top: "Welcome to AI VibeX 1.0! Let's vibe!",
      about: "6 intense hours of pure AI innovation!",
      timeline: "Follow the schedule to stay on track!",
      flow: "Understand the hackathon flow: Build & win!",
      why: "Discover why AI VibeX is your launchpad!",
      register: "Register your team! Spots fill fast!",
      contributors: "Meet the visionary team behind the event!"
    };

    const TIPS = [
      "Keep your MVP small and polish the demo!",
      "Test your AI API keys and rate limits early!",
      "A working 2-minute live demo beats 20 slides!",
      "Design for real-world impact and clear problem solving!",
      "Stay hydrated and tap your mentors for rapid unblocking!"
    ];

    // State Variables
    let botX = window.innerWidth + 200; // Flies in from off-screen right
    let botY = 160;
    let targetX = window.innerWidth - 180;
    let targetY = 160;
    let prevBotX = botX;
    let prevBotY = botY;
    let tiltAngle = 0;
    let floatTime = 0;
    let floatOffset = 0;

    let isPointerDown = false;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let dragStartPos = { x: 0, y: 0 };
    let hasDragged = false;
    let isCustomPlaced = false;

    let currentSectionIdx = 0;
    let currentMood = 'happy';
    let isMenuOpen = false;
    let speechTimeout = null;
    let surpriseTimeout = null;
    let lastActivityTime = performance.now();
    let isAsleep = false;

    // Pointer coordinates for pupil tracking
    let mouseScreenX = window.innerWidth / 2;
    let mouseScreenY = window.innerHeight / 2;

    const leftEyeCenter = { x: 53, y: 48 };
    const rightEyeCenter = { x: 87, y: 48 };
    const maxPupilOffset = 3.6;

    function getSectionElements() {
      return SECTION_IDS.map(id => {
        let el = document.getElementById(id);
        if (!el && id === 'top') {
          el = document.getElementById('hero') || document.querySelector('header') || document.body;
        }
        return { id, element: el };
      }).filter(item => item.element !== null);
    }

    function resolveActiveSectionIndex() {
      const sections = getSectionElements();
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      let activeIdx = 0;

      sections.forEach((item, idx) => {
        const top = item.element.offsetTop;
        if (scrollPos >= top) {
          activeIdx = idx;
        }
      });

      return activeIdx;
    }

    function calculateTargetPosition() {
      if (isCustomPlaced || window.innerWidth <= 768) return;

      const isSmallScreen = window.innerWidth < 1300;
      const botWidth = isSmallScreen ? 84 : 140;
      const botHeight = isSmallScreen ? 114 : 190;

      if (isSmallScreen) {
        targetX = window.innerWidth - botWidth - 18;
        targetY = window.innerHeight - botHeight - 20;
        return;
      }

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollRatio = Math.min(1, Math.max(0, window.scrollY / maxScroll));

      // Vertical drift downwards
      const verticalRange = window.innerHeight * 0.45;
      targetY = window.innerHeight * 0.20 + (scrollRatio * verticalRange);

      // Alternating edges: even -> right, odd -> left
      const isEvenSection = currentSectionIdx % 2 === 0;
      if (isEvenSection) {
        targetX = window.innerWidth - botWidth - 36;
      } else {
        targetX = 36;
      }
    }

    function showMessage(text, durationMs = 3200) {
      if (isMenuOpen) closeMenu();
      messageSpan.textContent = text;
      bubble.classList.add('is-visible');

      if (speechTimeout) clearTimeout(speechTimeout);
      if (durationMs > 0) {
        speechTimeout = setTimeout(() => {
          bubble.classList.remove('is-visible');
        }, durationMs);
      }
    }

    function setMood(mood) {
      currentMood = mood;
      botRoot.setAttribute('data-mood', mood);
    }

    function triggerSurprise(tempMessage = null) {
      if (isAsleep) return;
      setMood('wow');
      if (tempMessage) showMessage(tempMessage, 1500);

      if (surpriseTimeout) clearTimeout(surpriseTimeout);
      surpriseTimeout = setTimeout(() => {
        if (!isAsleep) setMood('happy');
      }, 1400);
    }

    function spawnParticle(content, color = '#ff6bd6') {
      const particle = document.createElement('span');
      particle.className = 'vb-particle';
      particle.textContent = content;
      particle.style.color = color;

      const tx = (Math.random() - 0.5) * 60;
      const ty = -40 - Math.random() * 50;
      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      particle.style.left = `${60 + (Math.random() - 0.5) * 20}px`;
      particle.style.top = `${20 + (Math.random() - 0.5) * 20}px`;

      particlesContainer.appendChild(particle);
      setTimeout(() => particle.remove(), 2400);
    }

    // Throw Cute Heart Emojis Within Little Range on Click
    function spawnClickHearts() {
      const hearts = ['💖', '💕', '❤️', '✨'];
      const count = 3;
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const heart = hearts[Math.floor(Math.random() * hearts.length)];
          const particle = document.createElement('span');
          particle.className = 'vb-particle vb-click-heart';
          particle.textContent = heart;

          // Little tight range: +/-18px horizontal, -16px to -36px vertical
          const tx = (Math.random() - 0.5) * 36;
          const ty = -16 - Math.random() * 20;
          particle.style.setProperty('--tx', `${tx}px`);
          particle.style.setProperty('--ty', `${ty}px`);
          particle.style.left = `${58 + (Math.random() - 0.5) * 16}px`;
          particle.style.top = `${36 + (Math.random() - 0.5) * 14}px`;

          particlesContainer.appendChild(particle);
          setTimeout(() => particle.remove(), 1400);
        }, i * 75);
      }
    }

    function openMenu() {
      isMenuOpen = true;
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      bubble.classList.remove('is-visible');
    }

    function closeMenu() {
      isMenuOpen = false;
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
    }

    function scrollToSection(index) {
      const sections = getSectionElements();
      if (index >= 0 && index < sections.length) {
        sections[index].element.scrollIntoView({ behavior: 'smooth' });
      }
    }

    function triggerDance() {
      closeMenu();
      actorGroup.classList.add('vb-dancing');
      showMessage("Let's party! ✨", 3000);

      const heartInterval = setInterval(() => {
        spawnParticle('💖', '#ff6bd6');
      }, 280);

      setTimeout(() => {
        clearInterval(heartInterval);
        actorGroup.classList.remove('vb-dancing');
      }, 3000);
    }

    function triggerBackflip() {
      actorGroup.classList.remove('vb-flip');
      void actorGroup.offsetWidth;
      actorGroup.classList.add('vb-flip');
      showMessage("Wheee! 360° flip!", 2000);

      setTimeout(() => {
        actorGroup.classList.remove('vb-flip');
      }, 850);
    }

    function recordUserActivity() {
      lastActivityTime = performance.now();
      if (isAsleep) {
        isAsleep = false;
        setMood('happy');
        showMessage("Oh! You're back! ⚡", 3000);
      }
    }

    // Single requestAnimationFrame Loop
    function tick() {
      if (window.innerWidth <= 768) {
        requestAnimationFrame(tick);
        return;
      }

      floatTime += 0.04;

      // 1. Idle Sleep Management (after 9s)
      if (!isAsleep && performance.now() - lastActivityTime > 9000) {
        isAsleep = true;
        setMood('sleep');
        showMessage("Zzz...", 0);
      }

      if (isAsleep && Math.random() < 0.02) {
        spawnParticle('z', '#00e5ff');
      }

      // 2. Position Lerp
      if (!isDragging) {
        const lerpFactor = 0.065;
        botX += (targetX - botX) * lerpFactor;
        botY += (targetY - botY) * lerpFactor;
      }

      // 3. Sine Wave Float (only frozen when asleep or actively moving/dragging)
      floatOffset = isAsleep || isDragging ? 0 : Math.sin(floatTime) * 9;

      // 4. Movement Tilt
      const velocityX = botX - prevBotX;
      prevBotX = botX;
      prevBotY = botY;

      const targetTilt = Math.min(18, Math.max(-18, velocityX * 1.6));
      tiltAngle += (targetTilt - tiltAngle) * 0.1;

      botRoot.style.transform = `translate3d(${botX}px, ${botY + floatOffset}px, 0px) rotate(${tiltAngle}deg)`;

      // 5. Eye Pupil Tracking
      if (!isAsleep && currentMood !== 'sleep') {
        const botRect = botRoot.getBoundingClientRect();
        const scale = botRect.width / 140;

        const eyeL_ClientX = botRect.left + leftEyeCenter.x * scale;
        const eyeL_ClientY = botRect.top + leftEyeCenter.y * scale;
        const eyeR_ClientX = botRect.left + rightEyeCenter.x * scale;
        const eyeR_ClientY = botRect.top + rightEyeCenter.y * scale;

        const dxL = mouseScreenX - eyeL_ClientX;
        const dyL = mouseScreenY - eyeL_ClientY;
        const distL = Math.hypot(dxL, dyL) || 1;
        const offsetL = Math.min(maxPupilOffset, distL * 0.035);

        const dxR = mouseScreenX - eyeR_ClientX;
        const dyR = mouseScreenY - eyeR_ClientY;
        const distR = Math.hypot(dxR, dyR) || 1;
        const offsetR = Math.min(maxPupilOffset, distR * 0.035);

        pupilL.setAttribute('cx', (leftEyeCenter.x + (dxL / distL) * offsetL).toFixed(2));
        pupilL.setAttribute('cy', (leftEyeCenter.y + (dyL / distL) * offsetL).toFixed(2));

        pupilR.setAttribute('cx', (rightEyeCenter.x + (dxR / distR) * offsetR).toFixed(2));
        pupilR.setAttribute('cy', (rightEyeCenter.y + (dyR / distR) * offsetR).toFixed(2));
      }

      requestAnimationFrame(tick);
    }

    // Natural Blink Interval
    function scheduleBlink() {
      const nextBlinkMs = 2800 + Math.random() * 3200;
      setTimeout(() => {
        if (!isAsleep && currentMood !== 'sleep') {
          botRoot.classList.add('is-blinking');
          setTimeout(() => {
            botRoot.classList.remove('is-blinking');
            scheduleBlink();
          }, 140);
        } else {
          scheduleBlink();
        }
      }, nextBlinkMs);
    }

    // Pointer Dragging & Touch Handling
    botRoot.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.vibebot-menu')) return;

      recordUserActivity();
      isPointerDown = true;
      isDragging = false;
      hasDragged = false;
      dragStartPos = { x: e.clientX, y: e.clientY };
      // Include current floatOffset so position remains 100% intact if dragged
      dragOffset = {
        x: e.clientX - botX,
        y: e.clientY - (botY + floatOffset)
      };

      botRoot.setPointerCapture(e.pointerId);
    });

    window.addEventListener('pointermove', (e) => {
      mouseScreenX = e.clientX;
      mouseScreenY = e.clientY;
      recordUserActivity();

      if (isPointerDown) {
        const movedDist = Math.hypot(e.clientX - dragStartPos.x, e.clientY - dragStartPos.y);
        if (movedDist > 6) {
          if (!hasDragged) {
            hasDragged = true;
            isDragging = true;
            // Mouth looks like saying "Ohhh" :O while moving!
            setMood('wow');
            showMessage("Ohhh! 😮", 0);
          }
          botX = e.clientX - dragOffset.x;
          botY = e.clientY - dragOffset.y;
          targetX = botX;
          targetY = botY;
        }
      }
    });

    let lastTapTime = 0;
    let singleTapTimeout = null;

    botRoot.addEventListener('pointerup', (e) => {
      if (!isPointerDown) return;
      isPointerDown = false;

      try {
        botRoot.releasePointerCapture(e.pointerId);
      } catch (_) {}

      if (hasDragged) {
        isDragging = false;
        isCustomPlaced = true;
        showMessage("Wheee! 🚀", 2000);
        setTimeout(() => {
          if (!isAsleep && currentMood === 'wow') {
            setMood('happy');
          }
        }, 1500);
      } else {
        // Intact Click/Tap: throw heart emojis in a little range
        spawnClickHearts();

        if (!e.target.closest('.vibebot-menu')) {
          const now = performance.now();
          const tapInterval = now - lastTapTime;

          if (tapInterval < 320 && tapInterval > 30) {
            // Double-tap detected
            lastTapTime = 0;
            if (singleTapTimeout) {
              clearTimeout(singleTapTimeout);
              singleTapTimeout = null;
            }
            closeMenu();
            recordUserActivity();
            triggerBackflip();
          } else {
            lastTapTime = now;
            if (singleTapTimeout) clearTimeout(singleTapTimeout);
            singleTapTimeout = setTimeout(() => {
              if (!hasDragged) {
                if (isMenuOpen) {
                  closeMenu();
                } else {
                  openMenu();
                }
              }
            }, 250);
          }
        }
      }
    });

    botRoot.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      if (singleTapTimeout) {
        clearTimeout(singleTapTimeout);
        singleTapTimeout = null;
      }
      closeMenu();
      recordUserActivity();
      triggerBackflip();
    });

    document.addEventListener('click', (e) => {
      if (isMenuOpen && !e.target.closest('#vibebot-container')) {
        closeMenu();
      }
    });

    // Menu Actions
    if (btnNext) {
      btnNext.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
        const sections = getSectionElements();
        const nextIdx = (currentSectionIdx + 1) % sections.length;
        scrollToSection(nextIdx);
      });
    }

    if (btnRegister) {
      btnRegister.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
        const regSection = document.getElementById('register');
        if (regSection) regSection.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (btnTip) {
      btnTip.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
        const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];
        showMessage(`💡 ${randomTip}`, 4200);
        triggerSurprise();
      });
    }

    if (btnDance) {
      btnDance.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerDance();
      });
    }

    // Scroll & Section Tracking
    window.addEventListener('scroll', () => {
      recordUserActivity();
      const newIdx = resolveActiveSectionIndex();

      if (newIdx !== currentSectionIdx) {
        currentSectionIdx = newIdx;
        isCustomPlaced = false;

        const sections = getSectionElements();
        const activeSection = sections[currentSectionIdx];
        if (activeSection && SECTION_MESSAGES[activeSection.id]) {
          showMessage(SECTION_MESSAGES[activeSection.id], 3000);
        }
      }

      calculateTargetPosition();
    }, { passive: true });

    window.addEventListener('resize', calculateTargetPosition, { passive: true });

    // Hover Reactions on External Elements
    const interactiveButtons = document.querySelectorAll('button:not(.vibebot-btn), a.btn, a.btn-primary, a.btn-secondary, a.nav-cta, .carousel-btn');
    interactiveButtons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        triggerSurprise();
      });
    });

    const teamCards = document.querySelectorAll('.contributor-card, .coordinator-card, .leadership-card');
    teamCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (isAsleep) return;
        const nameEl = card.querySelector('.contributor-name') || card.querySelector('h3');
        const name = nameEl ? nameEl.textContent.trim() : 'our team';
        setMood('love');
        showMessage(`Say hi to ${name}! 💖`, 2600);
        spawnParticle('💖', '#ff6bd6');
      });

      card.addEventListener('mouseleave', () => {
        if (!isAsleep) {
          setTimeout(() => {
            if (!isAsleep && currentMood === 'love') setMood('happy');
          }, 1200);
        }
      });
    });

    // Initial positioning and greet
    currentSectionIdx = resolveActiveSectionIndex();
    calculateTargetPosition();

    setTimeout(() => {
      const sections = getSectionElements();
      const activeSection = sections[currentSectionIdx];
      const initialMsg = activeSection && SECTION_MESSAGES[activeSection.id]
        ? SECTION_MESSAGES[activeSection.id]
        : "Welcome to AI VibeX 1.0! Let's vibe!";
      showMessage(initialMsg, 3500);
    }, 900);

    scheduleBlink();
    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();

