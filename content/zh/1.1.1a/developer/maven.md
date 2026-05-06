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
navOrder: 35
---

# Maven 仓库

<a id="overview"></a>

从 `1.1.1a` 开始，Croparia IF 会把面向下游开发者使用的模组相关产物上传到我们自己的 Maven 服务上。  
这意味着你不再只能手动复制 jar 或依赖本地构建结果，而是可以直接通过构建脚本声明依赖，并让 IDE 自动附加源码包。

当前公开入口位于：

- [https://maven.muyucloud.cool/](https://maven.muyucloud.cool/)

按当前仓库拓扑，开发者实际消费时可以使用公开聚合仓库：

- `https://maven.muyucloud.cool/repository/maven-public/`

<a id="repository-layout"></a>

## 仓库结构

浏览树当前采用标准 Maven 目录层级。以截图中的 `1.1.1a` `common` 产物为例，它对应的结构可以理解为：

- group: `cool.muyucloud.croparia`
- artifact: `croparia-if-1.20.1-common`
- version: `1.1.1a`

因此它的 Maven 坐标是：

```text
cool.muyucloud.croparia:croparia-if-1.20.1-common:1.1.1a
```

在同一个版本目录下，你通常会看到这些文件：

- 主 jar：给编译和运行时使用
- `-sources.jar`：给 IDE 源码跳转和阅读使用
- `.pom`：Maven 元数据
- `.module`：Gradle module metadata
- `.sha*`、`.md5`：校验文件

<a id="artifact-rule"></a>

## 坐标规则

从当前构建脚本看，Croparia IF 子项目的发布坐标遵循这条规则：

- group 固定为 `cool.muyucloud.croparia`
- version 使用模组版本，例如 `1.1.1a`
- artifactId 采用 `croparia-if-<minecraftVersion>-<module>` 的形式

对应到常见模块时，命名规则会是：

- `croparia-if-<minecraftVersion>-common`
- `croparia-if-<minecraftVersion>-fabric`
- `croparia-if-<minecraftVersion>-neoforge`

如果你只是想依赖通用代码和 API，通常优先使用 `common` 即可。

<a id="gradle-groovy"></a>

## 在 Gradle 中使用

Groovy DSL 示例：

```groovy
repositories {
    maven {
        url = "https://maven.muyucloud.cool/repository/maven-public/"
    }
}

dependencies {
    modImplementation "cool.muyucloud.croparia:croparia-if-1.20.1-common:1.1.1a"
}
```

Kotlin DSL 示例：

```kotlin
repositories {
    maven("https://maven.muyucloud.cool/repository/maven-public/")
}

dependencies {
    modImplementation("cool.muyucloud.croparia:croparia-if-1.20.1-common:1.1.1a")
}
```

如果你只需要编译期符号而不想把它打进运行时依赖，可以根据自己的项目结构改成：

- `modCompileOnly(...)`
- `compileOnly(...)`
- `implementation(...)`

具体选哪一种，取决于你的开发平台和装载方式，而不是仓库本身。

<a id="when-to-use-common"></a>

## 什么时候依赖 common

对下游开发者来说，`common` 是最常见的入口，因为：

- 通用 API 本身主要定义在 `common` 模块里
- 很多开发者文档里提到的接口，例如 [Repo API](repo/index.md#overview) 与 [数据生成系统](generator/index.md#overview)，核心定义都来自通用模块
- `-sources.jar` 会让你在 IDE 中直接查看这些实现和注释

如果你的目标是：

- 阅读 API 定义
- 参考具体实现
- 让 IDE 支持跳转到源码

那么优先依赖 `common` 会最省事。

<a id="tips"></a>

## 使用建议

- 先确认你要对齐的模组版本，再写依赖坐标。文档版本和 Maven `version` 应保持一致。
- 如果你在不同 Minecraft 版本之间切换，优先检查 `artifactId` 里的 `<minecraftVersion>` 是否也需要同步变化。
- 遇到“能编译但源码没附加”的情况，优先检查 IDE 是否正确拉取了同版本的 `-sources.jar`。
- 如果你只是在阅读 Croparia IF 的实现细节，Maven 依赖适合做源码参考；如果你要理解整体模块协作，再配合阅读 [核心模块](core/index.md#overview) 会更顺。
