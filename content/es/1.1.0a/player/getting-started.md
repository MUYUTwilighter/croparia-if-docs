---
title: Primeros pasos
desc: Guía rápida para jugadores de Croparia IF 1.1.0a, con instalación, mena de elemtilius, el Infusor, mejoras de Croparia y la ruta inicial de juego.
navOrder: 1
---

# Primeros pasos

Esta página te ayudará a instalar el mod y dar tus primeros pasos con él.

## Instalación

1. Confirma la versión de Minecraft y el loader que quieres usar. Puedes consultar las combinaciones compatibles en la [documentación general](../general/index.md).
2. Descarga e instala **Croparia IF**, [**Architectury API**](https://modrinth.com/mod/architectury-api/versions) y, si usas Fabric, también [**Fabric API**](https://modrinth.com/mod/fabric-api/versions). Puedes obtenerlos desde [CurseForge](https://www.curseforge.com/minecraft/mc-mods/croparia-if), [Modrinth](https://modrinth.com/mod/croparia-if) o un launcher con descarga integrada de mods.
3. Si has descargado los archivos manualmente, coloca los `.jar` en `[directorio del juego]/mods` o en `[directorio del juego]/versions/[nombre de la instancia]/mods` si tienes aislamiento por versión.
4. Inicia el juego y entra en un mundo.

- **Nota 1**: es muy recomendable instalar un visor de objetos como [REI](https://modrinth.com/mod/rei/versions) o [JEI](https://modrinth.com/mod/jei/versions).
- **Nota 2**: este mod añade minerales al Overworld que son esenciales para progresar. Si entras en un mundo antiguo en el que el mod no estaba instalado antes, necesitarás chunks nuevos para obtenerlos.

## Primeros pasos de juego

Croparia IF añade muchos conceptos y mecánicas nuevas, así que usar [REI](https://modrinth.com/mod/rei/versions), [JEI](https://modrinth.com/mod/jei/versions) u otro visor de objetos es muy recomendable.

El mod también se integra con el sistema de avances vanilla, así que seguir esa progresión es una buena manera de aprenderlo.

### 1. Consigue Gemas elementales

Primero, baja a una cueva y mina [mena de elemtilius](../general/blocks-and-items/others.md#elematilius_ore).

Puedes encontrarla a `Y <= 80`, y en teoría aparece con más frecuencia cuanto más abajo vayas.

<RowGallery>
<GameItemCard id="croparia:elematilius_ore"></GameItemCard>
<GameItemCard id="croparia:deepslate_elematilius_ore"></GameItemCard>
</RowGallery>

![Mena de elemtilius en una cueva](/assets/elematilius_in_cave.webp)

Al minarla obtendrás [Gemas elementales](../general/concepts/element.md#gems). Para empezar, con unas 10 o 20 suele bastar.

<RowGallery>
<GameItemCard id="croparia:gem_elemental"></GameItemCard>
</RowGallery>

### 2. Crear Croparia

De vuelta en la superficie, puedes empezar a preparar tus primeras semillas de cultivos de fruto.

Las semillas usan **Croparia** como ingrediente principal. Empieza por [**Croparia**](../general/blocks-and-items/croparia.md#croparia:croparia), que requiere un [**Infusor**](../general/blocks-and-items/workstations.md#croparia:infusor), una [**Poción elemental**](../general/concepts/element.md#potion) (una Gema elemental + una botella de vidrio) y cuatro semillas de cualquier tipo.

<div class="doc-center">
<RecipeDisplay id="croparia:crafting/infusor"></RecipeDisplay>
</div>

Cuando lo tengas listo, ya puedes crear [**Croparia**](../general/blocks-and-items/croparia.md#croparia:croparia). Su receta es:

<div class="doc-center">
<RecipeDisplay id="croparia:infusor/croparia"></RecipeDisplay>
</div>

En la vista de receta, la [Poción elemental](../general/concepts/element.md#potion) de la izquierda indica el tipo de elemento necesario. Coloca el [**Infusor**](../general/blocks-and-items/workstations.md#croparia:infusor) y haz clic derecho sobre él con una **Poción elemental** para cargar ese elemento.

<RowGallery>
<img src="/assets/place_infusor.webp" alt="Colocar el Infusor" style={{ height: "300px" }} />
<img src="/assets/infuse_infusor.webp" alt="Infundir un elemento en el Infusor" style={{ height: "300px" }} />
</RowGallery>

Las semillas mostradas arriba son el objeto de entrada que se consume. Suéltalas sobre el **Infusor** o úsalas directamente sobre él para activar **Infusión elemental** y crear [**Croparia**](../general/blocks-and-items/croparia.md#croparia:croparia). El resultado se coloca directamente en tu inventario.

![Colocar objetos sobre el Infusor](/assets/infusor_place_item.webp)

Después, usa tu visor de objetos para comprobar para qué sirve **Croparia**. Una vez fabriques semillas de fruto con ella, podrás empezar a cultivar el material que quieras.

![Plantar semillas](/assets/plant_seeds.webp)

**Consejo 1**: las [Gemas elementales](../general/concepts/element.md#gems) usadas para crear **Croparia** también tienen sus propios cultivos. Combinadas con Polvo de hueso, son una buena forma de producir más semillas.  
**Consejo 2**: puedes automatizar la Infusión elemental con diversas herramientas de redstone; consulta [Infusor](../general/blocks-and-items/workstations.md#croparia:infusor).

### 3. Mejorar Croparia

Las versiones de **Croparia** de mayor nivel permiten fabricar semillas de fruto para materiales más raros. Para mejorarla necesitarás un **Ritual de nivel 1**.

Los rituales son estructuras multibloque construidas alrededor del Atril ritual. Puedes consultar su estructura en tu visor de objetos:

<RowGallery>
<RecipeDisplay id="croparia:ritual_stand"></RecipeDisplay>
</RowGallery>

_Si la vista de la estructura ritual en tu visor de objetos te resulta demasiado abstracta, crea un mundo de prueba en creativo, sostén el [Asistente de recetas](../general/blocks-and-items/others.md#croparia:recipe_wizard) y haz clic derecho sobre un Atril ritual para generar la estructura correspondiente en el mundo._

Las entradas de “bloque de entrada” en la vista de la estructura marcan posiciones donde luego deberás colocar bloques. Deja esos espacios vacíos mientras construyes.

![Estructura de Ritual de nivel 1 terminada](/assets/ritual_structure-1.webp)

Ahora mira la receta para fabricar una **Gema de tierra**, necesaria para [**Croparia T2**](../general/blocks-and-items/croparia.md#croparia:croparia2):

<RowGallery>
<RecipeDisplay id="croparia:ritual/gem/earth"></RecipeDisplay>
</RowGallery>

El Atril ritual del centro indica el nivel mínimo del ritual. El bloque de tierra de la izquierda es el bloque de entrada, así que colócalo en la posición de bloque de entrada que antes dejaste marcada.

![Colocar bloques de entrada del ritual](/assets/ritual-place-input-block.webp)

El objeto de entrada de arriba funciona de forma parecida al Infusor: suéltalo sobre el Atril ritual de nivel 1 o úsalo directamente sobre él para activar el ritual.

![Soltar el objeto de entrada del ritual](/assets/ritual-drop-item.webp)

_Si la estructura es inválida, verás “El elematilius no responde al ritual”. Si la estructura es correcta pero los bloques u objetos de entrada son incorrectos, verás “El elematilius rechaza tus ofrendas”._

Una vez completado, recibirás una **Gema de tierra**. Combínala con una botella de vidrio para crear una [**Poción de tierra**](../general/concepts/element.md#potion) y úsala en el [Infusor](../general/blocks-and-items/workstations.md#croparia:infusor) para mejorar Croparia.

<RowGallery>
<RecipeDisplay id="croparia:infusor/croparia2"></RecipeDisplay>
</RowGallery>

- **Nota 1**: una vez que tu Atril ritual esté listo, también podrás crear cultivos [**Melon**](../general/concepts/crop.md#melon) que producen materiales de bloque. Consulta tu visor de objetos para ver más detalles.
- **Nota 2**: los rituales no sirven solo para fabricar objetos. También pueden aplicarse a mejoras de encantamientos y a invocación de criaturas; consulta [Atril ritual](../general/blocks-and-items/workstations.md#croparia:ritual_stand).

## Siguientes pasos

- El mod también añade varios objetos utilitarios interesantes. Consulta [Reliquias](../general/blocks-and-items/relic.md).
- ¿Te cuesta conseguir ciertos materiales? Echa un vistazo a la [Piedra elemental](../general/blocks-and-items/workstations.md#croparia:elemental_stone).
- ¿Listo para automatizar una producción a gran escala? Mira [Ideas de automatización](automation.md).
- Si surge algún problema, revisa las [Preguntas frecuentes](faq.md).

