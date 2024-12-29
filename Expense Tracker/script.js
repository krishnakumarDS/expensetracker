const balance = document.querySelector("#balance");
const inc_amt = document.querySelector("#inc-amt");
const exp_amt = document.querySelector("#exp-amt");
const description = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const trans = document.querySelector("#trans");
const from = document.querySelector("#form");

// Load transactions from local storage or use an empty array if none exists
let transaction = JSON.parse(localStorage.getItem("transactions")) || [];

// Save transactions to local storage
function saveToLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transaction));
}

function loadTransaction(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "exp" : "Inc");
    item.innerHTML = `
        ${transaction.description}
        <span>${sign} ${Math.abs(transaction.amount)}</span>
        <button class="btn-del" onclick="remove(${transaction.id})">x</button>
    `;
    trans.appendChild(item);
}

function remove(id) {
    if (confirm("Are you sure you want to delete this transaction?")) {
        transaction = transaction.filter((transaction) => transaction.id != id);
        saveToLocalStorage(); // Save the updated list to local storage
        config();
    }
}

function updateAmount() {
    const amounts = transaction.map((transaction) => transaction.amount);

    // Calculate Total Balance
    const total = amounts.reduce((acc, item) => acc + item, 0);
    balance.innerHTML = `&#8377; ${total}`;

    // Calculate Income (Sum of Positive Amounts)
    const income = amounts
        .filter((item) => item > 0)
        .reduce((acc, item) => acc + item, 0);
    inc_amt.innerHTML = `&#8377; ${income}`;

    // Calculate Expenses (Sum of Negative Amounts as Positive)
    const expense = amounts
        .filter((item) => item < 0)
        .reduce((acc, item) => acc + Math.abs(item), 0);
    exp_amt.innerHTML = `&#8377; ${expense}`;
}

function config() {
    trans.innerHTML = "";
    transaction.forEach(loadTransaction);
    updateAmount();
}

function addTransaction(e) {
    e.preventDefault();

    // Retrieve values
    const descValue = description.value.trim();
    const amountValue = +amount.value; // Convert to a number

    // Validate input
    if (!descValue || !amountValue) {
        alert("Please enter both description and a valid amount.");
        return;
    }

    // Create a new transaction object
    const newTransaction = {
        id: transaction.length ? transaction[transaction.length - 1].id + 1 : 1, // Auto-increment ID
        description: descValue,
        amount: amountValue,
    };

    // Add to the transactions array
    transaction.push(newTransaction);

    // Save to local storage
    saveToLocalStorage();

    // Update UI
    config();

    // Clear input fields
    description.value = "";
    amount.value = "";
}

// Attach the event listener to the form
from.addEventListener("submit", addTransaction);

window.addEventListener("load", function () {
    config();
});
