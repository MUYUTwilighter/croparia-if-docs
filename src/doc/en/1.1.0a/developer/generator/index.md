---
title: Runtime Data Generation
desc: Overview of Croparia IF's runtime data generation system for downstream developers, including the main extension points around DgEntry, DataGenerator, and Placeholder.
keywords:
  - Croparia IF
  - runtime data generation
  - DataGenerator
  - DgEntry
  - DgRegistry
  - Placeholder
  - Template
  - developer docs
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 30
---

# Runtime Data Generation (Developer)

<a id="overview"></a>

The **runtime data generation system** is the part of Croparia IF that can generate text files dynamically in batch form while the game is running.

If you want to understand the feature from the pack author's point of view first, see [Runtime Data Generation (Modpack)](../../modpack/generator/index.md#overview).
This developer section focuses on extending the system itself, mainly through custom [generator entries](entry.md#create-entry), [data generators](generator.md#create-generator-class), and [placeholder resolvers](placeholder.md#basic-creation).

<a id="navigation"></a>

## Navigation

- [Add generator entries](entry.md#create-entry)
- [Create custom data generators](generator.md#create-generator-class)
- [Create placeholder resolvers](placeholder.md#basic-creation)

