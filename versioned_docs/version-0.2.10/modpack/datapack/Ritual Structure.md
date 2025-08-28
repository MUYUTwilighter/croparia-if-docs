# Ritual Structure

The ritual structure is defined as a type of recipe here. The structure defined supports rotation and reflections.

Croparia IF only identifies recipes with following id:
- `croparia:ritual_stand`: T1 ritual
- `croparia:ritual_stand_2`: T2 ritual
- `croparia:ritual_stand_3`: T3 ritual

Taking `croparia:ritual_stand` as example:
```json
{
  "type": "croparia:ritual_structure",
  "keys": {
    "A": {
      "block": "minecraft:andesite"
    },
    "D": {
      "block": "minecraft:diorite"
    },
    "I": {
      "block": "croparia:block_crop_iron",
      "properties": {
        "age": "7"
      }
    },
    "G": {
      "block": "croparia:block_crop_gold",
      "properties": {
        "age": "7"
      }
    },
    "E": {
      "block": "croparia:elemental_stone"
    }
  },
  "pattern": [
    [
      "         ",
      "         ",
      "         ",
      "    $    ",
      "   $E$   ",
      "    $    ",
      "         ",
      "         ",
      "         "
    ],
    [
      "   D.D   ",
      " A..G..A ",
      " ....... ",
      "D..I.I..D",
      ".G..*..G.",
      "D..I.I..D",
      " ....... ",
      " A..G..A ",
      "   D.D   "
    ],
    [
      "   ...   ",
      " A.....A ",
      " ....... ",
      ".........",
      ".........",
      ".........",
      " ....... ",
      " A.....A ",
      "   ...   "
    ]
  ]
}
```

Fields:
> - `type`: recipe type, it must be `croparia:ritual_structure` to make it work
> - `keys`: pattern key mapping, used to identifies the character key with its block state predicate
>> - `{character key}`: a alphabetic uppercased character key, should not be following: `[SPACE]`, `.`, `$` and `*`
>>> - [Optional] `block`: block specification, could be block id or block tag. A hashtag is required if it is a tag
>>> - [Optional] `properties`: the block state properties. Note that the key & value should always be string
> - `pattern`: describe the structure using the key mapping
>> - (outer array): each element of the outer array stand for a layer of blocks. The fronter one means the lower height
>>> - (inner array): each element (string) of the inner array stand for a row of blocks. The direction does not matter.
>>>> - (element string): a row of block mapping keys.

Some special characters are used for particular functions:
- `[SPACE]`: match any block
- `.`: match only air block
- `$`: mark the position as input block for [ritual recipes](Datapack-Customizations.Ritual-Recipe-Scheme)
- `*`: mark the position as the ritual stand block