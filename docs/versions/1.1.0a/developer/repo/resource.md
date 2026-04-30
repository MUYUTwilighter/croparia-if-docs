---
title: Resource API
description: 介绍 Repo API 在 1.1.0a 下依赖的 Resource API，包括 TypeToken、TypedResource，以及如何扩展新的资源类型。
keywords:
  - Croparia IF
  - Resource API
  - TypeToken
  - TypedResource
  - ItemSpec
  - FluidSpec
  - 资源类型
  - 自定义资源
  - 开发者文档
  - Repo API
  - 1.1.0a
modVersions:
  - 1.1.0a
---

# Resource API

Resource API 是 Croparia IF 为了兼容多种资源类型以及它们在模组平台下的差异而建立的一层类型抽象。

目前支持物品 `ItemSpec` 与流体 `FluidSpec`。

## 架构

Resource API 由类型令牌 `TypeToken` 与类型资源 `TypedResource` 构成。

- `TypeToken`: 资源种类的 ID。如果两个资源的类型令牌相同，则这两个资源的种类必然为一致
- `TypedResource`: 资源种类的分化实例，用于区分同类型但不可合并的资源。如物品 `ItemSpec` 与流体 `FluidSpec`

例如，有同样为物品 `ItemSpec` 的土元素宝石与水元素宝石，它们的类型令牌 `TypeToken` 一致且都为 `croparia:item_spec`。
但是它们的类型资源不同，分别为 `resource: "croparia:gem_earth"` 与 `resource: "croparia:gem_water"`。

**注**：类型资源 `TypedResource` 只负责资源种类与组件等用于判断是否能合并的数据，不对资源的数量负责。

<a id="add-resource-type"></a>

## 添加额外的资源种类

Croparia IF 默认只提供了物品 `ItemSpec` 与流体 `FluidSpec`，如果你想要添加额外的资源类型，可以参照下面的做法。

### 1. 创建类型资源类 `TypedResource`

创建一个类并继承 `TypedResource<T>`，其中泛型 `T` 表示资源类，如 `ItemSpec` 使用的是 `Item`，`FluidSpec` 使用的是 `Fluid`。

```java
public class MyResource implements TypedResource<Kind> {
    public static final MapCodec<MyResource> CODEC_COMP = RecordCodecBuilder.mapCodec(instance -> instance.group(
        Identifier.CODEC.fieldOf("id").forGetter(myResource -> myResource.getResource().builtInRegistryHolder().key().location())
    ).apply(instance, id -> new MyResource(BuiltInRegistries.KIND.getValue(id))));

    @NotNull
    private final Kind kind;

    private MyResource() {
        this.kind = Kind.EMPTY;
    }

    public MyResource(@NotNull Kind kind) {
        this.kind = kind;
    }

    @Override
    public MapCodec<MyResource> getCodec() {
        return CODEC_COMP;
    }

    @Override
    @NotNull
    public Kind getResource() {
        return this.kind;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof MyResource resource)) return false;
        if (this.isEmpty()) return resource.isEmpty();
        return Objects.equals(kind, resource.kind);
    }

    @Override
    public int hashCode() {
        if (this.isEmpty()) return 0;
        return Objects.hash(kind);
    }
}
```

### 2. 注册类型令牌

```java
public class MyResource implements TypedResource<Kind> {
    public static final MyResource EMPTY = new MyResource();    // An instance used to represent an empty resource
    public static final TypeToken<MyResource> TYPE = TypeToken.register(Identifier.of("modid:my_resource"), EMPTY, CODEC_COMP).orElseThrow();

    @Override
    public TypeToken<MyResource> getType() {
        return TYPE;
    }
    
    // ...
}
```

