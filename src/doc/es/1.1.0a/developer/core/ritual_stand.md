---
title: Atril ritual
desc: Explica cómo el módulo del Atril ritual organiza su flujo en tiempo de ejecución alrededor de objetos soltados, validación de estructuras y recetas rituales, incluyendo su relación con DropsCache, contenedores de estructura y FakePlayer.
keywords:
  - Croparia IF
  - documentación para desarrolladores
  - RitualStand
  - RitualContainer
  - RitualStructureContainer
  - DropsCache
  - FakePlayer
  - 1.1.0a
navOrder: 40
---

# Atril ritual

<a id="overview"></a>

Igual que el Infusor, el Atril ritual es un módulo impulsado por objetos soltados. Sin embargo, es más complejo, porque no le importa solo "qué objetos se han soltado aquí", sino también:

- el estado actual del bloque Atril ritual
- si la estructura circundante es válida
- si existe una receta ritual legal bajo esa estructura

Así que, si el Infusor es "estado + recetas con objetos soltados", el Atril ritual está más cerca de "estado + estructura + recetas con objetos soltados".

<a id="module-role"></a>

## Función del módulo

Sus responsabilidades principales son:

- aceptar objetos colocados sobre el Atril ritual
- validar la estructura ritual circundante
- combinar el resultado de la estructura con los objetos soltados para emparejar `RitualRecipe`
- exportar el resultado y dar retroalimentación cuando el ritual tiene éxito

Así que el centro de este módulo no es el inventario ni la interfaz. Es la manera en que se construye el contexto de emparejamiento.

<a id="core-classes"></a>

## Clases principales

- `RitualStand`
  - el bloque en sí, y también un `ItemPlaceable`
- `RitualStructureContainer`
  - el contenedor usado para emparejar recetas de estructura
- `RitualContainer`
  - el contenedor usado para emparejar recetas rituales
- `DropsCache`
  - recopila los objetos soltados que participan en el ritual
- `FakePlayer`
  - simula el uso de objetos por parte de un jugador para resultados rituales especiales

Tampoco hay una block entity dedicada aquí, porque el estado central en tiempo de ejecución vive en "estado actual del mundo + objetos soltados actuales + estructura actual emparejada", y no en un inventario persistente.

<a id="entry-flow"></a>

## Flujo de entrada

Cuando el jugador hace clic derecho con un objeto, `RitualStand.useItemOn(...)`:

- bloquea la colocación directa desde el generador de recetas
- llama a `placeItem(...)` sobre el objeto de la mano principal

Igual que con el [Infusor](infusor.md#item-placeable), esta capa solo coloca objetos en el mundo.

La lógica ritual real comienza en `stepOn(...)`:

1. ejecutarse solo en el servidor
2. verificar que la función esté habilitada
3. aplicar limitación mediante `DropsCache.isQueried(...)`
4. comenzar el emparejamiento de estructura y receta

La existencia de `CRAFT_INTERVAL` te dice algo importante sobre el diseño:

- se espera que los objetos soltados en la misma posición activen colisiones repetidas en poco tiempo
- hace falta limitar la frecuencia para evitar procesar una misma entrada una y otra vez

<a id="matching-flow"></a>

## Flujo de emparejamiento

Esta es la parte más importante del módulo para entender.

### Paso 1: emparejamiento de estructura

La implementación ejecuta primero:

- `Recipes.RITUAL_STRUCTURE.find(new RitualStructureContainer(level.getBlockState(pos)), level)`

Eso significa que el emparejamiento de estructura mira primero solo el estado actual del Atril ritual y el mundo circundante.

Si encuentra una definición de estructura, el código continúa con:

- `structure.validate(pos, level)`

Ese segundo paso es el que realmente decide si la estructura en la posición actual es válida.

### Paso 2: emparejamiento de receta ritual

Solo después de que la validación de la estructura tenga éxito, el código construye:

- `RitualContainer.of(level.getBlockState(pos), DropsCache.queryStacks(world, pos), matched)`

Luego ejecuta:

- `Recipes.RITUAL.find(matcher, level)`

Así que el contexto de emparejamiento de `RitualRecipe` contiene al menos tres clases de datos:

- el estado actual del bloque Atril ritual
- el conjunto actual de objetos soltados
- el resultado de estructura que ya ha emparejado con éxito

Esa es la razón principal por la que el Atril ritual es más complejo que el Infusor.

<a id="result-flow"></a>

## Gestión del resultado

Cuando un ritual tiene éxito, el flujo por defecto es:

1. construir el resultado con `ritual.assemble(...)`
2. exportarlo mediante `CifUtil.exportItem(...)`
3. reproducir el sonido de finalización del ritual

También hay una rama especial importante:

- si el objeto resultado es un `SpawnEggItem`
- entonces el módulo usa [FakePlayer](fake-player.md#overview) mediante `useAllItemsOn(...)`

Eso significa que algunos resultados rituales no se tratan como "soltar este objeto y terminar". En lugar de eso, continúan hacia "usar este objeto de la forma en que lo haría un jugador".

Así que, si estás intentando entender por qué ciertos resultados rituales se comportan más como acciones que como simples salidas de objetos, esta es la rama que conviene inspeccionar primero.

<a id="feedback"></a>

## Retroalimentación al jugador

`RitualStand` también ofrece una retroalimentación bastante completa en las rutas de fallo:

- estructura ausente
  - `overlay.croparia.ritual.404`
- estructura inválida
  - `overlay.croparia.ritual.bad`
- estructura válida, pero sin receta ritual compatible
  - `overlay.croparia.ritual.rejected`

Estas superposiciones se envían mediante `tryTell(...)` a jugadores cercanos relacionados con los objetos soltados.

Eso merece atención desde la perspectiva del diseño, porque muestra que:

- el Atril ritual trata "por qué falló" como parte del comportamiento del módulo
- no todos los módulos están diseñados solo alrededor de su ruta de éxito

<a id="drops-cache"></a>

## Por qué también depende de `DropsCache`

El Atril ritual usa `DropsCache` igual que el Infusor, pero aquí la dependencia es todavía más importante.

En este módulo, `DropsCache` no solo evita lecturas repetidas. También es lo que estabiliza "el conjunto de entrada para este intento ritual". Sin eso, el emparejamiento ritual determinista después de validar la estructura sería mucho más difícil.

Si quieres construir cualquier sistema impulsado por "objetos soltados + estructura del mundo", algún tipo de caché más limitación de frecuencia casi siempre resulta necesario.

<a id="extension"></a>

## Notas de extensión

- Al ampliar la lógica ritual, separa primero si estás cambiando el emparejamiento de estructuras o el de recetas.
- Si quieres más comportamientos especiales de resultado, mira primero la rama de `SpawnEggItem` y pregúntate si puede convertirse en una capa de ejecución más general.
- Si construyes un módulo parecido, mantén la validación de estructura y el emparejamiento de recetas como dos fases distintas, en lugar de fusionarlas en una sola comprobación.
- Si estás depurando un ritual que no funciona, sigue este orden: ¿existe la definición de estructura?, ¿la estructura valida?, ¿los objetos soltados entran en `DropsCache`?, ¿la receta ritual encaja?

