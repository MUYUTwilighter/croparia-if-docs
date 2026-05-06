---
title: REI 接入
desc: 介绍 Croparia IF Recipe API 如何接入 Roughly Enough Items，包括 ReiCategory、ReiDisplay 与 TypedSerializer 的协作方式。
keywords:
  - Croparia IF
  - Recipe API
  - REI
  - Roughly Enough Items
  - ReiCategory
  - ReiDisplay
  - TypedSerializer
  - DisplayableRecipe
  - 开发者文档
  - 1.1.0a
navOrder: 30
---

# REI 接入

<a id="overview"></a>

Croparia IF 对 REI 的接入思路和 JEI 十分接近：依旧是让 Recipe API 提供统一配方抽象，再由兼容层把这些信息映射到 REI 的类别与显示系统。

不同点在于，REI 侧会显式引入一个 `ReiDisplay<R>` 作为“配方展示对象”。

<a id="mental-model"></a>

## 心智模型

REI 侧最重要的几个对象是：

- `ReiClient`
  - REI 客户端插件入口
- `ReiCategory<R>`
  - 配方类别
- `ReiDisplay<R>`
  - 具体展示对象
- `TypedSerializer<R>`
  - 提供类型信息、工作站和配方查询

可以把它理解为：

- `DisplayableRecipe` 提供基础展示数据
- `TypedSerializer` 提供类型与查询入口
- `ReiCategory` 描述“这一类配方怎么显示”
- `ReiDisplay` 把具体配方实例包装成 REI 可消费的 display 对象

<a id="rei-category"></a>

## `ReiCategory`

Croparia IF 的 `ReiCategory<R>` 基类实现了 `DisplayCategory<ReiDisplay<R>>`，并已经替你处理：

- 用 `TypedSerializer.getId()` 生成 `CategoryIdentifier`
- 默认标题翻译
- 默认图标获取
- 根据 `TypedSerializer.getStations()` 构造工作站入口

因此，大多数具体类别只需要：

1. 继承 `ReiCategory<R>`
2. 返回自己的 `TypedSerializer<R>`
3. 编写布局与绘制逻辑

如果你的工作站列表为空，和 JEI 一样，默认图标逻辑就不够用了，需要自行覆盖。

<a id="rei-display"></a>

## `ReiDisplay`

与 JEI 不同，REI 这边会把每条配方包装成一个 `ReiDisplay<R>`。

它的作用主要是：

- 持有具体配方实例或 `RecipeHolder`
- 关联所属 `ReiCategory`
- 向 REI 暴露类别标识与展示内容

也就是说，`ReiCategory` 更像“这一类怎么画”，而 `ReiDisplay` 更像“这条配方的展示载体”。

这层拆分让 REI 侧在显示对象管理上更清晰，也更贴合它自己的 API 形态。

<a id="typed-serializer"></a>

## `TypedSerializer` 在 REI 中的作用

和 JEI 一样，REI 侧也高度依赖 `TypedSerializer`。它主要提供：

- 类别 ID
- 工作站列表
- 当前配方类型的全部 `RecipeHolder`

尤其在注册 display 时，`ReiClient` 会直接调用：

- `category.getRecipeType().findHolders()`

再把每个 holder 包装成 `ReiDisplay<R>`。

所以如果 `TypedSerializer` 没有正确配置好类型或工作站，REI 接入通常也会一起出问题。

<a id="registration"></a>

## 注册流程

Croparia IF 的 REI 注册流程可以概括成：

1. 在 `ReiClient` 中维护 `ReiCategory<?>` 列表
2. `registerCategories(...)` 注册类别与工作站
3. `registerDisplays(...)` 为每个类别批量注册 display

和 JEI 相比，REI 多了一层 display 包装，但整体设计仍然是“从 `TypedSerializer` 出发，把运行时配方批量映射到展示系统”。

<a id="jei-vs-rei"></a>

## 与 JEI 的区别

如果你已经读过 [JEI 接入](jei.md#overview)，那么 REI 这边最值得记住的区别是：

- JEI 更直接围绕 category 和 recipe 类型工作
- REI 更显式地引入了 display 对象

但在 Croparia IF 的设计里，两边仍然共用了同一套核心数据来源：

- `DisplayableRecipe`
- `TypedSerializer`
- 预设输入输出类型

这意味着大部分“配方本身”的设计不需要为 JEI 与 REI 分开维护。

<a id="tips"></a>

## 使用建议

- 优先把类型信息和工作站信息放在 `TypedSerializer` 中，而不是散落在各个 REI 类里。
- 先确保 `findHolders()` 能正确拿到运行时配方，再去排查 display 或布局问题。
- 如果 JEI 与 REI 接入开始出现大量不一致，通常应该回头检查 `DisplayableRecipe` 的展示数据是否统一，而不是分别在兼容层打补丁。
- 当一个配方类型的 UI 很复杂时，可以接受 JEI category 与 REI category 分别写布局，但尽量不要让它们各自维护不同的数据模型。

