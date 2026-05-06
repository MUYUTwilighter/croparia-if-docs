---
title: Maven 仓库
desc: 介绍 Croparia IF 1.1.1a 起面向下游开发者提供的 Maven 仓库，包括仓库地址、坐标规则，以及在 Gradle 中引入 common 模块源码与产物的方式。
keywords:
  - Croparia IF
  - Maven
  - Maven 仓库
  - maven-public
  - maven.muyucloud.cool
  - common
  - sources
  - 开发者
  - 1.1.1a
navOrder: 15
---

# Maven 仓库

<a id="overview"></a>

从 `1.1.1a` 开始，Croparia IF 会把面向下游开发者使用的模组相关产物上传到我们自己的 Maven 服务上。  
这意味着你除了手动复制 jar 或依赖本地构建结果，还可以直接通过构建脚本声明依赖，并让 IDE 自动附加源码包。

当前公开入口位于：

- [https://maven.muyucloud.cool/](https://maven.muyucloud.cool/)

<a id="repository"></a>

## 添加仓库

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

## 添加依赖

<a id="common"></a>

### Common

Common 包通常用于多平台项目的构建。矿石魔种基于 Architectury Loom 构建，因此也支持开发者在公共环境下进行开发。

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

更多工具链细节详见 [Fabric 文档](https://docs.fabricmc.net/develop/loom/#configurations)

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

<a id="fabric"></a>

### NeoForge

更多工具链细节详见 [NeoForge 文档](https://docs.neoforged.net/toolchain/docs/dependencies/)

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

### Forge

更多工具链细节详见 [Forge 文档](https://docs.minecraftforge.net/en/fg-6.x/dependencies/)

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

