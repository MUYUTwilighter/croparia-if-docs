---
title: Componentes de objeto personalizados
desc: Explica los Data Components personalizados de Croparia IF, incluyendo registro, integración con TooltipProvider y los papeles prácticos de Text, TargetPos y BlockProperties.
keywords:
  - Croparia IF
  - documentación para desarrolladores
  - Data Components
  - CropariaComponents
  - Text
  - TargetPos
  - BlockProperties
  - TooltipProvider
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 50
---

# Componentes de objeto personalizados

<a id="overview"></a>

Croparia IF registra un pequeño conjunto de componentes propios sobre los `Data Components` vanilla, de modo que los objetos puedan transportar semántica de tiempo de ejecución más explícita.

Este tema encaja mejor bajo `other` que bajo un módulo principal concreto, porque no es un detalle de implementación local. Es una capacidad transversal que varios sistemas pueden reutilizar.

Si quieres entender:

- cómo se registran los componentes propios del mod
- por qué ciertos objetos muestran automáticamente líneas extra en el tooltip
- para qué sirven `TargetPos`, `Text` y `BlockProperties`

esta página es la entrada correcta.

<a id="registration"></a>

## Punto de entrada de registro

La entrada compartida de registro vive en `CropariaComponents`.

El código actual registra tres componentes:

- `TARGET_POS`
- `BLOCK_PROPERTIES`
- `TEXT`

Todos comparten varios rasgos:

- cada uno se registra como `DataComponentType` vanilla
- cada uno tiene un codec persistente
- si hace falta sincronización con el cliente, se declara explícitamente con `networkSynchronized(...)`

Así que Croparia IF deja que el sistema vanilla de componentes posea tanto:

- qué es el componente
- como cómo viaja sobre item stacks

en lugar de construir otra capa envoltorio de NBT personalizada.

<a id="tooltip-chain"></a>

## Cómo funciona la integración con tooltip

El lugar más fácil donde un desarrollador nota estos componentes es el tooltip de los objetos.

Esa ruta surge principalmente de dos piezas:

- el tipo de componente implementa `TooltipProvider`
- `ItemStackMixin` recorre `CropariaComponents.forEach(...)` durante la construcción del tooltip

Así que Croparia IF no ensambla los tooltips a mano dentro de cada clase de objeto. En cambio:

- deja que cada componente describa cómo quiere renderizarse
- y luego conecta todos los componentes registrados al flujo compartido de tooltip de `ItemStack` mediante un mixin

Las ventajas son bastante claras:

- la lógica de visualización permanece unida al componente
- los objetos que usan ese componente no tienen que duplicar código de UI

<a id="text"></a>

## `Text`

`Text` es el componente personalizado más simple del grupo.

Básicamente envuelve un `MutableComponent` e implementa `TooltipProvider`. Su responsabilidad es muy estrecha:

- adjuntar una carga de texto a un objeto
- mostrar ese texto directamente en el tooltip

Este tipo encaja bien para:

- una línea extra de explicación
- texto de pista temporal
- información legible que debe viajar con el objeto y también aparecer en el tooltip

Si lo único que necesitas es "adjuntar una línea de texto legible al stack", `Text` es la opción más ligera del grupo.

<a id="target-pos"></a>

## `TargetPos`

`TargetPos` representa una posición objetivo ligada tanto a una dimensión como a unas coordenadas.

Sus datos principales son:

- el `Identifier` de dimensión
- el `BlockPos`

Además de mostrarse en tooltip, también proporciona:

- `getLevel(server)`
- `teleport(entity, server)`

Así que no es simplemente una nota de coordenadas. Es un componente de posición con una semántica de comportamiento en tiempo de ejecución muy clara.

Si necesitas que un objeto recuerde:

- un punto enlazado
- un destino de teletransporte
- una referencia de posición entre dimensiones

entonces `TargetPos` es el patrón que merece reutilizarse directamente.

<a id="block-properties"></a>

## `BlockProperties`

`BlockProperties` representa un mapeo de propiedades de estado de bloque con claves de texto, y además es un `TooltipProvider`.

Dentro de Croparia IF no se limita a "guardar un mapa". Está conectado directamente con:

- [Lectura y modificación de propiedades de bloque](block-property.md#overview)

Sus capacidades principales incluyen:

- extraer propiedades desde un `BlockState`
- comprobar si es un subconjunto de otro `BlockState`
- listar las propiedades guardadas en un tooltip

Así que, si necesitas que un objeto transporte una descripción portátil de un estado de bloque, `BlockProperties` es mucho mejor que meter una cadena improvisada dentro del stack.

<a id="network-sync"></a>

## Qué componentes necesitan sincronización de red

Por el estilo de registro en `CropariaComponents`, puede verse que:

- `TARGET_POS`
  - declara explícitamente `networkSynchronized(TargetPos.TYPE.streamCodec())`
- `BLOCK_PROPERTIES`
  - ya incorpora sincronización mediante `BlockProperties.TYPE`
- `TEXT`
  - usa `CodecUtil.toStream(Text.CODEC)` para construir su codec de red

Eso refleja una regla de diseño muy clara en Croparia IF:

- si el cliente también necesita leer bien el componente
- entonces la sincronización de red debe formar parte de la propia definición del tipo

Así que, al añadir componentes nuevos, conviene decidir pronto:

- si se trata solo de una semántica del lado del servidor
- o si el cliente también la necesita para mostrar, renderizar o interactuar

<a id="when-to-use"></a>

## Cuándo conviene usar un componente personalizado

Estas situaciones suelen justificar un componente:

- los datos pertenecen de forma natural a un `ItemStack`
- deben sobrevivir serialización, copia y transporte junto a ese objeto
- pueden ser leídos directamente por tooltip o por la capa visual del cliente
- deberían poseer su propio codec y lógica de visualización

Si los datos son solo una variable temporal de tiempo de ejecución dentro de un sistema, o en realidad no pertenecen al objeto, quizá no compense crear un `DataComponentType` completo.

<a id="tips"></a>

## Consejos

- Al diseñar un componente nuevo, decide primero si es solo un valor crudo o un objeto adjunto al item con semántica real de visualización o comportamiento.
- Si el componente debe aparecer en el tooltip, suele ser mejor implementar `TooltipProvider` en el propio componente en vez de repartir la lógica de tooltip entre clases de objetos.
- Si el cliente necesita leer el componente, diseña la sincronización de red en el momento de registrarlo y no como un parche posterior.
- Si el componente describe de fondo un estado de bloque o una posición objetivo, parte de `BlockProperties` o `TargetPos` antes de inventar otra estructura casi igual.

