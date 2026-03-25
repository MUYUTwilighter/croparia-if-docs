---
title: 多语言与多版本
outline: deep
---

# 多语言与多版本

## 多语言

VitePress 原生支持多语言。当前站点已配置：

- `root`：简体中文
- `en`：English

对应内容目录如下：

```text
.
├─ index.md
├─ guide/
├─ en/
│  ├─ index.md
│  └─ guide/
└─ versions/
```

## 多版本

VitePress 没有专门的“官方一键版本系统”。当前采用的是更稳妥的目录约定方案：

- 当前版本直接放在根路径与 `/en/`
- 历史版本放在 `/versions/<version>/`
- 英文历史版本放在 `/en/versions/<version>/`

这样做的好处是：

- URL 清晰稳定
- 不依赖额外插件
- 后续需要接自动生成时，也容易接入脚本或 `rewrites`

## 当前记录的默认版本

- Mod `1.1.0a`
- Minecraft `1.21.1`
