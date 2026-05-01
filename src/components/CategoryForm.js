import React, { useState } from "react";

function CategoryForm({ addCategory, categories }) {
    const [name, setName] = useState("");
    const [budget, setBudget] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !budget) return;

        if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        alert("This category already exists");
        return;
        }

        addCategory(name, parseFloat(budget));
        setName("");
        setBudget("");
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
            <h3>Add Category</h3>

            <input
                type="text"
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="number"
                placeholder="Budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
            />

            <button type="submit">Add</button>
        </form>
    );
}

export default CategoryForm;