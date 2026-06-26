// Browser-local persistence for receipts (IndexedDB)

const DB_NAME = "skillsstack-nova";
const STORE_NAME = "receipts";
const DB_VERSION = 1;

function hasIndexedDB() {
  return typeof globalThis.indexedDB !== "undefined";
}

function openDB() {
  if (!hasIndexedDB()) {
    return Promise.reject(new Error("IndexedDB unavailable"));
  }
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

export async function saveReceipt(receipt) {
  if (!hasIndexedDB()) return receipt;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(receipt);
    tx.oncomplete = () => resolve(receipt);
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadReceipts() {
  if (!hasIndexedDB()) return [];
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function clearStoredReceipts() {
  if (!hasIndexedDB()) return;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
