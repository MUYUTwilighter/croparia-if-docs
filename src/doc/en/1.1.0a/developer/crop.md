---
title: Adding Built-in Crops
desc: Explains for developers how to add built-in fruit crops and melon crops in Croparia IF, including the registration entrypoints to edit, the minimum fields required, and the derived content that will be created automatically.
keywords:
  - Croparia IF
  - developer docs
  - Crop
  - Melon
  - Crops
  - Melons
  - DgRegistries
  - ItemMaterial
  - BlockMaterial
  - 1.1.0a
navOrder: 80
---

# Adding Built-in Crops

<a id="overview"></a>

If you opened this page because you want to keep adding one more built-in crop to Croparia IF, the most important conclusions can come first:

- built-in fruit crops are mainly added in `registry/Crops.java`
- built-in melon crops are mainly added in `registry/Melons.java`
- neither of these content lines ends with “add one registry record”; both automatically derive the matching blocks and items
- whether content actually appears depends not only on whether you instantiated an object, but also on `shouldLoad()`, dependency checks, and configuration filters

So this page is not trying to be a generic crop-system overview. It directly answers:

- which file should be edited to add a built-in crop
- what the minimum required data is for one `Crop` or `Melon`
- which blocks and items Croparia IF derives automatically after you add it
- which layer you should debug first if the new content does not show up

If what you need is the modpack-side customization route, see [Custom Crops](../modpack/custom-crops.md).

<a id="two-lines"></a>

## First separate the two content lines

Inside Croparia IF, built-in crop-related content mainly splits into two lines:

- `Crop`
  - fruit crops
  - typically produce seeds, fruits, and one crop block
- `Melon`
  - melon crops
  - typically produce seeds, fruit blocks, stems, and attached stems

If all you want to know is “which file should I edit”, use this distinction first:

- if the result is a normal fruit harvested from one crop plant
  - look at `Crop`
- if the result is a large fruit block produced by a stem structure
  - look at `Melon`

They both belong to the crop system, but they do not share the same implementation template in code.

The most important differences are:

- `Crop` uses `ItemMaterial`
- `Melon` uses `BlockMaterial`
- `Crop` has `type`
- `Melon` does not
- `Crop` derives “crop block + seed + fruit”
- `Melon` derives “fruit block + seed + stem + attached stem + fruit item”

From the developer’s point of view, they are better understood as two different content templates rather than one class with different textures.

<a id="crop-line"></a>

## How to add a built-in `Crop`

<a id="add-crop"></a>

### Step 1: go to `Crops.java`

The main entrypoint for built-in fruit crops is `registry/Crops.java`.

Croparia IF currently defines most built-in fruit crops there and registers them through field initialization into:

- `DgRegistries.CROPS`

If your goal is simply to add one more built-in content entry, you usually do not need to change the lower-level `Crop` class first. Start with a new definition in `Crops.java`.

### Step 2: pick the right helper

The most common helper entrypoints currently fall into three groups:

- `croparia(...)`
  - best when the material itself is content provided by Croparia IF
- `vanilla(...)`
  - best when the material directly corresponds to a vanilla item
- `compat(...)`
  - best when the material comes from a compatibility mod, or when loading should depend on tags and dependency conditions

If you are adding a built-in crop for a vanilla item, copying one of the existing `vanilla(...)` patterns is usually enough.

### Step 3: prepare the minimum fields

When constructing one `Crop` definition, you should at least know:

- `name`
  - becomes part of the final registration name
- `material`
  - the material meaning produced by this crop
- `color`
  - mainly used by rendering and resource generation
- `tier`
  - crop tier
- `type`
  - resource presentation category such as `crop`, `animal`, or `monster`
- `dependencies`
  - used when loading should depend on another mod and translation key selection

This is why `Crop` should not be thought of as “just crop metadata”. It already carries most of the information needed to land real content.

### Step 4: what gets derived automatically

Once a `Crop` is created and registered, it does not only yield one definition object.

Its constructor prepares three derived content objects:

- `CropariaCropBlock`
- `CropSeed`
- `CropFruit`

Then `onRegister()` actually registers them.

So from the developer experience point of view, adding one built-in crop usually looks like this:

1. add one definition in `Crops.java`
2. make it enter `DgRegistries.CROPS`
3. let `Crop` handle the derived crop block, seed, and fruit registration

That is one of the most convenient parts of the design.

### What one `Crop` really represents

The core fields of `Crop` include:

- `Identifier id`
- `ItemMaterial material`
- `Color color`
- `int tier`
- `String type`
- `Map<String, String> translations`
- `CropDependencies dependencies`

When adding built-in crops, the two most important fields are usually `material` and `type`:

- `material`
  - decides the material meaning produced by the crop
  - is also reused by other systems later on
- `type`
  - is closer to presentation and resource classification
  - for example `crop`, `animal`, `monster`, and `nature`

So `Crop` is better understood as “fruit crop definition + derived registration template”, not as a plain config object.

### Why a definition may exist but not appear

If you add a definition in `Crops.java` but still do not see the resulting content in-game, check these layers first:

- `dependencies`
  - should this content load in the current environment?
- `shouldLoad()`
  - do dependency checks and config filters pass?
- `CropariaIf.CONFIG.isCropValid(...)`
  - does the current configuration still allow this crop?
- `onRegister()`
  - did the derived blocks and items actually reach the registration step?

In other words, “definition exists” and “content appears” are separated by one more loading decision layer.

<a id="melon-line"></a>

## How to add a built-in `Melon`

<a id="add-melon"></a>

### Step 1: go to `Melons.java`

The main entrypoint for built-in melon content is `registry/Melons.java`.

Just like `Crops.java`, each definition there first enters:

- `DgRegistries.MELONS`

So if your goal is “add one built-in melon crop”, the first step is again to add one definition in `Melons.java`.

### Step 2: prepare the minimum fields

The `Melon` line is more fixed than `Crop`, and the most common built-in helper is currently something like `vanilla(...)`.

At minimum, you need:

- `name`
- `material`
  - here it is `BlockMaterial`
- `color`
- `tier`

Unlike `Crop`, it has no `type`, because the presentation template of melon-style crops is already more fixed.

### Step 3: what gets derived automatically

One `Melon` definition prepares five derived content objects:

- `MelonStem`
- `MelonAttach`
- `MelonSeed`
- `MelonBlock`
- `MelonItem`

Then `onRegister()` registers them all together.

So from the developer’s point of view, adding a built-in melon crop usually looks like:

1. add one definition in `Melons.java`
2. register it into `DgRegistries.MELONS`
3. let `Melon` derive the stem, attached stem, fruit block, fruit item, and seed

### How `Melon` is best understood

The core fields of `Melon` are more compact:

- `Identifier id`
- `BlockMaterial material`
- `Color color`
- `int tier`
- `Map<String, String> translations`
- `CropDependencies dependencies`

The most important thing to remember here is:

- `Melon` is not a simplified version of fruit crops
- it is a “melon crop structure definition + derived registration template”

If you are adding one built-in melon crop, the work usually centers on writing the definition correctly rather than changing lots of runtime logic.

<a id="registries"></a>

## Why everything passes through `DgRegistries`

Whether it is `Crop` or `Melon`, built-in content is not registered by writing blocks and items straight from `Crops` / `Melons` into vanilla registries first. It enters:

- `DgRegistries.CROPS`
- `DgRegistries.MELONS`

For developers maintaining built-in content, the sequence to remember is:

1. write the content definition in `Crops.java` / `Melons.java`
2. let `DgRegistries` collect those definitions
3. let `Crop` / `Melon` derive and register the actual blocks and items during registration

This design exists so later systems such as resource generation, language generation, and derived registration can all work around the same definition objects.

<a id="dependencies"></a>

## Compatibility, translation, and load control

Both `Crop` and `Melon` carry `CropDependencies`.

That layer is not only about “recording which mod is required”. More importantly, it controls:

- whether the content should load in the current environment
- which translation key should be used

So if you are working on built-in compatibility content, do not think of dependency handling as something you “add at the end”.

In this design:

- dependency conditions are part of the content definition itself
- translation-key selection also travels together with that definition

That is one of the reasons helpers such as `compat(...)` exist:

- the same content definition
- can choose different loading behavior and translation behavior depending on the environment

<a id="load-and-register"></a>

## Debug chain: how one definition reaches the game

Both `Crop` and `Melon` implement two very important methods:

- `shouldLoad()`
- `onRegister()`

`shouldLoad()` mainly checks:

- whether dependency conditions are satisfied
- whether configuration still allows the crop to load

`onRegister()` is what actually pushes the derived content into registration.

If you want to debug why one new content definition did not land, the most useful order is usually:

1. create the definition in `Crops.java` or `Melons.java`
2. register it into the matching `DgRegistries`
3. call `shouldLoad()` to decide whether it should load
4. if allowed, run `onRegister()`
5. let the derived blocks and items enter the real registration flow

So when you are asking “why is this crop missing?”, do not only stare at the vanilla registry layer. Go back and check `shouldLoad()`, dependency conditions, and whether `onRegister()` was actually reached.

<a id="what-to-learn"></a>

## What is most worth remembering

If your goal is to maintain or extend Croparia IF’s own built-in crop content, the most important takeaways are:

- to add a built-in fruit crop, start with `Crops.java`
- to add a built-in melon crop, start with `Melons.java`
- `Crop` and `Melon` are not final registered content by themselves; they derive a full set of blocks and items
- whether content appears depends on the definition, dependencies, config filters, and registration flow together
- this page is better treated as “built-in content maintenance reference” than as a complete public extension API

<a id="where-next"></a>

## Where to go next

- If you want to see how these definitions enter the data-generation system, see [Runtime Data Generation System](generator/index.md#overview)
- If you want the modpack-level customization path, see [Custom Crops](../modpack/custom-crops.md)
- If you want to see how core modules consume these crop definitions, [Crop Transmuter](core/crop-transmuter.md#overview) is usually the best starting point
