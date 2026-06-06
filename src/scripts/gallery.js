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
    const coverStyle = work.cover
      ? ` style="background-image:url(${work.cover});background-size:cover;background-position:center"`
      : '';
    return `
      <div class="video-card" data-id="${work.id}" data-video="${work.video}">
        <div class="video-card-cover"${coverStyle}>
          <button class="video-card-play" aria-label="播放视频">
            <span class="play-icon"></span>
          </button>
        </div>
        <span class="video-card-duration">${formatDuration(work.duration)}</span>
      </div>
    `;
  }).join('');
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
staggerIn('.hero', 0, 0);
staggerIn('.categories', 100, 0);
staggerIn('.video-card', 180, 60);
staggerIn('.pagination', 200, 0);
staggerIn('.about', 240, 0);
staggerIn('.footer-line', 280, 0);
isInitialLoad = false;
console.log('作品集交互已就绪 — 分类切换 + 翻页 + 视频播放 + 动效');
