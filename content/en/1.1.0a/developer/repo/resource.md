---
title: Resource API
desc: Introduces the Resource API used by Repo API, including TypeToken, TypedResource, and how to extend Croparia IF with new resource types.
keywords:
  - Croparia IF
  - Resource API
  - TypeToken
  - TypedResource
  - ItemSpec
  - FluidSpec
  - resource type
  - custom resource
  - developer docs
  - Repo API
  - 1.1.0a
navOrder: 20
---

# Resource API

The Resource API is the type-abstraction layer Croparia IF uses to support multiple resource kinds and the differences they may have across mod platforms.

At the moment it supports items through `ItemSpec` and fluids through `FluidSpec`.

## Architecture

The Resource API is made of `TypeToken` and `TypedResource`.

- `TypeToken`: the ID of a resource kind. If two resources share the same type token, they are guaranteed to belong to the same kind.
- `TypedResource`: one differentiated instance of that kind, used to tell apart resources that share a kind but still cannot merge. For example, `ItemSpec` and `FluidSpec`.

For example, an Earth Elemental Gem and a Water Elemental Gem are both item `ItemSpec`s. Their `TypeToken` is the same and equals `croparia:item_spec`.
However, their typed resources differ: `resource: "croparia:gem_earth"` versus `resource: "croparia:gem_water"`.

**Note**: `TypedResource` is only responsible for resource identity and merge-related data such as components. It does not represent a resource amount.

<a id="add-resource-type"></a>

## Add another resource type

Croparia IF only ships built-in support for item `ItemSpec` and fluid `FluidSpec`. If you want to add another resource kind, the pattern below is the intended starting point.

### 1. Create a typed resource class `TypedResource`

Create a class that implements `TypedResource<T>`, where the generic `T` is the underlying resource class. For example, `ItemSpec` uses `Item`, and `FluidSpec` uses `Fluid`.

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

### 2. Register the type token

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
