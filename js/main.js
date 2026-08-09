/* ============================================
   尚文蜓 · 作品集 · Interactions
   ============================================ */

(function () {
  'use strict';

  /* ---------- Sidebar navigation active state ---------- */
  const navLinks = document.querySelectorAll('.sidebar__nav-link');
  const navSubLinks = document.querySelectorAll('.sidebar__nav-sub-link');
  const sections = [];

  navLinks.forEach((link) => {
    const id = link.getAttribute('data-target');
    if (id) {
      const target = document.getElementById(id);
      if (target) sections.push({ id, el: target, link, parent: true });
    }
  });

  navSubLinks.forEach((link) => {
    const id = link.getAttribute('data-target');
    if (id) {
      const target = document.getElementById(id);
      if (target) sections.push({ id, el: target, link, parent: false });
    }
  });

  function setActiveNav() {
    const scroller = document.querySelector('.main');
    if (!scroller) return;
    const scrollY = scroller.scrollTop + 200;
    const mainTop = scroller.getBoundingClientRect().top;
    let currentId = null;
    let bestTop = -Infinity;
    for (const s of sections) {
      // 元素相对 .main 内容顶部的绝对偏移（视口坐标 → 内容坐标）
      const top = s.el.getBoundingClientRect().top - mainTop + scroller.scrollTop;
      // 取横切线（scrollY）所在：已进入横切线且 offset 最大的 section
      if (top <= scrollY && top > bestTop) {
        bestTop = top;
        currentId = s.id;
      }
    }
    navLinks.forEach((l) => l.classList.remove('is-active'));
    navSubLinks.forEach((l) => l.classList.remove('is-active'));
    if (currentId) {
      const sub = document.querySelector(`.sidebar__nav-sub-link[data-target="${currentId}"]`);
      if (sub) {
        sub.classList.add('is-active');
        const parentGroup = sub.getAttribute('data-group');
        if (parentGroup) {
          document
            .querySelector(`.sidebar__nav-link[data-group="${parentGroup}"]`)
            ?.classList.add('is-active');
        }
      } else {
        const active = document.querySelector(`.sidebar__nav-link[data-target="${currentId}"]`);
        if (active) active.classList.add('is-active');
      }
    }
  }

  const mainScroller = document.querySelector('.main');
  if (mainScroller) {
    mainScroller.addEventListener('scroll', setActiveNav, { passive: true });
  }
  setActiveNav();

  /* ---------- Reveal on scroll (在 .main 滚动容器内生效) ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const revealRoot = document.querySelector('.main') || null;
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { root: revealRoot, rootMargin: '-40px 0px', threshold: 0.05 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Mobile sidebar toggle ---------- */
  const toggle = document.querySelector('.sidebar__toggle');
  const sidebar = document.querySelector('.sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('is-open');
    });
    document.querySelectorAll('.sidebar__nav-link, .sidebar__nav-sub-link').forEach((link) => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('is-open');
      });
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('is-open')
          && !sidebar.contains(e.target)
          && !toggle.contains(e.target)) {
        sidebar.classList.remove('is-open');
      }
    });
  }

  /* ---------- Gallery Lightbox ---------- */
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const modalCounter = document.getElementById('modal-counter');
  const modalClose = document.querySelector('.modal__close');
  const modalPrev = document.querySelector('.modal__nav--prev');
  const modalNext = document.querySelector('.modal__nav--next');
  const modalStage = document.getElementById('modal-stage');

  let gallery = [];
  let galleryIndex = 0;
  let isZoomed = false;

  function openModal(src, alt, group) {
    if (!modal || !modalImg) return;
    gallery = group && group.length ? group : [{ src, alt }];
    galleryIndex = gallery.findIndex((g) => g.src === src);
    if (galleryIndex < 0) galleryIndex = 0;
    renderModalImage();
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    isZoomed = false;
    modalStage && modalStage.classList.remove('is-zoomed');
  }

  function renderModalImage() {
    if (!gallery.length) return;
    const item = gallery[galleryIndex];
    modalImg.src = item.src;
    modalImg.alt = item.alt || '';
    if (modalCounter) {
      modalCounter.textContent =
        gallery.length > 1 ? `${galleryIndex + 1} / ${gallery.length}` : '';
    }
    const showNav = gallery.length > 1;
    if (modalPrev) modalPrev.style.display = showNav ? 'flex' : 'none';
    if (modalNext) modalNext.style.display = showNav ? 'flex' : 'none';
    // Reset zoom on new image
    isZoomed = false;
    modalStage && modalStage.classList.remove('is-zoomed');
  }

  function navModal(dir) {
    if (!gallery.length) return;
    galleryIndex = (galleryIndex + dir + gallery.length) % gallery.length;
    renderModalImage();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    isZoomed = false;
    modalStage && modalStage.classList.remove('is-zoomed');
  }

  function toggleZoom() {
    isZoomed = !isZoomed;
    modalStage && modalStage.classList.toggle('is-zoomed', isZoomed);
  }

  // Bind every [data-modal] element
  document.querySelectorAll('[data-modal]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const src = el.getAttribute('data-modal');
      const alt = el.getAttribute('data-alt') || '';
      const groupAttr = el.getAttribute('data-group');
      let group = null;
      if (groupAttr) {
        group = Array.from(
          document.querySelectorAll(`[data-group="${groupAttr}"]`)
        ).map((g) => ({
          src: g.getAttribute('data-modal'),
          alt: g.getAttribute('data-alt') || '',
        }));
      }
      openModal(src, alt, group);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalPrev) modalPrev.addEventListener('click', () => navModal(-1));
  if (modalNext) modalNext.addEventListener('click', () => navModal(1));
  if (modalStage) modalStage.addEventListener('click', toggleZoom);
  if (modal) {
    modal.addEventListener('click', (e) => {
      // Close when clicking backdrop (but not image/stage)
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') navModal(-1);
    if (e.key === 'ArrowRight') navModal(1);
    if (e.key === ' ' || e.key === 'z' || e.key === 'Z') {
      e.preventDefault();
      toggleZoom();
    }
  });

  /* ---------- Photography: 瀑布流（CSS columns）稳定布局 ---------- */
  // 用 data-ratio 预设每张图的比例，避免图片懒加载导致瀑布流高度抖动
  document.querySelectorAll('.photo-item').forEach((it) => {
    const r = parseFloat(it.dataset.ratio);
    const img = it.querySelector('img');
    if (r && img) img.style.aspectRatio = String(r);
  });

  /* ---------- 左侧导航点击 → 右侧平滑滚动定位（长滚动交互） ---------- */
  const mainEl = document.querySelector('.main');

  function scrollToId(id) {
    if (!mainEl || !id) return;
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top - mainEl.getBoundingClientRect().top + mainEl.scrollTop - 24;
    mainEl.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  // 点击主链接：定位到对应栏目（子阶段自然包含在作品集内）
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('data-target');
      if (!id) return;
      e.preventDefault();
      scrollToId(id);
    });
  });

  // 点击子链接：定位到具体作品
  navSubLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('data-target');
      if (!id) return;
      e.preventDefault();
      scrollToId(id);
    });
  });
})();