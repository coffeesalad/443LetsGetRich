import React, { useState } from "react";
import CalendarComponent from "./components/CalendarComponent";
import ExpenseForm from "./components/ExpenseForm";
import PieChartComponent from "./components/PieChartComponent";
import LineChartComponent from "./components/LineChartComponent";
import CategoryForm from "./components/CategoryForm";
import BudgetProgress from "./components/BudgetProgress";
import TransactionList from "./components/TransactionList";
import { v4 as uuidv4 } from "uuid";

const initialCategories = [
    { name: "Books", budget: 200 },
    { name: "Food", budget: 500 },
    { name: "Rent", budget: 1000 },
    { name: "Entertainment", budget: 300 },
    { name: "Utilities", budget: 150 }
];

function App() {
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState(initialCategories);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Add expense
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

    // Delete a transaction
    const deleteTransaction = (id) => {
        setExpenses(expenses.filter(exp => exp.id !== id));
    };

    // Add a new category
    const addCategory = (name, budget) => {
        if (categories.find(cat => cat.name === name)) return;
        setCategories([...categories, { name, budget }]);
    };

    // Update category budget
    const updateBudget = (categoryName, newBudget) => {
        setCategories(categories.map(cat =>
            cat.name === categoryName
                ? { ...cat, budget: newBudget }
                : cat
        ));
    };

    // Delete category + related expenses
    const deleteCategory = (categoryName) => {
        setCategories(categories.filter(cat => cat.name !== categoryName));
        setExpenses(expenses.filter(exp => exp.category !== categoryName));
    };

    // Reset expenses for current month
    const resetMonth = () => {
        const currentMonth = new Date().getMonth();
        setExpenses(expenses.filter(exp => new Date(exp.date).getMonth() !== currentMonth));
    };

    // Compute totals per category
    const categoryTotals = categories.map(cat => {
        const totalSpent = expenses
            .filter(exp => exp.category === cat.name)
            .reduce((sum, exp) => sum + exp.amount, 0);

        const percentUsed = cat.budget > 0 ? (totalSpent / cat.budget) * 100 : 0;

        return {
            ...cat,
            totalSpent,
            percentUsed
        };
    });

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h1>Financial Budget Dashboard</h1>

            {/* Calendar */}
            <CalendarComponent
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />

            {/* Expense Form */}
            <ExpenseForm
                categories={categories}
                addExpense={addExpense}
                selectedDate={selectedDate}
            />

            {/* Add Category */}
            <CategoryForm addCategory={addCategory} />

            {/* Alerts */}
            <h2>Category Alerts</h2>
            {categoryTotals.map(cat => (
                <div key={cat.name}>
                    {cat.percentUsed >= 85 && (
                        <div style={{ color: "red" }}>
                            ⚠️ {cat.name} budget is {cat.percentUsed.toFixed(2)}% used.
                        </div>
                    )}
                </div>
            ))}

            {/* Budget Progress Bars */}
            <BudgetProgress
                categoryTotals={categoryTotals}
                updateBudget={updateBudget}
                deleteCategory={deleteCategory}
            />

            {/* Charts */}
            <PieChartComponent categoryTotals={categoryTotals} />
            <LineChartComponent categoryTotals={categoryTotals} />

            {/* Transaction List */}
            <TransactionList
                expenses={expenses}
                deleteTransaction={deleteTransaction}
            />

            {/* Reset Month */}
            <button onClick={resetMonth} style={{ marginTop: "20px" }}>
                Reset Month
            </button>
        </div>
    );
}

export default App;