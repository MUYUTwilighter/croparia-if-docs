---
title: Ampliar Repo API
desc: Explica cómo ampliar la Repo API con nuevos patrones de almacenamiento, incluyendo el registro en Resource API, los wrappers de plataforma de RepoProxy y el registro y descubrimiento mediante ProxyProvider.
keywords:
  - Croparia IF
  - Repo API
  - RepoProxy
  - ProxyProvider
  - Resource API
  - PlatformFluidProxy
  - PlatformItemProxy
  - ampliación de almacenamiento
  - adaptación multiplataforma
  - Architectury
  - documentación para desarrolladores
modVersions:
  - 1.1.0a
navOrder: 30
---

# Ampliar Repo API

La Repo API actualmente solo ofrece soporte integrado para recursos de tipo objeto y fluido, y se centra en exponer almacenamiento desde bloques o block entities. Si necesitas tipos de recurso adicionales o nuevos patrones de almacenamiento, Croparia IF ya ofrece una ruta de ampliación bastante clara.

## 1. Registrar mediante Resource API

La Repo API gestiona los tipos a través de la [Resource API](resource.md); consulta la [guía de registro](resource.md#add-resource-type).

## 2. Envolver el proxy de plataforma

Para que un nuevo tipo de recurso sea accesible en todas las plataformas soportadas, necesitas una capa de factoría dependiente de la plataforma.
Croparia IF usa [`@ExpectPlatform`](https://docs.architectury.dev/plugin/expect_platform) del Architectury Plugin para que una misma llamada de método se resuelva en una implementación distinta según la plataforma.

El siguiente fragmento muestra el patrón de registro de fluidos.

Primero, declara un método factoría estático con `@ExpectPlatform` en el módulo común:

```java
package cool.muyucloud.croparia.api.repo;

public abstract class RepoProxy<T extends TypedResource<?>> extends DelegateRepo<T> {
    @ExpectPlatform
    public static RepoProxy<FluidSpec> fluid(Repo<FluidSpec> repo) {
        throw new AssertionError("Not implemented");
    }
}
```

Después, implementa ese método en la plataforma de carga del mod correspondiente. El nombre del paquete, de la clase y del método deben coincidir.

```java
package cool.muyucloud.croparia.api.repo.fabric;

public class RepoProxyImpl {
    public static RepoProxy<FluidSpec> fluid(Repo<FluidSpec> repo) {
        return new FluidRepoProxy(repo);
    }
}
```

Aquí, `FluidRepoProxy` es la implementación envoltorio que adapta la interfaz de almacenamiento de fluidos del lado de la plataforma.

```java
public class FluidRepoProxy extends RepoProxy<FluidSpec> implements Storage<FluidVariant> {
    // ...
}
```

## 3. Registro y descubrimiento

Croparia IF gestiona el descubrimiento y el registro multiplataforma usando el mismo patrón de Architectury Plugin con [`@ExpectPlatform`](https://docs.architectury.dev/plugin/expect_platform).

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
