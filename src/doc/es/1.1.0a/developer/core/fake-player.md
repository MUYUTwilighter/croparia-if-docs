---
title: FakePlayer
desc: Explica cómo el FakePlayer de Croparia IF ejecuta lógica de uso de objetos del lado del servidor y dónde encaja dentro de módulos como el Atril ritual.
keywords:
  - Croparia IF
  - documentación para desarrolladores
  - FakePlayer
  - RitualStand
  - SpawnEggItem
  - useAllItemsOn
  - 1.1.0a
navOrder: 50
---

# FakePlayer

<a id="overview"></a>

`FakePlayer` es un pequeño pero muy práctico componente de ejecución dentro de la capa `core` de Croparia IF.

El problema que resuelve no es "fingir una entidad de jugador completa", sino algo mucho más concreto:

- cuando un módulo principal necesita usar un objeto sobre un bloque igual que lo haría un jugador, ¿cómo debería ejecutarse eso de forma segura en el servidor?

Su lugar de uso más típico en este momento es el [Atril ritual](ritual_stand.md#result-flow), por eso encaja mejor dentro de `core` que en una página puramente utilitaria.

<a id="core-idea"></a>

## Idea básica

`FakePlayer` hereda de `Player`, pero su propósito real no es participar en el bucle normal del juego. En su lugar, expone unas cuantas entradas estáticas:

- `getPlayer(...)`
- `useItemOn(...)`
- `finishUseItem(...)`
- `useAllItemsOn(...)`

Puedes entenderlo como:

- una instancia de jugador falso almacenada por dimensión
- más una capa de ayuda para simular el uso de objetos por parte de un jugador en nombre de módulos

Lo más importante que conviene notar es que simula la semántica de "un jugador usa un objeto", no "genera un drop" o "llama directamente a un método interno del bloque".

<a id="usage-flow"></a>

## Flujo de uso

### `getPlayer(ServerLevel)`

Devuelve la instancia de jugador falso en caché para una dimensión.

La implementación mantiene un `Map<ServerLevel, FakePlayer>`, lo que significa:

- una dimensión reutiliza una sola instancia de fake player
- los módulos no necesitan crear un jugador nuevo cada vez

### `useItemOn(ServerLevel, BlockPos, ItemStack)`

Mueve al fake player por encima del bloque objetivo y después:

- coloca la pila en la mano principal
- construye un `UseOnContext`
- llama a `item.useOn(context)`

Esta es la simulación central de "un jugador usa este objeto sobre ese bloque".

### `finishUseItem(ItemStack, ServerLevel)`

Llama a `item.finishUsingItem(world, fakePlayer)` y devuelve el resto.

Esto importa porque algunos objetos no quedan descritos por completo solo con `useOn(...)`. Los restos tras el uso y el comportamiento posterior también forman parte de su semántica.

### `useAllItemsOn(...)`

Esta es la entrada de alto nivel más habitual.

Hará lo siguiente:

1. intentar hasta `MAX_USES` veces
2. llamar repetidamente a `useItemOn(...)`
3. si el resultado no es ni `FAIL` ni `PASS`
4. continuar con `finishUseItem(...)`
5. recopilar todos los restos y devolverlos

Así que esto no significa "usar el objeto una sola vez". Significa "seguir usando esta pila mientras se comporte como un objeto utilizable".

<a id="ritual-stand"></a>

## Papel dentro del Atril ritual

El Atril ritual contiene una rama especial al manejar resultados rituales:

- si el objeto resultado es un `SpawnEggItem`
- no lo exporta simplemente como un objeto soltado normal
- en su lugar llama a `FakePlayer.useAllItemsOn(...)`

Eso significa que el resultado ritual se trata como algo que realmente debe ejecutar su comportamiento de interacción con el mundo, y no simplemente existir como salida de objeto.

Para desarrolladores, esta es una distinción importante porque cambia la forma de pensar los resultados rituales:

- algunos resultados significan "producir este objeto"
- otros significan "ejecutar la acción que un jugador realizaría con este objeto"

`FakePlayer` es el puente que conecta la segunda categoría con la cadena de interacción vanilla.

<a id="behavior-boundaries"></a>

## Límites de comportamiento

`FakePlayer` no es un sustituto completo de un jugador, y el código mantiene su papel deliberadamente estrecho:

- `isSpectator()` siempre devuelve `false`
- `isCreative()` siempre devuelve `false`
- `gameMode()` queda fijado en `SURVIVAL`

Eso te dice que su objetivo no es simular todos los modos de jugador. Su objetivo es ejecutar de la forma más predecible posible la ruta de "un jugador en supervivencia usa un objeto".

Del mismo modo, su forma de interacción está fijada:

- desde encima del bloque objetivo
- con `Direction.UP`
- usando `useOn` contra ese bloque

Así que, si esperas comportamiento complejo de cámara, diferentes caras de interacción o emulación completa de entrada, eso ya queda fuera del límite de diseño de esta utilidad.

<a id="when-to-use"></a>

## Cuándo usarlo

Buenos casos:

- tu módulo realmente necesita activar la ruta vanilla de "un jugador usa este objeto sobre un bloque"
- necesitas obtener el resto que queda tras usar el objeto
- quieres reutilizar la semántica existente del objeto en lugar de reescribirla

Casos menos adecuados:

- solo quieres generar un objeto de salida simple
- solo quieres llamar directamente al método interno de procesamiento de un módulo
- necesitas detalles muy concretos de entrada del jugador o simulación de interacción por varias caras

<a id="tips"></a>

## Consejos

- Si al módulo realmente le importa "qué ocurre cuando un jugador usa este objeto", `FakePlayer` suele encajar mejor que escribir aproximaciones manuales.
- Si solo te importa el objeto final, puede que no necesites `FakePlayer`; su valor aparece sobre todo en objetos con verdadera semántica de uso.
- Al conectar `FakePlayer` a un módulo principal, trátalo como una rama especial, igual que hace el Atril ritual, y no como la ruta por defecto.
- Si más adelante añades más objetos resultado orientados a comportamiento, `useAllItemsOn(...)` es la capa adecuada para abstraer antes de repetir `useOn + finishUsingItem` en cada módulo.

