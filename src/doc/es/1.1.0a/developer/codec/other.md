---
title: Otras utilidades
desc: Resumen de las utilidades de CodecUtil más usadas fuera de MultiCodec y MultiFieldCodec, incluyendo extend, listOf, toMap, ayudas JSON y conversión a StreamCodec.
keywords:
  - Croparia IF
  - Codec API
  - CodecUtil
  - extend
  - listOf
  - toMap
  - encodeJson
  - decodeJson
  - StreamCodec
  - documentación para desarrolladores
modVersions:
  - 1.1.0a
navOrder: 40
---

# Otras utilidades

<a id="overview"></a>

Además de [TestedCodec](tested-codec.md#overview), [MultiCodec](multi-codec.md#overview) y [MultiFieldCodec](multi-field-codec.md#overview), `CodecUtil` también incluye varias utilidades especialmente prácticas en el desarrollo diario.

Esta página se centra en las que más probablemente vas a usar primero.

<a id="extend"></a>

## `CodecUtil.extend(...)`

Esta es una de las utilidades más representativas de la Codec API de Croparia IF. Su propósito es muy concreto:

- ya tienes un `MapCodec` padre
- la clase hija solo quiere añadir unos pocos campos
- no quieres reescribir todo el `RecordCodecBuilder`

Por ejemplo:

```java
MapCodec<Child> codec = CodecUtil.extend(
    Parent.CODEC,
    Codec.INT.fieldOf("extra").forGetter(Child::getExtra),
    (parent, extra) -> new Child(parent.getId(), extra)
);
```

La idea es:

1. reutilizar `Parent.CODEC` para los campos del padre
2. decodificar el nuevo campo `extra`
3. reconstruir el objeto hijo a partir de ambas partes

En cuanto empiezas a trabajar con modelos de datos basados en herencia, `extend(...)` se vuelve muy cómodo.

<a id="list-of"></a>

## `CodecUtil.listOf(...)`

`listOf(codec)` es la utilidad ya preparada para el patrón "valor único o lista".

```java
MultiCodec<List<Identifier>> codec = CodecUtil.listOf(Identifier.CODEC);
```

Acepta tanto:

- un solo valor
- una lista de valores

y los normaliza a `List<E>`.

Si quieres que tu formato de datos siga siendo cómodo en el caso muy común de "solo un elemento", esta utilidad encaja muy bien.

<a id="to-map"></a>

## `CodecUtil.toMap(...)`

Vanilla separa `Codec<T>` y `MapCodec<T>`:

- `Codec<T>` trabaja con valores arbitrarios
- `MapCodec<T>` trabaja con estructuras de objeto con claves

`CodecUtil.toMap(...)` hace de puente:

- si la entrada ya es un `MapCodec`, la devuelve tal cual
- en caso contrario, la envuelve mediante `MapCodec.assumeMapUnsafe(codec)`

Su caso de uso principal es:

- ahora mismo tienes un `Codec` normal
- pero la API que estás llamando exige un `MapCodec`

Ese `unsafe` no es decorativo. Conviene usarlo solo cuando entiendes de verdad la forma esperada de la entrada.

<a id="json-helpers"></a>

## Ayudas JSON

`CodecUtil` también ofrece varias utilidades orientadas a JSON:

- `encodeJson(object, codec)`
- `decodeJson(element, codec)`
- `dumpJson(object, codec, path, override)`
- `readJson(file, codec)`
- `readJson(string, codec)`

Su valor es principalmente práctico:

- pasan automáticamente por `RegistryOps`
- son cómodas para herramientas, generación de datos y salidas de depuración

Si tu objetivo es simplemente "¿este objeto puede codificarse bien a JSON?" o "leer rápido este objeto desde un archivo", estas utilidades son mucho más cómodas que reconstruir `JsonOps` a mano cada vez.

<a id="stream-codec"></a>

## Utilidades de StreamCodec

Croparia IF también ofrece dos utilidades para la serialización del lado de red:

- `toStream(codec)`
- `mapStream(codec, parser, getter)`

Su trabajo consiste en convertir un `Codec` normal en `StreamCodec<RegistryFriendlyByteBuf, T>`, de manera que estructuras de datos ya existentes puedan reutilizarse en paquetes y lógica de sincronización.

Si ya tienes un `Codec<T>` estable y quieres que la capa de red reutilice el mismo modelo, estas utilidades evitan bastante duplicación.

<a id="ops"></a>

## `getOps(...)` y `getRegistryOps(...)`

Estas son utilidades de nivel más bajo que normalmente no hace falta memorizar, pero se vuelven útiles cuando el código de codecs empieza a fallar por el contexto de registros.

Sus responsabilidades principales son:

- construir `RegistryOps` cuando el contexto de juego está disponible
- hacer una caída segura cuando no hay acceso a registros, por ejemplo en tests o en arranques muy tempranos

Si alguna vez ejecutas codecs manualmente dentro de utilidades y aparecen problemas relacionados con registros, merece la pena estudiar las ideas detrás de estas funciones.

<a id="tips"></a>

## Consejos

- Cuando un tipo hijo solo añade campos, conviene usar `extend(...)` antes de copiar todo el codec del padre.
- Para compatibilidad "valor único o lista", es preferible `listOf(...)` a reconstruir un [MultiCodec](multi-codec.md#list-of) desde cero.
- Usa `toMap(...)` solo cuando sabes que el punto de llamada realmente exige un `MapCodec`.
- Si lo único que quieres es depurar JSON rápidamente, `encodeJson(...)` y `decodeJson(...)` suelen ser la vía más directa.

