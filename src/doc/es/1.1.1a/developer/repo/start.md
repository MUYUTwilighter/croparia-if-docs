---
title: Tutorial: Repo API
desc: Introduce el flujo básico de Repo API en Croparia IF, incluyendo la creación de un Repo, su envoltura en RepoProxy, el registro de ProxyProvider y la consulta de otros sistemas de almacenamiento.
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
  - tutorial para desarrolladores
  - 1.1.1a
navOrder: 10
---

# Tutorial: Repo API

Esta página recorre la ruta inicial habitual para implementar interacción de almacenamiento multiplataforma con Repo API.

## 1. Crear un repo de recursos

Este paso decide qué tipo de recurso quieres almacenar y cómo debe exponerlo tu almacenamiento.

### 1.1 Almacenamiento apoyado en vanilla con `ContainerRepo<ItemSpec>`

La ruta más rápida es reutilizar el modelo vanilla `Container`. El siguiente fragmento muestra parte de la block entity del Invernadero:

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

### 1.2 Almacenamiento personalizado con `Repo<T>`

También puedes implementar `Repo` directamente si necesitas un comportamiento más especializado.

Métodos básicos de interacción con almacenamiento:

- `int size`
  - número de unidades de almacenamiento
- `boolean isEmpty`
  - si todo el repo o una ranura está vacía
- `TypeToken<T> getType`
  - tipo de recurso almacenado por este repo; consulta [Resource API](resource.md)
- `T resourceFor`
  - tipo de recurso dentro de una ranura
- `long simConsume`
  - simula extracción y devuelve la cantidad simulada extraída
- `long consume`
  - realiza la extracción y devuelve la cantidad real extraída
- `long simAccept`
  - simula inserción y devuelve la cantidad simulada aceptada
- `long accept`
  - realiza la inserción y devuelve la cantidad real aceptada
- `long capacityFor`
  - consulta la capacidad máxima para un recurso o una ranura
- `long amountFor`
  - consulta la cantidad almacenada de un recurso o una ranura

Vistas con bloqueo (devuelven envoltorios y no mutan el repo original):

- `boolean isAcceptLocked(int i)`
  - si una ranura rechaza inserción
- `boolean isConsumeLocked(int i)`
  - si una ranura rechaza extracción
- `DelegateRepo<T> lockAccept(Integer... idx)`
  - bloquea la inserción en ranuras concretas
- `DelegateRepo<T> lockAccept()`
  - bloquea la inserción en todas las ranuras
- `DelegateRepo<T> lockConsume(Integer... idx)`
  - bloquea la extracción en ranuras concretas
- `DelegateRepo<T> lockConsume()`
  - bloquea la extracción en todas las ranuras
- `DelegateRepo<T> lock(Integer... idx)`
  - bloquea a la vez inserción y extracción en ranuras concretas
- `DelegateRepo<T> lock()`
  - bloquea a la vez inserción y extracción en todas las ranuras
- `DelegateRepo<T> trim()`
  - aplana una cadena de `DelegateRepo` en una sola capa

Un detalle importante:

- el bloqueo solo afecta a `accept` / `simAccept` / `consume` / `simConsume`
- `capacityFor(...)` y `amountFor(...)` siguen devolviendo los valores brutos del repo base
- si el llamador necesita saber tanto "¿se puede insertar aquí?" como "¿cuál es la capacidad de esta ranura?", esas comprobaciones siguen haciéndose por separado

## 2. Registrar un proxy de repo

Para que el repo pueda interactuar con otros sistemas de almacenamiento de forma segura, necesitas envolverlo en un `RepoProxy`.

```java
public class GreenhouseBlockEntity extends BlockEntity implements Container {
    private final RepoProxy<ItemSpec> proxy = RepoProxy.item(this.repo);
    
    public RepoProxy<ItemSpec> visitItem() {
        return this.proxy;
    }
    
    // ...
}
```

**Nota:** `RepoProxy` es instanciado automáticamente por Croparia IF según la plataforma. Escribir manualmente `new RepoProxy<>(...)` no se comportará correctamente en plataformas reales.

En la práctica, un patrón habitual es construir primero una vista bloqueada del repo y solo después envolverla en `RepoProxy`. Por ejemplo, el Transmutador de cultivos exporta vistas separadas de entrada y salida:

```java
private final RepoProxy<ItemSpec> inputProxy = RepoProxy.item(
    repo.lockConsume(INPUT_SLOT, OUTPUT_SLOT).lockAccept(OUTPUT_SLOT).trim()
);
private final RepoProxy<ItemSpec> outputProxy = RepoProxy.item(
    repo.lockAccept(INPUT_SLOT, OUTPUT_SLOT).lockConsume(INPUT_SLOT).trim()
);
```

En términos de comportamiento, esto significa:

- `inputProxy`
  - rechaza extracción de cualquier ranura
  - rechaza inserción en la ranura de salida
  - al final solo permite insertar en la ranura de entrada
- `outputProxy`
  - rechaza inserción en cualquier ranura
  - rechaza extracción desde la ranura de entrada
  - al final solo permite extraer desde la ranura de salida

Una vez existe el proxy, regístralo mediante `ProxyProvider` para que los sistemas externos puedan descubrirlo:

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

Después del registro, la plataforma resuelve primero el tipo de bloque y luego llama a tu función de consulta para obtener el `RepoProxy` correspondiente.

## 3. Consultar otros repos de almacenamiento

Puedes consultar otros sistemas de almacenamiento mediante `ProxyProvider`, que devuelve un envoltorio con estilo `RepoProxy`.

```java
Optional<PlatformItemProxy> itemProxy = ProxyProvider.findItem(world, pos, direction);
Optional<PlatformFluidProxy> fluidProxy = ProxyProvider.findFluid(world, pos, direction);

itemProxy.ifPresent(proxy -> {
    // use proxy as a Repo<ItemSpec>
});
```

**Nota:** como las capacidades de plataforma no son idénticas, algunos métodos de `Repo` no son igual de fiables en todas las implementaciones. Cuando el comportamiento importe, consulta la javadoc de `PlatformItemProxy` y `PlatformFluidProxy`.

