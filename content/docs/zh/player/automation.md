---
title: 自动化思路
description: 规划 Croparia IF 1.1.0a 的玩家自动化文档，整理温室、转化器、红石模式与空间约束。
keywords:
  - Croparia IF
  - 矿石魔种
  - 1.1.0a
  - 玩家
  - 自动化
  - 自动化示例
  - 温室
  - 植物盆栽
  - Botany Pots
  - 注魔台
  - 仪式台
  - 元素灌注
  - 元素仪式
  - 元素药水
  - 一阶魔种
  - 红石自动化
  - 物流
  - 管道
modVersions:
  - 1.1.0a
---

# 自动化示例

矿石魔种本身没有提供大规模的自动化器具（如管道、自动合成机器等），但是模组的一些核心方块对自动化接口做了兼容。此页面主要提供一些想法示例。

## 耕作

### 1. 温室

矿石魔种内置了一个可以收获单格作物以及瓜果作物的**温室**，放在作物上生效。

<div class="doc-center">
<GameItemCard id='croparia:greenhouse'></GameItemCard>
</div>

温室实现了物流交互，所以你可以用其他模组的管道来实现收集。

![温室的物流交互](/assets/greenhouse-transport.webp)

### 2. 植物盆栽

矿石魔种内置了对[植物盆栽](https://modrinth.com/mod/botany-pots)的兼容。

![植物盆栽](/assets/botany-pots.webp)

## 元素灌注与元素仪式

[注魔台](../general/blocks-and-items/workstations.md#croparia:infusor)与[仪式台](../general/blocks-and-items/workstations.md#croparia:ritual_stand)对一些红石器具和存储方块有着联动特性（详见[工作方块](../general/blocks-and-items/workstations.md)）。借助这些功能，注魔台本身可以实现批量灌注。

这里提供一个元素灌注的自动化示例：

<RowGallery>
<img src='/assets/infusor-auto-1.webp' alt="自动化元素灌注">
<img src='/assets/infusor-auto-1.webp' alt="自动化元素灌注 - 俯视图">
</RowGallery>

如图所示，注魔台旁边分别为发射器（装有[元素药水](../general/concepts/element.md#potion)，激活时会为注魔台填充元素）和投掷器（装有[一阶魔种](../general/blocks-and-items/croparia.md#croparia:croparia)，激活时会在注魔台上放置物品）；注魔台的下方是箱子
（注魔台会自动将输出物品与玻璃瓶输送到其下方的存储方块）。

为了简化模型，此处使用了模组[现代动力学](https://modrinth.com/mod/modern-dynamics)中的管道与过滤功能，实际上也可以通过漏斗过滤器来实现
物流传输。

设计的难点在于如何正确触发投掷器的次数。此处通过中继器的延迟实现触发两次投掷器。在一些整合包中，你可以使用一些其他模组里更方便的器具。
