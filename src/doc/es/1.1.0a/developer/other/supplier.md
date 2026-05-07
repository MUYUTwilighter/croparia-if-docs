---
title: Utilidades Supplier
desc: Explica Mappable, LazySupplier y OnLoadSupplier en Croparia IF, junto con su uso en cálculo diferido, caché y valores sensibles a recarga.
keywords:
  - Croparia IF
  - Mappable
  - LazySupplier
  - OnLoadSupplier
  - Supplier
  - carga diferida
  - recarga de datos
  - documentación para desarrolladores
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 60
---

# Utilidades Supplier

<a id="overview"></a>

Croparia IF ofrece varias pequeñas utilidades bajo `util.supplier` para situaciones que implican:

- creación diferida
- caché perezosa
- refresco automático tras recarga de datos
- transformaciones encadenadas sobre `Supplier`

Los tres tipos más usados son:

- `Mappable<T>`
- `LazySupplier<T>`
- `OnLoadSupplier<T>`

<a id="mappable"></a>

## `Mappable`

`Mappable<T>` es la capa más fina del grupo. Básicamente es un `Supplier<T>` que además soporta `map(...)`.

Su valor es:

- puedes seguir transformando el resultado final sin forzar su evaluación inmediata
- las APIs superiores no necesitan decidir demasiado pronto cómo debe ser el objeto final de visualización

En el código suele aparecer como:

- un item stack de estación de trabajo
- un objeto de visualización construido de forma perezosa

Es una interfaz muy pequeña, pero conserva espacio para transformaciones posteriores, algo especialmente útil en rutas de UI y de construcción diferida.

<a id="lazy-supplier"></a>

## `LazySupplier`

`LazySupplier<T>` es la caché perezosa clásica:

- construye el valor en el primer `get()`
- devuelve el valor en caché en los siguientes `get()`

Encaja bien cuando:

- construir el valor no es barato
- pero una vez calculado puede reutilizarse durante mucho tiempo

Este tipo de objeto aparece constantemente en Croparia IF, por ejemplo:

- algunas listas de display stacks
- valores derivados de registros o tags

Comparado con "recalcular cada vez", es más barato. Comparado con "construir de inmediato al cargar la clase", se enlaza más tarde al entorno real de ejecución.

<a id="on-load-supplier"></a>

## `OnLoadSupplier`

`OnLoadSupplier<T>` puede entenderse como un `LazySupplier` sensible a recargas.

Su diferencia principal frente a `LazySupplier` es:

- `LazySupplier`
  - una caché, válida hasta el final del proceso
- `OnLoadSupplier`
  - tras una recarga de datapacks, el siguiente `get()` reconstruye el valor

Croparia IF guarda el momento de la última recarga en `OnLoadSupplier.LAST_DATA_LOAD`, y `OnLoadSupplier` decide a partir de eso si su caché ha quedado obsoleta.

Eso lo hace especialmente útil para:

- cachés que dependen de tags, registros o contenido de datapacks
- valores que deberían refrescarse automáticamente tras una recarga sin obligar a cada punto de llamada a gestionar la invalidación a mano

<a id="when-to-use"></a>

## Cuál conviene usar

Una regla práctica bastante útil es:

- solo quieres construcción diferida y no te importa la recarga
  - `LazySupplier`
- quieres seguir encadenando transformaciones sobre un supplier
  - `Mappable`
- el valor depende de datapacks, tags o datos de ejecución sensibles a recarga
  - `OnLoadSupplier`

No son tanto herramientas en competencia como capas de una misma idea:

- `LazySupplier` implementa `Mappable`
- `OnLoadSupplier` extiende `LazySupplier`

Así que puede leerse como el mismo patrón con niveles crecientes de capacidad.

<a id="where-used"></a>

## Dónde los encontrarás

Estas utilidades aparecen con mayor frecuencia en:

- datos de display stacks y estaciones de trabajo dentro de la [Recipe API](../recipe/index.md#overview)
- colecciones en caché derivadas de cultivos, materiales, bloques, registros o tags
- objetos de tiempo de ejecución que dependen de resultados de carga de datapacks

Si un valor:

- no está disponible de forma segura al arrancar
- es demasiado caro o incómodo de recalcular cada vez
- y además puede quedar obsoleto tras una recarga

entonces `OnLoadSupplier` suele ser lo primero que merece la pena revisar.

<a id="tips"></a>

## Consejos

- No conviertas todos los `Supplier` en `LazySupplier`. Solo ayuda cuando "calcular más tarde" realmente encaja mejor con el ciclo de vida.
- Si el valor depende de tags o contenido de datapacks, conviene preferir `OnLoadSupplier`, porque las cachés obsoletas tras recarga se generan con mucha facilidad.
- Cuando necesites transformaciones encadenadas, conserva la forma `Mappable` el mayor tiempo posible en lugar de llamar a `get()` demasiado pronto y envolver de nuevo el resultado después.

