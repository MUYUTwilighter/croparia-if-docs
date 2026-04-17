---
title: 配置系统
description: 介绍 Croparia IF 的配置对象 Config 与 ConfigFileHandler，重点说明配置值的职责划分、默认值策略与读写流程。
keywords:
  - Croparia IF
  - Config
  - ConfigFileHandler
  - 配置系统
  - 配置文件
  - 开发者文档
  - 1.1.0a
modVersions:
  - 1.1.0a
---

# 配置系统

<a id="overview"></a>

Croparia IF 的配置系统主要由两部分组成：

- `Config`
- `ConfigFileHandler`

它们的分工很明确：

- `Config` 负责表示“运行时配置对象”
- `ConfigFileHandler` 负责“从磁盘加载、保存、重载配置”

这意味着配置系统不是单纯的“把 JSON 直接映射成字段”，而是显式区分了：

- 原始文件格式
- 运行时对象语义
- 文件 IO 行为

<a id="config-object"></a>

## `Config`

`Config` 是运行时真正被模组逻辑使用的配置对象。它不只是字段容器，还承担了若干语义整理工作，例如：

- 把相对路径解析成游戏目录下的真实路径
- 为缺失字段补默认值
- 把 blacklist 拆成作物 ID 黑名单与模组黑名单两类结构
- 提供 `isCropValid(...)`、`isModValid(...)` 这类更贴近业务的判断入口

也就是说，`Config` 的重点不是“原样还原文件”，而是“整理出一个便于运行时使用的配置对象”。

<a id="raw-and-runtime"></a>

## 原始配置与运行时配置

从源码结构看，Croparia IF 有意把：

- `RawConfig`
- `Config`

拆成两层。

这背后的思路很值得开发时参考：

- 原始配置更接近文件结构
- 运行时配置更接近程序逻辑

这样一来，文件格式变化不会直接污染运行时代码，运行时又能放心依赖“已经整理好的字段”。

<a id="file-handler"></a>

## `ConfigFileHandler`

`ConfigFileHandler` 负责配置文件的读写与重载。

它主要提供：

- `load()`
- `save(Config)`
- `reload(Config)`

这里最值得注意的点是：

- `load()` 不只是读取，也会在配置不存在或失败时创建默认配置并立即保存
- `reload(Config)` 不是直接替换配置对象，而是把新值复制回现有 `Config`

这意味着：

- 其他系统可以持续持有同一个 `Config` 实例
- 重载时不必担心对象引用整体失效

<a id="paths"></a>

## 路径处理

`Config` 中的 `parsePath(...)` 与 `resolvePath(...)` 很实用，它们表达了一种很稳的路径策略：

- 文件中可以写相对路径
- 运行时统一解析到游戏目录
- 保存时尽量还原为相对路径

这类设计的好处是：

- 配置更适合迁移
- 用户不容易把机器相关的绝对路径写死在配置里

如果你以后在别的系统里也要处理“既支持相对路径又支持绝对路径”的配置，这一套思路很值得复用。

<a id="blacklist"></a>

## blacklist 的做法

`Config` 中的 blacklist 设计也很有代表性。文件层面它是一个字符串列表，但运行时会拆成：

- 作物 ID 黑名单
- 模组黑名单

而且模组黑名单进一步允许正则匹配。

这类设计说明一个很重要的实践：

- 文件结构可以相对简单
- 运行时结构可以更贴近业务判断

前提是中间必须有像 `Config` 这样的“语义整理层”。

<a id="when-to-use"></a>

## 什么时候该参考这套设计

如果你要做的不是“单纯读一个 JSON 对象”，而是：

- 需要默认值
- 需要路径解析
- 需要运行时重载
- 需要把文件字段整理成更适合程序使用的结构

那么 Croparia IF 的配置系统是一个很值得参考的模板。

<a id="tips"></a>

## 使用建议

- 不要让文件 IO 逻辑直接散落在业务代码里，优先像 `ConfigFileHandler` 这样集中处理。
- 不要让运行时逻辑直接依赖“原始 JSON 结构”，优先在 `Config` 里做一次语义整理。
- 如果系统需要热重载，尽量考虑“更新同一实例”而不是“替换整个对象引用”。
