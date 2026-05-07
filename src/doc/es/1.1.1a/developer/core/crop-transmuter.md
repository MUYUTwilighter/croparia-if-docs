---
title: Transmutador de cultivos
desc: Explica el módulo del Transmutador de cultivos, incluyendo bloque, block entity, menú, pantalla e interacción de red, con especial atención a la lectura de materiales, la selección de candidatos, el comportamiento de redstone y las nuevas vistas de bloqueo de Repo en 1.1.1a.
keywords:
  - Croparia IF
  - documentación para desarrolladores
  - CropTransmuter
  - CropTransmuterBlockEntity
  - CropTransmuterMenu
  - CropTransmuterScreen
  - CropTransmuterSelectPacket
  - RepoProxy
  - 1.1.1a
navOrder: 10
---

# Transmutador de cultivos

<a id="overview"></a>

El Transmutador de cultivos es uno de los mejores módulos de Croparia IF para estudiar arquitectura, porque toca varias capas al mismo tiempo:

- lógica de bloque y estado de bloque
- persistencia de block entity
- flujo de menú y pantalla
- red `C2S`
- entrada y salida de automatización

Si quieres ver cómo se divide en capas un módulo de máquina completo, esta página suele ser más útil que leer las APIs por separado.

<a id="module-role"></a>

## Función del módulo

Su trabajo puede resumirse en una frase:

- leer el `Material` asociado al fruto de entrada
- expandir ese `Material` en una lista de salidas candidatas
- dejar que el jugador o el estado de pantalla elijan un candidato
- convertir la entrada en la salida elegida cuando se cumpla la condición de redstone

Así que no es una máquina de "tabla fija de recetas". Es una máquina donde la entrada define un conjunto de candidatos y el estado guardado decide el resultado real.

<a id="core-classes"></a>

## Clases principales

- `CropTransmuter`
  - el bloque en sí
  - abre el menú, mantiene `POWERED` y registra proxies de automatización
- `CropTransmuterBlockEntity`
  - el verdadero centro del estado en tiempo de ejecución
  - guarda inventario, índice de selección y modo de redstone
- `CropTransmuterMenu`
  - el menú del servidor
  - define ranuras y datos básicos sincronizados
- `CropTransmuterScreen`
  - la pantalla del cliente
  - renderiza el panel de candidatos, la paginación, los botones y las acciones de clic
- [CropTransmuterSelectPacket](../network.md#c2s-flow)
  - sincroniza la selección del cliente con el servidor
- [CropTransmuterRedstoneModePacket](../network.md#c2s-flow)
  - cambia el modo de redstone

<a id="state-and-data"></a>

## Estado y datos

`CropTransmuterBlockEntity` solo guarda unas pocas piezas de estado importantes, pero cada una tiene un alcance muy claro:

- `inventory`
  - dos ranuras
  - `INPUT_SLOT` guarda el fruto de entrada
  - `OUTPUT_SLOT` guarda el resultado transmutado
- `selectedIndex`
  - el índice del candidato actual
- `positiveRedstone`
  - si la máquina funciona con redstone presente o ausente

La salida final no la decide el menú en sí, sino:

- el `Material` resuelto a partir del objeto de entrada
- el `selectedIndex` persistido

Así que la elección del usuario termina convirtiéndose en estado de la block entity, y no solo en estado temporal de interfaz del cliente.

<a id="processing-flow"></a>

## Flujo de procesamiento

### 1. Abrir el menú

Cuando el jugador hace clic derecho en el bloque, `CropTransmuter.useItemOn(...)` llama a `MenuRegistry.openExtendedMenu(...)` en el servidor.

Se usa un menú extendido porque el cliente también necesita la posición del bloque, y los paquetes `C2S` posteriores validan contra esa posición.

### 2. Leer el material de entrada

`CropTransmuterBlockEntity.readInputMaterial()` comprueba la ranura de entrada:

- si el objeto es un `AbstractFruit<?>`
- lee el `Material` correspondiente mediante `fruit.getCrop().getMaterial()`

Esto es importante porque la máquina no necesita un segundo registro de cultivos a salidas. Reutiliza directamente el significado de material ya guardado en las definiciones de cultivos.

### 3. Mostrar candidatos en el cliente

`CropTransmuterScreen` no obtiene una lista separada de candidatos por la red. Lee el material que ya puede alcanzarse mediante el menú y la block entity, y luego renderiza candidatos con `Material.asItems()`.

Así que:

- el conjunto de candidatos proviene del material de entrada
- la selección actual proviene de `selectedIndex`
- la pantalla solo visualiza esas dos piezas

### 4. El cliente envía una selección

Cuando el jugador hace clic sobre un candidato del panel, el cliente envía `CropTransmuterSelectPacket`.

El servidor no confía directamente en ese valor. Vuelve a comprobar:

- si el menú actual pertenece realmente a esta máquina
- si la posición del bloque sigue coincidiendo
- si todavía existe un material de entrada
- si el índice recibido sigue siendo válido

Solo entonces llama a `setSelectedIndex(...)`.

### 5. Procesamiento impulsado por redstone

El procesamiento real ocurre dentro de `CropTransmuterBlockEntity.serverTick(...)`.

En cada tick hace dos cosas:

- alinear la propiedad `POWERED` del bloque con la entrada real de redstone
- decidir si la máquina debe funcionar ahora mediante `powered != isPositiveRedstone()`

Cuando esa condición se cumple, pasa a `tryProcess(...)`.

### 6. Producir la salida

El flujo dentro de `tryProcess(...)` es bastante directo:

1. leer la ranura de entrada
2. resolver el `Material` actual
3. obtener la lista de candidatos desde `Material.asItems()`
4. escoger el objetivo actual usando `selectedIndex`
5. intentar insertar la salida en la ranura de salida
6. consumir una entrada si la inserción tiene éxito

Aquí no existe una capa extra de emparejamiento de recetas, porque la regla central de la máquina ya está codificada por `Material`.

<a id="automation"></a>

## Integración con automatización

`CropTransmuter` expone su automatización de objetos mediante `ProxyProvider.registerItem(...)` durante la construcción.

Las restricciones reales de E/S se definen dentro de `CropTransmuterBlockEntity`:

- el lado de entrada usa `repo.lockConsume(INPUT_SLOT, OUTPUT_SLOT).lockAccept(OUTPUT_SLOT).trim()`
- el lado de salida usa `repo.lockAccept(INPUT_SLOT, OUTPUT_SLOT).lockConsume(INPUT_SLOT).trim()`

Esas vistas se envuelven luego en dos `RepoProxy<ItemSpec>` separados:

- la parte superior y los laterales reciben el proxy de entrada
- la parte inferior recibe el proxy de salida

En términos de comportamiento práctico:

- vista de entrada
  - rechaza extracción desde cualquier ranura
  - rechaza inserción en la ranura de salida
  - al final solo permite insertar en la ranura de entrada
- vista de salida
  - rechaza inserción en cualquier ranura
  - rechaza extracción desde la ranura de entrada
  - al final solo permite extraer desde la ranura de salida

Este es un buen ejemplo de por qué el nuevo modelo de bloqueo separado de `1.1.1a` resulta útil: el límite de automatización se mantiene en la capa de almacenamiento en lugar de dispersarse por la lógica de la máquina. Para más contexto, consulta [Repo API](../repo/index.md) y [Construye tu propia interacción de almacenamiento](../repo/start.md).

<a id="network-and-ui"></a>

## División de responsabilidades entre menú, pantalla y red

Una de las cosas más útiles de este módulo es ver que menú, pantalla y red permanecen cada uno centrados en su propia capa:

- `Menu`
  - ranuras del contenedor y datos básicos sincronizados
- `Screen`
  - panel de candidatos e interacción local
- `Network`
  - solo transporta lo que el usuario seleccionó y lo que quiere cambiar
- `BlockEntity`
  - guarda el estado final de confianza

Así que, si quieres modificar el módulo, los puntos de entrada habituales son:

- lógica de candidatos: `readInputMaterial()` y `Material.asItems()`
- comportamiento de redstone: `serverTick()` y `positiveRedstone`
- presentación de la UI: `CropTransmuterScreen`
- comportamiento de automatización: `visitItem(...)` y `RepoProxy`

<a id="extension"></a>

## Notas de extensión

- Si quieres otra máquina donde la entrada defina un conjunto de candidatos, este módulo es una de las mejores plantillas de referencia.
- Si quieres cambiar cómo se producen las listas de candidatos, sustituye primero el paso de "entrada a candidatos" antes de editar la capa de menú o red.
- Si quieres más estado configurable, guárdalo primero en la block entity y deja que menú y pantalla lo lean.
- Si quieres soporte de automatización, diseña primero los límites de E/S en la capa `Repo` / `RepoProxy`.

