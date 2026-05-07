---
title: Generación de datos en tiempo de ejecución
desc: Resumen del sistema de generación de datos en tiempo de ejecución de Croparia IF para desarrolladores downstream, incluyendo los principales puntos de extensión alrededor de DgEntry, DataGenerator y Placeholder.
keywords:
  - Croparia IF
  - generación de datos en tiempo de ejecución
  - DataGenerator
  - DgEntry
  - DgRegistry
  - Placeholder
  - Template
  - documentación para desarrolladores
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 30
---

# Generación de datos en tiempo de ejecución (desarrollador)

<a id="overview"></a>

El **sistema de generación de datos en tiempo de ejecución** es la parte de Croparia IF capaz de generar archivos de texto dinámicamente por lotes mientras el juego está en ejecución.

Si primero quieres entender la función desde el punto de vista del autor de modpacks, consulta [Generación de datos en tiempo de ejecución (modpack)](../../modpack/generator/index.md#overview).
Esta sección para desarrolladores se centra en ampliar el propio sistema, principalmente mediante [entradas del generador](entry.md#create-entry), [generadores de datos](generator.md#create-generator-class) y [resolvedores de placeholders](placeholder.md#basic-creation).

<a id="navigation"></a>

## Navegación

- [Añadir entradas del generador](entry.md#create-entry)
- [Crear generadores de datos personalizados](generator.md#create-generator-class)
- [Crear resolvedores de placeholders](placeholder.md#basic-creation)

