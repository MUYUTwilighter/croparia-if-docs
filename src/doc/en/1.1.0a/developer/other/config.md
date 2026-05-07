---
title: Config System
desc: Explains Croparia IF's Config object and ConfigFileHandler, focusing on responsibility split, defaulting strategy, and load-save-reload behavior.
keywords:
  - Croparia IF
  - Config
  - ConfigFileHandler
  - config system
  - config file
  - developer docs
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 10
---

# Config System

<a id="overview"></a>

Croparia IF's config system is mainly built from two parts:

- `Config`
- `ConfigFileHandler`

Their roles are sharply separated:

- `Config` represents the runtime config object
- `ConfigFileHandler` loads, saves, and reloads that object from disk

That means the config system is not just "map JSON fields straight onto one class." It explicitly separates:

- raw file structure
- runtime semantics
- file IO behavior

<a id="config-object"></a>

## `Config`

`Config` is the runtime object that actual mod logic consumes. In most cases, developers should not write logic directly around raw file fields. They should depend on the already-normalized runtime object.

It mainly handles:

- resolving relative paths against the game directory
- providing defaults when fields are missing
- splitting blacklist rules into crop ID blacklist versus mod blacklist
- exposing business-facing checks such as `isCropValid(...)` and `isModValid(...)`

So if your goal is simply "read config and decide whether some feature is enabled," the right dependency is `Config`, not the raw file object.

<a id="raw-and-runtime"></a>

## Raw config versus runtime config

From the source structure, Croparia IF intentionally splits:

- `RawConfig`
- `Config`

into two different layers.

Those layers serve different purposes:

- `RawConfig` stays close to file structure, which makes decode and save flows easier
- `Config` stays close to runtime logic, which makes actual usage easier

So the best way to read the design is: first read the file, then normalize it into a runtime object that is pleasant to use.

<a id="file-handler"></a>

## `ConfigFileHandler`

`ConfigFileHandler` owns config IO and reload behavior.

Its main responsibilities are:

- `load()`
- `save(Config)`
- `reload(Config)`

The important design detail is:

- `load()` does more than read; if the file is missing or unreadable, it builds a default config and saves it immediately
- `reload(Config)` does not replace the config object reference; it copies new values back into the existing instance

That means:

- other systems can keep holding the same `Config` object
- reload does not force every reference holder to reacquire a brand-new instance

<a id="paths"></a>

## Path handling

`parsePath(...)` and `resolvePath(...)` inside `Config` capture a very useful path strategy:

- config files may store relative paths
- runtime always resolves them against the game directory
- saving tries to collapse them back into relative form where possible

The direct benefit is:

- configs stay easier to move between machines
- users are less likely to hardcode machine-specific absolute paths into the file

If you are building another system that must support both relative and absolute paths, this part is worth borrowing.

<a id="blacklist"></a>

## The blacklist model

The blacklist design in `Config` is also a strong example of runtime normalization. At the file level it is just a list of strings, but at runtime it is split into:

- crop ID blacklist
- mod blacklist

The mod blacklist even supports regex-based matching.

For developers, the important thing to notice is:

- the file exposes a very simple shape
- the runtime object exposes a more useful structure for actual decisions

So if you need to extend config logic, change the normalization and decision logic inside `Config` first instead of pushing more business logic back into raw file fields.

<a id="when-to-use"></a>

## When this design is worth copying

If your own system needs more than "read one JSON object," for example:

- defaults
- path resolution
- runtime reload
- normalization from file fields into a structure the program actually wants

then Croparia IF's `RawConfig -> Config -> ConfigFileHandler` split is a very good reference.

<a id="tips"></a>

## Tips

- Keep file IO centralized the way `ConfigFileHandler` does, instead of letting it spread through feature code.
- Do not make runtime logic depend directly on the raw JSON shape if you can normalize once inside `Config`.
- If the system needs hot reload, consider updating one long-lived instance rather than replacing the whole reference graph.

