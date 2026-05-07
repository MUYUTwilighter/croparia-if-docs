---
title: 占位符解析器（开发者）
desc: 介绍如何为 Croparia IF 运行时数据生成系统创建 Placeholder 与 PlaceholderBuilder，包括桥接、集合字段与内置解析器复用。
keywords:
  - Croparia IF
  - Generator API
  - Placeholder
  - PlaceholderBuilder
  - TypeMapper
  - PatternKey
  - Template
  - DgEntry
  - 占位符解析器
  - 开发者文档
  - 1.1.0a
navOrder: 20
---

# 占位符解析器（开发者）

<a id="overview"></a>

占位符解析器 `Placeholder<T>` 负责把生成条目的运行时数据解析成模板 `${...}` 中可用的值。
它和 `Codec` 有些相似：都是“声明字段结构，再交给运行时读取”的接口；区别在于 `Codec` 面向序列化，而 `Placeholder` 面向模板解析。

在运行时数据生成系统里：

- `Template` 负责扫描 `${...}`
- `Placeholder` 负责解释 `${...}` 里每一段字段访问
- `DgEntry` 通过 `placeholder()` 提供自己的解析器

此页面主要介绍如何为新的生成条目实现自定义占位符解析器。

<a id="basic-creation"></a>

## 基本创建方式

通常我们不会直接手写 `new Placeholder<>(...)`，而是通过 `Placeholder.build(...)` 与 `PlaceholderBuilder` 来构建：

```java
public class MyEntry implements DgEntry {
    public static final Placeholder<MyEntry> PLACEHOLDER = Placeholder.build(builder -> builder
        .self(TypeMapper.of(MyEntry::getId), Placeholder.ID)
        .then(PatternKey.literal("example"), TypeMapper.of(MyEntry::getExample), Placeholder.STRING)
        .then(PatternKey.literal("tier"), TypeMapper.of(MyEntry::getTier), Placeholder.NUMBER)
    );

    private final Identifier id;
    private final String example;
    private final int tier;

    public Identifier getId() {
        return this.id;
    }

    public String getExample() {
        return this.example;
    }

    public int getTier() {
        return this.tier;
    }

    @Override
    public Placeholder<? extends MyEntry> placeholder() {
        return PLACEHOLDER;
    }
}
```

上面这段定义了三个常见入口：

- `self(...)`
  - 定义“当前对象本身”在 `${}` 为空路径时如何解析。
  - 上例中它把 `MyEntry` 的默认输出桥接到了 `Identifier`，因此空路径会按 `Identifier` 解析；如果你还想显式支持 `${id}` 这样的子字段，仍然需要再单独用 `then(...)` 注册 `id`。
- `then(...)`
  - 定义一个子字段，并把它桥接到另一个占位符解析器。
  - 上例中的 `${example}` 使用 `Placeholder.STRING`，`${tier}` 使用 `Placeholder.NUMBER`。
- `TypeMapper.of(...)`
  - 用于把当前类型手动映射到子类型。
  - 这是最常见的写法；由于 Java 泛型推断有限，很多场景都需要显式使用 `TypeMapper`。

当你完成了占位符解析器后，下一步通常就是把它接入生成条目，详见[添加生成条目](entry.md)。

<a id="builder-methods"></a>

## `PlaceholderBuilder` 的常用方法

`PlaceholderBuilder<T>` 是扩展解析器时最重要的工具。常用方法如下：

- `self(RegexParser<T>)`
  - 直接定义当前对象在空路径下的解析行为。
- `self(TypeMapper<T, F>, Placeholder<F>)`
  - 把当前对象桥接到另一个类型的占位符解析器，通常比手写 `RegexParser` 更方便。
- `then(Pattern key, TypeMapper<T, O>, Placeholder<O>)`
  - 为一个子字段注册解析器。
  - 最常见的开发入口。
- `then(Pattern key, TypeMapper<T, O>, Codec<O>)`
  - 把某个子字段编码为 JSON，再作为占位符结果返回。
  - 适合“这个字段本来就有现成 `Codec`，而且不需要继续扩展子域”的情况。
- `thenMap(...)`
  - 快速把某个字段注册为“字典型子域”。
  - 自动获得 `get(...)`、`keys()`、`values()`、`mapValue(...)`、`mapKey(...)` 等能力。
- `thenList(...)`
  - 快速把某个字段注册为“列表型子域”。
  - 自动获得 `get(...)`、`getOr(...)`、`map(...)`、`mapi(...)` 等能力。
- `concat(...)`
  - 把另一个已有解析器的子域拼接进来；遇到同名键时保留当前解析器已有定义。
- `overwrite(...)`
  - 类似 `concat(...)`，但会覆盖已有同名子域。
- `remove(...)`
  - 移除一个已有键。
- `map(...)`
  - 把整个 `PlaceholderBuilder<T>` 映射成另一个类型的 `PlaceholderBuilder<O>`。

对于大多数条目来说，`self(...) + then(...) + concat(...)` 就已经够用了。

<a id="bridge-existing"></a>

## 桥接到已有解析器

为了减少重复定义，最推荐的做法是把“已有的子类型解析器”桥接到目标类型，而不是从零开始重写所有字段。

例如，一个条目含有 `Identifier`、`ItemOutput` 和 `DataComponentPatch` 这几种字段：

```java
public static final Placeholder<MyEntry> PLACEHOLDER = Placeholder.build(builder -> builder
    .then(PatternKey.literal("id"), TypeMapper.of(MyEntry::getId), Placeholder.ID)
    .then(PatternKey.literal("result"), TypeMapper.of(MyEntry::getResult), Placeholder.ITEM_OUTPUT)
    .then(PatternKey.literal("components"), TypeMapper.of(MyEntry::getComponents), Placeholder.DATA_COMPONENTS)
);
```

这样做的好处是：

- 你不需要手动重写 `${id.namespace}`、`${id.path}` 这些子域
- 你可以直接复用内置类型已经支持的所有方法
- 后续如果内置解析器增强了字段，你的条目通常也会自动受益

这也是 Generator API 里最常见的占位符实现方式。

<a id="map-list-fields"></a>

## 列表与字典字段

如果你的条目里有集合字段，最好不要自己手写 `get(...)` 之类的方法，而是直接使用 `thenMap(...)` 或 `thenList(...)`。

例如，一个条目中有语言映射：

```java
public static final Placeholder<MyEntry> PLACEHOLDER = Placeholder.build(builder -> builder
    .thenMap(PatternKey.literal("translations"), TypeMapper.of(entry -> MapReader.map(entry.getTranslations())), Placeholder.STRING)
);
```

这样模板里就可以直接使用：

```text
${translations.get(en_us)}
${translations.keys().get(0)}
${translations.values()}
```

如果是列表字段：

```java
public static final Placeholder<MyEntry> PLACEHOLDER = Placeholder.build(builder -> builder
    .thenList(PatternKey.literal("drops"), TypeMapper.of(entry -> ListReader.list(entry.getDrops())), Placeholder.ITEM_OUTPUT)
);
```

模板里就能直接使用：

```text
${drops.get(0).id}
${drops._size}
${drops.map(id)}
```

这一类能力不是由 `Template` 提供的，而是 `PlaceholderBuilder.ofMap(...)` 与 `ofList(...)` 在内部自动补上的。

<a id="extend-existing"></a>

## 扩展已有解析器

如果你的条目继承了另一个条目，或者你想在已有条目基础上只增加几个字段，最方便的做法是使用 `concat(...)`。

例如：

```java
public class MyEntry implements DgEntry {
    public static final Placeholder<MyEntry> PLACEHOLDER = Placeholder.build(builder -> builder
        .then(PatternKey.literal("example"), TypeMapper.of(MyEntry::getExample), Placeholder.STRING)
        .concat(DgEntry.PLACEHOLDER, TypeMapper.of(entry -> entry))
    );

    // ...
}
```

这段代码的效果是：

- 先声明当前条目自己的 `${example}`
- 再把 `DgEntry` 已有的字段拼接进来

如果你需要覆盖父类已有字段，可以改用 `overwrite(...)`：

```java
public static final Placeholder<MyEntry> PLACEHOLDER = Placeholder.build(builder -> builder
    .overwrite(ParentEntry.PLACEHOLDER, TypeMapper.of(entry -> entry))
    .then(PatternKey.literal("name"), TypeMapper.of(MyEntry::getLocalizedName), Placeholder.STRING)
);
```

经验上：

- 只补新字段时，用 `concat(...)`
- 要改父类字段行为时，用 `overwrite(...)`

<a id="builtins"></a>

## 可直接复用的内置解析器

当前源码中最常用的内置解析器有这些：

- `Placeholder.STRING`
  - 字符串
- `Placeholder.NUMBER`
  - 数字
- `Placeholder.BOOLEAN`
  - 布尔值
- `Placeholder.JSON`
  - 任意 JSON 值
- `Placeholder.JSON_OBJECT`
  - JSON 对象
- `Placeholder.JSON_ARRAY`
  - JSON 数组
- `Placeholder.ID`
  - `Identifier`
- `Placeholder.DATA_COMPONENTS`
  - `DataComponentPatch`
- `Placeholder.ITEM_OUTPUT`
  - `ItemOutput`
- `Placeholder.BLOCK_OUTPUT`
  - `BlockOutput`
- `Placeholder.ITEM`
  - `Item`
- `Placeholder.ITEM_STACK`
  - `ItemStack`
- `Placeholder.BLOCK`
  - `Block`
- `Placeholder.BLOCK_STATE`
  - `BlockState`

其中比较常见的几个子域包括：

- `Placeholder.ID`
  - `${id}`
  - `${id.namespace}`
  - `${id.path}`
- `Placeholder.ITEM_OUTPUT`
  - `${result.id}`
  - `${result.amount}`
  - `${result.components}`
  - `${result.stack}`
- `Placeholder.BLOCK_OUTPUT`
  - `${block.id}`
  - `${block.properties}`

如果你要给整合包作者暴露一个字段，优先考虑是否能桥接到这些内置解析器，而不是自己重新设计一套访问语法。

如果你已经完成了解析器定义，下一步通常是把它接入[生成条目](entry.md#add-placeholder)，或者进一步用于[自定义数据生成器](generator.md#register-generator)。

