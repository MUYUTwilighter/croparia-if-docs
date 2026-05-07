---
title: Bloques de trabajo
desc: Presenta los principales bloques de trabajo de Croparia IF 1.1.0a, como el Invernadero, el Infusor, la Piedra elemental, el Transmutador de cultivos y el Atril ritual.
navOrder: 20
---

# Bloques de trabajo

<a id='croparia:greenhouse'></a>

## Invernadero

<div class="doc-center">
<GameItemCard id='croparia:greenhouse'></GameItemCard>
</div>

Proporciona nivel de luz 8, abre un inventario de 3x3 al hacer clic derecho y puede interactuar con sistemas de almacenamiento.

El Invernadero debe colocarse sobre cultivos de un bloque de altura. Cuando detecta una actualización de bloque, realiza una cosecha automática. Cada cosecha **consume 1 semilla** automáticamente. Los objetos recolectados se almacenan dentro del inventario del Invernadero.

También puede cosechar automáticamente cultivos de enredadera como calabazas y sandías, pero esos cultivos siguen necesitando un bloque libre de espacio de crecimiento adyacente.

### Receta

<div class="doc-center">
<RecipeDisplay id="croparia:crafting/greenhouse"></RecipeDisplay>
</div>

<a id='croparia:infusor'></a>

## Infusor

<div class="doc-center">
<GameItemCard id='croparia:infusor'></GameItemCard>
</div>

Bloque de trabajo que fabrica objetos aplicando un elemento al objeto colocado encima.

Haz clic derecho sobre un Infusor vacío con cualquier [Poción elemental](../concepts/element.md#potion) para infundirlo. Haz clic derecho sobre un Infusor ya infundido con una botella vacía para recuperar el elemento. Un dispensador apuntando al Infusor también puede realizar estas interacciones al activarse.

Haz clic derecho sobre el Infusor con un objeto en la mano para colocar una unidad encima. Si el Infusor recibe una señal débil de redstone, colocará una pila completa. Un soltador apuntando al Infusor también puede colocar un objeto sobre él al activarse.

Cuando se activa una receta, el Infusor intenta introducir el resultado en el jugador que proporcionó el objeto, y después en el contenedor situado debajo. Si ninguno de los dos está disponible, deja el resultado como un objeto en el suelo sobre sí mismo.

### Receta

<div class="doc-center">
<RecipeDisplay id="croparia:crafting/infusor"></RecipeDisplay>
</div>

### Uso

Usa una [Poción elemental](../concepts/element.md#potion) sobre el Infusor para infundirlo, y luego deja caer un objeto sobre él para activar la receta.

Puedes revisar recetas en tu visor de recetas. Por ejemplo:

<div class="doc-center">
<RecipeDisplay id="croparia:infusor/croparia"></RecipeDisplay>
</div>

### Depuración

Mientras te agachas, usa el [Asistente de recetas](./others.md#croparia:recipe_wizard) sobre el Infusor para cambiar el estado del elemento infundido.

<a id='croparia:elemental_stone'></a>

## Piedra elemental

<div class="doc-center">
<GameItemCard id='croparia:elemental_stone'></GameItemCard>
</div>

Un bloque decorativo crafteable. Puede combinarse con el [Infusor](#croparia:infusor) para realizar el remojo elemental.

### Receta

<div class="doc-center">
<RecipeDisplay id="croparia:infusor/elemental_stone"></RecipeDisplay>
</div>

### Uso (Remojo elemental)

Coloca un [Infusor](#croparia:infusor) sobre la Piedra elemental e infúndelo con un elemento. El remojo elemental afectará a los bloques del área de 3 x 3 del mismo plano horizontal centrada en la Piedra elemental.

Puedes revisar recetas en tu visor de recetas. Por ejemplo:

<div class="doc-center">
<RecipeDisplay id="croparia:soak/soul_sand"></RecipeDisplay>
</div>

### Depuración

Mientras te agachas, usa el [Asistente de recetas](./others.md#croparia:recipe_wizard) sobre la Piedra elemental para generar un [Infusor](#croparia:infusor) encima de ella.

<a id='croparia:crop_transmuter'></a>

## Transmutador de cultivos

<div class="doc-center">
<GameItemCard id='croparia:crop_transmuter'></GameItemCard>
</div>

El Transmutador de cultivos convierte frutos de cultivo en **objetos de material específicos**. Tiene inventario propio y abre su interfaz al hacer clic derecho.

### Receta

<div class="doc-center">
<RecipeDisplay id="croparia:crafting/crop_transmuter"></RecipeDisplay>
</div>

### Uso

![Interfaz del Transmutador de cultivos](/assets/crop_transmuter_example.webp)

Haz clic derecho para abrir la interfaz. Coloca el fruto del cultivo a la izquierda, elige en el centro el material que quieres obtener y recoge el resultado de la ranura de salida de la derecha. La velocidad de conversión es de una operación por tick de juego.

El indicador `R+` de la esquina superior derecha significa que solo funciona **cuando recibe señal de redstone**. Al pulsarlo cambia al modo que solo funciona **cuando no recibe señal** (`R-`).

<a id='croparia:ritual_stand'></a>

## Atril ritual

<RowGallery>
<GameItemCard id='croparia:ritual_stand'></GameItemCard>
<GameItemCard id='croparia:ritual_stand_2'></GameItemCard>
<GameItemCard id='croparia:ritual_stand_3'></GameItemCard>
</RowGallery>

El Atril ritual es el bloque central de los **Rituales**. Tras construir la estructura ritual, colocar los bloques de entrada correctos y dejar caer el objeto de entrada sobre el atril, se activa un ritual. Los rituales pueden fabricar objetos nuevos, encantar otros existentes o invocar criaturas.

Haz clic derecho sobre el Atril ritual con un objeto en la mano para colocar una unidad encima. Si el atril recibe una señal débil de redstone, colocará una pila completa. Un soltador apuntando al atril también puede colocar un objeto sobre él al activarse.

### Receta

<RowGallery>
<RecipeDisplay id="croparia:crafting/ritual_stand"></RecipeDisplay>
<RecipeDisplay id="croparia:crafting/ritual_stand_2"></RecipeDisplay>
<RecipeDisplay id="croparia:crafting/ritual_stand_3"></RecipeDisplay>
</RowGallery>

### Uso

Primero debes construir la estructura ritual correspondiente al nivel del Atril ritual. Las estructuras de nivel superior también pueden usarse para rituales de nivel inferior. Puedes verlas en tu visor de recetas:

<RowGallery>
<RecipeDisplay id="croparia:ritual_stand"></RecipeDisplay>
<RecipeDisplay id="croparia:ritual_stand_2"></RecipeDisplay>
<RecipeDisplay id="croparia:ritual_stand_3"></RecipeDisplay>
</RowGallery>

En la vista de estructura superior, la marca `Input Block` señala las posiciones donde deben colocarse los bloques de entrada del ritual. Cuando los bloques correctos estén colocados y dejes caer el objeto de entrada sobre el Atril ritual, se activará el ritual.

Si el resultado es un Libro encantado, el ritual aplica encantamientos al objeto de entrada. Los encantamientos y niveles del libro indican los encantamientos disponibles y su nivel máximo, mientras que la cantidad de libros indica cuántos niveles se añaden por ritual.

Si el resultado es un Huevo generador, el ritual invoca a la criatura correspondiente.

### Depuración

Mientras te agachas, usa el [Asistente de recetas](./others.md#croparia:recipe_wizard) sobre el Atril ritual para generar la estructura ritual correspondiente centrada en él.
