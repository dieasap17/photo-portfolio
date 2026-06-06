# 开发日志 — 摄影作品集网站

## 2026-06-06

### 阶段 0：项目初始化 ✅
- [x] npm 项目初始化 + Vite 安装
- [x] 目录结构创建（src/styles, src/scripts, src/data, public/videos, public/covers）
- [x] index.html 入口文件
- [x] main.css CSS 变量体系（Morandi 配色 + 亚麻纹理 + 响应式断点）
- [x] works.json 示例数据（3个分类，9个示例作品 + 关于我信息）
- [x] JS 模块占位（gallery.js, player.js, animations.js）
- [x] .gitignore 配置
- [x] Git 初始化 + 首次提交
- [x] Vite 构建验证通过

### 需求沟通 ✅
- [x] 设计风格确认（留白极简 × Morandi × 托斯卡纳）
- [x] 配色方案确认（暖白底 + 鼠尾草绿互补 + 亚麻纹理）
- [x] 页面结构确认（单页：作品区 + 关于我）
- [x] 分类交互确认（人物/产品/剧情 → 切换 + 翻页）
- [x] 桌面布局确认（4列卡片）
- [x] 手机端布局确认（双列 + 放大播放 + 关于我右对齐）
- [x] 视频方案确认（A 方案为主：H.265 压缩直接部署）

### 文档完成 ✅
- [x] 需求文档 (`docs/requirements.md`)
- [x] 设计规范 (`docs/design-spec.md`)
- [x] 技术规范 (`docs/technical-spec.md`)
- [x] 开发计划 (`docs/development-plan.md`)

## 2026-06-06 (续)

### 阶段 1：静态布局实现 ✅
- [x] 完整 HTML 页面结构（导航 / Hero / 分类标签 / 4列卡片 / 翻页 / 关于我 / 页脚）
- [x] 完整 CSS 样式（Morandi 配色 / 亚麻纹理 / 圆角卡片 / 粗线条分隔）
- [x] 响应式布局（桌面 4 列 → 768px 断点 → 手机 2 列）
- [x] 卡片悬浮微缩放 + 播放按钮放大动效
- [x] Vite 构建验证通过
- [x] 开发服务器运行于 localhost:3000

## 2026-06-06 (续 2)

### 阶段 2：分类切换 + 翻页交互 ✅
- [x] gallery.js 从 works.json 动态加载数据
- [x] 分类标签点击切换（人物/产品/剧情）
- [x] 卡片动态渲染（每页 4 张）
- [x] 翻页控件（上一页/下一页 + 页码点指示器）
- [x] 作品计数实时更新
- [x] 翻页不再影响页面滚动位置
- [x] index.html 移除静态卡片（改为 JS 动态渲染）
- [x] Vite 构建验证通过

## 2026-06-06 (续 3)

### 阶段 3：视频播放功能 ✅
- [x] player.js 播放器模块（桌面灯箱放大播放 + 手机全屏播放）
- [x] 桌面端：点击 ▶ 按钮 → 灯箱弹出，半透明暗色背景，居中放大视频，ESC/点击背景关闭
- [x] 移动端：点击卡片 → 全屏黑色覆盖层 + 原生播放控件 + 关闭按钮
- [x] 灯箱入场动画（fade in 0.25s），关闭按钮用 CSS 纯线条 ✕
- [x] 卡片渲染支持封面图（works.json cover 字段非空时显示背景图）
- [x] Vite 构建验证通过（7 modules, ~11KB JS gzipped ~2.7KB）

## 2026-06-06 (续 4)

### 阶段 4：动画效果 ✅
- [x] 页面首次加载：各区块依次渐显上移入场（hero → 分类标签 → 卡片逐张 → 翻页 → 关于我 → 页脚线）
- [x] 卡片加载使用 staggerIn（60ms 间隔逐张弹出）
- [x] 分类切换 / 翻页：画廊区域淡出 → 淡入过渡（200ms）
- [x] animations.js 工具模块（transitionCards + staggerIn）
- [x] CSS @keyframes fadeUp / fadeIn + .anim-fade-up 动画类
- [x] Vite 构建验证通过（8 modules, ~12KB JS gzipped ~2.9KB）

## 2026-06-06 (续 5)

### 阶段 5：关于我页面完善 ✅
- [x] index.html 关于我区域改为 JS 动态渲染（移除硬编码）
- [x] 顶部导航姓名从 works.json 动态读取
- [x] renderAbout() 函数：头像、姓名、头衔、简介、经历、联系方式全部从数据渲染
- [x] 联系方式可交互：邮箱 → mailto 链接、电话 → tel 链接、微信 → 点击复制到剪贴板
- [x] 微信复制反馈动效（"已复制 ✓" 显示 1.8 秒后恢复）
- [x] 降级处理：剪贴板 API 不可用时自动选中文本
- [x] 联系方式链接样式（hover 变鼠尾草绿 + 下划线）
- [x] Vite 构建验证通过（8 modules, CSS ~9.3KB, JS ~8.8KB）

## 2026-06-06 (续 6)

### 阶段 6：部署上线 ✅
- [x] 视频压缩：人像 11 个 + 产品 16 个 → H.264 CRF 21/23，总大小从 ~2.8GB 降至 ~285MB
- [x] GitHub 仓库创建 + 代码推送（dieasap17/photo-portfolio, master 分支）
- [x] Cloudflare Pages 部署（wrangler CLI 直传）
- [x] 备份原始视频至 `_backup-portrait/` 和 `_backup-product/`（项目根目录，不入库）
- [x] 处理 Cloudflare 25MB 单文件限制（C0620.MP4, C2014.mp4 用 CRF 23 重压）
- [x] _backup 文件夹移出 public/ 防止被打包进 dist
- [x] .gitignore 更新（添加 _backup/ 和 Image *.png）
- [x] 生产 URL：`https://photo-portfolio-egr.pages.dev`

### 阶段 6.1：性能优化 ✅
- [x] **封面预生成**：30 个视频全部生成 WebP 封面缩略图（320px 宽，共 386KB），消除运行时视频帧捕获
- [x] **头像压缩**：avatar.png 从 1.9MB 压缩至 avatar.webp 4.7KB（280×280）
- [x] **缓存头**：`public/_headers` — 视频/封面/JS/CSS 1 年不可变缓存，头像 1 周，HTML 实时验证
- [x] **资源提示**：index.html 添加 avatar.webp preload + dns-prefetch
- [x] **视频编码修复**：story/2.mp4 从 HEVC 转为 H.264（22.2MB），Chrome/Firefox 可硬解
- [x] **播放器优化**：player.js 桌面灯箱和移动端播放器都添加 preload="auto"
- [x] 部署并验证缓存头：所有规则生效 ✓
- [x] 预览 URL：`https://20c14bc2.photo-portfolio-egr.pages.dev`
- [x] dist 大小从 ~331MB 降至 ~289MB（-42MB）

### 当前状态
- 网站已上线并完成性能优化
- 所有 30 个视频均可流畅播放
- 封面缩略图即时显示（无闪烁）
- 浏览器缓存生效，重复访问秒加载

## 2026-06-06 (续 7)

### 阶段 6.2：视频深度压缩 ✅
- [x] 用户反馈：视频加载慢、部分加载不出来
- [x] 备份当前视频至 `_backup-compressed-v1/`（CRF 21/23 版本，289MB）
- [x] 全部 30 个视频用 CRF 26 重压，音频码率降至 96kbps
- [x] 人像：149MB → 73MB（-51%），最大文件从 22MB 降至 12MB
- [x] 产品：91MB → 53MB（-42%），最大文件从 18MB 降至 12MB
- [x] 剧情：story/1.mp4 重压后反而变大（13.8→18.5MB，代际损失），已从备份恢复
- [x] 剧情最终：39MB（2.mp4 22→16MB，BUV 14→9.5MB）
- [x] dist 总大小：290MB → 166MB（-43%）
- [x] 部署上线：所有视频在网络下可更快加载
- [x] 保留 3 级备份：相机原始素材 → CRF 21 版 → CRF 26 版

## 2026-06-06 (续 8)

### 阶段 7：GitHub Actions 自动部署 ✅
- [x] 用户反馈：wrangler 直传太慢（90-130 秒通过代理）
- [x] 创建 `.github/workflows/deploy.yml` — push master 自动触发
- [x] 使用 wrangler OAuth 配置（含 refresh token），base64 存储为 GitHub Secret
- [x] 构建命令：`npm run build`，输出：`dist`，Node.js 22
- [x] 两次验证通过：30s / 28s 完成部署（GitHub 机房直连，快 3-4x）
- [x] Token 自动刷新：OAuth refresh token 在 wrangler 中自动续期
- [x] 用户只需 `git push`，其他全自动

### 阶段 7.1：视频深度压缩（二次激进压缩）✅
- [x] 用户要求：更激进的压缩，目标 15 秒内加载
- [x] 备份当前视频至 `_backup/videos-pre-compress-v2/`（289MB）
- [x] **4K → 1080p**：C0620, C0624, fx30b_5813, fx30b_5819, C9716 — scale + CRF 28
- [x] **大 1080p CRF 30**：C1693, C2014, C1911, C9265, C3575
- [x] **Story 视频**：1.mp4 跳过（已是最优），2.mp4 CRF 28, BUV CRF 30
- [x] **其余视频 CRF 26-28**：17 个小视频批量压缩
- [x] **总效果：289MB → 97MB（-66.3%）**
- [x] 4K 视频效果最显著：单文件从 17-22MB 降至 1.3-3.3MB（-90%）
- [x] 最大单文件：story/1.mp4 13.8MB（未压缩，已是最优）
- [x] 所有视频 H.264 + AAC 64k + faststart，全平台可播
- [x] 推送到 GitHub，自动部署到 Cloudflare Pages

## 2026-06-07

### 阶段 8：60fps → 30fps 转换 ✅
- [x] 用户选择方案 A：30fps + CRF 28（同画质、缩小体积）
- [x] 备份当前视频至 `_backup/videos-pre-30fps-v3/`（97.4MB）
- [x] 扫描全部 30 个视频帧率：22 个 60fps + 1 个 50fps + 7 个已 30fps
- [x] **23 个视频转换至 29.97fps**（30000/1001），CRF 28，AAC 64k
- [x] 同步处理 2 个遗漏 4K 视频：C9265（3.14→0.71MB）、C9731（2.1→0.57MB）缩放至 1080p
- [x] BUV 视频尝试转换后反而变大（6.81→7.09MB，代际损失），已从备份恢复
- [x] **总效果：97.4MB → 87.3MB（-10.4%）**
- [x] 典型压缩率：60fps 视频缩小 10-28%，4K+60fps 视频缩小 73-77%
- [x] 7 个已有 30fps 视频保持不变
- [x] 所有视频 H.264 + AAC 64k + faststart，全平台兼容
