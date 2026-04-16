import React from "react";

function TransactionList({ expenses, deleteTransaction }) {
    return (
        <div style={{ marginTop: "20px" }}>
            <h2>Transactions</h2>
            {expenses.length === 0 && <p>No transactions yet.</p>}
            <ul style={{ listStyleType: "none", padding: 0 }}>
                {expenses.map((exp) => (
                    <li
                        key={exp.id}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "5px 0",
                            borderBottom: "1px solid #ccc"
                        }}
                    >
                        <span>
                            <strong>{exp.category}</strong> - ${exp.amount.toFixed(2)} on{" "}
                            {new Date(exp.date).toDateString()}
                        </span>
                        <button
                            onClick={() => deleteTransaction(exp.id)}
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
}

export default TransactionList;