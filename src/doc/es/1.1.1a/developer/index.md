---
title: Desarrolladores
desc: Punto de entrada para desarrolladores de Croparia IF 1.1.1a, con módulos centrales, APIs compartidas, publicación en Maven y referencias de mantenimiento.
navOrder: 40
---

# Documentación para desarrolladores

<a id="overview"></a>

Estas páginas están pensadas para quienes quieren extender, integrar o mantener `Croparia IF`.

Normalmente llegarás aquí en tres situaciones:

- quieres entender cómo funciona un módulo central concreto;
- quieres reutilizar alguna de las APIs compartidas del mod;
- quieres seguir manteniendo contenido integrado, como los cultivos internos.

<a id="how-to-read"></a>

## Por dónde empezar

Si es tu primera vez aquí, estos tres puntos de entrada suelen ser los más útiles:

- [Módulos centrales](core/index.md#overview)
- [Network API](network.md#overview)
- [Repo API](repo/index.md#overview)

Si lo que buscas sobre todo son bloques reutilizables, entra directamente en:

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

Este grupo resulta más útil para preguntas como:

- dónde empieza realmente un módulo en el código;
- cómo se conectan bloques, entidades de bloque, menús, pantallas, recetas y red;
- qué capa conviene inspeccionar primero al ajustar el comportamiento de un módulo.

### APIs compartidas

- [Repositorio Maven](maven.md#overview)
- [Repo API](repo/index.md#overview)
- [Sistema de generación de datos en tiempo de ejecución](generator/index.md#overview)
- [Recipe API](recipe/index.md#overview)
- [Codec API](codec/index.md#overview)
- [Network API](network.md#overview)
- [Otras APIs comunes](other/index.md#overview)

Este grupo resulta más útil para preguntas como:

- qué capacidades reutilizables expone ya el mod;
- qué capa merece la pena reutilizar en vez de copiar una implementación concreta;
- cómo conectar Croparia IF con tu propio entorno de desarrollo.

### Referencias de mantenimiento de contenido

- [Añadir cultivos integrados](crop.md#overview)

Estas páginas están más orientadas al mantenimiento. Por ejemplo, `crop` se centra en:

- cómo añade Croparia IF el contenido integrado de `Crop` y `Melon`;
- por dónde empezar si necesitas seguir manteniendo ese contenido interno.

<a id="next"></a>

## Siguiente paso sugerido

- Para entender cómo funciona el mod en conjunto, empieza por [Módulos centrales](core/index.md#overview)
- Para añadir Croparia IF como dependencia de desarrollo en tu propio proyecto, empieza por [Repositorio Maven](maven.md#overview)
- Para trabajar con almacenamiento, automatización o capacidades de objetos de plataforma, empieza por [Repo API](repo/index.md#overview)
- Para trabajar con generación de datos en tiempo de ejecución, empieza por [Sistema de generación de datos en tiempo de ejecución](generator/index.md#overview)
- Para depurar interacciones de interfaz o sincronización del cliente, empieza por [Network API](network.md#overview)
