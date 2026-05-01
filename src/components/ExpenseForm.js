import React, { useState, useEffect } from "react";

function ExpenseForm({ categories, addExpense, selectedDate }) {
    const [category, setCategory] = useState(categories[0]?.name || "");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        if (categories.length > 0) {
            setCategory(categories[0].name);
        }
    }, [categories]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!amount || !selectedDate) return;

        if (amount <= 0) {
        alert("Amount must be greater than 0");
        return;
        }

        addExpense(category, amount, note);
        setNote("");
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
                min="0"
                onChange={(e) => setAmount(e.target.value)}
            />
            
            <input
                type="text"
                placeholder="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />

            <button type="submit" disabled={!selectedDate}>
                Add Expense
            </button>
        </form>
    );
}

export default ExpenseForm;