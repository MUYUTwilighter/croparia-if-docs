---
title: Preguntas frecuentes
desc: Preguntas frecuentes para jugadores de Croparia IF 1.1.0a, con fallos, problemas multijugador, recetas ausentes, generación dinámica de datos y rutas comunes de solución de problemas.
navOrder: 3
---

# Preguntas frecuentes

Si encuentras un comportamiento que **no coincide con lo que el mod debería hacer**, es muy posible que te hayas topado con un bug. Puedes empezar por aquí y, si esta página no lo resuelve, contactarnos por alguno de estos canales:

- [grupo de QQ](https://qm.qq.com/q/OedneeO0Uw)
- [Discord](https://discord.gg/JunKeKCJAY)
- [GitHub](https://github.com/MUYUTwilighter/croparia-if/issues)

**Siempre animamos a los jugadores a escribirnos y enviarnos feedback.**

Si estás jugando un modpack montado por otra persona, habla primero con el autor del modpack.

## Q1. He sufrido cierres, lag grave o incluso daños graves en el mundo

**A1: deja de jugar inmediatamente y repórtalo.**

Cuando lo hagas, intenta adjuntar todo lo posible de lo siguiente:

- log de ejecución (`[directorio del juego]/logs/latest.log`)
- log de depuración si existe (`[directorio del juego]/logs/debug.log`)
- informe de fallo si existe (`[directorio del juego]/crash-reports/crash-xxx.log`)

## Q2. No puedo entrar a una partida multijugador

Esto suele deberse a definiciones de cultivos desincronizadas. Copia las definiciones de cultivos del anfitrión al cliente, normalmente desde:

- `[directorio del juego]/croparia/crops`
- `[directorio del juego]/croparia/melons`

Croparia IF permite a los usuarios añadir cultivos personalizados. Esos cultivos pueden introducir también nuevos objetos, bloques y otras entradas de registro. Si el anfitrión y el cliente no comparten las mismas definiciones, sus registros pueden diferir, y Minecraft desconectará al jugador al detectar esa desincronización.

## Q3. No puedo fabricar algo, faltan recetas o los cultivos no sueltan frutos

Estos problemas suelen estar relacionados con la generación dinámica de datos del mod. Revisa los dos casos habituales de abajo.

### 1. Un conflicto con otro mod está interfiriendo con la recarga

Puedes desactivar con seguridad la recarga automática así:

1. Asegúrate de que el juego está cerrado y desactiva el mod que pueda estar causando el conflicto.
2. Edita el archivo de configuración, normalmente `[directorio del juego]/config/croparia.json`, y establece `override` en `false`.
3. Inicia el juego y entra en un mundo. Espera unos 10 segundos a que termine la recarga automática de Croparia IF.
4. Cierra el juego otra vez y cambia `autoReload` a `false`.
5. Vuelve a activar el mod que habías desactivado y abre el juego de nuevo.

**Nota**: si más adelante necesitas cambiar definiciones de cultivos o plantillas de generadores, tendrás que repetir este proceso.

Croparia IF utiliza un generador en tiempo de ejecución basado en plantillas para crear buena parte de sus datos internos. Como la carga de tags de Minecraft llega más tarde de lo ideal para este flujo, el mod suele ejecutar una recarga adicional de data packs al entrar en un mundo. Eso puede chocar con algunos mods, por ejemplo:

- Curtain: su registro de comandos tiene defectos, así que los comandos pueden desaparecer tras la recarga;
- WorldWeaver: no está claro el motivo exacto, pero puede romper el proceso de recarga y hacer que falle todo el contenido no vanilla.

### 2. Un conflicto de migración entre versiones

El mod sigue evolucionando y eso a veces trae cambios incompatibles. Puedes intentar restablecer los archivos de datos generados por Croparia IF sin tocar el guardado del mundo:

1. Asegúrate de que el juego está cerrado y haz una copia de seguridad del mundo, de la carpeta de datos del mod (normalmente `[directorio del juego]/croparia`) y del archivo de configuración (normalmente `[directorio del juego]/config/croparia.json`).
2. Elimina estas carpetas dentro de la carpeta de datos del mod:
   - `data`
   - `assets`
   - `datapack`
   - `recipe_wizard`
   - `resourcepack`
3. Inicia el juego otra vez. Los datos generados se reconstruirán desde cero.
