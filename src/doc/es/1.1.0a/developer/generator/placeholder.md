---
title: Resolvedores de placeholders (desarrollador)
desc: Explica cómo crear instancias de Placeholder y PlaceholderBuilder para el sistema de generación de datos en tiempo de ejecución de Croparia IF, incluyendo puentes, campos de colección y reutilización de resolvedores integrados.
keywords:
  - Croparia IF
  - generación de datos en tiempo de ejecución
  - Placeholder
  - PlaceholderBuilder
  - TypeMapper
  - PatternKey
  - Template
  - DgEntry
  - resolvedor de placeholders
  - documentación para desarrolladores
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 20
---

# Resolvedores de placeholders (desarrollador)

<a id="overview"></a>

El resolvedor de placeholders `Placeholder<T>` se encarga de convertir datos de entrada en tiempo de ejecución en valores utilizables dentro de expresiones de plantilla como `${...}`.
Se parece a un `Codec` en un sentido: ambos describen la estructura de campos y luego delegan la lectura real a lógica de ejecución. La diferencia es que `Codec` se orienta a serialización, mientras que `Placeholder` se orienta al parseo de plantillas.

Dentro del sistema de generación de datos en tiempo de ejecución:

- `Template` analiza `${...}`
- `Placeholder` explica cómo debe resolverse cada acceso a campo dentro de `${...}`
- `DgEntry` expone su resolvedor a través de `placeholder()`

Esta página se centra en cómo construir resolvedores de placeholders personalizados para nuevos tipos de entrada.

<a id="basic-creation"></a>

## Creación básica

En la práctica, normalmente no se escribe `new Placeholder<>(...)` a mano. El patrón habitual es usar `Placeholder.build(...)` junto con `PlaceholderBuilder`:

```java
public class MyEntry implements DgEntry {
    public static final Placeholder<MyEntry> PLACEHOLDER = Placeholder.build(builder -> builder
        .self(TypeMapper.of(MyEntry::getId), Placeholder.ID)
        .then(PatternKey.literal("example"), TypeMapper.of(MyEntry::getExample), Placeholder.STRING)
        .then(PatternKey.literal("tier"), TypeMapper.of(MyEntry::getTier), Placeholder.NUMBER)
    );

    private final Identifier id;
    private final String example;
    private final int tier;

    public Identifier getId() {
        return this.id;
    }

    public String getExample() {
        return this.example;
    }

    public int getTier() {
        return this.tier;
    }

    @Override
    public Placeholder<? extends MyEntry> placeholder() {
        return PLACEHOLDER;
    }
}
```

Ese ejemplo define tres puntos de entrada habituales:

- `self(...)`
  - define cómo se comporta el objeto actual cuando la ruta del placeholder está vacía
  - en este caso enlaza `MyEntry` con `Identifier`, por lo que la ruta vacía se resuelve a través del placeholder de `Identifier`; si además quieres `${id}` de forma explícita, todavía tienes que registrar `id` con `then(...)`
- `then(...)`
  - define un campo hijo y lo enlaza con otro resolvedor de placeholders
  - aquí `${example}` usa `Placeholder.STRING`, y `${tier}` usa `Placeholder.NUMBER`
- `TypeMapper.of(...)`
  - mapea manualmente el tipo actual hacia un tipo destino
  - este es el estilo más común, sobre todo porque la inferencia genérica de Java suele quedarse corta

Una vez que el resolvedor existe, el siguiente paso habitual es conectarlo a una entrada del generador. Consulta [Añadir entradas del generador](entry.md).

<a id="builder-methods"></a>

## Métodos comunes de `PlaceholderBuilder`

`PlaceholderBuilder<T>` es la herramienta más importante a la hora de ampliar resolvedores. Estos métodos son los que más suelen aparecer:

- `self(RegexParser<T>)`
  - define directamente cómo se resuelve el objeto actual desde la ruta vacía
- `self(TypeMapper<T, F>, Placeholder<F>)`
  - enlaza el objeto actual con otro tipo de placeholder; suele ser mucho más cómodo que escribir un `RegexParser` completo a mano
- `then(Pattern key, TypeMapper<T, O>, Placeholder<O>)`
  - registra un campo hijo
  - este es el punto de extensión más común
- `then(Pattern key, TypeMapper<T, O>, Codec<O>)`
  - codifica un campo hijo como JSON y lo devuelve como resultado del placeholder
  - resulta útil cuando el campo ya tiene un buen codec y no necesitas más comportamiento anidado de placeholders
- `thenMap(...)`
  - registra rápidamente un campo como subdominio tipo mapa
  - obtiene automáticamente utilidades como `get(...)`, `keys()`, `values()`, `mapValue(...)` y `mapKey(...)`
- `thenList(...)`
  - registra rápidamente un campo como subdominio tipo lista
  - obtiene automáticamente utilidades como `get(...)`, `getOr(...)`, `map(...)` y `mapi(...)`
- `concat(...)`
  - fusiona otro resolvedor existente, conservando las claves locales ya definidas cuando hay solapamientos
- `overwrite(...)`
  - parecido a `concat(...)`, pero reemplaza las claves ya existentes cuando se solapan
- `remove(...)`
  - elimina una clave
- `map(...)`
  - transforma todo el builder hacia otro tipo de destino

Para muchos tipos de entrada, `self(...) + then(...) + concat(...)` ya cubre casi todo.

<a id="bridge-existing"></a>

## Enlazar con resolvedores existentes

El patrón más mantenible suele ser enlazar con resolvedores de placeholders ya existentes en lugar de reconstruir todos los campos desde cero.

Por ejemplo, imagina que una entrada contiene un `Identifier`, un `ItemOutput` y un `DataComponentPatch`:

```java
public static final Placeholder<MyEntry> PLACEHOLDER = Placeholder.build(builder -> builder
    .then(PatternKey.literal("id"), TypeMapper.of(MyEntry::getId), Placeholder.ID)
    .then(PatternKey.literal("result"), TypeMapper.of(MyEntry::getResult), Placeholder.ITEM_OUTPUT)
    .then(PatternKey.literal("components"), TypeMapper.of(MyEntry::getComponents), Placeholder.DATA_COMPONENTS)
);
```

Esto resulta útil porque:

- no necesitas reconstruir tú mismo subcampos como `${id.namespace}` y `${id.path}`
- reutilizas automáticamente todos los métodos que el resolvedor integrado ya ofrece
- si el resolvedor integrado crece más adelante, tu entrada suele beneficiarse sin trabajo adicional

Ese también es uno de los estilos de implementación más comunes dentro de la Generator API.

<a id="map-list-fields"></a>

## Campos tipo lista y tipo mapa

Si tu entrada incluye campos de colección, normalmente es mejor no escribir a mano utilidades como `get(...)`. Usa directamente `thenMap(...)` o `thenList(...)`.

Por ejemplo, supongamos que una entrada contiene un mapa de traducciones:

```java
public static final Placeholder<MyEntry> PLACEHOLDER = Placeholder.build(builder -> builder
    .thenMap(PatternKey.literal("translations"), TypeMapper.of(entry -> MapReader.map(entry.getTranslations())), Placeholder.STRING)
);
```

Eso hace disponibles inmediatamente estas formas de plantilla:

```text
${translations.get(en_us)}
${translations.keys().get(0)}
${translations.values()}
```

Si en cambio es un campo de lista:

```java
public static final Placeholder<MyEntry> PLACEHOLDER = Placeholder.build(builder -> builder
    .thenList(PatternKey.literal("drops"), TypeMapper.of(entry -> ListReader.list(entry.getDrops())), Placeholder.ITEM_OUTPUT)
);
```

Entonces la plantilla puede hacer:

```text
${drops.get(0).id}
${drops._size}
${drops.map(id)}
```

Estas capacidades no vienen de `Template` en sí. Se añaden automáticamente mediante `PlaceholderBuilder.ofMap(...)` y `ofList(...)`.

<a id="extend-existing"></a>

## Ampliar resolvedores existentes

Si tu entrada extiende otro tipo de entrada, o si solo quieres añadir unos pocos campos sobre un resolvedor ya existente, `concat(...)` suele ser la vía más cómoda.

Por ejemplo:

```java
public class MyEntry implements DgEntry {
    public static final Placeholder<MyEntry> PLACEHOLDER = Placeholder.build(builder -> builder
        .then(PatternKey.literal("example"), TypeMapper.of(MyEntry::getExample), Placeholder.STRING)
        .concat(DgEntry.PLACEHOLDER, TypeMapper.of(entry -> entry))
    );

    // ...
}
```

Eso significa:

- primero declarar `${example}` como campo propio
- después fusionar los campos existentes de `DgEntry`

Si necesitas reemplazar campos heredados en lugar de solo añadir nuevos, cambia a `overwrite(...)`:

```java
public static final Placeholder<MyEntry> PLACEHOLDER = Placeholder.build(builder -> builder
    .overwrite(ParentEntry.PLACEHOLDER, TypeMapper.of(entry -> entry))
    .then(PatternKey.literal("name"), TypeMapper.of(MyEntry::getLocalizedName), Placeholder.STRING)
);
```

Como regla práctica:

- usa `concat(...)` cuando solo añades campos
- usa `overwrite(...)` cuando necesitas cambiar comportamiento heredado

<a id="builtins"></a>

## Resolvedores integrados que puedes reutilizar directamente

Los resolvedores integrados más reutilizados en el código actual incluyen:

- `Placeholder.STRING`
  - valores de texto
- `Placeholder.NUMBER`
  - valores numéricos
- `Placeholder.BOOLEAN`
  - valores booleanos
- `Placeholder.JSON`
  - valores JSON arbitrarios
- `Placeholder.JSON_OBJECT`
  - objetos JSON
- `Placeholder.JSON_ARRAY`
  - arrays JSON
- `Placeholder.ID`
  - `Identifier`
- `Placeholder.DATA_COMPONENTS`
  - `DataComponentPatch`
- `Placeholder.ITEM_OUTPUT`
  - `ItemOutput`
- `Placeholder.BLOCK_OUTPUT`
  - `BlockOutput`
- `Placeholder.ITEM`
  - `Item`
- `Placeholder.ITEM_STACK`
  - `ItemStack`
- `Placeholder.BLOCK`
  - `Block`
- `Placeholder.BLOCK_STATE`
  - `BlockState`

Algunos subcampos comunes incluyen:

- `Placeholder.ID`
  - `${id}`
  - `${id.namespace}`
  - `${id.path}`
- `Placeholder.ITEM_OUTPUT`
  - `${result.id}`
  - `${result.amount}`
  - `${result.components}`
  - `${result.stack}`
- `Placeholder.BLOCK_OUTPUT`
  - `${block.id}`
  - `${block.properties}`

Cuando quieras exponer datos a autores de modpacks, normalmente conviene enlazar primero con estos integrados en lugar de inventar una sintaxis aparte.

Una vez terminado el resolvedor, el siguiente paso normal es conectarlo a una [entrada del generador](entry.md#add-placeholder), o utilizarlo más adelante desde un [generador de datos personalizado](generator.md#register-generator).

