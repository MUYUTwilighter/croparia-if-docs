---
title: Tipos predefinidos de entrada y salida
desc: Explicación de ItemInput, ItemOutput, BlockInput y BlockOutput en la Recipe API de Croparia IF, junto con las situaciones en las que cada uno encaja mejor.
keywords:
  - Croparia IF
  - Recipe API
  - ItemInput
  - ItemOutput
  - BlockInput
  - BlockOutput
  - SlotDisplay
  - entrada y salida de recetas
  - documentación para desarrolladores
modVersions:
  - 1.1.0a
navOrder: 10
---

# Tipos predefinidos de entrada y salida

<a id="overview"></a>

Croparia IF incluye varias estructuras predefinidas de entrada y salida dentro de la Recipe API para resolver dos problemas recurrentes:

- las representaciones vanilla de entradas y salidas no son especialmente estables y no siempre encajan con las necesidades de Croparia IF
- el emparejamiento de recetas, la visualización en JEI o REI y la serialización JSON se benefician de compartir el mismo modelo de objetos

Los cuatro tipos más usados son:

- `ItemInput`
- `ItemOutput`
- `BlockInput`
- `BlockOutput`

Todos implementan `SlotDisplay`, así que no son solo contenedores de datos. También pueden proporcionar directamente iconos y pilas candidatas para mostrar recetas.

<a id="mental-model"></a>

## Modelo mental

La forma más simple de leer estos cuatro tipos es:

- `ItemInput`
  - cómo se emparejan las entradas de objetos
- `ItemOutput`
  - cómo se describen las salidas de objetos
- `BlockInput`
  - cómo se emparejan las entradas de bloques o estados de bloque
- `BlockOutput`
  - cómo se describen las salidas de estado de bloque

Los tipos del lado de entrada suelen enfatizar:

- lógica de emparejamiento
- soporte de etiquetas
- restricciones de componentes o propiedades
- requisitos de cantidad

Los tipos del lado de salida suelen enfatizar:

- qué se produce finalmente
- cómo debe mostrarse
- cómo puede reconstruirse en `ItemStack` o `BlockState`

<a id="item-input-output"></a>

## `ItemInput` y `ItemOutput`

`ItemInput` y `ItemOutput` giran ambos alrededor de `ItemStack`, pero cumplen tareas distintas.

`ItemInput` se centra en el emparejamiento:

- puede emparejar por `id`
- puede emparejar por `tag`
- puede incluir `DataComponentPatch`
- puede exigir una `amount` mínima

También incluye métodos orientados al tiempo de ejecución como:

- `matches(...)`
- `matchType(...)`
- `consume(...)`
- `getDisplayStacks()`

Eso significa que `ItemInput` no es solo un descriptor estático. Ya incorpora lógica de validación y consumo de entrada.

`ItemOutput` se centra en la producción:

- `id` del objeto de salida
- componentes adjuntos
- cantidad
- conversión de vuelta a `ItemSpec` o `ItemStack`

Si solo necesitas "¿qué objeto recibe el jugador al final?", `ItemOutput` suele bastar. Si necesitas "¿cómo debe emparejarse y consumirse la entrada?", entonces la herramienta correcta es `ItemInput`.

<a id="block-input-output"></a>

## `BlockInput` y `BlockOutput`

El lado de bloques es parecido al de objetos, pero añade la dimensión de las propiedades de estado del bloque.

`BlockInput` se centra en emparejar bloques o estados de bloque:

- puede emparejar por `id`
- puede emparejar por `tag`
- puede incluir `BlockProperties`
- soporta casos especiales como "cualquier bloque"

También implementa `LootItemCondition`, así que puede reutilizarse directamente en algunos contextos relacionados con comprobaciones de bloques o drops.

`BlockOutput` se centra en producir un estado de bloque objetivo:

- almacena el `id` del bloque objetivo
- almacena `BlockProperties`
- puede reconstruir una pila de visualización
- puede colocar el bloque directamente en el mundo mediante `setBlock(...)`

Si el resultado final de una receta es "colocar este estado de bloque en el mundo", `BlockOutput` resulta mucho más cómodo que escribir a mano `Identifier + properties`.

<a id="codecs"></a>

## Por qué estos tipos incluyen codecs

Estos tipos predefinidos suelen incluir:

- `CODEC_STR`
- `CODEC_COMP`
- `CODEC`
- `STREAM_CODEC`

La idea de diseño detrás de eso es:

- deben soportarse tanto las formas abreviadas como las formas completas
- la sincronización de red y la E/S JSON deberían reutilizar la misma estructura

Por ejemplo, `ItemInput` soporta tanto una cadena abreviada como una forma completa de objeto. Internamente, esa compatibilidad se coordina mediante [MultiCodec](../codec/multi-codec.md#overview) y [TestedCodec](../codec/tested-codec.md#overview).

Así que la Recipe API y la [Codec API](../codec/index.md#overview) están pensadas para trabajar juntas directamente.

<a id="display"></a>

## `SlotDisplay`

Todos estos tipos predefinidos implementan `SlotDisplay`. Para los desarrolladores, eso significa que no solo participan en el emparejamiento de recetas, sino también en la visualización de la interfaz de recetas.

El resultado más visible es:

- JEI y REI pueden obtener pilas de visualización directamente desde ellos
- la clase de receta no necesita mantener un segundo modelo de datos solo para mostrar

Ese diseño reduce mucho la separación habitual entre "objetos de lógica" y "objetos de visualización."

<a id="when-to-use"></a>

## Cuándo conviene preferir estos tipos predefinidos

Buenos casos:

- la receta realmente se centra en objetos o bloques
- quieres que JSON, el emparejamiento en tiempo de ejecución y la visualización en JEI o REI compartan una misma estructura
- quieres reutilizar la compatibilidad entre formas abreviadas y completas que ya trae Croparia IF

Casos menos adecuados:

- la entrada o salida de tu receta no gira en torno a objetos o bloques, sino a algún recurso personalizado más abstracto
- solo necesitas una estructura interna muy pequeña que nunca se mostrará

En el primer caso, normalmente conviene definir un nuevo tipo de entrada propio y modelar su codec e interfaz de visualización tomando estas estructuras como referencia.

<a id="tips"></a>

## Consejos

- Separa pronto los "objetos de emparejamiento de entrada" de los "objetos descriptivos de salida". No intentes hacer que `ItemOutput` cargue con validación de entrada.
- Si la receta necesita tanto emparejamiento como visualización, reutilizar estos tipos predefinidos suele ser más limpio que envolverlos en otro DTO.
- Si tu JSON debe soportar tanto forma abreviada como forma completa, estudia primero estos codecs en lugar de empezar desde cero.
- Cuando más adelante integres JEI o REI, usar estos tipos predefinidos ya elimina buena parte del trabajo de adaptación.

Una vez definido el modelo de entradas y salidas, el siguiente paso suele ser la [integración con JEI](jei.md#overview) o con [REI](rei.md#overview).

