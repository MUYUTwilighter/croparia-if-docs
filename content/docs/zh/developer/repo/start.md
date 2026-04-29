---
title: 教程：Repo API
description: 介绍如何在 Croparia IF 中创建 Repo、包装 RepoProxy、注册 ProxyProvider，并查询其他存储系统的 Repo API 入门流程。
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
  - 存储交互
  - 开发教程
  - 1.1.1a
modVersions:
  - 1.1.1a
---

# 教程：Repo API

此页面将指引开发者借助 Repo API 实现多平台存储接口。

## 1. 建立资源仓库 `Repo`

这一步将确定你要存储什么资源、怎么访问你要存的资源。

### 1.1 原版存储仓库 `ContainerRepo<ItemSpec>`

你可以借助原版的存储系统 `Container` 来快速开发。以下为温室方块实体的部分实现示例：

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

### 1.2 自定义存储仓库 `Repo<T>`

你可以自行实现 `Repo` 接口来创建你需要的功能。

基础存储交互：
- `int size`: 存储单元的数量
- `boolean isEmpty`: 判断仓库或指定存储单元是否为空
- `TypeToken<T> getType`: 判断存储的资源类型，详见 [Resource API](resource.md)
- `T resourceFor`: 获取某一个存储单元的资源种类
- `long simConsume`: 模拟抽取资源，会返回模拟实际抽取的资源数量
- `long consume`: 抽取资源，返回实际抽取的资源数量
- `long simAccept`: 模拟填入资源，会返回模拟实际填入的资源数量
- `long accept`: 填入资源，返回实际填入的资源数量
- `long capacityFor`: 查询某个资源或存储单元的最大容量
- `long amountFor`: 查询某个资源或存储单元已存储的资源数量

锁定视图（以下方法返回新的包装视图，不会改写原仓库）：
- `boolean isAcceptLocked(int i)` 查询某个存储单元是否拒绝填入
- `boolean isConsumeLocked(int i)` 查询某个存储单元是否拒绝抽取
- `DelegateRepo<T> lockAccept(Integer... idx)` 锁定指定存储单元的填入操作
- `DelegateRepo<T> lockAccept()` 锁定全部存储单元的填入操作
- `DelegateRepo<T> lockConsume(Integer... idx)` 锁定指定存储单元的抽取操作
- `DelegateRepo<T> lockConsume()` 锁定全部存储单元的抽取操作
- `DelegateRepo<T> lock(Integer... idx)` 同时锁定指定存储单元的填入与抽取
- `DelegateRepo<T> lock()` 同时锁定全部存储单元的填入与抽取
- `DelegateRepo<T> trim()` 压平多层 `DelegateRepo`，把链式锁定合并成单层视图

需要特别注意的是：

- 锁定只影响 `accept` / `simAccept` / `consume` / `simConsume`
- `capacityFor(...)` 与 `amountFor(...)` 仍然返回底层仓库的原始容量与原始存量
- 如果调用方需要同时知道“这个槽能不能插入”和“这个槽理论容量是多少”，要分别查询锁状态与容量

## 2. 注册仓库代理

为了让我们建立的存储仓库能够被其他存储系统安全地交互，我们需要新建一个 `RepoProxy` 代理包装。

```java
public class GreenhouseBlockEntity extends BlockEntity implements Container {
    private final RepoProxy<ItemSpec> proxy = RepoProxy.item(this.repo);
    
    public RepoProxy<ItemSpec> visitItem() {
        return this.proxy;
    }
    
    // ...
}
```

**注**：代理类 `RepoProxy` 由 Croparia IF 在不同模组平台自动实例化，手动实例化 `new RepoProxy<>(...)` 无法正常在具体的模组平台下工作。

实践中，更常见的写法是先构造一个带锁定视图的 `Repo`，再把这个视图包装成 `RepoProxy`。例如作物嬗变仪会分别导出“输入视图”和“输出视图”：

```java
private final RepoProxy<ItemSpec> inputProxy = RepoProxy.item(
    repo.lockConsume(INPUT_SLOT, OUTPUT_SLOT).lockAccept(OUTPUT_SLOT).trim()
);
private final RepoProxy<ItemSpec> outputProxy = RepoProxy.item(
    repo.lockAccept(INPUT_SLOT, OUTPUT_SLOT).lockConsume(INPUT_SLOT).trim()
);
```

这段代码的含义是：

- `inputProxy`
  - 禁止从输入视图抽取任意槽位
  - 禁止向输出槽填入物品
  - 最终只允许向输入槽填入
- `outputProxy`
  - 禁止向输出视图填入任意槽位
  - 禁止从输入槽抽取物品
  - 最终只允许从输出槽抽取

之后，我们将代理注册进 `ProxyProvider`，让存储仓库能被其他存储系统发现：

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

注册后，模组平台将基于方块种类进行查询，然后执行你注册的查询函数来获取到 `RepoProxy`。

## 3. 查询其他存储仓库

你可以通过 `ProxyProvider` 来查找任意存储系统，并得到一个实现了 `RepoProxy` 接口的包装仓库。

```java
Optional<PlatformItemProxy> itemProxy = ProxyProvider.findItem(world, pos, direction);
Optional<PlatformFluidProxy> fluidProxy = ProxyProvider.findFluid(world, pos, direction);

itemProxy.ifPresent(proxy -> {
    // use proxy as a Repo<ItemSpec>
});
```

**注**：由于平台差异，部分 `Repo` 接口方法在不同平台下存在能力差异，请查阅 `PlatformItemProxy` 与 `PlatformFluidProxy` 的接口 javadoc。
