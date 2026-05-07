---
title: Recetas y estructuras
desc: Presenta los formatos de datos, el significado de los campos y ejemplos de escritura para Infusor, Ritual, Soak y Ritual Structure en Croparia IF 1.1.0a.
keywords:
  - Croparia IF
  - 1.1.0a
  - modpack
  - recetas
  - estructuras
  - infusor
  - ritual
  - soak
  - ritual_structure
  - estructura ritual
navOrder: 30
---

# Recetas y estructuras

En este momento, los cuatro tipos de datos principales más relevantes para los autores de modpacks de Croparia IF son:

- `croparia:infusor`
- `croparia:ritual`
- `croparia:soak`
- `croparia:ritual_structure`

Esta página explica cómo se escriben estas recetas y estructuras. Si necesitas generar datos en lote, continúa con el [Sistema de generación de datos en tiempo de ejecución](./generator/index.md) y [Crear un generador de datos](./generator/create-generator.md).

<a id="entry-shapes"></a>

## Formas compartidas de entrada y salida

Estos tipos de receta reutilizan mucho `ItemInput`, `ItemOutput`, `BlockInput` y `BlockOutput`. En la mayoría de los casos admiten tanto una forma abreviada como una forma de objeto.

<a id="item-input"></a>

### Entrada de objeto `ItemInput`

Forma abreviada:

- Cadena con ID de objeto: `"minecraft:comparator"`
- Cadena con etiqueta: `"#croparia:seed_ingredient"`

Forma de objeto:

```json
{
  "id": "minecraft:comparator",
  "amount": 1,
  "components": {}
}
```

- `id: string` coincide con un ID de objeto único
- `tag: string` coincide con una etiqueta de objeto
- `components: Map<String, T>` componentes opcionales del objeto
- `amount: number` cantidad opcional del objeto; por defecto es 1

`id` y `tag` no pueden especificarse al mismo tiempo.

<a id="item-output"></a>

### Salida de objeto `ItemOutput`

Forma abreviada:

- Cadena con ID de objeto: `"croparia:croparia"`

Forma de objeto:

```json
{
  "id": "croparia:croparia",
  "amount": 1,
  "components": {}
}
```

- `id: string` coincide con un ID de objeto único
- `components: Map<String, T>` componentes opcionales del objeto
- `amount: number` cantidad opcional del objeto; por defecto es 1

<a id="block-input"></a>

### Entrada de bloque `BlockInput`

Forma abreviada:

- Cadena con ID de bloque: `"minecraft:sculk"`
- Cadena con etiqueta: `"#croparia:ritual_stands"`

Forma de objeto:

```json
{
  "id": "croparia:block_crop_coal",
  "properties": {
    "age": "7"
  }
}
```

- `id: string` coincide con un ID de bloque único
- `tag: string` coincide con una etiqueta de bloque
- `properties: Map<String, string>` restricciones opcionales del estado del bloque

`id` y `tag` no pueden especificarse al mismo tiempo.

<a id="block-output"></a>

### Salida de bloque `BlockOutput`

Forma abreviada:

- Cadena con ID de bloque: `"minecraft:end_stone"`

Forma de objeto:

```json
{
  "id": "minecraft:oak_log",
  "properties": {
    "axis": "y"
  }
}
```

- `id: string` coincide con un ID de bloque único
- `properties: Map<String, string>` estados opcionales del bloque de salida

<a id="infusor"></a>

## Receta de Infusor `croparia:infusor`

- `element: string` exige que el Infusor contenga actualmente ese elemento y no puede ser `empty`
- `ingredient: [ItemInput](#item-input)` objeto de entrada que debe soltarse sobre el Infusor o colocarse en él
- `result: [ItemOutput](#item-output)` salida de objeto producida al tener éxito

Ejemplo:

```json
{
  "type": "croparia:infusor",
  "element": "elemental",
  "ingredient": {
    "tag": "croparia:seed_ingredient",
    "amount": 4
  },
  "result": {
    "id": "croparia:croparia",
    "amount": 1
  }
}
```

<a id="ritual"></a>

## Receta ritual `croparia:ritual`

- `ritual: string` nivel o etiqueta requerida del Atril ritual central
- `block: [BlockInput](#block-input)` bloque de entrada que debe colocarse en las posiciones marcadas con `$` en la estructura
- `ingredient: [ItemInput](#item-input)` objeto de entrada que debe soltarse sobre el Atril ritual o colocarse en él
- `result: [ItemOutput](#item-output)` objeto de salida producido cuando la receta tiene éxito

Ejemplo mínimo:

```json
{
  "type": "croparia:ritual",
  "ritual": "#croparia:ritual_stands",
  "ingredient": "minecraft:comparator",
  "block": "minecraft:sculk",
  "result": "minecraft:sculk_sensor"
}
```

Aquí hay dos detalles importantes:

- `ritual` no describe la estructura completa; solo describe el propio Atril ritual central
- La forma multibloque real la define la [Estructura ritual](#ritual-structure)

En otras palabras, una `RitualRecipe` solo puede funcionar si la `RitualStructure` correspondiente también se valida correctamente.

<a id="soak"></a>

## Receta de remojo elemental `croparia:soak`

- `element: string` elemento actual del Infusor situado encima, y no puede ser `empty`
- `probability: [number](./generator/placeholder.md#number)` probabilidad de éxito de este intento de remojo, como decimal entre 0 y 1
- `input: [BlockInput](#block-input)` bloque de entrada que va a ser remojado
- `output: [BlockOutput](#block-output)` bloque de salida en el que se convertirá si tiene éxito

Ejemplo:

```json
{
  "type": "croparia:soak",
  "element": "air",
  "input": "minecraft:stone",
  "output": "minecraft:end_stone",
  "probability": 1.0
}
```

El número real de intentos también está afectado por la opción `soakAttempts`, así que puede ser útil ajustarlo junto con [Configuración y comandos](./configuration-command.md#config-file).

<a id="ritual-structure"></a>

## Estructura ritual `croparia:ritual_structure`

`RitualStructure` no es una receta. Es la definición de la estructura multibloque usada por los Atriles rituales. Sus campos son:

- `ritual: string` indica a qué tipo de Atril ritual central pertenece esta estructura
- `keys: Map<String, BlockInput>` define qué significa cada carácter dentro de `pattern`
- `pattern: string[][]` una estructura 3D de caracteres que debe contener al menos un `*` y un `$`

Los caracteres reservados de `keys` no pueden mapearse directamente:

- `*`: posición del Atril ritual central, que debe coincidir con el `ritual` actual
- `$`: posiciones de bloques de entrada; cuando el ritual se ejecuta, esos bloques se comprueban y se destruyen al tener éxito
- `.`: solo aire
- ` `: cualquier bloque

La estructura de `pattern` es la siguiente:

- Capa exterior: lista de capas desde abajo hacia arriba
- Dentro de cada capa: patrón bidimensional organizado por filas
- Cada carácter: requisito de bloque en esa posición

Ejemplo integrado:

```json
{
  "type": "croparia:ritual_structure",
  "ritual": "croparia:ritual_stand",
  "keys": {
    "A": "minecraft:andesite",
    "D": "minecraft:diorite",
    "I": {
      "id": "croparia:block_crop_coal",
      "properties": {
        "age": "7"
      }
    }
  },
  "pattern": [
    [
      "         ",
      "    $    ",
      "   $ $   ",
      "    $    ",
      "         "
    ],
    [
      "   D D   ",
      "D  I I  D",
      " G  *  G ",
      "D  I I  D",
      "   D D   "
    ]
  ]
}
```
