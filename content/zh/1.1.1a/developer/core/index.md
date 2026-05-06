---
title: 核心模块
desc: 面向下游开发者介绍 Croparia IF 的核心功能模块，包括注魔台、仪式台、作物嬗变仪与温室的职责、数据流和扩展切入点。
keywords:
  - Croparia IF
  - 开发者文档
  - 核心模块
  - Infusor
  - RitualStand
  - CropTransmuter
  - Greenhouse
  - 1.1.1a
navOrder: 10
---

# 核心模块

<a id="overview"></a>

这一组页面关注的不是“通用 API 怎么设计”，而是 Croparia IF 几个核心功能模块在代码中是怎么跑起来的。

如果你已经大致了解了：

- [Repo API](../repo/index.md#overview)
- [Recipe API](../recipe/index.md#overview)
- [Network API](../network.md#overview)

那么这里更适合回答这些问题：

- 一个具体模块的主入口类在哪里
- 方块、方块实体、菜单、屏幕、配方和网络是怎么串起来的
- 我想修改行为或做兼容时，第一步该看哪一层

<a id="modules"></a>

## 当前覆盖的模块

- [作物嬗变仪](crop-transmuter.md#overview)
  - 一个带方块实体、菜单、界面和 `C2S` 交互的完整模块
- [温室](greenhouse.md#overview)
  - 一个更偏“自动处理与存储”的模块
- [注魔台](infusor.md#overview)
  - 一个典型的“方块状态 + 掉落物配方”模块
- [仪式台](ritual_stand.md#overview)
  - 一个更依赖结构校验与配方匹配的掉落物驱动模块
- [FakePlayer](fake-player.md#overview)
  - 一个服务于核心模块世界交互的执行部件

<a id="how-to-read"></a>

## 建议阅读顺序

- 如果你想看“GUI、菜单与网络如何配合”，先读 [作物嬗变仪](crop-transmuter.md#overview)
- 如果你想看“掉落物驱动配方是怎么做的”，先读 [注魔台](infusor.md#overview) 和 [仪式台](ritual_stand.md#overview)
- 如果你想看“方块实体如何对接自动化与库存”，先读 [温室](greenhouse.md#overview)

<a id="common-patterns"></a>

## 这一组模块里的共通模式

虽然四个模块功能差异很大，但它们在实现上有几条很一致的思路：

- 交互入口尽量放在方块本体
- 持久状态尽量放在方块实体
- 通用能力通过独立 API 提供，而不是揉进单个模块
- 复杂流程拆成“入口层、状态层、匹配层、输出层”

所以读这些页面时，最值得注意的不是单个方法名，而是：

- 每个模块把职责切在哪一层
- 它为什么要依赖某个通用 API
- 当你要扩展它时，应该插手哪一层而不是哪一个具体按钮或回调

