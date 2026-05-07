---
title: Crear generadores personalizados del Asistente de recetas
desc: Presenta los directorios, campos, placeholders de extensión y el flujo real de escritura de generadores personalizados del Asistente de recetas en Croparia IF 1.1.0a.
keywords:
  - Croparia IF
  - 1.1.0a
  - Asistente de recetas
  - generadores personalizados del Asistente de recetas
  - recipe_wizard
  - generator
  - placeholder
  - template
  - TOML
  - CDG
navOrder: 10
---

# Crear generadores personalizados del Asistente de recetas

Personalizar el Asistente de recetas consiste, en esencia, en añadir nuevas reglas que respondan a esta pregunta: “cuando el jugador hace clic derecho sobre este bloque objetivo, ¿cómo debe generarse un archivo a partir del contexto actual del mundo?”

Es muy parecido al [Sistema de generación de datos en tiempo de ejecución](../generator/index.md):

- la coincidencia del bloque objetivo actúa como “cuándo se activa”
- `path` decide dónde se escribe el archivo generado
- `template` decide qué aspecto tiene el contenido del archivo
- los placeholders extraen valores del contexto del clic actual

La diferencia principal frente a un [generador de datos](../generator/create-generator.md) normal es que aquí la entrada no es un [conjunto de entradas](../generator/index.md#entry-registry) estático, sino el `UseOnContext` del clic derecho actual del jugador.

<a id="location"></a>

## Ubicación

Los archivos de generadores del Asistente de recetas se guardan en:

```text
<filePath>/recipe_wizard/generators
```

Aquí, `filePath` es la raíz de archivos personalizados definida en [Configuración y comandos](../configuration-command.md#config-file).

Esta ruta está fijada directamente en el código fuente. Ten en cuenta que el nombre del directorio es `generators`, no `generator`.

Cuando el Asistente de recetas lee este directorio por primera vez, también exporta allí plantillas integradas como punto de partida editable.

<a id="format"></a>

## Formatos de archivo

`RecipeWizardGenerator.read(...)` termina leyendo los archivos mediante `DgReader`, así que admite los mismos formatos que los generadores normales:

- `toml`
- `json`
- `cdg`

Las plantillas integradas usan actualmente `toml`, y ese también es el formato más adecuado para escribir a mano.

Ejemplo mínimo:

```toml
block = "croparia:infusor"
path = "example/infusor_${datetime}.json"
extensions = "croparia:infusor"
template = """
{
  "type": "croparia:infusor",
  "element": "${infusor_element}",
  "ingredient": ${item._qis},
  "result": ${off_hand._qis}
}
"""
```

<a id="fields"></a>

## Lista completa de campos

Los campos de `RecipeWizardGenerator` proceden del `CODEC` del código fuente:

- `enabled: boolean`
- `dependencies: Dependencies`
- `block: BlockInput`
- `path: Template`
- `extensions: ResourceLocation | ResourceLocation[]`
- `template: Template`

Las secciones siguientes los explican uno por uno.

<a id="enabled"></a>

### `enabled`

- Tipo: `boolean`
- Opcional; por defecto es `true`

Controla si este generador del Asistente de recetas está habilitado. Si se desactiva, el archivo sigue leyéndose, pero no entra en la lista de plantillas disponibles.

<a id="dependencies"></a>

### `dependencies`

- Tipo: objeto de dependencias
- Opcional; por defecto está vacío

Se comporta igual que las comprobaciones de dependencias en otras partes de la documentación: el archivo del generador solo se carga cuando sus dependencias están satisfechas.

Si las dependencias no se cumplen, el código fuente omite el archivo directamente en lugar de mostrar un error y seguir usándolo.

<a id="block"></a>

### `block`

- Tipo: [BlockInput](../recipe-structure.md#block-input)
- Obligatorio

Determina sobre qué bloques objetivo funciona este generador.

El generador solo se activa cuando el estado del bloque sobre el que el jugador hace clic derecho coincide con `block`.

Ejemplo:

```toml
block = "croparia:infusor"
block = "#croparia:ritual_stands"
```

<a id="path"></a>

### `path`

- Tipo: `Template`
- Obligatorio

Ruta relativa de salida bajo el directorio de exportación `recipeWizard`.

Por ejemplo:

```toml
path = "croparia/ritual_${datetime}.json"
```

Si el directorio `recipeWizard` configurado es `D:/packs/croparia/recipe_wizard/output`, el resultado final será:

```text
D:/packs/croparia/recipe_wizard/output/croparia/ritual_2026-04-06_12.30.00.json
```

`path` es en sí misma una plantilla, así que puede usar cualquiera de los placeholders presentados más abajo en esta página.

<a id="extensions"></a>

### `extensions`

- Tipo: `string` o `string[]`
- Opcional; por defecto es una lista vacía

No son textos normales, sino IDs de grupos de placeholders de extensión. El código fuente registra actualmente:

- `croparia:infusor`
- `croparia:ritual`
- `croparia:soak`
- `minecraft:furnace`

El grupo `default` siempre está habilitado automáticamente y no hace falta escribirlo a mano.

Si quieres usar placeholders proporcionados por uno de estos grupos, debes incluirlo en `extensions`. Por ejemplo:

```toml
extensions = "croparia:ritual"
```

o:

```toml
extensions = [
  "croparia:ritual",
  "minecraft:furnace"
]
```

<a id="template"></a>

### `template`

- Tipo: `Template`
- Obligatorio

Es el contenido final del archivo que se va a escribir, normalmente una plantilla JSON.

Sus placeholders se resuelven en el momento del clic y el resultado se escribe después en disco.

Ejemplo:

```toml
template = """
{
  "type": "croparia:soak",
  "element": "${soak_element}",
  "input": ${neighbor._qis},
  "output": ${below._qis},
  "probability": 1.0
}
"""
```

La sintaxis de la plantilla en sí coincide con la de [Analizadores de placeholders](../generator/placeholder.md).

<a id="default-placeholders"></a>

## Placeholders por defecto

Independientemente de si escribes algo en `extensions`, el grupo de placeholders `default` siempre está habilitado.

Todos estos placeholders proceden del `UseOnContext` del clic.

- `${datetime}`
  - marca temporal actual, con formato `yyyy-MM-dd_HH.mm.ss`
- `${main_hand}`
  - objeto de la mano principal, con un tipo equivalente a `ItemOutput`
- `${off_hand}`
  - objeto de la mano secundaria, con un tipo equivalente a `ItemOutput`
- `${item}`
  - objeto dropeado en la posición clicada, con un tipo equivalente a `ItemOutput`
- `${block}`
  - bloque actualmente clicado, con un tipo equivalente a `BlockOutput`
- `${neighbor}`
  - cualquier bloque vecino que no sea aire, con un tipo equivalente a `BlockOutput`
- `${below}`
  - bloque situado debajo, con un tipo equivalente a `BlockOutput`

Además, `block` tiene varias subrutas habituales:

- `${block.facing}`: el bloque situado delante de la cara clicada
- `${block.opposite}`: el bloque situado detrás de la cara clicada
- `${block.left}`: el bloque al lado horario de la cara clicada
- `${block.right}`: el bloque al lado antihorario de la cara clicada
- `${block.offset(x,y,z)}`: un bloque desplazado respecto a la posición clicada

La mayoría de estos valores son tipos estructurados, así que en la práctica suelen usarse con `_qis`, igual que en las plantillas integradas:

```toml
${item._qis}
${block._qis}
${neighbor._qis}
```

Si falta el contexto requerido, por ejemplo si no hay objeto en la mano principal o no hay un objeto dropeado en la posición de destino, el código fuente muestra directamente un aviso superpuesto y cancela la generación.

<a id="extension-placeholders"></a>

## Placeholders de extensión

`extensions` decide qué placeholders extra de dominio específico se habilitan.

### `croparia:infusor`

- `${infusor_element}`

Requiere que el objetivo clicado sea un [Infusor](../../general/blocks-and-items/workstations.md#croparia:infusor) ya infundido. Si el elemento está vacío, se mostrará al jugador un aviso para que infunda primero el Infusor.

### `croparia:ritual`

- `${ritual_input}`

Requiere que el objetivo clicado sea un [Atril ritual](../../general/blocks-and-items/workstations.md#croparia:ritual_stand), y que la estructura actual identifique correctamente las posiciones de bloques de entrada. Este placeholder devuelve el bloque de entrada ubicado en las posiciones `$` de la estructura ritual.

### `croparia:soak`

- `${soak_element}`

Requiere que el objetivo clicado sea una Piedra elemental con un Infusor infundido encima. El valor devuelto es el nombre del elemento usado en el remojo actual.

### `minecraft:furnace`

- `${furnace_input}`
- `${furnace_time}`

Este grupo está pensado para bloques del tipo horno:

- `furnace_input` lee el objeto de la ranura de entrada
- `furnace_time` lee el tiempo total de combustión del combustible actual

Si el objetivo no es un horno, o si la ranura de entrada o la de combustible están vacías, el objeto también mostrará un aviso y cancelará la generación.

<a id="builtin-examples"></a>

## Ejemplos de plantillas integradas

Las plantillas integradas de `1.1.0a` incluyen tres archivos, que además reflejan los patrones de escritura más típicos.

### Receta de Infusor

```toml
path = "croparia/infusor_${datetime}.json"
extensions = "croparia:infusor"
block = "croparia:infusor"
template = """
{
  "type": "croparia:infusor",
  "element": "${infusor_element}",
  "ingredient": ${item._qis},
  "result": ${off_hand._qis}
}
"""
```

### Receta ritual

```toml
path = "croparia/ritual_${datetime}.json"
extensions = "croparia:ritual"
block = "#croparia:ritual_stands"
template = """
{
  "type": "croparia:ritual",
  "ritual": ${block._qis},
  "ingredient": ${item._qis},
  "block": ${ritual_input._qis},
  "result": ${off_hand._qis}
}
"""
```

### Receta de remojo

```toml
path = "croparia/soak_${datetime}.json"
extensions = "croparia:soak"
block = "croparia:elemental_stone"
template = """
{
  "type": "croparia:soak",
  "element": "${soak_element}",
  "input": ${neighbor._qis},
  "output": ${below._qis},
  "probability": 1.0
}
"""
```

Aquí conviene fijarse sobre todo en dos detalles:

- `block` decide “cuándo se activa”, no qué bloque de entrada aparecerá en el resultado generado
- al escribir JSON, los valores estructurados como `ItemOutput` o `BlockOutput` suelen necesitar `_qis` para convertirse en texto que pueda incrustarse directamente en el JSON

<a id="tips"></a>

## Recomendaciones

- La primera vez que personalices uno, copiar y modificar una plantilla integrada es más fiable que empezar desde cero.
- Conviene que `path` incluya `${datetime}` para que varios clics seguidos no sobrescriban archivos anteriores.
- Si una plantilla depende de varios contextos especiales, asegúrate de que todos los grupos correspondientes estén listados en `extensions`.
- La coincidencia del bloque objetivo depende solo de `block`, no de los placeholders que aparezcan dentro de la plantilla.
- El contenido generado normalmente sigue siendo un archivo JSON de receta, así que después de generarlo puedes seguir validando sus campos con [Recetas y estructuras](../recipe-structure.md).
