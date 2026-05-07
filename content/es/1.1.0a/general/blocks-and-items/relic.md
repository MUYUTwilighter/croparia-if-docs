---
title: Reliquias
desc: Reúne los objetos de utilidad tipo reliquia en Croparia IF 1.1.0a, incluidos Cuerda mágica, Cuerno de la abundancia, Mano de Midas y Manzana infinita.
navOrder: 30
---

# Reliquias

Las reliquias son una serie de objetos utilitarios con efectos muy variados.

<a id='croparia:magic_rope'></a>

## Cuerda mágica

<div class="doc-center">
<GameItemCard id='croparia:magic_rope'></GameItemCard>
</div>

La Cuerda mágica teletransporta al jugador a una posición guardada.

Mientras la sostienes, agáchate y haz clic derecho sobre el suelo para vincular una posición. Después, haz clic derecho con la cuerda ya vinculada para activar el teletransporte.

### Receta

<div class="doc-center">
<RecipeDisplay id="croparia:ritual/relic/horn_plenty"></RecipeDisplay>
</div>

<a id='croparia:horn_plenty'></a>

## Cuerno de la abundancia

<div class="doc-center">
<GameItemCard id='croparia:horn_plenty'></GameItemCard>
</div>

Mantener pulsado el clic derecho consume experiencia para invocar cualquier comida. El coste en XP es igual al valor de hambre del alimento invocado.

Los alimentos que no pueden invocarse se controlan mediante el tag `#croparia:horn_plenty_blacklist`.

### Receta

<div class="doc-center">
<RecipeDisplay id="croparia:ritual/relic/magic_rope"></RecipeDisplay>
</div>

<a id='croparia:midas_hand'></a>

## Mano de Midas

<div class="doc-center">
<GameItemCard id='croparia:midas_hand'></GameItemCard>
</div>

La Mano de Midas puede convertir bloques en lingotes de oro o entidades en bloques de oro.

Cuando se usa sobre un bloque, consume 10 XP, rompe el bloque, genera un lingote de oro como drop y aplica un enfriamiento según la dureza del bloque. Los bloques inmunes se definen mediante el tag `#croparia:midas_hand_immune`; al usar el objeto sobre uno de ellos, se invoca un rayo sobre el jugador.

Cuando se usa sobre una entidad, elimina esa entidad y genera un bloque de oro en su posición. En mobs hostiles cuesta experiencia equivalente al doble de su salud y aplica un enfriamiento de 400 ticks. En otras criaturas cuesta experiencia igual a su salud y aplica un enfriamiento de 200 ticks. Las entidades inmunes se definen mediante el tag `#croparia:midas_hand_immune`; al usar el objeto sobre una de ellas, se invoca un rayo sobre esa entidad.

### Receta

<div class="doc-center">
<RecipeDisplay id="croparia:ritual/relic/midas_hand"></RecipeDisplay>
</div>

<a id='croparia:infinite_apple'></a>

## Manzana infinita

<div class="doc-center">
<GameItemCard id='croparia:infinite_apple'></GameItemCard>
</div>

Un alimento que nunca se consume. Cada uso otorga 5 segundos de efectos equivalentes a una Manzana dorada encantada, con un enfriamiento de 200 ticks de juego.

### Receta

<div class="doc-center">
<RecipeDisplay id="croparia:ritual/relic/infinite_apple"></RecipeDisplay>
</div>
