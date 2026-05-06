---
title: 开发者
desc: 面向下游开发者的 Croparia IF 1.1.0a 文档入口，汇总核心模块、通用 API 与内容维护参考。
keywords:
  - Croparia IF
  - 开发者
  - API
  - 核心模块
  - Repo API
  - 数据生成系统
  - Recipe API
  - Codec API
  - 网络 API
  - 1.1.0a
navOrder: 40
---

# 开发者文档

<a id="overview"></a>

这一组文档面向想继续开发、兼容或维护 `Croparia IF` 的读者。

你通常会在三种场景下用到这里的内容：

- 想看某个核心模块是怎么跑起来的
- 想复用模组已经整理好的通用 API
- 想继续维护模组自带内容，例如内置作物

<a id="how-to-read"></a>

## 建议从哪里开始

如果你第一次读这一组文档，最推荐的起点通常有三个：

- [核心模块](core/index.md#overview)
  - 先理解注魔台、仪式台、作物嬗变仪、温室这几类核心功能是怎么跑起来的
- [网络 API](network.md#overview)
  - 适合想看菜单交互、配方同步和包注册抽象的读者
- [Repo API](repo/index.md#overview)
  - 适合想看库存、自动化输入输出和平台能力桥接的读者

如果你更偏向“我已经知道模块做什么，现在只想看通用工具怎么用”，那就可以直接从下面这些专题里挑：

- [数据生成系统](generator/index.md#overview)
- [Recipe API](recipe/index.md#overview)
- [Codec API](codec/index.md#overview)
- [其他常用 API](other/index.md#overview)

<a id="sections"></a>

## 当前专题

### 核心模块

- [核心模块总览](core/index.md#overview)
- [作物嬗变仪](core/crop-transmuter.md#overview)
- [温室](core/greenhouse.md#overview)
- [注魔台](core/infusor.md#overview)
- [仪式台](core/ritual_stand.md#overview)
- [FakePlayer](core/fake-player.md#overview)

这一组更适合回答：

- 一个具体模块的入口类在哪里
- 它和菜单、网络、配方、库存分别怎么接
- 如果我要改行为，第一步该看哪一层

### 通用 API

- [Repo API](repo/index.md#overview)
- [数据生成系统](generator/index.md#overview)
- [Recipe API](recipe/index.md#overview)
- [Codec API](codec/index.md#overview)
- [网络 API](network.md#overview)
- [其他常用 API](other/index.md#overview)

这一组更适合回答：

- 模组已经抽象出了哪些可复用能力
- 我应该复用哪层接口，而不是直接复制某个模块实现

### 内容维护参考

- [添加内置作物](crop.md#overview)

这类页面更适合回答维护问题。比如 `crop` 这一页重点是帮助你理解：

- Croparia IF 自己是怎么添加内置 `Crop` / `Melon` 内容的
- 如果你要继续维护模组自带内容，应该先改哪里

<a id="next"></a>

## 下一步建议

- 如果你要理解“模组整体是怎么跑起来的”，先读 [核心模块](core/index.md#overview)
- 如果你要接库存、自动化或平台物品能力，先读 [Repo API](repo/index.md#overview)
- 如果你要接运行时数据生成，先读 [数据生成系统](generator/index.md#overview)
- 如果你要排查界面交互或客户端同步，先读 [网络 API](network.md#overview)
