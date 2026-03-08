const apiUrl = 'http://localhost:8080/expenses';

// Fetch and render all expenses
async function fetchExpenses() {
    const res = await fetch(apiUrl);
    const data = await res.json();
    renderTable(data);
    updateTotal(data);
}

// Render table rows with Edit/Delete and highlight high-value
function renderTable(expenses) {
    const tbody = document.getElementById('expenseTable');
    tbody.innerHTML = '';
    expenses.forEach(exp => {
        const row = document.createElement('tr');
        if (exp.amount > 1000) row.classList.add('high-value'); // highlight
        row.innerHTML = `
            <td>${exp.id}</td>
            <td>${exp.title}</td>
            <td>${exp.category}</td>
            <td>₹ ${exp.amount}</td>
            <td>${exp.expenseDate}</td>
            <td>${exp.paymentMethod}</td>
            <td>
                <button onclick="editExpense(${exp.id})" class="btn btn-sm btn-warning me-1">Edit</button>
                <button onclick="deleteExpense(${exp.id})" class="btn btn-sm btn-danger">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update total expense
function updateTotal(expenses) {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    document.getElementById('totalExpense').innerText = `₹ ${total.toFixed(2)}`;
}

// Add / Update expense
document.getElementById('expenseForm').addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('expenseId') ? document.getElementById('expenseId').value : '';
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
        document.getElementById('expenseId').remove();
    } else {
        await fetch(apiUrl, { 
            method: 'POST', 
            headers: {'Content-Type':'application/json'}, 
            body: JSON.stringify(expenseData) 
        });
    }

    document.getElementById('expenseForm').reset();
    fetchExpenses();
});

// Delete expense
async function deleteExpense(id) {
    if (confirm("Are you sure you want to delete this expense?")) {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        fetchExpenses();
    }
}

// Edit expense
async function editExpense(id) {
    const res = await fetch(`${apiUrl}/${id}`);
    const exp = await res.json();
    document.getElementById('title').value = exp.title;
    document.getElementById('category').value = exp.category;
    document.getElementById('amount').value = exp.amount;
    document.getElementById('expenseDate').value = exp.expenseDate;
    document.getElementById('paymentMethod').value = exp.paymentMethod;

    // Add hidden field to track edit
    let hiddenId = document.getElementById('expenseId');
    if (!hiddenId) {
        hiddenId = document.createElement('input');
        hiddenId.type = 'hidden';
        hiddenId.id = 'expenseId';
        hiddenId.value = exp.id;
        document.getElementById('expenseForm').appendChild(hiddenId);
    } else {
        hiddenId.value = exp.id;
    }
}

// Search by title
function searchExpense() {
    const title = document.getElementById('searchTitle').value;
    fetch(`${apiUrl}/search?title=${title}`)
        .then(res => res.json())
        .then(data => renderTable(data));
}

// Logout
function logout() {
    alert("Logged out successfully!");
    window.location.href = "login.html";
}

// Initial load
fetchExpenses();