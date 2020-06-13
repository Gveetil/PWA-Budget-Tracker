import indexedDbUtilities from "./indexedDbUtilities";

let currentDb = null;

const transactionsIDBStore = {
    // Open the Pending Transactions database store
    async open() {
        // Open database when accessed for the first time
        if (!currentDb) {
            currentDb = await indexedDbUtilities.openDatabase();
            currentDb.addEventListener('close', () => {
                // Database closed unexpectedly - e.g. clearing web cache
                console.log('Indexed Database connection closed!');
                currentDb = null;
            });
        }
    },

    // Add a transaction to the Pending Transactions database store
    async addPendingTransaction(data) {
        await transactionsIDBStore.open();
        return await indexedDbUtilities.addDocument(currentDb,
            indexedDbUtilities.databaseStores.pendingTransactions,
            data);
    },

    // Fetches all transactions from the Pending Transactions database store
    async fetchPendingTransactions() {
        await transactionsIDBStore.open();
        return await indexedDbUtilities.fetchAllDocuments(currentDb,
            indexedDbUtilities.databaseStores.pendingTransactions);
    },

    // Clears the Pending Transactions from the database store
    async clearPendingTransactions() {
        await transactionsIDBStore.open();
        return await indexedDbUtilities.clearDocuments(currentDb,
            indexedDbUtilities.databaseStores.pendingTransactions);
    }
}

export default transactionsIDBStore;