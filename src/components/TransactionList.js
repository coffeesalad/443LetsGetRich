import React from "react";

function TransactionList({ expenses, deleteTransaction }) {
    //Group by category
    const grouped = expenses.reduce((acc, exp) => {
        if (!acc[exp.category]) {
            acc[exp.category] = [];
        }
        acc[exp.category].push(exp);
        return acc;
    }, {});

    //Sort categories alphabetically
    const categories = Object.keys(grouped).sort();

    return (
        <div style={{ marginTop: "20px" }}>
            <h2>Transactions</h2>

            {expenses.length === 0 && <p>No transactions yet.</p>}

            {categories.map((category) => {
                //Sort each category by date from oldest to newest
                const sortedExpenses = grouped[category].sort(
                    (a, b) => new Date(a.date) - new Date(b.date)
                );

                return (
                    <div key={category} style={{ marginBottom: "20px" }}>
                        {/* Category Header */}
                        <h3 style={{ marginBottom: "10px" }}>
                            {category}
                        </h3>

                        <ul style={{ listStyleType: "none", padding: 0 }}>
                            {sortedExpenses.map((exp) => (
                                <li
                                    key={exp.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "5px 0",
                                        borderBottom: "1px solid #ddd"
                                    }}
                                >
                                    <span>
                                        ${exp.amount.toFixed(2)}{" "}
                                        {exp.note && <div style={{ fontStyle: "italic" }}> {exp.note}</div>}
                                        Date: {new Date(exp.date).toDateString()}
                                    </span>

                                    <button
                                        onClick={() =>
                                            deleteTransaction(exp.id)
                                        }
                                        style={{
                                            background: "red",
                                            color: "white",
                                            border: "none",
                                            padding: "3px 8px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}

export default TransactionList;