---
title: 开发者文档
description: 面向下游开发者的 Croparia IF 1.1.0a 文档入口，规划架构、注册、数据模型与 API 等页面。
keywords:
  - Croparia IF
  - 开发者
  - API
  - 核心模块
  - Repo API
  - Generator API
  - Recipe API
  - Codec API
  - Network API
  - 1.1.0a
modVersions:
  - 1.1.0a
---

# 开发者文档

<a id="overview"></a>

这一组文档面向的是想继续开发、兼容或维护 `Croparia IF` 的读者。

这里不会把所有源码都逐页翻译成说明书，而是优先覆盖那些真正对下游开发者有用的部分：

- 核心模块是怎么组织和协作的
- 哪些通用 API 值得直接复用
- 哪些内容更适合当“模组自身实现参考”，而不是公开扩展面

<a id="how-to-read"></a>

## 建议从哪里开始

如果你第一次读这一组文档，最推荐的起点通常有三个：

- [核心模块](core/index.md#overview)
  - 先理解 `Infusor`、`Ritual Stand`、`Crop Transmuter`、`Greenhouse` 这几类核心功能是怎么跑起来的
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
- [Crop Transmuter](core/crop-transmuter.md#overview)
- [Greenhouse](core/greenhouse.md#overview)
- [Infusor](core/infusor.md#overview)
- [Ritual Stand](core/ritual_stand.md#overview)
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

这类页面的定位会更收敛一些。比如 `crop` 这一页重点不是讲一套公开作物 API，而是帮助开发者理解：

- Croparia IF 自己是怎么添加内置 `Crop` / `Melon` 内容的
- 如果你要继续维护模组自带内容，应该先改哪里

<a id="scope"></a>

## 这一组文档的边界

开发者文档里的专题并不完全等价于“模组里所有重要系统”。

这里的取舍标准更偏向：

- 这个部分是否真的提供了值得理解和复用的能力
- 读完之后，开发者是否能明确知道自己可以接什么、改什么、扩什么

所以有些在模组内部很重要的概念，不一定会单独扩成完整开发者专题；如果它目前更像某个核心模块的内部依赖，通常会直接并入对应模块页里说明。

<a id="next"></a>

## 下一步建议

- 如果你要理解“模组整体是怎么跑起来的”，先读 [核心模块](core/index.md#overview)
- 如果你要接库存、自动化或平台物品能力，先读 [Repo API](repo/index.md#overview)
- 如果你要接运行时数据生成，先读 [数据生成系统](generator/index.md#overview)
- 如果你要排查界面交互或客户端同步，先读 [网络 API](network.md#overview)
