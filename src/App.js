import React, { useState } from "react";
import "./App.css";
import "react-calendar/dist/Calendar.css";

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
    { name: "Books", budget: 100 },
    { name: "Food", budget: 200 },
    { name: "Rent", budget: 1000 },
    { name: "Entertainment", budget: 100 },
    { name: "Utilities", budget: 100 }
];

function App() {
    const [user, setUser] = useState(null);

    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState(initialCategories);

    const [selectedDate, setSelectedDate] = useState(new Date());

    //---------------- AUTHENTICATION----------------

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
    };

    const handleLogout = () => setUser(null);

    // ---------------- EXPENSE LOGIC ----------------

    const addExpense = (category, amount) => {
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
        if (categories.find(c => c.name === name)) return;
        setCategories([...categories, { name, budget }]);
    };

    const updateBudget = (categoryName, newBudget) => {
        setCategories(categories.map(cat =>
            cat.name === categoryName
                ? { ...cat, budget: newBudget }
                : cat
        ));
    };

    const deleteCategory = (name) => {
        setCategories(categories.filter(c => c.name !== name));
        setExpenses(expenses.filter(e => e.category !== name));
    };

    const resetMonth = () => {
        const m = new Date().getMonth();
        setExpenses(expenses.filter(e => new Date(e.date).getMonth() !== m));
    };

    // ---------------- DERIVED DATA ----------------

    const categoryTotals = categories.map(cat => {
        const totalSpent = expenses
            .filter(e => e.category === cat.name)
            .reduce((sum, e) => sum + e.amount, 0);

        const percentUsed =
            cat.budget > 0 ? (totalSpent / cat.budget) * 100 : 0;

        return { ...cat, totalSpent, percentUsed };
    });

    // ---------------- LATEST DATE LOGIC ----------------

    const getLatestExpenseDate = () => {
        if (expenses.length === 0) return null;

        return new Date(
            Math.max(...expenses.map(e => new Date(e.date)))
        );
    };

    let daysRemaining = null;

    const latestDate = getLatestExpenseDate();

    if (latestDate) {
        const lastDay = new Date(
            latestDate.getFullYear(),
            latestDate.getMonth() + 1,
            0
        );

        daysRemaining =
            lastDay.getDate() - latestDate.getDate();
    }

    const showDays = expenses.length > 0;

    // ---------------- UI ----------------

    return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh", background: "#f5f7fa" }}>

        {!user && (
            <div style={overlayStyle}>
                <div style={modalStyle}>
                    <Login handleLogin={handleLogin} handleSignup={handleSignup} />
                </div>
            </div>
        )}

        <div style={headerStyle}>
            <h1 style={{ margin: 0 }}>💰 Budget Dashboard</h1>
            {user && (
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <span>Logged in as: <b>{user.name}</b></span>
                    <button onClick={handleLogout} style={logoutBtn}>Logout</button>
                </div>
            )}
        </div>

        <div style={{ padding: "20px" }}>

            {/* TOP ROW: left + middle + right */}
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>

                {/* LEFT: Calendar, Add Expense, Add Category, Alerts */}
                <div style={{ flex: "0 0 320px", display: "flex", flexDirection: "column", gap: "16px" }}>
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
                </div>

                {/* Middle: Charts */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                    <PieChartComponent categoryTotals={categoryTotals} />
                    <LineChartComponent categoryTotals={categoryTotals} />
                </div>

                {/* RIGHT: Charts */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                        <h2>Category Alerts</h2>
                        {categoryTotals.map(cat => {
                            const percent = cat.percentUsed;
                            let daysText = showDays && daysRemaining !== null ? ` — ${daysRemaining} days left` : "";
                            let message = null;
                            let color = "";

                            if (percent >= 100) { message = `🚨 OVER BUDGET (${percent.toFixed(0)}%)${daysText}`; color = "red"; }
                            else if (percent >= 80) { message = `⚠️ WARNING (${percent.toFixed(0)}%)${daysText}`; color = "orange"; }
                            else if (percent >= 50) { message = `🟡 ON TRACK (${percent.toFixed(0)}%)${daysText}`; color = "green"; }

                            return message ? (
                                <div key={cat.name} style={{ color }}>{cat.name}: {message}</div>
                            ) : null;
                        })}
                    </div>
                    <TransactionList
                    expenses={expenses}
                    deleteTransaction={deleteTransaction}
                    />
                </div>
            </div>

            {/* BOTTOM: Budget Usage + Transactions */}
            <div style={{ marginTop: "20px" }}>
                <BudgetProgress
                    categoryTotals={categoryTotals}
                    updateBudget={updateBudget}
                    deleteCategory={deleteCategory}
                />
                
                <button onClick={resetMonth} style={{ marginTop: "20px" }}>
                    Reset Month
                </button>
            </div>
        </div>
    </div>
);};

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