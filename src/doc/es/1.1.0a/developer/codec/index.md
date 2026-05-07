---
title: Codec API
desc: Resumen de la Codec API para desarrolladores downstream de Croparia IF, centrado en cómo entender y usar MultiCodec, MultiFieldCodec, TestedCodec y CodecUtil.
keywords:
  - Croparia IF
  - Codec API
  - CodecUtil
  - MultiCodec
  - MultiFieldCodec
  - OptionalMultiFieldCodec
  - TestedCodec
  - MapCodec
  - RecordCodecBuilder
  - documentación para desarrolladores
modVersions:
  - 1.1.0a
navOrder: 50
---

# Codec API

<a id="overview"></a>

La Codec API es el conjunto de extensiones que Croparia IF construye alrededor del sistema `Codec` de Mojang. Su objetivo no es sustituir `Codec`, `MapCodec` ni `RecordCodecBuilder`, sino suavizar varios puntos problemáticos que aparecen con frecuencia al modelar datos reales:

- un tipo necesita soportar varias formas serializadas
- un campo necesita aceptar varios nombres de clave
- una rama debería filtrarse por estructura antes de ejecutar el codec real
- una subclase quiere reutilizar un `MapCodec` padre y solo añadir unos pocos campos

Si ya conoces los codecs vanilla, esta API se entiende mejor como "un pequeño conjunto de mejoras frecuentes centradas en `CodecUtil`."

<a id="when-to-use"></a>

## Cuándo usar la Codec API

Casos típicos en los que conviene usar la Codec API de Croparia IF:

- quieres que un valor acepte tanto una forma individual como una forma en lista
- quieres mantener compatibilidad simultánea entre nombres de campo antiguos y nuevos
- quieres descartar entradas claramente incompatibles antes de entrar al codec real
- ya tienes un `MapCodec` padre y quieres ampliarlo en una subclase sin reescribir todo el `RecordCodecBuilder`

Si tu caso es solo codificación y decodificación normal de objetos, `RecordCodecBuilder.mapCodec(...)` de vanilla suele ser suficiente. No hace falta forzar estas utilidades solo por estilo.

<a id="mental-model"></a>

## Modelo mental

Conviene recordar la API así:

- `TestedCodec`
  - añade una comprobación previa a una sola rama de codec
- `MultiCodec`
  - encadena varios codecs y los prueba en orden
- `MultiFieldCodec`
  - permite que un campo acepte varios nombres de clave
- `OptionalMultiFieldCodec`
  - parecido a `MultiFieldCodec`, pero el campo completo puede no existir
- `CodecUtil.extend(...)`
  - añade campos sobre un `MapCodec` ya existente
- `CodecUtil.listOf(...)`
  - permite que un valor acepte una sola entrada o una lista

En palabras más directas:

- `TestedCodec` responde "¿cuándo merece la pena probar esta rama?"
- `MultiCodec` responde "si hay varias ramas, ¿cuál va primero?"
- `MultiFieldCodec` responde "¿qué pasa si este campo ha usado varios nombres?"
- `CodecUtil.extend(...)` responde "¿cómo reutilizo el codec padre en vez de reescribirlo?"

<a id="navigation"></a>

## Navegación

- [TestedCodec: comprobaciones previas](tested-codec.md#overview)
- [MultiCodec: múltiples formatos](multi-codec.md#overview)
- [MultiFieldCodec: múltiples nombres de campo](multi-field-codec.md#overview)
- [Otras utilidades](other.md#overview)

