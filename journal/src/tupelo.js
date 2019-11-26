import db from "./db";
import {
  Community,
  ChainTree,
  EcdsaKey,
  Tupelo,
  setOwnershipTransaction,
  setDataTransaction
} from "tupelo-wasm-sdk";

window.Tupelo = Tupelo;
window.Community = Community;
window.ChainTree = ChainTree;
window.EcdsaKey = EcdsaKey;
window.setDataTransaction = setDataTransaction;

const NAMESPACE = "https://vrde.github.io/apps/tojo";

// crypto API is only supported by Firefox and Chrome
async function sha256(s) {
  const msgUint8 = Buffer.from(s);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  return new Uint8Array(hashBuffer);
}

window.sha256 = sha256;

export async function usernameToDid(username) {
  const community = await Community.getDefault();
  const claimHash = await sha256([NAMESPACE, username].join(":"));
  const claimKey = await EcdsaKey.fromBytes(claimHash);
  const claimDid = await Tupelo.ecdsaPubkeyToDid(claimKey.publicKey);
  try {
    const claimTip = await community.getTip(claimDid);
    const currentClaim = new ChainTree({
      store: community.blockservice,
      tip: claimTip
    });
    return (await currentClaim.resolve("/tree/data/owner")).value;
  } catch (e) {
    if (e.toString() !== "not found") {
      throw e;
    }
  }
}

window.usernameToDid = usernameToDid;

export async function loadWasm() {
  // FIXME: find a better way to trigger Wasm loading
  await EcdsaKey.generate();
}

export async function login(username, password) {
  const community = await Community.getDefault();

  const claimHash = await sha256([NAMESPACE, username].join(":"));
  const claimKey = await EcdsaKey.fromBytes(claimHash);
  const claimDid = await Tupelo.ecdsaPubkeyToDid(claimKey.publicKey);

  const userHash = await sha256([NAMESPACE, username, password].join(":"));
  const userKey = await EcdsaKey.fromBytes(userHash);
  const userAddress = await Tupelo.ecdsaPubkeyToAddress(userKey.publicKey);
  const userDid = await Tupelo.ecdsaPubkeyToDid(userKey.publicKey);

  let currentOwner;

  try {
    const claimTip = await community.getTip(claimDid);
    const currentClaim = new ChainTree({
      store: community.blockservice,
      tip: claimTip
    });
    currentOwner = (await currentClaim.resolve("/tree/data/owner")).value;
  } catch (e) {
    if (e.toString() !== "not found") {
      throw e;
    }
  }

  // If the username is free, claim it
  if (!currentOwner) {
    const claimTree = await ChainTree.newEmptyTree(
      community.blockservice,
      claimKey
    );
    await community.playTransactions(claimTree, [
      setDataTransaction("username", username),
      setDataTransaction("owner", userDid),
      setOwnershipTransaction([userAddress])
    ]);
    const userTree = await ChainTree.newEmptyTree(
      community.blockservice,
      userKey
    );
    await community.playTransactions(userTree, [
      setDataTransaction("username", username),
      setDataTransaction("claim", claimDid)
    ]);
  } else if (currentOwner !== userDid) {
    throw "wrong password";
  }

  db.set("tupelo:privateKey", Array.from(userKey.privateKey));
  return userKey;
}

window.login = login;

export async function getKey() {
  if (!db.has("tupelo:privateKey")) {
    return;
    //const key = await EcdsaKey.generate();
    //db.set("tupelo:privateKey", Array.from(key.privateKey));
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
    const store = new Store(null, did);
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

  // doesn't work
  async delete(path) {
    return await this.community.playTransactions(this.tree, [
      setDataTransaction(path, undefined)
    ]);
  }
}

window.Store = Store;
