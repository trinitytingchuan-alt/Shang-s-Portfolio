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
    // 滚动容器现为整页 window（.main 已非滚动容器，min-height:100vh）
    const mainEl = document.querySelector('.main');
    const mainTopDoc =
      (mainEl ? mainEl.getBoundingClientRect().top : 0) + window.scrollY;
    const scrollY = window.scrollY + 200;
    let currentId = null;
    let bestTop = -Infinity;
    for (const s of sections) {
      // 元素相对页面顶部的绝对文档偏移
      const top = s.el.getBoundingClientRect().top + window.scrollY - mainTopDoc;
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

  // 滚动容器为整页 window（.main 已非滚动容器），监听 window 滚动
  window.addEventListener('scroll', setActiveNav, { passive: true });
  window.addEventListener('resize', setActiveNav, { passive: true });
  setActiveNav();

  /* ---------- Reveal on scroll (整页 window 滚动，root 用视口) ---------- */
  const reveals = document.querySelectorAll('.reveal');
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
      { root: null, rootMargin: '-40px 0px', threshold: 0.05 }
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
  const modalCaption = document.getElementById('modal-caption');

  let gallery = [];
  let galleryIndex = 0;
  let isZoomed = false;
  let manualScale = 1;

  // 预览顶栏只显示文档名，去掉末尾「· 页面 N」冗余描述（页码由计数器标识）
  function cleanCaption(text) {
    if (!text) return '';
    return text.replace(/\s*·\s*页面\s*\d+\s*$/u, '').trim();
  }

  function openModal(src, alt, caption, group, groupName) {
    if (!modal || !modalImg) return;
    gallery = group && group.length ? group : [{ src, alt, caption }];
    galleryIndex = gallery.findIndex((g) => g.src === src);
    if (galleryIndex < 0) galleryIndex = 0;
    if (modalStage) modalStage.classList.toggle('modal__stage--preview-wide', groupName === 'bgy-inv');
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
    if (modalCaption) modalCaption.textContent = item.captionClean || cleanCaption(item.caption || '');
    if (modalCounter) {
      modalCounter.textContent =
        gallery.length > 1 ? `${galleryIndex + 1} / ${gallery.length}` : '';
    }
    const showNav = gallery.length > 1;
    if (modalPrev) modalPrev.style.display = showNav ? 'flex' : 'none';
    if (modalNext) modalNext.style.display = showNav ? 'flex' : 'none';
    // Reset zoom on new image
    isZoomed = false;
    manualScale = 1;
    applyManualScale();
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
    manualScale = 1;
    applyManualScale();
    if (modalStage) {
      modalStage.classList.remove('is-zoomed');
      modalStage.classList.remove('modal__stage--preview-wide');
    }
  }

  function toggleZoom() {
    isZoomed = !isZoomed;
    modalStage && modalStage.classList.toggle('is-zoomed', isZoomed);
  }

  // 构造一个项目的图集：仅用 page-strip__item 的完整序列（p1, p2, p3...）。
  // work__hero 是 p1 的放大形态，不重复加入；点 hero 时按 src 命中 page-strip 的第 1 张。
  // 这样预览编号与缩略图编号完全一致：第1张=hero图，向右跳转=缩略图编号2。
  // 无 page-strip 的项目（仅有 hero）：退化为 hero 单图。
  function buildGallery(trigger) {
    const groupAttr = trigger.getAttribute('data-group');
    if (!groupAttr) return null;
    const article = trigger.closest('article') || trigger.closest('.work') || document;
    const items = Array.from(
      article.querySelectorAll('.page-strip__item[data-group="' + groupAttr + '"]')
    );
    if (items.length) {
      return items.map((g) => ({
        src: g.getAttribute('data-modal'),
        alt: g.getAttribute('data-alt') || '',
        caption:
          g.querySelector('.photo-item__caption')?.textContent ||
          g.getAttribute('data-alt') || '',
        captionClean: cleanCaption(
          g.querySelector('.photo-item__caption')?.textContent ||
          g.getAttribute('data-alt') || ''
        ),
      }));
    }
    // 没有缩略图：仅有 hero 的项目，单图预览
    const hero = article.querySelector('.work__hero[data-group="' + groupAttr + '"]');
    if (hero) {
      const alt = hero.getAttribute('data-alt') || '';
      return [{ src: hero.getAttribute('data-modal'), alt, caption: alt, captionClean: cleanCaption(alt) }];
    }
    return null;
  }

  // Bind every [data-modal] element
  document.querySelectorAll('[data-modal]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const src = el.getAttribute('data-modal');
      const alt = el.getAttribute('data-alt') || '';
      const caption =
        el.querySelector('.photo-item__caption')?.textContent || alt;
      const cleanAlt = cleanCaption(alt);
      const group = buildGallery(el);
      const groupName = el.getAttribute('data-group');
      openModal(src, cleanAlt, cleanCaption(caption), group, groupName);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalPrev) modalPrev.addEventListener('click', () => navModal(-1));
  if (modalNext) modalNext.addEventListener('click', () => navModal(1));
  if (modalStage) modalStage.addEventListener('click', toggleZoom);

  // 手动缩放状态：Ctrl/⌘ + 滚轮自由控制图片大小（在默认/放大宽度基础上叠加）
  function applyManualScale() {
    if (!modalImg) return;
    const active = Math.abs(manualScale - 1) >= 0.001;
    modalImg.style.transform = active ? 'scale(' + manualScale + ')' : '';
    if (modalStage) modalStage.classList.toggle('is-manual', active);
  }
  if (modalStage) {
    modalStage.addEventListener('wheel', (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      manualScale = Math.min(6, Math.max(0.4, manualScale * factor));
      applyManualScale();
    }, { passive: false });
  }
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

  /* ---------- 左侧导航点击 → 右侧平滑滚动定位（整页 window 滚动）---------- */
  function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;
    // 滚动容器为整页 window（.main 已非独立滚动容器），避免在嵌套 overflow
    // 容器内缩放页面时滚动锚定失效导致定位跑偏
    const y = el.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
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

  /* ---------- 侧栏邮箱：点击复制 ---------- */
  const copyEmail = document.getElementById('copyEmail');
  if (copyEmail) {
    const email = copyEmail.getAttribute('data-email') || '';
    const hint = document.getElementById('copyHint');
    const copy = () => {
      if (!email) return;
      const done = () => {
        if (hint) {
          hint.textContent = '已复制';
          hint.classList.add('is-copied');
          setTimeout(() => {
            hint.textContent = '点击复制';
            hint.classList.remove('is-copied');
          }, 1600);
        }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done).catch(() => fallbackCopy(email, done));
      } else {
        fallbackCopy(email, done);
      }
    };
    copyEmail.addEventListener('click', copy);
    copyEmail.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copy(); }
    });
  }

  /* ---------- 全文邮箱/电话：点击复制（与侧栏邮箱一致） ---------- */
  document.querySelectorAll('[data-copy]').forEach((el) => {
    const text = el.getAttribute('data-copy') || '';
    const copy = () => {
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
          .then(() => { flashCopied(el); })
          .catch(() => { fallbackCopy(text); flashCopied(el); });
      } else {
        fallbackCopy(text);
        flashCopied(el);
      }
    };
    el.addEventListener('click', copy);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copy(); }
    });
  });

  function flashCopied(el) {
    const prev = el.getAttribute('title') || '点击复制';
    el.setAttribute('title', '已复制 ✓');
    el.classList.add('is-copied');
    setTimeout(() => {
      el.setAttribute('title', prev);
      el.classList.remove('is-copied');
    }, 1600);
  }

  function fallbackCopy(text, cb) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (err) {}
    document.body.removeChild(ta);
    if (cb) cb();
  }
})();

/* ---------- Hero portrait: click to cycle through personal photos ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const portrait = document.getElementById('heroPortrait');
  if (!portrait) return;
  const img = portrait.querySelector('img');
  const hint = portrait.querySelector('.hero__portrait-hint');
  const photos = [
    'assets/photo/me/303153c2fe8ff5c9ba67d9c2846c5160.jpg',
    'assets/photo/me/c5bdd17582a30fa237b2d2c92995801f.jpg',
    'assets/photo/me/d19057a5a98253b09e41f8b1094ab435.jpg'
  ];
  const total = photos.length;
  let idx = 0;
  let cur = 0;
  const pad = (n) => String(n).padStart(2, '0');

  // 交叉溶解：切换前把「当前照片」铺到容器背景作底，新图再于其上淡入。
  // 全过程始终有画面覆盖（旧图底 + 新图淡入），不会出现黑底中间值。
  const setBackdrop = (src) => {
    portrait.style.backgroundImage = 'url("' + src + '")';
    portrait.style.backgroundSize = 'cover';
    portrait.style.backgroundPosition = 'center';
  };

  const swap = () => {
    const next = photos[idx];
    setBackdrop(photos[cur]);
    const pre = new Image();
    pre.onload = pre.onerror = () => {
      img.style.opacity = '0';
      img.src = next;
      cur = idx;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { img.style.opacity = '1'; });
      });
      if (hint) hint.textContent = pad(cur + 1) + ' / ' + pad(total);
      setTimeout(() => setBackdrop(next), 700);
    };
    pre.src = next;
  };

  const advance = () => {
    idx = (idx + 1) % total;
    swap();
  };

  // 初始状态：首图入位，底图同步（避免 HTML 里的旧 src 与被删图冲突）
  img.src = photos[0];
  setBackdrop(photos[0]);
  if (hint) hint.textContent = pad(1) + ' / ' + pad(total);

  // 自动轮播：每 3 秒切换一张；悬停暂停，手动操作后重置计时
  let timer = null;
  const stopTimer = () => { if (timer) { clearInterval(timer); timer = null; } };
  const startTimer = () => { stopTimer(); timer = setInterval(advance, 3000); };
  startTimer();
  portrait.addEventListener('mouseenter', stopTimer);
  portrait.addEventListener('mouseleave', startTimer);

  const manual = () => { advance(); startTimer(); };
  portrait.addEventListener('click', manual);
  portrait.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      manual();
    }
  });
});