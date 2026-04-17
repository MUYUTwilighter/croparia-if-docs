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

`Config` 是运行时真正被模组逻辑使用的配置对象。开发者通常不会直接围绕原始文件结构写逻辑，而是依赖这个已经整理好的运行时对象。

它主要负责：

- 把相对路径解析成游戏目录下的真实路径
- 为缺失字段补默认值
- 把 blacklist 拆成作物 ID 黑名单与模组黑名单两类结构
- 提供 `isCropValid(...)`、`isModValid(...)` 这类更贴近业务的判断入口

如果你只是想“读取配置并在业务代码中判断是否启用某功能”，那你真正应该依赖的是 `Config`，而不是原始文件对象。

<a id="raw-and-runtime"></a>

## 原始配置与运行时配置

从源码结构看，Croparia IF 有意把：

- `RawConfig`
- `Config`

拆成两层。

这两层各自对应不同职责：

- `RawConfig` 更接近文件结构，方便解码与保存
- `Config` 更接近程序逻辑，方便运行时直接使用

对开发者来说，可以把这一层拆分理解成：“先读文件，再整理成可直接使用的配置对象”。

<a id="file-handler"></a>

## `ConfigFileHandler`

`ConfigFileHandler` 负责配置文件的读写与重载。

它主要提供：

- `load()`
- `save(Config)`
- `reload(Config)`

这里最值得开发时留意的点是：

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

这套路径处理的直接好处是：

- 配置更适合迁移
- 用户不容易把机器相关的绝对路径写死在配置里

如果你在别的系统里也要同时支持相对路径与绝对路径，这一段实现很值得参考。

<a id="blacklist"></a>

## blacklist 的做法

`Config` 中的 blacklist 设计也很有代表性。文件层面它是一个字符串列表，但运行时会拆成：

- 作物 ID 黑名单
- 模组黑名单

而且模组黑名单进一步允许正则匹配。

对使用者来说，更重要的是理解这件事：

- 文件里看到的是简单字符串列表
- 运行时真正用来判断的是已经拆分好的两类黑名单

因此如果你要扩展配置逻辑，优先改 `Config` 中的整理与判断流程，而不是把业务判断直接压回原始字段。

<a id="when-to-use"></a>

## 什么时候该参考这套设计

如果你正在做的系统不只是“读一个 JSON 对象”，而是：

- 需要默认值
- 需要路径解析
- 需要运行时重载
- 需要把文件字段整理成更适合程序使用的结构

那么 Croparia IF 这套 `RawConfig -> Config -> ConfigFileHandler` 的分层很值得参考。

<a id="tips"></a>

## 使用建议

- 不要让文件 IO 逻辑直接散落在业务代码里，优先像 `ConfigFileHandler` 这样集中处理。
- 不要让运行时逻辑直接依赖“原始 JSON 结构”，优先在 `Config` 里做一次语义整理。
- 如果系统需要热重载，尽量考虑“更新同一实例”而不是“替换整个对象引用”。
