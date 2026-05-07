---
title: Módulos centrales
desc: Presenta los módulos funcionales principales de Croparia IF para desarrolladores downstream, centrándose en el papel, el flujo de datos y los puntos de extensión de módulos como Infusor, Atril ritual, Transmutador de cultivos e Invernadero.
keywords:
  - Croparia IF
  - documentación para desarrolladores
  - módulos centrales
  - Infusor
  - RitualStand
  - CropTransmuter
  - Greenhouse
  - 1.1.1a
navOrder: 10
---

# Módulos centrales

<a id="overview"></a>

Este grupo no trata de "cómo se diseña una API compartida", sino de cómo funcionan realmente en código los módulos jugables principales de Croparia IF.

Si ya tienes una idea general de:

- [Repo API](../repo/index.md#overview)
- [Recipe API](../recipe/index.md#overview)
- [Network API](../network.md#overview)

entonces esta sección es mejor para responder preguntas como:

- dónde está la clase de entrada principal de un módulo concreto
- cómo se conectan bloque, block entity, menú, pantalla, receta y red
- qué capa conviene tocar primero al cambiar comportamiento o añadir compatibilidad

<a id="modules"></a>

## Módulos cubiertos

- [Transmutador de cultivos](crop-transmuter.md#overview)
  - un módulo completo con block entity, menú, pantalla e interacción `C2S`
- [Invernadero](greenhouse.md#overview)
  - un módulo más centrado en procesamiento automático y almacenamiento
- [Infusor](infusor.md#overview)
  - un módulo típico de "estado de bloque + receta basada en objetos soltados"
- [Atril ritual](ritual_stand.md#overview)
  - un módulo impulsado por objetos soltados que depende más de validación estructural y emparejamiento de recetas
- [FakePlayer](fake-player.md#overview)
  - un pequeño componente de ejecución usado por los módulos centrales para interacción con el mundo

<a id="how-to-read"></a>

## Orden de lectura sugerido

- Si quieres estudiar cómo colaboran GUI, menús y red, empieza por [Transmutador de cultivos](crop-transmuter.md#overview)
- Si quieres estudiar recetas impulsadas por objetos soltados, empieza por [Infusor](infusor.md#overview) y [Atril ritual](ritual_stand.md#overview)
- Si quieres estudiar cómo las block entities exponen almacenamiento y automatización, empieza por [Invernadero](greenhouse.md#overview)

<a id="common-patterns"></a>

## Patrones compartidos en estos módulos

Aunque estos módulos hacen cosas muy diferentes, siguen varios hábitos de diseño bastante consistentes:

- los puntos de entrada de interacción tienden a quedarse en la clase del bloque
- el estado persistente tiende a quedarse en la block entity
- las capacidades compartidas se exponen mediante APIs reutilizables en lugar de fundirse dentro de un único módulo
- los flujos complicados se separan en capas de entrada, estado, emparejamiento y salida

Así que, al leer estas páginas, lo más útil suele ser fijarse no tanto en un método concreto, sino en:

- dónde dibuja cada módulo sus límites de responsabilidad
- por qué depende de cierta API compartida
- en qué capa conviene engancharse al ampliarlo

