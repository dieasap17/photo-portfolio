# 项目手册 — 摄影作品集网站

> 最后更新：2026-06-07  
> 写给：未来的自己 / AI 助手 / 接手的开发者  
> 配套文件：[需求文档](requirements.md) · [设计规范](design-spec.md) · [技术规范](technical-spec.md) · [开发日志](../DEVLOG.md)

---

## 1. 项目速览

| 项目 | 详情 |
|------|------|
| **名称** | photo-portfolio（个人摄影作品集） |
| **线上地址** | `https://photo-portfolio-egr.pages.dev` |
| **所有者** | 黄宇杰（alexw1@qq.com / 18698375505） |
| **GitHub 仓库** | `dieasap17/photo-portfolio`（master 分支） |
| **类型** | 纯静态单页网站 |
| **技术** | Vite + 原生 HTML/CSS/JS，零框架 |
| **部署** | Cloudflare Pages，GitHub Actions 自动部署 |

### 核心数字

| 指标 | 数值 |
|------|------|
| 作品总数 | 30 个视频（人物 11 / 产品 16 / 剧情 3） |
| 视频总大小 | ~87 MB |
| 最大单文件 | story/1.mp4（13.8 MB） |
| 封面缩略图 | 30 张 WebP，共 ~386 KB |
| 构建体积 | dist ~290 MB（含视频）/ JS + CSS < 23 KB gzipped |
| 部署耗时 | ~22-30 秒（全自动） |
| 备份大小 | ~3.3 GB（3 级备份：原始素材 + CRF 21/23 + 30fps 前） |

---

## 2. 架构总览

```
用户浏览器
    │
    ▼
Cloudflare Pages（全球 CDN）
    │  静态文件分发
    │  Cache-Control: 1 年（视频/封面/JS/CSS）
    │  Cache-Control: 0（index.html 实时验证）
    │
    ▼
index.html（单页）
    ├── 导航栏（姓名动态渲染）
    ├── Hero 区（作品集标题）
    ├── 分类标签（人物 / 产品 / 剧情）
    ├── 卡片画廊（每页 4 张，JS 动态渲染）
    ├── 翻页控件
    ├── 关于我（头像 + 姓名 + 简介 + 技能 + 联系方式）
    └── 页脚
    │
    ├── 点击桌面端 ▶ 按钮 → 灯箱放大播放
    └── 移动端点击卡片 → 全屏播放
```

### 数据流

```
src/data/works.json          ← 唯一数据源（手动编辑）
        │
        ▼
src/scripts/gallery.js       ← 读取 JSON，动态渲染 HTML
        │
        ├── player.js        ← 桌面灯箱 / 移动全屏播放
        └── animations.js    ← 入场动画 / 过渡动效
```

**关键原则：改内容只改 `works.json`，不改 JS 代码。**

---

## 3. 文件地图

```
photo-portfolio/
├── index.html                      ← 页面骨架（静态 HTML，JS 填充内容）
├── package.json                    ← 项目配置（npm + Vite + Wrangler）
├── vite.config.js                  ← Vite 构建配置（端口 3000、输出 dist/）
├── .gitignore                      ← Git 忽略规则（node_modules、dist、备份、截图）
│
├── public/                         ← 静态资源（直接复制到 dist，不经过 Vite 处理）
│   ├── _headers                    ← Cloudflare 缓存规则
│   ├── avatar.webp                 ← 头像（280×wx，aspect ratio preserved）
│   ├── covers/                     ← 30 张 WebP 封面缩略图（320px 宽）
│   └── videos/
│       ├── portrait/               ← 11 个人像视频
│       ├── product/                ← 16 个产品视频
│       └── story/                  ← 3 个剧情视频
│
├── src/
│   ├── data/works.json             ← ★ 核心数据文件（分类、作品、关于我）
│   ├── styles/main.css             ← 全局样式（763 行，含响应式 + 动画）
│   └── scripts/
│       ├── gallery.js              ← 分类切换 / 翻页 / 渲染 / 关于我
│       ├── player.js               ← 桌面灯箱 + 移动全屏播放 + 倍速
│       └── animations.js           ← 过渡动画工具
│
├── docs/                           ← 文档
│   ├── requirements.md             ← 需求文档
│   ├── design-spec.md              ← 设计规范（配色、排版、组件）
│   ├── technical-spec.md           ← 技术规范（技术选型、视频规格）
│   ├── development-plan.md         ← 开发计划（7 阶段 + 待办）
│   └── project-handbook.md         ← ★ 本文件（项目手册）
│
├── .github/workflows/deploy.yml    ← GitHub Actions 自动部署
├── DEVLOG.md                       ← 开发日志（逐日记录）
├── CLAUDE.md                       ← AI 助手项目指引
│
├── _backup/                        ← 备份（不入 Git）
├── _backup-compressed-v1/          ← 备份：CRF 21/23 版本
├── _backup-portrait/               ← 备份：人像原始素材
└── _backup-product/                ← 备份：产品原始素材
```

---

## 4. 内容管理（增删改）

### 4.1 添加新作品

**步骤：**

1. **放入视频文件**  
   将视频放到对应分类目录：
   ```
   public/videos/portrait/   ← 人物
   public/videos/product/    ← 产品
   public/videos/story/      ← 剧情
   ```

2. **压缩视频**（必须遵守规范，见第 5 节）  
   使用 ffmpeg 压缩成规范格式。

3. **生成封面缩略图**  
   ```powershell
   ffmpeg -ss 00:00:01 -i "public/videos/分类/文件名.mp4" -vframes 1 -vf "scale=320:-1" -quality 80 "public/covers/文件名.webp" -y
   ```

4. **编辑 `src/data/works.json`**  
   在对应分类的 `"works"` 数组中添加：
   ```json
   {
       "id": "分类简称+序号",
       "video": "videos/分类/文件名.mp4",
       "cover": "covers/文件名.webp",
       "duration": 秒数,
       "orientation": "portrait"
   }
   ```
   - `id`: 唯一标识，建议格式如 `"p12"`（人物第 12 个）
   - `orientation`: 竖屏用 `"portrait"`，横屏用 `"landscape"`
   - `duration`: 视频时长（秒），整数

5. **验证 + 部署**
   ```powershell
   npm run build          # 构建，确认无报错
   git add -A
   git commit -m "Add: 新作品描述"
   git push origin master  # 推送后自动部署（约 30 秒生效）
   ```

### 4.2 删除作品

1. 从 `src/data/works.json` 中移除对应条目
2. 删除 `public/videos/` 下的视频文件
3. 删除 `public/covers/` 下的对应封面（可选，体积很小）
4. 提交并推送

### 4.3 修改作品信息

只需编辑 `src/data/works.json` 中对应条目的字段（duration、cover 等），然后提交推送。

### 4.4 修改"关于我"信息

编辑 `src/data/works.json` 中的 `"about"` 对象：
```json
"about": {
    "name": "姓名",
    "title": "头衔（可选，留空不显示）",
    "avatar": "avatar.webp",
    "bio": "个人简介",
    "skills": "工作技能描述",
    "contact": {
        "email": "邮箱地址",
        "wechat": "微信号/手机号",
        "phone": "手机号"
    }
}
```
- 如果微信号和手机号相同，页面自动合并显示为 `电话/微信：xxx`
- `title` 为空字符串时该行不显示
- 联系方式纯文本展示，点击可跳转（邮箱 → mailto，电话 → tel）

### 4.5 更换头像

1. 准备一张清晰的照片（竖长方形比例最佳，如 3:4）
2. 压缩：
   ```powershell
   ffmpeg -i "原始照片.png" -vf "scale=280:-1" -quality 80 "public/avatar.webp" -y
   ```
   **注意：不要用 `scale=280:280`！** 那会把照片压扁。`scale=280:-1` 保持原比例，页面上的圆形框会自动居中裁切。
3. 提交推送

### 4.6 调整分类

在 `src/data/works.json` 的 `"categories"` 数组中增删分类。每个分类结构：
```json
{
    "id": "英文id",
    "name": "中文显示名",
    "works": [ ... ]
}
```
分类标签会自动根据 `categories` 数组生成。

---

## 5. 视频规范（重要！）

经过 8 轮优化，当前全部视频统一规范如下：

| 参数 | 标准值 | 说明 |
|------|--------|------|
| 编码 | **H.264** | Chrome/Firefox/Safari 全平台硬解 |
| 分辨率 | **1080p**（短边 1080px） | 4K 已被缩放 |
| 帧率 | **29.97 fps**（30000/1001） | 从 60fps 降帧，平衡流畅度与体积 |
| 码率控制 | **CRF 28** | 恒定画质模式 |
| 预设 | **fast** | 编码速度与压缩率平衡 |
| 音频 | **AAC 64 kbps** | 足够清晰 |
| 容器优化 | **faststart** | moov atom 前置，边下边播 |
| 单文件上限 | **25 MB** | Cloudflare Pages 限制 |

### ffmpeg 压缩命令（标准模板）

```powershell
ffmpeg -i "输入.mp4" `
  -r 30000/1001 `
  -c:v libx264 -preset fast -crf 28 `
  -c:a aac -b:a 64k `
  -movflags +faststart `
  "输出.mp4" -y
```

### 如果源视频是 4K

添加缩放滤镜（1080p 短边）：
```powershell
ffmpeg -i "输入.mp4" `
  -r 30000/1001 `
  -vf "scale=1920:-2" `
  -c:v libx264 -preset fast -crf 28 `
  -c:a aac -b:a 64k `
  -movflags +faststart `
  "输出.mp4" -y
```
- 竖屏 4K → 用 `scale=1080:-2`
- 横屏 4K → 用 `scale=1920:-2`

### 注意事项

- **不要重压已经压缩过的视频**：会产生"代际损失"，文件反而变大（参考 BUV 案例：6.81→7.09 MB）
- **ffmpeg 路径**：`C:\Users\Volcano\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg.exe`
- **压缩时输出到 Temp 目录**：沙盒限制，不能直接覆盖 `d:\vibe` 下的文件
  ```powershell
  # 正确做法
  ffmpeg ... "C:\Users\Volcano\AppData\Local\Temp\output.mp4" -y
  Copy-Item -Force "C:\Users\Volcano\AppData\Local\Temp\output.mp4" "目标路径"
  ```
- **一次只跑 1-2 个 ffmpeg**：并发太多 CPU 会卡死，产生损坏文件

---

## 6. 部署说明

### 自动部署（日常使用）

推送到 GitHub `master` 分支即自动部署：

```powershell
git add -A
git commit -m "描述改动"
git push origin master
# 需要代理时：
# git -c http.proxy=http://127.0.0.1:7897 -c https.proxy=http://127.0.0.1:7897 -c http.postBuffer=524288000 push origin master
```

推送后 GitHub Actions 自动：
1. 拉取代码
2. 安装依赖（`npm ci`）
3. 构建（`npm run build`）
4. 部署到 Cloudflare Pages（`wrangler pages deploy dist`）

**耗时 ~22-30 秒。**  
**线上地址不变：** `https://photo-portfolio-egr.pages.dev`

### 查看部署状态

```powershell
gh run list --repo dieasap17/photo-portfolio --limit 1 --workflow "Deploy to Cloudflare Pages"
```

### GitHub Secret 管理

部署需要 `WRANGLER_CONFIG_B64` 这个 Secret（Cloudflare OAuth 配置的 base64 编码）。

如果部署报认证错误，可能是 token 过期了，需要重新生成：
1. 运行 `npx wrangler login`（在能打开浏览器的环境下）
2. 将 `~/.config/.wrangler/config/default.toml` 内容 base64 编码
3. 更新 GitHub 仓库 Settings → Secrets → `WRANGLER_CONFIG_B64`

---

## 7. 缓存策略

`public/_headers` 控制 Cloudflare CDN 缓存：

```
/videos/*   → 1 年不可变缓存（视频内容变了会改文件名）
/covers/*   → 1 年不可变缓存
/assets/*   → 1 年不可变缓存（JS/CSS 文件名带 hash）
/avatar.webp → 1 周缓存
/index.html → 实时验证（确保最新版页面）
```

**效果：**
- 首次访问：下载全部资源（~290 MB）
- 重复访问：只验证 index.html（~2 KB），其余走浏览器缓存

---

## 8. 备份策略

| 目录 | 内容 | 大小 | 用途 |
|------|------|------|------|
| `_backup/videos-pre-30fps-v3/` | 30fps 转换前版本 | 97.4 MB | 最近备份，可直接恢复 |
| `_backup/videos-pre-compress-v2/` | 4K→1080p + CRF 30 前版本 | 289 MB | 中品质 |
| `_backup-compressed-v1/` | CRF 21/23 版本（更高画质） | 289 MB | 较高画质 |
| `_backup-portrait/` | 人像相机原始素材 | 1.35 GB | 最高品质 |
| `_backup-product/` | 产品相机原始素材 | 1.24 GB | 最高品质 |

**总计约 3.3 GB，在项目根目录，已加入 .gitignore（不会上传）。**

恢复备份时，直接拷贝备份目录中的视频覆盖 `public/videos/` 对应文件。

---

## 9. 本地开发

### 环境要求

- Node.js >= 22
- npm

### 常用命令

```powershell
npm install          # 安装依赖（首次或 package.json 变动后）
npm run dev          # 启动开发服务器 → http://localhost:3000
npm run build        # 构建生产版本 → dist/
npm run preview      # 预览构建结果
```

### 开发注意事项

- `npm run dev` 不会监听 `public/videos/` 的变化（配置了 `watch.ignored`），改视频不需要重启
- 改 JS/CSS/JSON 会自动热更新
- 本地预览不经过 Cloudflare，缓存头不生效

---

## 10. 关闭 / 下线网站

### 方式一：删除 Cloudflare Pages 项目（彻底）

1. 登录 Cloudflare Dashboard：https://dash.cloudflare.com
2. 进入 Workers & Pages → photo-portfolio
3. 项目设置 → Delete project

网站立即不可访问。GitHub 仓库不受影响，可随时重新部署。

### 方式二：清空部署（保留项目配置）

```powershell
# 创建一个空白 dist
mkdir empty-dist
npx wrangler pages deploy empty-dist --project-name=photo-portfolio --commit-dirty=true
```

网站变成一个空页面，但 Cloudflare 项目还在。

### 方式三：删除 GitHub 仓库

在 GitHub 仓库 Settings → Danger Zone → Delete this repository。  
Cloudflare 上的部署不受影响（已部署的文件继续生效）。需要同时删除 Cloudflare 项目。

### 恢复上线

只要 GitHub 仓库还在，推送代码即自动恢复部署。  
如果 Cloudflare 项目被删了，需要重新创建并用 wrangler 部署。

---

## 11. 常见问题排查

### 视频加载慢 / 播放卡顿

- 检查视频大小是否超过 15 MB（story 长视频除外）
- 检查是否用了 H.264（不是 HEVC）：`ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 视频.mp4`
- 检查是否有 `faststart`：`ffprobe -v error -show_entries format_tags=faststart -of csv=p=0 视频.mp4`

### 部署后页面没更新

- Cloudflare CDN 缓存了 index.html：等 1-2 分钟
- 浏览器缓存了旧页面：Ctrl+F5 强制刷新
- 确认 GitHub Actions 部署成功：`gh run list --repo dieasap17/photo-portfolio --limit 1`

### 视频在某些浏览器放不了

- 检查视频编码是否为 H.264（Chrome/Firefox 不支持 HEVC）
- 检查音频是否为 AAC（不是 FLAC/MP3）

### 进度条拖不动 / 倍速按钮错位

- 倍速按钮应该在右下角（bottom: 56px, right: 16px），不在左下角
- 如果错位，检查 `src/styles/main.css` 中 `.player-speed-btn` 的定位

### 头像变形

- 确认使用 `scale=280:-1` 而非 `scale=280:280`
- 圆形显示由 CSS `border-radius: 50%` + `background-size: cover` 实现，会自动裁切

---

## 12. 技术债务 & 改进方向

记录在 `docs/development-plan.md` 的"Phase 7: 未来迭代"中：

- [ ] 视频上传 UI（免去手动 ffmpeg 操作）
- [ ] 照片作品支持（目前只有视频）
- [ ] 密码保护 / 访客模式
- [ ] 访问统计（Cloudflare Analytics）
- [ ] 自定义域名
- [ ] 自动封面生成（CI 中跑 ffmpeg）
- [ ] GitHub Actions 升级到 Node.js 24（Node 20 将于 2026-09-16 移除）

---

## 附录 A：ffmpeg 位置

```
C:\Users\Volcano\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\
├── ffmpeg.exe
└── ffprobe.exe   ← 查看视频信息（编码、分辨率、帧率）
```

常用探测命令：
```powershell
# 一行看全部关键信息
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,r_frame_rate,bit_rate -of csv=p=0 "视频.mp4"
```

---

## 附录 B：关键决策记录

| 日期 | 决策 | 原因 |
|------|------|------|
| 2026-06-06 | H.265 → H.264 | Chrome/Firefox 不支持 HEVC 硬解 |
| 2026-06-06 | CRF 26 → CRF 28 | 减小体积 43%，画质可接受 |
| 2026-06-06 | 4K → 1080p | 手机上 4K 无意义，4K 文件大 4 倍 |
| 2026-06-06 | 封面预生成 WebP | 消除运行时视频帧捕获的闪烁 |
| 2026-06-06 | GitHub Actions 替代直传 | wrangler 直传 90-130s → Actions 22-30s |
| 2026-06-07 | 60fps → 30fps | CRF 28 同画质，体积 -10.4% |
| 2026-06-07 | 头像 scale=280:-1 保持比例 | scale=280:280 会把竖长照片压扁 |
| 2026-06-07 | 倍速按钮移至右下角 | 左下角与原生进度条重叠，无法拖动 |
