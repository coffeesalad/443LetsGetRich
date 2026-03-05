namespace BudgetCalendarApp.Models;

public class BudgetCategory
{
    public string Name { get; set; }
    public string ColorHex { get; set; }

    // NEW: Monthly budget limit per category
    public decimal MonthlyLimit { get; set; }
}