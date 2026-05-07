---
title: Placeholder Resolvers (Developer)
desc: Explains how to create Placeholder and PlaceholderBuilder instances for Croparia IF's runtime data generation system, including bridging, collection fields, and reuse of built-in resolvers.
keywords:
  - Croparia IF
  - runtime data generation
  - Placeholder
  - PlaceholderBuilder
  - TypeMapper
  - PatternKey
  - Template
  - DgEntry
  - placeholder resolver
  - developer docs
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 20
---

# Placeholder Resolvers (Developer)

<a id="overview"></a>

The placeholder resolver `Placeholder<T>` is responsible for turning runtime entry data into values that can be used inside template expressions like `${...}`.
It is similar to a `Codec` in one sense: both describe field structure and then hand the actual reading work to runtime logic. The difference is that `Codec` targets serialization, while `Placeholder` targets template parsing.

Inside the runtime data generation system:

- `Template` scans `${...}`
- `Placeholder` explains how each field access inside `${...}` should be resolved
- `DgEntry` exposes its resolver through `placeholder()`

This page focuses on how to build custom placeholder resolvers for new entry types.

<a id="basic-creation"></a>

## Basic creation

In practice, you usually do not hand-write `new Placeholder<>(...)`. The common pattern is `Placeholder.build(...)` together with `PlaceholderBuilder`:

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

That example defines three common entry points:

- `self(...)`
  - defines how the current object behaves when the placeholder path itself is empty
  - in this case it bridges `MyEntry` into `Identifier`, so the empty path resolves through the `Identifier` placeholder; if you also want `${id}` explicitly, you still need to register `id` with `then(...)`
- `then(...)`
  - defines a child field and bridges it to another placeholder resolver
  - here `${example}` uses `Placeholder.STRING`, and `${tier}` uses `Placeholder.NUMBER`
- `TypeMapper.of(...)`
  - maps the current type into a target type manually
  - this is the most common style, especially because Java's generic inference is often too weak to do it on its own

Once a resolver exists, the next usual step is to wire it into a generator entry. See [Add Generator Entries](entry.md).

<a id="builder-methods"></a>

## Common `PlaceholderBuilder` methods

`PlaceholderBuilder<T>` is the most important tool when extending resolvers. These methods come up the most:

- `self(RegexParser<T>)`
  - directly defines how the current object resolves from the empty path
- `self(TypeMapper<T, F>, Placeholder<F>)`
  - bridges the current object into another placeholder type, usually much easier than writing a full `RegexParser` by hand
- `then(Pattern key, TypeMapper<T, O>, Placeholder<O>)`
  - register one child field
  - this is the most common extension point
- `then(Pattern key, TypeMapper<T, O>, Codec<O>)`
  - encode a child field as JSON and return it as the placeholder result
  - useful when the field already has a good codec and you do not need more nested placeholder behavior
- `thenMap(...)`
  - quickly register one field as a map-like subdomain
  - automatically gains helpers such as `get(...)`, `keys()`, `values()`, `mapValue(...)`, and `mapKey(...)`
- `thenList(...)`
  - quickly register one field as a list-like subdomain
  - automatically gains helpers such as `get(...)`, `getOr(...)`, `map(...)`, and `mapi(...)`
- `concat(...)`
  - merge in another existing resolver, keeping already-defined local keys when names overlap
- `overwrite(...)`
  - similar to `concat(...)`, but replaces existing overlapping keys
- `remove(...)`
  - remove one key
- `map(...)`
  - map the entire builder into another target type

For many entry types, `self(...) + then(...) + concat(...)` already covers almost everything.

<a id="bridge-existing"></a>

## Bridge into existing resolvers

The most maintainable pattern is usually to bridge into existing placeholder resolvers instead of rebuilding every field from scratch.

For example, imagine one entry contains an `Identifier`, an `ItemOutput`, and a `DataComponentPatch`:

```java
public static final Placeholder<MyEntry> PLACEHOLDER = Placeholder.build(builder -> builder
    .then(PatternKey.literal("id"), TypeMapper.of(MyEntry::getId), Placeholder.ID)
    .then(PatternKey.literal("result"), TypeMapper.of(MyEntry::getResult), Placeholder.ITEM_OUTPUT)
    .then(PatternKey.literal("components"), TypeMapper.of(MyEntry::getComponents), Placeholder.DATA_COMPONENTS)
);
```

This is useful because:

- you do not need to rebuild subfields such as `${id.namespace}` and `${id.path}` yourself
- you automatically reuse all methods that the built-in resolver already provides
- if the built-in resolver grows later, your entry often benefits without additional work

This is also one of the most common implementation styles in the Generator API.

<a id="map-list-fields"></a>

## List and map fields

If your entry includes collection fields, it is usually better not to hand-write helpers like `get(...)`. Use `thenMap(...)` or `thenList(...)` directly.

For example, suppose an entry contains a translation map:

```java
public static final Placeholder<MyEntry> PLACEHOLDER = Placeholder.build(builder -> builder
    .thenMap(PatternKey.literal("translations"), TypeMapper.of(entry -> MapReader.map(entry.getTranslations())), Placeholder.STRING)
);
```

That immediately makes these template forms available:

```text
${translations.get(en_us)}
${translations.keys().get(0)}
${translations.values()}
```

If it is a list field instead:

```java
public static final Placeholder<MyEntry> PLACEHOLDER = Placeholder.build(builder -> builder
    .thenList(PatternKey.literal("drops"), TypeMapper.of(entry -> ListReader.list(entry.getDrops())), Placeholder.ITEM_OUTPUT)
);
```

Then the template can do:

```text
${drops.get(0).id}
${drops._size}
${drops.map(id)}
```

These abilities do not come from `Template` itself. They are automatically added by `PlaceholderBuilder.ofMap(...)` and `ofList(...)`.

<a id="extend-existing"></a>

## Extend existing resolvers

If your entry extends another entry type, or if you only want to add a few fields on top of an existing resolver, `concat(...)` is usually the most convenient path.

For example:

```java
public class MyEntry implements DgEntry {
    public static final Placeholder<MyEntry> PLACEHOLDER = Placeholder.build(builder -> builder
        .then(PatternKey.literal("example"), TypeMapper.of(MyEntry::getExample), Placeholder.STRING)
        .concat(DgEntry.PLACEHOLDER, TypeMapper.of(entry -> entry))
    );

    // ...
}
```

This means:

- first declare the entry's own `${example}`
- then merge in the existing fields from `DgEntry`

If you need to replace inherited fields instead of only adding new ones, switch to `overwrite(...)`:

```java
public static final Placeholder<MyEntry> PLACEHOLDER = Placeholder.build(builder -> builder
    .overwrite(ParentEntry.PLACEHOLDER, TypeMapper.of(entry -> entry))
    .then(PatternKey.literal("name"), TypeMapper.of(MyEntry::getLocalizedName), Placeholder.STRING)
);
```

As a rule of thumb:

- use `concat(...)` when you are only adding fields
- use `overwrite(...)` when you need to change inherited behavior

<a id="builtins"></a>

## Built-in resolvers you can reuse directly

The most frequently reused built-in resolvers in the current code include:

- `Placeholder.STRING`
  - string values
- `Placeholder.NUMBER`
  - numeric values
- `Placeholder.BOOLEAN`
  - boolean values
- `Placeholder.JSON`
  - arbitrary JSON values
- `Placeholder.JSON_OBJECT`
  - JSON objects
- `Placeholder.JSON_ARRAY`
  - JSON arrays
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

Some common subfields include:

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

When you want to expose data to pack authors, it is usually better to bridge into these built-ins first instead of inventing a separate access syntax.

Once the resolver is done, the next normal step is to connect it into a [generator entry](entry.md#add-placeholder), or use it later from a [custom data generator](generator.md#register-generator).

