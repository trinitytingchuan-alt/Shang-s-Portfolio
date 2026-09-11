/* ============================================================
   Active Theory v3 · 动态增强
   原则：不突兀、不喧宾夺主、沿用现有排版
   - 顶部滚动进度条（随当前栏目色调流动）
   - 背景固定辉光随当前栏目色调“逐页”流动（每一页的动态变化）
   - 图片展示栏底部窗口：注入毛玻璃信息条（取代纯色块）
   ============================================================ */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 顶部滚动进度条 ---------- */
  var progress = document.createElement('div');
  progress.className = 'at-progress';
  document.body.appendChild(progress);

  function updateProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progress.style.transform = 'scaleX(' + p.toFixed(4) + ')';
  }

  /* ---------- 2. 当前栏目色调 → 背景辉光逐页流动 ---------- */
  var IDS = ['hero', 'about', 'capability', 'stage-anker', 'stage-kuaishou',
             'stage-bgy', 'stage-project', 'photography', 'interests', 'honors', 'contact'];
  var sections = IDS
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  var activeHue = '';
  function setHue(hue) {
    if (hue && hue !== activeHue) {
      activeHue = hue;
      root.style.setProperty('--canvas-hue', hue);
    }
  }
  function hueOf(el) {
    if (!el) return '';
    return (getComputedStyle(el).getPropertyValue('--at-hue') || '').trim();
  }

  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var hue = hueOf(e.target);
          if (hue) setHue(hue);
          sections.forEach(function (s) { s.classList.remove('is-active-section'); });
          e.target.classList.add('is-active-section');
        }
      });
    }, { root: null, rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    sections.forEach(function (s) { io.observe(s); });
  } else if (sections.length) {
    setHue(hueOf(sections[0]));
  }

  /* ---------- 3. 图片展示栏底部毛玻璃信息条 ---------- */
  document.querySelectorAll('.work__hero').forEach(function (fig) {
    if (fig.querySelector('.work__hero-cap')) return;
    var cap = document.createElement('figcaption');
    cap.className = 'work__hero-cap';
    var alt = fig.getAttribute('data-alt') || '';
    var work = fig.closest('.work');
    var titleEl = work ? work.querySelector('.work__title') : null;
    var title = titleEl ? (titleEl.textContent || '').trim() : '';
    cap.textContent = title ? (title + (alt ? ' · ' + alt : '')) : alt;
    fig.appendChild(cap);
  });

  /* ---------- 滚动监听（rAF 节流） ---------- */
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(function () { updateProgress(); ticking = false; });
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateProgress();
})();
