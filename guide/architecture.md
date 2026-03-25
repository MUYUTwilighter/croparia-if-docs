---
title: 文档架构
outline: deep
---

# 文档架构

当前 VitePress 文档站采用如下组织方式：

## 路由层

- `/`：当前版本中文首页
- `/guide/`：当前版本中文指南
- `/en/`：当前版本英文首页
- `/en/guide/`：当前版本英文指南
- `/versions/`：版本策略与历史版本入口
- `/versions/<version>/`：预留给中文历史版本
- `/en/versions/<version>/`：预留给英文历史版本

## 配置层

- 语言切换使用 VitePress 内建 `locales`
- 版本切换使用目录约定与配置元数据生成导航
- 当前版本与历史版本统一在 `.vitepress/config.ts` 的版本元数据中维护

## 后续扩展

如果后面要新增历史版本，建议按下面步骤操作：

1. 在 `versions/<version>/` 与 `en/versions/<version>/` 下补齐页面。
2. 在 `.vitepress/config.ts` 的 `archivedVersions` 中追加版本元数据。
3. 视情况把通用内容抽成共享片段或脚本化生成流程。
