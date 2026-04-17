---
title: 访问与修改方块属性
description: 介绍 Croparia IF 中的 BlockProperties，以及它在方块状态提取、匹配、序列化和展示中的作用。
keywords:
  - Croparia IF
  - BlockProperties
  - BlockState
  - 方块属性
  - DataComponent
  - 开发者文档
  - 1.1.0a
modVersions:
  - 1.1.0a
---

# 访问与修改方块属性

<a id="overview"></a>

`BlockProperties` 是 Croparia IF 对“方块状态属性集合”的一个轻量封装。它的本体并不复杂，本质上就是一个 `Map<String, String>`，但它额外补齐了几个在开发中非常有价值的能力：

- `Codec`
- `StreamCodec`
- `DataComponentType`
- 从 `BlockState` 提取属性
- 判断一组属性是否匹配某个 `BlockState`

也正因为这些附加能力，它不只是一个普通 map，而是一个可以在 JSON、网络、Tooltip 与运行时匹配之间复用的状态属性对象。

<a id="mental-model"></a>

## 心智模型

可以把 `BlockProperties` 理解成：

- “一个方块状态的可序列化子集”

这里有两个关键词：

- 可序列化
- 子集

它通常不会试图完整复制整个 `BlockState`，而是专注于：

- 提取需要保留的属性
- 在别的地方再把这些属性应用回去

<a id="extract-and-match"></a>

## 提取与匹配

`BlockProperties` 最常用的两个能力是：

- `extract(BlockState state)`
- `isSubsetOf(BlockState state)`

它们组合起来非常适合做：

- 从世界中的状态提取差异属性
- 在配方、展示或判定时检查目标状态是否满足这些属性要求

尤其 `extract(...)` 的设计很值得注意：它提取的是“相对于默认方块状态的差异属性”，而不是机械地复制全部属性。

这让得到的结果通常更简洁，也更适合作为持久化数据。

<a id="serialization"></a>

## 为什么它值得单独封装

如果只是用 `Map<String, String>`，理论上也能表达方块属性。但 `BlockProperties` 的价值在于，它把多个系统需要的能力统一到了一个类型里：

- JSON 序列化
- 网络同步
- 作为 Data Component 挂在 `ItemStack` 上
- Tooltip 展示
- 配方或结构匹配

这类“一个小结构在很多系统里反复出现”的对象，非常适合被抽成专门类型。

<a id="where-used"></a>

## 在哪里会遇到它

开发中最常见的几个出现位置包括：

- [Recipe API](../recipe/index.md#overview) 中的 `BlockInput` / `BlockOutput`
- 一些占位展示栈上的方块状态描述
- 需要把 `BlockState` 信息跨系统保存的地方

因此，如果你正在实现的是“和方块状态有关的数据结构”，优先考虑复用 `BlockProperties`，而不是自己另外设计一套属性对象。

<a id="tips"></a>

## 使用建议

- 当你需要“描述方块状态的一部分属性”时，优先用 `BlockProperties`。
- 当你只是暂时在函数内部读一下 `BlockState`，并不需要跨 JSON / 网络 / UI 流动时，直接读原版状态就够了。
- 如果一个系统既需要序列化又需要匹配逻辑，`BlockProperties` 会比裸 `Map<String, String>` 更稳。

