# Crop Translations

The translation key for seed, fruit and crop blocks are template translations, meaning you only need to define the translations for the crop name.

For example, if there is already a translation for crop name `Iron Ingot`, then Croparia IF will generate crop seed name `Iron Ingot Seeds`, crop block name `Iron Ingot Crop Block` and fruit name `Iron Ingot Fruit`.

The translation key for the name templates are as follows:
```json
{
  "item.croparia.crop.fruit": "%s Fruit",
  "item.croparia.crop.seed": "%s Seeds",
  "block.croparia.crop.block": "%s Crop"
}
```
The `%s` means the placeholder for crop name translation.

The Translation for crop name is optinally declared inside the crop definition. But it is not declared manually, Croparia IF will generate a default translation key `crop.croparia.{crop name}`.
To modify the translation value, you can create a new resource pack with language file declaring that default key.