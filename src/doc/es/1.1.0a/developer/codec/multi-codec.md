---
title: MultiCodec
desc: Explicación de MultiCodec en Croparia IF y de cómo prueba varios codecs en orden para que un mismo tipo de dato soporte varios formatos serializados.
keywords:
  - Croparia IF
  - Codec API
  - MultiCodec
  - TestedCodec
  - CodecUtil
  - listOf
  - múltiples formatos
  - codec unión
  - documentación para desarrolladores
modVersions:
  - 1.1.0a
navOrder: 20
---

# MultiCodec

<a id="overview"></a>

`MultiCodec<T>` permite que un mismo tipo de dato soporte varias formas serializadas. Prueba sus codecs internos en orden y devuelve el primer resultado exitoso.

Esta necesidad aparece constantemente en sistemas de datos al estilo vanilla, pero Mojang no proporciona un "codec unión ordenado" ya preparado. `MultiCodec` de Croparia IF llena justo ese hueco.

<a id="core-idea"></a>

## Idea básica

`MultiCodec<T>` es esencialmente un `ArrayList<TestedCodec<? extends T>>` que además implementa `Codec<T>`.

Su comportamiento es:

1. probar el primer codec
2. si falla, registrar el error
3. probar el siguiente codec
4. continuar hasta que uno tenga éxito
5. si todos fallan, combinar sus errores y devolver el fallo conjunto

Así que lo importante no es solo que pueda contener varios codecs, sino que **su orden importa**.

Las ramas anteriores tienen la primera oportunidad de consumir la entrada, así que conviene pensar bien:

- qué formato es más específico
- qué formato es más amplio
- si los mensajes de error seguirán ayudando durante la depuración

<a id="when-to-use"></a>

## Cuándo usarlo

Casos de uso comunes:

- un valor puede escribirse como valor único o como lista
- un objeto puede usar una forma abreviada o una forma completa
- formatos antiguos y nuevos de configuración deben coexistir

Por ejemplo, un campo puede aceptar:

```json
"minecraft:stone"
```

o:

```json
["minecraft:stone", "minecraft:dirt"]
```

Ese es exactamente el tipo de situación donde `MultiCodec` encaja bien.

<a id="basic-usage"></a>

## Uso básico

La vía de construcción más común es `CodecUtil.of(...)`:

```java
MultiCodec<List<String>> codec = CodecUtil.of(
    Codec.STRING.listOf(),
    Codec.STRING.xmap(List::of, List::getFirst)
);
```

Esto significa:

- primero intentar decodificar la entrada como lista
- si falla, intentarla como una sola cadena
- normalizar ambas formas a `List<String>`

En el día a día suele ser mejor usar `CodecUtil.listOf(...)` directamente, porque esa utilidad ya expresa bien el patrón "elemento único o lista".

<a id="with-tested-codec"></a>

## Relación con `TestedCodec`

`MultiCodec` solo decide el orden. No decide si una rama es razonable para la entrada actual. Esa parte le corresponde a [TestedCodec](tested-codec.md#overview).

Dentro de `CodecUtil.of(...)`, los codecs normales se envuelven automáticamente en `TestedCodec`, así que puedes elegir entre:

- pasar codecs normales
- pasar ramas `TestedCodec` que ya tengan su filtrado personalizado

Cuando los límites entre ramas pueden describirse bien, las comprobaciones explícitas con `TestedCodec` suelen hacer el resultado:

- más fácil de depurar
- más seguro frente a ramas demasiado amplias
- más estable para compatibilidad de formatos a largo plazo

<a id="list-of"></a>

## `CodecUtil.listOf(...)`

`CodecUtil.listOf(codec)` es la ayuda más común basada en `MultiCodec`. Permite que un valor acepte:

- un solo elemento
- una lista de elementos

y siempre devuelve `List<E>`.

```java
MultiCodec<List<Identifier>> codec = CodecUtil.listOf(Identifier.CODEC);
```

Ese codec puede aceptar:

```json
"croparia:gem_earth"
```

y:

```json
["croparia:gem_earth", "croparia:gem_water"]
```

La idea no es solo ahorrar unas líneas, sino hacer que un patrón de compatibilidad muy frecuente se comporte igual en todas partes.

<a id="ordering"></a>

## Cómo elegir el orden de las ramas

El orden de las ramas es la decisión principal en `MultiCodec`. Una regla útil suele ser:

- poner primero los formatos más específicos
- dejar después los formatos más amplios y más propensos a "tragarse" entradas por error

Por ejemplo:

- una forma de objeto suele ser más específica que una forma de cadena
- una forma en lista suele ser más específica que una forma de valor único

Si el orden se invierte, una rama demasiado flexible puede tener éxito antes de tiempo e impedir que se pruebe la rama más adecuada.

<a id="tips"></a>

## Consejos

- `MultiCodec` funciona mejor para "un mismo significado, varias escrituras". No sustituye al modelado normal de datos.
- Si el número de ramas sigue creciendo, a menudo es mejor estrechar el modelo primero en lugar de seguir apilando alternativas.
- Cuando una forma de rama se detecta fácilmente, combina `MultiCodec` con [TestedCodec](tested-codec.md#with-multicodec).
- Si solo necesitas "valor único o lista", prefiere [CodecUtil.listOf](other.md#list-of).

