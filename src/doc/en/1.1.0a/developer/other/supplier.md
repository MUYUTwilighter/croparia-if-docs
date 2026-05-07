---
title: Supplier Helpers
desc: Explains Mappable, LazySupplier, and OnLoadSupplier in Croparia IF, along with their use in delayed computation, caching, and reload-aware values.
keywords:
  - Croparia IF
  - Mappable
  - LazySupplier
  - OnLoadSupplier
  - Supplier
  - lazy loading
  - data reload
  - developer docs
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 60
---

# Supplier Helpers

<a id="overview"></a>

Croparia IF provides several small helpers under `util.supplier` for situations involving:

- delayed creation
- lazy caching
- automatic refresh after data reload
- continued mapping on top of `Supplier`

The three most commonly used types are:

- `Mappable<T>`
- `LazySupplier<T>`
- `OnLoadSupplier<T>`

<a id="mappable"></a>

## `Mappable`

`Mappable<T>` is the thinnest layer of the group. It is essentially a `Supplier<T>` that also supports `map(...)`.

Its value is:

- you can keep transforming the eventual result without forcing immediate evaluation
- upper APIs do not need to decide too early what the final display object should look like

In the source, it often shows up as:

- a workstation item stack
- a lazily built display object

It is a very small interface, but it preserves room for later transformations, which is especially useful in UI and deferred-construction paths.

<a id="lazy-supplier"></a>

## `LazySupplier`

`LazySupplier<T>` is the classic lazy cache:

- build the value on the first `get()`
- return the cached value on every later `get()`

It is a good fit when:

- constructing the value is not cheap
- but once computed, the result can usually be reused for a long time

This kind of object appears all over Croparia IF, for example:

- some display-stack lists
- values derived from registries or tags

Compared with "recompute every time," it is cheaper. Compared with "build immediately at class load," it binds later to the actual runtime environment.

<a id="on-load-supplier"></a>

## `OnLoadSupplier`

`OnLoadSupplier<T>` can be understood as a reload-aware `LazySupplier`.

Its main difference from `LazySupplier` is:

- `LazySupplier`
  - one cache, valid until process end
- `OnLoadSupplier`
  - after data-pack reload, the next `get()` rebuilds the value

Croparia IF records the latest data reload time in `OnLoadSupplier.LAST_DATA_LOAD`, and `OnLoadSupplier` decides from that whether its cache has become stale.

That makes it especially useful for:

- caches that depend on tags, registries, or data-pack content
- values that should refresh automatically after reload without every call site having to manage invalidation manually

<a id="when-to-use"></a>

## Which one to use

A simple rule of thumb works well:

- you only want delayed construction and do not care about reload
  - `LazySupplier`
- you want to keep mapping on top of a supplier
  - `Mappable`
- the value depends on data packs, tags, or reload-sensitive runtime data
  - `OnLoadSupplier`

They are not really competing tools so much as layers of the same idea:

- `LazySupplier` implements `Mappable`
- `OnLoadSupplier` extends `LazySupplier`

So it is fair to think of them as the same pattern at increasing levels of capability.

<a id="where-used"></a>

## Where you will encounter them

These helpers most often show up in:

- display-stack and workstation data inside the [Recipe API](../recipe/index.md#overview)
- cached collections derived from crops, materials, blocks, registries, or tags
- runtime objects that depend on data-pack loading results

If a value:

- is not safely available at startup
- is too expensive or awkward to rebuild every time
- and may become stale after reload

then `OnLoadSupplier` is usually the right thing to inspect first.

<a id="tips"></a>

## Tips

- Do not convert every `Supplier` into `LazySupplier`. It only helps when "compute later" is genuinely the better lifecycle.
- If the value depends on tags or data-pack content, prefer `OnLoadSupplier`, otherwise stale caches after reload are very easy to create.
- When you need chained transformations, preserve the `Mappable` shape as long as possible instead of calling `get()` too early and wrapping the result again afterward.

