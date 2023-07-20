export default class DblKeyMap<Key, SubKey, Value> {
  private map: Map<Key, Map<SubKey, Value>> = new Map();
  
  get(key: Key): Map<SubKey, Value> | undefined
  get(key: Key, subKey: SubKey): Value
  
  get(key: Key, subKey?: SubKey) {
    const subMap = this.map.get(key);
    if (subMap) {
      if (!subKey) return subMap
      return subMap.get(subKey);
    }
  }

  set(key: Key, subKey: SubKey, value: Value) {
    let subMap = this.map.get(key);
    if (!subMap) {
      subMap = new Map();
      this.map.set(key, subMap);
    }
    subMap?.set(subKey, value);
  }

  forEach(cb: (value: Value, key: Key, subKey: SubKey) => void) {
    this.map.forEach((subMap, key) => {
      subMap.forEach((value, subKey) => {
        cb(value, key, subKey);
      });
    });
  }

  delete(key: Key) {
    this.map.delete(key);
  }

  deleteAll() {
    this.map.forEach((_, key) => {
      this.map.delete(key);
    });
  }
}
