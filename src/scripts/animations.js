/**
 * animations.js — 页面动效
 * Phase 4: 渐显入场 + 卡片切换过渡
 */

const FADE_DURATION = 200; // ms

/**
 * 带淡入淡出过渡的内容替换
 * 用于分类切换 / 翻页时卡片区域平滑过渡
 *
 * @param {HTMLElement} container - 要替换内容的容器
 * @param {() => void} renderFn - 执行渲染的函数（设置 innerHTML）
 */
export function transitionCards(container, renderFn) {
  // 阶段 1：淡出
  container.style.transition = `opacity ${FADE_DURATION}ms ease`;
  container.style.opacity = '0';

  // 阶段 2：替换内容 + 淡入
  setTimeout(() => {
    renderFn();
    container.style.opacity = '1';
  }, FADE_DURATION);
}

/**
 * 元素序列入场（页面首次加载时调用）
 * 为每个元素设置递增的 animation-delay
 *
 * @param {string} selector - 要应用动画的元素选择器
 * @param {number} baseDelay - 起始延迟（ms）
 * @param {number} stagger - 每个元素的间隔（ms）
 */
export function staggerIn(selector, baseDelay = 0, stagger = 80) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el, i) => {
    el.style.animationDelay = `${baseDelay + i * stagger}ms`;
    el.classList.add('anim-fade-up');
  });
}
