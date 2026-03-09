const API = "http://localhost:8080";
const userId = localStorage.getItem("userId");

/* ================= LOGIN ================= */
if (document.getElementById("loginForm")) {
    document.getElementById("loginForm").addEventListener("submit", async function(e){
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const res = await fetch(API + "/auth/login",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({email,password})
        });

        const data = await res.text();
        if(data !== "FAIL"){
            localStorage.setItem("loggedIn","true");
            localStorage.setItem("userId",data);
            window.location.href="dashboard.html";
        } else {
            alert("Invalid Login");
        }
    });
}

/* ================= REGISTER ================= */
if(document.getElementById("registerForm")){
    document.getElementById("registerForm").addEventListener("submit", async function(e){
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const res = await fetch(API + "/auth/register",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({name,email,password})
        });

        const data = await res.text();
        if(data === "SUCCESS"){
            alert("Registration Successful");
            window.location.href="login.html";
        } else {
            alert("Email already exists");
        }
    });
}

/* ================= DASHBOARD SECURITY ================= */
if(window.location.pathname.includes("dashboard")){
    if(!localStorage.getItem("loggedIn")){
        window.location.href="login.html";
    }
}

/* ================= FETCH EXPENSES (optional title search) ================= */
async function fetchExpenses(title = ""){
    if(!document.getElementById("expenseTable")) return;

    let url = `${API}/expenses?userId=${userId}`;
    if(title.trim() !== ""){
        url += `&title=${encodeURIComponent(title.trim())}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    renderTable(data);
    updateTotal(data);
}

/* ================= RENDER TABLE ================= */
function renderTable(expenses){
    const tbody = document.getElementById("expenseTable");
    tbody.innerHTML = "";

    expenses.forEach(exp=>{
        const row = document.createElement("tr");
        if(exp.amount > 1000) row.classList.add("high-value");

        row.innerHTML = `
            <td>${exp.id}</td>
            <td>${exp.title}</td>
            <td>${exp.category}</td>
            <td>₹ ${exp.amount}</td>
            <td>${exp.expenseDate}</td>
            <td>${exp.paymentMethod}</td>
            <td>
                <button onclick="editExpense(${exp.id})" class="btn btn-warning btn-sm">Edit</button>
                <button onclick="deleteExpense(${exp.id})" class="btn btn-danger btn-sm">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/* ================= TOTAL ================= */
function updateTotal(expenses){
    const total = expenses.reduce((sum,e)=>sum + e.amount,0);
    const totalEl = document.getElementById("totalExpense");
    if(totalEl) totalEl.innerText = "₹ " + total;
}

/* ================= ADD / UPDATE ================= */
if(document.getElementById("expenseForm")){
    document.getElementById("expenseForm").addEventListener("submit", async e=>{
        e.preventDefault();

        const id = document.getElementById("expenseId").value;
        const expenseData = {
            title:document.getElementById("title").value,
            category:document.getElementById("category").value,
            amount:parseFloat(document.getElementById("amount").value),
            expenseDate:document.getElementById("expenseDate").value,
            paymentMethod:document.getElementById("paymentMethod").value,
            user:{id:userId}
        };

        if(id){
            await fetch(`${API}/expenses/${id}`,{
                method:"PUT",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(expenseData)
            });
        } else {
            await fetch(`${API}/expenses`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(expenseData)
            });
        }

        document.getElementById("expenseForm").reset();
        document.getElementById("expenseId").value = "";
        fetchExpenses();
    });
}

/* ================= DELETE ================= */
async function deleteExpense(id){
    await fetch(`${API}/expenses/${id}`,{ method:"DELETE" });
    fetchExpenses();
}

/* ================= EDIT ================= */
async function editExpense(id){
    const res = await fetch(`${API}/expenses/${id}`);
    const exp = await res.json();

    document.getElementById("expenseId").value = exp.id;
    document.getElementById("title").value = exp.title;
    document.getElementById("category").value = exp.category;
    document.getElementById("amount").value = exp.amount;
    document.getElementById("expenseDate").value = exp.expenseDate;
    document.getElementById("paymentMethod").value = exp.paymentMethod;
}

/* ================= SEARCH ================= */
function searchExpense(){
    const title = document.getElementById("searchTitle").value;
    fetchExpenses(title);
}

/* ================= SHOW ALL ================= */
document.getElementById("showAllBtn").addEventListener("click", ()=>{
    document.getElementById("searchTitle").value = "";
    fetchExpenses();
});

/* ================= LOGOUT ================= */
function logout(){
    localStorage.clear();
    window.location.href="login.html";
}

/* ================= INITIAL LOAD ================= */
fetchExpenses();