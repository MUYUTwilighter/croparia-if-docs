# 添加生成条目

生成条目（`DgEntry`）通过提供占位符解析器（Placeholder）为数据生成的模板数据提供值，
它被生成器脚本的生成条目集（`DgRegistry`）指定。

想要添加自定义的生成条目，你需要一个生成条目类与对应的生成条目集与占位符解析器，并将生成条目集注册进生成器系统中。

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

## 添加占位符解析器

占位符解析器用来将生成条目的运行时数据转换为可以填充进数据模板的格式。
详情见 [创建占位符解析器](placeholder.md)，此处仅引导开发者如何将其接入生成条目。

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
