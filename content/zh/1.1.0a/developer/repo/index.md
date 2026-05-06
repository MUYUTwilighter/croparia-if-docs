---
title: Repo API
desc: 面向 Croparia IF 下游开发者的 Repo API 架构概览，介绍 Repo、RepoProxy、ProxyProvider、PlatformItemProxy 与 PlatformFluidProxy 的职责关系。
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
modVersions:
  - 1.1.0a
---

# Repo API

Repo API 是 Croparia IF 为了实现多模组平台存储交互而建立的一组抽象与代理接口。当前默认只内置了物品与流体两种资源类型，主要用于方块或方块实体的存储暴露与访问。

相关代码位于：`cool.muyucloud.croparia.api.repo` 包名下。

## 基本架构

Repo API 主要由资源仓库 `Repo`、接口注册机 `ProxyProvider`、仓库代理 `RepoProxy`，以及平台代理接口 `PlatformItemProxy`、`PlatformFluidProxy` 构成。

- `Repo`: 通用模块下的直接交互层。它以槽位索引为基准，建立了一套资源存储视图。
- `RepoProxy`：对 `Repo` 进行包装以适配不同模组平台。
- `ProxyProvider`：将 `RepoProxy` 注册进具体模组平台，以保证它能被外部的存储系统发现。
- `PlatformItemProxy` / `PlatformFluidProxy`：对各个平台物品或流体存储接口的统一代理包装，保证通用模块能够以 `Repo` 风格访问它们。

此外，Repo API 使用了 [Resource API](resource) 来管理资源种类。

## 导航

- [建立你的存储交互](start.md)
- [扩展新的存储方式](extend.md)
- [添加新的资源类型](resource)
