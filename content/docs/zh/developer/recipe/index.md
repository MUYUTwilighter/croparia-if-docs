---
title: Recipe API
description: 面向 Croparia IF 下游开发者的 Recipe API 概览，介绍 DisplayableRecipe、TypedSerializer、预设输入输出类型以及 JEI 与 REI 接入方式。
keywords:
  - Croparia IF
  - Recipe API
  - DisplayableRecipe
  - TypedSerializer
  - ItemInput
  - ItemOutput
  - BlockInput
  - BlockOutput
  - JEI
  - REI
  - 开发者文档
  - 1.1.1a
modVersions:
  - 1.1.1a
---

# Recipe API

<a id="overview"></a>

Croparia IF 的 Recipe API 主要围绕两个目标展开：

- 用一套统一接口描述“可显示的配方”
- 尽量减少 JEI、REI 和配方输入输出结构之间的重复适配代码

这套 API 并不是替代原版 `Recipe` / `RecipeSerializer` / `RecipeType`，而是在它们之上补出一层更适合模组内多种配方系统复用的抽象。

<a id="mental-model"></a>

## 心智模型

理解这套 API 时，可以先记住下面这几个角色：

- `DisplayableRecipe`
  - 表示“既是原版配方，又能提供展示所需信息”的配方接口
- `TypedSerializer`
  - 把 `RecipeType` 与 `RecipeSerializer` 合并进一个对象，同时附带查询与工作站信息
- `ItemInput` / `ItemOutput`
  - 用统一结构描述物品输入输出
- `BlockInput` / `BlockOutput`
  - 用统一结构描述方块输入输出

换句话说：

- `DisplayableRecipe` 解决“配方对象长什么样”
- `TypedSerializer` 解决“这个配方类型如何注册、如何查询、在哪些工作站显示”
- 预设输入输出类型解决“怎么把复杂输入输出写成稳定的结构”

<a id="displayable-recipe"></a>

## `DisplayableRecipe`

`DisplayableRecipe<C extends RecipeInput>` 是这套 API 的核心接口。它继承原版 `Recipe<C>`，并额外要求配方提供几类展示信息：

- `craftingStation()`
  - 当前配方对应的工作站
- `getTypedSerializer()`
  - 当前配方所属的 `TypedSerializer`
- `getInputs()`
  - 用于展示的输入列表
- `getOutputs()`
  - 用于展示的输出列表

它的意义在于：配方本体不再只是“能不能匹配、怎么组装”，还可以自然地向 JEI / REI 暴露展示数据。

如果你把它和原版 `Recipe` 对比，会发现 Croparia IF 更强调“一个配方类本身就应该知道如何被展示”。

<a id="typed-serializer"></a>

## `TypedSerializer`

`TypedSerializer<R>` 同时实现了：

- `RecipeType<R>`
- `RecipeSerializer<R>`

这也是它名字里 `Typed` 的含义来源。它把“类型”和“序列化器”合成了一个统一对象，并额外持有：

- 配方类型 ID
- 配方类对象
- `MapCodec`
- `StreamCodec`
- 工作站列表

它最实用的几个能力是：

- `find()`
  - 查询当前类型的全部配方
- `findHolders()`
  - 查询当前类型的全部 `RecipeHolder`
- `find(input, level)`
  - 在给定输入和世界中查询匹配配方
- `getStations()`
  - 获取这个配方类型对应的工作站，用于 JEI / REI 展示

因此，`TypedSerializer` 不只是“注册时顺手用一下”的对象，而是 Recipe API 的运行时中心。

<a id="when-to-use"></a>

## 什么时候该用 Recipe API

适合直接使用这套 API 的场景：

- 你要新增一种 Croparia IF 风格的配方类型
- 你希望同一个配方类直接兼容原版配方系统与 JEI / REI 展示
- 你想复用 Croparia IF 现成的输入输出结构，而不是每次自己写一套 codec

如果你的需求只是做一个完全独立、也不打算接 JEI / REI 的临时内部结构，这套 API 可能会显得偏重。

<a id="navigation"></a>

## 导航

- [预设输入输出类型](entries.md#overview)
- [JEI 接入](jei.md#overview)
- [REI 接入](rei.md#overview)
