# Infusor Recipe Scheme

This page explains the recipe scheme of infusion.

Taking Croparia T2 as example, the infusion recipe is like this:
```json
{
  "type": "croparia:infusor",
  "element": "earth",
  "ingredient": {
    "id": "croparia:croparia",
    "count": 2
  },
  "result": {
    "id": "croparia:croparia2",
    "Count": 1
  }
}
```
Fields:
> - `type`: the recipe type, set to `croparia:infusor` if you want to use infusion type
> - `element`: the infusor type required on the infusor, available values: `elemental`, `earth`, `water`, `fire`, `air`
> - `ingredient`: the item need to be thrown on the infusor
>> - [Optional] `id`: item id, should not be set when `tag` is set
>> - [Optional] `tag`: item tag, should not be set when `id` is set
>> - [Optional] `nbt`: nbt component for the item
>> - [Optional] `count`: count of the item, default value `1`
> - `result`: the output item
>> - `id`: item id
>> - `Count`: item count, notice that it is camel cased.