/* ================================================================
   AI VibeX — VibeX Runner Mini Game
   A cyberpunk side-scrolling runner built on HTML5 Canvas.

   Flow:
     1. User clicks "Play to Unlock" on the finalists card.
     2. Full-screen game overlay opens.
     3. Player jumps over 10 neon cyber barriers.
     4. After clearing all 10 → ACCESS GRANTED → PDF opens in new tab.
     5. Finalists card unlocks (blur removed).

   Controls:
     - Space / ↑ Arrow : jump (double jump allowed)
     - Click / Tap      : jump
     - Esc              : close game (without unlocking)

   LocalStorage key: 'vibex-runner-unlocked'
   If set to '1', the finalists card auto-unlocks on page load.
================================================================ */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════
     CONSTANTS
  ═══════════════════════════════════════════════════════ */
  var PDF_URL       = 'assets/AI_VIBEX_1.0_Finalists.pdf';
  var HURDLES_WIN   = 10;
  var GRAVITY       = 0.58;
  var JUMP_FORCE    = -13.5;
  var BASE_SPEED    = 5.2;
  var SPEED_INC     = 0.22;      // extra px/frame per hurdle cleared
  var GROUND_FRAC   = 0.76;      // ground y as fraction of canvas height
  var OBS_MIN_GAP   = 360;       // minimum px gap between obstacles (ground units)
  var OBS_MAX_GAP   = 580;

  /* ═══════════════════════════════════════════════════════
     COLOURS
  ═══════════════════════════════════════════════════════ */
  var C = {
    bg:      '#050811',
    cyan:    '#22d3ee',
    purple:  '#8b5cf6',
    emerald: '#10b981',
    amber:   '#f59e0b',
    white:   '#f8fafc',
    muted:   '#475569',
    surface: 'rgba(15,23,42,0.8)',
  };

  /* ═══════════════════════════════════════════════════════
     STATE
  ═══════════════════════════════════════════════════════ */
  var canvas, ctx, overlay;
  var raf = null;
  var state       = 'idle';    // idle | countdown | playing | dead | won
  var hurdled     = 0;
  var frameN      = 0;
  var nextObsAt   = 0;
  var gridOffset  = 0;
  var countdown   = 3;
  var cdStart     = 0;
  var bestScore   = parseInt(localStorage.getItem('vibex-runner-best') || '0', 10);
  var sessionWon  = false;

  /* ── Player ── */
  var P = {
    x: 0, y: 0, w: 42, h: 54,
    vy: 0,
    grounded: false,
    jumpCount: 0,
    legPhase: 0,
  };

  /* ── Collections ── */
  var obstacles  = [];
  var particles  = [];
  var scorePopups = [];   // "+1" floating texts on hurdle clear

  /* ═══════════════════════════════════════════════════════
     DOM BUILDER
  ═══════════════════════════════════════════════════════ */
  function buildDOM() {
    overlay = document.createElement('div');
    overlay.id = 'vr-overlay';
    overlay.className = 'vr-hidden';
    overlay.innerHTML =
      '<div id="vr-header">' +
        '<div id="vr-logo">' +
          '<span id="vr-logo-vibe">VIBE</span>' +
          '<span id="vr-logo-x">X</span>' +
          '<span id="vr-logo-runner">RUNNER</span>' +
        '</div>' +
        '<div id="vr-hud">' +
          '<div id="vr-hud-hurdles">' +
            '<span class="vr-hud-label">HURDLES CLEARED</span>' +
            '<div id="vr-hurdle-pips"></div>' +
          '</div>' +
          '<button id="vr-close-btn" title="Close game (Esc)">&#x2715;</button>' +
        '</div>' +
      '</div>' +
      '<canvas id="vr-canvas"></canvas>' +
      '<div id="vr-instructions">SPACE &nbsp;/&nbsp; TAP to jump &nbsp;&bull;&nbsp; &#8593; for double jump &nbsp;&bull;&nbsp; ESC to close</div>' +
      '<div id="vr-screen" class="hidden">' +
        '<div id="vr-screen-inner">' +
          '<span id="vr-screen-icon"></span>' +
          '<div id="vr-screen-title"></div>' +
          '<div id="vr-screen-sub"></div>' +
          '<div id="vr-score-line" style="display:none"></div>' +
          '<button id="vr-screen-btn"></button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    canvas = document.getElementById('vr-canvas');
    ctx    = canvas.getContext('2d');

    updatePips();
    sizeCanvas();

    document.getElementById('vr-close-btn').addEventListener('click', closeGame.bind(null, false));
    document.getElementById('vr-screen-btn').addEventListener('click', onScreenBtn);
    canvas.addEventListener('pointerdown', function (e) { e.preventDefault(); jump(); });
    window.addEventListener('resize', sizeCanvas);
  }

  /* ═══════════════════════════════════════════════════════
     HUD
  ═══════════════════════════════════════════════════════ */
  function updatePips() {
    var el = document.getElementById('vr-hurdle-pips');
    if (!el) return;
    var html = '';
    for (var i = 0; i < HURDLES_WIN; i++) {
      html += '<span class="vr-pip' + (i < hurdled ? ' vr-pip-done' : '') + '"></span>';
    }
    el.innerHTML = html;
  }

  /* ═══════════════════════════════════════════════════════
     CANVAS SIZING
  ═══════════════════════════════════════════════════════ */
  function sizeCanvas() {
    if (!canvas) return;
    var dpr = window.devicePixelRatio || 1;
    var w   = canvas.offsetWidth;
    var h   = canvas.offsetHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    P.x = Math.floor(w * 0.13);
  }

  function W() { return canvas.offsetWidth; }
  function H() { return canvas.offsetHeight; }
  function gnd() { return H() * GROUND_FRAC; }

  /* ═══════════════════════════════════════════════════════
     GAME LIFECYCLE
  ═══════════════════════════════════════════════════════ */
  function resetGame() {
    hurdled     = 0;
    frameN      = 0;
    nextObsAt   = 180;
    obstacles   = [];
    particles   = [];
    scorePopups = [];
    gridOffset  = 0;
    state       = 'countdown';
    countdown   = 3;
    cdStart     = performance.now();

    P.x          = Math.floor(W() * 0.13);
    P.y          = gnd() - P.h;
    P.vy         = 0;
    P.grounded   = true;
    P.jumpCount  = 0;
    P.legPhase   = 0;

    updatePips();
    hideScreen();
  }

  function startGame() {
    if (raf) cancelAnimationFrame(raf);
    resetGame();
    raf = requestAnimationFrame(loop);
  }

  /* ═══════════════════════════════════════════════════════
     INPUT
  ═══════════════════════════════════════════════════════ */
  function jump() {
    if (state === 'dead' || state === 'won') return;
    if (state === 'idle' || state === 'countdown') {
      startGame();
      return;
    }
    if (state !== 'playing') return;
    if (P.grounded || P.jumpCount < 2) {
      P.vy        = JUMP_FORCE;
      P.grounded  = false;
      P.jumpCount++;
      spawnJumpDust();
    }
  }

  function onKey(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      jump();
    }
    if (e.code === 'Escape') {
      closeGame(false);
    }
  }

  /* ═══════════════════════════════════════════════════════
     OBSTACLES
  ═══════════════════════════════════════════════════════ */
  var OBS_TEMPLATES = [
    { w: 24, h: 50 },   // narrow mid
    { w: 36, h: 40 },   // wide short
    { w: 20, h: 68 },   // narrow tall
    { w: 30, h: 55 },   // medium tall
    { w: 42, h: 36 },   // very wide low
  ];

  function spawnObstacle() {
    var g    = gnd();
    var tmpl = OBS_TEMPLATES[Math.floor(Math.random() * OBS_TEMPLATES.length)];
    obstacles.push({
      x:      W() + 20,
      y:      g - tmpl.h,
      w:      tmpl.w,
      h:      tmpl.h,
      passed: false,
      hue:    Math.random() > 0.5 ? C.purple : C.cyan,
    });
  }

  function speed() {
    return BASE_SPEED + hurdled * SPEED_INC;
  }

  /* ═══════════════════════════════════════════════════════
     PARTICLES
  ═══════════════════════════════════════════════════════ */
  function spawnJumpDust() {
    var px = P.x + P.w / 2;
    var py = P.y + P.h;
    for (var i = 0; i < 7; i++) {
      particles.push({
        x:     px + (Math.random() - 0.5) * 20,
        y:     py,
        vx:    (Math.random() - 0.5) * 2.5,
        vy:    Math.random() * -1.8 - 0.5,
        alpha: 0.9,
        r:     Math.random() * 3.5 + 1.5,
        col:   C.cyan,
        life:  40,
      });
    }
  }

  function spawnClearBurst(cx, cy) {
    var cols = [C.cyan, C.purple, C.emerald, C.amber, '#fff'];
    for (var i = 0; i < 22; i++) {
      var angle = (i / 22) * Math.PI * 2;
      var spd   = Math.random() * 5 + 2.5;
      particles.push({
        x:     cx,
        y:     cy,
        vx:    Math.cos(angle) * spd,
        vy:    Math.sin(angle) * spd,
        alpha: 1,
        r:     Math.random() * 5 + 2,
        col:   cols[i % cols.length],
        life:  55,
      });
    }
  }

  function spawnDeathBurst(cx, cy) {
    for (var i = 0; i < 18; i++) {
      var a = (i / 18) * Math.PI * 2;
      particles.push({
        x:     cx, y: cy,
        vx:    Math.cos(a) * (Math.random() * 4 + 1.5),
        vy:    Math.sin(a) * (Math.random() * 4 + 1.5),
        alpha: 1,
        r:     Math.random() * 4 + 2,
        col:   '#ef4444',
        life:  45,
      });
    }
  }

  /* ═══════════════════════════════════════════════════════
     COLLISION
  ═══════════════════════════════════════════════════════ */
  function hitTest(o) {
    var margin = 7;
    var px = P.x + margin;
    var py = P.y + margin / 2;
    var pw = P.w - margin * 2;
    var ph = P.h - margin;
    return px < o.x + o.w &&
           px + pw > o.x &&
           py < o.y + o.h &&
           py + ph > o.y;
  }

  /* ═══════════════════════════════════════════════════════
     SCREEN OVERLAYS
  ═══════════════════════════════════════════════════════ */
  function showScreen(icon, title, sub, btnTxt, scoreVisible) {
    var el = document.getElementById('vr-screen');
    el.classList.remove('hidden');
    document.getElementById('vr-screen-icon').textContent  = icon;
    document.getElementById('vr-screen-title').textContent = title;
    document.getElementById('vr-screen-sub').textContent   = sub;
    document.getElementById('vr-screen-btn').textContent   = btnTxt;
    var sl = document.getElementById('vr-score-line');
    if (scoreVisible) {
      sl.textContent = '// Best run: ' + bestScore + ' / ' + HURDLES_WIN + ' hurdles';
      sl.style.display = 'block';
    } else {
      sl.style.display = 'none';
    }
  }

  function hideScreen() {
    document.getElementById('vr-screen').classList.add('hidden');
  }

  function onScreenBtn() {
    if (state === 'dead') {
      startGame();
    } else if (state === 'won') {
      closeGame(true);
    }
  }

  /* ═══════════════════════════════════════════════════════
     WIN / LOSE
  ═══════════════════════════════════════════════════════ */
  function die() {
    state = 'dead';
    if (raf) cancelAnimationFrame(raf);
    spawnDeathBurst(P.x + P.w / 2, P.y + P.h / 2);
    // Update best
    if (hurdled > bestScore) {
      bestScore = hurdled;
      localStorage.setItem('vibex-runner-best', bestScore);
    }
    // Final render with particles
    render(performance.now());
    setTimeout(function () {
      showScreen('💀', 'SYSTEM FAILURE', 'You were hit! Clear 10 hurdles without crashing to unlock the results.', '↺  Try Again', true);
    }, 500);
  }

  function win() {
    state = 'won';
    sessionWon = true;
    if (raf) cancelAnimationFrame(raf);
    hurdled = HURDLES_WIN;
    updatePips();
    bestScore = HURDLES_WIN;
    localStorage.setItem('vibex-runner-best', HURDLES_WIN);
    localStorage.setItem('vibex-runner-unlocked', '1');

    // Final celebration burst
    spawnClearBurst(W() / 2, gnd() - 40);
    render(performance.now());

    // Update card on page to unlocked state (DO NOT redirect yet)
    updateCardUI(true);
    showToast('🎉 Results unlocked! Click View Results to open the PDF.');

    // Show win screen with "View Results" button
    setTimeout(function () {
      showScreen(
        '🏆',
        'ACCESS GRANTED!',
        'You cleared all 10 cyber barriers! Click below to view the official finalists roster.',
        '📄  View Results',
        false
      );
    }, 600);
  }

  /* ═══════════════════════════════════════════════════════
     UPDATE CARD UI (LOCKED VS UNLOCKED)
  ═══════════════════════════════════════════════════════ */
  function updateCardUI(isUnlocked) {
    var card       = document.querySelector('.finalists-card');
    var unlockBtn  = document.getElementById('finalists-unlock-btn');
    var previewBtn = document.getElementById('finalists-preview-btn');
    var replayBtn  = document.getElementById('finalists-replay-btn');
    var statusDot  = document.getElementById('finalists-status-dot');
    var statusText = document.getElementById('finalists-status-text');
    var metaText   = document.getElementById('finalists-meta-text');
    var docIcon    = document.getElementById('finalists-doc-icon');

    if (card) {
      if (isUnlocked) {
        card.classList.remove('finalists-locked');
      } else {
        card.classList.add('finalists-locked');
      }
    }

    if (unlockBtn)  unlockBtn.style.display  = isUnlocked ? 'none' : 'inline-flex';
    if (previewBtn) previewBtn.style.display = isUnlocked ? 'inline-flex' : 'none';
    if (replayBtn)  replayBtn.style.display  = isUnlocked ? 'inline-flex' : 'none';

    if (statusDot) {
      statusDot.className = isUnlocked ? 'badge-dot pulse-green' : 'badge-dot pulse-amber';
    }
    if (statusText) {
      statusText.textContent = isUnlocked ? 'Shortlist Confirmed' : 'Finalists Locked';
    }
    if (metaText) {
      metaText.textContent = isUnlocked
        ? 'Official Finalists Roster \u2022 1.7 MB \u2022 Department of AIML, MITE'
        : 'Clear 10 hurdles in VibeX Runner to unlock official roster';
    }
    if (docIcon) {
      if (isUnlocked) {
        docIcon.setAttribute('href', PDF_URL);
        docIcon.setAttribute('target', '_blank');
        docIcon.setAttribute('rel', 'noopener noreferrer');
        docIcon.style.cursor = 'pointer';
        docIcon.title = 'Open PDF preview in new tab';
      } else {
        docIcon.removeAttribute('href');
        docIcon.removeAttribute('target');
        docIcon.removeAttribute('rel');
        docIcon.style.cursor = 'default';
        docIcon.title = 'Play VibeX Runner to unlock';
      }
    }
  }

  /* ═══════════════════════════════════════════════════════
     TOAST
  ═══════════════════════════════════════════════════════ */
  function showToast(msg) {
    var t = document.getElementById('vr-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'vr-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('vr-toast-show');
    setTimeout(function () {
      t.classList.remove('vr-toast-show');
    }, 3200);
  }

  /* ═══════════════════════════════════════════════════════
     OPEN / CLOSE GAME
  ═══════════════════════════════════════════════════════ */
  function openGame() {
    if (!overlay) buildDOM();

    overlay.classList.remove('vr-hidden');
    overlay.classList.remove('vr-fade-out');
    document.body.style.overflow = 'hidden';

    state = 'idle';
    sizeCanvas();

    P.x = Math.floor(W() * 0.13);
    P.y = gnd() - P.h;
    P.vy = 0;
    P.grounded = true;
    P.jumpCount = 0;
    obstacles  = [];
    particles  = [];
    scorePopups = [];
    hurdled    = 0;
    updatePips();
    hideScreen();

    window.addEventListener('keydown', onKey);

    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }

  function closeGame(openPdf) {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    state = 'idle';
    window.removeEventListener('keydown', onKey);
    document.body.style.overflow = '';

    // Fade out overlay
    if (overlay) {
      overlay.classList.add('vr-fade-out');
      setTimeout(function () {
        overlay.classList.add('vr-hidden');
        overlay.classList.remove('vr-fade-out');
      }, 380);
    }

    // ONLY open the PDF when user explicitly clicked "View Results" (openPdf === true)
    if (openPdf && sessionWon) {
      window.open(PDF_URL, '_blank', 'noopener,noreferrer');
    }
  }

  /* ═══════════════════════════════════════════════════════
     GAME LOOP
  ═══════════════════════════════════════════════════════ */
  function loop(ts) {
    // Countdown phase
    if (state === 'countdown') {
      var elapsed = (ts - cdStart) / 1000;
      countdown = Math.max(1, Math.ceil(3 - elapsed));
      if (elapsed >= 3) {
        state  = 'playing';
        frameN = 0;
      }
    }

    update();
    render(ts);

    if (state !== 'dead' && state !== 'won') {
      raf = requestAnimationFrame(loop);
    }
  }

  /* ═══════════════════════════════════════════════════════
     UPDATE
  ═══════════════════════════════════════════════════════ */
  function update() {
    if (state !== 'playing') return;

    frameN++;
    var g  = gnd();
    var sp = speed();

    // Grid scroll
    gridOffset = (gridOffset + sp) % 70;

    // Player physics
    P.vy += GRAVITY;
    P.y  += P.vy;

    if (P.y >= g - P.h) {
      P.y         = g - P.h;
      P.vy        = 0;
      P.grounded  = true;
      P.jumpCount = 0;
    } else {
      P.grounded = false;
    }

    if (P.grounded) P.legPhase += 0.28;

    // Spawn obstacles
    if (frameN >= nextObsAt && hurdled < HURDLES_WIN) {
      spawnObstacle();
      var gap   = OBS_MIN_GAP + Math.random() * (OBS_MAX_GAP - OBS_MIN_GAP);
      nextObsAt = frameN + Math.ceil(gap / sp);
    }

    // Move & check obstacles
    for (var i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].x -= sp;

      if (!obstacles[i].passed && obstacles[i].x + obstacles[i].w < P.x) {
        obstacles[i].passed = true;
        hurdled++;
        spawnClearBurst(
          obstacles[i].x + obstacles[i].w / 2,
          obstacles[i].y + obstacles[i].h / 2
        );
        // Score popup
        scorePopups.push({ x: P.x + P.w, y: P.y, alpha: 1, dy: -1.2 });
        updatePips();
        if (hurdled >= HURDLES_WIN) {
          win();
          return;
        }
      }

      if (hitTest(obstacles[i])) {
        die();
        return;
      }

      if (obstacles[i].x + obstacles[i].w < 0) {
        obstacles.splice(i, 1);
      }
    }

    // Update particles
    for (var j = particles.length - 1; j >= 0; j--) {
      var pt = particles[j];
      pt.x    += pt.vx;
      pt.y    += pt.vy;
      pt.vy   += 0.12;
      pt.life -= 1;
      pt.alpha = pt.life / (pt.col === '#ef4444' ? 45 : 55);
      if (pt.life <= 0) particles.splice(j, 1);
    }

    // Update score popups
    for (var k = scorePopups.length - 1; k >= 0; k--) {
      scorePopups[k].y     += scorePopups[k].dy;
      scorePopups[k].alpha -= 0.022;
      if (scorePopups[k].alpha <= 0) scorePopups.splice(k, 1);
    }
  }

  /* ═══════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════ */
  function render(ts) {
    var w = W();
    var h = H();
    var g = gnd();

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, w, h);

    // Scrolling grid
    drawGrid(w, h, g);

    // Ground glow line
    var gr = ctx.createLinearGradient(0, 0, w, 0);
    gr.addColorStop(0,   'rgba(34,211,238,0)');
    gr.addColorStop(0.2, C.cyan);
    gr.addColorStop(0.5, C.purple);
    gr.addColorStop(0.8, C.cyan);
    gr.addColorStop(1,   'rgba(34,211,238,0)');
    ctx.save();
    ctx.shadowBlur  = 14;
    ctx.shadowColor = C.cyan;
    ctx.strokeStyle = gr;
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(0, g);
    ctx.lineTo(w, g);
    ctx.stroke();
    ctx.restore();

    // Obstacles
    for (var i = 0; i < obstacles.length; i++) drawObstacle(obstacles[i]);

    // Player (skip if dead and no particles left yet)
    if (state !== 'dead' || particles.length > 0) drawPlayer(ts);

    // Particles
    for (var j = 0; j < particles.length; j++) drawParticle(particles[j]);

    // Score popups
    for (var k = 0; k < scorePopups.length; k++) drawScorePopup(scorePopups[k]);

    // Speed indicator strip
    if (state === 'playing') drawSpeedBar(w, h);

    // Countdown overlay
    if (state === 'countdown') drawCountdown(w, h, ts);

    // Idle start prompt
    if (state === 'idle') drawIdlePrompt(w, h, ts);
  }

  /* ── Draw helpers ── */

  function drawGrid(w, h, g) {
    ctx.save();
    ctx.strokeStyle = 'rgba(34,211,238,0.055)';
    ctx.lineWidth   = 1;
    var cell = 70;
    // Vertical scrolling lines
    for (var x = -(gridOffset % cell); x < w; x += cell) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, g);
      ctx.stroke();
    }
    // Horizontal fixed lines
    for (var y = cell; y < g; y += cell) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    // Perspective lines from bottom center
    ctx.strokeStyle = 'rgba(139,92,246,0.04)';
    var midX = w / 2;
    for (var i = 0; i <= 8; i++) {
      var tx = (w / 8) * i;
      ctx.beginPath();
      ctx.moveTo(tx, g);
      ctx.lineTo(midX + (tx - midX) * 0.1, 0);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawObstacle(o) {
    ctx.save();
    ctx.shadowBlur  = 18;
    ctx.shadowColor = o.hue;

    // Main fill
    var grad = ctx.createLinearGradient(o.x, o.y, o.x, o.y + o.h);
    if (o.hue === C.purple) {
      grad.addColorStop(0, 'rgba(139,92,246,0.95)');
      grad.addColorStop(1, 'rgba(99,60,180,0.9)');
    } else {
      grad.addColorStop(0, 'rgba(34,211,238,0.95)');
      grad.addColorStop(1, 'rgba(14,165,180,0.9)');
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    roundRect(o.x, o.y, o.w, o.h, 4);
    ctx.fill();

    // Top glow cap
    ctx.shadowBlur  = 10;
    ctx.shadowColor = '#fff';
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(o.x + 4, o.y);
    ctx.lineTo(o.x + o.w - 4, o.y);
    ctx.stroke();

    // Circuit detail line
    if (o.h > 48) {
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth   = 1;
      ctx.shadowBlur  = 0;
      ctx.beginPath();
      ctx.moveTo(o.x + o.w / 2, o.y + 10);
      ctx.lineTo(o.x + o.w / 2, o.y + o.h - 8);
      ctx.stroke();
      // Small horizontal tick marks
      for (var t = o.y + 16; t < o.y + o.h - 10; t += 12) {
        ctx.beginPath();
        ctx.moveTo(o.x + 4, t);
        ctx.lineTo(o.x + o.w - 4, t);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  function drawPlayer(ts) {
    var x  = P.x;
    var y  = P.y;
    var w  = P.w;
    var h  = P.h;
    var lp = P.legPhase;
    var jumping = !P.grounded;

    ctx.save();

    // Shadow on ground when in air
    if (jumping) {
      var shadowY   = gnd();
      var shadowDist = shadowY - (y + h);
      var shadowAlpha = Math.max(0, 0.4 - shadowDist / (H() * 0.5));
      var shadowW   = w * (1 - shadowDist / (H() * 0.5) * 0.5);
      ctx.fillStyle = 'rgba(139,92,246,' + shadowAlpha + ')';
      ctx.beginPath();
      ctx.ellipse(x + w / 2, shadowY, shadowW / 2, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Legs ──
    var legH   = 13;
    var legW   = 11;
    var l1off  = P.grounded ? Math.sin(lp) * 5     : (jumping ? -4 : 0);
    var l2off  = P.grounded ? Math.sin(lp + Math.PI) * 5 : (jumping ? 2 : 0);

    ctx.fillStyle   = C.purple;
    ctx.shadowBlur  = 6;
    ctx.shadowColor = C.purple;
    // Left leg
    ctx.fillRect(x + 7,       y + h - legH + l1off, legW, legH - l1off);
    // Right leg
    ctx.fillRect(x + w - 7 - legW, y + h - legH + l2off, legW, legH - l2off);

    // ── Body ──
    ctx.shadowBlur  = 20;
    ctx.shadowColor = jumping ? C.purple : C.cyan;
    ctx.fillStyle   = '#0f1b30';
    ctx.strokeStyle = jumping ? C.purple : C.cyan;
    ctx.lineWidth   = 2;
    ctx.beginPath();
    roundRect(x + 4, y + 15, w - 8, h - 25, 7);
    ctx.fill();
    ctx.stroke();

    // Body inner glow strip
    ctx.fillStyle = 'rgba(34,211,238,0.07)';
    ctx.beginPath();
    roundRect(x + 7, y + 18, w - 14, (h - 25) / 2, 4);
    ctx.fill();

    // ── Head ──
    ctx.shadowBlur  = 14;
    ctx.shadowColor = C.purple;
    ctx.fillStyle   = '#0a1225';
    ctx.strokeStyle = C.purple;
    ctx.lineWidth   = 1.8;
    ctx.beginPath();
    roundRect(x + 6, y + 1, w - 12, 17, 5);
    ctx.fill();
    ctx.stroke();

    // ── Eyes ──
    var eyeCol = state === 'dead' ? '#ef4444' : (jumping ? C.purple : C.cyan);
    ctx.shadowBlur  = 14;
    ctx.shadowColor = eyeCol;
    ctx.fillStyle   = eyeCol;
    ctx.beginPath();
    ctx.arc(x + 14, y + 10, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w - 14, y + 10, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // ── Chest status indicator ──
    var chestCol = P.grounded ? C.emerald : C.amber;
    ctx.shadowBlur  = 10;
    ctx.shadowColor = chestCol;
    ctx.fillStyle   = chestCol;
    ctx.beginPath();
    ctx.arc(x + w / 2, y + 23, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawParticle(pt) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, pt.alpha);
    ctx.fillStyle   = pt.col;
    ctx.shadowBlur  = 8;
    ctx.shadowColor = pt.col;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawScorePopup(sp) {
    ctx.save();
    ctx.globalAlpha = sp.alpha;
    ctx.fillStyle   = C.emerald;
    ctx.font        = 'bold 15px JetBrains Mono, monospace';
    ctx.textAlign   = 'center';
    ctx.shadowBlur  = 10;
    ctx.shadowColor = C.emerald;
    ctx.fillText('+1', sp.x, sp.y);
    ctx.restore();
  }

  function drawSpeedBar(w, h) {
    var pct  = Math.min(hurdled / HURDLES_WIN, 1);
    var barW = w * 0.35;
    var barH = 4;
    var bx   = (w - barW) / 2;
    var by   = h - 32;

    ctx.save();
    // Track
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    roundRect(bx, by, barW, barH, 2);
    ctx.fill();

    // Fill
    if (pct > 0) {
      var fg = ctx.createLinearGradient(bx, 0, bx + barW, 0);
      fg.addColorStop(0,   C.purple);
      fg.addColorStop(0.5, C.cyan);
      fg.addColorStop(1,   C.emerald);
      ctx.fillStyle   = fg;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = C.cyan;
      ctx.beginPath();
      roundRect(bx, by, barW * pct, barH, 2);
      ctx.fill();
    }

    // Label
    ctx.globalAlpha = 0.5;
    ctx.fillStyle   = C.muted;
    ctx.font        = '10px JetBrains Mono, monospace';
    ctx.textAlign   = 'center';
    ctx.shadowBlur  = 0;
    ctx.fillText(hurdled + ' / ' + HURDLES_WIN + ' hurdles', w / 2, by - 5);

    ctx.restore();
  }

  function drawCountdown(w, h, ts) {
    ctx.save();
    ctx.fillStyle = 'rgba(5,8,17,0.72)';
    ctx.fillRect(0, 0, w, h);

    var pulse = 1 + 0.04 * Math.sin(ts / 200);
    ctx.save();
    ctx.translate(w / 2, h / 2 + 24);
    ctx.scale(pulse, pulse);
    ctx.font        = 'bold 100px JetBrains Mono, monospace';
    ctx.textAlign   = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur  = 50;
    ctx.shadowColor = C.cyan;
    ctx.fillStyle   = C.cyan;
    ctx.fillText(countdown, 0, 0);
    ctx.restore();

    ctx.font        = '16px JetBrains Mono, monospace';
    ctx.textAlign   = 'center';
    ctx.fillStyle   = C.muted;
    ctx.shadowBlur  = 0;
    ctx.fillText('Get ready — clear 10 hurdles!', w / 2, h / 2 + 80);
    ctx.restore();
  }

  function drawIdlePrompt(w, h, ts) {
    ctx.save();
    ctx.fillStyle = 'rgba(5,8,17,0.78)';
    ctx.fillRect(0, 0, w, h);

    // Draw a static player in idle
    P.x = Math.floor(w * 0.13);
    P.y = gnd() - P.h;
    P.grounded = true;
    P.legPhase = ts / 300;
    drawPlayer(ts);

    // Some idle obstacles as decoration (not interactive)
    var demoObs = [
      { x: w * 0.5,  y: gnd() - 50, w: 24, h: 50, hue: C.purple },
      { x: w * 0.72, y: gnd() - 40, w: 36, h: 40, hue: C.cyan   },
    ];
    demoObs.forEach(drawObstacle);

    var alpha = 0.65 + 0.35 * Math.sin(ts / 600);
    ctx.globalAlpha = alpha;
    ctx.font        = 'bold 22px JetBrains Mono, monospace';
    ctx.textAlign   = 'center';
    ctx.fillStyle   = C.cyan;
    ctx.shadowBlur  = 24;
    ctx.shadowColor = C.cyan;
    ctx.fillText('▶  PRESS SPACE or TAP TO START', w / 2, h * 0.42);

    ctx.shadowBlur  = 0;
    ctx.globalAlpha = 0.45;
    ctx.font        = '13px JetBrains Mono, monospace';
    ctx.fillStyle   = C.muted;
    ctx.fillText('Clear 10 cyber barriers to unlock the AI VibeX finalists list', w / 2, h * 0.42 + 32);

    ctx.restore();
  }

  /* ── Canvas path helpers ── */
  function roundRect(x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y,     x + w,     y + r);
    ctx.lineTo(x + w,     y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r,     y + h);
    ctx.quadraticCurveTo(x,     y + h, x,          y + h - r);
    ctx.lineTo(x,          y + r);
    ctx.quadraticCurveTo(x,     y,     x + r,      y);
    ctx.closePath();
  }

  /* ═══════════════════════════════════════════════════════
     PAGE-LOAD INIT
  ═══════════════════════════════════════════════════════ */
  function initPage() {
    var alreadyUnlocked = localStorage.getItem('vibex-runner-unlocked') === '1';

    // Sync card UI to current state
    updateCardUI(alreadyUnlocked);

    // Wire up buttons
    var unlockBtn = document.getElementById('finalists-unlock-btn');
    if (unlockBtn) {
      unlockBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openGame();
      });
    }

    var replayBtn = document.getElementById('finalists-replay-btn');
    if (replayBtn) {
      replayBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openGame();
      });
    }
  }

  /* ═══════════════════════════════════════════════════════
     PUBLIC API
  ═══════════════════════════════════════════════════════ */
  window.VibeXRunner = {
    open:   openGame,
    unlock: function () {
      localStorage.setItem('vibex-runner-unlocked', '1');
      updateCardUI(true);
    },
    reset:  function () {
      localStorage.removeItem('vibex-runner-unlocked');
      localStorage.removeItem('vibex-runner-best');
      location.reload();
    },
  };

  // Kick off page init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
  } else {
    initPage();
  }

})();

