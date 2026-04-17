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

`BlockProperties` 本身只是 Croparia IF 对“方块状态属性集合”的一个轻量封装，但它真正发挥作用，依赖的是 `StateHolderMixin` 与 `StateHolderAccess` 对原版 `StateHolder` 体系做的补强。

如果只看数据结构，`BlockProperties` 本质上就是一个 `Map<String, String>`；但和 `StateHolderAccess` 配合之后，它就变成了一个可以：

- `Codec`
- `StreamCodec`
- `DataComponentType`
- 从 `BlockState` 提取属性
- 以字符串键值读写原版 `StateHolder` 属性
- 判断一组属性是否匹配某个 `BlockState`

也正因为这层协作关系，它不只是一个普通 map，而是一个可以在 JSON、网络、Tooltip 与运行时匹配之间复用的状态属性对象。

<a id="mental-model"></a>

## 心智模型

理解这一组功能时，最稳的心智模型是：

- `BlockProperties`
  - 负责保存“属性名 -> 属性值”的可序列化结果
- `StateHolderMixin`
  - 把原版 `StateHolder` 补成一个可以按字符串访问属性的对象
- `StateHolderAccess`
  - 提供读、写、列举属性的统一接口

也就是说，Croparia IF 并不是让 `BlockProperties` 自己去理解原版状态系统，而是先通过 mixin 把原版 `StateHolder` 变得更容易操作，再让 `BlockProperties` 作为上层数据结构去调用这些能力。

因此更准确的说法其实是：

- `BlockProperties` 是“方块状态属性的序列化表达”
- `StateHolderAccess` 是“方块状态属性的运行时访问桥”

<a id="extract-and-match"></a>

## `StateHolderMixin` 做了什么

`StateHolderMixin` 直接作用在原版 `StateHolder` 上，并实现了 `StateHolderAccess`。这一步非常关键，因为它让原版状态对象获得了几种 Croparia IF 需要、但原版并没有直接提供的能力：

- `cif$getProperty(String key)`
- `cif$getValue(String key)`
- `cif$setValue(String key, String value)`
- `cif$getProperties()`

这些方法的核心价值在于：

- 你可以用字符串键访问属性，而不必总是手握原版 `Property<?>` 对象
- 你可以把方块状态安全地映射成字符串字典
- 你也可以再把字符串字典反向应用回 `BlockState`

这使得 `BlockProperties` 这样的结构才有现实意义，因为它终于有了一个稳定的“运行时落点”。

<a id="extract-and-apply"></a>

## 提取、应用与匹配

`BlockProperties` 最常用的三个能力是：

- `extract(BlockState state)`
- `isSubsetOf(BlockState state)`
- 配合 `StateHolderAccess.apply(...)` 重新应用到 `BlockState`

这三步基本对应了一条完整工作流：

1. 从当前 `BlockState` 提取需要保留的属性
2. 将它保存、传输或挂载到别的对象上
3. 在需要时再把这些属性应用到目标状态，或拿来做匹配判断

其中 `extract(...)` 的设计尤其值得注意：它提取的是“相对于默认方块状态的差异属性”，而不是机械地复制全部属性。

这让结果更简洁，也更适合作为持久化数据。

而 `StateHolderAccess.apply(...)` 的存在则意味着：

- `BlockProperties` 不只是“能存”
- 它还能被重新解释成真正的状态修改操作

这也是它比普通 `Map<String, String>` 更有价值的地方。

<a id="serialization"></a>

## 为什么这一组设计值得单独封装

如果只是用 `Map<String, String>`，理论上也能表达方块属性；如果只是直接操作原版 `Property<?>`，理论上也能修改 `BlockState`。

但 Croparia IF 之所以把 `BlockProperties + StateHolderAccess` 作为一组能力来做，是因为它们一起解决了多个系统之间的桥接问题：

- JSON 序列化
- 网络同步
- 作为 Data Component 挂在 `ItemStack` 上
- Tooltip 展示
- 配方或结构匹配
- 把字符串属性重新应用到原版状态对象

这类“一个小结构在很多系统里反复出现”的对象，非常适合被抽成专门类型。

<a id="where-used"></a>

## 在哪里会遇到它

开发中最常见的几个出现位置包括：

- [Recipe API](../recipe/index.md#overview) 中的 `BlockInput` / `BlockOutput`
- 一些占位展示栈上的方块状态描述
- 需要把 `BlockState` 信息跨系统保存的地方
- 所有需要把“字符串属性字典”重新转回 `BlockState` 的逻辑

因此，如果你正在实现的是“和方块状态有关的数据结构或桥接逻辑”，优先考虑复用这一套，而不是自己另外设计一套属性对象和 set/get 约定。

<a id="tips"></a>

## 使用建议

- 当你需要“描述方块状态的一部分属性”时，优先用 `BlockProperties`。
- 当你需要按字符串名访问或修改原版状态属性时，优先通过 `StateHolderAccess` 这条桥。
- 当你只是暂时在函数内部读一下 `BlockState`，并不需要跨 JSON / 网络 / UI 流动时，直接读原版状态就够了。
- 如果一个系统既需要序列化又需要匹配或重新应用逻辑，`BlockProperties + StateHolderAccess` 会比裸 `Map<String, String>` 更稳。

