---
title: JEI 接入
description: 介绍 Croparia IF Recipe API 如何接入 Just Enough Items，包括 JeiCategory、TypedSerializer 与工作站显示的关系。
keywords:
  - Croparia IF
  - Recipe API
  - JEI
  - Just Enough Items
  - JeiCategory
  - TypedSerializer
  - DisplayableRecipe
  - 配方展示
  - 开发者文档
  - 1.1.0a
modVersions:
  - 1.1.0a
---

# JEI 接入

<a id="overview"></a>

Croparia IF 对 JEI 的接入是建立在 Recipe API 之上的。它的核心思路不是“每个配方类型各写一套完全独立的 JEI 逻辑”，而是：

- 先让配方实现 `DisplayableRecipe`
- 再让类型信息集中在 `TypedSerializer`
- 最后由 `JeiCategory` 读取这些信息完成注册与展示

这样做的好处是，JEI 接入层本身可以非常薄。

<a id="mental-model"></a>

## 心智模型

JEI 侧最重要的几个对象是：

- `JeiClient`
  - JEI 插件入口
- `JeiCategory<R>`
  - 某一类配方在 JEI 中的展示类别
- `TypedSerializer<R>`
  - 提供类型 ID、配方类、工作站与运行时配方查询

关系可以理解成：

- `DisplayableRecipe` 负责“配方怎么暴露展示数据”
- `TypedSerializer` 负责“这类配方怎么被统一识别”
- `JeiCategory` 负责“这类配方在 JEI 中怎么呈现”
- `JeiClient` 负责“把所有类别和配方真正注册给 JEI”

<a id="jei-category"></a>

## `JeiCategory`

Croparia IF 的 `JeiCategory<R>` 是一个抽象基类，实现了 `IRecipeCategory<R>`。

它已经替你处理了几件事情：

- 用 `TypedSerializer` 自动生成 `RecipeType<R>`
- 默认使用配方类型 ID 生成标题翻译键
- 默认根据 `TypedSerializer.getStations()` 推导类别图标

因此，一个具体配方类型通常只需要：

1. 继承 `JeiCategory<R>`
2. 返回自己的 `TypedSerializer`
3. 补充具体布局逻辑

这让“一个配方类型对应一个 category 类”变得很自然。

<a id="typed-serializer"></a>

## `TypedSerializer` 在 JEI 中的作用

JEI 接入里，`TypedSerializer` 是真正的中心对象。`JeiCategory` 会依赖它来获取：

- 类别 ID
- 配方类类型
- 工作站图标来源
- 当前类型的全部运行时配方

特别是下面两点很关键：

- `getStations()`
  - 用于注册 recipe catalysts，并可推导默认图标
- `find()`
  - 用于把当前类型的全部配方注册到 JEI

所以如果你的 `TypedSerializer` 设计得比较完整，JEI 这一侧通常不需要写太多额外 glue code。

<a id="registration"></a>

## 注册流程

Croparia IF 的 JEI 注册流程可以概括成三步：

1. 在 `JeiClient` 中维护 `JeiCategory<?>` 列表
2. `registerCategories(...)` 注册类别
3. `registerRecipes(...)` 与 `registerRecipeCatalysts(...)` 分别注册配方与工作站

也就是说，JEI 这一侧并不会主动理解你的配方类型；它只是从 category 和 typed serializer 中读取已经准备好的信息。

这也是为什么 Recipe API 强调“展示数据应尽量由配方对象与类型对象自己提供”。

<a id="when-to-customize"></a>

## 什么时候需要自定义更多逻辑

基础场景下，`JeiCategory` 已经能帮你处理：

- 标题
- 图标
- 类型标识

你通常只需要额外自定义：

- 配方布局
- 交互控件
- 特殊渲染元素

如果你的配方是非常规布局，例如：

- 多页输入
- 结构类展示
- 动态状态切换

那么就需要在具体 category 中继续补 UI 逻辑。

<a id="tips"></a>

## 使用建议

- 先把配方类和 `TypedSerializer` 设计完整，再写 JEI 接入；这样 category 会轻很多。
- 如果 `getStations()` 为空，记得为 category 自定义图标，否则基类默认实现会抛异常。
- 标题默认依赖 `gui.<namespace>.<path>.title` 这一翻译键，命名时最好保持稳定。
- 当 JEI category 开始承担过多“配方业务逻辑”时，通常说明这些数据本该提前放进 `DisplayableRecipe` 或 `TypedSerializer`。

如果你还需要兼容 REI，可以继续参考 [REI 接入](rei.md#overview)。两边的设计思路是相近的，只是平台接口形式不同。
