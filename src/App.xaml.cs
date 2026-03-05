using BudgetCalendarApp.Views;

namespace BudgetCalendarApp;

public partial class App : Application
{
    public App()
    {
        InitializeComponent();

        MainPage = new NavigationPage(new CalendarPage());
    }
}