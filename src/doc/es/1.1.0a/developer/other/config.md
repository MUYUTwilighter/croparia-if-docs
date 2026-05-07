---
title: Sistema de configuración
desc: Explica el objeto Config y ConfigFileHandler de Croparia IF, centrándose en la división de responsabilidades, la estrategia de valores por defecto y el comportamiento de carga, guardado y recarga.
keywords:
  - Croparia IF
  - Config
  - ConfigFileHandler
  - sistema de configuración
  - archivo de configuración
  - documentación para desarrolladores
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 10
---

# Sistema de configuración

<a id="overview"></a>

El sistema de configuración de Croparia IF se construye principalmente a partir de dos piezas:

- `Config`
- `ConfigFileHandler`

Sus papeles están claramente separados:

- `Config` representa el objeto de configuración en tiempo de ejecución
- `ConfigFileHandler` carga, guarda y recarga ese objeto desde disco

Eso significa que el sistema no es simplemente "mapear campos JSON directamente a una clase". Separa de forma explícita:

- la estructura del archivo crudo
- la semántica en tiempo de ejecución
- el comportamiento de IO del archivo

<a id="config-object"></a>

## `Config`

`Config` es el objeto de tiempo de ejecución que consume la lógica real del mod. En la mayoría de casos, los desarrolladores no deberían escribir lógica directamente alrededor de los campos crudos del archivo, sino depender del objeto ya normalizado.

Se encarga principalmente de:

- resolver rutas relativas respecto al directorio del juego
- proporcionar valores por defecto cuando faltan campos
- separar las reglas de blacklist en blacklist de ID de cultivo y blacklist de mods
- exponer comprobaciones más cercanas al negocio, como `isCropValid(...)` e `isModValid(...)`

Así que, si tu objetivo es simplemente "leer la configuración y decidir si una función está activada", la dependencia correcta es `Config`, no el objeto crudo del archivo.

<a id="raw-and-runtime"></a>

## Configuración cruda frente a configuración de ejecución

Por la estructura del código puede verse que Croparia IF separa intencionadamente:

- `RawConfig`
- `Config`

en dos capas distintas.

Cada una tiene un propósito diferente:

- `RawConfig` se mantiene cerca de la forma del archivo, lo que facilita la decodificación y el guardado
- `Config` se mantiene cerca de la lógica de ejecución, lo que facilita su uso real

La mejor forma de leer este diseño es: primero se lee el archivo y luego se normaliza en un objeto de ejecución que resulte cómodo de usar.

<a id="file-handler"></a>

## `ConfigFileHandler`

`ConfigFileHandler` es el dueño de la IO y la recarga de configuración.

Sus responsabilidades principales son:

- `load()`
- `save(Config)`
- `reload(Config)`

El detalle de diseño importante es:

- `load()` hace más que leer; si el archivo falta o no puede leerse, construye una configuración por defecto y la guarda inmediatamente
- `reload(Config)` no reemplaza la referencia del objeto de configuración; copia los valores nuevos dentro de la instancia existente

Eso significa que:

- otros sistemas pueden seguir conservando la misma instancia de `Config`
- una recarga no obliga a todos los consumidores a volver a pedir un objeto nuevo

<a id="paths"></a>

## Gestión de rutas

`parsePath(...)` y `resolvePath(...)` dentro de `Config` capturan una estrategia de rutas muy útil:

- los archivos de configuración pueden guardar rutas relativas
- en tiempo de ejecución siempre se resuelven frente al directorio del juego
- al guardar, se intenta volver a una forma relativa siempre que sea posible

El beneficio directo es:

- las configuraciones son más fáciles de mover entre máquinas
- los usuarios tienen menos posibilidades de fijar rutas absolutas específicas de una máquina dentro del archivo

Si estás construyendo otro sistema que también debe soportar rutas relativas y absolutas, esta parte merece reutilizarse.

<a id="blacklist"></a>

## El modelo de blacklist

El diseño del blacklist en `Config` también es un buen ejemplo de normalización en tiempo de ejecución. A nivel de archivo es solo una lista de cadenas, pero en tiempo de ejecución se divide en:

- blacklist de ID de cultivo
- blacklist de mods

La blacklist de mods incluso soporta coincidencias mediante expresiones regulares.

Para desarrolladores, lo importante es notar que:

- el archivo expone una forma muy simple
- el objeto de ejecución expone una estructura mucho más útil para tomar decisiones reales

Así que, si necesitas ampliar la lógica de configuración, cambia primero la normalización y las comprobaciones dentro de `Config`, en lugar de empujar más lógica de negocio de vuelta a los campos crudos del archivo.

<a id="when-to-use"></a>

## Cuándo merece la pena copiar este diseño

Si tu propio sistema necesita algo más que "leer un objeto JSON", por ejemplo:

- valores por defecto
- resolución de rutas
- recarga en tiempo de ejecución
- normalización desde campos de archivo hacia una estructura que el programa realmente quiera usar

entonces la separación `RawConfig -> Config -> ConfigFileHandler` de Croparia IF es una referencia muy buena.

<a id="tips"></a>

## Consejos

- Mantén la IO de archivos centralizada del modo en que lo hace `ConfigFileHandler`, en lugar de dejar que se reparta por el código de cada función.
- Si puedes normalizar una vez dentro de `Config`, no hagas que la lógica de ejecución dependa directamente de la forma bruta del JSON.
- Si el sistema necesita recarga en caliente, suele valer la pena actualizar una sola instancia duradera en lugar de reemplazar toda la red de referencias.

