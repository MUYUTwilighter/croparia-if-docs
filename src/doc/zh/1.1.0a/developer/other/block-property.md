---
title: 访问与修改方块属性
desc: 介绍 Croparia IF 中的 BlockProperties，以及它在方块状态提取、匹配、序列化和展示中的作用。
keywords:
  - Croparia IF
  - BlockProperties
  - BlockState
  - 方块属性
  - DataComponent
  - 开发者文档
  - 1.1.0a
navOrder: 30
---

# 访问与修改方块属性

<a id="overview"></a>

如果你在开发中遇到下面这些需求：

- 想把一个 `BlockState` 的属性保存到 JSON、网络包或 `ItemStack` 上
- 想判断一个方块状态是否满足某些属性要求
- 想根据一组字符串属性重新构造或修改 `BlockState`

那么 Croparia IF 提供的 `BlockProperties` 就是专门为这类场景准备的。

它可以被看作：

- 一个“可序列化的方块状态属性子集”

你可以把它从 `BlockState` 中提取出来，带着它跨系统流动，再在别的地方把它应用回真实的方块状态。

<a id="mental-model"></a>

## 心智模型

从使用者角度看，理解 `BlockProperties` 最简单的方法是：

- `BlockState`
  - 原版运行时状态对象
- `BlockProperties`
  - 适合保存、传输和匹配的属性描述
- `StateHolderAccess.apply(...)`
  - 把 `BlockProperties` 再应用回 `BlockState`

它最常见的使用链路通常就是：

1. 从一个 `BlockState` 提取属性
2. 把这些属性保存下来
3. 在别的地方再做匹配或重新应用

如果你只记住这一条主线，这页的大部分内容就够用了。

<a id="extract-and-match"></a>

## 提取、应用与匹配

`BlockProperties` 最常用的三个能力是：

- `extract(BlockState state)`
- `isSubsetOf(BlockState state)`
- 配合 `StateHolderAccess.apply(...)` 重新应用到 `BlockState`

这三件事基本覆盖了开发中的大部分使用场景。

`extract(...)` 的特点是：

- 它提取的是“相对于默认方块状态的差异属性”
- 不会机械地复制所有属性
- 得到的结果通常更短，更适合保存

而 `isSubsetOf(...)` 和 `apply(...)` 则分别对应：

- “这个状态是否满足要求”
- “把这组要求真正应用到状态上”

所以在实际开发里，你完全可以把 `BlockProperties` 当成：

- 方块状态的保存格式
- 方块状态的匹配条件
- 方块状态的重建参数

<a id="example-flow"></a>

## 一条典型工作流

最典型的一条使用路径通常像这样：

```java
BlockState state = level.getBlockState(pos);
BlockProperties properties = BlockProperties.extract(state);

// save, send, or attach properties

BlockState restored = StateHolderAccess.apply(state.getBlock().defaultBlockState(), properties);
```

如果你的目标不是恢复一个状态，而是做判断，也可以：

```java
boolean matches = properties.isSubsetOf(otherState);
```

这也是为什么 `BlockProperties` 在配方、展示和跨系统传递里都很常见。

<a id="serialization"></a>

## 为什么不直接用 `Map<String, String>`

当然，理论上你也可以自己维护一个 `Map<String, String>`。

但 `BlockProperties` 的价值在于，它已经把开发中真正需要的几件事情统一好了：

- JSON 序列化
- 网络同步
- 作为 Data Component 挂在 `ItemStack` 上
- Tooltip 展示
- 配方或结构匹配
- 和 `StateHolderAccess.apply(...)` 配合重新生成状态

这意味着你用的不是“一个普通 map”，而是一种已经被 Croparia IF 各个系统认得的方块属性格式。

<a id="where-used"></a>

## 在哪里会遇到它

开发中最常见的几个出现位置包括：

- [Recipe API](../recipe/index.md#overview) 中的 `BlockInput` / `BlockOutput`
- 一些占位展示栈上的方块状态描述
- 需要把 `BlockState` 信息跨系统保存的地方
- 需要把属性重新应用回 `BlockState` 的逻辑

因此，如果你正在做的是“和方块状态有关的可持久化数据结构”，优先考虑复用它，而不是再定义一套平行格式。

<a id="state-holder-mixin"></a>

## `StateHolderMixin` 在这里起什么作用

上面这些能力之所以成立，是因为 Croparia IF 通过 `StateHolderMixin` 给原版 `StateHolder` 加上了 `StateHolderAccess` 接口。

对使用者来说，你不用记太多内部实现细节，只需要知道一件事：

- Croparia IF 额外提供了一条“按字符串属性名读写原版状态”的桥

这条桥主要包括：

- `cif$getValue(String key)`
- `cif$setValue(String key, String value)`
- `cif$getProperties()`
- `StateHolderAccess.apply(...)`

也就是说，`BlockProperties` 并不是自己“神奇地会改方块状态”，而是通过这层 access/mixin 能力接进了原版状态系统。

<a id="tips"></a>

## 使用建议

- 当你需要“描述方块状态的一部分属性”时，优先用 `BlockProperties`。
- 当你需要把属性重新应用回 `BlockState` 时，优先走 `StateHolderAccess.apply(...)`。
- 当你只是暂时在函数内部读一下 `BlockState`，并不需要跨 JSON / 网络 / UI 流动时，直接读原版状态就够了。
- 如果一个系统既需要序列化又需要匹配或重新应用逻辑，`BlockProperties` 会比裸 `Map<String, String>` 更稳。


