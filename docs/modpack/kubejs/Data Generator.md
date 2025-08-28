[< Back to KubeJS-support](KubeJS-support)

# KubeJS Support for Data Generator

Please read [Datapack Customization - Data Generator](Datapack-Customizations.Data-Generator) first to know what Data Generator is.

To use add Data Genertor via KubeJs, you need to follow these steps:

```js
// 1. Grab DataGeneratorCreator class
const DataGeneratorCreator = Java.loadClass("cool.muyucloud.croparia.kubejs.DataGeneratorCreator");  // Use java("...") for 1.18 or older
// 2. Add DataGenerator
/**
 * Creates a new data generator.
 *
 * @param enabled    [Optional: null for true] Whether the generator is enabled. If null, it will be treated as true.
 * @param path       The path to the generator.
 * @param dependency [Optional: null for empty] The dependency of the generator. If null, it will default to "minecraft".
 * @param crops      [Optional: empty list for all crops] The list of crops for the generator.
 * @param template   The template for the generator.
*/
DataGeneratorCreator.create(true, "croparia/recipe/example/{name}.json", "minecraft", ["example", "example2"], `{
  "type": "minecraft:crafting_shapeless",
  "ingredients": [
    {
      "item": "{fruit}"
    }
  ],
  "result": {
    "item": "{result}",
    "count": {result_count.2}
  }
}`)
```

The generator added by KubeJs will be automatically cleared on every reload.