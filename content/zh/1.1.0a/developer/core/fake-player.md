---
title: FakePlayer
desc: 介绍 Croparia IF 中的 FakePlayer 如何以服务端伪玩家身份执行物品使用逻辑，以及它在仪式台等模块中的用途与边界。
keywords:
  - Croparia IF
  - 开发者文档
  - FakePlayer
  - RitualStand
  - SpawnEggItem
  - useAllItemsOn
  - 1.1.0a
---

# FakePlayer

<a id="overview"></a>

`FakePlayer` 是 Croparia IF 在 `core` 里提供的一个很小但很实用的执行部件。

它解决的问题不是“伪造一个完整玩家实体”，而是更具体的这件事：

- 当某个核心模块需要像玩家一样去对方块使用一个物品时，应该如何在服务端安全地执行这一步

当前最典型的使用点在 [仪式台](ritual_stand.md#result-flow)，所以它放在 `core` 里比放到纯工具页更合适。

<a id="core-idea"></a>

## 核心思路

`FakePlayer` 继承自 `Player`，但它的目标不是参与正常游戏流程，而是提供一组静态入口：

- `getPlayer(...)`
- `useItemOn(...)`
- `finishUseItem(...)`
- `useAllItemsOn(...)`

可以把它理解成：

- 一个按维度缓存的伪玩家实例
- 外加一套“帮模块模拟玩家使用物品”的工具入口

这里最关键的一点是，它模拟的是“玩家使用物品”的语义，而不是“简单生成掉落”或“直接调用某个方块内部方法”。

<a id="usage-flow"></a>

## 使用流程

### `getPlayer(ServerLevel)`

按维度取得一个缓存的伪玩家实例。

源码里用 `Map<ServerLevel, FakePlayer>` 做缓存，这意味着：

- 同一个维度会复用同一个伪玩家
- 不需要每次使用都临时创建新实例

### `useItemOn(ServerLevel, BlockPos, ItemStack)`

把伪玩家传送到目标方块上方，然后：

- 把物品放到主手
- 构造 `UseOnContext`
- 调用 `item.useOn(context)`

这一步模拟的正是“玩家对方块使用物品”。

### `finishUseItem(ItemStack, ServerLevel)`

调用 `item.finishUsingItem(world, fakePlayer)`，拿到使用后的余留物。

这一步很重要，因为有些物品的使用不是只靠 `useOn(...)` 就能完整表达，结束使用后的余留物和后处理也同样是行为的一部分。

### `useAllItemsOn(...)`

这是最常用的高层入口。

它会：

1. 最多尝试 `MAX_USES` 次
2. 反复调用 `useItemOn(...)`
3. 如果结果不是 `FAIL` / `PASS`
4. 就继续执行 `finishUseItem(...)`
5. 收集所有余留物并返回

因此它不是“用一次物品”，而是“尽可能把这个栈当成可连续使用物来消耗完”。

<a id="ritual-stand"></a>

## 在仪式台里的作用

仪式台在处理仪式结果时有一条特殊分支：

- 如果结果物品是 `SpawnEggItem`
- 就不直接把这个蛋作为普通掉落导出
- 而是调用 `FakePlayer.useAllItemsOn(...)`

这意味着仪式结果在这里被视作一种“应该真正执行其世界交互行为”的物品，而不是单纯的物品产出。

对开发者来说，这件事非常重要，因为它改变了你理解仪式结果的方式：

- 有些结果是“生成一个东西”
- 有些结果是“执行一次像玩家使用该物品那样的动作”

`FakePlayer` 正是把第二类结果接进原版交互链的桥。

<a id="behavior-boundaries"></a>

## 行为边界

`FakePlayer` 不是完整玩家替身，源码里对它的角色限制得很明确：

- `isSpectator()` 固定返回 `false`
- `isCreative()` 固定返回 `false`
- `gameMode()` 固定返回 `SURVIVAL`

这说明它的目标不是模拟各种玩家模式，而是尽量稳定地走“正常生存模式玩家使用物品”的那条逻辑。

同样地，它的命中方式也固定为：

- 从目标方块上方
- 以 `Direction.UP`
- 对该方块执行 `useOn`

所以如果你期待它模拟复杂视角、不同交互面或完整输入设备行为，这就超出它的设计目标了。

<a id="when-to-use"></a>

## 什么时候该用

适合使用 `FakePlayer` 的场景：

- 你的模块需要真正触发“玩家对方块使用某个物品”这条原版逻辑
- 你需要拿到物品使用后的余留物
- 你希望复用现有物品行为，而不是重写一遍专门逻辑

不太适合使用它的场景：

- 你只是想简单生成一个掉落物
- 你只是想直接调用某个模块自己的内部处理方法
- 你需要模拟非常具体的玩家输入细节或多面交互

<a id="tips"></a>

## 使用建议

- 如果模块真正关心的是“像玩家一样使用物品会发生什么”，优先考虑 `FakePlayer`，而不是手写近似逻辑。
- 如果你只需要最终产物，不一定非要走 `FakePlayer`；它更适合有真实使用语义的物品。
- 当你把 `FakePlayer` 接进某个核心模块时，最好像仪式台一样，把它当作特殊分支处理，而不是默认路径。
- 如果你后续要扩展更多“行为型结果物”，可以先围绕 `useAllItemsOn(...)` 这一层抽象，而不是直接在模块里重复写 `useOn + finishUsingItem`。

