---
title: Maven Repository
desc: Explains the Maven repository available to downstream Croparia IF developers starting from 1.1.1a, including repository URL, coordinate patterns, and Gradle dependency examples.
keywords:
  - Croparia IF
  - Maven
  - Maven repository
  - maven-public
  - maven.muyucloud.cool
  - common
  - sources
  - developer
  - 1.1.1a
navOrder: 15
---

# Maven Repository

<a id="overview"></a>

Starting with `1.1.1a`, Croparia IF publishes downstream development artifacts to our own Maven service.
That means you no longer have to rely only on manually copied jars or local builds. You can declare dependencies directly in your build script and let your IDE attach source jars automatically.

The public entry point is:

- [https://maven.muyucloud.cool/](https://maven.muyucloud.cool/)

<a id="repository"></a>

## Add the repository

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

## Add dependencies

<a id="common"></a>

### Common

The common artifact is usually the right choice for multi-platform development setups. Since Croparia IF itself is built on Architectury Loom, downstream developers can also target the shared common environment directly.

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

For more toolchain-specific details, see the [Fabric Loom docs](https://docs.fabricmc.net/develop/loom/#configurations).

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

For more toolchain-specific details, see the [NeoForge docs](https://docs.neoforged.net/toolchain/docs/dependencies/).

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

For more toolchain-specific details, see the [Forge docs](https://docs.minecraftforge.net/en/fg-6.x/dependencies/).

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
