---
title: Lectura y modificación de propiedades de bloque
desc: Explica BlockProperties de Croparia IF y cómo participa en extracción, emparejamiento, serialización y reaplicación de estados de bloque reales.
keywords:
  - Croparia IF
  - BlockProperties
  - BlockState
  - propiedades de bloque
  - DataComponent
  - documentación para desarrolladores
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 30
---

# Lectura y modificación de propiedades de bloque

<a id="overview"></a>

Si durante el desarrollo te encuentras con necesidades como estas:

- quieres guardar algunas propiedades de un `BlockState` en JSON, paquetes o un `ItemStack`
- quieres comprobar si un estado de bloque satisface un conjunto de restricciones de propiedades
- quieres reconstruir o modificar un `BlockState` a partir de propiedades identificadas por cadenas

entonces `BlockProperties` es la ayuda que Croparia IF proporciona precisamente para ese tipo de trabajo.

La mejor forma de entenderlo es:

- un subconjunto serializable de propiedades de estado de bloque

Puedes extraerlo desde un `BlockState`, moverlo por otros sistemas y más tarde volver a aplicarlo sobre un estado real cuando haga falta.

<a id="mental-model"></a>

## Modelo mental

Desde el punto de vista del consumidor, la relación más fácil de leer es:

- `BlockState`
  - el objeto de estado vanilla en tiempo de ejecución
- `BlockProperties`
  - una descripción de propiedades fácil de guardar, enviar y emparejar
- `StateHolderAccess.apply(...)`
  - el puente que vuelve a aplicar `BlockProperties` sobre un `BlockState`

El ciclo de vida más habitual es:

1. extraer propiedades de un `BlockState`
2. guardarlas o transportarlas
3. más tarde emparejarlas o reaplicarlas en otra parte

Si mantienes esa ruta principal en mente, la mayor parte de la página se vuelve bastante directa.

<a id="extract-and-match"></a>

## Extraer, aplicar y emparejar

Las tres capacidades más usadas son:

- `extract(BlockState state)`
- `isSubsetOf(BlockState state)`
- reaplicarlas mediante `StateHolderAccess.apply(...)`

Esas tres acciones cubren ya la mayoría de casos reales.

`extract(...)` es especialmente útil porque:

- guarda diferencias respecto al estado por defecto del bloque
- no copia ciegamente todas las propiedades
- la estructura resultante suele ser más pequeña y más fácil de persistir

Mientras tanto, `isSubsetOf(...)` y `apply(...)` corresponden a:

- "¿este estado del mundo satisface mis requisitos de propiedades?"
- "reconstruir o actualizar un estado usando estos requisitos guardados"

En la práctica, puedes pensar en `BlockProperties` como:

- un formato de almacenamiento para estado de bloque parcial
- una condición de emparejamiento para estado de bloque
- un conjunto de parámetros de reconstrucción para estado de bloque

<a id="example-flow"></a>

## Un flujo típico

La ruta de uso más común se parece a algo así:

```java
BlockState state = level.getBlockState(pos);
BlockProperties properties = BlockProperties.extract(state);

// save, send, or attach properties

BlockState restored = StateHolderAccess.apply(state.getBlock().defaultBlockState(), properties);
```

Si tu objetivo no es reconstruir un estado sino solo comprobarlo, entonces:

```java
boolean matches = properties.isSubsetOf(otherState);
```

Precisamente por eso `BlockProperties` aparece tantas veces en recetas, datos de visualización y transferencia entre sistemas.

<a id="serialization"></a>

## Por qué no usar simplemente `Map<String, String>`

Por supuesto, *podrías* guardar todo esto en un `Map<String, String>` simple.

Pero el valor de `BlockProperties` está en que ya unifica las piezas que importan en el desarrollo real:

- serialización JSON
- transporte por red
- adjuntar los datos a un `ItemStack` como Data Component
- visualización en tooltip
- emparejamiento de recetas o estructuras
- reconstrucción del estado mediante `StateHolderAccess.apply(...)`

Así que no estás usando "solo un mapa". Estás usando un formato de propiedades que el resto de Croparia IF ya entiende.

<a id="where-used"></a>

## Dónde lo encontrarás

Lugares comunes donde aparece:

- `BlockInput` y `BlockOutput` en la [Recipe API](../recipe/index.md#overview)
- pilas de visualización que necesitan recordar detalles del estado de bloque
- sistemas que necesitan persistir datos de `BlockState` entre distintos límites
- código que más tarde vuelve a aplicar esas propiedades sobre el estado real del mundo

Así que, si estás construyendo una estructura persistente alrededor del estado de bloque, suele ser mejor reutilizar este tipo que inventar otro formato paralelo.

<a id="state-holder-mixin"></a>

## Qué aporta `StateHolderMixin` aquí

Estas capacidades son posibles porque Croparia IF usa `StateHolderMixin` para adjuntar la interfaz `StateHolderAccess` sobre `StateHolder` vanilla.

Desde el punto de vista del usuario, no hace falta memorizar los detalles del mixin. Lo importante es:

- Croparia IF proporciona un puente extra para leer y escribir estado vanilla mediante nombres de propiedad en forma de cadena

Ese puente incluye principalmente:

- `cif$getValue(String key)`
- `cif$setValue(String key, String value)`
- `cif$getProperties()`
- `StateHolderAccess.apply(...)`

Así que `BlockProperties` no "sabe mágicamente cambiar estados". Funciona porque esta capa de acceso lo vuelve a conectar con el sistema de estados vanilla.

<a id="tips"></a>

## Consejos

- Cuando necesites describir parte de un estado de bloque, conviene preferir `BlockProperties`.
- Cuando necesites volver a aplicar propiedades guardadas sobre un `BlockState` real, usa `StateHolderAccess.apply(...)`.
- Si solo necesitas inspeccionar un `BlockState` temporalmente dentro de una función, el acceso vanilla suele ser suficiente.
- Si un sistema necesita tanto persistencia como emparejamiento o reaplicación, `BlockProperties` es mucho más estable que un `Map<String, String>` sin más.

