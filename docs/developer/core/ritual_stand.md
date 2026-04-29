---
title: 仪式台
description: 介绍仪式台模块如何围绕掉落物、结构校验与 Ritual 配方组织运行流程，帮助开发者理解它与 DropsCache、结构容器和假玩家的配合。
keywords:
  - Croparia IF
  - 开发者文档
  - RitualStand
  - RitualContainer
  - RitualStructureContainer
  - DropsCache
  - FakePlayer
  - 1.1.1a
---

# 仪式台

<a id="overview"></a>

仪式台和注魔台一样，也是掉落物驱动的模块；但它更复杂，因为它不只关心“掉下来了什么物品”，还关心：

- 当前仪式台方块状态
- 周围结构是否匹配
- 对应结构下是否存在合法仪式配方

所以如果说注魔台是“状态 + 掉落物配方”，那么仪式台更接近“状态 + 结构 + 掉落物配方”。

<a id="module-role"></a>

## 模块职责

它的核心职责是：

- 接收被投放到仪式台上的物品
- 校验周围仪式结构
- 结合结构结果与掉落物匹配 `RitualRecipe`
- 成功时导出产物并给玩家反馈

因此这个模块的重点不是库存或 UI，而是“匹配上下文的组织方式”。

<a id="core-classes"></a>

## 核心类

- `RitualStand`
  - 方块本体，同时实现 `ItemPlaceable`
- `RitualStructureContainer`
  - 结构配方匹配时的容器
- `RitualContainer`
  - 仪式配方匹配时的容器
- `DropsCache`
  - 汇总当前参与仪式的掉落物
- `FakePlayer`
  - 在特殊产物需要进一步使用时模拟玩家行为

这里同样没有单独的方块实体，因为运行时核心状态不在持久库存里，而在“当前世界环境 + 当前掉落物 + 当前结构”里。

<a id="entry-flow"></a>

## 入口流程

玩家手持物品右键仪式台时，`RitualStand.useItemOn(...)` 会：

- 屏蔽配方生成器的直接投放
- 对主手物品调用 `placeItem(...)`

和 [注魔台](infusor.md#item-placeable) 一样，这一层只负责把物品放到世界里。

真正的仪式逻辑发生在 `stepOn(...)`：

1. 只在服务端执行
2. 检查功能配置是否启用
3. 通过 `DropsCache.isQueried(...)` 做节流
4. 开始结构与配方匹配

其中 `CRAFT_INTERVAL` 的存在说明这个模块默认就假设：

- 同一位置的掉落物会在短时间内反复触发碰撞
- 必须做节流，避免一套输入被连续处理多次

<a id="matching-flow"></a>

## 匹配流程

这部分是整个模块最值得理解的地方。

### 第一步：结构匹配

源码首先执行：

- `Recipes.RITUAL_STRUCTURE.find(new RitualStructureContainer(level.getBlockState(pos)), level)`

也就是说，结构匹配先只看当前仪式台状态和周围世界环境。

如果找到了结构定义，还会继续执行：

- `structure.validate(pos, level)`

这一步才真正判断当前位置是否满足该结构。

### 第二步：仪式配方匹配

只有结构验证成功后，源码才会构造：

- `RitualContainer.of(level.getBlockState(pos), DropsCache.queryStacks(world, pos), matched)`

然后再走：

- `Recipes.RITUAL.find(matcher, level)`

这说明 `RitualRecipe` 的匹配上下文至少包含三类信息：

- 当前仪式台方块状态
- 当前掉落物集合
- 已经匹配成功的结构结果

这也是仪式台比注魔台更复杂的根本原因。

<a id="result-flow"></a>

## 产物处理

仪式成功后，默认流程是：

1. `ritual.assemble(...)` 生成结果
2. 用 `CifUtil.exportItem(...)` 把结果送出
3. 播放仪式完成音效

不过这里还有一条特殊分支：

- 如果结果物品是 `SpawnEggItem`
- 就会走 [FakePlayer](fake-player.md#overview) 的 `useAllItemsOn(...)`

这意味着某些仪式结果不是“简单掉出一个物品”就结束，而是会进一步触发一次“像玩家一样使用这个物品”的流程。

所以开发时如果你要理解为什么某些仪式结果会表现得更像“执行动作”而不是“生成掉落”，就应该先看这条分支。

<a id="feedback"></a>

## 玩家反馈

`RitualStand` 在失败路径上也做了比较完整的用户反馈：

- 结构不存在
  - `overlay.croparia.ritual.404`
- 结构不合法
  - `overlay.croparia.ritual.bad`
- 结构合法但没有匹配到仪式
  - `overlay.croparia.ritual.rejected`

这些提示通过 `tryTell(...)` 发送给掉落物拥有者附近的玩家。

从模块设计上看，这很值得注意，因为它说明：

- 仪式台把“为什么失败”也视为模块行为的一部分
- 不是所有模块都只关注成功路径

<a id="drops-cache"></a>

## 为什么同样依赖 `DropsCache`

`RitualStand` 和注魔台一样都用到了 `DropsCache`，但作用更重。

在这里，`DropsCache` 不只是为了避免重复读取掉落物，而是为了让“本次仪式的输入集合”稳定下来。否则你很难在结构匹配之后，再对一组掉落物做确定性的仪式匹配。

如果你要做任何“掉落物 + 世界结构”驱动的系统，这一层缓存和节流几乎都是必要的。

<a id="extension"></a>

## 扩展建议

- 如果你要扩展仪式逻辑，优先区分你要动的是“结构匹配”还是“配方匹配”。
- 如果你要新增特殊产物行为，先看 `SpawnEggItem` 这条已有的特殊分支是否能抽象成更通用的处理层。
- 如果你要做类似模块，建议先保留“结构校验”和“配方匹配”两阶段分离，不要把它们揉成一次判断。
- 如果你要排查某个仪式为什么不生效，先按这条顺序看：结构是否存在、结构是否验证成功、掉落物是否进入 `DropsCache`、配方是否匹配成功。

