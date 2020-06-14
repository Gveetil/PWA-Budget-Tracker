import "@babel/polyfill";
import transactionsIDBStore from "./transactionsIDBStore";
import transactionChart from "./transactionChart";
import domMethods from "./domMethods";
import API from "./api";

async function loadTransactions() {
  try {
    let allTransactions = [];

    // Load database transactions - online
    const databaseTransactions = await API.fetchTransactions();
    if (databaseTransactions && databaseTransactions.length > 0) {
      allTransactions = databaseTransactions;
    }

    // Append pending offline transactions, if any
    const pendingTransactions = await transactionsIDBStore.fetchPendingTransactions();
    if (pendingTransactions && pendingTransactions.length > 0) {
      allTransactions = [...pendingTransactions.reverse(), ...allTransactions];
    }

    renderTransactions(allTransactions);
  } catch (error) {
    console.log(error.message);
  }
}

async function sendTransaction(isAdding) {
  try {
    if (domMethods.validateFormData()) {

      const transaction = domMethods.fetchFormData();

      // if subtracting funds, convert amount to negative number
      if (!isAdding) {
        transaction.value *= -1;
      }

      if (await createTransaction(transaction)) {
        // Create successful, Update UI and fetch all transactions 
        domMethods.clearForm();
        await loadTransactions();
      }
      else {
        domMethods.showErrorMessage("Incorrect Data!");
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

function renderTransactions(data) {
  transactionChart.populate(data);
  domMethods.populateTable(data);
  domMethods.populateTotal(data);
}

async function createTransaction(transaction) {

  if (navigator.onLine) {
    // Online mode - attempt to create record
    const data = await API.newTransaction(transaction);
    if (data) {
      // Data errors 
      if (data.errors)
        return false;

      // Create successful 
      return true;
    }
    else {
      // create failed, so save in indexed db
      await transactionsIDBStore.addPendingTransaction(transaction);
      return true;
    }
  }

  // Offline mode - so save in indexed db
  await transactionsIDBStore.addPendingTransaction(transaction);
  return true;
}

document.querySelector("#add-btn").onclick = function () {
  event.preventDefault();
  sendTransaction(true);
};

document.querySelector("#sub-btn").onclick = function () {
  event.preventDefault();
  sendTransaction(false);
};

async function processPendingTransactions() {
  try {
    const pendingTransactions = await transactionsIDBStore.fetchPendingTransactions();
    if (pendingTransactions.length > 0) {
      const result = await API.bulkInsertData(pendingTransactions);
      await transactionsIDBStore.clearPendingTransactions();
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function initialize() {
  try {
    if (navigator.onLine) {
      // If app is online, save pending transactions from db
      await processPendingTransactions();
    }

    await loadTransactions();

  }
  catch (error) {
    console.log(`Error Initializing: ${error.message}`);
  }
}

// listen for app coming back online
window.addEventListener("online", processPendingTransactions);
window.addEventListener('load', initialize);

// re-load transactions on registration of a new controller
navigator.serviceWorker.addEventListener('controllerchange', loadTransactions);