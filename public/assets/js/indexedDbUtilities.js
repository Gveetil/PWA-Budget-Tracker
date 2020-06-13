
const databaseName = "budgetTracker";
const databaseVersion = 1;
// List of stores used by the Budget Tracker database
const databaseStores = {
  pendingTransactions: "pendingTransactions"
};

const indexedDbUtilities = {
  // The list of stores used by the database 
  databaseStores,

  // Opens the Budget Tracker indexed database and initializes stores
  async openDatabase() {
    return new Promise((resolve, reject) => {

      // Check if browser supports indexed databases
      if (!window.indexedDB) {
        reject("Your browser doesn't support a stable version of IndexedDB.");
        return;
      }

      const request = window.indexedDB.open(databaseName, databaseVersion);

      // Upgrade database if required
      request.onupgradeneeded = function (event) {
        const db = event.target.result;
        for (const storeName in databaseStores) {
          if (!db.objectStoreNames.contains(storeName)) {
            // Store not found, create new store
            db.createObjectStore(storeName, { autoIncrement: true });
          }
        }
      };

      // Error opening database
      request.onerror = function () {
        reject(Error(request.error));
      };

      // Database opened successfully (and upgrades applied as required)
      request.onsuccess = function (event) {
        // Resolve and return the database object
        resolve(event.target.result);
      };
    });
  },

  // Adds a document to the object store.
  async addDocument(database, storeName, document) {
    return new Promise((resolve, reject) => {
      let transaction = database.transaction([storeName], 'readwrite');
      let objectStore = transaction.objectStore(storeName);
      let request = objectStore.add(document);

      // database request error
      request.onerror = function () {
        reject(Error(request.error));
      };

      // database request successful
      request.onsuccess = function () {
        resolve(request.result);
      };
    });
  },

  // Reads all documents from the object store.
  async fetchAllDocuments(database, storeName) {
    return new Promise((resolve, reject) => {
      let transaction = database.transaction([storeName], 'readwrite');
      let objectStore = transaction.objectStore(storeName);
      let request = objectStore.getAll();

      // database request error
      request.onerror = function () {
        reject(Error(request.error));
      };

      // database request successful
      request.onsuccess = function () {
        resolve(request.result);
      };
    });
  },

  // Deletes all documents from the object store.
  async clearDocuments(database, storeName) {
    return new Promise((resolve, reject) => {
      let transaction = database.transaction([storeName], 'readwrite');
      let objectStore = transaction.objectStore(storeName);
      let request = objectStore.clear();

      // database request error
      request.onerror = function () {
        reject(Error(request.error));
      };

      // database request successful
      request.onsuccess = function () {
        resolve(request.result);
      };
    });
  }
}

export default indexedDbUtilities;