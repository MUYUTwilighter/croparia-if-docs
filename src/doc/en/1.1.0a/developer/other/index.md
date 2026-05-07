---
title: Other Common APIs
desc: Collects several helper APIs in Croparia IF that are not large enough to deserve their own major group, but still appear frequently in real development work.
keywords:
  - Croparia IF
  - developer docs
  - other APIs
  - JsonTransformer
  - Config
  - BlockProperties
  - ItemPlaceable
  - LazySupplier
  - OnLoadSupplier
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 70
---

# Other Common APIs

<a id="overview"></a>

This group collects several helper APIs that show up often in Croparia IF, even though each one is relatively small on its own.

If you run into questions like these during development, this is a good place to start:

- how to funnel `json`, `toml`, or `cdg` text formats into one `Codec`-based pipeline
- how to organize a reloadable, persistent config object
- how to read, match, or modify block-state properties
- how to let an item participate in logic as a "placeable item"
- how to delay computation, map suppliers, or refresh values after data loading

The current group mainly includes:

- [JSON transformation](json.md#overview)
- [Config system](config.md#overview)
- [Custom item components](item-components.md#overview)
- [Reading and modifying block properties](block-property.md#overview)
- [ItemPlaceable](item-placeable.md#overview)
- [Supplier helpers](supplier.md#overview)

