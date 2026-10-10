/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   AI VibeX â€” script.js
   Particle canvas, cursor tracking, scroll animations,
   navbar behaviour, AOS, hamburger menu, criteria bars
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

(function () {
  'use strict';

  /* â”€â”€â”€ 1. CUSTOM CURSOR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
      // Dot: instant (no lerp â€” crisp exact tracking)
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

  /* â”€â”€â”€ 2. PARTICLE CANVAS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* â”€â”€â”€ 3. NAVBAR & MOBILE NAVIGATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* â”€â”€â”€ 4. HAMBURGER MENU â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* â”€â”€â”€ 5. AOS (ANIMATE ON SCROLL) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* â”€â”€â”€ 6. CRITERIA BAR ANIMATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* â”€â”€â”€ 7. SMOOTH ACTIVE NAV LINK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* â”€â”€â”€ 8. DYNAMIC SPOTLIGHT & 3D TILT ON CARDS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* â”€â”€â”€ SCROLL PROGRESS BAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* â”€â”€â”€ 9. HERO PARALLAX â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* â”€â”€â”€ 10. FLOATING PARTICLES ON MOUSE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* â”€â”€â”€ 11. REGISTER BUTTON RIPPLE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* â”€â”€â”€ 12. TYPING EFFECT FOR HERO TAGLINE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* â”€â”€â”€ UTILITY: THROTTLE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function throttle(fn, limit) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= limit) { last = now; fn.apply(this, args); }
    };
  }

  /* â”€â”€â”€ 13. COORDINATOR CAROUSEL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* â”€â”€â”€ TIMELINE SCROLL PROGRESS FILL + CARD GLOW â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

      // â”€â”€ Card glow: find which item the ball tip is touching â”€â”€â”€â”€â”€â”€
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

  /* â”€â”€â”€ INIT ALL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

/* ==================== HERO SPACE CANVAS ==================== */
(function initHeroSpace() {
  'use strict';

  const canvas = document.getElementById('hero-space-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const heroEl = document.getElementById('hero') || canvas;

  canvas.style.pointerEvents = 'auto';
  canvas.style.cursor = 'crosshair';

  let W = 0, H = 0;
  // Normalized parallax target (-0.5 to +0.5)
  let targetNX = 0, targetNY = 0;
  // Canvas pixel coordinates of cursor
  let mouseCX = -9999, mouseCY = -9999;
  let isMouseOver = false;
  // Smoothed parallax offset (represents camera pan across deep space)
  let parallaxX = 0, parallaxY = 0;

  // Mouse hold / Black Hole vortex state
  let isMouseDown = false;
  let mouseHoldTime = 0;
  const blackHole = {
    active: false,
    x: 0,
    y: 0,
    power: 0,      // 0..1
    targetPower: 0,
    angle: 0
  };

  // Direct star hit radius (star only glows when cursor is directly over it)
  const STAR_HIT_RADIUS = 16;

  // Cursor comet trail
  const trail = [];
  const TRAIL_LEN = 26;

  // Expanding ripple shockwaves
  const ripples = [];

  // Cosmic stardust particles
  const dust = [];
  const MAX_DUST = 180;

  // Periodic and triggered shooting stars
  let shooters = [];
  const MAX_SHOOTERS = 5;
  let shooterTimer = 0;

  // Asteroid belt
  let asteroids = [];

  // Stars array
  let stars = [];
  const STAR_COUNT = window.innerWidth < 768 ? 160 : 360;

  // Nebulae array
  let nebulae = [];

  // Planets array
  let planets = [];

  // --- Resize Canvas ---
  function resize() {
    const rect = (heroEl || canvas).getBoundingClientRect();
    W = canvas.width  = Math.max(300, Math.floor(rect.width  || window.innerWidth));
    H = canvas.height = Math.max(300, Math.floor(rect.height || window.innerHeight));
    buildScene();
  }

  // --- Pointer & Touch Tracking ---
  function updatePointerPos(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    mouseCX = clientX - rect.left;
    mouseCY = clientY - rect.top;

    if (W > 0 && H > 0) {
      targetNX = (mouseCX / W) - 0.5;
      targetNY = (mouseCY / H) - 0.5;
      targetNX = Math.max(-0.6, Math.min(0.6, targetNX));
      targetNY = Math.max(-0.6, Math.min(0.6, targetNY));
    }
    isMouseOver = true;

    // Push comet trail point
    trail.push({ x: mouseCX, y: mouseCY, age: 0 });
    if (trail.length > TRAIL_LEN) trail.shift();

    // Spawn subtle cosmic stardust as cursor moves
    if (Math.random() < 0.45 && dust.length < MAX_DUST) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.9 + 0.3;
      dust.push({
        x: mouseCX + (Math.random() - 0.5) * 8,
        y: mouseCY + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: Math.random() * 1.5 + 0.6,
        alpha: 0.85,
        decay: 0.018 + Math.random() * 0.012,
        color: ['#00d4ff', '#7c5cff', '#ec4899', '#ffffff', '#ffd166'][Math.floor(Math.random() * 5)]
      });
    }
  }

  // Listen on hero container so hovering titles or buttons NEVER stops mouse tracking
  heroEl.addEventListener('mousemove', e => {
    updatePointerPos(e.clientX, e.clientY);
  });

  heroEl.addEventListener('mouseleave', () => {
    isMouseOver = false;
    targetNX = 0;
    targetNY = 0;
    mouseCX = -9999;
    mouseCY = -9999;
    trail.length = 0;
    isMouseDown = false;
    blackHole.targetPower = 0;
  });

  // Touch Support
  heroEl.addEventListener('touchstart', e => {
    if (e.touches.length > 0) {
      updatePointerPos(e.touches[0].clientX, e.touches[0].clientY);
      isMouseDown = true;
      mouseHoldTime = 0;
      blackHole.x = mouseCX;
      blackHole.y = mouseCY;
      blackHole.targetPower = 1;
    }
  }, { passive: true });

  heroEl.addEventListener('touchmove', e => {
    if (e.touches.length > 0) {
      updatePointerPos(e.touches[0].clientX, e.touches[0].clientY);
      if (isMouseDown) {
        blackHole.x = mouseCX;
        blackHole.y = mouseCY;
      }
    }
  }, { passive: true });

  heroEl.addEventListener('touchend', () => {
    triggerSupernova();
  });

  // Mouse Down: Start Gravitational Singularity / Black Hole
  heroEl.addEventListener('mousedown', e => {
    if (e.button === 0) { // left click
      isMouseDown = true;
      mouseHoldTime = 0;
      blackHole.x = mouseCX;
      blackHole.y = mouseCY;
      blackHole.targetPower = 1;
    }
  });

  // Trigger cosmic burst when releasing mouse
  function triggerSupernova() {
    if (!isMouseDown && blackHole.power < 0.1) return;

    const hadStrongCharge = blackHole.power > 0.35 || mouseHoldTime > 15;
    const burstX = (mouseCX > -9000) ? mouseCX : (W * 0.5);
    const burstY = (mouseCY > -9000) ? mouseCY : (H * 0.5);

    isMouseDown = false;
    blackHole.targetPower = 0;

    // Fast click ripples
    ripples.push({
      x: burstX,
      y: burstY,
      r: 6,
      maxR: hadStrongCharge ? 340 : 220,
      alpha: 0.95,
      color: '#00d4ff'
    });

    ripples.push({
      x: burstX,
      y: burstY,
      r: 4,
      maxR: hadStrongCharge ? 250 : 160,
      alpha: 0.75,
      color: '#a855f7',
      delay: 4
    });

    if (hadStrongCharge) {
      // Supernova explosion: dense outward stardust blast
      const sparkCount = 36;
      for (let i = 0; i < sparkCount; i++) {
        const ang = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.2;
        const spd = Math.random() * 5 + 3;
        dust.push({
          x: burstX,
          y: burstY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          r: Math.random() * 2.2 + 1,
          alpha: 1,
          decay: 0.02,
          color: ['#00d4ff', '#38bdf8', '#c084fc', '#f472b6', '#ffffff'][Math.floor(Math.random() * 5)]
        });
      }
    }

    // Launch shooting meteors radiating from click / release
    const meteorCount = hadStrongCharge ? 3 : 1;
    for (let k = 0; k < meteorCount; k++) {
      const angle = (Math.PI * 2 * Math.random());
      const speed = 4 + Math.random() * 3.5;
      shooters.push({
        x: burstX,
        y: burstY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: 110 + Math.random() * 70,
        alpha: 1,
        r: 1.6,
        color: '#ffffff'
      });
    }
  }

  window.addEventListener('mouseup', () => {
    triggerSupernova();
  });

  // --- Stars Setup with 3 Depth Tiers for Dynamic Space Parallax ---
  function makeStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const tier = Math.random();
      // Depth plane configuration:
      // Foreground: large, fast parallax movement across screen
      // Midground: medium stars
      // Background: tiny, distant stars
      let baseR, depth;
      if (tier > 0.88) {
        baseR = Math.random() * 1.5 + 1.2;
        depth = 0.32 + Math.random() * 0.12; // foreground: strong space motion
      } else if (tier > 0.55) {
        baseR = Math.random() * 0.8 + 0.5;
        depth = 0.18 + Math.random() * 0.08; // midground
      } else {
        baseR = Math.random() * 0.4 + 0.15;
        depth = 0.06 + Math.random() * 0.06; // deep background
      }

      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        baseR: baseR,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.012 + 0.005,
        color: ['#ffffff', '#c8e8ff', '#ffe8c8', '#cdb4ff', '#b3f0ff', '#fce7f3'][Math.floor(Math.random() * 6)],
        parallaxDepth: depth,
        drift: (Math.random() - 0.5) * 0.03,
        driftY: (Math.random() - 0.5) * 0.015,
        hovered: 0, // ONLY grows when cursor is DIRECTLY over this star!
        flareCooldown: 0
      });
    }
  }

  // Calculate current screen coordinates for any star with wrap-around space movement
  function getStarCoords(s, t) {
    const timeDriftX = (s.drift * (t || 0) * 0.001);
    const timeDriftY = (s.driftY * (t || 0) * 0.001);

    // Camera moves with mouse: moving right pans camera right, so celestial bodies shift left
    let px = s.x - (parallaxX * s.parallaxDepth * W) + timeDriftX;
    let py = s.y - (parallaxY * (s.parallaxDepth * 0.5) * H) + timeDriftY;

    // Seamless toroidal wrap-around so stars never run out when panning left/right
    if (W > 0) px = ((px % W) + W) % W;
    if (H > 0) py = ((py % H) + H) % H;

    return { px, py };
  }

  // Update Star Hover:
  // Strict direct hit test: stars do NOT glow from general area proximity,
  // ONLY the specific star directly under the mouse pointer glows!
  function updateStarHover(t) {
    stars.forEach(s => {
      const { px, py } = getStarCoords(s, t);
      const dx = mouseCX - px;
      const dy = mouseCY - py;
      const dist = Math.hypot(dx, dy);

      // Strict hit distance for direct hover
      const hitR = Math.max(STAR_HIT_RADIUS, s.baseR * 5);

      if (isMouseOver && dist <= hitR) {
        // Direct hover on this specific star!
        s.hovered = Math.min(1, s.hovered + 0.18);

        // Emit micro solar flare sparkles from this star
        if (s.flareCooldown <= 0) {
          s.flareCooldown = 18;
          if (dust.length < MAX_DUST) {
            const count = s.baseR > 1.1 ? 3 : 1;
            for (let k = 0; k < count; k++) {
              const a = Math.random() * Math.PI * 2;
              const spd = 0.6 + Math.random() * 1.4;
              dust.push({
                x: px,
                y: py,
                vx: Math.cos(a) * spd,
                vy: Math.sin(a) * spd,
                r: Math.random() * 1.4 + 0.7,
                alpha: 0.95,
                decay: 0.025,
                color: s.color
              });
            }
          }
        }
      } else {
        // Smoothly fade back down
        s.hovered = Math.max(0, s.hovered - 0.06);
      }

      if (s.flareCooldown > 0) s.flareCooldown--;
    });
  }

  // Render Stars
  function drawStars(t) {
    stars.forEach(s => {
      const { px, py } = getStarCoords(s, t);
      const twinkle = 0.55 + 0.45 * Math.sin(s.phase + t * s.speed);
      const alpha = Math.min(1, twinkle + s.hovered * 0.5);
      const drawR = s.baseR * (1 + s.hovered * 1.5);

      ctx.save();
      ctx.globalAlpha = alpha;

      // Base glow for larger stars in background
      if (s.baseR > 1.0) {
        const glowR = drawR * 3;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, glowR);
        grad.addColorStop(0, s.color + 'aa');
        grad.addColorStop(1, s.color + '00');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, glowR, 0, Math.PI * 2);
        ctx.fill();
      }

      // DIRECT HOVER SPECIAL EFFECT:
      // Intense radial aura + James Webb / Hubble telescope diffraction spikes!
      if (s.hovered > 0.04) {
        const auraR = drawR * (8 + s.hovered * 8);
        const auraGrad = ctx.createRadialGradient(px, py, 0, px, py, auraR);
        auraGrad.addColorStop(0, '#ffffff');
        auraGrad.addColorStop(0.25, s.color);
        auraGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(px, py, auraR, 0, Math.PI * 2);
        ctx.fill();

        // 4-point primary diffraction spikes
        const spikeLen = drawR * (10 + s.hovered * 14);
        ctx.save();
        ctx.globalAlpha = s.hovered * 0.9;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = Math.max(0.8, drawR * 0.6);
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 14 * s.hovered;

        [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5].forEach(ang => {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + Math.cos(ang) * spikeLen, py + Math.sin(ang) * spikeLen);
          ctx.stroke();
        });

        // 4-point secondary diagonal spikes
        ctx.globalAlpha = s.hovered * 0.45;
        ctx.lineWidth = Math.max(0.4, drawR * 0.3);
        [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75].forEach(ang => {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + Math.cos(ang) * spikeLen * 0.55, py + Math.sin(ang) * spikeLen * 0.55);
          ctx.stroke();
        });
        ctx.restore();
      }

      // Star core circle
      ctx.fillStyle = s.hovered > 0.2 ? '#ffffff' : s.color;
      ctx.beginPath();
      ctx.arc(px, py, drawR, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  // --- Constellation Lines between hovered / close stars ---
  function drawConstellation(t) {
    if (!isMouseOver) return;

    // Filter stars that are either hovered or within tight proximity
    const cluster = stars.filter(s => {
      if (s.hovered > 0.05) return true;
      const { px, py } = getStarCoords(s, t);
      return Math.hypot(mouseCX - px, mouseCY - py) < 80;
    });

    if (cluster.length < 2) return;

    for (let i = 0; i < cluster.length; i++) {
      for (let j = i + 1; j < cluster.length; j++) {
        const a = cluster[i];
        const b = cluster[j];
        const posA = getStarCoords(a, t);
        const posB = getStarCoords(b, t);
        const dist = Math.hypot(posA.px - posB.px, posA.py - posB.py);

        if (dist < 120) {
          const strength = Math.max(a.hovered, b.hovered, 0.35);
          const lineAlpha = (1 - dist / 120) * strength * 0.75;
          const shimmer = 0.7 + 0.3 * Math.sin(t * 0.005 + i + j);

          ctx.save();
          ctx.globalAlpha = lineAlpha * shimmer;
          ctx.strokeStyle = '#00d4ff';
          ctx.lineWidth = 1;
          ctx.shadowColor = '#00d4ff';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.moveTo(posA.px, posA.py);
          ctx.lineTo(posB.px, posB.py);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  // --- Interactive Black Hole / Singularity Vortex ---
  function updateBlackHole() {
    if (isMouseDown) {
      mouseHoldTime++;
      blackHole.x = mouseCX;
      blackHole.y = mouseCY;
      blackHole.targetPower = Math.min(1, mouseHoldTime / 25);
    } else {
      blackHole.targetPower = 0;
    }

    blackHole.power += (blackHole.targetPower - blackHole.power) * 0.12;
    blackHole.angle += 0.05 + blackHole.power * 0.1;

    // Pull cosmic stardust into the black hole vortex
    if (blackHole.power > 0.08) {
      dust.forEach(d => {
        const dx = blackHole.x - d.x;
        const dy = blackHole.y - d.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 260 && dist > 10) {
          const force = (1 - dist / 260) * 0.75 * blackHole.power;
          // Inward gravitational pull + orbital swirl
          d.vx += (dx / dist) * force * 2.2 - (dy / dist) * force * 1.5;
          d.vy += (dy / dist) * force * 2.2 + (dx / dist) * force * 1.5;
        }
      });
    }
  }

  function drawBlackHole(t) {
    if (blackHole.power < 0.02) return;

    const p = blackHole.power;
    const bx = blackHole.x;
    const by = blackHole.y;
    const coreR = (14 + p * 22);

    ctx.save();

    // 1. Gravitational lensing halo
    const lensR = coreR * (3.8 + Math.sin(t * 0.008) * 0.3);
    const lensGrad = ctx.createRadialGradient(bx, by, coreR * 0.9, bx, by, lensR);
    lensGrad.addColorStop(0, 'rgba(0, 212, 255, 0)');
    lensGrad.addColorStop(0.35, `rgba(168, 85, 247, ${0.45 * p})`);
    lensGrad.addColorStop(0.7, `rgba(0, 212, 255, ${0.35 * p})`);
    lensGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = lensGrad;
    ctx.beginPath();
    ctx.arc(bx, by, lensR, 0, Math.PI * 2);
    ctx.fill();

    // 2. Swirling Accretion Disk
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(blackHole.angle);

    for (let ring = 0; ring < 3; ring++) {
      const rx = coreR * (1.8 + ring * 0.5);
      const ry = coreR * (0.6 + ring * 0.2);
      ctx.save();
      ctx.globalAlpha = p * (0.65 - ring * 0.15);
      ctx.strokeStyle = ring === 0 ? '#38bdf8' : (ring === 1 ? '#c084fc' : '#f472b6');
      ctx.lineWidth = 3 - ring * 0.8;
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, ring * 0.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();

    // 3. Event Horizon (deep pitch-black void with glowing photon ring)
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 16 * p;
    ctx.fillStyle = '#010207';
    ctx.beginPath();
    ctx.arc(bx, by, coreR, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright rim (photon sphere)
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.85 * p})`;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(bx, by, coreR + 1, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  // --- Cosmic Stardust & Particle Dust ---
  function updateDust() {
    for (let i = dust.length - 1; i >= 0; i--) {
      const d = dust[i];
      d.x += d.vx;
      d.y += d.vy;
      d.vx *= 0.96;
      d.vy *= 0.96;
      d.alpha -= d.decay;

      if (d.alpha <= 0) {
        dust.splice(i, 1);
      }
    }
  }

  function drawDust() {
    dust.forEach(d => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, d.alpha));
      ctx.fillStyle = d.color;
      ctx.shadowColor = d.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  // --- Asteroids Belt with Space Motion ---
  function makeAsteroids() {
    asteroids = [];
    const count = window.innerWidth < 768 ? 4 : 7;
    for (let i = 0; i < count; i++) {
      const radius = 9 + Math.random() * 14;
      const numPoints = 8 + Math.floor(Math.random() * 4);
      const vertices = [];
      for (let p = 0; p < numPoints; p++) {
        const ang = (Math.PI * 2 * p) / numPoints;
        const dist = radius * (0.75 + Math.random() * 0.45);
        vertices.push({ x: Math.cos(ang) * dist, y: Math.sin(ang) * dist });
      }

      asteroids.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25 - 0.15,
        vy: (Math.random() - 0.5) * 0.18 + 0.1,
        radius: radius,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        vertices: vertices,
        craters: [
          { ox: (Math.random() - 0.5) * radius * 0.6, oy: (Math.random() - 0.5) * radius * 0.6, r: radius * 0.18 },
          { ox: (Math.random() - 0.5) * radius * 0.6, oy: (Math.random() - 0.5) * radius * 0.6, r: radius * 0.12 }
        ],
        pf: 0.22 + Math.random() * 0.12 // foreground depth
      });
    }
  }

  function updateAsteroids() {
    asteroids.forEach(ast => {
      ast.x += ast.vx;
      ast.y += ast.vy;
      ast.rotation += ast.rotSpeed;

      // Wrap around edges
      if (ast.x < -80) ast.x = W + 80;
      if (ast.x > W + 80) ast.x = -80;
      if (ast.y < -80) ast.y = H + 80;
      if (ast.y > H + 80) ast.y = -80;

      // Interactive gentle push away from cursor
      if (isMouseOver) {
        const ax = ast.x - (parallaxX * ast.pf * W);
        const ay = ast.y - (parallaxY * ast.pf * 0.5 * H);
        const dx = ax - mouseCX;
        const dy = ay - mouseCY;
        const d = Math.hypot(dx, dy);
        if (d < 90 && d > 1) {
          ast.x += (dx / d) * 0.8;
          ast.y += (dy / d) * 0.8;
        }
      }
    });
  }

  function drawAsteroids() {
    asteroids.forEach(ast => {
      let ax = ast.x - (parallaxX * ast.pf * W);
      let ay = ast.y - (parallaxY * ast.pf * 0.5 * H);
      if (W > 0) ax = ((ax % (W + 160)) + (W + 160)) % (W + 160) - 80;
      if (H > 0) ay = ((ay % (H + 160)) + (H + 160)) % (H + 160) - 80;

      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate(ast.rotation);

      // Shaded 3D Rock Silhouette
      const grad = ctx.createRadialGradient(-ast.radius * 0.3, -ast.radius * 0.3, 0, 0, 0, ast.radius * 1.3);
      grad.addColorStop(0, '#575f7a');
      grad.addColorStop(0.5, '#2e3347');
      grad.addColorStop(1, '#111422');

      ctx.fillStyle = grad;
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(ast.vertices[0].x, ast.vertices[0].y);
      for (let i = 1; i < ast.vertices.length; i++) {
        ctx.lineTo(ast.vertices[i].x, ast.vertices[i].y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Craters
      ast.craters.forEach(cr => {
        ctx.fillStyle = 'rgba(15, 17, 28, 0.7)';
        ctx.beginPath();
        ctx.arc(cr.ox, cr.oy, cr.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    });
  }

  // --- Cursor Comet Trail ---
  function drawCursorTrail() {
    if (trail.length < 2) return;
    for (let i = 1; i < trail.length; i++) {
      const a = trail[i - 1];
      const b = trail[i];
      const pct = i / trail.length;
      ctx.save();
      ctx.globalAlpha = pct * 0.7;
      ctx.strokeStyle = `hsl(${185 + pct * 75}, 100%, ${60 + pct * 20}%)`;
      ctx.lineWidth = pct * 3.5;
      ctx.lineCap = 'round';
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 10 * pct;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.restore();
    }

    // Glowing orb at tip
    if (isMouseOver && mouseCX > -9000) {
      const grad = ctx.createRadialGradient(mouseCX, mouseCY, 0, mouseCX, mouseCY, 24);
      grad.addColorStop(0, 'rgba(0,212,255,0.95)');
      grad.addColorStop(0.35, 'rgba(124,92,255,0.45)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(mouseCX, mouseCY, 24, 0, Math.PI * 2);
      ctx.fill();

      // Inner brilliant core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(mouseCX, mouseCY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- Ripple Shockwaves ---
  function updateRipples() {
    ripples.forEach(r => {
      if (r.delay > 0) { r.delay--; return; }
      r.r += (r.maxR - r.r) * 0.08 + 1.8;
      r.alpha -= 0.024;
    });
    for (let i = ripples.length - 1; i >= 0; i--) {
      if (ripples[i].alpha <= 0) ripples.splice(i, 1);
    }
  }

  function drawRipples() {
    ripples.forEach(r => {
      if (r.delay > 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, r.alpha));
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = r.color;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });
  }

  // --- Nebula Clouds with Space Parallax ---
  function makeNebulae() {
    nebulae = [
      { x: 0.18, y: 0.25, rx: 0.22, ry: 0.14, r1: 139, g1: 92, b1: 246, a1: 0.09, r2: 34, g2: 211, b2: 238, a2: 0.04, pf: 0.12 },
      { x: 0.78, y: 0.60, rx: 0.26, ry: 0.18, r1: 236, g1: 72, b1: 153, a1: 0.08, r2: 139, g2: 92, b2: 246, a2: 0.04, pf: 0.10 },
      { x: 0.50, y: 0.82, rx: 0.30, ry: 0.12, r1: 34, g1: 211, b1: 238, a1: 0.07, r2: 139, g2: 92, b2: 246, a2: 0.03, pf: 0.08 },
      { x: 0.85, y: 0.20, rx: 0.18, ry: 0.12, r1: 139, g1: 92, b1: 246, a1: 0.08, r2: 34, g2: 211, b2: 238, a2: 0.03, pf: 0.14 },
    ];
  }

  function drawNebulae() {
    nebulae.forEach(n => {
      let cx = n.x * W - (parallaxX * n.pf * W);
      let cy = n.y * H - (parallaxY * n.pf * 0.5 * H);
      if (W > 0) cx = ((cx % W) + W) % W;
      if (H > 0) cy = ((cy % H) + H) % H;

      const rx = n.rx * W, ry = n.ry * H;
      let boost = 1;
      if (isMouseOver) {
        const d = Math.hypot(mouseCX - cx, mouseCY - cy);
        boost = 1 + Math.max(0, 1 - d / (W * 0.35)) * 1.4;
      }
      ctx.save();
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
      const a1 = Math.min(0.3, n.a1 * boost);
      grad.addColorStop(0, `rgba(${n.r1},${n.g1},${n.b1},${a1.toFixed(3)})`);
      grad.addColorStop(0.5, `rgba(${n.r2},${n.g2},${n.b2},${n.a2})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.scale(1, ry / Math.max(rx, ry));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy * (Math.max(rx, ry) / ry), rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  // --- Planets & Moons with Space Parallax ---
  function makePlanets() {
    planets = [
      {
        x: 0.82, y: 0.18, r: 38, pf: 0.28,
        color: '#4a3080', glow: 'rgba(139,92,246,0.55)',
        ring: true, ringColor: 'rgba(180,140,255,0.4)',
        moons: [{ dist: 58, r: 6, phase: 0.8, speed: 0.0007, color: '#c8e8ff' }]
      },
      {
        x: 0.10, y: 0.70, r: 22, pf: 0.20,
        color: '#0e4a6e', glow: 'rgba(34,211,238,0.5)',
        ring: false, moons: []
      },
      {
        x: 0.65, y: 0.88, r: 14, pf: 0.36,
        color: '#6e0e3a', glow: 'rgba(236,72,153,0.45)',
        ring: false,
        moons: [{ dist: 22, r: 3.5, phase: 2.0, speed: 0.0014, color: '#ffd6e8' }]
      }
    ];
  }

  function drawPlanets(t) {
    planets.forEach(p => {
      let px = p.x * W - (parallaxX * p.pf * W);
      let py = p.y * H - (parallaxY * p.pf * 0.5 * H);
      if (W > 0) px = ((px % W) + W) % W;
      if (H > 0) py = ((py % H) + H) % H;

      let hoverBoost = 0;
      if (isMouseOver) {
        const d = Math.hypot(mouseCX - px, mouseCY - py);
        hoverBoost = Math.max(0, 1 - d / (p.r * 5));
      }

      // Outer Glow
      const glowR = p.r * (2.4 + hoverBoost * 1.8);
      const gGrad = ctx.createRadialGradient(px, py, p.r * 0.6, px, py, glowR);
      gGrad.addColorStop(0, p.glow);
      gGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gGrad;
      ctx.beginPath();
      ctx.arc(px, py, glowR, 0, Math.PI * 2);
      ctx.fill();

      // Planet Sphere Body (CRASH-PROOF integer shading)
      const bGrad = ctx.createRadialGradient(px - p.r * 0.3, py - p.r * 0.3, 0, px, py, p.r);
      bGrad.addColorStop(0, shadeColor(p.color, Math.round(60 + hoverBoost * 30)));
      bGrad.addColorStop(0.6, p.color);
      bGrad.addColorStop(1, shadeColor(p.color, -40));
      ctx.fillStyle = bGrad;
      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric Rim
      ctx.save();
      ctx.globalAlpha = 0.35 + hoverBoost * 0.45;
      ctx.strokeStyle = p.glow;
      ctx.lineWidth = 2 + hoverBoost * 3;
      ctx.shadowColor = p.glow;
      ctx.shadowBlur = 10 + hoverBoost * 22;
      ctx.beginPath();
      ctx.arc(px, py, p.r + 1.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Rings
      if (p.ring) {
        ctx.save();
        ctx.globalAlpha = 0.6 + hoverBoost * 0.25;
        ctx.strokeStyle = p.ringColor;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.ellipse(px, py, p.r * 1.85, p.r * 0.42, Math.PI * 0.18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 0.25;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(px, py, p.r * 2.1, p.r * 0.5, Math.PI * 0.18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Orbiting Moons
      p.moons.forEach(m => {
        const angle = m.phase + t * m.speed;
        const mx = px + Math.cos(angle) * m.dist;
        const my = py + Math.sin(angle) * m.dist * 0.42;
        ctx.fillStyle = m.color;
        ctx.beginPath();
        ctx.arc(mx, my, m.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.globalAlpha = 0.4;
        const mg = ctx.createRadialGradient(mx, my, 0, mx, my, m.r * 3);
        mg.addColorStop(0, m.color);
        mg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = mg;
        ctx.beginPath();
        ctx.arc(mx, my, m.r * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    });
  }

  // --- Shooting Stars / Meteors ---
  function spawnShooter() {
    const side = Math.random() > 0.5;
    shooters.push({
      x: side ? -40 : W + 40,
      y: Math.random() * H * 0.6,
      vx: side ? (3 + Math.random() * 4) : -(3 + Math.random() * 4),
      vy: 1.5 + Math.random() * 2.5,
      len: 80 + Math.random() * 120,
      alpha: 1,
      r: Math.random() * 1.2 + 0.6,
      color: ['#ffffff', '#c8f0ff', '#ffd6e8', '#e0d0ff'][Math.floor(Math.random() * 4)]
    });
  }

  function updateShooters() {
    shooters.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      s.alpha -= 0.012;
    });
    shooters = shooters.filter(s => s.alpha > 0 && s.x > -200 && s.x < W + 200);
  }

  function drawShooters() {
    shooters.forEach(s => {
      const angle = Math.atan2(s.vy, s.vx);
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
      const tail = ctx.createLinearGradient(
        s.x - Math.cos(angle) * s.len, s.y - Math.sin(angle) * s.len, s.x, s.y
      );
      tail.addColorStop(0, 'rgba(255,255,255,0)');
      tail.addColorStop(1, s.color);
      ctx.strokeStyle = tail;
      ctx.lineWidth = s.r;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(s.x - Math.cos(angle) * s.len, s.y - Math.sin(angle) * s.len);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
      ctx.restore();
    });
  }

  // --- AI Grid Warp with Space Motion ---
  function drawGridWarp(t) {
    const COLS = 8, ROWS = 5;
    const cw = W / COLS, ch = H / ROWS;
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.strokeStyle = '#7c5cff';
    ctx.lineWidth = 0.8;
    const warpStr = 16;
    for (let c = 0; c <= COLS; c++) {
      for (let r = 0; r <= ROWS; r++) {
        const wave = Math.sin(t * 0.0006 + c * 0.5 + r * 0.7) * warpStr;
        const cx2 = c * cw + wave - (parallaxX * 60);
        const cy2 = r * ch + Math.cos(t * 0.0005 + r * 0.6) * warpStr * 0.6 - (parallaxY * 30);
        if (c > 0 && r === 0) {
          ctx.beginPath(); ctx.moveTo((c - 1) * cw, cy2); ctx.lineTo(cx2, cy2); ctx.stroke();
        }
        if (r > 0 && c === 0) {
          ctx.beginPath(); ctx.moveTo(cx2, (r - 1) * ch); ctx.lineTo(cx2, cy2); ctx.stroke();
        }
      }
    }
    ctx.restore();
  }

  // --- Helper Color Shading (Robust Integer Clamping) ---
  function shadeColor(hex, amount) {
    try {
      const amt = Math.round(Number(amount) || 0);
      let r = parseInt(hex.slice(1, 3), 16) || 0;
      let g = parseInt(hex.slice(3, 5), 16) || 0;
      let b = parseInt(hex.slice(5, 7), 16) || 0;
      r = Math.min(255, Math.max(0, Math.round(r + amt)));
      g = Math.min(255, Math.max(0, Math.round(g + amt)));
      b = Math.min(255, Math.max(0, Math.round(b + amt)));
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    } catch (e) {
      return hex;
    }
  }

  // --- Scene Builder ---
  function buildScene() {
    makeStars();
    makeNebulae();
    makePlanets();
    makeAsteroids();
  }

  let rafId;

  // --- Main Animation Render Loop (Crash-Proof) ---
  function render(t) {
    try {
      // Parallax damping with realistic space inertia
      parallaxX += (targetNX - parallaxX) * 0.06;
      parallaxY += (targetNY - parallaxY) * 0.06;

      ctx.clearRect(0, 0, W, H);

      // Deep Cosmic Background Gradient
      const bg = ctx.createLinearGradient(0, 0, W * 0.5, H);
      bg.addColorStop(0,   '#020510');
      bg.addColorStop(0.5, '#050818');
      bg.addColorStop(1,   '#030614');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // 1. Futuristic Grid Warp & Deep Nebulae (responsive to left-right hover)
      drawGridWarp(t);
      drawNebulae();

      // 2. Asteroids Belt (foreground 3D space movement)
      updateAsteroids();
      drawAsteroids();

      // 3. Stars (direct hover test only) & Dynamic Space Parallax Wrap
      updateStarHover(t);
      drawStars(t);
      drawConstellation(t);

      // 4. Planets & Moons (moving across the cosmic horizon)
      drawPlanets(t);

      // 5. Shooting Stars
      shooterTimer += 16;
      if (shooterTimer > 2600 + Math.random() * 1800 && shooters.length < MAX_SHOOTERS) {
        spawnShooter();
        shooterTimer = 0;
      }
      updateShooters();
      drawShooters();

      // 6. Interactive Black Hole / Singularity (hold/drag)
      updateBlackHole();
      drawBlackHole(t);

      // 7. Cosmic Stardust Particles
      updateDust();
      drawDust();

      // 8. Surface FX: Shockwave ripples & Comet Cursor Trail
      updateRipples();
      drawRipples();
      drawCursorTrail();

      // 9. Sync CSS background ambient orbs with left/right space motion
      const orbs = document.querySelectorAll('.orb');
      if (orbs.length > 0) {
        orbs.forEach((orb, i) => {
          const mult = (i + 1) * -35;
          orb.style.transform = `translate(${parallaxX * mult}px, ${parallaxY * mult * 0.5}px)`;
        });
      }
    } catch (renderError) {
      // Even if any unexpected edge-case occurs, log and never terminate the loop!
      console.warn('Hero space canvas frame warning:', renderError);
    }

    rafId = requestAnimationFrame(render);
  }

  window.addEventListener('resize', resize);
  resize();
  rafId = requestAnimationFrame(render);

  // Pause when hero is scrolled off-screen to conserve CPU/battery
  if (heroEl && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          if (!rafId) rafId = requestAnimationFrame(render);
        } else {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    }, { threshold: 0.01 }).observe(heroEl);
  }
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
      const hearts = ['ðŸ’–', 'ðŸ’•', 'â¤ï¸', 'âœ¨'];
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
      showMessage("Let's party! âœ¨", 3000);

      const heartInterval = setInterval(() => {
        spawnParticle('ðŸ’–', '#ff6bd6');
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
      showMessage("Wheee! 360Â° flip!", 2000);

      setTimeout(() => {
        actorGroup.classList.remove('vb-flip');
      }, 850);
    }

    function recordUserActivity() {
      lastActivityTime = performance.now();
      if (isAsleep) {
        isAsleep = false;
        setMood('happy');
        showMessage("Oh! You're back! âš¡", 3000);
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
            showMessage("Ohhh! ðŸ˜®", 0);
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
        showMessage("Wheee! ðŸš€", 2000);
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
        showMessage(`ðŸ’¡ ${randomTip}`, 4200);
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
        showMessage(`Say hi to ${name}! ðŸ’–`, 2600);
        spawnParticle('ðŸ’–', '#ff6bd6');
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

