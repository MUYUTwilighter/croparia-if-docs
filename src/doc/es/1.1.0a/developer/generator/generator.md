---
title: Generadores de datos personalizados
desc: Explica cómo ampliar el sistema de generación de datos en tiempo de ejecución de Croparia IF con tipos DataGenerator personalizados, incluyendo control de flujo, uso de PackCache y registro de codecs.
keywords:
  - Croparia IF
  - generación de datos en tiempo de ejecución
  - DataGenerator
  - AggregatedGenerator
  - LangGenerator
  - PackHandler
  - PackCache
  - CodecUtil.extend
  - generador de datos personalizado
  - documentación para desarrolladores
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 30
---

# Generadores de datos personalizados

<a id="overview"></a>

Desde la perspectiva del desarrollador, `DataGenerator` es el objeto de tiempo de ejecución que hay detrás de un script de generación, y también el trabajador directo que ejecuta la generación de datos.

Croparia IF incluye tres tipos de generador integrados:

- `DataGenerator` (por defecto)
- `AggregatedGenerator`
- `LangGenerator`

Esta página se centra en cómo añadir un nuevo tipo de generador propio.

<a id="create-generator-class"></a>

## 1. Crear la clase del generador

Los tipos de generador personalizados deben extender `DataGenerator`:

```java
public class MyDataGenerator extends DataGenerator {
    private final Template content;

    public MyDataGenerator(
        boolean enabled, boolean startup, List<Identifier> whitelist,
        Template path, DgRegistry<? extends DgEntry> registry,
        Template content, Template template
    ) {
        super(enabled, startup, whitelist, path, registry, template);
        this.content = content;
    }

    public Template getContent() {
        return this.content;
    }
}
```

La clase padre `DataGenerator` ya proporciona la mayoría de campos comunes:

- `enabled`
  - si el generador está activo o no
  - `generate(PackHandler)` comprueba esto primero y omite todo el generador si vale `false`
- `startup`
  - si la generación puede ejecutarse antes de que el servidor dedicado haya terminado de arrancar
  - cuando vale `false`, la generación espera hasta que `CropariaIf.isServerStarted()` sea `true`
- `whitelist`
  - restringe qué entradas se recorren
  - si está vacía, se recorre todo el `registry`; si no, solo se consultan directamente los `Identifier` listados
- `path`
  - la plantilla de ruta de salida
  - `getPath(DgEntry)` la resuelve como ruta relativa final
- `registry`
  - el conjunto de entradas usado por este generador
  - `generate(PackHandler)` itera desde aquí
- `template`
  - la plantilla de contenido por defecto
  - para un `DataGenerator` normal, esa misma plantilla es el contenido final de cada archivo

Si tu generador necesita campos propios adicionales, como contenido agregado o plantillas secundarias especiales, añádelos en la subclase igual que se añade `content` arriba.

<a id="flow-control"></a>

## 2. Personalizar el flujo de generación

El flujo por defecto de `DataGenerator` es bastante pequeño:

1. `generate(PackHandler pack)`
2. comprobar `enabled`
3. comprobar `startup` frente al estado actual del servidor
4. decidir si se recorre todo el `registry` o solo la `whitelist`
5. llamar a `generate(DgEntry entry, PackHandler pack)` para cada entrada

Los puntos de extensión más habituales son:

- `protected void generate(DgEntry entry, PackHandler pack)`
  - la lógica central de generación por entrada
  - la implementación por defecto escribe `getPath(entry)` y `getTemplate(entry)` directamente en `PackHandler.cache(...)`
  - sobrescríbelo cuando necesites agregación, preprocesado o saltos condicionales
- `public String getTemplate(DgEntry entry)`
  - por defecto es `this.getTemplate().parse(entry)`
  - sobrescríbelo si la plantilla real de contenido no sale directamente del campo `template` heredado
- `public void onGenerated(PackHandler pack)`
  - `PackHandler.onGenerated()` lo llama después de que todos los generadores terminan su fase normal `generate(...)`
  - es un buen sitio para fusionar resultados intermedios en texto final
- `public void onDumped(PackHandler pack)`
  - se llama después de que los datos en caché ya se han escrito al sistema de archivos
  - sirve bien para logs, limpieza o posprocesado

Si tu generador sigue el patrón "una entrada se convierte en un archivo", normalmente basta con sobrescribir `generate(DgEntry entry, PackHandler pack)`.
Si tu generador necesita recopilar varias entradas antes de escribir, `onGenerated(PackHandler pack)` pasa a ser el gancho principal.

<a id="pack-cache"></a>

### Caché del pack generado

Cuando un generador entrega datos al `PackHandler`, el manejador los guarda primero en caché. Solo después de que todos los generadores terminen, se vuelcan finalmente a archivos.

Antes de que termine todo el proceso, los generadores pueden inspeccionar y modificar ese estado en caché. Así es como `AggregatedGenerator` implementa la agregación de datos.

```java
public class AggregatedGenerator extends DataGenerator {
    @Override
    protected void generate(DgEntry entry, PackHandler pack) {
        String path = this.getPath(entry);
        @SuppressWarnings("unchecked")
        Collection<Object> cache = pack.occupy(this, path).map(value -> {
            if (value instanceof Collection<?> collection) {
                return (Collection<Object>) collection;
            } else {
                return null;
            }
        }).orElseGet(() -> pack.cache(path, new ArrayList<>(), this));
        cache.add(this.getContent(entry));
    }

    @Override
    public void onGenerated(PackHandler handler) {
        List<PackCacheEntry<?>> caches = List.copyOf(handler.getAll(this));
        for (PackCacheEntry<?> entry : caches) {
            StringBuilder builder = new StringBuilder();
            if (entry.value() instanceof Collection<?> collection) {
                for (Object s : collection) {
                    builder.append(s).append(",\n");
                }
            }
            String content = builder.isEmpty() ? "" : builder.substring(0, builder.length() - 2);
            handler.cache(entry.path(), this.getTemplate().parse(content, CONTENT_PLACEHOLDER), this);
        }
    }
    
    // ...
}
```

Este comportamiento lo controla `PackCache`. En la práctica, estos métodos son los que más importan:

- `cache(path, value, owner)`
  - escribe una entrada en caché por ruta
  - si esa ruta ya existe, el valor anterior se sobreescribe y la propiedad pasa al nuevo `owner`
- `occupy(querier, path)`
  - lee el valor en caché de una ruta
  - si antes pertenecía a otro generador, la propiedad se transfiere al `querier` actual
  - `AggregatedGenerator` lo usa para apropiarse de colecciones compartidas por la misma ruta de salida
- `getAll(querier)`
  - devuelve todas las entradas de caché que pertenecen actualmente a ese generador
  - resulta especialmente útil durante `onGenerated(...)` cuando quieres reconstruir salidas finales en bloque

Conviene pensar en `PackCache` como un espacio de trabajo indexado por ruta y con propiedad explícita.
Para un generador normal, normalmente solo llamas una vez a `cache(...)`. Para un generador agregado, se comporta mucho más como un área temporal que puede recuperarse y reescribirse.

<a id="register-generator"></a>

## 3. Registrarlo

Necesitas un `MapCodec<MyDataGenerator>` para que el pack handler sepa cómo convertir un script de generador ya parseado en tu objeto de generador de tiempo de ejecución.

Para evitar reescribir todo el codec padre, el patrón más habitual es usar `CodecUtil.extend(...)` de Croparia IF:

```java
public class MyDataGenerator extends DataGenerator {
    public static final MapCodec<MyDataGenerator> CODEC = CodecUtil.extend(
        DataGenerator.CODEC,
        Template.CODEC.fieldOf("content").forGetter(MyDataGenerator::getContent),
        (base, content) -> new MyDataGenerator(
            base.isEnabled(), base.isStartup(), base.getWhitelist(),
            base.getPath(), base.getRegistry(), content, base.getTemplate()
        )
    );

    public static final Identifier TYPE = Identifier.of("modid:my_data_generator");

    @Override
    public Identifier getType() {
        return TYPE;
    }

    // ...
}
```

Eso significa:

- primero reutilizar `DataGenerator.CODEC` para todos los campos heredados
- luego añadir el campo `content` específico de la subclase
- y por último reconstruir el nuevo objeto a partir de los datos base parseados más el campo adicional

Si tu subclase no añade campos nuevos, puede bastar con un simple `xmap(...)` sobre `DataGenerator.CODEC`. `CodecUtil.extend(...)` resulta más útil cuando realmente amplías la forma de los datos.

Una vez que tengas el codec, regístralo:

```java
static {
    DataGenerator.register(Identifier.of("modid:my_data_generator"), CODEC);
}
```

Y después el script ya podrá usarlo:

```toml
type = "modid:my_data_generator"
# ...
```

Si tu generador también depende de acceso adicional a campos, las siguientes piezas de apoyo suelen ser un [resolvedor de placeholders](placeholder.md#bridge-existing) y una o varias [entradas del generador](entry.md#create-entry).

