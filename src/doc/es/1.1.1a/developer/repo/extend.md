---
title: Extender Repo API
desc: Explica cómo ampliar Repo API con nuevos modelos de almacenamiento, incluyendo registro mediante Resource API, envoltorios RepoProxy por plataforma y registro y descubrimiento con ProxyProvider.
keywords:
  - Croparia IF
  - Repo API
  - RepoProxy
  - ProxyProvider
  - Resource API
  - PlatformFluidProxy
  - PlatformItemProxy
  - extensión de almacenamiento
  - adaptación multiplataforma
  - Architectury
  - documentación para desarrolladores
  - 1.1.1a
navOrder: 30
---

# Extender Repo API

Repo API incluye actualmente soporte integrado solo para tipos de recurso de objetos y fluidos, principalmente alrededor de la exposición de almacenamiento desde bloques y block entities. Si necesitas tipos de recurso adicionales o un modelo nuevo de almacenamiento, Croparia IF ya muestra el patrón.

## 1. Registrar mediante Resource API

La gestión de tipos en Repo API pasa por la [Resource API](resource.md). Conviene empezar por las [notas de registro](resource.md#add-resource-type).

## 2. Construir un envoltorio de plataforma

Para que un tipo de recurso nuevo funcione correctamente en varias plataformas de modding, necesitas un puente de registro específico por plataforma.
Croparia IF usa [`@ExpectPlatform`](https://docs.architectury.dev/plugin/expect_platform) de Architectury Plugin
para que un mismo punto de llamada delegado a distintas implementaciones según la plataforma.

La ruta del proxy de fluidos es un buen ejemplo.

Primero, declara una factoría `@ExpectPlatform` en el módulo común:

```java
package cool.muyucloud.croparia.api.repo;

public abstract class RepoProxy<T extends TypedResource<?>> extends DelegateRepo<T> {
    @ExpectPlatform
    public static RepoProxy<FluidSpec> fluid(Repo<FluidSpec> repo) {
        throw new AssertionError("Not implemented");
    }
}
```

Después implementa ese método dentro del loader de destino. El nombre del paquete, de la clase y del método debe seguir el patrón que espera Architectury:

```java
package cool.muyucloud.croparia.api.repo.fabric;

public class RepoProxyImpl {
    public static RepoProxy<FluidSpec> fluid(Repo<FluidSpec> repo) {
        return new FluidRepoProxy(repo);
    }
}
```

`FluidRepoProxy` será entonces el envoltorio real sobre la interfaz de almacenamiento de fluidos de la plataforma:

```java
public class FluidRepoProxy extends RepoProxy<FluidSpec> implements Storage<FluidVariant> {
    // ...
}
```

Aquí hay un detalle especialmente útil: `RepoProxy` ya extiende `DelegateRepo`. Así que, si el `Repo` que le pasas ya es una vista bloqueada creada con `lockAccept(...)`, `lockConsume(...)` o `lock(...)`, el envoltorio de plataforma hereda esas restricciones directamente. No hace falta reconstruir el mismo filtrado otra vez dentro del adaptador de plataforma.

## 3. Registro y descubrimiento

Croparia IF usa el mismo patrón [`@ExpectPlatform`](https://docs.architectury.dev/plugin/expect_platform) para el descubrimiento de almacenamiento y el registro de proveedores.

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

Implementación del lado de Fabric:

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

