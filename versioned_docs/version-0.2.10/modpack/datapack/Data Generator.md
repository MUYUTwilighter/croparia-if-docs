# Data Generator

The **Data Generator** is a template-based API designed to batch-process crops, generating recipes, loot tables, and
other datapack-related files. By default, several Data Generators are located at [`packPath`](../Configurations.md)
`\generators` (visible after first world load).

Croparia IF automatically generates datapack files using the Data Generators found in this directory. The data files are
generated before every datapack loading.

---

## Creating Your Own Data Generator

### Step 1: Create a Generator File

Create a plain text file within the directory:

```
{packPath}/generators
```

The filename is arbitrary, provided it resides in the correct location and is a plain text file.

---

### Step 2: Specify the Target File Path

Every generated file must have a specified target location. Add the `@path` tag at the beginning of your generator file
to indicate this:

```plaintext
@path=croparia/recipes/example/{name}.json
...
```

The `{name}` placeholder provided by Croparia IF will be explained below.

---

### Step 3: Define the Template Content

Below the `@path` line, write your file's content template. Utilize **Placeholders** provided by Croparia IF to insert
crop-specific data.

You may reference or modify the default data generators provided by Croparia IF as a starting point. Your changes to the
default generators are preserved.

---

## Available Placeholders

Placeholders are special markers replaced by actual crop data when generating files. Some placeholders represent static
data, while others are dynamically resolved.

| Placeholder                     | Description                                            |
|---------------------------------|--------------------------------------------------------|
| `{color}`                       | Crop color as integer                                  |
| `{color_hex}`                   | Crop color as hex string (without `0x` or `#`)         |
| `{croparia}`                    | Croparia item ID used to craft seeds                   |
| `{croparia_path}`               | Same as `{croparia}` without namespace                 |
| `{material_type}`               | `"item"` if material is an item, `"tag"` if a tag      |
| `{material}`                    | Material item/tag (no `#` prefix)                      |
| `{material_path}`               | Material without namespace                             |
| `{material_taggable}`           | Material item/tag (may include `#`)                    |
| `{name}`                        | Crop identifier (from crop definition)                 |
| `{type}`                        | Crop type (lowercase)                                  |
| `{tier}`                        | Crop tier                                              |
| `{seed}`                        | Crop seed item ID                                      |
| `{seed_path}`                   | Seed ID without namespace                              |
| `{fruit}`                       | Crop fruit item ID                                     |
| `{fruit_path}`                  | Fruit ID without namespace                             |
| `{crop_block}`                  | Crop block ID                                          |
| `{crop_block_path}`             | Crop block ID without namespace                        |
| `{result}`                      | Specific material ID (item or first matching tag item) |
| `{result_count.<integer>}`      | Quantity of `{result}` (clamped to stack size)         |
| `{result_path}`                 | Result item ID without namespace                       |
| `{translation_key}`             | Translation key defined in crop                        |
| `{translation.<language_name>}` | Custom translations defined per language               |

**Example Generator File:**

```plaintext
@path=croparia/recipes/example/{name}.json
{
  "type": "minecraft:crafting_shapeless",
  "ingredients": [
    { "item": "{fruit}" }
  ],
  "result": {
    "item": "{result}",
    "count": {result_count.2}
  }
}
```

---

### Step 4: (Optional) Additional Meta Tags

Additional meta tags offer further customization. Always place these tags at the top of your generator files.

- **`@enabled=<true|false>`**  
  Enables or disables the data generator. Default is `true`.

- **`@dependency=<modid>`**  
  Loads the data generator only if the specified mod is present.

- **`@crops=<crop_names>`**  
  Restricts generator to specific crops. Crop names are comma-separated (`example,example2`). Whitespace is allowed.

---

## Frequently Asked Questions (Q&A)

### How do I modify default Data Generators?

Croparia IF only regenerates default data generators when they are missing. Thus, your modifications remain effective if
valid.

To disable a default generator, add or change the meta tag at the top of the file:

```plaintext
@enabled=false
```

---

### How do I modify data for specific crops only?

If you want custom behavior for a few crops without affecting others, consider these two approaches:

- **Using a separate datapack:** Recommended if modifying a small number of crops. Croparia IF-generated data has lowest
  priority and can easily be overridden.
- **Using Data Generator ordering (since Croparia IF 0.2.2):**  
  Croparia IF no longer validates duplicate `@path` tags. It executes generator files in file-system order, followed by
  KubeJS definitions. Thus, you can override data by:
    - Placing your custom generator file **below** the targeted generator file in the directory.
    - Set `@path` identical to the targeted generator file, so that it will override the files.
    - Using `@crops` to limit generator scope.
    - Customizing the template freely—strict adherence to the original template is optional.

---

### Can Data Generators integrate directly with crop definitions (e.g., tags or languages)?

Currently, Data Generators do not support generating integrated definition files such as tags or translations directly.
However, Croparia IF offers predefined tags you can leverage:

- `#croparia:crop_seeds` (all crop seeds)
- `#c:fruits` (all crop fruits & related items)
- `#minecraft:crops` (all crop blocks & related items)

You can manually reference these tags within your own datapack to extend functionality.

---