---
title: MultiFieldCodec
desc: Explicación de MultiFieldCodec y OptionalMultiFieldCodec en Croparia IF, que permiten que un campo acepte varios nombres de clave y presencia opcional.
keywords:
  - Croparia IF
  - Codec API
  - MultiFieldCodec
  - OptionalMultiFieldCodec
  - CodecUtil
  - fieldsOf
  - optionalFieldsOf
  - varios nombres de clave
  - MapCodec
  - documentación para desarrolladores
modVersions:
  - 1.1.0a
navOrder: 30
---

# MultiFieldCodec

<a id="overview"></a>

`MultiFieldCodec<T>` se construye sobre `MapCodec<T>` y permite que un mismo campo acepte varios nombres de clave. Resulta especialmente útil para campos renombrados, alias y compatibilidad hacia atrás.

Donde [MultiCodec](multi-codec.md#overview) resuelve "varios formatos de valor", `MultiFieldCodec` resuelve "varios nombres para el mismo campo".

<a id="core-idea"></a>

## Idea básica

Su comportamiento es:

- durante la decodificación, recorrer varios nombres de clave candidatos en orden
- devolver el primero que exista y se decodifique correctamente
- durante la codificación, escribir siempre usando el primer nombre

Eso lo vuelve muy adecuado para escenarios donde la lectura debe seguir siendo compatible, pero la escritura debe converger en un nombre canónico.

Por ejemplo, si quieres que funcionen tanto:

```json
{ "id": 1 }
```

como:

```json
{ "index": 1 }
```

puedes mapear ambos nombres al mismo campo con `MultiFieldCodec`.

<a id="codecutil-fields"></a>

## `CodecUtil.fieldsOf(...)`

En código real, normalmente no se instancia `MultiFieldCodec` directamente. La entrada habitual es `CodecUtil.fieldsOf(...)`:

```java
MapCodec<MyType> codec = RecordCodecBuilder.mapCodec(instance -> instance.group(
    CodecUtil.fieldsOf(Codec.INT, "id", "index").forGetter(MyType::getId)
).apply(instance, MyType::new));
```

Esto significa:

- aceptar tanto `id` como `index` al decodificar
- codificar siempre de vuelta como `id`

Es un patrón muy natural para renombrar campos de forma gradual.

<a id="optional-field"></a>

## `OptionalMultiFieldCodec`

`OptionalMultiFieldCodec<T>` es la variante opcional de la misma idea.

La diferencia es:

- si ninguno de los nombres candidatos existe, devuelve `Optional.empty()`
- si existen claves candidatas pero todas fallan al decodificar, devuelve un error

Por eso encaja mejor en:

- campos opcionales
- compatibilidad con nombres antiguos cuando el campo en sí no es obligatorio

En la práctica, la entrada habitual es `CodecUtil.optionalFieldsOf(...)`.

<a id="codecutil-optional"></a>

## `CodecUtil.optionalFieldsOf(...)`

Croparia IF expone dos formas habituales:

- una que devuelve `OptionalMultiFieldCodec<T>`
- otra que acepta un valor por defecto y devuelve un `MapCodec<T>` normal

Por ejemplo:

```java
MapCodec<Integer> codec = CodecUtil.optionalFieldsOf(Codec.INT, 0, "id", "index");
```

Eso significa:

- `id` e `index` son ambos aceptados
- si ninguna clave existe, se usa el valor por defecto `0`
- al codificar, solo se escribe el primer nombre

Si quieres conservar el significado de "presente frente a ausente", es preferible usar la forma opcional y manejar tú mismo el `Optional<T>`.

<a id="when-to-use"></a>

## Cuándo usarlo

Buenos casos de uso:

- un campo fue renombrado, pero las configuraciones antiguas todavía deben cargarse
- un mismo concepto ha usado históricamente más de un nombre
- quieres exponer un alias más amigable sin perder compatibilidad con nombres antiguos

Malos casos de uso:

- los nombres difieren porque el significado real ya se ha separado
- solo quieres evitar escribir definiciones de campo correctas

Si la semántica detrás de dos nombres ya se ha separado, no deberían seguir fusionados dentro de un mismo `MultiFieldCodec`.

<a id="tips"></a>

## Consejos

- Como la codificación siempre escribe el primer nombre, asegúrate de que ese primer nombre sea el que quieres conservar a largo plazo.
- Si el campo es realmente opcional, conviene usar `optionalFieldsOf(...)` en lugar de mezclar "campo ausente" con "parseo fallido".
- Cuando un campo empieza a acumular demasiados alias, suele ser señal de que el propio modelo de configuración necesita limpieza.
- Si además necesitas varios nombres de clave **y** varios formatos de valor, es completamente válido combinar `MultiFieldCodec` con [MultiCodec](multi-codec.md#overview).

