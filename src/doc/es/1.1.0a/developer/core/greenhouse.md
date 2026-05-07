---
title: Invernadero
desc: Explica el módulo del Invernadero, incluyendo cosecha automática, almacenamiento interno y proxies de automatización, para ayudar a entender cómo organiza la lógica en torno al estado de cultivos y el procesamiento de drops.
keywords:
  - Croparia IF
  - documentación para desarrolladores
  - Greenhouse
  - GreenhouseBlockEntity
  - CropBlock
  - RepoProxy
  - cosecha automática
  - 1.1.0a
navOrder: 20
---

# Invernadero

<a id="overview"></a>

El Invernadero es mucho más simple que el Transmutador de cultivos, pero es un módulo muy útil para entender otro tipo de diseño de tiempo de ejecución:

- no hay una interfaz compleja
- no hay paquetes de red dedicados
- el foco está en "reaccionar automáticamente a estados de bloques del mundo" y "guardar los resultados en un inventario interno"

Si quieres estudiar un módulo orientado a automatización y guiado por actualizaciones del mundo, esta página encaja mejor.

<a id="module-role"></a>

## Función del módulo

El Invernadero hace principalmente tres cosas:

- observar el estado del cultivo bajo sí mismo
- activar crecimiento o cosecha en el momento adecuado
- guardar los drops resultantes en su inventario interno cuando sea posible

No define un sistema nuevo de recetas propio. En su lugar reutiliza:

- la lógica de drops ya existente del bloque vanilla o del propio cultivo
- el inventario interno junto con `RepoProxy`

Así que se entiende mejor como un módulo de cosecha y almacenamiento automáticos, no como una máquina de recetas.

<a id="core-classes"></a>

## Clases principales

- `Greenhouse`
  - el bloque en sí
  - abre el contenedor, activa el momento de cosecha y registra proxies de automatización
- `GreenhouseBlockEntity`
  - almacena un inventario de 9 ranuras
  - ejecuta la lógica concreta de cosecha y depósito

A diferencia de otros módulos principales, este no tiene una clase de menú propia ni paquetes dedicados. Simplemente reutiliza `DispenserMenu` como interfaz de contenedor.

<a id="inventory"></a>

## Inventario interno y automatización

`GreenhouseBlockEntity` guarda su contenido en un `Container` de 9 ranuras, y luego lo envuelve mediante:

- `new ContainerRepo<>(this)`
- `RepoProxy.item(...)`

Eso crea el proxy de objetos uniforme que los sistemas de automatización externos pueden consumir.

Durante la construcción del bloque, `Greenhouse` registra ese proxy con `ProxyProvider`, lo que permite a sistemas externos tratar el Invernadero como un almacenamiento de objetos normal.

Si esta capa no te resulta familiar, la mejor lectura de fondo es la [Repo API](../repo/index.md#overview).

El punto clave de implementación aquí no es un control complejo de permisos. Es la exposición estable del almacenamiento interno a la automatización exterior.

<a id="harvest-flow"></a>

## Flujo de cosecha

El Invernadero no ejecuta la cosecha mediante un bucle de tick dedicado. En su lugar entra principalmente por la cadena de actualizaciones del bloque:

- `onPlace(...)`
- `updateShape(...)`

En el lado del servidor, `updateShape(...)`:

1. lee el estado del bloque inferior
2. obtiene la block entity actual
3. llama a `GreenhouseBlockEntity.tryHarvest(...)`

Después `tryHarvest(...)` deriva según el tipo de bloque inferior:

- `CropBlock`
  - gestionado mediante `tryHarvestCrop(...)`
- `AttachedStemBlock`
  - gestionado mediante `tryHarvestMelon(...)`

Así que la idea central no es "simular el crecimiento de todas las plantas con un único algoritmo", sino:

- detectar si el bloque inferior pertenece a uno de los tipos de planta soportados
- y luego encaminar la cosecha por la lógica correspondiente

<a id="crop-path"></a>

## Ruta de cultivos normales

`tryHarvestCrop(...)` sigue este proceso:

1. comprobar si el cultivo está maduro
2. llamar a `Block.getDrops(...)` para obtener los drops
3. retirar una semilla de esos drops para simular la resiembra
4. intentar almacenar la salida restante en el inventario interno
5. si el almacenamiento tiene éxito, devolver el cultivo inferior a un estado de crecimiento intermedio

Dos detalles merecen especial atención:

- no destruye y replanta el cultivo; en su lugar retrocede la propiedad de edad
- el estado del mundo solo se modifica cuando el lado de almacenamiento puede aceptar realmente la salida

Así que una gran parte de la estabilidad del módulo viene de "confirmar el almacenamiento primero y luego confirmar la cosecha."

<a id="melon-path"></a>

## Ruta de melones gigantes

La ruta de melones gigantes funciona de forma distinta:

1. localizar la posición del fruto mediante `AttachedStemBlock.FACING`
2. leer los drops del fruto
3. intentar guardarlos en el inventario interno
4. eliminar el bloque del fruto si el almacenamiento tiene éxito

Aquí no hay retroceso de edad, porque los melones gigantes ya usan una estructura de dos partes: tallo y fruto.

Así que el módulo no intenta forzar un único algoritmo de cosecha:

- los cultivos normales se centran en el reinicio de edad
- los melones gigantes se centran en localizar y retirar el bloque de fruto real

<a id="growth"></a>

## Aceleración de crecimiento

Además de cosechar, el Invernadero también llama al `randomTick(...)` vanilla sobre el `CropBlock` inferior durante su propio `randomTick(...)`.

Eso significa que el módulo realmente tiene dos comportamientos:

- ayudar a que los cultivos sigan creciendo
- cosecharlos y almacenarlos automáticamente cuando maduran

Así que no es solo un bloque contenedor, ni solo una cosechadora. Es un módulo completo de apoyo al crecimiento.

<a id="storage"></a>

## Límite del almacenamiento

`GreenhouseBlockEntity.tryDeposit(...)` recorre los drops e intenta aceptarlos mediante `RepoProxy`.

La intención del diseño es muy clara:

- la generación de drops sigue perteneciendo al bloque de la planta
- el Invernadero solo decide si puede absorber esos drops

Al ampliar este módulo, conviene recordar que la mayor parte de su flexibilidad vive en la "detección de cosecha" y la "estrategia de almacenamiento", no en cómo se generan los drops. La generación de drops sigue viniendo del comportamiento ya existente del bloque del mundo.

<a id="extension"></a>

## Notas de extensión

- Si quieres que el Invernadero soporte más tipos de plantas, el primer sitio a ampliar suele ser la lógica de derivación en `tryHarvest(...)`.
- Si quieres cambiar el comportamiento de almacenamiento, ajusta `tryDeposit(...)` antes de cambiar el propio flujo de cosecha.
- Si necesitas automatización más compleja, reutiliza el patrón actual de exposición mediante `RepoProxy` en lugar de construir una segunda integración improvisada de contenedores.
- Si quieres un ejemplo de "lógica automática construida alrededor del comportamiento existente de bloques del mundo", este módulo es un muy buen punto de partida.

