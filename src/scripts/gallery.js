/**
 * gallery.js — 分类切换 + 翻页 + 视频播放 + 动效
 * Phase 2-4: 动态卡片渲染、标签切换、翻页、播放交互、过渡动画
 */

import worksData from '../data/works.json';
import { isMobile, playLightbox, playFullscreen } from './player.js';
import { transitionCards, staggerIn } from './animations.js';

/* ==================== 状态 ==================== */
const CARDS_PER_PAGE = 4;
let currentCategory = 'portrait';
let currentPage = 1;
let isInitialLoad = true;

/* ==================== DOM 引用 ==================== */
const gallery = document.getElementById('gallery');
const catTabs = document.querySelectorAll('.cat-tab');
const catCount = document.querySelector('.cat-count');
const paginationDots = document.querySelector('.pagination-dots');
const prevBtn = document.querySelector('.pagination-prev');
const nextBtn = document.querySelector('.pagination-next');

/* ==================== 工具函数 ==================== */

function getCategoryWorks(categoryId) {
  const cat = worksData.categories.find(c => c.id === categoryId);
  return cat ? cat.works : [];
}

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}:${String(s).padStart(2, '0')}`;
  return `0:${String(s).padStart(2, '0')}`;
}

function getTotalPages() {
  const works = getCategoryWorks(currentCategory);
  return Math.max(1, Math.ceil(works.length / CARDS_PER_PAGE));
}

/* ==================== 渲染 ==================== */

function renderCards() {
  const works = getCategoryWorks(currentCategory);
  const start = (currentPage - 1) * CARDS_PER_PAGE;
  const pageWorks = works.slice(start, start + CARDS_PER_PAGE);

  gallery.innerHTML = pageWorks.map(work => {
    const hasCover = !!work.cover;
    const coverStyle = hasCover
      ? ` style="background-image:url(${work.cover});background-size:cover;background-position:center"`
      : '';
    return `
      <div class="video-card video-card--${work.orientation || 'portrait'}" data-id="${work.id}" data-video="${work.video}" data-duration="${work.duration}">
        <div class="video-card-cover${hasCover ? '' : ' video-card-cover--pending'}"${coverStyle}>
          <button class="video-card-play" aria-label="播放视频">
            <span class="play-icon"></span>
          </button>
        </div>
        <span class="video-card-duration">${formatDuration(work.duration)}</span>
      </div>
    `;
  }).join('');

  // 异步给没有封面的卡片自动截取视频帧
  applyAutoCovers();
}

/* ==================== 自动封面截取 ==================== */

/**
 * 从视频指定时间截取一帧，返回 dataURL
 * @param {string} videoSrc - 视频路径
 * @param {number} duration - 视频时长（秒）
 * @returns {Promise<string|null>}
 */
function captureFrame(videoSrc, duration) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.crossOrigin = 'anonymous';
    video.src = videoSrc;

    // 超时保护：3 秒没加载出来就放弃
    let settled = false;
    const timeout = setTimeout(() => {
      if (!settled) { settled = true; video.remove(); resolve(null); }
    }, 3000);

    video.onloadedmetadata = () => {
      if (settled) return;
      // 截取 1 秒处或视频 20% 处，取较小值
      const seekTime = Math.min(1, duration * 0.2);
      video.currentTime = seekTime;
    };

    video.onseeked = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg', 0.7);
        video.remove();
        resolve(dataURL);
      } catch (e) {
        video.remove();
        resolve(null);
      }
    };

    video.onerror = () => {
      if (!settled) { settled = true; clearTimeout(timeout); video.remove(); resolve(null); }
    };

    video.load();
  });
}

/** 给当前页没有封面的卡片自动生成封面 */
async function applyAutoCovers() {
  const pending = gallery.querySelectorAll('.video-card-cover--pending');
  if (pending.length === 0) return;

  for (const coverEl of pending) {
    const card = coverEl.closest('.video-card');
    if (!card) continue;
    const videoSrc = card.dataset.video;
    const duration = Number(card.dataset.duration) || 10;
    if (!videoSrc) continue;

    const dataURL = await captureFrame(videoSrc, duration);
    if (dataURL) {
      coverEl.style.backgroundImage = `url(${dataURL})`;
      coverEl.style.backgroundSize = 'cover';
      coverEl.style.backgroundPosition = 'center';
    }
    // 去掉 pending 标记（无论成功失败）
    coverEl.classList.remove('video-card-cover--pending');
  }
}

function renderPagination() {
  const totalPages = getTotalPages();
  prevBtn.disabled = currentPage <= 1;
  paginationDots.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const dot = document.createElement('span');
    dot.className = 'pagination-dot';
    if (i === currentPage) dot.classList.add('pagination-dot--active');
    paginationDots.appendChild(dot);
  }
  nextBtn.disabled = currentPage >= totalPages;
}

function renderCount() {
  const works = getCategoryWorks(currentCategory);
  catCount.textContent = `共 ${works.length} 个作品`;
}

function renderAbout() {
  const about = worksData.about;
  if (!about) return;

  // 顶部导航名字
  const headerName = document.getElementById('headerName');
  if (headerName) headerName.textContent = about.name;

  const container = document.getElementById('about');
  if (!container) return;

  // 联系方式（纯文本展示）
  const contactParts = [];
  if (about.contact?.email) {
    contactParts.push(about.contact.email);
  }
  if (about.contact?.wechat && about.contact?.phone && about.contact.wechat === about.contact.phone) {
    contactParts.push(`电话/微信：${about.contact.wechat}`);
  } else {
    if (about.contact?.wechat) {
      contactParts.push(`微信：${about.contact.wechat}`);
    }
    if (about.contact?.phone) {
      contactParts.push(`电话：${about.contact.phone}`);
    }
  }
  const contactHTML = contactParts.length > 0
    ? contactParts.join(' · ')
    : '暂无联系方式';

  const avatarStyle = about.avatar
    ? ` style="background-image:url(${about.avatar});background-size:cover;background-position:center"`
    : '';

  const titleHTML = about.title
    ? `<p class="about-title">${about.title}</p>`
    : '';

  container.innerHTML = `
    <div class="about-layout">
      <div class="about-avatar"${avatarStyle}></div>
      <div class="about-content">
        <h3 class="about-heading">关于我</h3>
        <div class="about-heading-line"></div>
        <h2 class="about-name">${about.name}</h2>
        ${titleHTML}
        <div class="about-fields">
          <div class="about-field">
            <span class="about-field-label">个人简介</span>
            <div class="about-field-divider"></div>
            <p class="about-field-value">${about.bio || '暂无简介'}</p>
          </div>
          <div class="about-field">
            <span class="about-field-label">工作技能</span>
            <div class="about-field-divider"></div>
            <p class="about-field-value">${about.skills || '暂无'}</p>
          </div>
          <div class="about-field">
            <span class="about-field-label">联系方式</span>
            <div class="about-field-divider"></div>
            <div class="about-field-value">${contactHTML}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ==================== 联系方式交互（事件委托） ==================== */

document.getElementById('about').addEventListener('click', (e) => {
  const copyEl = e.target.closest('.about-contact-copy');
  if (!copyEl) return;

  const text = copyEl.dataset.copy;
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    const original = copyEl.textContent;
    copyEl.textContent = '已复制 ✓';
    copyEl.classList.add('about-contact-copy--done');
    setTimeout(() => {
      copyEl.textContent = original;
      copyEl.classList.remove('about-contact-copy--done');
    }, 1800);
  }).catch(() => {
    // 降级：选中文本让用户手动复制
    const range = document.createRange();
    range.selectNodeContents(copyEl);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  });
});

/** 全量刷新（分类切换 / 翻页时带过渡动画） */
function refresh() {
  if (isInitialLoad) {
    // 首次加载直接渲染，不做过渡
    renderCards();
    renderPagination();
    renderCount();
    return;
  }
  // 后续切换：淡入淡出过渡
  transitionCards(gallery, () => {
    renderCards();
    renderPagination();
    renderCount();
  });
}

/* ==================== 播放事件（事件委托） ==================== */

gallery.addEventListener('click', (e) => {
  const card = e.target.closest('.video-card');
  if (!card) return;

  if (isMobile()) {
    playFullscreen(card);
  } else {
    const playBtn = e.target.closest('.video-card-play');
    if (playBtn) {
      playLightbox(card);
    }
  }
});

/* ==================== 标签 & 翻页事件 ==================== */

catTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const category = tab.dataset.category;
    if (category === currentCategory) return;

    catTabs.forEach(t => t.classList.remove('cat-tab--active'));
    tab.classList.add('cat-tab--active');

    currentCategory = category;
    currentPage = 1;
    refresh();
  });
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    refresh();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < getTotalPages()) {
    currentPage++;
    refresh();
  }
});

/* ==================== 启动 ==================== */
refresh(); // 首次渲染
renderAbout(); // 关于我
staggerIn('.hero', 0, 0);
staggerIn('.categories', 100, 0);
staggerIn('.video-card', 180, 60);
staggerIn('.pagination', 200, 0);
staggerIn('.about', 240, 0);
staggerIn('.footer-line', 280, 0);
isInitialLoad = false;
console.log('作品集交互已就绪 — 分类切换 + 翻页 + 视频播放 + 动效 + 关于我');
