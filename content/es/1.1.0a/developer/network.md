---
title: Red
desc: Presenta la abstracción de red de Croparia IF mediante NetworkHandler y NetworkHandlerType, además de los dos flujos reales de interacción del menú Crop Transmuter y sincronización de recetas.
keywords:
  - Croparia IF
  - red
  - NetworkHandler
  - NetworkHandlerType
  - CropTransmuter
  - S2CSyncRecipeStart
  - S2CSyncRecipeChunk
  - S2CSyncRecipeEnd
  - Architectury
  - documentación para desarrolladores
  - 1.1.0a
navOrder: 60
---

# Red

<a id="overview"></a>

Croparia IF no construye un framework de red pesado por su cuenta. En su lugar, añade una capa unificadora más ligera sobre `NetworkManager` de Architectury:

- `NetworkHandler`
- `NetworkHandlerType`

El objetivo de esa capa es bastante directo:

- permitir que un paquete lleve en un solo sitio su tipo, codec, dirección y lógica de manejo
- simplificar el registro multiplataforma
- mantener el código de envío lo más uniforme posible

Si solo quieres una imagen rápida del flujo de red del mod, quédate con esto:

- `NetworkHandler` significa “un paquete que puede enviarse y procesarse”
- `NetworkHandlerType` significa “el registro de ese paquete”

<a id="mental-model"></a>

## Modelo mental

La capa de red de Croparia IF puede entenderse en tres niveles:

1. `NetworkHandler`
2. `NetworkHandlerType`
3. `NetworkHandlers`

Sus responsabilidades son:

- `NetworkHandler`
  - el objeto de paquete concreto
  - también implementa `CustomPacketPayload`
  - proporciona su propio tipo e implementa `handle(...)`
- `NetworkHandlerType`
  - describe si este paquete es `C2S` o `S2C`
  - mantiene el `CustomPacketPayload.Type`
  - mantiene el `StreamCodec`
  - puede llevar opcionalmente un `PacketTransformer`
- `NetworkHandlers`
  - el punto de entrada central del registro
  - conecta cada tipo de paquete al sistema de envío y recepción de Architectury

La idea de esta estructura no es la complejidad, sino que todos los paquetes acaben teniendo la misma forma:

- un record u objeto como carga útil
- una constante `TYPE` como metadato de registro
- un método `handle(...)` como lógica de recepción

<a id="network-handler"></a>

## `NetworkHandler`

`NetworkHandler` es la abstracción mínima de Croparia IF para un paquete.

Principalmente ofrece tres cosas:

- `type()`
  - por defecto obtiene el tipo real del payload desde `handlerType()`
- `send()`
  - decide automáticamente si debe enviarse al servidor o difundirse a clientes según el lado del paquete
- `handle(NetworkManager.PacketContext context)`
  - punto de entrada de la lógica de negocio una vez recibido

El detalle más importante aquí es que el comportamiento del envío ya está condicionado por la dirección declarada.

- Si `handlerType().side()` es `C2S`
  - `send()` intentará enviarlo al servidor
- Si `handlerType().side()` es `S2C`
  - `send()` lo difundirá, o usará `send(ServerPlayer)` para un jugador concreto

Eso significa que quien llama normalmente no necesita una rama extra para decidir “si esto es un paquete de cliente”. El propio tipo del paquete ya lo ha declarado.

<a id="network-handler-type"></a>

## `NetworkHandlerType`

`NetworkHandlerType` es el descriptor de registro de un paquete.

Empaqueta:

- el `Identifier` del paquete
- la dirección de envío y recepción `NetworkManager.Side`
- el `StreamCodec`
- un `PacketTransformer` opcional

Los helpers de creación más comunes en el código fuente son:

- `NetworkHandlerType.ofC2S(...)`
- `NetworkHandlerType.ofS2C(...)`

La forma más fácil de entenderlo es como la ficha de registro del paquete:

- `NetworkHandler` es la carga útil real
- `NetworkHandlerType` le dice al sistema cómo identificarlo, cómo codificarlo y decodificarlo, y a qué lado pertenece

`ofS2C(...)` también admite un `PacketTransformer`, algo importante en sincronizaciones con mucha carga. El flujo de sincronización de recetas es el ejemplo más claro.

<a id="registration"></a>

## Flujo de registro

El punto de entrada unificado del registro es `NetworkHandlers`.

Su trabajo es:

- llamar una vez a `register(...)` por cada `NetworkHandlerType`
- elegir la ruta de registro correcta de Architectury según el lado del paquete
- en `S2C`, cubrir tanto el registro de recepción en cliente como la declaración del payload en el servidor

La ventaja principal para desarrolladores es:

- los paquetes de negocio no necesitan lógica de registro separada para Fabric / Forge / NeoForge
- la mayor parte del tiempo solo tienes que preocuparte por la constante `TYPE` y por `handle(...)`

<a id="c2s-flow"></a>

## Flujo C2S típico: `CropTransmuter`

El ejemplo `C2S` más claro del código actual es la pantalla del menú `CropTransmuter`.

Aquí intervienen dos paquetes:

- `CropTransmuterSelectPacket`
- `CropTransmuterRedstoneModePacket`

Ambos son enviados por interacciones de la interfaz cliente en [CropTransmuterScreen](core/crop-transmuter.md#network-and-ui), y después el servidor los procesa para actualizar la block entity correspondiente.

### Selección de salida

`CropTransmuterSelectPacket` envía al servidor “qué salida candidata seleccionó el jugador en la interfaz”.

Su payload solo contiene:

- `BlockPos pos`
- `int selectedIndex`

En el servidor, el manejo pasa por una cadena de comprobaciones:

1. ¿El emisor es un `ServerPlayer`?
2. ¿El menú abierto actualmente es realmente un `CropTransmuterMenu`?
3. ¿La posición del menú coincide con la posición del paquete?
4. ¿La block entity en esa posición es realmente un `CropTransmuterBlockEntity`?
5. ¿Existe material de entrada válido en ese momento?
6. ¿`selectedIndex` está dentro del rango válido?

Solo entonces se llama a `transmuter.setSelectedIndex(...)`.

Este flujo es una referencia excelente porque resume muy bien la actitud normal de Croparia IF ante `C2S`:

- el cliente solo envía el estado mínimo necesario
- el servidor siempre vuelve a validar el contexto real
- el estado de interfaz que viene del cliente no se considera fiable por sí solo

### Cambio del modo de redstone

`CropTransmuterRedstoneModePacket` es más simple y solo transporta la posición del bloque objetivo.

En el servidor:

1. comprueba que el menú actual y la posición sigan coincidiendo
2. encuentra la `CropTransmuterBlockEntity` correspondiente
3. llama a `toggleRedstoneMode()`
4. después usa `menu.broadcastChanges()` para que el estado del menú vuelva al cliente

Eso hace que la responsabilidad del paquete sea muy estrecha:

- solo significa “el usuario pidió cambiar el modo”
- el cambio real de estado sigue realizándose en el servidor

<a id="s2c-flow"></a>

## Flujo S2C típico: sincronización de recetas

El otro flujo que merece la pena estudiar es la sincronización de recetas `S2C` en tres etapas usada por `SyncedRecipeCache`:

- `S2CSyncRecipeStart`
- `S2CSyncRecipeChunk`
- `S2CSyncRecipeEnd`

Juntos sirven para un único objetivo:

- enviar al cliente una instantánea de los tipos de receta marcados como “requieren sincronización del lado cliente”

### Por qué son tres etapas

La sincronización no se hace en un único paquete enorme. Se divide en tres fases:

1. `Start`
  - informa al cliente del `syncId` de esta ronda y de qué tipos de receta incluye
2. `Chunk`
  - envía los datos reales de receta por tipo y por fragmentos
3. `End`
  - indica al cliente que la ronda terminó y que ya puede comprometer la nueva instantánea

Las ventajas son:

- el cliente puede distinguir con claridad una ronda completa de sincronización
- grandes conjuntos de recetas no tienen que caber en un único paquete enorme
- el servidor puede enviar los datos por fragmentos, agrupados por tipo y tamaño

### `SplitPacketTransformer`

Cuando `S2CSyncRecipeChunk` registra su `TYPE`, también lleva un `SplitPacketTransformer`.

Eso significa que la sincronización de recetas no solo se fragmenta a nivel lógico. La capa de red también declara explícitamente que las cargas grandes necesitan división a nivel de transporte. Para desarrolladores, este patrón es muy útil:

- si un payload `S2C` puede crecer mucho, no dependas solo de “enviar un poco menos”
- puedes seguir este patrón y adjuntar un transformer en `NetworkHandlerType`

### Cómo lo aplica el cliente

El punto de aterrizaje del lado cliente es `SyncedRecipeCache`:

- `beginClientSync(...)`
  - crea el estado de la ronda actual de sincronización
- `acceptChunk(...)`
  - guarda temporalmente cada fragmento recibido
- `endClientSync(...)`
  - fusiona todos los fragmentos en la nueva instantánea activa
  - y después dispara `CompatRecipeRefresh.onRecipesUpdated(...)`

La idea importante aquí no es “procesar cada paquete inmediatamente”, sino:

- primero ensamblar una instantánea completa en el cliente
- después refrescar la visibilidad de recetas en un solo paso

<a id="queue-and-validation"></a>

## Dos hábitos comunes dentro de `handle(...)`

Estos paquetes comparten dos hábitos de implementación muy estables.

### `context.queue(...)`

La lógica de negocio suele envolverse dentro de `context.queue(...)`.

Eso significa que Croparia IF prefiere devolver los cambios reales de estado al contexto de hilo correcto, en vez de mutar directamente el mundo o las cachés del cliente dentro del hilo bruto del callback de red.

Si añades un paquete nuevo, normalmente deberías seguir el mismo patrón.

### Validar primero, mutar después

Tanto en `CropTransmuter` como en la sincronización de recetas, la lógica no consiste simplemente en “recibir y cambiar estado”.

Las comprobaciones habituales incluyen:

- si el jugador actual existe
- si el menú abierto sigue coincidiendo
- si la posición del bloque sigue coincidiendo
- si el tipo de block entity sigue coincidiendo
- si índices, materiales o números de fragmento siguen siendo válidos

Esta es una de las lecciones más reutilizables de la capa de red:

- mantén los paquetes pequeños
- deja la confianza en el lado receptor

<a id="when-to-follow"></a>

## Cuándo seguir este patrón

El diseño actual de red encaja bien cuando:

- estás añadiendo una interacción pequeña de GUI que necesita enviar clics de botones o selecciones al servidor
- necesitas sincronizar una instantánea de solo lectura al cliente y esperas que la carga crezca bastante
- ya estás usando `StreamCodec` y quieres que la definición y el registro de paquetes mantengan un estilo uniforme
- quieres una capa sobre Architectury que siga sintiéndose cercana a la lógica del mod

Si tu caso es extremadamente local y puntual, no hace falta abstraerlo todo en más capas. Pero en cuanto entre en la superficie compartida de API de Croparia IF, seguir `NetworkHandler` / `NetworkHandlerType` suele ser la opción más segura.

<a id="tips"></a>

## Recomendaciones

- Para paquetes nuevos, prioriza el patrón “un objeto de payload + una constante `TYPE` + un `handle(...)`”, porque encaja mejor con el estilo de código existente.
- Los paquetes `C2S` deberían enviar solo la información mínima necesaria. No confíes en grandes cantidades de estado proporcionado por el cliente.
- Cuando un paquete toca menús o block entities, vuelve a validar siempre la posición, la vinculación del menú y el tipo de entidad en el servidor.
- Si un payload `S2C` puede crecer mucho, prioriza una sincronización por fases y fragmentos como la de recetas.
- Si un sistema termina funcionando alrededor de una instantánea de cliente, prefiere “acumular primero y confirmar una vez” en lugar de refrescar el estado visible con cada paquete recibido.
