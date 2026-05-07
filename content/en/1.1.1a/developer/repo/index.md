---
title: Repo API
desc: Architectural overview of the Croparia IF Repo API for downstream developers, covering Repo, RepoProxy, ProxyProvider, PlatformItemProxy, and PlatformFluidProxy.
navOrder: 20
---

# Repo API

Repo API is Croparia IF’s abstraction and proxy layer for multi-platform storage interaction. By default it currently ships with two built-in resource types: items and fluids, mainly for exposing and accessing storage on blocks and block entities.

The Repo access restriction model uses **separate accept/consume locking**:

- `accept` and `consume` each maintain their own lock state;
- locks are view-level filters and do not mutate the underlying repo itself;
- `capacityFor(...)` and `amountFor(...)` still return raw values from the underlying repo and are not changed by locks;
- the common locking entry points are `lockAccept(...)`, `lockConsume(...)`, and `lock(...)`;
- these views are built on `DelegateRepo`, so they can keep chaining and can be flattened into a single wrapper with `trim()` when needed.

Relevant code lives under the package `cool.muyucloud.croparia.api.repo`.

## Basic architecture

Repo API is mainly composed of the storage view `Repo`, the registration bridge `ProxyProvider`, the repo wrapper `RepoProxy`, and the platform adapter interfaces `PlatformItemProxy` and `PlatformFluidProxy`.

- `Repo`
  - the direct interaction layer inside the common module, based on slot-indexed storage views
- `DelegateRepo`
  - a lightweight wrapper used to build view-level restrictions such as accept/consume locks
- `RepoProxy`
  - wraps a `Repo` so it can adapt to different modding platforms
- `ProxyProvider`
  - registers a `RepoProxy` into a concrete platform so external storage systems can discover it
- `PlatformItemProxy` / `PlatformFluidProxy`
  - unified wrappers for platform item or fluid storage interfaces, so the common module can access them in a Repo-style way

Repo API also uses the [Resource API](resource.md) to manage resource types.

## Navigation

- [Build your own storage interaction](start.md)
- [Extend new storage models](extend.md)
- [Add new resource types](resource.md)

