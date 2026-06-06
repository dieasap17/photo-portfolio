/**
 * player.js — 视频播放控制
 * Phase 3: 桌面卡片内播放 + 移动端全屏播放
 */

const MOBILE_BREAKPOINT = 768;

/* ==================== 工具 ==================== */

/** 是否为移动端视口 */
export function isMobile() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

/* ==================== 公共方法 ==================== */

/**
 * 桌面端：在卡片内播放视频
 * 再次点击视频 → 停止并恢复封面
 * 视频自然结束 → 自动恢复封面
 */
export function playInCard(card) {
  const videoSrc = card.dataset.video;
  if (!videoSrc) return;

  // 如果已在播放，点击 → 停止
  const existingVideo = card.querySelector('.video-card-video');
  if (existingVideo) {
    existingVideo.pause();
    existingVideo.remove();
    showCover(card);
    return;
  }

  hideCover(card);

  const video = document.createElement('video');
  video.src = videoSrc;
  video.autoplay = true;
  video.playsInline = true;
  video.loop = false;
  video.setAttribute('playsinline', '');
  video.className = 'video-card-video';

  video.addEventListener('click', (e) => {
    e.stopPropagation();
    video.pause();
    video.remove();
    showCover(card);
  });

  video.addEventListener('ended', () => {
    video.remove();
    showCover(card);
  });

  card.appendChild(video);
}

/**
 * 移动端：全屏覆盖层播放
 * 关闭按钮 / 点击遮罩 → 关闭
 */
export function playFullscreen(card) {
  const videoSrc = card.dataset.video;
  if (!videoSrc) return;

  // 关闭之前的覆盖层（如果有）
  const existing = document.querySelector('.video-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'video-overlay';
  overlay.innerHTML = `
    <button class="video-overlay-close" aria-label="关闭">✕</button>
    <video
      src="${videoSrc}"
      autoplay
      playsinline
      controls
      class="video-overlay-video"
    ></video>
  `;

  const closeBtn = overlay.querySelector('.video-overlay-close');

  function close() {
    overlay.querySelector('video').pause();
    overlay.remove();
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  document.body.style.overflow = 'hidden';
  document.body.appendChild(overlay);
}

/* ==================== 内部辅助 ==================== */

function hideCover(card) {
  const cover = card.querySelector('.video-card-cover');
  if (cover) cover.style.display = 'none';
}

function showCover(card) {
  const cover = card.querySelector('.video-card-cover');
  if (cover) cover.style.display = '';
}
