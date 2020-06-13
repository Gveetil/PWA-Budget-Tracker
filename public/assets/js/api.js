
const API = {
    async fetchTransactions() {
        try {
            const response = await fetch("/api/transaction");

            return await response.json();

        } catch (error) {
            console.log(error);
            return false;
        }
    },
    async newTransaction(transaction) {
        try {
            const response = await fetch("/api/transaction", {
                method: "POST",
                body: JSON.stringify(transaction),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            });

            return await response.json();

        } catch (error) {
            console.log(error);
            return false;
        }
    },
    async bulkInsertData(data) {
        try {
            const response = await fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            });

            return await response.json();

        } catch (error) {
            console.log(error);
            return false;
        }
    },
};

export default API;