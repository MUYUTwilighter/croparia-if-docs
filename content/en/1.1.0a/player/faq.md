---
title: FAQ
desc: Frequently asked questions for Croparia IF 1.1.0a players, covering crashes, multiplayer issues, missing recipes, dynamic data generation, and common troubleshooting paths.
navOrder: 3
---

# FAQ

If you run into behavior that **does not match the mod’s intended behavior**, there is a good chance you have hit a bug. You can start checking here, and if this page does not solve it, contact us through one of these channels:

- [QQ group](https://qm.qq.com/q/OedneeO0Uw)
- [Discord](https://discord.gg/JunKeKCJAY)
- [GitHub](https://github.com/MUYUTwilighter/croparia-if/issues)

**We always encourage players to reach out and send feedback.**

If you are playing a modpack assembled by someone else, please talk to the modpack author first.

## Q1. I ran into crashes, severe lag, or even world corruption

**A1: stop playing immediately and report it.**

When you do, please provide as much of the following as possible:

- runtime log (`[game directory]/logs/latest.log`)
- debug log if present (`[game directory]/logs/debug.log`)
- crash report if present (`[game directory]/crash-reports/crash-xxx.log`)

## Q2. I cannot join a multiplayer game

This is usually caused by mismatched crop definitions. Sync the host’s crop definitions to the client, usually from:

- `[game directory]/croparia/crops`
- `[game directory]/croparia/melons`

Croparia IF allows users to add custom crops. Those custom crops can also introduce new items, blocks, and other registry entries. If the host and client do not share the same crop definitions, their registries may differ, and Minecraft will disconnect the player when it detects the mismatch.

## Q3. I cannot craft something, recipes are missing, or crops are not dropping fruit

These problems are usually related to the mod’s dynamic data generation. Check the two common cases below.

### 1. A mod conflict is interfering with reload

You can safely disable auto-reload like this:

1. Make sure the game is currently closed, then disable the potentially conflicting mod.
2. Edit the config file, usually `[game directory]/config/croparia.json`, and set `override` to `false`.
3. Start the game and enter a world. Wait roughly 10 seconds for Croparia IF’s automatic reload to finish.
4. Close the game again, then set `autoReload` to `false`.
5. Re-enable the previously disabled mod and start the game again.

**Note**: if you later need to change crop definitions or generator templates, you will need to repeat this process.

Croparia IF uses a template-based runtime generator to create a lot of in-game data. Because Minecraft tag loading happens later than ideal for this workflow, the mod normally performs an additional data-pack reload after entering a world. This can conflict with some other mods, for example:

- Curtain: its command registration has flaws, so commands may disappear after a data-pack reload;
- WorldWeaver: the exact reason is unclear, but it can break the reload process and cause all non-vanilla data to fail.

### 2. A migration conflict between versions

The mod is still evolving, and sometimes that comes with breaking changes. You can try resetting Croparia IF’s generated data files without touching the world save itself:

1. Make sure the game is closed, then back up your world save, the mod data folder (usually `[game directory]/croparia`), and the config file (usually `[game directory]/config/croparia.json`).
2. Delete the following folders inside the mod data folder:
   - `data`
   - `assets`
   - `datapack`
   - `recipe_wizard`
   - `resourcepack`
3. Start the game again. The generated data will be rebuilt from scratch.

