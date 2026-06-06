# 技术规范 — 摄影作品集网站

## 技术选型

| 层面 | 选择 | 理由 |
|------|------|------|
| 架构 | 纯静态站点 | 无需后端，部署简单，性能最优 |
| 构建 | Vite + vanilla HTML/CSS/JS | 轻量，对小白友好，方便后续扩展 |
| 视频压缩 | FFmpeg (H.265/HEVC) | 高压缩比，保留画质细节 |
| 部署 | Cloudflare Pages | 免费，国内可访问，全球 CDN |
| 版本管理 | GitHub | 免费，内容备份，部署联动 |

## 项目结构

```
photo-portfolio/
├── index.html              # 单页面入口
├── public/
│   ├── videos/             # 视频源文件
│   │   ├── portrait/       #   人物类别
│   │   ├── product/        #   产品类别
│   │   └── story/          #   剧情类别
│   └── covers/             # 封面图（自动生成或手动上传）
├── src/
│   ├── styles/
│   │   └── main.css        # 全局样式
│   ├── scripts/
│   │   ├── gallery.js      # 分类切换 + 翻页逻辑
│   │   ├── player.js       # 视频播放控制
│   │   └── animations.js   # 动效控制
│   └── data/
│       └── works.json      # 作品数据配置
├── docs/                   # 项目文档
│   ├── requirements.md
│   ├── design-spec.md
│   ├── technical-spec.md
│   └── development-plan.md
├── DEVLOG.md               # 开发日志
├── CLAUDE.md               # AI 助手指引
├── package.json
└── vite.config.js
```

## 作品数据配置 (`works.json`)

```json
{
  "categories": [
    {
      "id": "portrait",
      "name": "人物",
      "works": [
        {
          "id": "portrait-01",
          "title": "",
          "video": "videos/portrait/01.mp4",
          "cover": "covers/portrait-01.jpg",
          "duration": 8
        }
      ]
    }
  ]
}
```

- `title`: 可选，当前设计不展示标题
- `cover`: 可选，未指定时自动取视频第一帧
- `duration`: 秒数，用于显示时长角标

## 视频规格

| 参数 | 推荐值 |
|------|--------|
| 编码 | H.265 (HEVC) |
| 容器 | MP4 |
| 码率 | 8-15 Mbps (4K) / 4-8 Mbps (1080p) |
| 帧率 | 与原片一致 |
| 音频 | AAC 128kbps（如有） |
| 最大单文件 | ≤ 30MB（几秒片段） |

## 浏览器兼容

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 90+ |
| Edge | 90+ |
| Safari | 14+ |
| Firefox | 88+ |
| 移动端 Safari | iOS 14+ |
| 移动端 Chrome | 90+ |

## 性能目标

| 指标 | 目标 |
|------|------|
| 首屏加载 (FCP) | < 1.5s |
| 最大内容绘制 (LCP) | < 2.5s |
| 视频首帧播放 | < 1s（预加载封面已显示） |
| 翻页响应 | < 300ms |

## 关键依赖

| 依赖 | 用途 |
|------|------|
| Vite | 开发服务器 + 构建打包 |
| (无运行时框架) | 保持零依赖，纯原生实现 |

## 安全与隐私

- 无用户输入收集
- 无 Cookie / 追踪
- 纯静态文件，无服务端攻击面
- 如需防批量下载，可加简单右键禁用（不强制）
