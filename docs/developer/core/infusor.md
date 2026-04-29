---
title: 注魔台
description: 介绍注魔台模块的方块状态、元素灌注、掉落物配方与 ItemPlaceable 联动，帮助开发者理解它的完整工作流。
keywords:
  - Croparia IF
  - 开发者文档
  - Infusor
  - ElementalPotion
  - InfusorRecipe
  - DropsCache
  - ItemPlaceable
  - 1.1.1a
---

# 注魔台

<a id="overview"></a>

注魔台是 Croparia IF 里最典型的“方块状态驱动 + 掉落物配方”模块。

它比温室更强调配方处理，比作物嬗变仪更少依赖 GUI，但它非常适合帮助开发者理解：

- 一个方块状态如何参与配方匹配
- 掉落物为什么要和 `DropsCache` 结合
- `ItemPlaceable` 在实际模块里是怎么发挥作用的

<a id="module-role"></a>

## 模块职责

注魔台的职责可以拆成两层：

- 通过元素药水把自身切换到某个元素状态
- 在有元素状态时，把掉到方块上的物品作为输入去匹配 `InfusorRecipe`

也就是说，注魔台不是“固定方块 + 固定配方”的关系，而是：

- 方块状态决定当前元素
- 当前元素再参与后续配方匹配

<a id="core-classes"></a>

## 核心类

- `Infusor`
  - 方块本体，同时实现了 `ItemPlaceable`
- `ElementalPotion`
  - 可直接对 `Infusor` 执行灌注或退灌注交互
- `InfusorRecipe`
  - 真正的配方类型
- `InfusorContainer`
  - 配方匹配时使用的上下文容器
- `DropsCache`
  - 负责从方块附近收集与缓存掉落物

这一组没有单独的方块实体，因为它的运行状态足够简单，直接放在方块状态里就能表达。

<a id="block-state"></a>

## 方块状态

注魔台最核心的状态字段是：

- `ELEMENT`

它是一个 `EnumProperty<Element>`，默认值是 `Element.EMPTY`。

这意味着：

- 当方块处于 `EMPTY` 状态时，它本身不会参与实际灌注配方
- 当方块有具体元素时，掉到上面的物品才会进入配方匹配流程

如果你要理解这个模块，最先要接受的一点是：

- 注魔台的“配方条件”不只来自输入物，还来自方块自身的当前状态

<a id="player-flow"></a>

## 玩家交互流程

`useItemOn(...)` 里基本覆盖了这个模块最主要的三种玩家交互。

### 元素灌注

如果玩家手里拿的是 `ElementalPotion`，`Infusor` 会优先尝试 `tryInfuse(...)`。

成功时会：

- 把方块状态切成对应元素
- 播放灌注音效
- 消耗药水
- 返还空瓶或余留物

### 退灌注

如果方块当前已经有元素，且玩家手中的物品与该元素药水的 `crafting remainder` 匹配，就会走 `tryDefuse(...)`。

成功时会：

- 把方块状态恢复到 `Element.EMPTY`
- 消耗对应物品
- 返回该元素药水

### 投放物品

如果既不是配方生成器，也不是上述两种元素交互，就会调用 `placeItem(...)` 把物品投到方块中心。

这一点很重要，因为它直接把注魔台接到了 [ItemPlaceable](../other/item-placeable.md#integration-chain) 那条统一的物品投放链上。

<a id="recipe-flow"></a>

## 配方处理流程

真正的配方处理不在 `useItemOn(...)` 中，而在 `stepOn(...)`。

当有 `ItemEntity` 踩到方块上时，`Infusor.stepOn(...)` 会：

1. 检查当前是不是服务端
2. 检查功能配置是否启用
3. 读取方块当前元素
4. 把掉落物和元素一起送进 `tryCraft(...)`

`tryCraft(...)` 再做后续工作：

1. 使用 `DropsCache.queryStacks(...)` 收集附近掉落物
2. 构造 `InfusorContainer`
3. 通过 `Recipes.INFUSOR.find(...)` 查找匹配配方
4. 命中后执行 `onCrafting(...)`

`onCrafting(...)` 会：

- 组装配方结果
- 用 `CifUtil.exportItem(...)` 导出结果
- 把方块状态重置为默认状态
- 播放制作音效

这套流程的关键点在于：

- 玩家和发射器只负责把物品送进来
- 真正的配方匹配由掉落物进入世界后的状态触发

<a id="drops-cache"></a>

## 为什么依赖 `DropsCache`

如果只看表面，你可能会觉得注魔台似乎只需要读取当前踩到方块上的那个 `ItemEntity`。但源码没有这么做，而是通过 `DropsCache` 汇总附近掉落物。

原因很直接：

- 灌注配方的输入可能不只一个掉落物
- 同一 tick 内可能会有多个掉落物一起参与匹配
- 如果每个实体各自独立判断，容易重复匹配或丢失上下文

因此 `DropsCache` 在这里扮演的是“把世界中的掉落物临时整理成一次配方匹配所需输入”的角色。

<a id="item-placeable"></a>

## 和 `ItemPlaceable` 的关系

注魔台实现 `ItemPlaceable` 的意义，不是为了少写几行生成 `ItemEntity` 的代码，而是为了接入整套现成交互链：

- 玩家右键时可以直接把物品投到方块上
- `ElementalPotion` 的发射器行为在无法灌注时会回退到 `Infusor.placeItem(...)`
- `DropperBlockMixin` 也可以把投掷器输出重定向到它

这意味着注魔台的入口是统一的：

- 无论物品来自玩家、投掷器还是发射器
- 最后都会转成“一个掉到方块上的 `ItemEntity`”
- 然后再由 `stepOn(...)` 和配方层统一处理

这正是 `ItemPlaceable` 最有价值的用法之一。

<a id="extension"></a>

## 扩展建议

- 如果你要改元素切换行为，优先看 `tryInfuse(...)` 和 `tryDefuse(...)`。
- 如果你要改配方匹配语义，优先看 `InfusorContainer` 与 `InfusorRecipe`，而不是先动玩家交互层。
- 如果你要研究“掉落物驱动的配方机器”应该怎么写，这个模块是比仪式台更容易上手的入口。
- 如果你想兼容新的投放方式，优先保持 `ItemPlaceable -> ItemEntity -> stepOn(...)` 这条主链不变。

