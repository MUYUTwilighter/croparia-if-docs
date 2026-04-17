---
title: 可放置物品接口
description: 介绍 Croparia IF 中的 ItemPlaceable 接口，以及它如何统一“将物品以实体形式放置到世界中”的行为。
keywords:
  - Croparia IF
  - ItemPlaceable
  - ItemEntity
  - 放置物品
  - Dropper
  - Dispenser
  - ElementalPotion
  - Infusor
  - RitualStand
  - DropsCache
  - 开发者文档
  - 1.1.0a
modVersions:
  - 1.1.0a
---

# 可放置物品接口

<a id="overview"></a>

`ItemPlaceable` 是一个很小的接口，但它解决了一个很具体的问题：

- 某些方块需要把物品“放置到世界里”，而不是只是从容器里弹出一个普通掉落物

Croparia IF 用它来统一“如何把一个 `ItemStack` 转成世界中的 `ItemEntity`”这一行为，并把这件事接进了若干已有交互链里。

<a id="core-idea"></a>

## 核心思路

`ItemPlaceable` 只定义了一个默认方法：

- `placeItem(Level world, BlockPos pos, ItemStack stack, @Nullable Entity owner)`

它的行为大致是：

- 如果客户端侧，直接跳过
- 如果目标位置有红石信号，则一次性放出整个栈
- 否则只放出 1 个物品
- 生成对应的 `ItemEntity`
- 有 owner 时记录 thrower
- 把实体加入世界

这其实是在给“放置行为”一个统一约定，而不是让每个方块都自己重写一遍相似逻辑。

这里有一个很重要的边界：

- `ItemPlaceable` 不负责直接修改方块状态
- 它的职责只是把物品以受控方式放到指定方块上方
- 真正的后续效果，通常由方块自己的 `stepOn(...)`、`useItemOn(...)` 或其他交互逻辑继续完成

换句话说，`ItemPlaceable` 更像“把物品安全送入目标方块交互范围”的统一入口。

<a id="where-used"></a>

## 在哪里会用到

源码里比较典型的使用场景包括：

- [Infusor](../../general/blocks-and-items/workstations.md)
- [RitualStand](../../general/blocks-and-items/workstations.md)
- `ElementalPotion` 与某些目标方块交互时
- `DropperBlockMixin` 中对可放置方块的特殊处理

也就是说，`ItemPlaceable` 本质上是在表达：

- “这个方块支持被物品形式放置到世界中”

它比“纯掉落”多了一层语义，也比“完全手写每个方块的放置行为”更统一。

<a id="integration-chain"></a>

## 真实联动链

`ItemPlaceable` 在源码里已经和几条现成机制接起来了。

### `DropperBlockMixin`

`DropperBlockMixin` 会在投掷器尝试向前输出物品时检查前方方块：

- 如果目标方块实现了 `ItemPlaceable`
- 就不再走原版普通吐出逻辑
- 而是改为调用 `placeItem(...)`

这意味着：

- 你的方块只要实现了 `ItemPlaceable`
- 就可以直接接住投掷器输出
- 不需要再为投掷器单独写一套特殊处理

### `ElementalPotion`

`ElementalPotion` 为自己注册了发射器行为。

它的逻辑顺序是：

1. 如果目标是 `Infusor`，先尝试执行 `tryInfuse(...)`
2. 如果注魔失败，则回退到 `Infusor.placeItem(...)`
3. 如果目标实现了 `ItemPlaceable`，直接调用 `placeItem(...)`
4. 否则才回退到原版默认发射行为

这说明 `ItemPlaceable` 不只是给方块右键交互用的接口，它还被当成“这个方块可以接住被发射出来的物品”的能力标记。

### `Infusor` 与 `RitualStand`

`Infusor` 和 `RitualStand` 本身都实现了 `ItemPlaceable`，但真正的配方处理并不发生在 `placeItem(...)` 里。

它们的实际工作流更接近：

1. `useItemOn(...)`、投掷器或发射器把物品放到方块中心
2. 世界中生成 `ItemEntity`
3. 方块在 `stepOn(...)` 中感知到物品实体
4. 再结合 `DropsCache`、配方匹配或结构匹配执行后续逻辑

也就是说，`ItemPlaceable` 负责“把物品送到正确位置”，而不是直接负责“完成配方”。

<a id="with-mixins-and-apis"></a>

## 和其他 API / Mixin 的关系

目前源码里最明确的联动有：

- `DropperBlockMixin`
  - 把原版投掷器输出重定向到 `ItemPlaceable`
- `ElementalPotion`
  - 把发射器行为接到 `Infusor` 或其他 `ItemPlaceable` 方块
- `CifUtil.createItemEntity(...)`
  - 负责生成真正加入世界的 `ItemEntity`
- `DropsCache`
  - 在 `Infusor`、`RitualStand` 这类实现方块中缓存附近掉落物，用于后续配方判断

相对地，它和 [访问与修改方块属性](block-property.md#overview) 那条链并没有直接关系：

- `ItemPlaceable` 不依赖 `StateHolderMixin`
- 也不负责像 `StateHolderAccess` 那样读写方块状态属性

如果一个系统的重点是“把物品投放到世界并触发方块后续逻辑”，就看 `ItemPlaceable`；如果重点是“按字符串读写方块状态”，则应看 `StateHolderAccess` / `BlockProperties`。

<a id="when-to-use"></a>

## 什么时候该用

适合实现 `ItemPlaceable` 的场景：

- 某个方块需要接收被投放到自身位置的物品实体
- 你希望 `DropperBlockMixin` 或 `ElementalPotion` 这类现有逻辑能自动识别它
- 你的后续处理更适合写在 `stepOn(...)`、实体检测或配方匹配流程里
- 你想复用 Croparia IF 已有的红石驱动分支逻辑

如果你的方块根本不需要这种“由物品实体触发的放置语义”，那就没必要为了一致性强行实现它。

<a id="tips"></a>

## 使用建议

- 当多个方块都需要“接住被吐出的物品”时，优先考虑通过 `ItemPlaceable` 统一，而不是分别为右键、投掷器、发射器各写一套逻辑。
- 如果你要覆写默认实现，先确认调用方依赖的是“这个方块可被放置物品命中”这一语义，还是依赖当前的“红石时整组、否则单个”这一具体行为。
- 如果你的系统真正关心的是掉落物进入世界后的后续处理，建议把主逻辑放在方块自身的实体感知逻辑中，而把 `ItemPlaceable` 保持为轻量入口。
- 这个接口更像“世界交互约定”，而不是“直接放置方块状态”的工具方法；实现它时最好让读者和调用方都能明确看出这层语义。
