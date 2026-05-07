---
title: TestedCodec
desc: Explicación de TestedCodec en Croparia IF, de cómo ejecuta comprobaciones previas antes de codificar o decodificar de verdad, y de por qué sirve como bloque base para herramientas como MultiCodec.
keywords:
  - Croparia IF
  - Codec API
  - TestedCodec
  - CodecUtil
  - EncodeTest
  - DecodeTest
  - MultiCodec
  - comprobación previa
  - documentación para desarrolladores
modVersions:
  - 1.1.0a
navOrder: 10
---

# TestedCodec

<a id="overview"></a>

`TestedCodec<T>` es la pieza más básica de la Codec API de Croparia IF. Envuelve un `Codec<T>` normal y ejecuta una comprobación ligera antes de que ocurra la codificación o decodificación real.

Existe porque:

- no todas las ramas de codec son adecuadas para cualquier entrada
- algunas ramas pueden descartarse solo mirando la estructura bruta
- un codec individual no debería tener que encargarse a la vez del orden de ramas y del filtrado de ramas

Por eso, `TestedCodec` rara vez es el protagonista de una función grande por sí solo. Mucho más a menudo actúa como base pequeña bajo [MultiCodec](multi-codec.md#overview), [MultiFieldCodec](multi-field-codec.md#overview) y `CodecUtil.of(...)`.

<a id="core-idea"></a>

## Idea básica

Internamente, `TestedCodec<T>` guarda tres cosas:

- el `Codec<T>` real que hace el trabajo
- un `EncodeTest<T>`
- un `DecodeTest<?>`

Su comportamiento es simple:

- ejecuta `EncodeTest` antes de codificar
- ejecuta `DecodeTest` antes de decodificar
- si la prueba tiene éxito, continúa con el codec envuelto
- si la prueba falla, devuelve `DataResult.error(...)` directamente

Así que su valor principal no es "cómo codificar o decodificar", sino "si esta rama debería intentarse siquiera".

<a id="when-to-use"></a>

## Cuándo usarlo

Buenos casos de uso:

- estás combinando varias ramas dentro de `MultiCodec` y quieres filtrar incompatibilidades obvias primero
- quieres que un codec solo permita codificar cuando un objeto cumpla cierta condición de estado
- quieres mensajes de error más claros para ramas rechazadas

Casos menos adecuados:

- solo hay una rama de codec y no hace falta filtrado estructural
- toda la validación ya está expresada de forma natural dentro del codec

<a id="basic-usage"></a>

## Uso básico

En la práctica, la entrada más común no es `new TestedCodec<>(...)`, sino `CodecUtil.of(...)`:

```java
Codec<List<String>> raw = Codec.STRING.listOf();

TestedCodec<List<String>> codec = CodecUtil.of(
    raw,
    list -> list.isEmpty()
        ? TestedCodec.fail(() -> "List must not be empty")
        : TestedCodec.success()
);
```

Esto significa:

- usar el codec base para decodificar
- comprobar antes de codificar si la lista está vacía
- si está vacía, rechazar la codificación con un error explícito

Si necesitas una comprobación previa del lado de la decodificación, también puedes proporcionar un `DecodeTest`:

```java
TestedCodec<Integer> codec = CodecUtil.of(
    Codec.INT,
    (ops, input) -> ops.getNumberValue(input).isSuccess()
        ? TestedCodec.success()
        : TestedCodec.fail(() -> "Input is not a number")
);
```

<a id="encode-decode-tests"></a>

## `EncodeTest` y `DecodeTest`

`TestedCodec` expone dos interfaces de prueba:

- `EncodeTest<T>`
  - comprueba si un objeto debería codificarse con la rama actual
- `DecodeTest<I>`
  - comprueba si la entrada bruta debería decodificarse con la rama actual

Ambas devuelven un `TestResult`, que contiene:

- `success = true/false`
- `msg = Supplier<String>`

Aquí hay un detalle práctico importante: el mensaje de fallo se construye de forma diferida, así que puedes hacerlo más específico sin añadir coste a la ruta exitosa.

<a id="with-multicodec"></a>

## Relación con `MultiCodec`

Si `MultiCodec` se encarga de "probar varias ramas en orden", entonces `TestedCodec` se encarga de "que cada rama verifique primero si tiene sentido".

Por eso `CodecUtil.of(...)` prefiere envolver codecs normales dentro de `TestedCodec` antes de combinarlos.

La relación puede leerse así:

- `TestedCodec`
  - comprobación previa local a una rama
- `MultiCodec`
  - orden y despacho entre ramas

Así que al diseñar un codec que acepte varias formas de entrada, el patrón habitual es:

1. preparar un codec para cada formato
2. añadir `TestedCodec` cuando ayude a filtrar ramas
3. combinarlos con `MultiCodec`

<a id="tips"></a>

## Consejos

- Cuando varias ramas se distinguen bien por estructura, conviene usar `DecodeTest` explícito en lugar de dejar que todas fallen de forma costosa.
- `EncodeTest` funciona mejor para decidir si una rama debe usarse, no para cargar con todas las reglas de negocio.
- Si tu objetivo es solo "meter un codec normal dentro de `MultiCodec`", empieza por `CodecUtil.of(...)` en vez de escribir constructores a mano cada vez.
- Si el mensaje de error está dirigido a desarrolladores, intenta explicar por qué esa rama no aplica, y no solo que falló.

