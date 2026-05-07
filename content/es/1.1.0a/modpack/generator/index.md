---
title: Sistema de generación de datos en tiempo de ejecución
desc: Presenta el sistema de generación de datos en tiempo de ejecución de Croparia IF 1.1.0a para autores de modpacks, con PackHandler, generadores, plantillas y flujo de trabajo.
navOrder: 40
---

# Sistema de generación de datos en tiempo de ejecución (Autores de modpacks)

<a id="overview"></a>

El **Sistema de generación de datos en tiempo de ejecución** es uno de los sistemas más importantes de Croparia IF. Puede generar archivos de data pack o resource pack en masa a partir de **generadores de datos**, y después inyectarlos automáticamente en el juego mediante un **gestor de paquetes generados**.

Para autores de modpacks, viene a ser la herramienta de “un solo script para manejar cientos de recetas”.

## Conceptos principales

<a id="core-concepts"></a>

<a id="pack-handler"></a>

### Gestor de paquetes generados - PackHandler

El gestor de paquetes generados administra un data pack o resource pack en formato de directorio. Lee definiciones de generadores, ejecuta la generación, mantiene el estado intermedio de caché y escribe la salida final en el directorio del paquete.

<a id="data-generator"></a>

### Generador de datos - DataGenerator

Un generador de datos es una regla concreta de generación. Define qué conjunto de entradas debe recorrerse, a qué ruta irán los archivos generados y cómo se estructurará su contenido.

<a id="template"></a>

### Plantilla - Template

Una plantilla describe la estructura de salida dentro de un generador. Tanto la ruta de salida como el contenido del archivo pueden declararse mediante plantillas, y estas pueden contener expresiones con placeholders que se resuelven durante la generación.

<a id="placeholder"></a>

### Resolutor de placeholders - Placeholder

Un resolutor de placeholders expone datos a las plantillas. Define qué campos pueden referenciarse y cómo se resuelven y expanden esos campos.

<a id="entry"></a>

### Entrada de generación de datos

Una entrada de generación de datos es la unidad que proporciona datos a la plantilla. El conjunto formado por estas entradas se llama **Data Generator Registry**.

<a id="entry-registry"></a>

<a id="workflow"></a>
## Flujo de trabajo típico

### 1. Decide qué tipo de datos vas a generar

Primero decide si tu objetivo pertenece a un data pack o a un resource pack. Eso determina bajo qué gestor de paquetes generados vas a trabajar.

Para salida de data pack, usa el gestor del lado de data pack bajo el directorio `datapack` en la raíz de datos del mod.

Para salida de resource pack, usa el gestor del lado de resource pack bajo el directorio `resourcepack` en esa misma raíz.

Una vez decidido, entra en la carpeta `generator` dentro de ese paquete en formato de directorio.

### 2. Elige el registro de entradas

<a id="workflow-registry"></a>

Debes decidir “generar datos para qué”. Croparia IF ofrece tres registros integrados:

- cultivos de fruto `croparia:crops`
- melones `croparia:melons`
- elementos `croparia:elements`

### 3. Elige el tipo de generador

<a id="workflow-generator-type"></a>

Diferentes tipos de datos necesitan distintos patrones de composición. Croparia IF ofrece:

- `croparia:generator`
  - genera una salida independiente por cada entrada; si varias salidas apuntan a la misma ruta, la última sobrescribe a la anterior
- `croparia:aggregated`
  - agrupa salidas que comparten la misma ruta de destino; suele usarse para tags
- `croparia:lang`
  - similar al generador agregado, pero especializado en archivos de idioma y solo utilizable con entradas traducibles

### 4. Escribe el archivo del generador

<a id="workflow-create-generator"></a>

Crea un archivo `toml` (recomendado), `cdg` o `json` dentro del directorio `generator` del gestor de paquetes elegido.

Para el proceso de escritura en sí, consulta [Crear un generador de datos](create-generator.md).

### 5. Ejecuta y prueba

<a id="workflow-debug"></a>

Cuando el generador sea válido, podrás consultarlo con `/croparia|cropariaServer generator query [ID del gestor] [nombre del generador]`.

Si no aparece en el autocompletado del comando, probablemente el generador tenga algún problema. Revisa el log para ver más detalles.

Si todo funciona, encontrarás la salida generada dentro de la carpeta `assets` o `data` del paquete en formato de directorio. El efecto real sigue necesitando pruebas dentro del juego.

## Modificar o desactivar generadores integrados

Usa `/croparia|cropariaServer generator dumpBuiltin [ID del gestor] [nombre del generador]` para volcar un generador integrado y editarlo.

Configura `enabled = false` para desactivar ese generador.

