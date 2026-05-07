---
title: Custom Data Generators
desc: Explains how to extend Croparia IF's runtime data generation system with custom DataGenerator types, including flow control, PackCache usage, and codec registration.
keywords:
  - Croparia IF
  - runtime data generation
  - DataGenerator
  - AggregatedGenerator
  - LangGenerator
  - PackHandler
  - PackCache
  - CodecUtil.extend
  - custom data generator
  - developer docs
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 30
---

# Custom Data Generators

<a id="overview"></a>

From the developer's point of view, `DataGenerator` is the runtime object behind a generator script and also the direct worker that performs data generation.

Croparia IF ships three built-in generator types:

- `DataGenerator` (default)
- `AggregatedGenerator`
- `LangGenerator`

This page focuses on how to add another generator type of your own.

<a id="create-generator-class"></a>

## 1. Create the generator class

Custom generator types must extend `DataGenerator`:

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

The parent `DataGenerator` already provides most of the common fields:

- `enabled`
  - whether the generator is active at all
  - `generate(PackHandler)` checks this first and skips the whole generator if it is `false`
- `startup`
  - whether generation may run before the dedicated server is fully started
  - when `false`, generation waits until `CropariaIf.isServerStarted()` becomes `true`
- `whitelist`
  - restricts which entries are traversed
  - when empty, the full `registry` is scanned; otherwise the listed `Identifier` values are queried directly
- `path`
  - the output path template
  - `getPath(DgEntry)` resolves it into the final relative path
- `registry`
  - the entry set used by this generator
  - `generate(PackHandler)` iterates from here
- `template`
  - the default content template
  - for a plain `DataGenerator`, this is also the final per-file content template

If your generator needs extra fields of its own, such as aggregated content or special secondary templates, add them on the subclass the same way `content` is added above.

<a id="flow-control"></a>

## 2. Customize the generation flow

The default generation flow in `DataGenerator` is fairly small:

1. `generate(PackHandler pack)`
2. check `enabled`
3. check `startup` against the current server state
4. decide whether to walk the whole `registry` or only the `whitelist`
5. call `generate(DgEntry entry, PackHandler pack)` for every entry

The most common extension points are:

- `protected void generate(DgEntry entry, PackHandler pack)`
  - the core per-entry generation logic
  - the default implementation writes `getPath(entry)` and `getTemplate(entry)` straight into `PackHandler.cache(...)`
  - override this when you need aggregation, pre-processing, or conditional skipping
- `public String getTemplate(DgEntry entry)`
  - by default this is `this.getTemplate().parse(entry)`
  - override it if the real content template is not taken directly from the parent `template` field
- `public void onGenerated(PackHandler pack)`
  - called by `PackHandler.onGenerated()` after all generators finish their normal `generate(...)` phase
  - a good place to merge cached intermediate results into final text
- `public void onDumped(PackHandler pack)`
  - called after cached data has already been written to the file system
  - a good place for logging, cleanup, or post-processing

If your generator still follows the pattern "one entry becomes one file," overriding `generate(DgEntry entry, PackHandler pack)` is often enough.
If your generator needs to collect several entries first and output later, `onGenerated(PackHandler pack)` becomes the key hook.

<a id="pack-cache"></a>

### Generated pack cache

When a generator submits data to the pack handler, the handler caches it first. Only after all generators finish does it flush those results to files.

Before the full generation pass is dumped, generators are allowed to inspect and modify that cached state. This is how `AggregatedGenerator` implements data aggregation.

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

This behavior is controlled by `PackCache`. In practice, these methods matter most:

- `cache(path, value, owner)`
  - write a cache entry by path
  - if that path already exists, the old value is overwritten and ownership is transferred to the new `owner`
- `occupy(querier, path)`
  - read the cached value for one path
  - if that path previously belonged to a different generator, ownership transfers to the current `querier`
  - `AggregatedGenerator` uses this to take over collection caches for shared output paths
- `getAll(querier)`
  - return every cache entry currently owned by the generator
  - especially useful during `onGenerated(...)` when you want to rebuild final outputs in bulk

It helps to think of `PackCache` as a path-keyed workspace with ownership tracking.
For a normal generator, you usually just call `cache(...)` once. For an aggregated generator, it behaves much more like a temporary work area that can be reclaimed and rewritten.

<a id="register-generator"></a>

## 3. Register it

You need a `MapCodec<MyDataGenerator>` so the pack handler knows how to turn a parsed generator script into your runtime generator object.

To avoid rewriting the entire parent codec, the common pattern is to use Croparia IF's `CodecUtil.extend(...)`:

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

This means:

- first reuse `DataGenerator.CODEC` for all inherited fields
- then append the subclass-specific `content` field
- finally rebuild the new object from the parsed base data plus the extra field

If your subclass adds no new fields, a plain `xmap(...)` over `DataGenerator.CODEC` may already be enough. `CodecUtil.extend(...)` is most helpful when you really are extending the data shape.

Once you have the codec, register it:

```java
static {
    DataGenerator.register(Identifier.of("modid:my_data_generator"), CODEC);
}
```

Then the script can use it directly:

```toml
type = "modid:my_data_generator"
# ...
```

If your generator also depends on extra field access, the next supporting pieces are usually a matching [placeholder resolver](placeholder.md#bridge-existing) and one or more [generator entries](entry.md#create-entry).

