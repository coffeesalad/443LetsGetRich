import React, { useState } from "react";
import CalendarComponent from "./components/CalendarComponent";
import ExpenseForm from "./components/ExpenseForm";
import PieChartComponent from "./components/PieChartComponent";
import LineChartComponent from "./components/LineChartComponent";
import CategoryForm from "./components/CategoryForm";
import BudgetProgress from "./components/BudgetProgress";
import TransactionList from "./components/TransactionList";
import Login from "./components/Login";
import { v4 as uuidv4 } from "uuid";

const initialCategories = [
    { name: "Books", budget: 200 },
    { name: "Food", budget: 500 },
    { name: "Rent", budget: 1000 },
    { name: "Entertainment", budget: 300 },
    { name: "Utilities", budget: 150 }
];

function App() {
    const [user, setUser] = useState(null);

    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState(initialCategories);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // ---------------- AUTH ----------------

    const handleLogin = (email, password) => {
        const storedUser = JSON.parse(localStorage.getItem(email));

        if (storedUser && storedUser.password === password) {
            setUser(storedUser);
        } else {
            alert("Invalid login credentials");
        }
    };

    const handleSignup = (name, email, password) => {
        const existingUser = localStorage.getItem(email);

        if (existingUser) {
            alert("Account already exists");
            return;
        }

        const newUser = { name, email, password };

        localStorage.setItem(email, JSON.stringify(newUser));
        setUser(newUser);

        alert("Account created successfully!");
    };

    const handleLogout = () => {
        setUser(null);
    };

    // ---------------- EXPENSE LOGIC ----------------

    const addExpense = (category, amount) => {
        if (!selectedDate) return;

        const newExpense = {
            id: uuidv4(),
            category,
            amount: parseFloat(amount),
            date: selectedDate
        };

        setExpenses([...expenses, newExpense]);
    };

    const deleteTransaction = (id) => {
        setExpenses(expenses.filter(exp => exp.id !== id));
    };

    const addCategory = (name, budget) => {
        if (categories.find(cat => cat.name === name)) return;
        setCategories([...categories, { name, budget }]);
    };

    const updateBudget = (categoryName, newBudget) => {
        setCategories(categories.map(cat =>
            cat.name === categoryName
                ? { ...cat, budget: newBudget }
                : cat
        ));
    };

    const deleteCategory = (categoryName) => {
        setCategories(categories.filter(cat => cat.name !== categoryName));
        setExpenses(expenses.filter(exp => exp.category !== categoryName));
    };

    const resetMonth = () => {
        const currentMonth = new Date().getMonth();
        setExpenses(
            expenses.filter(
                exp => new Date(exp.date).getMonth() !== currentMonth
            )
        );
    };

    // ---------------- DERIVED DATA ----------------

    const categoryTotals = categories.map(cat => {
        const totalSpent = expenses
            .filter(exp => exp.category === cat.name)
            .reduce((sum, exp) => sum + exp.amount, 0);

        const percentUsed =
            cat.budget > 0 ? (totalSpent / cat.budget) * 100 : 0;

        return {
            ...cat,
            totalSpent,
            percentUsed
        };
    });

    return (
        <div style={{ fontFamily: "Arial", minHeight: "100vh", background: "#f5f7fa" }}>

            {/* 🔒 LOGIN OVERLAY */}
            {!user && (
                <div style={overlayStyle}>
                    <div style={modalStyle}>
                        <Login
                            handleLogin={handleLogin}
                            handleSignup={handleSignup}
                        />
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div style={headerStyle}>
                <h1 style={{ margin: 0 }}>💰 Budget Dashboard</h1>

                {user && (
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "14px" }}>
                            Logged in as: <b>{user.name}</b>
                        </span>

                        <button onClick={handleLogout} style={logoutBtn}>
                            Logout
                        </button>
                    </div>
                )}
            </div>

            {/* DASHBOARD */}
            <div style={{ padding: "20px" }}>
                <CalendarComponent
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />

                <ExpenseForm
                    categories={categories}
                    addExpense={addExpense}
                    selectedDate={selectedDate}
                />

                <CategoryForm addCategory={addCategory} />

                <h2>Category Alerts</h2>
                {categoryTotals.map(cat =>
                    cat.percentUsed >= 85 ? (
                        <div key={cat.name} style={{ color: "red" }}>
                            ⚠️ {cat.name} budget is{" "}
                            {cat.percentUsed.toFixed(2)}% used
                        </div>
                    ) : null
                )}

                <BudgetProgress
                    categoryTotals={categoryTotals}
                    updateBudget={updateBudget}
                    deleteCategory={deleteCategory}
                />

                <PieChartComponent categoryTotals={categoryTotals} />
                <LineChartComponent categoryTotals={categoryTotals} />

                <TransactionList
                    expenses={expenses}
                    deleteTransaction={deleteTransaction}
                />

                <button onClick={resetMonth} style={{ marginTop: "20px" }}>
                    Reset Month
                </button>
            </div>
        </div>
    );
}

// ---------------- STYLES ----------------

const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
};

const modalStyle = {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
};

const headerStyle = {
    background: "#1e293b",
    color: "white",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
};

const logoutBtn = {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer"
};

export default App;