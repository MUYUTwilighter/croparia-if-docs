# Reload Issues

Croparia IF relies on datapack management to generate & load recipes, loot tables, etc. So, an extra datapack loading is
required every time a world is loaded.

However, there are some mods known to malfunction when datapack reload is performed.

- [World Weaver](https://modrinth.com/mod/worldweaver): It just breaks datapack reload
- [Curtain](https://modrinth.com/mod/curtain): The command will disappear after `/reload`

If you have to use mods above, you may try following steps to keep everything functioning.

1. Switch `autoReload` and `override` to `true`. Your game should not be running while editting the config file located
   at `{GameDir}/config/croparia.json`.

```json5
{
  "cropPath": "crops",
  "packPath": "config\\croparia",
  "dumpPath": "croparia",
  "autoReload": true, // true here
  "override": true, // true here
  "fruitUse": true,
  "infusor": true,
  "ritual": true,
  "blacklist": []
}
```

2. Launch the game and enter a world **without** mods above that interrupts the reload, but keep Croparia IF and other
   mods enabled. Croparia IF would generate necessary data files after the world is fully loaded.
3. Switch `autoReload` and `override` to `false`. You may use either [command](Commands) or config files.
4. Restart the game with all the mods, then it should now be fine.
5. If there are changes to the crop definition later, you should perform steps here again.