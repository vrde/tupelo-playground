class DB {
  constructor(storage = localStorage) {
    this.storage = storage;
  }

  get(key, fallback) {
    const value = this.storage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  }

  set(key, valueOrFunction, fallback) {
    let value;
    if (valueOrFunction instanceof Function) {
      const prev = this.get(key, fallback);
      value = valueOrFunction(prev);
    } else {
      value = valueOrFunction;
    }
    this.storage.setItem(key, JSON.stringify(value));
    return value;
  }

  has(key) {
    return this.storage[key] !== undefined;
  }
}

export default new DB();
