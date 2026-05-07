---
title: Añadir cultivos integrados
desc: Explica a desarrolladores cómo añadir cultivos de fruto y cultivos gigantes integrados en Croparia IF, incluyendo los puntos de registro a modificar, los campos mínimos necesarios y el contenido derivado que se crea automáticamente.
keywords:
  - Croparia IF
  - documentación para desarrolladores
  - Crop
  - Melon
  - Crops
  - Melons
  - DgRegistries
  - ItemMaterial
  - BlockMaterial
  - 1.1.0a
navOrder: 80
---

# Añadir cultivos integrados

<a id="overview"></a>

Si abriste esta página porque quieres seguir añadiendo un cultivo integrado más a Croparia IF, lo más importante puede ir primero:

- los cultivos de fruto integrados se añaden principalmente en `registry/Crops.java`
- los cultivos gigantes integrados se añaden principalmente en `registry/Melons.java`
- ninguna de estas líneas de contenido termina en “añadir una entrada al registro”; ambas derivan automáticamente los bloques y objetos correspondientes
- que el contenido aparezca de verdad depende no solo de haber instanciado el objeto, sino también de `shouldLoad()`, de las dependencias y de los filtros de configuración

Así que esta página no intenta ser un resumen genérico del sistema de cultivos. Responde directamente a:

- qué archivo debes editar para añadir un cultivo integrado
- qué datos mínimos necesita un `Crop` o un `Melon`
- qué bloques y objetos deriva Croparia IF automáticamente después de añadirlo
- qué capa deberías revisar primero si el contenido nuevo no aparece

Si lo que necesitas es la vía de personalización del lado del modpack, consulta [Cultivos personalizados](../modpack/custom-crops.md).

<a id="two-lines"></a>

## Primero separa las dos líneas de contenido

Dentro de Croparia IF, el contenido integrado relacionado con cultivos se divide principalmente en dos líneas:

- `Crop`
  - cultivos de fruto
  - normalmente producen semillas, frutos y un bloque de cultivo
- `Melon`
  - cultivos gigantes
  - normalmente producen semillas, bloques de fruto, tallos y tallos conectados

Si lo único que quieres saber es “qué archivo debo tocar”, usa primero esta distinción:

- si el resultado es un fruto normal cosechado de una planta
  - mira `Crop`
- si el resultado es un gran bloque de fruto producido por una estructura de tallo
  - mira `Melon`

Ambos pertenecen al sistema de cultivos, pero no comparten la misma plantilla de implementación en código.

Las diferencias más importantes son:

- `Crop` usa `ItemMaterial`
- `Melon` usa `BlockMaterial`
- `Crop` tiene `type`
- `Melon` no
- `Crop` deriva “bloque de cultivo + semilla + fruto”
- `Melon` deriva “bloque de fruto + semilla + tallo + tallo conectado + objeto del fruto”

Desde el punto de vista del desarrollador, es mejor entenderlos como dos plantillas de contenido distintas, y no como una misma clase con texturas diferentes.

<a id="crop-line"></a>

## Cómo añadir un `Crop` integrado

<a id="add-crop"></a>

### Paso 1: ve a `Crops.java`

El punto de entrada principal para los cultivos de fruto integrados es `registry/Crops.java`.

Croparia IF define actualmente la mayoría de sus cultivos de fruto integrados ahí y los registra por inicialización de campos en:

- `DgRegistries.CROPS`

Si tu objetivo es simplemente añadir una entrada integrada más, normalmente no necesitas tocar primero la clase `Crop` de nivel inferior. Empieza añadiendo una definición en `Crops.java`.

### Paso 2: elige el helper adecuado

Los helpers de entrada más comunes actualmente se agrupan en tres tipos:

- `croparia(...)`
  - ideal cuando el propio material es contenido proporcionado por Croparia IF
- `vanilla(...)`
  - ideal cuando el material corresponde directamente a un objeto vanilla
- `compat(...)`
  - ideal cuando el material proviene de un mod de compatibilidad, o cuando la carga debe depender de etiquetas y condiciones de dependencia

Si vas a añadir un cultivo integrado para un objeto vanilla, normalmente basta con copiar uno de los patrones existentes de `vanilla(...)`.

### Paso 3: prepara los campos mínimos

Al construir una definición `Crop`, al menos deberías tener claros estos datos:

- `name`
  - pasará a formar parte del nombre final de registro
- `material`
  - el significado del material producido por este cultivo
- `color`
  - se usa sobre todo en renderizado y generación de recursos
- `tier`
  - nivel del cultivo
- `type`
  - categoría de presentación del recurso, como `crop`, `animal` o `monster`
- `dependencies`
  - se usa cuando la carga debe depender de otro mod y de la selección de la clave de traducción

Por eso no conviene pensar en `Crop` como “simplemente metadatos de cultivo”. Ya lleva la mayor parte de la información necesaria para aterrizar contenido real.

### Paso 4: qué se deriva automáticamente

Cuando un `Crop` se crea y registra, no produce solo un objeto de definición.

Su constructor prepara tres objetos de contenido derivado:

- `CropariaCropBlock`
- `CropSeed`
- `CropFruit`

Y después `onRegister()` los registra de verdad.

Así que, desde la experiencia del desarrollador, añadir un cultivo integrado suele tener esta forma:

1. añadir una definición en `Crops.java`
2. hacer que entre en `DgRegistries.CROPS`
3. dejar que `Crop` gestione el registro derivado del bloque de cultivo, la semilla y el fruto

Esa es una de las partes más cómodas del diseño.

### Qué representa realmente un `Crop`

Los campos principales de `Crop` incluyen:

- `Identifier id`
- `ItemMaterial material`
- `Color color`
- `int tier`
- `String type`
- `Map<String, String> translations`
- `CropDependencies dependencies`

Al añadir cultivos integrados, los dos campos más importantes suelen ser `material` y `type`:

- `material`
  - decide el significado del material que produce el cultivo
  - además es reutilizado más adelante por otros sistemas
- `type`
  - está más cerca de la clasificación visual y de recursos
  - por ejemplo `crop`, `animal`, `monster` o `nature`

Así que `Crop` se entiende mejor como “definición de cultivo de fruto + plantilla de registro derivado”, no como un simple objeto de configuración.

### Por qué puede existir una definición y no aparecer

Si añades una definición en `Crops.java` pero no ves el contenido resultante en el juego, revisa primero estas capas:

- `dependencies`
  - ¿debería cargarse este contenido en el entorno actual?
- `shouldLoad()`
  - ¿pasan las comprobaciones de dependencias y filtros de configuración?
- `CropariaIf.CONFIG.isCropValid(...)`
  - ¿la configuración actual sigue permitiendo este cultivo?
- `onRegister()`
  - ¿los bloques y objetos derivados llegaron realmente a la fase de registro?

En otras palabras, entre “la definición existe” y “el contenido aparece” hay una capa más de decisión de carga.

<a id="melon-line"></a>

## Cómo añadir un `Melon` integrado

<a id="add-melon"></a>

### Paso 1: ve a `Melons.java`

El punto de entrada principal para el contenido integrado de cultivos gigantes es `registry/Melons.java`.

Igual que `Crops.java`, cada definición ahí entra primero en:

- `DgRegistries.MELONS`

Así que si tu objetivo es “añadir un cultivo gigante integrado”, el primer paso vuelve a ser añadir una definición en `Melons.java`.

### Paso 2: prepara los campos mínimos

La línea `Melon` es más fija que `Crop`, y el helper integrado más común actualmente es algo del estilo `vanilla(...)`.

Como mínimo necesitas:

- `name`
- `material`
  - aquí es `BlockMaterial`
- `color`
- `tier`

A diferencia de `Crop`, no tiene `type`, porque la plantilla visual de los cultivos gigantes ya es más fija.

### Paso 3: qué se deriva automáticamente

Una definición `Melon` prepara cinco objetos de contenido derivado:

- `MelonStem`
- `MelonAttach`
- `MelonSeed`
- `MelonBlock`
- `MelonItem`

Y después `onRegister()` los registra todos de una sola vez.

Así que, desde el punto de vista del desarrollador, añadir un cultivo gigante integrado suele verse así:

1. añadir una definición en `Melons.java`
2. registrarla en `DgRegistries.MELONS`
3. dejar que `Melon` derive el tallo, el tallo conectado, el bloque de fruto, el objeto del fruto y la semilla

### Cómo conviene entender `Melon`

Los campos principales de `Melon` son más compactos:

- `Identifier id`
- `BlockMaterial material`
- `Color color`
- `int tier`
- `Map<String, String> translations`
- `CropDependencies dependencies`

Lo más importante que conviene recordar aquí es:

- `Melon` no es una versión simplificada de los cultivos de fruto
- es una “definición estructural de cultivo gigante + plantilla de registro derivado”

Si vas a añadir un cultivo gigante integrado, el trabajo suele centrarse en escribir correctamente la definición, no en modificar mucha lógica de ejecución.

<a id="registries"></a>

## Por qué todo pasa por `DgRegistries`

Tanto `Crop` como `Melon` no registran primero bloques y objetos escribiendo directamente desde `Crops` / `Melons` a los registros vanilla. Antes pasan por:

- `DgRegistries.CROPS`
- `DgRegistries.MELONS`

Para quienes mantienen contenido integrado, la secuencia que conviene recordar es:

1. escribir la definición de contenido en `Crops.java` / `Melons.java`
2. dejar que `DgRegistries` recopile esas definiciones
3. dejar que `Crop` / `Melon` deriven y registren los bloques y objetos reales durante el registro

Este diseño existe para que sistemas posteriores como la generación de recursos, la generación de idiomas y el registro derivado puedan trabajar todos sobre los mismos objetos de definición.

<a id="dependencies"></a>

## Compatibilidad, traducción y control de carga

Tanto `Crop` como `Melon` llevan `CropDependencies`.

Esa capa no sirve solo para “registrar qué mod hace falta”. Más importante todavía:

- decide si el contenido debe cargarse en el entorno actual
- decide qué clave de traducción debe usarse

Por eso, si estás trabajando con contenido integrado de compatibilidad, no conviene pensar en las dependencias como algo que “se añade al final”.

En este diseño:

- las condiciones de dependencia forman parte de la propia definición de contenido
- la selección de la clave de traducción viaja también con esa definición

Esa es una de las razones por las que existen helpers como `compat(...)`:

- una misma definición de contenido
- puede elegir distintos comportamientos de carga y traducción según el entorno

<a id="load-and-register"></a>

## Cadena de depuración: cómo una definición llega al juego

Tanto `Crop` como `Melon` implementan dos métodos muy importantes:

- `shouldLoad()`
- `onRegister()`

`shouldLoad()` comprueba sobre todo:

- si se cumplen las condiciones de dependencia
- si la configuración sigue permitiendo cargar ese cultivo

`onRegister()` es lo que realmente empuja el contenido derivado al registro.

Si quieres depurar por qué una definición nueva no ha llegado a verse en el juego, el orden más útil suele ser:

1. crear la definición en `Crops.java` o `Melons.java`
2. registrarla en el `DgRegistries` correspondiente
3. llamar a `shouldLoad()` para decidir si debe cargarse
4. si pasa, ejecutar `onRegister()`
5. dejar que los bloques y objetos derivados entren en el flujo real de registro

Así que, cuando te preguntas “¿por qué no aparece este cultivo?”, no te quedes mirando solo la capa del registro vanilla. Vuelve atrás y revisa `shouldLoad()`, las dependencias y si `onRegister()` se alcanzó de verdad.

<a id="what-to-learn"></a>

## Lo que más merece la pena recordar

Si tu objetivo es mantener o ampliar el contenido de cultivos integrados del propio Croparia IF, las conclusiones más importantes son:

- para añadir un cultivo de fruto integrado, empieza por `Crops.java`
- para añadir un cultivo gigante integrado, empieza por `Melons.java`
- `Crop` y `Melon` no son por sí solos el contenido final registrado; derivan un conjunto completo de bloques y objetos
- que el contenido aparezca depende de la definición, las dependencias, los filtros de configuración y la cadena de registro juntos
- esta página se entiende mejor como “referencia de mantenimiento de contenido integrado” que como una API pública de ampliación completa

<a id="where-next"></a>

## A dónde ir después

- Si quieres ver cómo estas definiciones entran en el sistema de generación de datos, consulta [Sistema de generación de datos en tiempo de ejecución](generator/index.md#overview)
- Si quieres la vía de personalización del lado del modpack, consulta [Cultivos personalizados](../modpack/custom-crops.md)
- Si quieres ver cómo los módulos centrales consumen estas definiciones de cultivo, [Crop Transmuter](core/crop-transmuter.md#overview) suele ser el mejor punto de partida
