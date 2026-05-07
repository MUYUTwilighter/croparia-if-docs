---
title: Asistente de recetas
desc: Presenta el uso básico del Asistente de recetas en Croparia IF 1.1.0a, incluyendo generación de recetas dentro del juego y acciones de depuración al agacharse.
navOrder: 50
---

# Asistente de recetas

El Asistente de recetas es un objeto añadido por Croparia IF para que los autores de modpacks puedan crear recetas y otros datos con rapidez directamente dentro del juego. También incluye algunas acciones de depuración.

## Uso: generar recetas

Haz clic derecho sobre un bloque objetivo para iniciar un intento de generación de receta. Si faltan parámetros necesarios, el objeto mostrará el aviso correspondiente.

Objetivos compatibles y fuentes de parámetros actuales:

- [Infusor](../../general/blocks-and-items/workstations.md#croparia:infusor): Infusión elemental
  - objeto colocado sobre el Infusor: objeto de entrada
  - objeto en la mano secundaria: objeto de salida
  - estado de infusión del Infusor: tipo de elemento
- [Piedra elemental](../../general/blocks-and-items/workstations.md#croparia:elemental_stone): Remojo elemental
  - estado de infusión del Infusor sobre la Piedra elemental: tipo de elemento
  - bloques alrededor de la Piedra elemental: bloque de entrada
  - bloque debajo de la Piedra elemental: bloque de salida
- [Atril ritual](../../general/blocks-and-items/workstations.md#croparia:ritual_stand): Ritual
  - bloques en las posiciones de entrada de la estructura ritual: bloques de entrada
  - objeto sobre el Atril ritual: objeto de entrada
  - objeto en la mano secundaria: objeto de salida

**Nota**: el Asistente de recetas puede personalizarse. Consulta [Crear generadores personalizados del Asistente de recetas](custom-usage.md).

## Uso: acciones de depuración

Agacharte y hacer clic derecho sobre un bloque objetivo con el Asistente de recetas puede activar comportamientos adicionales.

- [Infusor](../../general/blocks-and-items/workstations.md#croparia:infusor): alterna el estado de infusión del Infusor
- [Piedra elemental](../../general/blocks-and-items/workstations.md#croparia:elemental_stone): crea un [Infusor](../../general/blocks-and-items/workstations.md#croparia:infusor) sobre la Piedra elemental
- [Atril ritual](../../general/blocks-and-items/workstations.md#croparia:ritual_stand): genera la estructura ritual correspondiente centrada en el Atril ritual

