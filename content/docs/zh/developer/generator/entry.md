---
title: 添加生成条目
description: 介绍如何为 Croparia IF 运行时数据生成系统添加新的 DgEntry 与 DgRegistry，并接入自定义 Placeholder。
keywords:
  - Croparia IF
  - Generator API
  - DgEntry
  - DgRegistry
  - Placeholder
  - Data Generator Entry
  - Data Generator Registry
  - 生成条目
  - 开发者文档
  - 1.1.0a
modVersions:
  - 1.1.0a
---

# 添加生成条目

<a id="overview"></a>

生成条目（`DgEntry`）通过提供占位符解析器（Placeholder）为数据生成的模板数据提供值，
它被生成器脚本的生成条目集（`DgRegistry`）指定。

想要添加自定义的生成条目，你需要一个生成条目类与对应的生成条目集与占位符解析器，并将生成条目集注册进生成器系统中。
如果你还没有读过整体结构，可以先看[运行时数据生成系统（开发者）](index.md#overview)；如果你想先实现字段访问，再回来看条目接入，也可以先读[创建占位符解析器](placeholder.md#basic-creation)。

<a id="create-entry"></a>

## 创建生成条目类

```java
public class MyEntry implements DgEntry {
    private final Identifier id;

    @Override
    public Identifier getKey() {
        return this.id;
    }

    @Override
    public boolean shouldLoad() {
        return true;
    }
    
    // ...
}
```

<a id="add-placeholder"></a>

## 添加占位符解析器

占位符解析器用来将生成条目的运行时数据转换为可以填充进数据模板的格式。
详情见[创建占位符解析器](placeholder.md#basic-creation)，此处仅引导开发者如何将其接入生成条目。

```java
public class MyEntry implements DgEntry {
    public static final Placeholder<MyEntry> PLACEHOLDER = Placeholder.build(node -> node.then(
        PatternKey.literal("example"), TypeMapper.of(MyEntry::getExample), Placeholder.STRING
    ).concat(DgEntry.PLACEHOLDER, TypeMapper.of(myEntry -> myEntry)));
    
    private final String example;
    
    public String getExample() {
        return this.example;
    }
    
    public Placeholder<? extends MyEntry> placeholder() {
        return PLACEHOLDER;
    }
    
    // ...
}
```

**注**：当你的生成条目类继承了另一个生成条目类，那么请不要忘记把父类的占位符解析器填充进来（至少需要将 `DgEntry` 的解析器填充）。

<a id="create-registry"></a>

## 创建生成条目集

你可以自行建立一个新的类并继承 `DgRegistry<MyEntry>`，或是使用工具方法 `DgRegistry.ofEnum`、`DgRegistry.ofMap` 来创建。

创建完成后，注册进 API 即可。

```java
static DgRegistry MY_REGISTRY = DgRegistry.ofMap(Map.of(
    Identifier.of("modid:my_entry_1"), new MyEntry(...),
    Identifier.of("modid:my_entry_2"), new MyEntry(...),
    Identifier.of("modid:my_entry_3"), new MyEntry(...)
    // ...
));
static {
    DgRegistry.register(Identifier.of("modid:my_registry"), MY_REGISTRY);
}
```

之后在生成器脚本中指定生成条目集的 ID 即可遍历所有生成条目

```toml
registry = "modid:my_registry"
# ...
```

当条目与条目集都准备好之后，下一步通常是让它被某个[自定义数据生成器](generator.md#register-generator)实际使用。
