export default interface Material {
  name: string;
  components: {
    [key: string]: any;
  }
}

export function parseMaterial(name: string, components: Iterable<{key: string, value: any}>): string | Material {
  const parsed = {};
  for (const component of components) {
    const key = component.key.trim();
    const value = component.value.trim();
    if (key.length === 0) continue;
    if (value.length === 0) continue;
    try {
      parsed[component.key] = JSON.parse(component.value);
    } catch (e) {
      parsed[component.key] = component.value;
    }
  }
  if (Object.keys(parsed).length === 0) {
    return name;
  } else {
    return {
      name,
      components: parsed
    }
  }
}