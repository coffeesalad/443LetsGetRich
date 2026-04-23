import React, { useState, useEffect } from "react";

function ExpenseForm({ categories, addExpense, selectedDate }) {
    const [category, setCategory] = useState(categories[0]?.name || "");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        if (categories.length > 0) {
            setCategory(categories[0].name);
        }
    }, [categories]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!amount || !selectedDate) return;

        addExpense(category, amount);
        setAmount("");
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
            <h3>Add Expense</h3>

            <div>
                <strong>Date:</strong>{" "}
                {selectedDate
                    ? selectedDate.toDateString()
                    : "Please select a date"}
            </div>

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                        {cat.name}
                    </option>
                ))}
            </select>

            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <button type="submit" disabled={!selectedDate}>
                Add Expense
            </button>
        </form>
    );
}

export default ExpenseForm;