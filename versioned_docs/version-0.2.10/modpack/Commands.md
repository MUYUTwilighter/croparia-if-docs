# Commands

Since 0.2.0-pre-2, Croparia IF has provided commands to debug the crops.

## Client commands

Client commands only uses data from the client locally, it may not reflect the same data from the server.

- `croparia crop`: Display the crop information about the item you hold or the block you are looking at
- `croparia crop [name]`: Display the crop information matching the given name
- `croparia dump`: Dump all crop definitions to [`dumpPath`](Configurations.md)
- `croparia dump [name]`: Dump crop definition matching the given name to [`{dumpPath}`](Configurations.md)/[name].json
- `croparia dumpBuiltin`: Similar to `croparia dump`, but only effective to built-in crops

## Server commands

- `cropariaServer crop [name]`: Display the crop information matching the given name
- `cropariaServer dump`: Dump all crop definitions to [`dumpPath`](Configurations.md)
- `cropariaServer dump [name]`: Dump crop definition matching the given name to [`{dumpPath}`](Configurations.md)
  /[name].json
- `cropariaServer dumpBuiltin`: Similar to `croparia dump`, but only effective to built-in crops
- `cropariaServer infusor`: Display enability for infusor
- `cropariaServer infusor [true/false]`: Set enability for infusor
- `cropariaServer ritual`: Display enability for ritual stand
- `cropariaServer ritual [true/false]`: Set enability for ritual stand
- `cropariaServer fruitUse`: Display the enability for fruit usage
- `cropariaServer fruitUse [true/false]`: Set the enability for fruit usage
- `cropariaServer autoReload`: Display enability for datapack auto-reload, see details
  in [reload-issues](../reload-issues)
- `cropariaServer autoReload [true/false]`: Set enability for datapack auto-reload
- `cropariaServer override`: Display enability for override mode of data file generation
- `cropariaServer override [true/false]`: Set enability for override mode of data file generation