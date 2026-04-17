---
title: 预设输入输出类型
description: 介绍 Croparia IF Recipe API 中的 ItemInput、ItemOutput、BlockInput 与 BlockOutput，以及它们各自适合的使用场景。
keywords:
  - Croparia IF
  - Recipe API
  - ItemInput
  - ItemOutput
  - BlockInput
  - BlockOutput
  - SlotDisplay
  - 配方输入输出
  - 开发者文档
  - 1.1.0a
modVersions:
  - 1.1.0a
---

# 预设输入输出类型

<a id="overview"></a>

Croparia IF 在 Recipe API 中预设了几种常用输入输出结构，用来解决两个问题：

- 原版配方输入输出的表示方式并不稳定，也不总能满足 Croparia IF 的需求
- JEI / REI 展示、配方匹配、JSON 序列化希望复用同一套对象

当前最常用的四个类型是：

- `ItemInput`
- `ItemOutput`
- `BlockInput`
- `BlockOutput`

它们都实现了 `SlotDisplay`，因此不仅可以作为数据结构，也可以直接提供配方展示时需要的图标或候选栈列表。

<a id="mental-model"></a>

## 心智模型

可以先用最简单的方式理解这四个类型：

- `ItemInput`
  - “怎么匹配输入物品”
- `ItemOutput`
  - “怎么描述输出物品”
- `BlockInput`
  - “怎么匹配输入方块或方块状态”
- `BlockOutput`
  - “怎么描述输出方块状态”

输入类型通常强调：

- 匹配逻辑
- 标签支持
- 组件 / 属性约束
- 数量要求

输出类型通常强调：

- 最终生成什么
- 怎样展示
- 如何还原成 `ItemStack` 或 `BlockState`

<a id="item-input-output"></a>

## `ItemInput` 与 `ItemOutput`

`ItemInput` 和 `ItemOutput` 都围绕 `ItemStack`，但职责并不相同。

`ItemInput` 的重点是“匹配”：

- 可以按 `id` 匹配
- 可以按 `tag` 匹配
- 可以附加 `DataComponentPatch`
- 可以要求最小 `amount`

它还提供了一些直接面向运行时逻辑的方法：

- `matches(...)`
- `matchType(...)`
- `consume(...)`
- `getDisplayStacks()`

这意味着 `ItemInput` 不只是一个静态描述对象，它本身就带有输入检查和消耗逻辑。

`ItemOutput` 的重点则是“产出”：

- 指定输出物品 `id`
- 附带组件
- 指定数量
- 可还原成 `ItemSpec` 或 `ItemStack`

如果你只需要描述“最终给玩家什么物品”，通常 `ItemOutput` 就够了；如果你需要描述“输入要如何匹配和消耗”，则应该使用 `ItemInput`。

<a id="block-input-output"></a>

## `BlockInput` 与 `BlockOutput`

方块侧与物品侧相似，但会多出“方块状态属性”的维度。

`BlockInput` 的重点是“匹配方块或方块状态”：

- 可按 `id` 匹配
- 可按 `tag` 匹配
- 可附加 `BlockProperties`
- 支持“任意方块”这类特殊输入

它还额外实现了 `LootItemCondition`，因此在一些掉落或方块判定相关场景中也能直接复用。

`BlockOutput` 的重点是“生成目标方块状态”：

- 持有目标方块 `id`
- 持有 `BlockProperties`
- 可还原出展示用栈
- 可通过 `setBlock(...)` 直接将方块放入世界

如果你的配方最终结果是“在世界里放置一个方块状态”，`BlockOutput` 会比手写 `Identifier + properties` 更方便。

<a id="codecs"></a>

## 这些类型为什么都自带 Codec

这四个预设类型几乎都内置了：

- `CODEC_STR`
- `CODEC_COMP`
- `CODEC`
- `STREAM_CODEC`

这种设计背后的思路是：

- 简写与完整写法都应该被支持
- 网络同步与 JSON 读写应该复用同一份结构

以 `ItemInput` 为例，它既支持简写字符串，也支持完整对象写法；内部正是通过 [MultiCodec](../codec/multi-codec.md#overview) 与 [TestedCodec](../codec/tested-codec.md#overview) 来协调这些格式。

也就是说，Recipe API 和 [Codec API](../codec/index.md#overview) 是直接配合使用的。

<a id="display"></a>

## `SlotDisplay`

这几个预设类型都实现了 `SlotDisplay`。对开发者来说，这意味着它们不仅能参与配方匹配，也能直接参与配方界面展示。

最常见的体现是：

- JEI / REI 可以直接拿它们的展示栈列表
- 配方类本身不需要额外再维护一份“展示专用输入输出”

这种设计能显著减少“逻辑对象”和“展示对象”分裂的问题。

<a id="when-to-use"></a>

## 什么时候优先用这些预设类型

适合直接使用预设类型的场景：

- 配方输入输出确实围绕物品或方块展开
- 你希望 JSON、运行时匹配、JEI / REI 展示共用同一份结构
- 你想复用 Croparia IF 现有的简写 / 完整写法兼容逻辑

不适合直接使用的场景：

- 你的配方输入输出不是物品或方块，而是更抽象的自定义资源
- 你只需要一个极轻量、也不会被展示的内部对象

前一种情况往往更适合自己定义新条目类型，再参考这几种预设结构实现相应的 codec 与展示接口。

<a id="tips"></a>

## 使用建议

- 先区分“输入匹配对象”和“输出描述对象”，不要用 `ItemOutput` 反向承担输入校验。
- 当配方既要匹配又要展示时，优先考虑直接复用这些预设类型，而不是再包一层 DTO。
- 如果你的 JSON 想同时支持简写和完整对象，优先参考这些类型已有的 codec 设计，而不是从零开始。
- 当你准备把配方接进 JEI / REI 时，使用这些预设类型会明显减少额外适配工作。

完成输入输出结构设计之后，下一步通常是把配方类型接入 [JEI](jei.md#overview) 或 [REI](rei.md#overview)。
