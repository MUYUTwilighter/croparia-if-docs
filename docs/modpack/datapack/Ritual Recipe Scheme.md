# Ritual Recipe Scheme

This page explains the recipe scheme of ritual conversion.

Taking `croparia:horn_plenty` as example, the ritual recipe is like this:
```json
{
  "type": "croparia:ritual",
  "tier": 2,
  "ingredient": {
    "id": "minecraft:goat_horn"
  },
  "block": {
    "block": "minecraft:cake",
    "properties": {
      "bites": "0"
    }
  },
  "result": {
    "id": "croparia:horn_plenty",
    "Count": 1
  }
}
```
Fields:
> - `type`: the recipe type, set to `croparia:ritual` if you want to use ritual recipe type
> - `tier`: tier of the ritual, should between `1` to `3` inclusive
> - `ingredient`: the item need to be thrown on the infusor
>> - [Optional] `id`: item id, should not be set when `tag` is set
>> - [Optional] `tag`: item tag, should not be set when `id` is set
>> - [Optional] `nbt`: nbt component for the item
>> - [Optional] `count`: count of the item, default value `1`
> - `block`: block used to sacrifice
>> - [Optional] `block`: block specification, could be block id or block tag. A hashtag is required if it is a tag
>> - [Optional] `properties`: the block state properties. Note that the value should always be string
> - `result`: the output item
>> - `id`: item id, **note that if the result item is spawn egg, it will be "used" on the ritual stand to summon the entity**
>> - `Count`: item count, notice that it is camel cased.