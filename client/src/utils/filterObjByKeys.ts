function filterObjectByKeys<T extends object>(
  obj: T,
  keys: (keyof T)[]
): Partial<T> {
  return keys.reduce((filteredObj, key) => {
    if (key in obj) {
      filteredObj[key] = obj[key];
    }
    return filteredObj;
  }, {} as Partial<T>);
}

export default filterObjectByKeys;
