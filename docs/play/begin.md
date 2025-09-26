---
sidebar_position: 1
---

# Getting Started

Here we guide you to installation and some easy QAs.

## Installation

1. Be clear about the Minecraft version and the mod loader you are using. Croparia IF is available for both Fabric,
   Forge and Neoforge mod loaders, but the versions are different.
2. Go to the [CurseForge Mod Page](https://www.curseforge.com/minecraft/mc-mods/croparia-if) or
   [Modrinth Mod Page](https://modrinth.com/mod/croparia-if) to download the mod file.
3. Install Architectury API, which is a required dependency. You can find it on
   [CurseForge](https://www.curseforge.com/minecraft/mc-mods/architectury-api) or
   [Modrinth](https://modrinth.com/mod/architectury-api).
4. Place the downloaded mod files into the `mods` folder of your Minecraft instance.
5. Launch Minecraft using the appropriate mod loader profile.

## Frequently Asked Questions (FAQs)

### Q1: Am I suggested to use latest version?

**A1:** If your Minecraft instance has installed older versions of Croparia IF or Croparia, you need to check if the
**Major Version Number** (The number before the first dot ".") matches. If it does, surely it is recommended. If not,
please read the changelog carefully before updating, as there might be breaking changes.

Besides, if you are using a modpack or joining a server, please contact the modpack author or server admin before
updating.

### Q2: I have installed Croparia IF, but why recipes, loot tables, etc. are missing?

**A2:** Croparia IF relies on an extra datapack reload to auto-generate and apply the contents are might be missing.
However, some mods are known to hate this, so if you encounter this issue, please try the following steps:

1. Make sure the game is not running, then check your mod list, and disable the mods below:
    - [World Weaver](https://www.curseforge.com/minecraft/mc-mods/worldweaver): It breaks datapack reload
    - [Curtain](https://www.curseforge.com/minecraft/mc-mods/curtain): Its commands are likely to disappear after reload
2. Switch config `autoReload` and `override` to `true`, which are default values. You can use either in-game commands or
   edit the config file directly.
3. Start the game, create a new world and enter it. Wait for a while to let croparia generate the datapack.
4. Switch the config `autoReload` and `override` to `false`. If you are editing the config file directly, make sure the
   game is not running.
5. Enable the mods you disabled in step 1, then restart the game.

If there's any changes done to the crop definitions in the future, you need to repeat the above steps to make sure the
changes take effect.

If the issue persists, please report it on
the [GitHub Issues Page](https://github.com/MUYUTwilighter/croparia-if/issues).

### Q3: How do I check the recipes added by Croparia IF?

**A3:** Croparia IF
support [JEI](https://www.curseforge.com/minecraft/mc-mods/jei), [EMI](https://www.curseforge.com/minecraft/mc-mods/emi)
and [REI](https://modrinth.com/mod/rei) to show the recipes. If you experienced issues with these mods, please refer to
the [Q2](#q2-i-have-installed-croparia-if-but-why-recipes-loot-tables-etc-are-missing).

### Q4: How to play this mod?

**A4:** The advancements added by Croparia IF can guide you through the basic gameplay. You can also refer
to [Gameplay Tutorial](gameplay.mdx) for more details. Or you can check out the [links](#player-community) at the end of
this page.

## Player Community

- [QQ Group (Chinese)](https://qm.qq.com/q/q09RuwhIJM): For quick help and discussion
- [Discord Server (English & Chinese)](https://discord.com/invite/HDzTs8X8VF): For quick help and discussion