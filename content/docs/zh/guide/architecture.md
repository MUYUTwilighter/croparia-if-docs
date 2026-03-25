---
title: 文档架构
outline: deep
modVersions:
  - 1.1.0a
---

# 文档架构

当前文档站采用“内容源 + 版本标签生成”的结构。

## 目录分层

- `content/docs/`：真正维护的 Markdown 文档源
- `content/public/`：静态文件，例如 `robots.txt`
- `docs/`：按版本标签生成后的 VitePress 路由根目录

## 构建流程

1. 在 `content/docs/<locale>/` 中维护页面
2. 通过 frontmatter 的 `modVersions` 标记页面适用的模组版本
3. `npm run docs:prepare` 将页面输出到 `docs/`
4. VitePress 从 `docs/` 读取路由并构建站点

## 适用场景

这种方式适合“多数页面跨多个版本共用，只少量页面版本分叉”的长期维护场景。
