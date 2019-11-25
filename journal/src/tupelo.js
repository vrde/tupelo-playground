import db from "./db";
import {
  Community,
  ChainTree,
  EcdsaKey,
  setDataTransaction
} from "tupelo-wasm-sdk";

window.Community = Community;
window.ChainTree = ChainTree;
window.EcdsaKey = EcdsaKey;
window.setDataTransaction = setDataTransaction;

async function getKey() {
  if (!db.has("tupelo:privateKey")) {
    const key = await EcdsaKey.generate();
    db.set("tupelo:privateKey", Array.from(key.privateKey));
  }
  const privateKey = new Uint8Array(db.get("tupelo:privateKey"));
  return EcdsaKey.fromBytes(privateKey);
}

export default class Store {
  constructor(key, did) {
    this.key = key;
    this.did = did;
  }

  async init() {
    this.community = await Community.getDefault();
  }

  static async fromKey(key) {
    if (key === undefined) {
      key = await getKey();
    }
    const store = new Store(key);
    await store.init();
    const emptyTree = await ChainTree.newEmptyTree(
      store.community.blockservice,
      key
    );
    const did = await emptyTree.id();
    try {
      const tip = await store.community.getTip(did);
      store.tree = new ChainTree({
        store: store.community.blockservice,
        tip,
        key
      });
    } catch (e) {
      if (e.toString() !== "not found") {
        throw e;
      }
      store.tree = emptyTree;
    }
    store.did = await store.tree.id();
    return store;
  }

  static async fromDID(did) {
    const store = new Store(did);
    await store.init();
    store.tree = new ChainTree({
      store: store.community.blockservice,
      tip: await store.getTip()
    });
    return store;
  }

  async getTip() {
    return await this.community.getTip(this.did);
  }

  async set(path, value) {
    return await this.community.playTransactions(this.tree, [
      setDataTransaction(path, value)
    ]);
  }

  async get(path, fallback) {
    const { remaining, value } = await this.tree.resolve("/tree/data/" + path);
    return value === null ? fallback : value;
  }

  async delete(path) {
    return await this.community.playTransactions(this.tree, [
      setDataTransaction(path, undefined)
    ]);
  }
}

window.Store = Store;
