---
title: Integración con REI
desc: Explicación de cómo la Recipe API de Croparia IF se integra con Roughly Enough Items, incluyendo la colaboración entre ReiCategory, ReiDisplay y TypedSerializer.
keywords:
  - Croparia IF
  - Recipe API
  - REI
  - Roughly Enough Items
  - ReiCategory
  - ReiDisplay
  - TypedSerializer
  - DisplayableRecipe
  - documentación para desarrolladores
modVersions:
  - 1.1.0a
navOrder: 30
---

# Integración con REI

<a id="overview"></a>

Croparia IF aborda REI casi con el mismo espíritu que JEI: la Recipe API proporciona una abstracción compartida de receta, y la capa de compatibilidad mapea esa abstracción al sistema de categorías y displays de REI.

La diferencia principal es que REI introduce `ReiDisplay<R>` de forma explícita como objeto dedicado de visualización.

<a id="mental-model"></a>

## Modelo mental

Los objetos clave del lado de REI son:

- `ReiClient`
  - el punto de entrada del plugin cliente de REI
- `ReiCategory<R>`
  - la categoría de recetas
- `ReiDisplay<R>`
  - el envoltorio de visualización concreto
- `TypedSerializer<R>`
  - el proveedor de información de tipo, estaciones de trabajo y consultas de recetas

La relación puede leerse así:

- `DisplayableRecipe` proporciona los datos básicos de visualización
- `TypedSerializer` aporta la identidad de tipo y el acceso a consultas
- `ReiCategory` describe cómo debe verse una familia de recetas
- `ReiDisplay` envuelve una instancia concreta de receta en la forma que REI espera

<a id="rei-category"></a>

## `ReiCategory`

La clase base `ReiCategory<R>` de Croparia IF implementa `DisplayCategory<ReiDisplay<R>>` y ya se encarga de:

- generar `CategoryIdentifier` a partir de `TypedSerializer.getId()`
- la traducción del título por defecto
- la resolución del icono por defecto
- construir las entradas de estación de trabajo desde `TypedSerializer.getStations()`

Así que la mayoría de categorías concretas solo necesitan:

1. extender `ReiCategory<R>`
2. devolver el `TypedSerializer<R>` correcto
3. implementar la lógica de layout y dibujo

Igual que en el lado de JEI, si la lista de estaciones está vacía, la lógica de icono por defecto deja de ser suficiente y conviene sobrescribirla.

<a id="rei-display"></a>

## `ReiDisplay`

A diferencia de JEI, REI envuelve cada receta dentro de `ReiDisplay<R>`.

Su trabajo principal es:

- mantener la instancia real de la receta o el `RecipeHolder`
- asociarla con el `ReiCategory` correcto
- exponer a REI el identificador de categoría y el contenido visual

Así que `ReiCategory` responde sobre todo a "¿cómo se dibuja esta familia?" mientras que `ReiDisplay` responde a "¿cómo se representa esta instancia concreta?"

Esa separación encaja bastante bien con el propio modelo de API de REI y deja más claro el manejo de objetos de visualización.

<a id="typed-serializer"></a>

## El papel de `TypedSerializer` dentro de REI

Igual que con JEI, la integración con REI depende mucho de `TypedSerializer`. Principalmente proporciona:

- el ID de categoría
- la lista de estaciones de trabajo
- todos los `RecipeHolder` del tipo de receta actual

Cuando se registran los displays, `ReiClient` normalmente llamará a:

- `category.getRecipeType().findHolders()`

y después envolverá cada holder dentro de `ReiDisplay<R>`.

Así que si `TypedSerializer` no está bien configurado, los problemas en REI suelen aparecer justo detrás.

<a id="registration"></a>

## Flujo de registro

El flujo de registro de REI en Croparia IF puede resumirse así:

1. mantener una lista de `ReiCategory<?>` en `ReiClient`
2. registrar categorías y estaciones de trabajo mediante `registerCategories(...)`
3. registrar displays para cada categoría mediante `registerDisplays(...)`

Comparado con JEI, REI añade una capa extra de envoltorio para displays, pero el patrón general sigue siendo "partir de `TypedSerializer` y mapear las recetas en tiempo de ejecución al sistema de visualización."

<a id="jei-vs-rei"></a>

## Diferencia frente a JEI

Si ya leíste [la integración con JEI](jei.md#overview), la distinción principal del lado de REI es:

- JEI trabaja de forma más directa con categorías y tipos de receta
- REI hace explícito el objeto display

Pero en el diseño de Croparia IF, ambos lados siguen compartiendo las mismas fuentes principales de datos:

- `DisplayableRecipe`
- `TypedSerializer`
- los tipos predefinidos de entrada y salida

Eso significa que la mayor parte del diseño del lado de la receta **no** necesita duplicarse por separado para JEI y REI.

<a id="tips"></a>

## Consejos

- Mantén la información de tipo y estaciones dentro de `TypedSerializer`, en lugar de repartirla entre varias clases específicas de REI.
- Antes de depurar problemas de display o layout, comprueba primero que `findHolders()` devuelve correctamente las recetas en tiempo de ejecución.
- Si JEI y REI empiezan a separarse demasiado, lo primero que conviene revisar es si `DisplayableRecipe` está exponiendo un modelo visual coherente.
- Las interfaces complejas pueden justificar código de layout separado para JEI y REI, pero intenta que no evolucionen hacia modelos de datos diferentes.

