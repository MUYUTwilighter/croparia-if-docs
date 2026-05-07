---
title: Repo API
desc: Resumen arquitectónico de la Repo API para desarrolladores downstream de Croparia IF, incluyendo las funciones de Repo, RepoProxy, ProxyProvider, PlatformItemProxy y PlatformFluidProxy.
keywords:
  - Croparia IF
  - Repo API
  - Repo
  - RepoProxy
  - ProxyProvider
  - PlatformItemProxy
  - PlatformFluidProxy
  - API de almacenamiento
  - almacenamiento multiplataforma
  - documentación para desarrolladores
modVersions:
  - 1.1.0a
navOrder: 20
---

# Repo API

La Repo API es la capa de abstracción y proxies que Croparia IF usa para interactuar con sistemas de almacenamiento en distintas plataformas. De serie admite recursos de tipo objeto y fluido, y se utiliza principalmente para exponer y acceder al almacenamiento de bloques y entidades de bloque.

El código relacionado se encuentra en el paquete `cool.muyucloud.croparia.api.repo`.

## Arquitectura básica

La Repo API se compone sobre todo de la vista de almacenamiento `Repo`, el puente de descubrimiento `ProxyProvider`, el envoltorio `RepoProxy` y las interfaces adaptadoras de plataforma `PlatformItemProxy` y `PlatformFluidProxy`.

- `Repo`: la capa de interacción directa usada en el módulo común. Modela el almacenamiento como una vista de recursos indexada por ranuras.
- `RepoProxy`: envuelve un `Repo` para adaptarlo a distintas plataformas de mods.
- `ProxyProvider`: registra instancias de `RepoProxy` en la plataforma concreta para que otros sistemas de almacenamiento puedan descubrirlas.
- `PlatformItemProxy` / `PlatformFluidProxy`: envoltorios unificados sobre las APIs de almacenamiento de objetos y fluidos de cada plataforma, de modo que el módulo común pueda acceder a ellas con estilo `Repo`.

La Repo API también se apoya en la [Resource API](resource.md) para gestionar los tipos de recurso.

## Navegación

- [Tutorial: Repo API](start.md)
- [Ampliar Repo API](extend.md)
- [Resource API](resource.md)
