---
title: Añadir entradas del generador
desc: Explica cómo añadir nuevos tipos DgEntry y DgRegistry al sistema de generación de datos en tiempo de ejecución de Croparia IF y conectarlos con placeholders personalizados.
keywords:
  - Croparia IF
  - generación de datos en tiempo de ejecución
  - DgEntry
  - DgRegistry
  - Placeholder
  - entrada del generador
  - documentación para desarrolladores
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 10
---

# Añadir entradas del generador

<a id="overview"></a>

Una entrada del generador (`DgEntry`) proporciona valores de datos de plantilla mediante un resolvedor de placeholders (`Placeholder`), y el script del generador la selecciona a través de un conjunto de entradas (`DgRegistry`).

Si quieres añadir tu propio tipo de entrada, normalmente necesitas:

- una clase de entrada personalizada
- un registro correspondiente
- un resolvedor de placeholders
- y, por último, registrar el conjunto para que el sistema del generador pueda descubrirlo

Si todavía no has visto la estructura general, empieza por [Generación de datos en tiempo de ejecución (desarrollador)](index.md#overview). Si prefieres diseñar primero el acceso a campos y conectar las entradas después, también puedes comenzar por [Crear resolvedores de placeholders](placeholder.md#basic-creation).

<a id="create-entry"></a>

## Crear la clase de entrada

```java
public class MyEntry implements DgEntry {
    private final Identifier id;

    @Override
    public Identifier getKey() {
        return this.id;
    }

    @Override
    public boolean shouldLoad() {
        return true;
    }
    
    // ...
}
```

<a id="add-placeholder"></a>

## Conectar un resolvedor de placeholders

El resolvedor de placeholders convierte los datos en tiempo de ejecución de la entrada en valores que pueden rellenar una plantilla.
Consulta [Crear resolvedores de placeholders](placeholder.md#basic-creation) para el diseño completo. Aquí el objetivo es solo mostrar cómo conectarlo a una entrada.

```java
public class MyEntry implements DgEntry {
    public static final Placeholder<MyEntry> PLACEHOLDER = Placeholder.build(node -> node.then(
        PatternKey.literal("example"), TypeMapper.of(MyEntry::getExample), Placeholder.STRING
    ).concat(DgEntry.PLACEHOLDER, TypeMapper.of(myEntry -> myEntry)));
    
    private final String example;
    
    public String getExample() {
        return this.example;
    }
    
    public Placeholder<? extends MyEntry> placeholder() {
        return PLACEHOLDER;
    }
    
    // ...
}
```

**Nota:** si tu clase de entrada extiende otra entrada, no olvides fusionar también el resolvedor del tipo padre. Como mínimo, eso suele significar incluir `DgEntry.PLACEHOLDER`.

<a id="create-registry"></a>

## Crear el registro de entradas

Puedes crear tu propia subclase de `DgRegistry<MyEntry>`, o usar utilidades como `DgRegistry.ofEnum(...)` y `DgRegistry.ofMap(...)`.

Una vez creado, regístralo en la API:

```java
static DgRegistry MY_REGISTRY = DgRegistry.ofMap(Map.of(
    Identifier.of("modid:my_entry_1"), new MyEntry(...),
    Identifier.of("modid:my_entry_2"), new MyEntry(...),
    Identifier.of("modid:my_entry_3"), new MyEntry(...)
    // ...
));
static {
    DgRegistry.register(Identifier.of("modid:my_registry"), MY_REGISTRY);
}
```

Después de eso, el script del generador puede iterar sobre todo el conjunto de entradas simplemente usando el ID de su registro:

```toml
registry = "modid:my_registry"
# ...
```

Cuando la entrada y su registro ya están listos, el siguiente paso habitual es hacer que un [generador de datos personalizado](generator.md#register-generator) los consuma de verdad.

