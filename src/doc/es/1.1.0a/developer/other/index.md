---
title: Otras APIs comunes
desc: Reúne varias APIs auxiliares de Croparia IF que no forman un grupo grande por sí solas, pero siguen apareciendo con frecuencia en el desarrollo real.
keywords:
  - Croparia IF
  - documentación para desarrolladores
  - otras APIs
  - JsonTransformer
  - Config
  - BlockProperties
  - ItemPlaceable
  - LazySupplier
  - OnLoadSupplier
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 70
---

# Otras APIs comunes

<a id="overview"></a>

Este grupo reúne varias APIs auxiliares que aparecen a menudo en Croparia IF, aunque cada una por separado sea relativamente pequeña.

Si durante el desarrollo te encuentras con preguntas como estas, aquí es un buen punto de partida:

- cómo canalizar formatos de texto como `json`, `toml` o `cdg` hacia una sola tubería basada en `Codec`
- cómo organizar un objeto de configuración recargable y persistente
- cómo leer, emparejar o modificar propiedades de estados de bloque
- cómo permitir que un objeto participe en la lógica como "objeto colocable"
- cómo retrasar cálculos, mapear suppliers o refrescar valores después de la carga de datos

Actualmente este grupo incluye sobre todo:

- [Transformación JSON](json.md#overview)
- [Sistema de configuración](config.md#overview)
- [Componentes de objeto personalizados](item-components.md#overview)
- [Lectura y modificación de propiedades de bloque](block-property.md#overview)
- [ItemPlaceable](item-placeable.md#overview)
- [Utilidades Supplier](supplier.md#overview)

