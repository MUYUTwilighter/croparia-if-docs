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

Repo API is the set of abstractions and proxy interfaces Croparia IF uses for cross-platform storage interaction. By default it only ships built-in support for item and fluid resource types, and it is mainly used to expose and access storage from blocks or block entities.

The related code lives under the package `cool.muyucloud.croparia.api.repo`.

## Core architecture

Repo API is mainly built from the resource repository `Repo`, the discovery registry `ProxyProvider`, the repository wrapper `RepoProxy`, and the platform proxy interfaces `PlatformItemProxy` and `PlatformFluidProxy`.

- `Repo`: the direct interaction layer used in the common module. It builds a resource-storage view around indexed slots.
- `RepoProxy`: wraps a `Repo` so it can adapt to different mod platforms.
- `ProxyProvider`: registers `RepoProxy` instances into the concrete mod platform so outside storage systems can discover them.
- `PlatformItemProxy` / `PlatformFluidProxy`: unified proxy wrappers over platform-side item and fluid storage APIs, allowing the common module to access them in a `Repo`-style way.

Repo API also relies on the [Resource API](resource.md) to manage resource types.

## Navigation

- [Tutorial: Repo API](start.md)
- [Extend Repo API](extend.md)
- [Resource API](resource.md)
