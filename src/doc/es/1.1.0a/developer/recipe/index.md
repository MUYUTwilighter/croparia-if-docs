---
title: Recipe API
desc: Resumen de la Recipe API para desarrolladores downstream de Croparia IF, incluyendo DisplayableRecipe, TypedSerializer, estructuras predefinidas de entrada y salida, e integración con JEI o REI.
keywords:
  - Croparia IF
  - Recipe API
  - DisplayableRecipe
  - TypedSerializer
  - ItemInput
  - ItemOutput
  - BlockInput
  - BlockOutput
  - JEI
  - REI
  - documentación para desarrolladores
modVersions:
  - 1.1.0a
navOrder: 40
---

# Recipe API

<a id="overview"></a>

La Recipe API de Croparia IF se construye alrededor de dos objetivos:

- usar una abstracción compartida para describir "recetas mostrables"
- reducir el código repetido entre JEI, REI y los modelos de entrada y salida de recetas

No sustituye a `Recipe`, `RecipeSerializer` ni `RecipeType` de vanilla. En su lugar, añade una capa por encima que resulta más fácil de reutilizar en varios sistemas de recetas personalizados dentro del mod.

<a id="mental-model"></a>

## Modelo mental

Conviene recordar primero estos papeles:

- `DisplayableRecipe`
  - una receta que sigue siendo una receta vanilla, pero también sabe exponer datos de visualización
- `TypedSerializer`
  - un objeto que combina `RecipeType` y `RecipeSerializer`, más metadatos de consulta y estaciones de trabajo
- `ItemInput` / `ItemOutput`
  - estructuras compartidas para entradas y salidas basadas en objetos
- `BlockInput` / `BlockOutput`
  - estructuras compartidas para entradas y salidas basadas en bloques

En otras palabras:

- `DisplayableRecipe` responde "¿cómo es el objeto receta?"
- `TypedSerializer` responde "¿cómo se registra, consulta y asocia a estaciones esta familia de recetas?"
- los tipos predefinidos responden "¿cómo modelamos entradas y salidas complejas de manera estable?"

<a id="displayable-recipe"></a>

## `DisplayableRecipe`

`DisplayableRecipe<C extends RecipeInput>` es la interfaz central de la Recipe API. Extiende `Recipe<C>` de vanilla y además exige que la receta proporcione varias piezas de información para mostrarse:

- `craftingStation()`
  - la estación de trabajo asociada a esta receta
- `getTypedSerializer()`
  - el `TypedSerializer` del tipo de receta actual
- `getInputs()`
  - las entradas usadas para mostrar la receta
- `getOutputs()`
  - las salidas usadas para mostrar la receta

Su principal valor es que el objeto receta deja de responder solo "¿puedo encajar?" y "¿qué fabrico?" También puede exponer su modelo visual directamente a JEI y REI.

Comparado con `Recipe` vanilla, Croparia IF pone mucho más énfasis en que una clase de receta sepa cómo quiere mostrarse.

<a id="typed-serializer"></a>

## `TypedSerializer`

`TypedSerializer<R>` implementa a la vez:

- `RecipeType<R>`
- `RecipeSerializer<R>`

De ahí viene el nombre `Typed`. Combina identidad de tipo y serialización en un único objeto de tiempo de ejecución, y además almacena:

- el ID del tipo de receta
- la clase de la receta
- el `MapCodec`
- el `StreamCodec`
- la lista de estaciones de trabajo

Sus métodos más prácticos son:

- `find()`
  - consulta todas las recetas de este tipo
- `findHolders()`
  - consulta todos los `RecipeHolder` de este tipo
- `find(input, level)`
  - busca una receta compatible para la entrada y el mundo dados
- `getStations()`
  - obtiene las estaciones usadas en JEI y REI

Por eso, `TypedSerializer` no es solo una ayuda de registro. Es el centro de ejecución de la Recipe API.

<a id="when-to-use"></a>

## Cuándo usar la Recipe API

Casos típicos:

- quieres añadir un nuevo tipo de receta al estilo Croparia IF
- quieres que una clase de receta funcione de forma natural tanto con el sistema vanilla como con JEI o REI
- quieres reutilizar las estructuras de entrada y salida ya existentes de Croparia IF en lugar de escribir nuevos codecs a mano cada vez

Si tu caso de uso es solo una estructura interna pequeña que nunca necesita JEI ni REI, esta API puede sentirse más pesada de lo necesario.

<a id="navigation"></a>

## Navegación

- [Tipos predefinidos de entrada y salida](entries.md#overview)
- [Integración con JEI](jei.md#overview)
- [Integración con REI](rei.md#overview)

