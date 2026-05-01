import React from "react";

function BudgetProgress({ categoryTotals, updateBudget, deleteCategory }) {
    return (
        <div style={{ marginTop: "20px" }}>
            <h2>Budget Usage</h2>

            {categoryTotals.map((cat) => {
                const percent = Math.min(cat.percentUsed, 100);

                return (
                    <div key={cat.name} style={{ marginBottom: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>{cat.name}</span>

                            <span>
                                ${cat.totalSpent} /
                                <input
                                    type="number"
                                    value={cat.budget}
                                    onChange={(e) =>
                                        updateBudget(
                                            cat.name,
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                    style={{ width: "80px" }}
                                />

                                <button
                                    onClick={() => {
                                        if (window.confirm(`Delete ${cat.name}?`)) {
                                            deleteCategory(cat.name);
                                        }
                                    }}
                                    style={{ marginLeft: "10px", background: "red", color: "white" }}
                                >
                                    Delete
                                </button>
                            </span>
                        </div>

                        <div style={{ height: "10px", background: "#ddd", marginTop: "5px" }}>
                            <div
                                style={{
                                    width: `${percent}%`,
                                    height: "100%",
                                    background:
                                        percent > 85 ? "red" :
                                            percent > 50 ? "orange" :
                                                "green"
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default BudgetProgress;