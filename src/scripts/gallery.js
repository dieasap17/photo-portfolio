/**
 * gallery.js — 分类切换 + 翻页交互
 * Phase 2: 动态卡片渲染、标签切换、翻页逻辑
 */

import worksData from '../data/works.json';

/* ==================== 状态 ==================== */
const CARDS_PER_PAGE = 4;
let currentCategory = 'portrait';
let currentPage = 1;

/* ==================== DOM 引用 ==================== */
const gallery = document.getElementById('gallery');
const catTabs = document.querySelectorAll('.cat-tab');
const catCount = document.querySelector('.cat-count');
const paginationDots = document.querySelector('.pagination-dots');
const prevBtn = document.querySelector('.pagination-prev');
const nextBtn = document.querySelector('.pagination-next');

/* ==================== 工具函数 ==================== */

/** 获取指定分类的作品数组 */
function getCategoryWorks(categoryId) {
  const cat = worksData.categories.find(c => c.id === categoryId);
  return cat ? cat.works : [];
}

/** 秒数 → "M:SS" 或 "0:SS" */
function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) {
    return `${m}:${String(s).padStart(2, '0')}`;
  }
  return `0:${String(s).padStart(2, '0')}`;
}

/** 当前分类总页数 */
function getTotalPages() {
  const works = getCategoryWorks(currentCategory);
  return Math.max(1, Math.ceil(works.length / CARDS_PER_PAGE));
}

/* ==================== 渲染 ==================== */

/** 渲染视频卡片 */
function renderCards() {
  const works = getCategoryWorks(currentCategory);
  const start = (currentPage - 1) * CARDS_PER_PAGE;
  const pageWorks = works.slice(start, start + CARDS_PER_PAGE);

  gallery.innerHTML = pageWorks.map(work => `
    <div class="video-card" data-id="${work.id}">
      <div class="video-card-cover">
        <button class="video-card-play" aria-label="播放视频">
          <span class="play-icon"></span>
        </button>
      </div>
      <span class="video-card-duration">${formatDuration(work.duration)}</span>
    </div>
  `).join('');
}

/** 渲染翻页控件 */
function renderPagination() {
  const totalPages = getTotalPages();

  // 上一页按钮
  prevBtn.disabled = currentPage <= 1;

  // 页码点
  paginationDots.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const dot = document.createElement('span');
    dot.className = 'pagination-dot';
    if (i === currentPage) dot.classList.add('pagination-dot--active');
    paginationDots.appendChild(dot);
  }

  // 下一页按钮
  nextBtn.disabled = currentPage >= totalPages;
}

/** 更新分类计数 */
function renderCount() {
  const works = getCategoryWorks(currentCategory);
  catCount.textContent = `共 ${works.length} 个作品`;
}

/** 全量刷新 */
function refresh() {
  renderCards();
  renderPagination();
  renderCount();
}

/* ==================== 事件处理 ==================== */

/** 分类标签点击 */
catTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const category = tab.dataset.category;
    if (category === currentCategory) return;

    // 切换激活态
    catTabs.forEach(t => t.classList.remove('cat-tab--active'));
    tab.classList.add('cat-tab--active');

    // 重置页码并刷新
    currentCategory = category;
    currentPage = 1;
    refresh();
  });
});

/** 上一页 */
prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    refresh();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

/** 下一页 */
nextBtn.addEventListener('click', () => {
  if (currentPage < getTotalPages()) {
    currentPage++;
    refresh();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

/* ==================== 启动 ==================== */
refresh();
console.log('作品集交互已就绪 — 分类切换 + 翻页');
