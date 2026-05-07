---
title: Infusor
desc: Explica el módulo del Infusor, incluyendo el estado del bloque, la infusión elemental, las recetas basadas en objetos soltados y su integración con ItemPlaceable, para que los desarrolladores entiendan su flujo completo.
keywords:
  - Croparia IF
  - documentación para desarrolladores
  - Infusor
  - ElementalPotion
  - InfusorRecipe
  - DropsCache
  - ItemPlaceable
  - 1.1.0a
navOrder: 30
---

# Infusor

<a id="overview"></a>

El Infusor es el ejemplo más típico de Croparia IF de un módulo "impulsado por estado de bloque + recetas con objetos soltados".

Comparado con el Invernadero, pone mucho más énfasis en el procesamiento de recetas. Comparado con el Transmutador de cultivos, depende mucho menos del flujo de interfaz. Resulta especialmente útil para entender:

- cómo participa un estado de bloque en el emparejamiento de recetas
- por qué los objetos soltados necesitan trabajar junto con `DropsCache`
- cómo `ItemPlaceable` adquiere sentido dentro de un módulo real

<a id="module-role"></a>

## Función del módulo

El Infusor tiene realmente dos capas de responsabilidad:

- cambiarse a sí mismo a un estado elemental específico mediante Pociones elementales
- una vez que tiene un elemento, tratar los objetos soltados sobre él como entrada de receta para `InfusorRecipe`

Así que no es una relación simple de "bloque fijo + recetas fijas". En cambio:

- el estado del bloque determina el elemento actual
- y ese elemento actual pasa a formar parte del emparejamiento posterior de recetas

<a id="core-classes"></a>

## Clases principales

- `Infusor`
  - el bloque en sí, y además un `ItemPlaceable`
- `ElementalPotion`
  - puede infusionar o desinfusionar un `Infusor` directamente
- `InfusorRecipe`
  - el tipo real de receta
- `InfusorContainer`
  - el contenedor de contexto usado durante el emparejamiento
- `DropsCache`
  - recopila y almacena temporalmente objetos soltados cerca del bloque

Este conjunto no necesita una block entity dedicada, porque su estado en tiempo de ejecución es lo bastante simple como para vivir por completo dentro del estado del bloque.

<a id="block-state"></a>

## Estado del bloque

El campo de estado más importante es:

- `ELEMENT`

Es un `EnumProperty<Element>` cuyo valor por defecto es `Element.EMPTY`.

Eso significa:

- cuando el bloque está en estado `EMPTY`, no participa en recetas reales de infusión
- cuando contiene un elemento concreto, los objetos soltados sobre él pueden entrar en el emparejamiento de recetas

Así que la primera idea importante al leer este módulo es:

- las condiciones de receta del Infusor no dependen solo de los objetos de entrada
- también dependen del estado actual del propio bloque

<a id="player-flow"></a>

## Flujo de interacción del jugador

`useItemOn(...)` cubre las tres interacciones principales del jugador con este módulo.

### Infusión elemental

Si el jugador sostiene una `ElementalPotion`, el Infusor intenta primero `tryInfuse(...)`.

Si tiene éxito:

- cambia el estado del bloque al elemento correspondiente
- reproduce el sonido de infusión
- consume la poción
- devuelve la botella vacía u otro resto

### Desinfusión

Si el bloque ya tiene un elemento, y el objeto sostenido coincide con el `crafting remainder` de la poción de ese elemento, el flujo pasa por `tryDefuse(...)`.

Si tiene éxito:

- reinicia el estado del bloque a `Element.EMPTY`
- consume el objeto sostenido
- devuelve la poción elemental

### Soltar un objeto sobre el bloque

Si el objeto no es el generador de recetas ni forma parte de las interacciones elementales anteriores, el bloque llama a `placeItem(...)` para soltar el objeto en su centro.

Esto importa porque conecta directamente el Infusor con la ruta unificada de colocación de objetos de [ItemPlaceable](../other/item-placeable.md#integration-chain).

<a id="recipe-flow"></a>

## Flujo de procesamiento de recetas

La lógica real de recetas no ocurre en `useItemOn(...)`. Ocurre en `stepOn(...)`.

Cuando un `ItemEntity` pisa el bloque, `Infusor.stepOn(...)`:

1. verifica que el mundo esté en el lado del servidor
2. verifica que la función esté habilitada en la configuración
3. lee el elemento actual del bloque
4. pasa los objetos soltados más el elemento a `tryCraft(...)`

Después `tryCraft(...)` continúa:

1. recopilar drops cercanos con `DropsCache.queryStacks(...)`
2. construir un `InfusorContainer`
3. buscar una receta compatible con `Recipes.INFUSOR.find(...)`
4. si encuentra una, ejecutar `onCrafting(...)`

`onCrafting(...)`:

- ensambla el resultado de la receta
- lo exporta con `CifUtil.exportItem(...)`
- reinicia el estado del bloque al valor por defecto
- reproduce el sonido de fabricación

El punto clave del diseño es:

- jugadores y dispensadores solo entregan objetos al mundo
- el emparejamiento real de la receta ocurre después de que esos objetos hayan entrado al mundo como entidades soltadas

<a id="drops-cache"></a>

## Por qué depende de `DropsCache`

A primera vista, podría parecer que el Infusor solo necesita el `ItemEntity` que está tocando el bloque en ese momento. Pero la implementación no funciona así. Usa `DropsCache` para reunir los drops cercanos dentro de un único contexto de emparejamiento.

La razón es sencilla:

- una receta de infusión puede requerir más de un objeto soltado
- varios objetos soltados pueden necesitar participar en el mismo tick
- si cada entidad se manejara por separado, el emparejamiento podría duplicarse o perder contexto

Así que `DropsCache` actúa como la capa temporal que convierte "entidades soltadas cercanas en el mundo" en "el conjunto de entrada para una evaluación de receta".

<a id="item-placeable"></a>

## Relación con `ItemPlaceable`

El valor de implementar `ItemPlaceable` aquí no es solo ahorrar unas líneas de código de generación de entidades de objeto. Lo conecta con toda una cadena de interacción:

- los jugadores pueden hacer clic derecho para colocar objetos directamente sobre el bloque
- el comportamiento de dispensador de `ElementalPotion` cae de vuelta a `Infusor.placeItem(...)` cuando no ocurre ninguna infusión
- `DropperBlockMixin` también puede redirigir la salida de un dropper hacia él

Eso significa que el módulo tiene una historia de entrada unificada:

- tanto si el objeto viene de un jugador, de un dropper o de un dispensador
- termina convirtiéndose en un `ItemEntity` soltado sobre el bloque
- luego `stepOn(...)` y la capa de recetas lo procesan con una sola ruta coherente

Este es uno de los usos reales más claros de `ItemPlaceable` en todo el código.

<a id="extension"></a>

## Notas de extensión

- Si quieres cambiar cómo funciona el cambio de estado elemental, empieza por `tryInfuse(...)` y `tryDefuse(...)`.
- Si quieres cambiar la semántica del emparejamiento de recetas, revisa `InfusorContainer` e `InfusorRecipe` antes de tocar la capa de interacción del jugador.
- Si quieres estudiar cómo construir una máquina de recetas basada en objetos soltados, este módulo es más fácil de abordar que el Atril ritual.
- Si quieres soportar nuevas vías de entrega, intenta conservar la cadena principal `ItemPlaceable -> ItemEntity -> stepOn(...)`.

