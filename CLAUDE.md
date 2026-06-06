# CLAUDE.md — 摄影作品集网站

## 项目概述

个人摄影/视频作品集单页网站。留白极简风格 × Morandi 低饱和配色，面向面试官展示摄影视频作品。

## 标准文件路径

| 文件 | 路径 | 说明 |
|------|------|------|
| 需求文档 | `docs/requirements.md` | 用户需求与核心功能描述 |
| 设计规范 | `docs/design-spec.md` | 配色、排版、布局、组件规范 |
| 技术规范 | `docs/technical-spec.md` | 技术选型、项目结构、视频规格 |
| 开发计划 | `docs/development-plan.md` | 分阶段执行步骤与检查清单 |
| 开发日志 | `DEVLOG.md` | 每日完成事项与待办记录 |

## 工作指引

### 每次开发前
1. 阅读 `DEVLOG.md` 了解当前进度
2. 查阅 `docs/development-plan.md` 确认当前阶段任务
3. 依据 `docs/design-spec.md` 中的配色、排版、组件规范编写代码

### 每次开发后
1. 更新 `DEVLOG.md`，标记完成事项和新增待办
2. 将当日日期作为新 section 追加到日志顶部
3. 如有设计/需求变更，同步更新对应的 docs 文件

### 沟通原则
- 用户不懂代码，避免使用技术术语
- 每个阶段完成后向用户展示成果并确认
- 涉及视觉变更时优先使用可视化对比
- 小步推进，不一次做太多改动

### 技术约束
- 纯静态站点（Vite + vanilla HTML/CSS/JS）
- 部署目标：Cloudflare Pages（国内可访问）
- 零运行时框架依赖
- 视频压缩：H.265/HEVC，单文件 ≤ 30MB

## 项目目录

```
photo-portfolio/
├── index.html
├── public/
│   ├── videos/
│   │   ├── portrait/
│   │   ├── product/
│   │   └── story/
│   └── covers/
├── src/
│   ├── styles/main.css
│   ├── scripts/
│   │   ├── gallery.js
│   │   ├── player.js
│   │   └── animations.js
│   └── data/works.json
├── docs/
├── DEVLOG.md
└── CLAUDE.md
```
