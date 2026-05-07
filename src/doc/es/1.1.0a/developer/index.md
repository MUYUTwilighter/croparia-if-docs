---
title: Desarrolladores
desc: Punto de entrada para desarrolladores de Croparia IF 1.1.0a, con módulos centrales, APIs compartidas y referencias de mantenimiento de contenido.
navOrder: 40
---

# Documentación para desarrolladores

<a id="overview"></a>

Este conjunto de páginas está pensado para quienes quieren extender, integrar o mantener `Croparia IF`.

Normalmente llegarás aquí en tres situaciones:

- quieres entender cómo funciona un módulo central concreto;
- quieres reutilizar alguna de las APIs compartidas del mod;
- quieres seguir manteniendo contenido integrado, como los cultivos internos.

<a id="how-to-read"></a>

## Por dónde empezar

Si es tu primera vez en esta sección, los tres puntos de entrada más útiles suelen ser:

- [Módulos centrales](core/index.md#overview)
  - Empieza entendiendo cómo se conectan el Infusor, el Atril ritual, el Transmutador de cultivos y el Invernadero.
- [Network API](network.md#overview)
  - Ideal si quieres revisar interacciones de menús, sincronización de recetas y abstracciones de registro de paquetes.
- [Repo API](repo/index.md#overview)
  - Ideal si quieres almacenamiento, entrada/salida de automatización y puente con capabilities de plataforma.

Si ya sabes qué hace cada módulo y lo que necesitas son herramientas reutilizables, entra directamente en:

- [Sistema de generación de datos en tiempo de ejecución](generator/index.md#overview)
- [Recipe API](recipe/index.md#overview)
- [Codec API](codec/index.md#overview)
- [Otras APIs comunes](other/index.md#overview)

<a id="sections"></a>

## Temas actuales

### Módulos centrales

- [Resumen de módulos centrales](core/index.md#overview)
- [Transmutador de cultivos](core/crop-transmuter.md#overview)
- [Invernadero](core/greenhouse.md#overview)
- [Infusor](core/infusor.md#overview)
- [Atril ritual](core/ritual_stand.md#overview)
- [FakePlayer](core/fake-player.md#overview)

Este grupo responde mejor a:

- dónde está la clase de entrada de un módulo concreto;
- cómo se conecta con menús, red, recetas y almacenamiento;
- qué capa conviene revisar primero si quieres cambiar un comportamiento.

### APIs compartidas

- [Repo API](repo/index.md#overview)
- [Sistema de generación de datos en tiempo de ejecución](generator/index.md#overview)
- [Recipe API](recipe/index.md#overview)
- [Codec API](codec/index.md#overview)
- [Network API](network.md#overview)
- [Otras APIs comunes](other/index.md#overview)

Este grupo responde mejor a:

- qué capacidades reutilizables ya expone el mod;
- qué capa deberías reutilizar en lugar de copiar una implementación concreta de módulo.

### Referencias de mantenimiento de contenido

- [Añadir cultivos integrados](crop.md#overview)

Estas páginas están más orientadas al mantenimiento. Por ejemplo, `crop` se centra en:

- cómo añade Croparia IF el contenido integrado de `Crop` y `Melon`;
- por dónde empezar si necesitas seguir manteniendo ese contenido interno.

<a id="next"></a>

## Siguiente paso sugerido

- Para entender cómo funciona el mod en conjunto, empieza por [Módulos centrales](core/index.md#overview)
- Para trabajar con almacenamiento, automatización o capabilities de objetos de plataforma, empieza por [Repo API](repo/index.md#overview)
- Para trabajar con generación de datos en tiempo de ejecución, empieza por [Sistema de generación de datos en tiempo de ejecución](generator/index.md#overview)
- Para depurar interacciones de interfaz o sincronización del cliente, empieza por [Network API](network.md#overview)

