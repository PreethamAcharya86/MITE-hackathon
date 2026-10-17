

(function () {
  'use strict';

  if (window.innerWidth > 768) {
    const cursorGlow = document.getElementById('cursor-glow');
    const cursorRing = document.getElementById('cursor-ring');
    const cursorDot = document.getElementById('cursor-dot');

    // Current raw mouse position (dot follows this exactly)
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
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
    document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));

    // Hover states on all interactive elements
    const interactables = 'a, button, input, textarea, select, label, [role="button"], .tl-card, .strip-card, .flow-card, .why-card';
    document.querySelectorAll(interactables).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    function animateCursor() {
      // Both pointer dot and circle ring are perfectly aligned and centered at (mx, my)
      cursorDot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      cursorRing.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;

      // Ambient glow
      gx += (mx - gx) * 0.25;
      gy += (my - gy) * 0.25;
      cursorGlow.style.transform = `translate3d(${gx}px, ${gy}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hide cursors when mouse leaves window
    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
  }

  /* â”€â”€â”€ 2. PARTICLE CANVAS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initParticles();
  });

  const PARTICLE_COUNT = window.innerWidth < 768 ? 50 : 120;
  let particles = [];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5
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
          ctx.lineWidth = 0.8;
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
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const musicButton = document.getElementById('music-toggle');
  const backgroundMusic = document.getElementById('background-music');
  let lastScroll = 0;

  if (musicButton && backgroundMusic) {
    function setMusicButtonPlaying(isPlaying) {
      musicButton.classList.toggle('is-playing', isPlaying);
      musicButton.setAttribute('aria-pressed', String(isPlaying));
      const label = isPlaying ? 'Pause background music' : 'Play background music';
      musicButton.setAttribute('aria-label', label);
      musicButton.title = label;
    }

    musicButton.addEventListener('click', () => {
      if (!backgroundMusic.paused) {
        backgroundMusic.pause();
        setMusicButtonPlaying(false);
        return;
      }

      musicButton.disabled = true;
      backgroundMusic.play()
        .then(() => setMusicButtonPlaying(true))
        .catch(error => {
          console.error('Background music could not be played:', error);
          musicButton.title = 'Could not play music. Click to try again.';
        })
        .finally(() => {
          musicButton.disabled = false;
        });
    });
  }

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
          const el = entry.target;
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
    const tiltEls = document.querySelectorAll('.why-card, .strip-card, .tl-card, .flow-card, .register-card, .contributor-card:not(.coordinator-card)');
    tiltEls.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Set CSS custom properties for radial spotlight beam
        el.style.setProperty('--mouse-x', `${mouseX}px`);
        el.style.setProperty('--mouse-y', `${mouseY}px`);

        // Compute 3D tilt
        const x = (mouseX / rect.width) - 0.5;
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
    const orbs = document.querySelectorAll('.orb');
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
        dot.style.opacity = '0';
        dot.style.transform = `translate(${(Math.random() - 0.5) * 60 - 50}%, ${-Math.random() * 60 - 50}%)`;
        dot.style.width = '2px';
        dot.style.height = '2px';
      });
      setTimeout(() => dot.remove(), 1000);
    }, 60));
  }

  /* â”€â”€â”€ 11. REGISTER BUTTON RIPPLE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function initRipple() {
    document.querySelectorAll('.btn-primary').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          width: ${size}px; height: ${size}px;
          background: rgba(255,255,255,0.2);
          top: ${e.clientY - rect.top - size / 2}px;
          left: ${e.clientX - rect.left - size / 2}px;
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
    tagline.style.animation = 'none';
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
  /* ─── 13. COORDINATOR 3D STACK CAROUSEL (\ | /) ──────────────── */
  function initCoordinatorCarousel() {
    const track = document.getElementById('coordinators-track');
    const row = track ? track.querySelector('.coordinators-cards-row') : null;
    const btnPrev = document.getElementById('coord-prev');
    const btnNext = document.getElementById('coord-next');
    const dotsWrap = document.getElementById('coord-dots');
    if (!track || !row) return;

    const cards = row.querySelectorAll('.coordinator-card');
    const total = cards.length;
    if (total === 0) return;

    let activeIndex = 0;

    // Generate pagination dots
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      cards.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to team member ${idx + 1}`);
        dot.addEventListener('click', () => {
          activeIndex = idx;
          updateStack();
        });
        dotsWrap.appendChild(dot);
      });
    }

    function updateStack() {
      cards.forEach((card, i) => {
        // Calculate circular offset relative to activeIndex
        let diff = i - activeIndex;
        while (diff > total / 2) diff -= total;
        while (diff < -total / 2) diff += total;

        card.classList.remove(
          'card-stack-active',
          'card-stack-prev',
          'card-stack-next',
          'card-stack-far-prev',
          'card-stack-far-next',
          'card-stack-hidden'
        );

        if (diff === 0) {
          card.classList.add('card-stack-active');
        } else if (diff === -1) {
          card.classList.add('card-stack-prev');
        } else if (diff === 1) {
          card.classList.add('card-stack-next');
        } else if (diff === -2) {
          card.classList.add('card-stack-far-prev');
        } else if (diff === 2) {
          card.classList.add('card-stack-far-next');
        } else {
          card.classList.add('card-stack-hidden');
        }
      });

      // Update dots
      if (dotsWrap) {
        const dots = dotsWrap.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === activeIndex);
        });
      }
    }

    // Direct card click: bringing clicked card to center
    cards.forEach((card, idx) => {
      card.addEventListener('click', (e) => {
        // If clicking on LinkedIn social link on the active card, let it open
        if (e.target.closest('a') && idx === activeIndex) return;

        if (idx !== activeIndex) {
          e.preventDefault();
          activeIndex = idx;
          updateStack();
        }
      });
    });

    // Left button (<) moves backward in stack
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        activeIndex = (activeIndex - 1 + total) % total;
        updateStack();
      });
    }

    // Right button (>) moves forward in stack
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        activeIndex = (activeIndex + 1) % total;
        updateStack();
      });
    }

    // Touch swipe support
    let startX = 0;
    let startY = 0;
    track.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      if (e.changedTouches.length > 0) {
        const diffX = startX - e.changedTouches[0].clientX;
        const diffY = startY - e.changedTouches[0].clientY;
        if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX > 0) {
            activeIndex = (activeIndex + 1) % total;
          } else {
            activeIndex = (activeIndex - 1 + total) % total;
          }
          updateStack();
        }
      }
    });

    // Keyboard navigation when near section
    window.addEventListener('keydown', (e) => {
      const rect = track.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowLeft') {
        activeIndex = (activeIndex - 1 + total) % total;
        updateStack();
      } else if (e.key === 'ArrowRight') {
        activeIndex = (activeIndex + 1) % total;
        updateStack();
      }
    });

    updateStack();
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
  canvas.style.cursor = 'none';

  let W = 0, H = 0;
  // Normalized parallax target (-0.5 to +0.5)
  let targetNX = 0, targetNY = 0;
  // Canvas pixel coordinates of cursor
  let mouseCX = -9999, mouseCY = -9999;
  let isMouseOver = false;
  // Smoothed parallax offset (represents camera pan across deep space)
  let parallaxX = 0, parallaxY = 0;

  // Direct star hit radius (star only glows when cursor is directly over it)
  const STAR_HIT_RADIUS = 16;

  // Cursor comet trail
  const trail = [];
  const TRAIL_LEN = 26;

  // Cosmic stardust particles
  const dust = [];
  const MAX_DUST = 180;

  // Periodic shooting stars in background
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

  // Check if current device is mobile screen
  const isMobile = () => window.innerWidth <= 768;

  // --- Resize Canvas ---
  function resize() {
    const rect = (heroEl || canvas).getBoundingClientRect();
    W = canvas.width = Math.max(300, Math.floor(rect.width || window.innerWidth));
    H = canvas.height = Math.max(300, Math.floor(rect.height || window.innerHeight));
    buildScene();

    if (isMobile()) {
      // Mobile: Keep static, halt animation loop
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      renderStaticFrame();
    } else {
      // Desktop: Start / resume animation loop if not already running
      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    }
  }

  // --- Pointer Hover Tracking (Desktop Only) ---
  function updatePointerPos(clientX, clientY) {
    if (isMobile()) return; // Keep static on mobile

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

  // Hover events: only active on desktop
  heroEl.addEventListener('mousemove', e => {
    if (!isMobile()) {
      updatePointerPos(e.clientX, e.clientY);
    }
  });

  heroEl.addEventListener('mouseleave', () => {
    if (isMobile()) return;
    isMouseOver = false;
    targetNX = 0;
    targetNY = 0;
    mouseCX = -9999;
    mouseCY = -9999;
    trail.length = 0;
  });

  // --- Stars Setup with 3 Depth Tiers for Dynamic Space Parallax ---
  function makeStars() {
    stars = [];
    const count = isMobile() ? 150 : 360;
    for (let i = 0; i < count; i++) {
      const tier = Math.random();
      let baseR, depth;
      if (tier > 0.88) {
        baseR = isMobile() ? (Math.random() * 0.7 + 0.5) : (Math.random() * 1.5 + 1.2);
        depth = 0.32 + Math.random() * 0.12; // foreground: strong space motion
      } else if (tier > 0.55) {
        baseR = isMobile() ? (Math.random() * 0.45 + 0.3) : (Math.random() * 0.8 + 0.5);
        depth = 0.18 + Math.random() * 0.08; // midground
      } else {
        baseR = isMobile() ? (Math.random() * 0.3 + 0.15) : (Math.random() * 0.4 + 0.15);
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

    let px = s.x - (parallaxX * s.parallaxDepth * W) + timeDriftX;
    let py = s.y - (parallaxY * (s.parallaxDepth * 0.5) * H) + timeDriftY;

    if (W > 0) px = ((px % W) + W) % W;
    if (H > 0) py = ((py % H) + H) % H;

    return { px, py };
  }

  // Update Star Hover (Strict direct hit test: only star under pointer glows)
  function updateStarHover(t) {
    if (isMobile()) return;
    stars.forEach(s => {
      const { px, py } = getStarCoords(s, t);
      const dx = mouseCX - px;
      const dy = mouseCY - py;
      const dist = Math.hypot(dx, dy);

      const hitR = Math.max(STAR_HIT_RADIUS, s.baseR * 5);

      if (isMouseOver && dist <= hitR) {
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
        s.hovered = Math.max(0, s.hovered - 0.06);
      }

      if (s.flareCooldown > 0) s.flareCooldown--;
    });
  }

  // Render Stars
  function drawStars(t) {
    const isMob = isMobile();
    stars.forEach(s => {
      const { px, py } = getStarCoords(s, t);
      // On mobile screen: bright static stars with beautiful glowing aura
      const alpha = isMob ? (s.baseR > 0.6 ? 0.92 : 0.72) : Math.min(1, (0.55 + 0.45 * Math.sin(s.phase + t * s.speed)) + s.hovered * 0.5);
      const drawR = isMob ? Math.max(0.85, s.baseR * 1.1) : s.baseR * (1 + s.hovered * 1.5);

      ctx.save();
      ctx.globalAlpha = alpha;

      // Soft glowing aura for stars on mobile (static) and desktop
      if (isMob && s.baseR > 0.5) {
        const glowR = drawR * 3.0;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, glowR);
        grad.addColorStop(0, s.color + 'dd');
        grad.addColorStop(0.35, s.color + '66');
        grad.addColorStop(1, s.color + '00');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, glowR, 0, Math.PI * 2);
        ctx.fill();
      } else if (!isMob && s.baseR > 1.0) {
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
    if (!isMouseOver || isMobile()) return;

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
        pf: 0.22 + Math.random() * 0.12
      });
    }
  }

  function updateAsteroids() {
    asteroids.forEach(ast => {
      ast.x += ast.vx;
      ast.y += ast.vy;
      ast.rotation += ast.rotSpeed;

      if (ast.x < -80) ast.x = W + 80;
      if (ast.x > W + 80) ast.x = -80;
      if (ast.y < -80) ast.y = H + 80;
      if (ast.y > H + 80) ast.y = -80;

      if (isMouseOver && !isMobile()) {
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

      ast.craters.forEach(cr => {
        ctx.fillStyle = 'rgba(15, 17, 28, 0.7)';
        ctx.beginPath();
        ctx.arc(cr.ox, cr.oy, cr.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    });
  }

  // --- Cursor Comet Trail (Desktop Only) ---
  function drawCursorTrail() {
    if (isMobile() || trail.length < 2) return;
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

    if (isMouseOver && mouseCX > -9000) {
      const grad = ctx.createRadialGradient(mouseCX, mouseCY, 0, mouseCX, mouseCY, 24);
      grad.addColorStop(0, 'rgba(0,212,255,0.95)');
      grad.addColorStop(0.35, 'rgba(124,92,255,0.45)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(mouseCX, mouseCY, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(mouseCX, mouseCY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
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
      const isMob = isMobile();
      let boost = 1;
      if (isMouseOver && !isMob) {
        const d = Math.hypot(mouseCX - cx, mouseCY - cy);
        boost = 1 + Math.max(0, 1 - d / (W * 0.35)) * 1.4;
      }
      ctx.save();
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
      const a1 = isMob ? (n.a1 * 1.4) : Math.min(0.3, n.a1 * boost);
      const a2 = isMob ? (n.a2 * 1.3) : n.a2;
      grad.addColorStop(0, `rgba(${n.r1},${n.g1},${n.b1},${a1.toFixed(3)})`);
      grad.addColorStop(0.5, `rgba(${n.r2},${n.g2},${n.b2},${a2.toFixed(3)})`);
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
    const isMob = isMobile();
    planets.forEach(p => {
      let px = p.x * W - (parallaxX * p.pf * W);
      let py = p.y * H - (parallaxY * p.pf * 0.5 * H);
      if (W > 0) px = ((px % W) + W) % W;
      if (H > 0) py = ((py % H) + H) % H;

      let hoverBoost = 0;
      if (isMouseOver && !isMob) {
        const d = Math.hypot(mouseCX - px, mouseCY - py);
        hoverBoost = Math.max(0, 1 - d / (p.r * 5));
      }

      ctx.save();
      if (isMob) {
        ctx.globalAlpha = 0.35;
      }

      // Outer Glow
      const glowR = p.r * (2.4 + hoverBoost * 1.8);
      const gGrad = ctx.createRadialGradient(px, py, p.r * 0.6, px, py, glowR);
      gGrad.addColorStop(0, isMob ? 'rgba(139,92,246,0.18)' : p.glow);
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
        const angle = isMobile() ? m.phase : (m.phase + t * m.speed);
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
      ctx.restore();
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
        const wave = Math.sin((t || 0) * 0.0006 + c * 0.5 + r * 0.7) * warpStr;
        const cx2 = c * cw + wave - (parallaxX * 60);
        const cy2 = r * ch + Math.cos((t || 0) * 0.0005 + r * 0.6) * warpStr * 0.6 - (parallaxY * 30);
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

  // --- Mobile Static Frame Renderer ---
  function renderStaticFrame() {
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createLinearGradient(0, 0, W * 0.5, H);
    bg.addColorStop(0, '#02040b');
    bg.addColorStop(0.5, '#030612');
    bg.addColorStop(1, '#02040b');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    drawGridWarp(0);
    drawNebulae();
    drawAsteroids();
    drawStars(0);
    drawPlanets(0);
  }

  let rafId;

  // --- Desktop Animation Render Loop (Pure Hover - No click/double-click) ---
  function render(t) {
    if (isMobile()) {
      renderStaticFrame();
      return;
    }

    try {
      // Parallax damping with realistic space inertia
      parallaxX += (targetNX - parallaxX) * 0.06;
      parallaxY += (targetNY - parallaxY) * 0.06;

      ctx.clearRect(0, 0, W, H);

      // Deep Cosmic Background Gradient
      const bg = ctx.createLinearGradient(0, 0, W * 0.5, H);
      bg.addColorStop(0, '#020510');
      bg.addColorStop(0.5, '#050818');
      bg.addColorStop(1, '#030614');
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

      // 6. Cosmic Stardust Particles
      updateDust();
      drawDust();

      // 7. Surface FX: Comet Cursor Trail
      drawCursorTrail();

      // 8. Sync CSS background ambient orbs with left/right space motion
      const orbs = document.querySelectorAll('.orb');
      if (orbs.length > 0) {
        orbs.forEach((orb, i) => {
          const mult = (i + 1) * -35;
          orb.style.transform = `translate(${parallaxX * mult}px, ${parallaxY * mult * 0.5}px)`;
        });
      }
    } catch (renderError) {
      console.warn('Hero space canvas frame warning:', renderError);
    }

    rafId = requestAnimationFrame(render);
  }

  window.addEventListener('resize', resize);
  resize();

  // Pause when hero is scrolled off-screen to conserve CPU/battery
  if (heroEl && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          if (!isMobile() && !rafId) rafId = requestAnimationFrame(render);
        } else {
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        }
      });
    }, { threshold: 0.01 }).observe(heroEl);
  }
})();
/* ==================== ARTIFERA 3D PARTICLE & LIQUID GLASS CONTROLLER ==================== */
(function initArtiferaLogo() {
  'use strict';
  const canvas = document.getElementById('artifera-particle-canvas');
  const wordmarkCanvas = document.getElementById('vibex-wordmark-canvas');
  const wrapper = document.getElementById('artifera-particle-wrapper');
  const glassBadge = document.getElementById('artifera-glass-badge');
  const heroEl = document.getElementById('hero');
  if (!canvas && !glassBadge && !wordmarkCanvas) return;
  const isMobile = () => window.innerWidth <= 768;
  const prefersReducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // ----------------------------------------------------
  // PART A: DESKTOP 3D VOLUMETRIC PARTICLE LOGO
  // ----------------------------------------------------
  let ctx = null;
  let particles = [];
  let brainConnections = [];
  let sparks = [];
  let rafId = null;
  let isImageLoaded = false;
  let isHeroVisible = true;
  // Canvas dimensions
  const LOGICAL_SIZE = 500;
  const DISPLAY_SIZE = 500;
  let dpr = 1;
  // 3D Camera / Perspective settings
  const FOCAL_LENGTH = 580;
  let rotX = 0, rotY = 0;
  let targetRotX = 0, targetRotY = 0;
  let autoYaw = 0;
  // Mouse tracking inside hero & canvas
  let isMouseOverHero = false;
  let mouseCanvasX = -9999, mouseCanvasY = -9999;
  let isMouseOverCanvas = false;
  // Color palette matching AI VibeX theme
  const COLORS = {
    cyan: '#22d3ee',
    cyanBright: '#67e8f9',
    purple: '#8b5cf6',
    purpleBright: '#a78bfa',
    pink: '#ec4899',
    blue: '#3b82f6',
    white: '#ffffff',
    silver: '#cbd5e1'
  }; class LogoParticle {
    constructor(bx, by, bz, color, size, type, isNode = false) {
      this.bx = bx; // 3D anchor
      this.by = by;
      this.bz = bz;
      // Start with scattered explosion entrance
      const angle = Math.random() * Math.PI * 2;
      const spread = 80 + Math.random() * 90;
      this.x = bx + Math.cos(angle) * spread;
      this.y = by + Math.sin(angle) * spread;
      this.z = bz + (Math.random() - 0.5) * 160;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.vz = (Math.random() - 0.5) * 2;
      this.color = color;
      this.baseSize = size;
      this.type = type;
      this.isNode = isNode;
      this.phase = Math.random() * Math.PI * 2;
      this.shimmerSpeed = 0.003 + Math.random() * 0.004;
      // 2D projected coordinates
      this.px = 0;
      this.py = 0;
      this.pz = 0;
      this.pScale = 1;
      this.alpha = 1;
    }
    update(time, repulsionX, repulsionY, repulseActive) {
      // 1. Ambient micro-breathing drift
      const breath = Math.sin(time * 0.0015 + this.phase) * 1.5;
      const targetX = this.bx;
      const targetY = this.by + breath;
      const targetZ = this.bz + Math.cos(time * 0.0018 + this.phase) * 2.0;
      // 2. Cursor Magnetic Repulsion (when pointer is near canvas projection)
      if (repulseActive && this.px > 0 && this.py > 0) {
        const dx = this.px - repulsionX;
        const dy = this.py - repulsionY;
        const dist = Math.hypot(dx, dy);
        const REPULSE_RADIUS = 85;
        if (dist < REPULSE_RADIUS && dist > 0.1) {
          const force = (1 - dist / REPULSE_RADIUS) * 8.5;
          const angle = Math.atan2(dy, dx);
          this.vx += Math.cos(angle) * force;
          this.vy += Math.sin(angle) * force;
          this.vz += (Math.random() - 0.5) * force * 3;
        }
      }
      // 3. Spring-dampened return physics
      const k = 0.085; // spring stiffness
      const damping = 0.82; // air resistance
      this.vx += (targetX - this.x) * k;
      this.vy += (targetY - this.y) * k;
      this.vz += (targetZ - this.z) * k;
      this.vx *= damping;
      this.vy *= damping;
      this.vz *= damping;
      this.x += this.vx;
      this.y += this.vy;
      this.z += this.vz;
      // 4. Calculate Twinkling Alpha
      const twinkle = 0.72 + 0.28 * Math.sin(this.phase + time * this.shimmerSpeed);
      this.alpha = Math.max(0.2, Math.min(1, twinkle));
    }
    project(totalRotX, totalRotY, cx, cy) {
      // 3D Rotation Matrix
      // Rotate around Y (yaw)
      const cosY = Math.cos(totalRotY), sinY = Math.sin(totalRotY);
      const x1 = this.x * cosY + this.z * sinY;
      const z1 = -this.x * sinY + this.z * cosY;
      const y1 = this.y;
      // Rotate around X (pitch)
      const cosX = Math.cos(totalRotX), sinX = Math.sin(totalRotX);
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;
      const x2 = x1;
      this.pz = z2;
      // Perspective Projection
      const scale = FOCAL_LENGTH / (FOCAL_LENGTH + z2);
      this.pScale = scale;
      this.px = cx + x2 * scale;
      this.py = cy + y2 * scale;
    }
  }
  // --- Sample Logo Image into 3D Volumetric Points ---
  function sampleLogoImage() {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'assets/artifera_logo.jpeg';
    img.onload = () => {
      try {
        const off = document.createElement('canvas');
        const SAMPLE_W = 216;
        const SAMPLE_H = 216;
        off.width = SAMPLE_W;
        off.height = SAMPLE_H;
        const offCtx = off.getContext('2d', { willReadFrequently: true });
        offCtx.drawImage(img, 0, 0, SAMPLE_W, SAMPLE_H);
        const imgData = offCtx.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data;
        const cx = SAMPLE_W / 2;
        const cy = SAMPLE_H / 2;
        const R_MAX = SAMPLE_W * 0.47;
        particles = [];
        const brainNodes = [];
        // Sample grid step (2px step for high definition, ~3,000 points)
        const STEP = 2;
        for (let y = 0; y < SAMPLE_H; y += STEP) {
          for (let x = 0; x < SAMPLE_W; x += STEP) {
            const idx = (y * SAMPLE_W + x) * 4;
            const r = imgData[idx];
            const g = imgData[idx + 1];
            const b = imgData[idx + 2];
            const a = imgData[idx + 3];
            if (a < 50) continue;
            const nx = (x - cx) / R_MAX;
            const ny = (y - cy) / R_MAX;
            const dist = Math.hypot(nx, ny);
            // Ignore outer square black corners (dist > 1.0)
            if (dist > 1.01 || dist < 0.04) continue;
            // Greyscale luminance
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            // Background is pure white (lum > 218)
            if (lum > 218) continue;
            // Base 2D coordinate on our 500px canvas (scale factor ~185)
            const SCALE = 185;
            const bx = nx * SCALE;
            const by = ny * SCALE;
            let bz = 0;
            let color = COLORS.cyan;
            let size = 1.85;
            let type = 'general';
            let isNode = false;
            // 1. Outer Ring: (dist >= 0.82)
            // Volumetric orbital tilt
             if (dist >= 0.82) {
               bz = Math.sin(nx * Math.PI) * 32;
               size = 2.0;
               const angle = Math.atan2(ny, nx);
               // Gradient purple-cyan around the circle
               color = Math.sin(angle * 2) > 0 ? COLORS.cyan : COLORS.purple;
               if (Math.random() < 0.12) color = COLORS.white;
             }
             // 2. Curved Typography "ARTIFERA": (ny > 0.42 and inside ring)
            else if (ny > 0.42 && lum < 160) {
            type = 'text';
            bz = 26; // Elevated forward plane so text is razor-sharp and never occluded
            size = 2.1;
            color = Math.random() < 0.8 ? COLORS.white : COLORS.cyanBright;
          }
          // 3. Brain / Neural Net Lattice: (nx > -0.06 and ny < 0.25)
          else if (nx > -0.06 && ny < 0.25) {
            type = 'brain';
            // Hemispherical 3D skull dome
            const domeRadiusSq = Math.max(0, 0.7 - nx * nx - ny * ny);
            bz = Math.sqrt(domeRadiusSq) * 75;
            size = 1.95;
            // Identify high-contrast nodes
            if (lum < 75 && Math.random() < 0.18) {
              isNode = true;
              size = 3.2;
              color = Math.random() > 0.5 ? COLORS.cyanBright : COLORS.pink;
            } else {
              color = Math.random() < 0.45 ? COLORS.cyan : (Math.random() < 0.75 ? COLORS.purpleBright : COLORS.pink);
            }
          }
          // 4. Ear Headset Vortex: (around nx ~ 0.18, ny ~ 0.12)
          else if (Math.hypot(nx - 0.18, ny - 0.12) < 0.18) {
            type = 'ear';
            bz = 40; // Projects outwards like a cybernetic headphone
            size = 2.2;
            color = lum < 90 ? COLORS.cyan : COLORS.purple;
          }
          // 5. Cyborg Face Profile & Jaw: (nx <= -0.06)
          else if (nx <= -0.06 && ny < 0.42) {
            type = 'face';
            // Rounded smooth face curvature
            bz = Math.cos(nx * 1.8) * 35 + 15;
            size = 1.95;
            color = lum < 100 ? COLORS.cyan : COLORS.purpleBright;
            if (nx < -0.38) color = COLORS.cyanBright; // Highlight on nose/lip edge
          }
          // 6. Cybernetic Neck
          else {
            type = 'neck';
            bz = 15;
            size = 1.85;
            color = COLORS.purple;
          }
          const p = new LogoParticle(bx, by, bz, color, size, type, isNode);
          particles.push(p);
          if (isNode) {
            brainNodes.push(p);
          }
        }
        }
        brainConnections = [];
        for (let i = 0; i < brainNodes.length; i++) {
          for (let j = i + 1; j < brainNodes.length; j++) {
            if (Math.hypot(brainNodes[i].bx - brainNodes[j].bx, brainNodes[i].by - brainNodes[j].by) < 36) {
              brainConnections.push({ a: brainNodes[i], b: brainNodes[j] });
            }
          }
        }
        isImageLoaded = true;
      } catch (error) {
        console.warn('ARTIFERA logo sampling failed:', error);
        createFallbackParticles();
      }
    };
    img.onerror = createFallbackParticles;
  }
  // Fallback procedural geometry if image sampling fails
  function createFallbackParticles() {
        particles = [];
        brainConnections = [];
        const COUNT = 2000;
        for (let i = 0; i < COUNT; i++) {
          const theta = Math.random() * Math.PI * 2;
          const r = Math.sqrt(Math.random()) * 165;
          const bx = Math.cos(theta) * r;
          const by = Math.sin(theta) * r;
          const bz = Math.cos(r * 0.035) * 44;
          const color = Math.random() > 0.5 ? COLORS.cyan : COLORS.purple;
          particles.push(new LogoParticle(bx, by, bz, color, 1.9, 'fallback'));
        }
        isImageLoaded = true;
        if (!rafId) rafId = requestAnimationFrame(renderLogo);
      }
      // --- Canvas Setup & High-DPI Scaling ---
      function initCanvas() {
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = LOGICAL_SIZE * dpr;
        canvas.height = LOGICAL_SIZE * dpr;
        const currentDisplaySize = isMobile() ? Math.min(340, Math.floor(window.innerWidth * 0.86)) : DISPLAY_SIZE;
        canvas.style.width = `${currentDisplaySize}px`;
        canvas.style.height = `${currentDisplaySize}px`;
        ctx.scale(dpr, dpr);
      }
      // --- Neural Synaptic Spark Pulses ---
      let sparkTimer = 0;
      function updateSparks() {
        sparkTimer += 16;
        if (sparkTimer > 1800 && brainConnections.length > 0 && sparks.length < 4) {
          sparkTimer = 0;
          const conn = brainConnections[Math.floor(Math.random() * brainConnections.length)];
          sparks.push({
            conn,
            progress: 0,
            speed: 0.035 + Math.random() * 0.025,
            color: Math.random() > 0.4 ? COLORS.cyanBright : COLORS.white
          });
        }
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          s.progress += s.speed;
          if (s.progress >= 1) {
            sparks.splice(i, 1);
          }
        }
      }
      function drawSparks() {
        sparks.forEach(s => {
          const { a, b } = s.conn;
          const sx = a.px + (b.px - a.px) * s.progress;
          const sy = a.py + (b.py - a.py) * s.progress;
          const scale = a.pScale + (b.pScale - a.pScale) * s.progress;
          ctx.save();
          ctx.fillStyle = s.color;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(sx, sy, 3.6 * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      function renderLogo(time) {
        if (!ctx || !canvas) {
          rafId = null;
          return;
        }
        ctx.clearRect(0, 0, LOGICAL_SIZE, LOGICAL_SIZE);
        const center = LOGICAL_SIZE / 2;
        // Keep the logo facing forward; particles still shimmer and breathe.
        rotX = 0;
        rotY = 0;
        particles.forEach(p => {
          p.update(time, mouseCanvasX, mouseCanvasY, isMouseOverCanvas);
          p.project(rotX, rotY, center, center);
        });
        particles.sort((a, b) => a.pz - b.pz);
        particles.forEach(p => {
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.px, p.py, Math.max(0.75, p.baseSize * p.pScale), 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        drawSparks();
        rafId = requestAnimationFrame(renderLogo);
      }

      function startLogo() {
        if (!canvas || prefersReducedMotion()) return;
        if (!rafId) rafId = requestAnimationFrame(renderLogo);
      }

      if (canvas) {
        initCanvas();
        // Render immediately so the animation is visible even while the image is loading.
        createFallbackParticles();
        sampleLogoImage();
        canvas.addEventListener('mousemove', e => {
          const rect = canvas.getBoundingClientRect();
          mouseCanvasX = (e.clientX - rect.left) * (LOGICAL_SIZE / rect.width);
          mouseCanvasY = (e.clientY - rect.top) * (LOGICAL_SIZE / rect.height);
          isMouseOverCanvas = true;
          targetRotX = 0;
          targetRotY = 0;
        });
        canvas.addEventListener('mouseleave', () => {
          isMouseOverCanvas = false;
          mouseCanvasX = mouseCanvasY = -9999;
          targetRotX = targetRotY = 0;
        });
        canvas.addEventListener('touchstart', e => {
          if (e.touches && e.touches[0]) {
            const rect = canvas.getBoundingClientRect();
            mouseCanvasX = (e.touches[0].clientX - rect.left) * (LOGICAL_SIZE / rect.width);
            mouseCanvasY = (e.touches[0].clientY - rect.top) * (LOGICAL_SIZE / rect.height);
            isMouseOverCanvas = true;
          }
        }, { passive: true });
        canvas.addEventListener('touchmove', e => {
          if (e.touches && e.touches[0]) {
            const rect = canvas.getBoundingClientRect();
            mouseCanvasX = (e.touches[0].clientX - rect.left) * (LOGICAL_SIZE / rect.width);
            mouseCanvasY = (e.touches[0].clientY - rect.top) * (LOGICAL_SIZE / rect.height);
            isMouseOverCanvas = true;
          }
        }, { passive: true });
        canvas.addEventListener('touchend', () => {
          isMouseOverCanvas = false;
          mouseCanvasX = mouseCanvasY = -9999;
        });
        window.addEventListener('resize', () => {
          initCanvas();
          startLogo();
        });

        // Pause animation when scrolled out of view, resume when in view
        const showcaseSection = document.getElementById('particle-showcase');
        if (showcaseSection && 'IntersectionObserver' in window) {
          const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                startLogo();
              } else if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
              }
            });
          }, { threshold: 0.05 });
          obs.observe(showcaseSection);
        } else {
          startLogo();
        }
      }

      if (glassBadge) {
        glassBadge.addEventListener('pointermove', e => {
          const rect = glassBadge.getBoundingClientRect();
          glassBadge.style.setProperty('--mx', `${e.clientX - rect.left}px`);
          glassBadge.style.setProperty('--my', `${e.clientY - rect.top}px`);
        });
      }

      if (wordmarkCanvas) {
        const wordmarkSection = document.getElementById('vibex-wordmark');
        const wordmarkWidth = 800;
        const wordmarkHeight = 260;
        const wordmarkParticles = [];
        let wordmarkCtx = null;
        let wordmarkRafId = null;
        let wordmarkPointerX = -9999;
        let wordmarkPointerY = -9999;
        let isPointerOverWordmark = false;

        function initWordmarkCanvas() {
          wordmarkCtx = wordmarkCanvas.getContext('2d');
          if (!wordmarkCtx) return false;
          const wordmarkDpr = Math.min(window.devicePixelRatio || 1, 2);
          wordmarkCanvas.width = wordmarkWidth * wordmarkDpr;
          wordmarkCanvas.height = wordmarkHeight * wordmarkDpr;
          wordmarkCtx.setTransform(wordmarkDpr, 0, 0, wordmarkDpr, 0, 0);
          return true;
        }

        function createWordmarkParticles() {
          const sampleCanvas = document.createElement('canvas');
          sampleCanvas.width = wordmarkWidth;
          sampleCanvas.height = wordmarkHeight;
          const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
          if (!sampleCtx) return;

          sampleCtx.font = '900 118px Outfit, Arial, sans-serif';
          sampleCtx.textAlign = 'center';
          sampleCtx.textBaseline = 'middle';
          sampleCtx.fillStyle = '#ffffff';
          sampleCtx.fillText('AI VIBEX', wordmarkWidth / 2, wordmarkHeight / 2, wordmarkWidth - 72);

          const pixels = sampleCtx.getImageData(0, 0, wordmarkWidth, wordmarkHeight).data;
          const sampleStep = isMobile() ? 8 : 5;
          for (let y = 0; y < wordmarkHeight; y += sampleStep) {
            for (let x = 0; x < wordmarkWidth; x += sampleStep) {
              if (pixels[(y * wordmarkWidth + x) * 4 + 3] < 128) continue;
              const bx = x - wordmarkWidth / 2;
              const by = y - wordmarkHeight / 2;
              const color = Math.random() < 0.48
                ? COLORS.cyanBright
                : (Math.random() < 0.56 ? COLORS.purpleBright : COLORS.white);
              wordmarkParticles.push(new LogoParticle(bx, by, (Math.random() - 0.5) * 24, color, 2.1, 'wordmark'));
            }
          }
        }

        function renderWordmark(time, isStatic = false) {
          if (!wordmarkCtx) return;
          wordmarkCtx.clearRect(0, 0, wordmarkWidth, wordmarkHeight);
          wordmarkParticles.forEach(particle => {
            if (!isStatic) {
              particle.update(time, wordmarkPointerX, wordmarkPointerY, isPointerOverWordmark);
            }
            particle.project(0, 0, wordmarkWidth / 2, wordmarkHeight / 2);
          });
          wordmarkParticles.sort((a, b) => a.pz - b.pz);
          wordmarkParticles.forEach(particle => {
            wordmarkCtx.globalAlpha = particle.alpha;
            wordmarkCtx.fillStyle = particle.color;
            wordmarkCtx.beginPath();
            wordmarkCtx.arc(particle.px, particle.py, Math.max(0.8, particle.baseSize * particle.pScale), 0, Math.PI * 2);
            wordmarkCtx.fill();
          });
          wordmarkCtx.globalAlpha = 1;
          if (!isStatic) wordmarkRafId = requestAnimationFrame(renderWordmark);
        }

        function startWordmark() {
          if (isMobile()) {
            stopWordmark();
            return;
          }
          if (prefersReducedMotion()) {
            stopWordmark();
            renderWordmark(0, true);
          } else if (!wordmarkRafId) {
            wordmarkRafId = requestAnimationFrame(renderWordmark);
          }
        }

        function stopWordmark() {
          if (wordmarkRafId) {
            cancelAnimationFrame(wordmarkRafId);
            wordmarkRafId = null;
          }
        }

        if (initWordmarkCanvas()) {
          createWordmarkParticles();
          wordmarkCanvas.addEventListener('pointermove', event => {
            const rect = wordmarkCanvas.getBoundingClientRect();
            wordmarkPointerX = (event.clientX - rect.left) * (wordmarkWidth / rect.width);
            wordmarkPointerY = (event.clientY - rect.top) * (wordmarkHeight / rect.height);
            isPointerOverWordmark = true;
          });
          wordmarkCanvas.addEventListener('pointerleave', () => {
            isPointerOverWordmark = false;
            wordmarkPointerX = wordmarkPointerY = -9999;
          });

          if (prefersReducedMotion()) {
            wordmarkParticles.forEach(particle => {
              particle.x = particle.bx;
              particle.y = particle.by;
              particle.z = particle.bz;
            });
          }

          if (wordmarkSection && 'IntersectionObserver' in window) {
            new IntersectionObserver(entries => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  startWordmark();
                } else {
                  stopWordmark();
                }
              });
            }, { threshold: 0.05 }).observe(wordmarkSection);
          } else {
            startWordmark();
          }

          window.addEventListener('resize', () => {
            if (isMobile()) {
              stopWordmark();
              return;
            }
            initWordmarkCanvas();
            if (prefersReducedMotion()) {
              renderWordmark(0, true);
            } else if (!wordmarkSection || wordmarkSection.getBoundingClientRect().top < window.innerHeight) {
              startWordmark();
            }
          });
        }
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
            } catch (_) { }

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

          const teamCards = document.querySelectorAll('.leadership-card, .contributor-card:not(.coordinator-card)');
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

/* ==================== HERO PARTICLE COUNTDOWN (H : M : S) ==================== */
(function initHeroParticleCountdown() {
  'use strict';

  const canvas = document.getElementById('countdown-particle-canvas');
  const wrap = document.getElementById('hero-countdown-wrap');
  if (!canvas || !wrap) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const isReducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Logical canvas dimensions
  const LOGICAL_WIDTH = 700;
  const LOGICAL_HEIGHT = 150;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = LOGICAL_WIDTH * dpr;
    canvas.height = LOGICAL_HEIGHT * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeCanvas();

  // Offscreen sampling canvas
  const sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = LOGICAL_WIDTH;
  sampleCanvas.height = LOGICAL_HEIGHT;
  const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });

  // Color palettes matching AI VibeX 1.0 brand colors
  const COLORS = {
    hours: ['#22d3ee', '#38bdf8', '#67e8f9', '#a5f3fc', '#ffffff'],
    colon: ['#ffffff', '#c084fc', '#e0e7ff'],
    minutes: ['#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#ffffff'],
    seconds: ['#ec4899', '#f43f5e', '#fb7185', '#fda4af', '#ffffff'],
    embers: ['#22d3ee', '#8b5cf6', '#ec4899']
  };

  // Segment horizontal slot centers
  const cy = LOGICAL_HEIGHT / 2;
  const cx = LOGICAL_WIDTH / 2;
  const slotX = [
    cx - 195, // Segment 0: Hours
    cx - 98,  // Segment 1: Colon 1
    cx,       // Segment 2: Minutes
    cx + 98,  // Segment 3: Colon 2
    cx + 195  // Segment 4: Seconds
  ];

  class Particle {
    constructor(x, y, palette, defaultSize) {
      this.x = x + (Math.random() - 0.5) * 40;
      this.y = y + (Math.random() - 0.5) * 40;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.tx = x;
      this.ty = y;
      this.palette = palette;
      this.color = palette[Math.floor(Math.random() * palette.length)];
      this.baseSize = defaultSize || (Math.random() * 1.1 + 1.35);
      this.size = this.baseSize;
      this.alpha = 0;
      this.targetAlpha = 0.95;
      this.spring = Math.random() * 0.035 + 0.075;
      this.friction = Math.random() * 0.03 + 0.83;
      this.active = false;
      this.jitterPhase = Math.random() * Math.PI * 2;
      this.jitterSpeed = Math.random() * 0.04 + 0.02;
    }

    setTarget(tx, ty, isInitial = false) {
      const dx = tx - this.tx;
      const dy = ty - this.ty;
      const distSq = dx * dx + dy * dy;

      if (!isInitial && distSq > 9) {
        // Kick velocity on target change for smooth fluid swirl alignment
        this.vx += (Math.random() - 0.5) * 3.2;
        this.vy += (Math.random() - 0.5) * 3.2;
      }

      this.tx = tx;
      this.ty = ty;
      this.active = true;
      this.targetAlpha = Math.random() * 0.15 + 0.85;
      this.color = this.palette[Math.floor(Math.random() * this.palette.length)];
    }

    setIdle(slotCenterX, slotCenterY) {
      this.active = false;
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 32 + 10;
      this.tx = slotCenterX + Math.cos(angle) * dist;
      this.ty = slotCenterY + Math.sin(angle) * dist;
      this.targetAlpha = Math.random() * 0.12 + 0.08;
    }

    update(ptrX, ptrY, ptrActive, time) {
      // Spring attraction to target position
      const dx = this.tx - this.x;
      const dy = this.ty - this.y;
      this.vx += dx * this.spring;
      this.vy += dy * this.spring;

      // Interactive cursor repulsion
      if (ptrActive) {
        const pdx = this.x - ptrX;
        const pdy = this.y - ptrY;
        const pdistSq = pdx * pdx + pdy * pdy;
        const maxDist = 75;
        if (pdistSq < maxDist * maxDist && pdistSq > 0.1) {
          const pdist = Math.sqrt(pdistSq);
          const force = (maxDist - pdist) / maxDist;
          this.vx += (pdx / pdist) * force * 5.0;
          this.vy += (pdy / pdist) * force * 5.0;
        }
      }

      // Micro-breathing oscillation when settled
      if (this.active) {
        this.jitterPhase += this.jitterSpeed;
        this.x += Math.cos(this.jitterPhase) * 0.12;
        this.y += Math.sin(this.jitterPhase) * 0.12;
      }

      this.vx *= this.friction;
      this.vy *= this.friction;
      this.x += this.vx;
      this.y += this.vy;

      // Smooth opacity lerp
      this.alpha += (this.targetAlpha - this.alpha) * 0.12;
    }

    draw(targetCtx, colonAlphaMod = 1) {
      const renderAlpha = Math.min(1, Math.max(0, this.alpha * colonAlphaMod));
      if (renderAlpha <= 0.02) return;

      targetCtx.save();
      targetCtx.globalAlpha = renderAlpha;
      targetCtx.fillStyle = this.color;
      targetCtx.beginPath();
      targetCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      targetCtx.fill();
      targetCtx.restore();
    }
  }

  // Particle pools for each segment (Hours, Colon1, Minutes, Colon2, Seconds)
  const SEGMENT_CAPACITIES = [220, 46, 220, 46, 220];
  const SEGMENT_PALETTES = [COLORS.hours, COLORS.colon, COLORS.minutes, COLORS.colon, COLORS.seconds];
  const segmentPools = SEGMENT_CAPACITIES.map((capacity, i) => {
    const pool = [];
    for (let k = 0; k < capacity; k++) {
      pool.push(new Particle(slotX[i], cy, SEGMENT_PALETTES[i], i === 1 || i === 3 ? 1.7 : 1.45));
    }
    return pool;
  });

  // Ambient floating background ember particles
  const emberPool = [];
  for (let k = 0; k < 35; k++) {
    const ep = new Particle(cx, cy, COLORS.embers, 1.0);
    ep.setIdle(cx, cy);
    emberPool.push(ep);
  }

  // Cache previously rendered segment texts
  let prevSegTexts = ['', '', '', '', ''];

  // Sample targets for a given segment text at slotX[i]
  function sampleSegmentTargets(text, segIdx) {
    if (!sampleCtx) return [];
    sampleCtx.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    // Font configuration
    const isColon = segIdx === 1 || segIdx === 3;
    const fontSize = isColon ? 76 : 84;
    sampleCtx.font = `800 ${fontSize}px 'Outfit', 'Space Grotesk', -apple-system, sans-serif`;
    sampleCtx.textAlign = 'center';
    sampleCtx.textBaseline = 'middle';
    sampleCtx.fillStyle = '#ffffff';

    const sx = slotX[segIdx];
    sampleCtx.fillText(text, sx, cy);

    const halfW = isColon ? 34 : 78;
    const halfH = 58;
    const startX = Math.max(0, Math.floor(sx - halfW));
    const startY = Math.max(0, Math.floor(cy - halfH));
    const width = Math.min(LOGICAL_WIDTH - startX, halfW * 2);
    const height = Math.min(LOGICAL_HEIGHT - startY, halfH * 2);

    const imgData = sampleCtx.getImageData(startX, startY, width, height);
    const pixels = imgData.data;
    const targets = [];
    const step = isColon ? 3 : 4;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const idx = (y * width + x) * 4;
        if (pixels[idx + 3] > 110) {
          targets.push({ x: startX + x, y: startY + y });
        }
      }
    }
    return targets;
  }

  // Assign particles to new target positions smoothly
  function updateSegmentParticles(segIdx, newTargets, isInitial = false) {
    const pool = segmentPools[segIdx];
    const poolCopy = pool.slice();

    // Map each target to nearest available particle in the pool
    for (let tIdx = 0; tIdx < newTargets.length; tIdx++) {
      const target = newTargets[tIdx];
      let bestDistSq = Infinity;
      let bestParticleIdx = -1;

      for (let pIdx = 0; pIdx < poolCopy.length; pIdx++) {
        const p = poolCopy[pIdx];
        const dx = p.x - target.x;
        const dy = p.y - target.y;
        const dSq = dx * dx + dy * dy;
        if (dSq < bestDistSq) {
          bestDistSq = dSq;
          bestParticleIdx = pIdx;
        }
      }

      if (bestParticleIdx !== -1) {
        const assignedParticle = poolCopy.splice(bestParticleIdx, 1)[0];
        assignedParticle.setTarget(target.x, target.y, isInitial);
      }
    }

    // Any remaining particles in the pool float as subtle surrounding particles
    const sx = slotX[segIdx];
    for (let pIdx = 0; pIdx < poolCopy.length; pIdx++) {
      poolCopy[pIdx].setIdle(sx, cy);
    }
  }

  // Calculate remaining countdown time in format h : m : s
  function getRemainingTime() {
    const now = Date.now();
    let targetTime;

    const dataTarget = wrap.getAttribute('data-target');
    if (dataTarget) {
      const parsed = Date.parse(dataTarget);
      if (!isNaN(parsed) && parsed > now) {
        targetTime = parsed;
      }
    }

    if (!targetTime) {
      const STORAGE_KEY = 'vibex_countdown_target_timestamp';
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && !isNaN(parseInt(stored, 10)) && parseInt(stored, 10) > now) {
          targetTime = parseInt(stored, 10);
        } else {
          // Default: 6 hours 00 minutes 00 seconds sprint countdown
          targetTime = now + (6 * 3600 * 1000);
          localStorage.setItem(STORAGE_KEY, String(targetTime));
        }
      } catch (e) {
        targetTime = now + (6 * 3600 * 1000);
      }
    }

    const diffSec = Math.max(0, Math.floor((targetTime - now) / 1000));
    const h = Math.floor(diffSec / 3600);
    const m = Math.floor((diffSec % 3600) / 60);
    const s = diffSec % 60;

    return {
      hStr: String(h).padStart(2, '0'),
      mStr: String(m).padStart(2, '0'),
      sStr: String(s).padStart(2, '0')
    };
  }

  // Check and update countdown segments
  function updateCountdown(isInitial = false) {
    const { hStr, mStr, sStr } = getRemainingTime();
    const currentSegTexts = [hStr, ':', mStr, ':', sStr];

    for (let i = 0; i < 5; i++) {
      if (isInitial || currentSegTexts[i] !== prevSegTexts[i]) {
        const targets = sampleSegmentTargets(currentSegTexts[i], i);
        updateSegmentParticles(i, targets, isInitial);
        prevSegTexts[i] = currentSegTexts[i];
      }
    }
  }

  // Pointer tracking for repulsion effect
  let pointerX = -9999, pointerY = -9999;
  let isPointerActive = false;

  function updatePointer(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointerX = (clientX - rect.left) * (LOGICAL_WIDTH / rect.width);
    pointerY = (clientY - rect.top) * (LOGICAL_HEIGHT / rect.height);
    isPointerActive = true;
  }

  canvas.addEventListener('mousemove', e => updatePointer(e.clientX, e.clientY));
  canvas.addEventListener('mouseenter', e => updatePointer(e.clientX, e.clientY));
  canvas.addEventListener('mouseleave', () => {
    isPointerActive = false;
    pointerX = -9999;
    pointerY = -9999;
  });

  canvas.addEventListener('touchstart', e => {
    if (e.touches && e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  canvas.addEventListener('touchmove', e => {
    if (e.touches && e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  canvas.addEventListener('touchend', () => {
    isPointerActive = false;
    pointerX = -9999;
    pointerY = -9999;
  });

  // Main animation render loop
  let isVisible = true;
  let rafId = null;

  function render(time) {
    ctx.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    // Pulse factor for colon separators
    const colonPulse = 0.8 + Math.sin(time * 0.005) * 0.2;

    // Render segment particles
    for (let sIdx = 0; sIdx < segmentPools.length; sIdx++) {
      const pool = segmentPools[sIdx];
      const colonMod = (sIdx === 1 || sIdx === 3) ? colonPulse : 1;
      for (let pIdx = 0; pIdx < pool.length; pIdx++) {
        const p = pool[pIdx];
        p.update(pointerX, pointerY, isPointerActive, time);
        p.draw(ctx, colonMod);
      }
    }

    // Render ambient embers
    for (let eIdx = 0; eIdx < emberPool.length; eIdx++) {
      const ep = emberPool[eIdx];
      ep.update(pointerX, pointerY, isPointerActive, time);
      ep.draw(ctx, 0.4);
    }

    if (isVisible && !isReducedMotion()) {
      rafId = requestAnimationFrame(render);
    }
  }

  function start() {
    if (!rafId) {
      rafId = requestAnimationFrame(render);
    }
  }

  function stop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Handle visibility with IntersectionObserver
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible = true;
          start();
        } else {
          isVisible = false;
          stop();
        }
      });
    }, { threshold: 0.05 }).observe(wrap);
  } else {
    start();
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    if (isReducedMotion()) {
      updateCountdown(true);
      render(0);
    }
  }, { passive: true });

  // Initial countdown render
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      updateCountdown(true);
      start();
    });
  } else {
    updateCountdown(true);
    start();
  }

  // Continuous 1-second countdown ticker
  setInterval(() => {
    updateCountdown(false);
  }, 1000);
})();
