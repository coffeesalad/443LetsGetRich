import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

function PieChartComponent({ categoryTotals }) {
    const data = categoryTotals.map(cat => ({ name: cat.name, value: cat.totalSpent }));

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>

            <PieChart width={300} height={300}>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            </PieChart>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {data.map((entry, index) => (
                    <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{
                            width: "12px", height: "12px", borderRadius: "50%",
                            background: COLORS[index % COLORS.length],
                            flexShrink: 0
                        }} />
                        <span style={{ fontSize: "14px" }}>
                            {entry.name}: <b>${entry.value.toFixed(2)}</b>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PieChartComponent;