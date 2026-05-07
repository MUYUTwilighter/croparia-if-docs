---
title: Extend Repo API
desc: Explains how to extend Repo API with new storage patterns, including Resource API registration, RepoProxy platform wrappers, and ProxyProvider registration and discovery.
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
modVersions:
  - 1.1.0a
navOrder: 30
---

# Extend Repo API

Repo API currently only ships built-in support for item and fluid resource types, and it focuses on exposing storage from blocks or block entities. If you need extra resource kinds or new storage patterns, Croparia IF already provides a path you can follow.

## 1. Register through Resource API

Repo API manages types through the [Resource API](resource.md); see the [registration guide](resource.md#add-resource-type).

## 2. Wrap the platform proxy

To make a new resource type accessible on every supported platform, you need a platform-aware factory layer.
Croparia IF uses [`@ExpectPlatform`](https://docs.architectury.dev/plugin/expect_platform) from the Architectury Plugin so that the same method call can resolve to a different implementation on each platform.

The following snippet shows the fluid registration pattern.

First, declare an `@ExpectPlatform` static factory method in the common module:

```java
package cool.muyucloud.croparia.api.repo;

public abstract class RepoProxy<T extends TypedResource<?>> extends DelegateRepo<T> {
    @ExpectPlatform
    public static RepoProxy<FluidSpec> fluid(Repo<FluidSpec> repo) {
        throw new AssertionError("Not implemented");
    }
}
```

Then implement that method on the target mod-loading platform. The package name, class name, and method name must match.

```java
package cool.muyucloud.croparia.api.repo.fabric;

public class RepoProxyImpl {
    public static RepoProxy<FluidSpec> fluid(Repo<FluidSpec> repo) {
        return new FluidRepoProxy(repo);
    }
}
```

Here, `FluidRepoProxy` is the wrapper implementation that adapts the platform-side fluid storage interface.

```java
public class FluidRepoProxy extends RepoProxy<FluidSpec> implements Storage<FluidVariant> {
    // ...
}
```

## 3. Registration and discovery

Croparia IF handles discovery and registration across platforms using the same Architectury Plugin [`@ExpectPlatform`](https://docs.architectury.dev/plugin/expect_platform) pattern.

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
