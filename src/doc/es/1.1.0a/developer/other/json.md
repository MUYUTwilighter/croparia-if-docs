---
title: Transformación JSON
desc: Explica JsonTransformer de Croparia IF y cómo convierte formatos como json, toml y cdg en JsonElement para su posterior lectura mediante Codec.
keywords:
  - Croparia IF
  - JsonTransformer
  - JSON
  - TOML
  - CDG
  - JsonElement
  - documentación para desarrolladores
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 20
---

# Transformación JSON

<a id="overview"></a>

`JsonTransformer` vive en `api.json`, y su trabajo es muy directo: convertir varios formatos de texto en un único `JsonElement` unificado.

La razón de esta capa es:

- los sistemas superiores pueden seguir usando una tubería uniforme basada en `Codec` / `JsonElement`
- las diferencias entre formatos se quedan en el borde de lectura de archivos en vez de filtrarse hacia la lógica de negocio

Los formatos soportados por defecto en el código actual son:

- `json`
- `toml`
- `cdg`

<a id="mental-model"></a>

## Modelo mental

La forma más sencilla de entender `JsonTransformer` es verlo como "una capa de preprocesado de texto antes de Codec".

No se encarga de:

- validación estructural a nivel de negocio
- deserialización de objetos
- resolución de registros

Se encarga exactamente de una cosa:

- convertir un formato de texto en `JsonElement`

Por eso el sistema de generación de datos en tiempo de ejecución puede leer archivos `.json`, `.toml` y `.cdg` y aun así mantener un flujo de decodificación posterior completamente unificado.

<a id="workflow"></a>

## Flujo de trabajo

El flujo es intencionadamente simple:

1. elegir un transformer según la extensión del archivo
2. convertir el texto bruto en `JsonElement`
3. entregar el resultado a la lógica basada en codecs o a la capa de negocio

En el código fuente, esta relación formato-transformer se guarda en `JsonTransformer.TRANSFORMERS`.

<a id="formats"></a>

## Por qué esta capa es útil

Su principal valor está en los límites claros:

- la detección del formato queda concentrada en la capa de entrada
- los sistemas superiores solo tienen que trabajar con `JsonElement`

Sin `JsonTransformer`, los sistemas superiores suelen caer en uno de estos patrones:

- cada módulo funcional empieza a comprobar `.json / .toml / .cdg` por su cuenta
- los codecs terminan cargando con responsabilidades que en realidad pertenecen a la conversión de formatos de texto

El diseño de Croparia IF aquí es:

- normalizar primero el texto a `JsonElement`
- y dejar que todo lo posterior fluya como datos con forma de JSON

Eso mantiene mucho más limpios sistemas como:

- [Generación de datos en tiempo de ejecución](../generator/index.md#overview)
- [Codec API](../codec/index.md#overview)

<a id="when-to-use"></a>

## Cuándo conviene reutilizar este patrón

Si el sistema que estás construyendo:

- necesita soportar varios formatos de configuración de texto
- termina enviando todos ellos a una misma tubería de codecs
- se beneficia de separar "leer el archivo" de "decodificar el objeto"

entonces `JsonTransformer` es un diseño de referencia muy sólido.

Si el sistema solo soporta JSON simple, o nunca necesita `JsonElement`, entonces añadir una capa de transformación separada solo por consistencia probablemente no compensa.

<a id="tips"></a>

## Consejos

- Cuando la lógica de nivel superior ya gira alrededor de `JsonElement` o `Codec`, suele ser más limpio normalizar formatos primero mediante algo como `JsonTransformer`.
- Si más adelante necesitas un formato de texto adicional, añádelo primero en la capa de transformación en lugar de editar varios módulos de negocio.
- `JsonTransformer` funciona mejor como "texto a estructura JSON". No debería convertirse en el lugar donde se validan semánticas a nivel de objeto.

