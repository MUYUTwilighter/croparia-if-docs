---
title: Tutorial: Repo API
desc: Explica el flujo inicial de la Repo API en Croparia IF, incluyendo la creación de un Repo, su envoltorio en RepoProxy, el registro de ProxyProvider y la consulta de otros sistemas de almacenamiento.
keywords:
  - Croparia IF
  - Repo API
  - Repo
  - RepoProxy
  - ProxyProvider
  - ContainerRepo
  - ItemSpec
  - PlatformItemProxy
  - PlatformFluidProxy
  - interacción de almacenamiento
  - tutorial
modVersions:
  - 1.1.0a
navOrder: 10
---

# Tutorial: Repo API

Esta página recorre la ruta inicial habitual para construir interacción de almacenamiento multiplataforma con Repo API.

## 1. Crear un repositorio de recursos `Repo`

Este paso decide qué tipo de recurso quieres almacenar y cómo debe exponerlo tu almacenamiento.

### 1.1 Repositorio respaldado por vanilla `ContainerRepo<ItemSpec>`

La vía más rápida es apoyarte en el modelo vanilla `Container`. El siguiente fragmento muestra parte de la entidad de bloque del Invernadero:

```java
public class GreenhouseBlockEntity extends BlockEntity implements Container {
    private final NonNullList<ItemStack> inventory; // Vanilla container
    private final ContainerRepo repo = new ContainerRepo<>(this);   // Create a repo
    
    // example of implementing BlockEntity 
    @Override
    protected void loadAdditional(@NonNull ValueInput input) {
        super.loadAdditional(input);
        ContainerHelper.loadAllItems(input, this.inventory);
    }

    @Override
    protected void saveAdditional(@NonNull ValueOutput output) {
        ContainerHelper.saveAllItems(output, this.inventory);
        super.saveAdditional(output);
    }

    // example of implementing Container
    @Override
    public int getContainerSize() {
        return this.inventory.size();
    }

    @Override
    public boolean isEmpty() {
        return this.inventory.stream().allMatch(ItemStack::isEmpty);
    }
    
    // ...
}
```

### 1.2 Repositorio personalizado `Repo<T>`

También puedes implementar tú mismo la interfaz `Repo` para construir exactamente el comportamiento de almacenamiento que necesites.

Métodos básicos de interacción con el almacenamiento:

- `int size`: número de unidades de almacenamiento
- `boolean isEmpty`: si el repositorio, o una unidad concreta, está vacío
- `TypeToken<T> getType`: tipo de recurso del repositorio; consulta la [Resource API](resource.md)
- `T resourceFor`: tipo de recurso almacenado en una ranura
- `long simConsume`: simula la extracción y devuelve la cantidad que realmente se extraería
- `long consume`: extrae recursos y devuelve la cantidad extraída
- `long simAccept`: simula la inserción y devuelve la cantidad que realmente se insertaría
- `long accept`: inserta recursos y devuelve la cantidad realmente insertada
- `long capacityFor`: consulta la capacidad máxima de un recurso o de una unidad de almacenamiento
- `long amountFor`: consulta cuánto de un recurso, o de una unidad de almacenamiento, está almacenado actualmente

Vistas restringidas (llamarlas no modifica el repositorio original):

- `AcceptOnlyRepo<T> asAcceptOnly`: devuelve un envoltorio que permite insertar, pero no extraer
- `ConsumeOnlyRepo<T> asConsumeOnly`: devuelve un envoltorio que permite extraer, pero no insertar
- `LockedRepo<T> asLocked`: devuelve un envoltorio que bloquea unidades de almacenamiento concretas

## 2. Registrar un proxy de repositorio

Para que otros sistemas de almacenamiento puedan interactuar de forma segura con el repo que hemos creado, tenemos que envolverlo en un `RepoProxy`.

```java
public class GreenhouseBlockEntity extends BlockEntity implements Container {
    private final RepoProxy<ItemSpec> proxy = RepoProxy.item(this.repo);
    
    public RepoProxy<ItemSpec> visitItem() {
        return this.proxy;
    }
    
    // ...
}
```

**Nota**: `RepoProxy` es instanciado automáticamente por Croparia IF en cada plataforma soportada. Llamar manualmente a `new RepoProxy<>(...)` no funcionará correctamente en plataformas concretas.

Después, registra el proxy mediante `ProxyProvider` para que otros sistemas de almacenamiento puedan descubrirlo:

```java
public class Greenhouse extends BaseEntityBlock {
    public Greenhouse(Properties settings) {
        super(settings);
        ProxyProvider.registerItem(
            // Query Function
            (world, pos, state, be, direction) -> {
                if (be instanceof GreenhouseBlockEntity gbe) {
                    return gbe.visitItem();
                } else {
                    return null;
                }
            },
            // Blocks
            this
        );
    }
    
    // ...
}
```

Después del registro, la plataforma resuelve primero el tipo de bloque y luego ejecuta la función registrada para obtener el `RepoProxy`.

## 3. Consultar otro repositorio

Puedes usar `ProxyProvider` para buscar cualquier sistema de almacenamiento compatible y recibir un repositorio envuelto con formato `RepoProxy`.

```java
Optional<PlatformItemProxy> itemProxy = ProxyProvider.findItem(world, pos, direction);
Optional<PlatformFluidProxy> fluidProxy = ProxyProvider.findFluid(world, pos, direction);

itemProxy.ifPresent(proxy -> {
    // use proxy as a Repo<ItemSpec>
});
```

**Nota**: debido a las diferencias entre plataformas, algunos métodos de `Repo` pueden comportarse de forma distinta según la implementación. Revisa la documentación Javadoc de `PlatformItemProxy` y `PlatformFluidProxy` para más detalles.
