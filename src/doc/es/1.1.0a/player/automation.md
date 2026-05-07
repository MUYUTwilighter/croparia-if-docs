---
title: Ideas de automatización
desc: Notas de automatización para jugadores de Croparia IF 1.1.0a, con el Invernadero, Botany Pots, montajes de redstone e interacciones compatibles con logística.
navOrder: 2
---

# Ejemplos de automatización

Croparia IF no incluye por sí solo una infraestructura completa de automatización a gran escala, como tuberías o autocrafteo. Aun así, algunos de sus bloques principales están pensados para funcionar bien con interfaces de automatización. Esta página reúne algunas ideas prácticas.

## Cultivo

### 1. Invernadero

Croparia IF incluye un **Invernadero** integrado que puede cosechar tanto cultivos de un solo bloque como cultivos tipo melón cuando se coloca encima de ellos.

<div class="doc-center">
<GameItemCard id='croparia:greenhouse'></GameItemCard>
</div>

El Invernadero admite interacción logística, así que puedes conectarlo a tuberías de otros mods para recoger los objetos.

![Interacción logística del Invernadero](/assets/greenhouse-transport.webp)

### 2. Botany Pots

Croparia IF también incluye compatibilidad integrada con [Botany Pots](https://modrinth.com/mod/botany-pots).

![Botany Pots](/assets/botany-pots.webp)

## Infusión elemental y rituales

El [Infusor](../general/blocks-and-items/workstations.md#croparia:infusor) y el [Atril ritual](../general/blocks-and-items/workstations.md#croparia:ritual_stand) pueden interactuar con ciertos dispositivos de redstone y bloques de almacenamiento. Gracias a ello, el Infusor ya puede utilizarse en procesos por lotes.

A continuación tienes un ejemplo de montaje para automatizar la Infusión elemental:

<RowGallery>
<img src='/assets/infusor-auto-1.webp' alt="Infusión elemental automatizada" />
<img src='/assets/infusor-auto-2.webp' alt="Vista superior de la Infusión elemental automatizada" />
</RowGallery>

Tal como se muestra:

- un dispensador junto al Infusor contiene [Pociones elementales](../general/concepts/element.md#potion) y llena el Infusor al activarse;
- un soltador junto a él contiene [Croparia](../general/blocks-and-items/croparia.md#croparia:croparia) y coloca el objeto de entrada sobre el Infusor al dispararse;
- un cofre bajo el Infusor recibe automáticamente los objetos de salida y las botellas de vidrio vacías.

Este ejemplo utiliza las tuberías y filtros de [Modern Dynamics](https://modrinth.com/mod/modern-dynamics) para simplificar la estructura, pero la misma idea también puede implementarse con filtros de tolvas u otras soluciones de transporte equivalentes dentro de distintos modpacks.

La parte más delicada es hacer que el soltador se active el número correcto de veces. En este montaje se usa el retardo de repetidores para dispararlo dos veces. En algunos modpacks puede que tengas acceso a otros bloques o herramientas que lo hagan más cómodo.

