---
title: 扩充 Repo API
description: 介绍如何围绕 Repo API 扩展新的存储方式，包括 Resource API 注册、RepoProxy 平台包装，以及 ProxyProvider 的注册与发现流程。
keywords:
  - Croparia IF
  - Repo API
  - RepoProxy
  - ProxyProvider
  - Resource API
  - PlatformFluidProxy
  - PlatformItemProxy
  - 存储扩展
  - 多平台适配
  - Architectury
  - 开发者文档
  - 1.1.0a
modVersions:
  - 1.1.0a
---

# 扩充 Repo API

Repo API 当前默认只内置了物品与流体两种资源类型，并围绕方块或方块实体的存储暴露提供支持。如果你需要额外的资源类型或者存储方式，可以参照 Croparia IF 的做法。

## 1. 注册 Resource API

Repo API 是通过 [Resource API](resource.md) 进行的类型管理，详见[注册说明](resource.md#add-resource-type)。

## 2. 代理包装

要保证我们新建的资源类型能够被各个模组平台正常访问，我们需要一个注册机。
Croparia IF 借助 Architectury Plugin 的 [`@ExpectPlatform`](https://docs.architectury.dev/plugin/expect_platform)
实现同一方法调用执行不同的方法体。

以下是流体的注册实现示例：

首先，在通用模块中声明一个 `@ExpectPlatform` 的静态工厂方法；

```java
package cool.muyucloud.croparia.api.repo;

public abstract class RepoProxy<T extends TypedResource<?>> extends DelegateRepo<T> {
    @ExpectPlatform
    public static RepoProxy<FluidSpec> fluid(Repo<FluidSpec> repo) {
        throw new AssertionError("Not implemented");
    }
}
```

之后，我们在目标模组加载平台中实现这个方法；注意包名、类名与方法名；

```java
package cool.muyucloud.croparia.api.repo.fabric;

public class RepoProxyImpl {
    public static RepoProxy<FluidSpec> fluid(Repo<FluidSpec> repo) {
        return new FluidRepoProxy(repo);
    }
}
```

其中，`FluidRepoProxy` 就是对平台侧流体存储接口的包装实现。

```java
public class FluidRepoProxy extends RepoProxy<FluidSpec> implements Storage<FluidVariant> {
    // ...
}
```

## 3. 注册与发现

同样基于 Architectury Plugin 的 [`@ExpectPlatform`](https://docs.architectury.dev/plugin/expect_platform)
，我们手动实现不同平台下存储系统的发现与注册

```java
package cool.muyucloud.croparia.api.repo;

public interface ProxyProvider<T extends TypedResource<?>> {
    @ExpectPlatform
    static Optional<PlatformFluidProxy> findFluid(Level world, BlockPos pos, Direction direction) {
        throw new AssertionError("Not implemented");
    }
    
    @ExpectPlatform
    static void registerFluid(ProxyProvider<FluidSpec> provider, Block... blocks) {
        throw new AssertionError("Not implemented");
    }

    // ...
}
```

Fabric 下的实现：

```java
package cool.muyucloud.croparia.api.repo.fabric;

public class ProxyProviderImpl {
    public static Optional<PlatformFluidProxy> findFluid(Level world, BlockPos pos, Direction direction) {
        Storage<FluidVariant> storage = FluidStorage.SIDED.find(world, pos, direction);
        return storage == null ? Optional.empty() : Optional.of(PlatformFluidProxyImpl.of(storage));
    }
    
    @SuppressWarnings("unchecked")
    public static void registerFluid(ProxyProvider<FluidSpec> provider, Block... blocks) {
        FluidStorage.SIDED.registerForBlocks((world, pos, state, be, context) -> (Storage<FluidVariant>) provider.visit(world, pos, state, be, context), blocks);
    }
    
    // ...
}
```
