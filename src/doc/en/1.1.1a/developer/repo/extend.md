---
title: Extend Repo API
desc: Explains how to extend Repo API with new storage models, including Resource API registration, platform RepoProxy wrappers, and ProxyProvider registration and discovery.
keywords:
  - Croparia IF
  - Repo API
  - RepoProxy
  - ProxyProvider
  - Resource API
  - PlatformFluidProxy
  - PlatformItemProxy
  - storage extension
  - cross-platform adaptation
  - Architectury
  - developer docs
  - 1.1.1a
navOrder: 30
---

# Extend Repo API

Repo API currently ships built-in support only for item and fluid resource types, mainly around exposing storage from blocks and block entities. If you need extra resource types or a new storage model, Croparia IF already shows the pattern.

## 1. Register through Resource API

Type management in Repo API goes through the [Resource API](resource.md). See the [registration notes](resource.md#add-resource-type) there first.

## 2. Build a platform wrapper

To make a new resource type work correctly across multiple modding platforms, you need a platform-specific registration bridge.
Croparia IF uses Architectury Plugin's [`@ExpectPlatform`](https://docs.architectury.dev/plugin/expect_platform)
so one shared call site can delegate to different implementations per platform.

The fluid proxy path is a good example.

First, declare one `@ExpectPlatform` factory in the common module:

```java
package cool.muyucloud.croparia.api.repo;

public abstract class RepoProxy<T extends TypedResource<?>> extends DelegateRepo<T> {
    @ExpectPlatform
    public static RepoProxy<FluidSpec> fluid(Repo<FluidSpec> repo) {
        throw new AssertionError("Not implemented");
    }
}
```

Then implement that method inside the target loader platform. The package name, class name, and method name must match the pattern expected by Architectury:

```java
package cool.muyucloud.croparia.api.repo.fabric;

public class RepoProxyImpl {
    public static RepoProxy<FluidSpec> fluid(Repo<FluidSpec> repo) {
        return new FluidRepoProxy(repo);
    }
}
```

`FluidRepoProxy` is then the actual wrapper over the platform's fluid storage interface:

```java
public class FluidRepoProxy extends RepoProxy<FluidSpec> implements Storage<FluidVariant> {
    // ...
}
```

One especially useful detail here is that `RepoProxy` already extends `DelegateRepo`. So if the `Repo` you pass in is already a locked view created with `lockAccept(...)`, `lockConsume(...)`, or `lock(...)`, the platform wrapper inherits those restrictions directly. You do not need to rebuild the same filtering logic inside the platform adapter itself.

## 3. Registration and discovery

Croparia IF uses the same [`@ExpectPlatform`](https://docs.architectury.dev/plugin/expect_platform) pattern for storage discovery and provider registration.

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

Fabric-side implementation:

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

