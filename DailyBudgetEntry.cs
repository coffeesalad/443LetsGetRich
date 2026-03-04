namespace BudgetCalendarApp.Models;

public class DailyBudgetEntry
{
    public DateTime Date { get; set; }
    public string Category { get; set; }
    public decimal Amount { get; set; }
}