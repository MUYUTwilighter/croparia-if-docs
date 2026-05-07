---
title: Integración con JEI
desc: Explicación de cómo la Recipe API de Croparia IF se integra con Just Enough Items, incluyendo los papeles de JeiCategory, TypedSerializer y la visualización de estaciones de trabajo.
keywords:
  - Croparia IF
  - Recipe API
  - JEI
  - Just Enough Items
  - JeiCategory
  - TypedSerializer
  - DisplayableRecipe
  - visualización de recetas
  - documentación para desarrolladores
modVersions:
  - 1.1.0a
navOrder: 20
---

# Integración con JEI

<a id="overview"></a>

La integración de Croparia IF con JEI se construye sobre la Recipe API. La idea principal no es "escribir una capa de JEI completamente separada para cada tipo de receta", sino:

- hacer que las recetas implementen `DisplayableRecipe`
- mantener los metadatos del tipo en `TypedSerializer`
- dejar que `JeiCategory` lea esas piezas y se encargue del registro y la visualización

Eso mantiene la capa orientada a JEI bastante delgada.

<a id="mental-model"></a>

## Modelo mental

Los objetos más importantes del lado de JEI son:

- `JeiClient`
  - el punto de entrada del plugin de JEI
- `JeiCategory<R>`
  - la categoría de JEI para una familia de recetas
- `TypedSerializer<R>`
  - el proveedor del ID de tipo, la clase de receta, las estaciones de trabajo y las consultas de recetas en tiempo de ejecución

La relación entre ellos es:

- `DisplayableRecipe` expone los datos visuales del lado de la receta
- `TypedSerializer` define cómo se identifica y consulta una familia de recetas
- `JeiCategory` define cómo aparece esa familia dentro de JEI
- `JeiClient` registra todas las categorías y recetas dentro del propio JEI

<a id="jei-category"></a>

## `JeiCategory`

`JeiCategory<R>` en Croparia IF es una clase base abstracta que implementa `IRecipeCategory<R>`.

Ya se encarga por ti de varias tareas comunes:

- generar un `RecipeType<R>` a partir de `TypedSerializer`
- generar un título traducido por defecto a partir del ID del tipo de receta
- derivar el icono de la categoría desde `TypedSerializer.getStations()`

Así que una familia de recetas concreta normalmente solo necesita:

1. extender `JeiCategory<R>`
2. devolver su `TypedSerializer`
3. proporcionar la lógica real del diseño visual

Eso hace que el patrón "una familia de recetas, una clase de categoría" resulte muy natural.

<a id="typed-serializer"></a>

## El papel de `TypedSerializer` dentro de JEI

`TypedSerializer` es el centro real de la integración con JEI. `JeiCategory` depende de él para:

- el ID de la categoría
- el tipo de clase de receta
- los iconos de estación de trabajo
- la lista de recetas en tiempo de ejecución de este tipo

Dos puntos importan especialmente:

- `getStations()`
  - se usa para registrar recipe catalysts y derivar el icono por defecto
- `find()`
  - se usa para registrar en JEI todas las recetas de este tipo

Así que, si tu `TypedSerializer` está bien definido, el lado de JEI suele necesitar muy poco código de pegamento adicional.

<a id="registration"></a>

## Flujo de registro

El flujo de registro de JEI en Croparia IF puede resumirse en tres pasos:

1. mantener una lista de `JeiCategory<?>` en `JeiClient`
2. registrar categorías mediante `registerCategories(...)`
3. registrar recetas y recipe catalysts mediante `registerRecipes(...)` y `registerRecipeCatalysts(...)`

En otras palabras, JEI no entiende tu tipo de receta por sí solo. Solo consume la información que la categoría y el typed serializer ya han preparado.

Por eso la Recipe API anima a que las recetas y los objetos de tipo posean sus propios datos de visualización.

<a id="when-to-customize"></a>

## Cuándo hace falta más personalización

En el caso básico, `JeiCategory` ya se ocupa de:

- título
- icono
- identidad de tipo

Normalmente solo necesitas lógica adicional para:

- el layout
- widgets interactivos
- elementos especiales de renderizado

Si la interfaz de tu receta es poco habitual, por ejemplo:

- entradas en varias páginas
- visualizaciones de estructuras
- cambios dinámicos de estado

entonces la categoría concreta deberá añadir más comportamiento de interfaz del lado de JEI.

<a id="tips"></a>

## Consejos

- Diseña primero la clase de receta y su `TypedSerializer`, y luego añade soporte JEI. Así la categoría queda mucho más ligera.
- Si `getStations()` está vacío, asegúrate de sobrescribir la lógica de icono, porque la implementación base por defecto lanzará una excepción.
- El título por defecto depende de la clave de traducción `gui.<namespace>.<path>.title`, así que conviene mantener un nombrado estable.
- Si una categoría de JEI empieza a cargar con demasiada lógica de negocio de la receta, normalmente significa que esos datos deberían vivir antes en `DisplayableRecipe` o en `TypedSerializer`.

Si también quieres soporte para REI, continúa con [la integración con REI](rei.md#overview). El diseño general es parecido, aunque las APIs de plataforma sean distintas.

