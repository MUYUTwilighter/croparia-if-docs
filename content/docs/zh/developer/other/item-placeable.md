---
title: 可放置物品接口
description: 介绍 Croparia IF 中的 ItemPlaceable 接口，以及它如何统一“将物品以实体形式放置到世界中”的行为。
keywords:
  - Croparia IF
  - ItemPlaceable
  - ItemEntity
  - 放置物品
  - Dropper
  - 开发者文档
  - 1.1.0a
modVersions:
  - 1.1.0a
---

# 可放置物品接口

<a id="overview"></a>

`ItemPlaceable` 是一个很小的接口，但它解决了一个很具体的问题：

- 某些方块需要把物品“放置到世界里”，而不是只是从容器里弹出一个普通掉落物

Croparia IF 用它来统一“如何把一个 `ItemStack` 转成世界中的 `ItemEntity`”这一行为。

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

<a id="where-used"></a>

## 在哪里会用到

源码里比较典型的使用场景包括：

- `Infusor`
- `RitualStand`
- `ElementalPotion` 与某些目标方块交互时
- `DropperBlockMixin` 中对可放置方块的特殊处理

也就是说，`ItemPlaceable` 本质上是在表达：

- “这个方块支持被物品形式放置到世界中”

它比“纯掉落”多了一层语义，也比“完全手写每个方块的放置行为”更统一。

<a id="when-to-use"></a>

## 什么时候该用

适合实现 `ItemPlaceable` 的场景：

- 某个方块需要参与“物品实体被放出后触发的放置行为”
- 你希望 dropper 或类似系统对它做统一处理
- 你想复用 Croparia IF 已有的红石驱动分支逻辑

如果你的方块根本不需要这种“由物品实体触发的放置语义”，那就没必要为了一致性强行实现它。

<a id="tips"></a>

## 使用建议

- 当多个方块的“放出物品到世界”逻辑相似时，优先考虑通过 `ItemPlaceable` 统一，而不是逐个复制。
- 如果你要修改默认行为，先确认调用方真正依赖的是“接口标记”还是“默认实现细节”。
- 这个接口更像“世界交互约定”，而不是纯工具方法集合；因此是否实现它，本身就应该携带明确语义。
