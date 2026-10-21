/* Scroll-progress animation for the AI VibeX particle wordmark. */
(function () {
  'use strict';

  const section = document.getElementById('vibex-wordmark');
  const stage = section && section.querySelector('.vibex-wordmark-stage');
  if (!section || !stage) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let progress = readProgress();
  let targetProgress = progress;
  let previousFrameTime = 0;
  let animationFrame = 0;
  let inView = false;
  const smoothing = 4.5;

  function clamp(value) {
    return Math.max(0, Math.min(1, value));
  }

  function readProgress() {
    const range = section.offsetHeight - stage.offsetHeight;
    return range > 0 ? clamp(-section.getBoundingClientRect().top / range) : 0;
  }

  function publishProgress(value) {
    section.dispatchEvent(new CustomEvent('vibex:scrollprogress', {
      detail: { progress: value }
    }));
  }

  function animateProgress(time) {
    animationFrame = 0;
    if (document.hidden || !inView || reducedMotion.matches) return;

    const deltaTime = previousFrameTime
      ? Math.min(0.05, (time - previousFrameTime) / 1000)
      : 0.016;
    previousFrameTime = time;
    progress += (targetProgress - progress) * (1 - Math.exp(-smoothing * deltaTime));
    if (Math.abs(targetProgress - progress) < 1e-5) progress = targetProgress;
    publishProgress(progress);

    if (progress !== targetProgress) {
      animationFrame = requestAnimationFrame(animateProgress);
    }
  }

  function updateProgress() {
    targetProgress = readProgress();
    if (reducedMotion.matches) {
      progress = 0.34;
      publishProgress(progress);
    } else if (!inView || document.hidden) {
      progress = targetProgress;
      publishProgress(progress);
    } else if (!animationFrame && progress !== targetProgress) {
      previousFrameTime = 0;
      animationFrame = requestAnimationFrame(animateProgress);
    }
  }

  function syncAnimation() {
    targetProgress = reducedMotion.matches ? 0.34 : readProgress();
    if (inView && !document.hidden && !reducedMotion.matches && progress !== targetProgress) {
      if (!animationFrame) {
        previousFrameTime = 0;
        animationFrame = requestAnimationFrame(animateProgress);
      }
    } else if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }

    if (reducedMotion.matches) {
      progress = 0.34;
      publishProgress(progress);
    } else if (!inView || document.hidden) {
      progress = targetProgress;
      publishProgress(progress);
    }
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[entries.length - 1].isIntersecting;
      syncAnimation();
    }, { rootMargin: '100px 0px' }).observe(section);
  } else {
    inView = true;
  }

  document.addEventListener('visibilitychange', syncAnimation);
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', syncAnimation);
  } else if (typeof reducedMotion.addListener === 'function') {
    reducedMotion.addListener(syncAnimation);
  }
  publishProgress(progress);
  syncAnimation();
})();
