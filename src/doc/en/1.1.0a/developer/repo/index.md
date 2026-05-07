---
title: Repo API
desc: Architectural overview of the Repo API for Croparia IF downstream developers, covering the roles of Repo, RepoProxy, ProxyProvider, PlatformItemProxy, and PlatformFluidProxy.
keywords:
  - Croparia IF
  - Repo API
  - Repo
  - RepoProxy
  - ProxyProvider
  - PlatformItemProxy
  - PlatformFluidProxy
  - storage API
  - cross-platform storage
  - developer docs
modVersions:
  - 1.1.0a
navOrder: 20
---

# Repo API

Repo API is the abstraction and proxy layer Croparia IF uses for cross-platform storage interaction. Out of the box it supports item and fluid resources, and it is mainly used to expose and access storage from blocks and block entities.

The related code lives under the package `cool.muyucloud.croparia.api.repo`.

## Core architecture

Repo API mainly consists of the storage view `Repo`, the discovery bridge `ProxyProvider`, the wrapper `RepoProxy`, and the platform adapter interfaces `PlatformItemProxy` and `PlatformFluidProxy`.

- `Repo`: the direct interaction layer used in the common module. It models storage as a slot-indexed resource view.
- `RepoProxy`: wraps a `Repo` so it can adapt to different mod platforms.
- `ProxyProvider`: registers `RepoProxy` instances into the concrete mod platform so outside storage systems can discover them.
- `PlatformItemProxy` / `PlatformFluidProxy`: unified wrappers over platform-side item and fluid storage APIs, so the common module can access them in a `Repo`-style way.

Repo API also relies on the [Resource API](resource.md) to manage resource types.

## Navigation

- [Tutorial: Repo API](start.md)
- [Extend Repo API](extend.md)
- [Resource API](resource.md)
