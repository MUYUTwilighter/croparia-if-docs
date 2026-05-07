---
title: Resource API
desc: Presenta la Resource API usada por la Repo API, incluyendo TypeToken, TypedResource y la forma de ampliar Croparia IF con nuevos tipos de recurso.
keywords:
  - Croparia IF
  - Resource API
  - TypeToken
  - TypedResource
  - ItemSpec
  - FluidSpec
  - tipo de recurso
  - recurso personalizado
  - documentación para desarrolladores
  - Repo API
  - 1.1.0a
navOrder: 20
---

# Resource API

La Resource API es la capa de abstracción de tipos que Croparia IF usa para soportar varios tipos de recurso y las diferencias que pueden existir entre plataformas de mods.

Por ahora admite objetos mediante `ItemSpec` y fluidos mediante `FluidSpec`.

## Arquitectura

La Resource API se compone de `TypeToken` y `TypedResource`.

- `TypeToken`: el ID de un tipo de recurso. Si dos recursos comparten el mismo type token, se garantiza que pertenecen al mismo tipo.
- `TypedResource`: una instancia diferenciada de ese tipo, usada para distinguir recursos que comparten tipo pero aun así no pueden fusionarse. Por ejemplo, `ItemSpec` y `FluidSpec`.

Por ejemplo, una Gema elemental de tierra y una Gema elemental de agua son ambas `ItemSpec`. Su `TypeToken` es el mismo y vale `croparia:item_spec`.
Sin embargo, sus recursos tipados son distintos: `resource: "croparia:gem_earth"` frente a `resource: "croparia:gem_water"`.

**Nota**: `TypedResource` solo se encarga de la identidad del recurso y de los datos relacionados con la fusión, como componentes. No representa la cantidad de un recurso.

<a id="add-resource-type"></a>

## Añadir otro tipo de recurso

Croparia IF solo ofrece soporte integrado para `ItemSpec` y `FluidSpec`. Si quieres añadir otro tipo de recurso, el patrón siguiente es el punto de partida previsto.

### 1. Crear una clase de recurso tipado `TypedResource`

Crea una clase que implemente `TypedResource<T>`, donde el genérico `T` es la clase de recurso subyacente. Por ejemplo, `ItemSpec` usa `Item` y `FluidSpec` usa `Fluid`.

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

### 2. Registrar el type token

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
