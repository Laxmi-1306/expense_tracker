const apiUrl = 'http://localhost:8080/expenses';

// Fetch and render all expenses
async function fetchExpenses() {
    const res = await fetch(apiUrl);
    const data = await res.json();
    renderTable(data);
}

// Render table rows
function renderTable(expenses) {
    const tbody = document.querySelector('#expenseTable tbody');
    tbody.innerHTML = '';
    expenses.forEach(exp => {
        const row = document.createElement('tr');
        if (exp.amount > 1000) row.classList.add('high-value');
        row.innerHTML = `
            <td>${exp.id}</td>
            <td>${exp.title}</td>
            <td>${exp.category}</td>
            <td>${exp.amount}</td>
            <td>${exp.expenseDate}</td>
            <td>${exp.paymentMethod}</td>
            <td>
                <button onclick="editExpense(${exp.id})" class="btn btn-sm btn-warning">Edit</button>
                <button onclick="deleteExpense(${exp.id})" class="btn btn-sm btn-danger">Delete</button>
            </td>`;
        tbody.appendChild(row);
    });
}

// Add or Update expense
document.getElementById('expenseForm').addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('expenseId').value;
    const expenseData = {
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        amount: parseFloat(document.getElementById('amount').value),
        expenseDate: document.getElementById('expenseDate').value,
        paymentMethod: document.getElementById('paymentMethod').value
    };
    if (id) {
        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(expenseData)
        });
    } else {
        await fetch(apiUrl, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(expenseData)
        });
    }
    document.getElementById('expenseForm').reset();
    document.getElementById('expenseId').value = '';
    fetchExpenses();
});

// Delete expense
async function deleteExpense(id) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    fetchExpenses();
}

// Edit expense
async function editExpense(id) {
    const res = await fetch(`${apiUrl}/${id}`);
    const exp = await res.json();
    document.getElementById('expenseId').value = exp.id;
    document.getElementById('title').value = exp.title;
    document.getElementById('category').value = exp.category;
    document.getElementById('amount').value = exp.amount;
    document.getElementById('expenseDate').value = exp.expenseDate;
    document.getElementById('paymentMethod').value = exp.paymentMethod;
}

// Search by title
document.getElementById('searchBtn').addEventListener('click', async () => {
    const title = document.getElementById('searchTitle').value;
    const res = await fetch(`${apiUrl}/search?title=${title}`);
    const data = await res.json();
    renderTable(data);
});

// Show all expenses
document.getElementById('showAllBtn').addEventListener('click', fetchExpenses);

// Initial load
fetchExpenses();