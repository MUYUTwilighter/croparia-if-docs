---
title: 自定义物品组件
description: 介绍 Croparia IF 的自定义 Data Components，包括注册方式、TooltipProvider 联动，以及 Text、TargetPos、BlockProperties 三个内置组件的实际用途。
keywords:
  - Croparia IF
  - 开发者文档
  - Data Components
  - CropariaComponents
  - Text
  - TargetPos
  - BlockProperties
  - TooltipProvider
  - 1.1.1a
---

# 自定义物品组件

<a id="overview"></a>

Croparia IF 在原版 `Data Components` 体系之上注册了一组自己的组件，用来给物品附加更明确的运行时语义。

这组内容更适合放在 `other`，因为它不是单个核心模块专属的实现细节，而是一套横跨多个系统都可能复用的通用能力。

如果你想知道：

- 模组自己的组件是怎么注册的
- 为什么某些物品会自动在 tooltip 中显示额外信息
- `TargetPos`、`Text`、`BlockProperties` 这几类组件分别适合做什么

这页就是入口。

<a id="registration"></a>

## 注册入口

统一注册入口在 `CropariaComponents`。

当前源码里注册了三个组件：

- `TARGET_POS`
- `BLOCK_PROPERTIES`
- `TEXT`

它们的共同点是：

- 都注册为原版 `DataComponentType`
- 都有持久化 codec
- 需要网络同步时会显式声明 `networkSynchronized(...)`

这说明 Croparia IF 把“组件是什么”和“组件如何在物品上流动”都交给了原版组件体系，而不是自建一套 NBT 包装层。

<a id="tooltip-chain"></a>

## Tooltip 联动是怎么接起来的

这组组件最容易被开发者直接感知到的地方，是它们会出现在物品 tooltip 中。

这条链主要由两部分组成：

- 组件类型本身实现 `TooltipProvider`
- `ItemStackMixin` 在 tooltip 构建过程中遍历 `CropariaComponents.forEach(...)`

也就是说，Croparia IF 不是在每个物品类里手写 tooltip 拼接，而是：

- 先把“组件如何展示自己”写进组件类型
- 再通过 mixin 把这些组件统一接入 `ItemStack` 的 tooltip 流程

这种做法的好处是很明显的：

- 组件展示逻辑跟着组件走
- 使用该组件的物品不需要重复写 UI 拼接代码

<a id="text"></a>

## `Text`

`Text` 是最简单的一类自定义组件。

它本质上封装了一个 `MutableComponent`，并实现了 `TooltipProvider`。它的职责很单纯：

- 把一段文本数据挂到物品上
- 在 tooltip 中直接显示出来

这类组件适合做：

- 一段附加说明
- 临时提示文本
- 需要跟着物品一起走、同时又要进 tooltip 的可读信息

如果你只需要“给物品补一段能被读出来的文本”，`Text` 是这组组件里最轻量的选择。

<a id="target-pos"></a>

## `TargetPos`

`TargetPos` 表示一个“绑定到某个维度和坐标”的目标位置。

它内部保存的核心数据是：

- 维度 `Identifier`
- `BlockPos`

它除了能显示 tooltip，还提供了：

- `getLevel(server)`
- `teleport(entity, server)`

所以它不是单纯的“坐标注释”，而是一个带有明确运行时语义的目标位置组件。

如果你需要让某个物品记住：

- 绑定点
- 传送目标
- 某个跨维度位置引用

那么 `TargetPos` 这种写法就很值得直接复用。

<a id="block-properties"></a>

## `BlockProperties`

`BlockProperties` 表示一组方块状态属性的字符串映射，同时也是一个 `TooltipProvider`。

它在 Croparia IF 里不只是“保存一个 map”，还和：

- [访问与修改方块属性](block-property.md#overview)

这条链直接相连。

它的核心能力包括：

- 从 `BlockState` 中提取属性
- 判断自身是否是某个 `BlockState` 的子集
- 在 tooltip 中列出当前记录的属性

因此如果你需要让一个物品携带“某个方块状态的可移植描述”，`BlockProperties` 比自己塞一段自定义字符串更合适。

<a id="network-sync"></a>

## 哪些组件需要网络同步

从 `CropariaComponents` 的注册方式可以看到：

- `TARGET_POS`
  - 显式声明了 `networkSynchronized(TargetPos.TYPE.streamCodec())`
- `BLOCK_PROPERTIES`
  - 通过 `BlockProperties.TYPE` 自带网络同步
- `TEXT`
  - 通过 `CodecUtil.toStream(Text.CODEC)` 生成网络 codec

这说明 Croparia IF 对组件的态度很明确：

- 只要客户端也需要正确读取这个组件
- 就把网络同步作为组件类型本身的一部分定义清楚

因此开发者在新增组件时，最好尽早想清楚：

- 这个组件只是服务端语义
- 还是也要在客户端显示、渲染或参与交互

<a id="when-to-use"></a>

## 什么时候该做成自定义组件

下面这些场景很适合走组件：

- 这份数据天然属于某个 `ItemStack`
- 它需要跟随物品序列化、复制、传输
- 它可能在 tooltip 或客户端显示层被直接读取
- 你希望它拥有自己的 codec 和展示逻辑

如果你的数据只是某个系统运行时临时变量，或者根本不会附着在物品上，那么未必需要做成 `DataComponentType`。

<a id="tips"></a>

## 使用建议

- 新组件优先想清楚“它是一个纯数据值，还是一个带展示/行为语义的物品附属对象”。
- 如果组件会显示在 tooltip 中，优先让组件自己实现 `TooltipProvider`，而不是把展示逻辑散落在物品类里。
- 如果组件会在客户端被读取，注册时就把网络同步一起设计好。
- 如果你的组件本质上是在描述方块状态或目标位置，优先参考 `BlockProperties` 和 `TargetPos`，不要重复发明近似结构。

