---
title: Crear un generador de datos
desc: Presenta dónde colocar los archivos de generadores de datos, sus campos principales, los tipos de generador y un ejemplo mínimo dentro del Sistema de generación de datos en tiempo de ejecución de Croparia IF 1.1.0a.
keywords:
  - Croparia IF
  - 1.1.0a
  - modpack
  - Sistema de generación de datos en tiempo de ejecución
  - generador de datos
  - TOML
  - CDG
  - JSON
  - placeholder
  - template
navOrder: 10
---

# Crear un generador de datos

Esta página responde a una sola pregunta: cómo escribir un archivo de generador de datos que funcione. Para la visión general, consulta el [Sistema de generación de datos en tiempo de ejecución](index.md). Para la forma de escribir los valores de los campos, consulta [Analizadores de placeholders](placeholder.md).

<a id="file-format"></a>

## Dónde colocarlo

Los archivos de generador pertenecen al directorio `generator/` del handler correspondiente, no directamente dentro de `assets/` o `data/`:

- Datapack: `[directorio del juego]/croparia/datapack/generator/`
- Resource pack: `[directorio del juego]/croparia/resourcepack/generator/`

Los [productos generados](index.md#pack-handler) se escribirán después en:

- Datapack: `[directorio del juego]/croparia/datapack/data/`
- Resource pack: `[directorio del juego]/croparia/resourcepack/assets/`

Formatos admitidos:

- `toml`
- `cdg`
- `json`

`toml` es la opción recomendada por defecto.

<a id="minimal-example"></a>

## Ejemplo mínimo

```toml
registry = "croparia:crops"
path = "example/recipes/${id.path}.json"
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

Esto significa:

- iterar sobre `croparia:crops`
- calcular `path` una vez para cada entrada
- rellenar `template` con la entrada actual
- generar varios archivos independientes

<a id="common-fields"></a>

## Campos principales

- `registry`: qué [conjunto de entradas de generación](index.md#entry-registry) debe recorrerse
  - valores habituales:
    - `croparia:crops`
    - `croparia:melons`
    - `croparia:elements`
- `path`: ruta relativa de salida; este campo también es una [plantilla](index.md#template)
  - ejemplo:

```toml
path = "${id.namespace}/models/item/${seed.path}.json"
```

- `template`: contenido final que se escribirá en el archivo; también es una cadena plantilla
  - ejemplo:

```toml
template = """
{
  "parent": "croparia:item/template_seed"
}
"""
```

- `type`: tipo de generador
  - valores disponibles:
    - [`croparia:generator`](#type-generator) (por defecto)
    - [`croparia:aggregated`](#type-aggregated)
    - [`croparia:lang`](#type-lang)

- `startup`: si este generador debe participar antes de que el servidor termine de iniciar por completo

- `enabled`: si el generador está habilitado; resulta útil para desactivar temporalmente un archivo sin borrarlo
  - ejemplo:

```toml
enabled = false
```

- `whitelist`
  - propósito: generar solo para entradas concretas en lugar de recorrer todo el `registry`
  - usos habituales: depuración, sobrescrituras parciales
  - ejemplo:

```toml
whitelist = ["croparia:coal", "croparia:iron"]
```

<a id="generator-types"></a>

## Tipos de generador

<a id="type-generator"></a>

### Generador estándar `croparia:generator`

Es el tipo por defecto. Una entrada suele producir un archivo; si varias entradas resuelven la misma ruta de destino, la última escritura sobrescribe a la anterior.

Encaja bien para:

- recetas
- modelos
- tablas de botín
- blockstates

```toml
registry = "croparia:crops"
startup = true
path = "${id.namespace}/models/item/${seed.path}.json"
template = """
{
  "parent": "croparia:item/template_seed"
}
"""
```

<a id="type-aggregated"></a>

### Generador agregado `croparia:aggregated`

Cada entrada produce primero un fragmento de `content`, y después todos los fragmentos se combinan dentro de un `template` común. Encaja bien con archivos como las tags, donde muchas entradas deben unirse en un solo resultado.

Campo adicional:

- `content`

```toml
registry = "croparia:crops"
type = "croparia:aggregated"
startup = true
path = "croparia/tags/item/seeds/crops.json"
content = '    "${seed}"'
template = """
{
  "replace": false,
  "values": [
${content}
  ]
}
"""
```

<a id="type-lang"></a>

### Generador de idioma `croparia:lang`

Este tipo está pensado para entradas traducibles. Divide la salida por idioma e inyecta el placeholder `_lang` para usarlo dentro de las plantillas.

Encaja bien para:

- archivos de idioma

```toml
registry = "croparia:crops"
type = "croparia:lang"
startup = true
path = "${id.namespace}/lang/${lang}.json"
template = '"${translation_key}": "${translations.get(_lang)}"'
```

Para los campos relacionados con idiomas, consulta [Analizadores de placeholders](placeholder.md#translatable-entry).
