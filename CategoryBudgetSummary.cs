namespace BudgetCalendarApp.Models;

public class CategoryBudgetSummary
{
    public string Name { get; set; }
    public decimal MonthlyLimit { get; set; }
    public decimal MonthlySpent { get; set; }

    // Used by ProgressBar (0.0 – 1.0)
    public double Progress =>
        MonthlyLimit == 0
            ? 0
            : (double)(MonthlySpent / MonthlyLimit);

    public string DisplayText =>
        $"{MonthlySpent:C} / {MonthlyLimit:C}";

    public bool IsOverBudget =>
        MonthlySpent > MonthlyLimit;
}