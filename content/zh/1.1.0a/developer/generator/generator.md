---
title: 自定义数据生成器
description: 介绍如何为 Croparia IF 运行时数据生成系统扩展自定义 DataGenerator，包括流程控制、PackCache 与 Codec 注册。
keywords:
  - Croparia IF
  - Generator API
  - DataGenerator
  - AggregatedGenerator
  - LangGenerator
  - PackHandler
  - PackCache
  - CodecUtil.extend
  - 自定义数据生成器
  - 开发者文档
  - 1.1.0a
---

# 自定义数据生成器

<a id="overview"></a>

在开发视角，数据生成器 `DataGenerator` 是生成器脚本的运行时实体对象，同时也是数据生成的直接处理者。

矿石魔种默认提供了三种数据生成器：

- `DataGenerator`（默认）
- `AggregatedGenerator`
- `LangGenerator`

此页面将介绍如何创建一个新的数据生成器类型。

<a id="create-generator-class"></a>

## 1. 创建生成器类

数据生成器必须要继承 `DataGenerator`

```java
public class MyDataGenerator extends DataGenerator {
    private final Template content;

    public MyDataGenerator(
        boolean enabled, boolean startup, List<Identifier> whitelist,
        Template path, DgRegistry<? extends DgEntry> registry,
        Template content, Template template
    ) {
        super(enabled, startup, whitelist, path, registry, template);
        this.content = content;
    }

    public Template getContent() {
        return this.content;
    }
}
```

父类 `DataGenerator` 已经提供了大部分通用字段：

- `enabled`
  - 是否启用当前生成器。
  - `generate(PackHandler)` 会首先检查它；为 `false` 时整条生成器直接跳过。
- `startup`
  - 是否允许在服务端正式启动前执行。
  - 为 `false` 时，只有 `CropariaIf.isServerStarted()` 为 `true` 后才会生成。
- `whitelist`
  - 指定只遍历哪些生成条目。
  - 为空时遍历整个 `registry`；不为空时只按给定 `Identifier` 精确查询。
- `path`
  - 输出路径模板。
  - `getPath(DgEntry)` 会将它解析成最终相对路径。
- `registry`
  - 当前生成器使用的生成条目集。
  - `generate(PackHandler)` 的遍历入口就是这里。
- `template`
  - 默认内容模板。
  - 对普通 `DataGenerator` 来说，它就是每个文件的最终内容模板。

如果你的生成器还需要自己的字段，例如聚合内容、额外配置或附加模板，可以像上面的 `content` 一样在子类中自行声明。

<a id="flow-control"></a>

## 2. 自定义数据生成流程

`DataGenerator` 默认的生成流程并不复杂：

1. `generate(PackHandler pack)`
2. 检查 `enabled`
3. 检查 `startup` 与当前服务端状态
4. 决定遍历整个 `registry` 还是只遍历 `whitelist`
5. 对每个条目调用 `generate(DgEntry entry, PackHandler pack)`

其中最常见的扩展点有这几个：

- `protected void generate(DgEntry entry, PackHandler pack)`
  - 逐条目生成的核心逻辑。
  - 默认实现会把 `getPath(entry)` 与 `getTemplate(entry)` 的结果直接写进 `PackHandler.cache(...)`。
  - 如果你需要聚合、预处理、按条件跳过，通常覆写这个方法。
- `public String getTemplate(DgEntry entry)`
  - 默认行为是 `this.getTemplate().parse(entry)`。
  - 如果你的内容模板并不直接来自父类 `template` 字段，可以覆写它。
- `public void onGenerated(PackHandler pack)`
  - 所有生成器都跑完 `generate(...)` 之后，由 `PackHandler.onGenerated()` 统一调用。
  - 适合把缓存中的中间结果合并成最终文本。
- `public void onDumped(PackHandler pack)`
  - 所有缓存都写入文件系统之后调用。
  - 适合做日志、额外收尾或后处理。

如果你的生成器仍然是“一个条目对应一个文件”，通常只需要覆写 `generate(DgEntry entry, PackHandler pack)`。
如果你的生成器需要“多条目先聚合，最后统一输出”，那么 `onGenerated(PackHandler pack)` 才是最关键的入口。

<a id="pack-cache"></a>

### 生成包缓存

数据生成器生成了一段数据并提交给生成包管理器的时候，管理器会先将数据缓存。待所有的生成器都生成完数据后，管理器再统一将数据写入文件。

在数据生成全部完成之前，数据生成器可以访问、修改生成包管理器。`AggregatedGenerator` 的数据聚合就是以此实现的。

```java
public class AggregatedGenerator extends DataGenerator {
    @Override
    protected void generate(DgEntry entry, PackHandler pack) {
        String path = this.getPath(entry);
        @SuppressWarnings("unchecked")
        Collection<Object> cache = pack.occupy(this, path).map(value -> {
            if (value instanceof Collection<?> collection) {
                return (Collection<Object>) collection;
            } else {
                return null;
            }
        }).orElseGet(() -> pack.cache(path, new ArrayList<>(), this));
        cache.add(this.getContent(entry));
    }

    @Override
    public void onGenerated(PackHandler handler) {
        List<PackCacheEntry<?>> caches = List.copyOf(handler.getAll(this));
        for (PackCacheEntry<?> entry : caches) {
            StringBuilder builder = new StringBuilder();
            if (entry.value() instanceof Collection<?> collection) {
                for (Object s : collection) {
                    builder.append(s).append(",\n");
                }
            }
            String content = builder.isEmpty() ? "" : builder.substring(0, builder.length() - 2);
            handler.cache(entry.path(), this.getTemplate().parse(content, CONTENT_PLACEHOLDER), this);
        }
    }
    
    // ...
}
```

这里的缓存行为由 `PackCache` 决定，理解这几个方法就够用了：

- `cache(path, value, owner)`
  - 以路径为键写入缓存。
  - 如果路径已存在，会直接覆盖旧值，并把所有权转移给新的 `owner`。
- `occupy(querier, path)`
  - 读取指定路径的缓存值。
  - 如果该路径原本属于别的生成器，读取后会把所有权转移给当前 `querier`。
  - `AggregatedGenerator` 就是用它把同一路径下的集合缓存“占用”到自己名下。
- `getAll(querier)`
  - 获取当前生成器拥有的全部缓存项。
  - 适合在 `onGenerated(...)` 阶段统一遍历并重新组织输出。

可以把它理解成一个“按路径去重、按生成器记录所有权”的中间结果表。对于普通生成器来说，通常只会 `cache(...)` 一次；对于聚合生成器来说，它更像一个可重新接管的工作区。

<a id="register-generator"></a>

## 3. 注册

你需要创建 `MapCodec<MyDataGenerator>` 以让生成包管理器明白如何将读取到的生成器脚本转换为你创建的生成器对象实例。

为了减少父类 `Codec` 带来的重复代码，开发者通常使用矿石魔种提供的 `CodecUtil.extend` 来实现序列化行为的继承：

```java
public class MyDataGenerator extends DataGenerator {
    public static final MapCodec<MyDataGenerator> CODEC = CodecUtil.extend(
        DataGenerator.CODEC,
        Template.CODEC.fieldOf("content").forGetter(MyDataGenerator::getContent),
        (base, content) -> new MyDataGenerator(
            base.isEnabled(), base.isStartup(), base.getWhitelist(),
            base.getPath(), base.getRegistry(), content, base.getTemplate()
        )
    );

    public static final Identifier TYPE = Identifier.of("modid:my_data_generator");

    @Override
    public Identifier getType() {
        return TYPE;
    }

    // ...
}
```

这个例子的含义是：

- 先复用 `DataGenerator.CODEC` 解析父类已有字段
- 再追加一个子类自己的 `content` 字段
- 最后通过 `(base, content) -> ...` 把父类解析结果和子类字段重新组装成 `MyDataGenerator`

如果你的子类没有新增字段，也可以直接基于 `DataGenerator.CODEC.xmap(...)` 做类型转换；只有在新增字段时，`CodecUtil.extend(...)` 才最省事。

将你创建的 `MapCodec<MyDataGenerator>` 注册进去，就可以在生成器脚本里使用了。

```java
static {
    DataGenerator.register(Identifier.of("modid:my_data_generator"), CODEC);
}
```


```toml
type = "modid:my_data_generator"
# ...
```

如果你的生成器还依赖额外字段解析，通常还需要配套实现[占位符解析器](placeholder.md#bridge-existing)与[生成条目](entry.md#create-entry)。

