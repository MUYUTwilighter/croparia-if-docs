---
title: 其他常用 API
description: 汇总 Croparia IF 开发者文档中尚未单独成组、但实际开发中经常会遇到的几个常用 API 与辅助结构。
keywords:
  - Croparia IF
  - 开发者文档
  - 其他 API
  - JsonTransformer
  - BlockProperties
  - SlotDisplay
  - 1.1.0a
modVersions:
  - 1.1.0a
---

# 其他常用 API

<a id="overview"></a>

这一页用来收纳那些目前还不值得单独扩成一整组专题、但在实际开发中会反复遇到的小型 API 与辅助结构。

它们通常有两个特点：

- 体量不大，但会在多个系统里重复出现
- 单独看很简单，放回上下文里却很关键

当前这一页主要覆盖：

- `JsonTransformer`
- `BlockProperties`
- `SlotDisplay`

<a id="json-transformer"></a>

## `JsonTransformer`

`JsonTransformer` 位于 `api.json`，它的职责很直接：把不同文本格式的配置内容统一转换成 `JsonElement`。

当前源码里默认支持：

- `json`
- `cdg`
- `toml`

这也是 Croparia IF 的很多“看起来不是 JSON 的配置文件”最终仍然能进入统一 codec 读取流程的原因。

你可以把它理解成“进入 Codec 之前的一层文本预处理器”。

它最常见的价值是：

- 让 `generator` 既能读 `.json`，也能读 `.toml` 和 `.cdg`
- 让上层代码始终只面对 `JsonElement`
- 把“文件后缀判断”与“真正的数据解码”分开

如果你在写一个“支持多种文本配置格式，但最终还是要走 codec”的系统，`JsonTransformer` 的思路很值得复用。

<a id="block-properties"></a>

## `BlockProperties`

`BlockProperties` 位于 `api.core.component`，是 Croparia IF 对“方块状态属性集合”的一个轻量封装。

它本质上是一个 `Map<String, String>`，但额外提供了几件很重要的事情：

- `Codec` 与 `StreamCodec`
- `DataComponentType`
- 从 `BlockState` 提取属性的工具方法
- 判断一组属性是否是某个 `BlockState` 的子集

它在源码里最常见的用途包括：

- 作为 [Recipe API](recipe/index.md#overview) 中 `BlockInput` / `BlockOutput` 的一部分
- 挂在物品或占位展示物上，用于表达“这个栈对应某种方块状态”
- 作为一种跨 JSON、网络、Tooltip 都能统一表示的方块属性结构

如果你在 Croparia IF 内部需要描述“一个方块，但不只是方块 ID，还包括状态属性”，那么优先考虑复用 `BlockProperties`，而不是自己另造一份 `Map<String, String>` 结构。

<a id="slot-display"></a>

## `SlotDisplay`

`SlotDisplay` 是个非常小的接口，但它在配方与展示系统之间起了很实用的桥接作用。

它只定义了一件事：

- `List<ItemStack> getDisplayStacks()`

这意味着，只要某个对象实现了 `SlotDisplay`，它就能比较自然地参与：

- 配方 GUI 展示
- JEI / REI 兼容层
- 输入输出候选显示

像 [ItemInput](recipe/entries.md#item-input-output)、[ItemOutput](recipe/entries.md#item-input-output)、`BlockInput`、`BlockOutput` 这类预设类型都实现了它。

它的价值恰恰在于“非常克制”：

- 不关心对象怎么匹配
- 不关心对象怎么序列化
- 只关心“展示时应该给出哪些候选栈”

这让很多配方展示逻辑可以依赖一个非常薄的公共抽象。

<a id="usage-notes"></a>

## 使用建议

- 当一个工具只是在“进入 codec 之前”做文本预处理时，优先考虑像 `JsonTransformer` 这样把职责截断，不要把文件格式判断混进 codec 本体。
- 当你需要在多个系统之间共享方块状态属性时，优先复用 `BlockProperties`，这样 JSON、网络和 Tooltip 能自然对齐。
- 当一个对象既参与逻辑又参与展示时，可以考虑让它实现 `SlotDisplay`，但不要把过多业务语义塞进这个接口里。

如果你发现某个“其他 API”开始出现越来越多的调用点，或者已经需要单独解释完整工作流，那通常就说明它应该从这页里独立成一个新的专题页了。
