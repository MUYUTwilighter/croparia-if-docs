---
title: 版本策略
outline: deep
description: Croparia IF 文档站的版本策略说明，包括当前版本入口、历史版本路径和文档版本标签生成方式。
keywords:
  - Croparia IF
  - 版本策略
  - 文档版本
  - 版本归档
---

# 版本策略

当前站点的默认落地页始终指向当前维护版本。

## 当前版本

- Croparia IF `1.1.0a`
- Minecraft `1.21.1`
- 当前中文入口：[/](/)
- 当前英文入口：[/en/](/en/)

## 历史版本路径

- 中文：`/versions/<version>/`
- 英文：`/en/versions/<version>/`

## 标签分发策略

兼容多个版本的页面不需要手动复制到各版本目录，而是通过 `modVersions` 标签声明适用版本，由生成脚本自动输出。
