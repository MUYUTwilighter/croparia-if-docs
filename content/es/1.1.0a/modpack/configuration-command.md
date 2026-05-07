---
title: Configuración y comandos
desc: Presenta el archivo de configuración de Croparia IF 1.1.0a, los comandos de configuración del servidor y los comandos habituales para consultar y exportar cultivos y generadores.
keywords:
  - Croparia IF
  - 1.1.0a
  - modpack
  - configuración
  - comandos
  - croparia.json
  - croparia
  - cropariaServer
  - autoReload
  - override
  - filePath
  - recipeWizard
  - generator
  - dumpBuiltin
  - clearBuiltin
navOrder: 10
---

# Configuración y comandos

Croparia IF guarda su archivo de configuración en `[directorio del juego]/config/croparia.json`. Muchas de estas opciones afectan directamente a la carga de cultivos, a los directorios de salida generados y al comportamiento del sistema de generación de datos en tiempo de ejecución, por lo que conviene leer esta página junto al [Sistema de generación de datos en tiempo de ejecución](./generator/index.md).

El mod lee la configuración al iniciar el juego y al entrar en un mundo, y libera los recursos de ejecución relacionados al salir de ese mundo.

<a id="config-file"></a>

## Opciones de configuración

Las siguientes opciones proceden de la implementación `Config` del código fuente actual de `1.1.0a`.

| Nombre         | Valor por defecto                | Descripción |
|----------------|----------------------------------|-------------|
| `autoReload`   | 20                               | Retraso antes de programar una recarga adicional de datapacks al entrar en un mundo; valores menores que 0 la desactivan |
| `override`     | true                             | Si los datos temporales generados se limpian automáticamente |
| `filePath`     | "croparia"                       | **Directorio raíz de los archivos de datos del mod**, incluyendo datos temporales, definiciones de cultivos, directorios de generadores y más |
| `recipeWizard` | "croparia\\recipe_wizard\\dump"  | Directorio de exportación usado por el Asistente de recetas |
| `fruitUse`     | true                             | Si los cultivos de fruto pueden convertirse en materiales al hacer clic derecho sobre el suelo |
| `infusor`      | true                             | Si la infusión elemental está habilitada |
| `ritual`       | true                             | Si los rituales elementales están habilitados |
| `soakAttempts` | 1                                | Número de intentos de remojo ejecutados al activarse el remojo elemental; establecerlo en 0 lo desactiva |
| `cropYield`    | 2                                | Cantidad de material producida por los cultivos de fruto integrados |
| `melonYield`   | 2                                | Cantidad de material producida por los cultivos gigantes integrados |
| `blacklist`    | []                               | Lista negra de cultivos; los valores normales son IDs de cultivo y los que empiezan con `@` se tratan como reglas regex para namespaces de mods |

<a id="command-roots"></a>

## Comandos

Los comandos se dividen entre el comando de cliente `/croparia` y el comando de servidor `/cropariaServer`.

- `/croparia`: solo ofrece comandos de `crop`, `melon` y `generator`, y solo afecta a los datos locales del cliente.
- `/cropariaServer`: ofrece comandos de `crop`, `melon` y `generator` del lado del servidor, además de comandos para modificar opciones de configuración.

<a id="crop-melon-commands"></a>

### Comandos de cultivos y cultivos gigantes

- `/croparia|cropariaServer crop|melon query [ID del cultivo]`: consulta información del cultivo. Si no se indica un ID, muestra la información del cultivo correspondiente al objeto que llevas en la mano o al bloque al que apuntas.
- `/croparia|cropariaServer crop|melon dump [ID del cultivo]`: exporta definiciones de cultivos a `crops/` o `melons/` dentro del directorio raíz de datos del mod.
- `/croparia|cropariaServer crop|melon create [...argumentos]`: crea una nueva definición de cultivo en `crops/` o `melons/` dentro del directorio raíz de datos del mod.

<a id="generator-commands"></a>

### Comandos de generadores de datos

- `/croparia|cropariaServer generator query [ID del pack handler] [nombre del generador]`: consulta el estado actual de un generador de datos.
- `/croparia|cropariaServer generator dumpBuiltin [ID del pack handler] [nombre del generador]`: exporta los generadores integrados a la carpeta `generator/` del directorio de caché correspondiente. Si no se indica nombre, exporta todos.
- `/croparia|cropariaServer generator clearBuiltin [ID del pack handler] [nombre del generador]`: elimina los archivos de generador exportados que tengan el mismo nombre que los generadores integrados. Si no se indica nombre, los elimina todos.

Si piensas seguir editando esos archivos a mano después de exportarlos, continúa con:

- [Crear un generador de datos](./generator/create-generator.md)
- [Analizadores de placeholders](./generator/placeholder.md)

<a id="config-commands"></a>

### Comandos de configuración del servidor

- `/cropariaServer <opción>`: consulta el valor actual de una opción de configuración.
- `/cropariaServer <opción> [valor]`: modifica el valor de una opción de configuración.
- `/cropariaServer reset`: muestra un aviso de confirmación para reiniciar.
- `/cropariaServer reset confirm`: restablece el archivo de configuración a sus valores por defecto.

Las siguientes opciones cuentan actualmente con comandos de servidor propios:

- `filePath`
- `recipeWizard`
- `infusor`
- `ritual`
- `fruitUse`
- `autoReload`
- `override`
- `soakAttempts`

`cropYield`, `melonYield` y `blacklist` no tienen actualmente comandos de servidor propios y solo pueden modificarse desde el archivo de configuración.

<a id="tips"></a>

## Recomendaciones

- Si estás depurando generadores que no funcionan, cultivos que no cargan o directorios de exportación extraños, revisa primero `filePath`, `override` y `autoReload`.
- Si quieres modificar generadores integrados, lo normal es exportarlos primero con `generator dumpBuiltin` y luego seguir con el [Sistema de generación de datos en tiempo de ejecución](./generator/index.md) y [Crear un generador de datos](./generator/create-generator.md).
- En `blacklist`, las entradas que empiezan con `@` se interpretan como reglas regex sobre namespaces de mods, así que un patrón mal escrito puede ocultar más contenido del esperado.
