---
title: Analizadores de placeholders
desc: Presenta la sintaxis de Placeholder, las operaciones por tipo y los campos disponibles de entradas de generación comunes como cultivos, melones y elementos dentro del Sistema de generación de datos en tiempo de ejecución de Croparia IF.
keywords:
  - Croparia IF
  - 1.1.0a
  - modpack
  - Sistema de generación de datos en tiempo de ejecución
  - Placeholder
  - analizador de placeholders
  - template
  - generador de datos
  - crop
  - melon
  - element
navOrder: 20
---

# Analizadores de placeholders (Placeholder)

El analizador de placeholders es la interfaz con la que una [Plantilla](index.md#template) lee realmente los datos. Las expresiones `${...}` que aparecen dentro de las plantillas se entregan al `Placeholder` correspondiente en tiempo de ejecución y después se sustituyen por el texto final o por un fragmento JSON.

Para autores de modpacks, la forma más simple de entenderlo es:

- `Template` decide cómo será el archivo.
- `Placeholder` decide qué valores puede leer la plantilla y cómo seguir accediendo a esos valores.

Si todavía no has leído la introducción general del sistema de generación de datos en tiempo de ejecución, lo mejor es empezar por el [Sistema de generación de datos en tiempo de ejecución](index.md). Si quieres ver dónde se escriben finalmente estas expresiones, sigue con [Crear un generador de datos](create-generator.md).

<a id="syntax"></a>

## Sintaxis básica

Las formas más básicas de un placeholder son:

```text
${campo}
${campo.subcampo}
${campo.get(clave)}
${campo.get(0)}
```

Por ejemplo:

```txt
{
  "item": "${fruit}",
  "tier": ${tier},
  "translation_key": ${translation_key._qis}
}
```

Aquí importan dos detalles:

- Los placeholders siempre se escriben dentro de `${...}`.
- El punto `.` significa “seguir hacia un subcampo” o “llamar a un método de consulta integrado”.

<a id="quote"></a>

## Cadenas y comillas

Los valores devueltos por `Placeholder` son, en esencia, valores JSON. Si el resultado es una cadena, hay que prestar atención a las comillas al incrustarlo dentro de un literal JSON.

Formas habituales:

- `${name}`: escribe el valor tal cual
- `${name._qis}`: si el resultado es una cadena, añade comillas dobles automáticamente
- `${name._q}`: fuerza el resultado a convertirse en una cadena con comillas dobles, sea o no una cadena originalmente

Regla práctica recomendada:

- Si ya escribiste las comillas JSON a mano en la plantilla, usa `${name}`
- Si quieres que el placeholder decida si necesita comillas, usa `${name._qis}`

Ejemplo:

```txt
{
  "raw_name": "${name}",
  "safe_name": ${name._qis}
}
```

<a id="basic-types"></a>

## Tipos primitivos

<a id="string"></a>

### Cadena `string`

Las cadenas pueden escribirse directamente o combinarse con `_qis` y `_q`.

```text
${id}
${id.namespace}
${id.path}
${type._qis}
```

<a id="number"></a>

### Número `number`

Los números normalmente se incrustan directamente en JSON:

```text
${tier}
${color.dec}
```

<a id="boolean"></a>

### Booleano `boolean`

El código fuente admite placeholders booleanos, pero las entradas de generación comunes exponen muy pocos campos booleanos directamente. Si una entrada sí proporciona uno, puede usarse del mismo modo que un número.

<a id="compound-types"></a>

## Tipos compuestos

La parte más práctica de `Placeholder` es su capacidad para manejar listas y mapas.

<a id="list"></a>

### Lista `T[]`

Las listas admiten estas operaciones:

- `_size`: obtiene la longitud
- `get(n)`: obtiene un valor por índice
- `getOr(n, fallback)`: obtiene un valor por índice o devuelve un valor alternativo si el índice queda fuera de rango
- `map(expr)`: convierte las entradas que pueden resolver `expr` con éxito en un objeto JSON indexado por posición
- `mapi(expr)`: filtra las entradas que pueden resolver `expr` con éxito y devuelve un mapa indexado por posición, conservando el objeto original como valor

Ejemplo:

```text
${translations.keys()._size}
${translations.keys().get(0)}
${translations.keys().getOr(0, en_us)}
```

<a id="map"></a>

### Mapa `Map<String, T>`

Los mapas admiten estas operaciones:

- `_size`: obtiene la cantidad de pares clave-valor
- `get(key)`: obtiene un valor por clave
- `getOr(key, fallback)`: obtiene un valor por clave o devuelve un valor alternativo si no existe
- `keys()`: devuelve la lista de claves
- `values()`: devuelve la lista de valores
- `mapValue(expr)`: conserva solo los valores que pueden resolver `expr` con éxito
- `mapKey(expr)`: vuelve a calcular las claves a partir de un valor resuelto desde cada entrada

Ejemplo:

```text
${translations.get(en_us)}
${translations.getOr(zh_cn, sin_traducir)}
${translations.keys().get(0)}
```

<a id="builtin-types"></a>

## Tipos integrados habituales

Los siguientes tipos aparecen en muchas entradas.

<a id="id"></a>

### `id`

El tipo de identificador de recurso admite:

- `${id}`: ID completo
- `${id.namespace}`: namespace
- `${id.path}`: ruta

Ejemplo:

```text
${fruit}
${fruit.namespace}
${fruit.path}
```

<a id="color"></a>

### `color`

El tipo color admite:

- `${color}`: cadena de color estándar, por ejemplo `#00FFAA`
- `${color.hex}`: valor hexadecimal sin prefijo
- `${color.dec}`: entero decimal

<a id="material"></a>

### `material`

`Material` y sus subclases admiten:

- `${material.type}`: `item` o `tag`
- `${material.name}`: nombre original; las etiquetas conservan `#`
- `${material.count}`: cantidad
- `${material.id}`: ID sin el `#` inicial

En `ItemMaterial`, además están disponibles:

- `${material.result}`: leerlo como una salida de receta
- `${material.components}`: parche de componentes

<a id="common-entries"></a>

## Campos disponibles de entradas de generación comunes

Los campos de abajo proceden de las definiciones de `Placeholder` en el código fuente actual de `1.1.0a`. Están pensados para usarse directamente dentro de la documentación para modpacks. Cada uno corresponde a una [entrada de generación](index.md#entry) y a un [conjunto de entradas de generación](index.md#entry-registry) del Sistema de generación de datos en tiempo de ejecución.

<a id="crops"></a>

### Cultivos de fruto `croparia:crops`

Las entradas de cultivos de fruto están implementadas por `Crop` y además heredan los campos compartidos descritos en [Entradas traducibles](#translatable-entry).

Campos principales que puedes usar directamente:

- `${id}`
- `${color}`
- `${color.hex}`
- `${type}`
- `${material}`
- `${material.name}`
- `${material.result}`
- `${tier}`
- `${seed}`
- `${fruit}`
- `${crop_block}`
- `${croparia}`
- `${translation_key}`
- `${translations}`
- `${translations.get(en_us)}`

Ejemplo:

```toml
path = "data/example/recipe/${id.path}.json"
template = """
{
  "type": "minecraft:crafting_shapeless",
  "ingredients": [
    { "item": "${fruit}" }
  ],
  "result": {
    "id": "${seed}",
    "count": 1
  }
}
"""
```

Si estás escribiendo generadores para cultivos de fruto personalizados, esta página encaja bien con [Crear un generador de datos](create-generator.md).

<a id="melons"></a>

### Cultivos gigantes `croparia:melons`

Las entradas de cultivos gigantes están implementadas por `Melon`.

Campos principales que puedes usar directamente:

- `${id}`
- `${color}`
- `${color.hex}`
- `${tier}`
- `${croparia}`
- `${material}`
- `${material.name}`
- `${melon}`
- `${stem}`
- `${attach}`
- `${seed}`
- `${translation_key}`
- `${translations}`

Ejemplo:

```toml
path = "assets/example/models/item/${seed.path}.json"
template = """
{
  "parent": "minecraft:item/generated",
  "textures": {
    "layer0": "${seed.namespace}:item/${seed.path}"
  }
}
"""
```

<a id="elements"></a>

### Elementos `croparia:elements`

Las entradas de elementos están implementadas por `Element`.

Campos principales que puedes usar directamente:

- `${id}`
- `${name}`
- `${color}`
- `${color.hex}`
- `${fluid_source}`
- `${fluid_flowing}`
- `${liquid_block}`
- `${bucket}`
- `${potion}`
- `${gem}`

Ejemplo:

```toml
path = "data/example/tags/items/${name}.json"
template = """
{
  "replace": false,
  "values": [
    "${gem}",
    "${potion}",
    "${bucket}"
  ]
}
"""
```

<a id="translatable-entry"></a>

## Campos compartidos de entradas traducibles

Tanto `Crop` como `Melon` heredan de `TranslatableEntry`, por lo que ambos admiten:

- `${translation_key}`
- `${translations}`
- `${translations.get(en_us)}`
- `${translations.keys()}`
- `${translations.values()}`

Estos campos se usan sobre todo en generadores de archivos de idioma.

Por ejemplo:

```toml
template = '"${translation_key}": "${translations.get(_lang)}"'
```

Este tipo de patrón resulta especialmente útil junto con el [generador de idioma](index.md).

<a id="tips"></a>

## Recomendaciones

- Determina primero el tipo de entrada actual y después revisa qué campos expone. No des por hecho que distintos tipos de entrada comparten los mismos nombres.
- Al construir rutas de archivos, prioriza subcampos como `${id.path}`, `${seed.path}` o `${fruit.path}`.
- El error más común en las plantillas JSON son las comillas de los valores de tipo cadena. Si dudas, prioriza `${...._qis}`.
- Si la lógica de tu plantilla ya depende de muchas combinaciones de `get()`, `map()`, `keys()` y similares, normalmente es señal de que conviene refactorizar la estructura de la entrada antes de añadir más trucos de plantilla.
