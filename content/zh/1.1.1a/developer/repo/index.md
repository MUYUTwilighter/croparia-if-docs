---
title: Repo API
description: 面向 Croparia IF 下游开发者的 Repo API 架构概览，介绍 Repo、RepoProxy、ProxyProvider、PlatformItemProxy 与 PlatformFluidProxy 的职责关系。
keywords:
  - Croparia IF
  - Repo API
  - Repo
  - RepoProxy
  - ProxyProvider
  - PlatformItemProxy
  - PlatformFluidProxy
  - 存储接口
  - 多平台存储
  - 开发者文档
  - 1.1.1a
---

# Repo API

Repo API 是 Croparia IF 为了实现多模组平台存储交互而建立的一组抽象与代理接口。当前默认只内置了物品与流体两种资源类型，主要用于方块或方块实体的存储暴露与访问。

Repo 的访问限制模型采用“分离式出入锁定”：

- `accept` 与 `consume` 分别有自己的锁定状态
- 锁定是视图级过滤，不会改写底层仓库本身
- `capacityFor(...)` 与 `amountFor(...)` 仍然返回底层原始查询结果，不会因为锁定而变化
- 常用的锁定入口是 `lockAccept(...)`、`lockConsume(...)` 与 `lock(...)`
- 这些锁定视图最终都建立在 `DelegateRepo` 之上，因此可以继续链式组合，并在需要时通过 `trim()` 压平成单层包装

相关代码位于：`cool.muyucloud.croparia.api.repo` 包名下。

## 基本架构

Repo API 主要由资源仓库 `Repo`、接口注册机 `ProxyProvider`、仓库代理 `RepoProxy`，以及平台代理接口 `PlatformItemProxy`、`PlatformFluidProxy` 构成。

- `Repo`: 通用模块下的直接交互层。它以槽位索引为基准，建立了一套资源存储视图。
- `DelegateRepo`：对 `Repo` 进行轻量包装，用来叠加出入锁定这类视图级限制。
- `RepoProxy`：对 `Repo` 进行包装以适配不同模组平台。
- `ProxyProvider`：将 `RepoProxy` 注册进具体模组平台，以保证它能被外部的存储系统发现。
- `PlatformItemProxy` / `PlatformFluidProxy`：对各个平台物品或流体存储接口的统一代理包装，保证通用模块能够以 `Repo` 风格访问它们。

此外，Repo API 使用了 [Resource API](resource.md) 来管理资源种类。

## 导航

- [建立你的存储交互](start.md)
- [扩展新的存储方式](extend.md)
- [添加新的资源类型](resource.md)

