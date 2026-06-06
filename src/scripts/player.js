/**
 * player.js — 视频播放控制
 * Phase 3: 桌面灯箱放大播放 + 移动端全屏播放
 */

const MOBILE_BREAKPOINT = 768;
const SPEEDS = [1, 1.5, 2, 0.75]; // 循环倍速

/** 在当前 speed 数组中查找下一个 */
function nextSpeed(current) {
  const idx = SPEEDS.indexOf(current);
  return SPEEDS[(idx + 1) % SPEEDS.length];
}

/* ==================== 工具 ==================== */

/** 是否为移动端视口 */
export function isMobile() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

/* ==================== 桌面端：灯箱放大播放 ==================== */

export function playLightbox(card) {
  const videoSrc = card.dataset.video;
  if (!videoSrc) return;

  closeExisting();

  const backdrop = document.createElement('div');
  backdrop.className = 'lightbox';
  backdrop.innerHTML = `
    <button class="lightbox-close" aria-label="关闭">
      <span class="lightbox-close-icon"></span>
    </button>
    <div class="lightbox-stage">
      <video
        src="${videoSrc}"
        autoplay
        muted
        playsinline
        controls
        preload="auto"
        class="lightbox-video"
      ></video>
      <button class="player-speed-btn" aria-label="倍速">1×</button>
    </div>
  `;

  function close() {
    const video = backdrop.querySelector('video');
    if (video) video.pause();
    backdrop.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
  }

  // 倍速切换
  const speedBtn = backdrop.querySelector('.player-speed-btn');
  const video = backdrop.querySelector('video');
  speedBtn.addEventListener('click', () => {
    const next = nextSpeed(video.playbackRate);
    video.playbackRate = next;
    speedBtn.textContent = next + '×';
  });

  backdrop.querySelector('.lightbox-close').addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });
  // ESC 键关闭
  const onKey = (e) => { if (e.key === 'Escape') { close(); } };
  document.addEventListener('keydown', onKey);

  document.body.style.overflow = 'hidden';
  document.body.appendChild(backdrop);
}

/* ==================== 移动端：全屏覆盖层播放 ==================== */

export function playFullscreen(card) {
  const videoSrc = card.dataset.video;
  if (!videoSrc) return;

  closeExisting();

  const overlay = document.createElement('div');
  overlay.className = 'mobile-player';
  overlay.innerHTML = `
    <button class="mobile-player-close" aria-label="关闭">✕</button>
    <video
      src="${videoSrc}"
      autoplay
      muted
      playsinline
      controls
      preload="auto"
      class="mobile-player-video"
    ></video>
    <button class="player-speed-btn player-speed-btn--mobile" aria-label="倍速">1×</button>
  `;

  function close() {
    const video = overlay.querySelector('video');
    if (video) video.pause();
    overlay.remove();
    document.body.style.overflow = '';
  }

  // 倍速切换
  const speedBtn = overlay.querySelector('.player-speed-btn');
  const video = overlay.querySelector('video');
  speedBtn.addEventListener('click', () => {
    const next = nextSpeed(video.playbackRate);
    video.playbackRate = next;
    speedBtn.textContent = next + '×';
  });

  overlay.querySelector('.mobile-player-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  document.body.style.overflow = 'hidden';
  document.body.appendChild(overlay);
}

/* ==================== 内部辅助 ==================== */

function closeExisting() {
  const existing = document.querySelector('.lightbox, .mobile-player');
  if (existing) {
    const video = existing.querySelector('video');
    if (video) video.pause();
    existing.remove();
  }
}
