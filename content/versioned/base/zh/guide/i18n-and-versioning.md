---
title: 多语言与多版本
outline: deep
---

# 多语言与多版本

## 多语言

VitePress 原生负责多语言切换，当前已启用：

- `root`：简体中文
- `en`：English

## 多版本

多版本不依赖额外插件，而是采用目录路由加生成步骤：

- 当前中文：`/`
- 当前英文：`/en/`
- 历史中文：`/versions/<version>/`
- 历史英文：`/en/versions/<version>/`

## 重复文档处理

重复内容不是靠手动复制，而是靠“共享基础内容 + 版本覆盖”处理：

- 共通内容放进 `content/versioned/base/`
- 某个版本有差异时，才在 `content/versioned/releases/<version>/` 下放同路径覆盖文件

这样大多数没有变化的页面不需要复制。
