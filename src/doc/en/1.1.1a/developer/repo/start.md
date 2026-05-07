---
title: Tutorial: Repo API
desc: Introduces the beginner workflow for Repo API in Croparia IF, including creating a Repo, wrapping it in RepoProxy, registering ProxyProvider, and querying other storage systems.
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
  - developer tutorial
  - 1.1.1a
navOrder: 10
---

# Tutorial: Repo API

This page walks through the usual beginner path for implementing multi-platform storage interaction with Repo API.

## 1. Create a resource repo

This step decides what kind of resource you want to store, and how your storage should expose it.

### 1.1 Vanilla-backed storage with `ContainerRepo<ItemSpec>`

The fastest path is to reuse the vanilla `Container` model. The following fragment shows part of the Greenhouse block entity:

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

### 1.2 Custom storage with `Repo<T>`

You can also implement `Repo` directly if you need more specialized behavior.

Basic storage interaction methods:

- `int size`
  - number of storage units
- `boolean isEmpty`
  - whether the whole repo or one slot is empty
- `TypeToken<T> getType`
  - resource type stored by this repo; see [Resource API](resource.md)
- `T resourceFor`
  - resource kind inside one slot
- `long simConsume`
  - simulate extraction and return the simulated extracted amount
- `long consume`
  - perform extraction and return the real extracted amount
- `long simAccept`
  - simulate insertion and return the simulated accepted amount
- `long accept`
  - perform insertion and return the real accepted amount
- `long capacityFor`
  - query the maximum capacity for one resource or one slot
- `long amountFor`
  - query the stored amount for one resource or one slot

Lock views (these return wrapped views and do not mutate the original repo):

- `boolean isAcceptLocked(int i)`
  - whether one slot refuses insertion
- `boolean isConsumeLocked(int i)`
  - whether one slot refuses extraction
- `DelegateRepo<T> lockAccept(Integer... idx)`
  - lock insertion on specific slots
- `DelegateRepo<T> lockAccept()`
  - lock insertion on all slots
- `DelegateRepo<T> lockConsume(Integer... idx)`
  - lock extraction on specific slots
- `DelegateRepo<T> lockConsume()`
  - lock extraction on all slots
- `DelegateRepo<T> lock(Integer... idx)`
  - lock both insertion and extraction on specific slots
- `DelegateRepo<T> lock()`
  - lock both insertion and extraction on all slots
- `DelegateRepo<T> trim()`
  - flatten a chain of `DelegateRepo` wrappers into one layer

One important detail:

- locking only affects `accept` / `simAccept` / `consume` / `simConsume`
- `capacityFor(...)` and `amountFor(...)` still report the raw values from the underlying repo
- if the caller needs to know both "can I insert here?" and "what is the slot capacity?", those checks still need to be done separately

## 2. Register a repo proxy

To make the repo interact safely with other storage systems, you need a `RepoProxy` wrapper around it.

```java
public class GreenhouseBlockEntity extends BlockEntity implements Container {
    private final RepoProxy<ItemSpec> proxy = RepoProxy.item(this.repo);
    
    public RepoProxy<ItemSpec> visitItem() {
        return this.proxy;
    }
    
    // ...
}
```

**Note:** `RepoProxy` is instantiated automatically by Croparia IF per modding platform. Manually writing `new RepoProxy<>(...)` will not behave correctly on real platform targets.

In practice, a common pattern is to build a locked repo view first and only then wrap that view into `RepoProxy`. For example, the Crop Transmuter exports separate input and output views:

```java
private final RepoProxy<ItemSpec> inputProxy = RepoProxy.item(
    repo.lockConsume(INPUT_SLOT, OUTPUT_SLOT).lockAccept(OUTPUT_SLOT).trim()
);
private final RepoProxy<ItemSpec> outputProxy = RepoProxy.item(
    repo.lockAccept(INPUT_SLOT, OUTPUT_SLOT).lockConsume(INPUT_SLOT).trim()
);
```

In behavior terms, this means:

- `inputProxy`
  - refuses extraction from every slot
  - refuses insertion into the output slot
  - ultimately allows insertion only into the input slot
- `outputProxy`
  - refuses insertion into every slot
  - refuses extraction from the input slot
  - ultimately allows extraction only from the output slot

Once the proxy exists, register it through `ProxyProvider` so external storage systems can discover it:

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

After registration, the platform resolves the block type first and then calls your query function to obtain the corresponding `RepoProxy`.

## 3. Query other storage repos

You can query other storage systems through `ProxyProvider`, which returns a wrapper implementing the `RepoProxy` style.

```java
Optional<PlatformItemProxy> itemProxy = ProxyProvider.findItem(world, pos, direction);
Optional<PlatformFluidProxy> fluidProxy = ProxyProvider.findFluid(world, pos, direction);

itemProxy.ifPresent(proxy -> {
    // use proxy as a Repo<ItemSpec>
});
```

**Note:** because platform capabilities differ, some `Repo` methods are not equally reliable across all implementations. When behavior matters, check the interface javadocs for `PlatformItemProxy` and `PlatformFluidProxy`.

