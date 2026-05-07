---
title: Transmutador de cultivos
desc: Explica el módulo del Transmutador de cultivos, incluyendo su bloque, block entity, menú, pantalla e interacciones de red, para ayudar a entender la lectura de materiales, la selección de candidatos y el procesamiento controlado por redstone.
keywords:
  - Croparia IF
  - documentación para desarrolladores
  - CropTransmuter
  - CropTransmuterBlockEntity
  - CropTransmuterMenu
  - CropTransmuterScreen
  - CropTransmuterSelectPacket
  - RepoProxy
modVersions:
  - 1.1.0a
navOrder: 10
---

# Transmutador de cultivos

<a id="overview"></a>

El Transmutador de cultivos es uno de los mejores módulos de Croparia IF para leer arquitectura, porque toca varias capas a la vez:

- lógica de bloque y estado de bloque
- persistencia de block entity
- flujo de menú y pantalla
- interacción de red `C2S`
- entrada y salida de automatización

Si quieres ver cómo se separa un "módulo de máquina completo", esta página suele ayudar más que leer las APIs por separado.

<a id="module-role"></a>

## Función del módulo

Su trabajo puede resumirse en una frase:

- leer el `Material` del fruto de entrada
- expandir ese `Material` en varios resultados candidatos
- dejar que el jugador o el estado actual de la interfaz decidan qué candidato está seleccionado
- convertir entradas en salidas una por una cuando se cumple la condición de redstone

Así que no es una máquina que funcione contra una tabla fija de recetas. Es una máquina donde la entrada define un conjunto de candidatos y el estado guardado determina el resultado real.

<a id="core-classes"></a>

## Clases principales

- `CropTransmuter`
  - el bloque en sí
  - abre el menú, mantiene el estado `POWERED` y registra proxies de automatización
- `CropTransmuterBlockEntity`
  - el verdadero centro del estado en tiempo de ejecución
  - almacena inventario, índice seleccionado y modo de redstone
- `CropTransmuterMenu`
  - el menú del lado del servidor
  - define ranuras y sincroniza datos básicos
- `CropTransmuterScreen`
  - la pantalla del lado del cliente
  - renderiza el panel de candidatos, la paginación, los botones y las acciones de clic
- [CropTransmuterSelectPacket](../network.md#c2s-flow)
  - sincroniza el candidato seleccionado desde el cliente al servidor
- [CropTransmuterRedstoneModePacket](../network.md#c2s-flow)
  - cambia el modo de redstone

<a id="state-and-data"></a>

## Estado y datos

`CropTransmuterBlockEntity` solo guarda unas pocas piezas de estado importantes, pero cada una tiene una función muy clara:

- `inventory`
  - dos ranuras
  - `INPUT_SLOT` guarda el fruto de entrada
  - `OUTPUT_SLOT` guarda el resultado transmutado
- `selectedIndex`
  - el índice del candidato actualmente seleccionado
- `positiveRedstone`
  - si la máquina trabaja con redstone activado o con redstone desactivado

Lo que decide finalmente la salida no es el menú en sí, sino:

- el `Material` asociado al objeto de entrada
- el `selectedIndex` persistido

Así que la elección del usuario termina convirtiéndose en estado de la block entity, y no solo en un estado temporal de la interfaz del cliente.

<a id="processing-flow"></a>

## Flujo de procesamiento

### 1. Abrir el menú

Cuando el jugador hace clic derecho sobre el bloque, `CropTransmuter.useItemOn(...)` llama a `MenuRegistry.openExtendedMenu(...)` en el servidor.

Se usa un menú extendido en lugar de uno simple porque el cliente también necesita la posición del bloque, y los dos paquetes `C2S` validan esa posición más adelante.

### 2. Leer el material de entrada

`CropTransmuterBlockEntity.readInputMaterial()` comprueba la ranura de entrada:

- si el objeto es un `AbstractFruit<?>`
- entonces lee el `Material` asociado mediante `fruit.getCrop().getMaterial()`

Este diseño importa porque la máquina no necesita su propio registro adicional de cultivos a salidas. Reutiliza directamente la semántica de material ya presente en las definiciones de cultivos.

### 3. Mostrar candidatos en el cliente

`CropTransmuterScreen` no pide una lista separada de candidatos por red. En su lugar, lee el material actual a través del menú y la block entity, y luego renderiza los objetos candidatos con `Material.asItems()`.

Así que:

- el conjunto de candidatos proviene del material de entrada
- la entrada seleccionada proviene de `selectedIndex`
- la pantalla solo visualiza esas dos cosas

### 4. El cliente envía una selección

Cuando el jugador hace clic en uno de los candidatos, el cliente envía `CropTransmuterSelectPacket`.

El servidor no confía ciegamente en ese valor. Vuelve a comprobar:

- que el menú actual sea realmente el de esta máquina
- que la posición del bloque coincida
- que todavía exista un material de entrada
- que el índice recibido siga siendo válido

Solo entonces llama a `setSelectedIndex(...)`.

### 5. Procesamiento impulsado por redstone

El procesamiento real ocurre en `CropTransmuterBlockEntity.serverTick(...)`.

Cada tick hace dos cosas:

- alinear la propiedad `POWERED` del estado del bloque con la entrada real de redstone
- decidir si la máquina debe trabajar ahora a partir de `powered != isPositiveRedstone()`

Cuando esa condición se cumple, pasa a `tryProcess(...)`.

### 6. Producir la salida

El flujo dentro de `tryProcess(...)` es bastante directo:

1. leer la ranura de entrada
2. resolver el `Material` actual
3. obtener la lista de candidatos desde `Material.asItems()`
4. escoger el objetivo actual mediante `selectedIndex`
5. intentar insertar el resultado en la ranura de salida
6. consumir una entrada si la inserción tiene éxito

Aquí no hay una capa extra de emparejamiento de recetas, porque la regla principal de la máquina ya está codificada por `Material`.

<a id="automation"></a>

## Integración con automatización

`CropTransmuter` expone su automatización de objetos mediante `ProxyProvider.registerItem(...)` durante la construcción.

Las restricciones reales de entrada y salida se definen dentro de `CropTransmuterBlockEntity`:

- el lado de entrada usa `repo.asAcceptOnly().asLocked(OUTPUT_SLOT)`
- el lado de salida usa `repo.asConsumeOnly().asLocked(INPUT_SLOT)`

Luego esas vistas se envuelven en dos instancias `RepoProxy<ItemSpec>`:

- la parte superior y los laterales reciben el proxy de entrada
- la parte inferior recibe el proxy de salida

Esto merece estudiarse porque mantiene las reglas de automatización en la capa de almacenamiento, en lugar de repartirlas por la lógica de la máquina. Para más contexto, consulta la [Repo API](../repo/index.md).

<a id="network-and-ui"></a>

## División de responsabilidades entre menú, pantalla y red

Una de las cosas más útiles al desarrollar alrededor de este módulo es ver que menú, pantalla y red se mantienen cada uno en su propia capa:

- `Menu`
  - proporciona las ranuras del contenedor y los datos básicos sincronizados
- `Screen`
  - renderiza el panel de candidatos y las interacciones locales
- `Network`
  - solo transporta "qué seleccionó el usuario" y "qué quiere cambiar"
- `BlockEntity`
  - almacena el estado final de confianza

Así que, si quieres modificar este módulo, normalmente puedes ubicar la capa correcta así:

- cambiar la lógica de candidatos: mira `readInputMaterial()` y `Material.asItems()`
- cambiar el comportamiento de redstone: mira `serverTick()` y `positiveRedstone`
- cambiar la presentación de la interfaz: mira `CropTransmuterScreen`
- cambiar el comportamiento de automatización: mira `visitItem(...)` y `RepoProxy`

<a id="extension"></a>

## Notas de extensión

- Si quieres construir otra máquina donde la entrada determine un conjunto de candidatos, este módulo es una de las mejores plantillas conceptuales.
- Si quieres cambiar cómo se produce la lista de candidatos, sustituye primero el paso de "entrada a lista de candidatos" antes de tocar la capa de menú o de red.
- Si quieres añadir más estado configurable, guárdalo primero en la block entity y deja que el menú y la pantalla lean desde ahí, en lugar de conservarlo solo en el cliente.
- Si quieres soportar bien la automatización, diseña primero los límites de entrada y salida en la capa `Repo` o `RepoProxy`.

