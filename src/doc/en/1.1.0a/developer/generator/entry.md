---
title: Add Generator Entries
desc: Explains how to add new DgEntry and DgRegistry types to Croparia IF's runtime data generation system and connect them to custom placeholders.
keywords:
  - Croparia IF
  - runtime data generation
  - DgEntry
  - DgRegistry
  - Placeholder
  - generator entry
  - developer docs
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 10
---

# Add Generator Entries

<a id="overview"></a>

A generator entry (`DgEntry`) provides template data values through a placeholder resolver (`Placeholder`), and is selected by the generator script through a generator entry set (`DgRegistry`).

If you want to add your own entry type, you usually need:

- one custom entry class
- one matching registry
- one placeholder resolver
- and finally a registry registration so the generator system can discover it

If you have not looked at the overall structure yet, start with [Runtime Data Generation (Developer)](index.md#overview). If you prefer to design field access first and wire entries in afterward, you can also begin with [Create Placeholder Resolvers](placeholder.md#basic-creation).

<a id="create-entry"></a>

## Create the entry class

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

## Attach a placeholder resolver

The placeholder resolver turns runtime data from the entry into values that can fill a template.
See [Create Placeholder Resolvers](placeholder.md#basic-creation) for the full design. Here the goal is only to show how to connect one to an entry.

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

**Note:** if your entry class extends another entry type, do not forget to merge in the parent placeholder resolver as well. At minimum, that usually means including `DgEntry.PLACEHOLDER`.

<a id="create-registry"></a>

## Create the entry registry

You can either create your own subclass of `DgRegistry<MyEntry>`, or use helper methods such as `DgRegistry.ofEnum(...)` and `DgRegistry.ofMap(...)`.

Once created, register it into the API:

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

After that, the generator script can iterate over the entire entry set just by naming its registry ID:

```toml
registry = "modid:my_registry"
# ...
```

Once the entry and its registry are ready, the next common step is to have a [custom data generator](generator.md#register-generator) actually consume them.

