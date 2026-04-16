import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

function LineChartComponent({ categoryTotals }) {
    const data = categoryTotals.map(cat => ({
        name: cat.name,
        budget: cat.budget,
        spent: cat.totalSpent
    }));

    return (
        <LineChart width={600} height={300} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="budget" stroke="#8884d8" />
            <Line type="monotone" dataKey="spent" stroke="#FF8042" />
        </LineChart>
    );
}

export default LineChartComponent;