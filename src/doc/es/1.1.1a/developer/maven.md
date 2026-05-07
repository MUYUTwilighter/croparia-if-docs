---
title: Repositorio Maven
desc: Explica el repositorio Maven disponible para desarrolladores downstream de Croparia IF a partir de 1.1.1a, incluyendo URL del repositorio, patrón de coordenadas y ejemplos de dependencias Gradle.
keywords:
  - Croparia IF
  - Maven
  - repositorio Maven
  - maven-public
  - maven.muyucloud.cool
  - common
  - sources
  - desarrollador
  - 1.1.1a
navOrder: 15
---

# Repositorio Maven

<a id="overview"></a>

A partir de `1.1.1a`, Croparia IF publica artefactos de desarrollo para proyectos downstream en nuestro propio servicio Maven.
Eso significa que ya no tienes que depender solo de jars copiados a mano o de compilaciones locales. Puedes declarar dependencias directamente en tu script de construcción y dejar que el IDE adjunte automáticamente los jars de fuentes.

La entrada pública es:

- [https://maven.muyucloud.cool/](https://maven.muyucloud.cool/)

<a id="repository"></a>

## Añadir el repositorio

Groovy

```groovy
repositories {
    maven {
        url = "https://maven.muyucloud.cool/repository/maven-public/"
    }
}
```

Kotlin

```kotlin
repositories {
    maven("https://maven.muyucloud.cool/repository/maven-public/")
}
```

<a id="artifact-rule"></a>

## Añadir dependencias

<a id="common"></a>

### Common

El artefacto common suele ser la mejor opción para proyectos multiplataforma. Como Croparia IF está construido sobre Architectury Loom, los desarrolladores downstream también pueden trabajar directamente sobre el entorno common compartido.

```groovy
dependencies {
    modApi "cool.muyucloud.croparia:croparia-if-$minecraft_version-common:$croparia_version"
}
```

```kotlin
dependencies {
    modApi("cool.muyucloud.croparia:croparia-if-$minecraft_version-common:$croparia_version")
}
```

<a id="fabric"></a>

### Fabric

Para más detalles concretos del toolchain, consulta la [documentación de Fabric Loom](https://docs.fabricmc.net/develop/loom/#configurations).

```groovy
dependencies {
    modImplementation "cool.muyucloud.croparia:croparia-if-$minecraft_version-fabric:$croparia_version"
}
```

```kotlin
dependencies {
    modImplementation("cool.muyucloud.croparia:croparia-if-$minecraft_version-fabric:$croparia_version")
}
```

<a id="neoforge"></a>

### NeoForge

Para más detalles concretos del toolchain, consulta la [documentación de NeoForge](https://docs.neoforged.net/toolchain/docs/dependencies/).

```groovy
dependencies {
    implementation "cool.muyucloud.croparia:croparia-if-$minecraft_version-neoforge:$croparia_version"
}
```

```kotlin
dependencies {
    implementation("cool.muyucloud.croparia:croparia-if-$minecraft_version-neoforge:$croparia_version")
}
```

<a id="forge"></a>

### Forge

Para más detalles concretos del toolchain, consulta la [documentación de Forge](https://docs.minecraftforge.net/en/fg-6.x/dependencies/).

```groovy
dependencies {
    implementation fg.deobf("cool.muyucloud.croparia:croparia-if-$minecraft_version-forge:$croparia_version")
}
```

```kotlin
dependencies {
    implementation(fg.deobf("cool.muyucloud.croparia:croparia-if-$minecraft_version-forge:$croparia_version"))
}
```
