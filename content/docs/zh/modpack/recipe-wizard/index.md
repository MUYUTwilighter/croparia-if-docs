---
title: 配方生成器
description: 介绍 Croparia IF 1.1.1a 中 Recipe Wizard 的基础用途，包括游戏内配方生成与潜行调试功能。
keywords:
  - Croparia IF
  - 1.1.1a
  - 整合包
  - 配方生成器
  - Recipe Wizard
  - 注魔台
  - 元素石
  - 仪式台
modVersions:
  - 1.1.1a
---

# 配方生成器

配方生成器是 Croparia IF 为了方便整合包作者在游戏中快速创建配方或其他数据文件而添加的一个物品道具。同时，它还有一些调试功能。

## 使用：生成配方

对着一个目标方块右键，即可触发一次配方生成。如果缺失参数，会弹出对应提示。

目前支持的方块与参数提供方式：

- [注魔台](../../general/blocks-and-items/workstations.md#croparia:infusor)：元素灌注
  - 注魔台放置的物品：输入物品
  - 副手手持物品：输出物品
  - 注魔台的元素灌注状态：元素种类
- [元素石](../../general/blocks-and-items/workstations.md#croparia:elemental_stone)：元素浸润
  - 元素石上方的注魔台元素灌注状态：元素种类
  - 元素石周围的方块：输入方块
  - 元素石下方的方块：输出方块
- [仪式台](../../general/blocks-and-items/workstations.md#croparia:ritual_stand)：元素仪式
  - 仪式结构的输入方块位置的方块：输入方块
  - 仪式台上的物品：输入物品
  - 副手手持物品：输出物品

**注**：配方生成器可以自定义生成行为，详见[创建自定义配方生成器](custom-usage.md)

## 使用：调试功能

潜行时手持配方生成器右键目标方块可以触发一些特殊行为。

- [注魔台](../../general/blocks-and-items/workstations.md#croparia:infusor)：切换注魔台的元素灌注状态
- [元素石](../../general/blocks-and-items/workstations.md#croparia:elemental_stone)：在元素石的上方生成一个[注魔台](../../general/blocks-and-items/workstations.md#croparia:infusor)
- [仪式台](../../general/blocks-and-items/workstations.md#croparia:ritual_stand)：以仪式台为中心，生成对应的仪式结构
