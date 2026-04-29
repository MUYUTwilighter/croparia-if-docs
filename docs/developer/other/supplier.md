---
title: Supplier 工具
description: 介绍 Croparia IF 中的 Mappable、LazySupplier 与 OnLoadSupplier，以及它们在延迟计算和数据重载场景中的用法。
keywords:
  - Croparia IF
  - Mappable
  - LazySupplier
  - OnLoadSupplier
  - Supplier
  - 延迟加载
  - 数据重载
  - 开发者文档
  - 1.1.1a
---

# Supplier 工具

<a id="overview"></a>

Croparia IF 在 `util.supplier` 下提供了几种很实用的小工具，用来处理：

- 延迟创建
- 惰性缓存
- 数据包重载后的自动刷新
- 在 `Supplier` 上继续做映射

最常用的三个类型是：

- `Mappable<T>`
- `LazySupplier<T>`
- `OnLoadSupplier<T>`

<a id="mappable"></a>

## `Mappable`

`Mappable<T>` 是最薄的一层，它本质上就是一个带 `map(...)` 能力的 `Supplier<T>`。

它的价值在于：

- 你可以在不立刻取值的前提下继续变换返回结果
- 某些上层 API 不必过早决定“最终要拿到的展示对象长什么样”

在源码里，它经常被用来表示：

- 某个工作站物品栈
- 一个懒计算的展示对象

如果只看接口，它很简单；但它为上层保留了“继续映射”的余地，这一点在 UI 展示和延迟构造场景里很有用。

<a id="lazy-supplier"></a>

## `LazySupplier`

`LazySupplier<T>` 是最典型的惰性缓存实现：

- 第一次 `get()` 时创建值
- 之后重复返回缓存

它适合：

- 构造成本不低
- 但结果一旦算出来通常就能长期复用

这类对象在 Croparia IF 里非常常见，比如：

- 某些展示栈列表
- 某些由注册表或标签推导出的结果

相比“每次都现算”，它更省；相比“类加载时立即构造”，它又更晚绑定运行时环境。

<a id="on-load-supplier"></a>

## `OnLoadSupplier`

`OnLoadSupplier<T>` 可以看成“带数据重载感知的 LazySupplier”。

它和 `LazySupplier` 的关键区别是：

- `LazySupplier`
  - 一次缓存，长期有效
- `OnLoadSupplier`
  - 数据包重载后，下次 `get()` 会重新生成

Croparia IF 用 `OnLoadSupplier.LAST_DATA_LOAD` 记录最近一次数据重载时间，`OnLoadSupplier` 再据此决定缓存是否失效。

这使它特别适合：

- 依赖 tag、注册表或数据包内容的缓存
- 需要在 reload 后自动刷新，但又不想手动在每个调用点处理失效逻辑的场景

<a id="when-to-use"></a>

## 什么时候该用哪个

可以用一个简单规则来区分：

- 只想延迟构造，并且不考虑 reload
  - `LazySupplier`
- 想在 supplier 上继续做映射
  - `Mappable`
- 值依赖数据包 / tag / 运行时数据重载
  - `OnLoadSupplier`

很多时候它们不是互斥关系，而是层层递进的：

- `LazySupplier` 实现了 `Mappable`
- `OnLoadSupplier` 继承了 `LazySupplier`

所以你可以把它们理解成“同一条思路上的不同强度工具”。

<a id="where-used"></a>

## 在哪里会遇到

这些 supplier 工具在源码里最常见的地方包括：

- [Recipe API](../recipe/index.md#overview) 中的一些展示栈与工作站数据
- 作物、材料、方块等由注册表或 tag 推导出的缓存集合
- 依赖数据包加载结果的运行时对象

如果你发现某个值：

- 不是启动时就安全可用
- 也不适合每次都现算
- 还可能在 reload 后失效

那通常就是 `OnLoadSupplier` 的用武之地。

<a id="tips"></a>

## 使用建议

- 不要把所有 `Supplier` 都换成 `LazySupplier`；只有在“晚一点算更合理”时它才有价值。
- 如果值依赖 tag 或数据包内容，优先考虑 `OnLoadSupplier`，否则 reload 后很容易得到过期缓存。
- 当你需要链式变换 supplier 结果时，优先保留 `Mappable` 语义，而不是过早 `get()` 之后再重新包一层。

