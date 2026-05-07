---
title: Tutorial: Repo API
desc: Explains the introductory Repo API workflow in Croparia IF, including creating a Repo, wrapping it in RepoProxy, registering ProxyProvider, and querying other storage systems.
keywords:
  - Croparia IF
  - Repo API
  - Repo
  - RepoProxy
  - ProxyProvider
  - ContainerRepo
  - ItemSpec
  - PlatformItemProxy
  - PlatformFluidProxy
  - storage interaction
  - tutorial
modVersions:
  - 1.1.0a
navOrder: 10
---

# Tutorial: Repo API

This page walks through the usual beginner path for building cross-platform storage interaction with Repo API.

## 1. Build a resource repository `Repo`

This step decides what kind of resource you want to store and how your storage should expose it.

### 1.1 Vanilla-backed repository `ContainerRepo<ItemSpec>`

The quickest path is to build on top of the vanilla `Container` model. The following snippet shows part of the Greenhouse block entity:

```java
public class GreenhouseBlockEntity extends BlockEntity implements Container {
    private final NonNullList<ItemStack> inventory; // Vanilla container
    private final ContainerRepo repo = new ContainerRepo<>(this);   // Create a repo
    
    // example of implementing BlockEntity 
    @Override
    protected void loadAdditional(@NonNull ValueInput input) {
        super.loadAdditional(input);
        ContainerHelper.loadAllItems(input, this.inventory);
    }

    @Override
    protected void saveAdditional(@NonNull ValueOutput output) {
        ContainerHelper.saveAllItems(output, this.inventory);
        super.saveAdditional(output);
    }

    // example of implementing Container
    @Override
    public int getContainerSize() {
        return this.inventory.size();
    }

    @Override
    public boolean isEmpty() {
        return this.inventory.stream().allMatch(ItemStack::isEmpty);
    }
    
    // ...
}
```

### 1.2 Custom repository `Repo<T>`

You can also implement the `Repo` interface yourself and build exactly the storage behavior you need.

Basic storage interaction methods:

- `int size`: number of storage units
- `boolean isEmpty`: whether the repository, or one specific unit, is empty
- `TypeToken<T> getType`: resource type of the repository; see [Resource API](resource.md)
- `T resourceFor`: resource kind stored in one slot
- `long simConsume`: simulate extraction and return the amount that would actually be extracted
- `long consume`: extract resources and return the amount actually extracted
- `long simAccept`: simulate insertion and return the amount that would actually be inserted
- `long accept`: insert resources and return the amount actually inserted
- `long capacityFor`: query the maximum capacity of one resource or one storage unit
- `long amountFor`: query how much of one resource, or one storage unit, is currently stored

View wrappers (calling them does not mutate the original repository):

- `AcceptOnlyRepo<T> asAcceptOnly`: returns a wrapper that allows insertion but not extraction
- `ConsumeOnlyRepo<T> asConsumeOnly`: returns a wrapper that allows extraction but not insertion
- `LockedRepo<T> asLocked`: returns a wrapper that locks selected storage units

## 2. Register a repository proxy

To let external storage systems interact safely with the repo we created, we need to wrap it in a `RepoProxy`.

```java
public class GreenhouseBlockEntity extends BlockEntity implements Container {
    private final RepoProxy<ItemSpec> proxy = RepoProxy.item(this.repo);
    
    public RepoProxy<ItemSpec> visitItem() {
        return this.proxy;
    }
    
    // ...
}
```

**Note**: `RepoProxy` is instantiated automatically by Croparia IF on each supported mod platform. Manually calling `new RepoProxy<>(...)` will not work correctly on concrete platforms.

After that, register the proxy through `ProxyProvider` so other storage systems can discover it:

```java
public class Greenhouse extends BaseEntityBlock {
    public Greenhouse(Properties settings) {
        super(settings);
        ProxyProvider.registerItem(
            // Query Function
            (world, pos, state, be, direction) -> {
                if (be instanceof GreenhouseBlockEntity gbe) {
                    return gbe.visitItem();
                } else {
                    return null;
                }
            },
            // Blocks
            this
        );
    }
    
    // ...
}
```

After registration, the mod platform resolves the block type first and then runs the function you registered to obtain the `RepoProxy`.

## 3. Query another repository

You can use `ProxyProvider` to look up any compatible storage system and receive a wrapped repository in `RepoProxy` form.

```java
Optional<PlatformItemProxy> itemProxy = ProxyProvider.findItem(world, pos, direction);
Optional<PlatformFluidProxy> fluidProxy = ProxyProvider.findFluid(world, pos, direction);

itemProxy.ifPresent(proxy -> {
    // use proxy as a Repo<ItemSpec>
});
```

**Note**: due to platform differences, some `Repo` methods may have capability differences across platforms. Check the Javadocs of `PlatformItemProxy` and `PlatformFluidProxy` for details.
