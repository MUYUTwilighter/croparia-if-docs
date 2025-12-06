---
sidebar_position: 1
---

# Getting Started

Croparia IF is an open-source project that encourages you to extend the mod with integrative features.

Here we talk about some APIs provided by Croparia IF, and how to use them.

## Quick Setup

### Multi-platform Env

If you are using multi-platform environment like architectury-loom, refer to steps below.

1. Configure repositories
    ```groovy title="/build.gradle"
    subprojects {
        repositories {
            // Croparia IF uses tomlj, so mavenCentral is needed
            mavenCentral()
            maven {
                // Optional, can be whatever you like
                name = "MuyuMaven"
                // Mandantory
                url = "https://maven.muyucloud.cool/repository/maven-releases"  
            }
        }
    }
    ```
2. Configure dependencies for common
    ```groovy title="/common/build.gradle"
    dependencies {
        modImplementation "cool.muyucloud.croparia:croparia-if-$minecraft_version-common:$croparia_version"
    }
    ```
3. Configure dependencies for platforms (Replace the platform name!)
    ```groovy title="/<platform>/build.gradle"
    dependencies {
        // If on Fabric, Croparia IF needs Fabric API
        // modImplementation "net.fabricmc.fabric-api:fabric-api:$fabric_api_version"
        modImplementation "cool.muyucloud.croparia:croparia-if-$minecraft_version-<platform>:$croparia_version"
        // If you want to use following dependencies as well, replace `modRuntimeOnly` with `modImplementation`
        modRuntimeOnly "org.tomlj:tomlj:1.1.1"
        modRuntimeOnly "org.antlr:antlr4-runtime:4.11.1"
        modRuntimeOnly "dev.architectury:architectury-<platform>:$architectury_api_version"
    }
    ```
4. Add version properties (Replace with the correct value!)
   ```toml title="/gradle.properties"
   minecraft_version=1.21.4
   croparia_version=1.0.3-pre
   architectury_api_version=15.0.3
   ```
5. If you want to use REI, JEI or EMI features provided by Croparia IF, refer to each of their own websites.

### Dedicated environment

If you are using environment dedicated for a specific mod loader (fabric loom, forge gradle, etc.), refer to steps below.

#### Forge

**Note**: Croparia IF only support Forge for Minecraft 1.20.1 or older, and NeoForge for Minecraft 1.21.1 or newer.

1. Configure repositories.
   ```groovy title="./build.gradle"
    repositories {
        // Croparia IF uses tomlj, so mavenCentral is needed
        mavenCentral()
        maven {
            // Optional, can be whatever you like
            name = "MuyuMaven"
            // Mandantory
            url = "https://maven.muyucloud.cool/repository/maven-releases"  
        }
        // Architectury API needs it
        maven {
            url = "https://maven.architectury.dev"
        }
    }
   ```
2. Configure dependencies
    ```groovy title="/build.gradle - Forge"
    dependencies {
        implementation fg.deobf("cool.muyucloud.croparia:croparia-if-$minecraft_version-forge:$croparia_version")
        // If you want to use following dependencies as well, replace `runtimeOnly` with `implementation`
        runtimeOnly fg.deobf("dev.architectury:architectury-forge:$architectury_api_version")
        runtimeOnly "org.tomlj:tomlj:1.1.1"
        runtimeOnly "org.antlr:antlr4-runtime:4.11.1"
    }
   ```
   ```groovy title="/build.gradle - NeoForge"
    dependencies {
        implementation "cool.muyucloud.croparia:croparia-if-$minecraft_version-neoforge:$croparia_version"
        // If you want to use following dependencies as well, replace `runtimeOnly` with `implementation`
        runtimeOnly "dev.architectury:architectury-neoforge:$architectury_api_version"
        runtimeOnly "org.tomlj:tomlj:1.1.1"
        runtimeOnly "org.antlr:antlr4-runtime:4.11.1"
    }
   ```
   ```groovy title="/build.gradle - Fabric"
    dependencies {
        modImplementation "cool.muyucloud.croparia:croparia-if-$minecraft_version-fabric:$croparia_version"
        // If you want to use following dependencies as well, replace `modRuntimeOnly` with `modImplementation`
        modRuntimeOnly "dev.architectury:architectury-fabric:$architectury_api_version"
        modRuntimeOnly "org.tomlj:tomlj:1.1.1"
        modRuntimeOnly "org.antlr:antlr4-runtime:4.11.1"
    }
   ```
3. Configure version properties (Replace with the correct version!)
    ```toml
    minecraft_version=1.20.1
    croparia_version=1.0.3-pre
    architectury_api_version=9.2.14
    ```