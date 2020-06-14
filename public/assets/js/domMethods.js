import { formatCurrency } from "./utilities";

const errorEl = document.querySelector(".form .error");
const nameEl = document.querySelector("#t-name");
const amountEl = document.querySelector("#t-amount");
const totalEl = document.querySelector("#total");
const tbody = document.querySelector("#tbody");
const clearButtonEl = document.querySelector(".clear-btn");

const domMethods = {

    populateTotal(transactions) {
        // reduce transaction amounts to a single total value
        let total = transactions.reduce((total, t) => {
            return total + parseInt(t.value);
        }, 0);

        totalEl.textContent = formatCurrency(total);
    },

    populateTable(transactions) {
        tbody.innerHTML = "";

        transactions.forEach(transaction => {
            // create and populate a table row
            let tr = document.createElement("tr");
            let date = new Date(transaction.date);
            tr.innerHTML = `
        <td>${transaction.name}</td>
        <td class="amount">${formatCurrency(transaction.value)}</td>
      `;

            tbody.appendChild(tr);
        });
    },

    validateFormData() {
        if (nameEl.value.trim() === "" || amountEl.value.trim() === "") {
            errorEl.textContent = "Missing Information";
            return false;
        }
        if (!amountEl.checkValidity()) {
            this.showErrorMessage(`Amount: ${amountEl.validationMessage}`);
            return false;
        }
        errorEl.textContent = "";
        return true;
    },

    fetchFormData() {
        return {
            name: nameEl.value.trim(),
            value: parseInt(amountEl.value.trim()),
            date: new Date().toISOString()
        };
    },

    showErrorMessage(message) {
        errorEl.textContent = message;
    },

    clearForm() {
        // clear form
        nameEl.value = "";
        amountEl.value = "";
        errorEl.textContent = "";
    },

    showClearButton() {
        clearButtonEl.style.display = "";
    },

    hideClearButton() {
        clearButtonEl.style.display = "none";
    },
};

export default domMethods;