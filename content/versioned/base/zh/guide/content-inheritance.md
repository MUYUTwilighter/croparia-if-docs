---
title: 内容继承模型
outline: deep
---

# 内容继承模型

这是当前仓库为长期维护多版本文档准备的核心机制。

## 规则

- 每个版本先继承 `base` 中的共享页面
- 再叠加自己的版本目录内容
- 如果未来某个版本要继续继承更早版本，也可以通过版本元数据声明继承链

## 当前约定

- 共享页放在 `content/versioned/base/<locale>/`
- 当前版本页放在 `content/versioned/releases/1.1.0a/<locale>/`
- 历史版本页未来放在 `content/versioned/releases/<version>/<locale>/`

## 维护建议

- 只把真正跨版本稳定的内容放进 `base`
- 只在版本确实有差异时创建覆盖文件
- 当一个页面开始频繁分叉时，再考虑拆成更细的共享片段或组件
