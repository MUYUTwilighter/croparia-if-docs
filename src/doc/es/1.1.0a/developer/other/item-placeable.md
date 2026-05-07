---
title: ItemPlaceable
desc: Explica la interfaz ItemPlaceable de Croparia IF y cómo unifica el comportamiento de colocar un objeto en el mundo como ItemEntity sobre un bloque objetivo.
keywords:
  - Croparia IF
  - ItemPlaceable
  - ItemEntity
  - colocar objeto
  - Dropper
  - Dispenser
  - ElementalPotion
  - Infusor
  - Atril ritual
  - RitualStand
  - DropsCache
  - documentación para desarrolladores
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 40
---

# ItemPlaceable

<a id="overview"></a>

`ItemPlaceable` es una interfaz muy pequeña, pero resuelve un problema muy concreto:

- algunos bloques necesitan "colocar un objeto en el mundo" en lugar de simplemente expulsar un stack como drop normal desde un contenedor

Croparia IF la usa para unificar el acto de convertir un `ItemStack` en un `ItemEntity` sobre una posición objetivo, y luego engancha ese comportamiento a varias cadenas de interacción ya existentes.

<a id="core-idea"></a>

## Idea básica

`ItemPlaceable` solo define un método por defecto:

- `placeItem(Level world, BlockPos pos, ItemStack stack, @Nullable Entity owner)`

Su comportamiento aproximado es:

- si se ejecuta en cliente, no hace nada
- si la posición objetivo recibe redstone, coloca todo el stack de una vez
- en caso contrario, coloca solo un objeto
- crea el `ItemEntity` correspondiente
- registra el lanzador si existe owner
- añade la entidad al mundo

Con esto, "colocar un objeto en el mundo" obtiene una convención compartida en vez de obligar a cada bloque a reescribir la misma lógica una y otra vez.

También conviene recordar un límite importante:

- `ItemPlaceable` no modifica directamente el estado del bloque
- su trabajo es solo colocar un objeto de forma controlada encima del bloque objetivo
- el efecto real posterior suele manejarlo más tarde el propio bloque con `stepOn(...)`, `useItemOn(...)` u otra lógica de interacción

Así que la mejor forma de leer `ItemPlaceable` es como una entrada común para entregar de forma segura un objeto dentro del rango de interacción de un bloque.

<a id="where-used"></a>

## Dónde se usa

Los sitios de uso más típicos en el código incluyen:

- [Infusor](../core/infusor.md#overview)
- [Atril ritual](../core/ritual_stand.md#overview)
- `ElementalPotion` al interactuar con ciertos bloques objetivo
- tratamiento especial dentro de `DropperBlockMixin`

En otras palabras, `ItemPlaceable` expresa:

- "este bloque sabe recibir un objeto como algo colocado en el mundo"

Aporta más semántica que un drop simple, y además es mucho más coherente que escribir por separado el flujo de clic derecho, dropper y dispenser para cada bloque.

<a id="integration-chain"></a>

## Cadena real de integración

`ItemPlaceable` ya está conectado con varios mecanismos existentes del código.

### `DropperBlockMixin`

`DropperBlockMixin` comprueba el bloque que hay delante del dropper:

- si ese bloque implementa `ItemPlaceable`
- deja de usar la ruta vanilla normal de expulsión
- y en su lugar llama a `placeItem(...)`

Eso significa que:

- en cuanto tu bloque implementa `ItemPlaceable`
- puede recibir directamente la salida del dropper
- sin necesitar una segunda integración especial solo para droppers

### `ElementalPotion`

`ElementalPotion` registra su propio comportamiento de dispenser.

Su lógica sigue este orden:

1. si el objetivo es un `Infusor`, primero intenta `tryInfuse(...)`
2. si la infusión falla, vuelve a `Infusor.placeItem(...)`
3. si el objetivo implementa `ItemPlaceable`, llama directamente a `placeItem(...)`
4. si no, vuelve al comportamiento vanilla por defecto del dispenser

Así que `ItemPlaceable` no es solo una interfaz para el clic derecho. También funciona como la marca que significa "este bloque puede recibir un objeto lanzado contra él".

### `Infusor` y `Atril ritual`

Tanto `Infusor` como `Atril ritual` implementan `ItemPlaceable`, pero su lógica real de recetas no ocurre dentro de `placeItem(...)`.

Su flujo real se parece más a esto:

1. `useItemOn(...)`, droppers o dispensers colocan un objeto en el centro del bloque
2. el mundo genera un `ItemEntity`
3. el bloque detecta esa entidad en `stepOn(...)`
4. solo entonces `DropsCache`, el emparejamiento de recetas o el emparejamiento de estructuras toman el control

Así que `ItemPlaceable` se encarga de "entregar el objeto a la posición correcta", no de "terminar la receta inmediatamente".

<a id="when-to-use"></a>

## Cuándo usarlo

Buenos casos para implementar `ItemPlaceable`:

- el bloque necesita aceptar objetos entregados como entidades del mundo sobre él
- quieres que lógica existente como `DropperBlockMixin` o `ElementalPotion` lo detecte automáticamente
- el procesamiento real encaja mejor en `stepOn(...)`, detección de entidades o emparejamiento de recetas
- quieres reutilizar el comportamiento de colocación sensible a redstone que ya tiene Croparia IF

Si tu bloque no necesita este tipo de semántica de "entidad de objeto colocada" en absoluto, entonces implementarlo solo por consistencia no merece la pena.

<a id="tips"></a>

## Consejos

- Cuando varios bloques necesitan recibir objetos expulsados, conviene unificar ese comportamiento mediante `ItemPlaceable` en lugar de escribir lógica separada para clic derecho, dropper y dispenser cada vez.
- Si sobrescribes la implementación por defecto, decide primero si los llamadores dependen del significado general "este bloque puede recibir objetos colocados" o del comportamiento concreto actual de "stack completo con redstone, objeto único sin ella".
- Si la lógica real del sistema empieza solo después de que el drop entra en el mundo, mantén la lógica pesada en la capa de detección de entidades del bloque y deja `ItemPlaceable` como una entrada ligera.
- Esta interfaz es más un contrato de interacción con el mundo que una utilidad directa de colocación de estados de bloque; las implementaciones son más mantenibles cuando ese significado sigue siendo evidente.

