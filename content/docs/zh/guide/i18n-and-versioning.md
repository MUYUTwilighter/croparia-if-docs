---
title: 多语言与多版本
outline: deep
modVersions:
  - 1.1.0a
---

# 多语言与多版本

## 多语言

VitePress 原生负责多语言切换，当前已启用：

- `root`：简体中文
- `en`：English

## 多版本

多版本使用目录路由加页面标签生成：

- 当前中文：`/`
- 当前英文：`/en/`
- 历史中文：`/versions/<version>/`
- 历史英文：`/en/versions/<version>/`

## 版本标签

页面可以在 frontmatter 中声明：

```yaml
modVersions:
  - 1.1.0a
  - 1.0.0
```

生成时，脚本会把这篇页面同步到这些版本对应的输出路径。
