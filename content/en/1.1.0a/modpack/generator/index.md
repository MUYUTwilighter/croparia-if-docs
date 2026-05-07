---
title: Runtime Data Generation System
desc: Introduces the Croparia IF 1.1.0a runtime data generation system for modpack authors, including PackHandler, data generators, templates, and workflow.
navOrder: 40
---

# Runtime Data Generation System (Modpack Authors)

<a id="overview"></a>

The **Runtime Data Generation System** is one of the most important systems in Croparia IF. It can generate data pack or resource pack files in bulk from **data generators**, then automatically inject them into the game through a **generated pack handler**.

For modpack authors, it is essentially the “one script handles hundreds of recipes” tool.

## Core concepts

<a id="core-concepts"></a>

<a id="pack-handler"></a>

### Generated Pack Handler - PackHandler

The generated pack handler manages a directory-style data pack or resource pack. It reads generator definitions, triggers generation, maintains intermediate cache state, and writes the final output into the pack directory.

<a id="data-generator"></a>

### Data Generator - DataGenerator

A data generator is a concrete generation rule. It defines which collection of entries should be iterated, where the generated files should go, and how their contents should be structured.

<a id="template"></a>

### Template - Template

A template describes the output structure inside a generator. Both the output path and the file content can be declared through templates, and they may contain placeholder expressions that are resolved at generation time.

<a id="placeholder"></a>

### Placeholder Resolver - Placeholder

A placeholder resolver exposes data to templates. It defines which fields can be referenced and how those fields are resolved and expanded.

<a id="entry"></a>

### Data Generator Entry

A data generation entry is the unit that provides template data. The collection built from these entries is called a **Data Generator Registry**.

<a id="entry-registry"></a>

<a id="workflow"></a>
## Typical workflow

### 1. Decide what kind of data you are generating

First determine whether your target belongs to a data pack or a resource pack. This decides which generated pack handler you will work under.

For data pack output, use the data-pack-side generated pack handler under the mod data root’s `datapack` directory.

For resource pack output, use the resource-pack-side generated pack handler under the mod data root’s `resourcepack` directory.

Once that is settled, move into the `generator` folder inside that directory pack.

### 2. Choose the entry registry

<a id="workflow-registry"></a>

You need to decide “generate data for what”. Croparia IF currently provides three built-in registries:

- fruit crops `croparia:crops`
- melons `croparia:melons`
- elements `croparia:elements`

### 3. Choose the generator type

<a id="workflow-generator-type"></a>

Different kinds of data need different composition patterns. Croparia IF currently provides:

- `croparia:generator`
  - generates one standalone output per entry; later outputs overwrite earlier ones if they target the same path
- `croparia:aggregated`
  - aggregates outputs that share the same target path; commonly used for tags
- `croparia:lang`
  - similar to the aggregated generator, but specialized for language files and only usable with translatable entries

### 4. Write the generator file

<a id="workflow-create-generator"></a>

Create a `toml` file (recommended), `cdg`, or `json` file in the `generator` directory under the chosen generated pack handler.

For the actual writing process, see [Create a Data Generator](create-generator.md).

### 5. Run and test

<a id="workflow-debug"></a>

Once your generator is valid, you can query it with `/croparia|cropariaServer generator query [pack handler ID] [generator name]`.

If it does not appear in command completion, the generator likely contains a problem. Check the log for details.

If everything works, you will find the generated output inside the directory pack’s `assets` or `data` folder. The actual gameplay effect still needs in-game testing.

## Modify or disable built-in generators

Use `/croparia|cropariaServer generator dumpBuiltin [pack handler ID] [generator name]` to dump a built-in generator for editing.

Set `enabled = false` to disable that generator.

