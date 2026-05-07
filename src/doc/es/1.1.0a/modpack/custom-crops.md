---
title: Cultivos personalizados
desc: Presenta el enfoque básico de los cultivos de fruto y cultivos gigantes personalizados en Croparia IF 1.1.0a, incluyendo la creación por comandos, los campos JSON escritos a mano y la opción de ampliación con KubeJS.
keywords:
  - Croparia IF
  - 1.1.0a
  - modpack
  - cultivos personalizados
  - cultivos de fruto
  - cultivos gigantes
  - crop
  - melon
  - JSON
  - KubeJS
  - comandos
navOrder: 20
---

# Cultivos personalizados

Croparia IF permite a los autores de modpacks definir dos tipos adicionales de cultivos:

- `Cultivos de fruto`: al madurar producen frutos y corresponden a `Crop`
- `Cultivos gigantes`: generan bloques de fruto como las calabazas o las sandías y corresponden a `Melon`

Ambos tipos de contenido personalizado se cargan desde los directorios de datos configurados:

- Cultivos de fruto: `<filePath>/crops`
- Cultivos gigantes: `<filePath>/melons`

Aquí, `filePath` es la raíz de archivos personalizados definida en [Configuración y comandos](./configuration-command.md#config-file). Cada archivo JSON se trata como una definición de cultivo.

Los cultivos solo se registran al iniciar el juego, así que cualquier cambio en una definición requiere un reinicio completo para que tenga efecto.

Si solo quieres empezar rápido, lo más cómodo es exportar primero un archivo de plantilla con comandos. Si vas a mantener el modpack a largo plazo, lo más recomendable sigue siendo escribir el JSON a mano.

<a id="command-create"></a>

## Creación rápida con comandos

La creación por comandos es útil para generar rápidamente un JSON inicial editable. En la práctica escribe un archivo de definición en disco; no recarga el nuevo cultivo automáticamente en la instancia actual.

### Cultivos de fruto

Formato del comando:

```text
/croparia|cropariaServer crop create <color> [type] [id] [force]
```

- Si se omite `id`, se usa por defecto la ruta del objeto de la mano principal y se fuerza a un namespace distinto de `minecraft`
- Si se omite `type`, su valor por defecto es `crop`
- Si ya existe una definición con el mismo nombre, no se sobrescribe salvo que añadas `force`

Al crear el archivo, el comando toma dos piezas de contexto:

- Objeto en la mano principal: se usa como `material`
- Croparia en la mano secundaria: su nivel se usa como `tier`

### Cultivos gigantes

Formato del comando:

```text
/croparia|cropariaServer melon create <color> [id] [force]
```

Las diferencias frente a los cultivos de fruto son:

- No necesitan `type`
- El objeto en la mano principal debe ser un bloque, porque se interpreta como el material de bloque del cultivo gigante

<a id="manual-files"></a>

## Escritura manual de archivos

Si necesitas un control más fino, tendrás que escribir a mano los archivos de definición de cultivos.

<a id="crop-json"></a>

## Archivos de cultivos de fruto

Ejemplo completo:

```json
{
  "id": "kubejs:tin",
  "material": {
    "name": "#c:ingots/tin",
    "count": 2
  },
  "color": "#E3E3E0",
  "tier": 2,
  "type": "crop",
  "translations": {
    "en_us": "Tin",
    "zh_cn": "锡"
  },
  "dependencies": {
    "techreborn": "item.techreborn.tin_ingot",
    "modern_industrialization": "item.modern_industrialization.tin_ingot"
  }
}
```

<a id="crop-fields"></a>

### Lista completa de campos

- `id`: `string`
  - Identificador del recurso del cultivo, por ejemplo `kubejs:tin`
  - Determina los IDs derivados de la semilla, el fruto y el bloque del cultivo
- `material`: `ItemMaterial`
  - Material asociado a este cultivo
  - Puede escribirse como ID de objeto o como etiqueta que empiece por `#`
  - La cantidad es opcional y por defecto es 2
- `color`: `Color`
  - Color principal del cultivo
  - Admite `#RRGGBB`, `0xRRGGBB` y enteros decimales
- `tier`: `number`
  - Nivel de Croparia
- `type`: `string`
  - Opcional; por defecto es `crop`
  - Se usa principalmente para decidir qué plantilla de textura de fruto emplear
  - Los valores integrados más habituales incluyen `animal`, `crop`, `food`, `monster` y `nature`
- `translations`: `Map<String, string>`
  - Nombres multilingües opcionales
  - Como mínimo, se recomienda añadir `zh_cn`
- `dependencies`: `string | Map<String, string>`
  - Mapeo opcional de dependencias y claves de traducción
  - Sirve para expresar que el cultivo solo debe cargarse si existe un mod concreto, y qué clave de traducción debe usarse en ese caso

<a id="item-material"></a>

### Forma de objeto de `material`: `ItemMaterial`

Además de una cadena simple, `material` también puede escribirse como un objeto:

```json
{
  "name": "#c:ingots/tin",
  "count": 2
}
```

Si solo necesitas un objeto normal o una etiqueta, la cadena simple es suficiente. Solo necesitas la forma de objeto cuando quieras personalizar la cantidad o añadir componentes adicionales.

<a id="melon-json"></a>

## Archivos de cultivos gigantes

Ejemplo completo:

```json
{
  "id": "kubejs:tin_block",
  "material": {
    "name": "#c:storage_blocks/tin",
    "count": 2
  },
  "color": "#E3E3E0",
  "tier": 2,
  "translations": {
    "en_us": "Tin Block",
    "zh_cn": "锡块"
  },
  "dependencies": {
    "modern_industrialization": "block.modern_industrialization.tin_block"
  }
}
```

<a id="melon-fields"></a>

### Lista completa de campos

- `id`: `string`
  - Identificador del recurso del cultivo gigante
  - Deriva objetos como `melon`, `melon_item`, `stem`, `attach` y `seed`
- `material`: `BlockMaterial`
  - Material de bloque asociado a este cultivo gigante
  - Puede escribirse como ID de bloque o como etiqueta de bloque
  - La cantidad es opcional y por defecto es 2
- `color`: `Color`
  - Usa los mismos formatos de color que los cultivos de fruto
- `tier`: `number`
  - Nivel de Croparia
- `translations`: `Map<String, string>`
  - Nombres multilingües opcionales
- `dependencies`: `string | Map<String, string>`
  - Mapeo opcional de dependencias y claves de traducción

<a id="kubejs"></a>

## Vía KubeJS

Si quieres registrar cultivos de fruto dinámicamente desde scripts, también puedes usar el punto de entrada de ampliación de KubeJS.

La firma del código fuente es aproximadamente:

```java
CropUtil.create(
  rawId,
  material,
  color,
  tier,
  type,
  rawDependencies,
  translations
)
```

Sus parámetros se corresponden casi uno a uno con los campos del JSON escrito a mano:

- `rawId` corresponde a `id`
- `material` corresponde al `material` del cultivo de fruto
- `color` es un valor entero de color
- `tier` corresponde al nivel
- `type` corresponde al tipo de cultivo y puede ser `null`
- `rawDependencies` corresponde a `dependencies`
- `translations` corresponde a `translations`

<a id="tips"></a>

## Recomendaciones

- Cuando crees tu primer cultivo personalizado, exporta primero una plantilla con comandos y después conviértela en el JSON final.
- Si necesitas compatibilidad con materiales de varios mods, prioriza las etiquetas o los mapeos en `dependencies` antes que fijar una clave de traducción de un único mod.
- Los cultivos de fruto y los cultivos gigantes tienen estructuras parecidas, pero sus tipos de `material` son distintos y solo los cultivos de fruto tienen campo `type`.
