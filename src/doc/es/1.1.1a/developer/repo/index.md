---
title: Repo API
desc: Visión arquitectónica de Repo API de Croparia IF para desarrolladores descendentes, con Repo, RepoProxy, ProxyProvider, PlatformItemProxy y PlatformFluidProxy.
navOrder: 20
---

# Repo API

Repo API es la capa de abstracción y proxies de Croparia IF para la interacción con almacenamiento en múltiples plataformas. Por defecto incluye dos tipos de recurso integrados: objetos y fluidos, usados sobre todo para exponer y acceder al almacenamiento de bloques y block entities.

El modelo de restricción de acceso de Repo utiliza **bloqueos separados para accept y consume**:

- `accept` y `consume` mantienen su propio estado de bloqueo;
- los bloqueos son filtros a nivel de vista y no modifican el repo subyacente;
- `capacityFor(...)` y `amountFor(...)` siguen devolviendo los valores brutos del repo base y no cambian por los bloqueos;
- los puntos de entrada más habituales son `lockAccept(...)`, `lockConsume(...)` y `lock(...)`;
- estas vistas se construyen sobre `DelegateRepo`, así que pueden seguir encadenándose y pueden aplanarse en un único wrapper con `trim()` cuando haga falta.

El código relevante está en el paquete `cool.muyucloud.croparia.api.repo`.

## Arquitectura básica

Repo API se compone principalmente de la vista de almacenamiento `Repo`, el puente de registro `ProxyProvider`, el envoltorio `RepoProxy` y las interfaces adaptadoras de plataforma `PlatformItemProxy` y `PlatformFluidProxy`.

- `Repo`
  - capa de interacción directa en el módulo común, basada en vistas de almacenamiento indexadas por ranuras
- `DelegateRepo`
  - envoltorio ligero usado para construir restricciones a nivel de vista, como bloqueos de accept/consume
- `RepoProxy`
  - envuelve un `Repo` para adaptarlo a diferentes plataformas de modding
- `ProxyProvider`
  - registra un `RepoProxy` en una plataforma concreta para que los sistemas externos de almacenamiento puedan descubrirlo
- `PlatformItemProxy` / `PlatformFluidProxy`
  - envoltorios unificados para interfaces de almacenamiento de objetos o fluidos de cada plataforma, de modo que el módulo común pueda acceder a ellas con estilo Repo

Repo API también utiliza la [Resource API](resource.md) para gestionar tipos de recurso.

## Navegación

- [Construye tu propia interacción de almacenamiento](start.md)
- [Extiende nuevos modelos de almacenamiento](extend.md)
- [Añade nuevos tipos de recurso](resource.md)

