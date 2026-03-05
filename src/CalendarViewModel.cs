using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows.Input;
using BudgetCalendarApp.Models;

namespace BudgetCalendarApp.ViewModels;

public class CalendarViewModel : INotifyPropertyChanged
{
    public ObservableCollection<BudgetCategory> Categories { get; set; }
    public ObservableCollection<DailyBudgetEntry> Entries { get; set; }
    public ObservableCollection<CategoryBudgetSummary> CategorySummaries { get; set; }

    private DateTime _selectedDate = DateTime.Today;
    public DateTime SelectedDate
    {
        get => _selectedDate;
        set
        {
            _selectedDate = value;
            OnPropertyChanged();
            UpdateCategorySummaries();
        }
    }

    private BudgetCategory _selectedCategory;
    public BudgetCategory SelectedCategory
    {
        get => _selectedCategory;
        set
        {
            _selectedCategory = value;
            OnPropertyChanged();
        }
    }

    private decimal _amount;
    public decimal Amount
    {
        get => _amount;
        set
        {
            _amount = value;
            OnPropertyChanged();
        }
    }

    private string _newCategoryName;
    public string NewCategoryName
    {
        get => _newCategoryName;
        set
        {
            _newCategoryName = value;
            OnPropertyChanged();
        }
    }

    private decimal _newCategoryLimit;
    public decimal NewCategoryLimit
    {
        get => _newCategoryLimit;
        set
        {
            _newCategoryLimit = value;
            OnPropertyChanged();
        }
    }

    public ICommand AddEntryCommand { get; }
    public ICommand AddCategoryCommand { get; }
    public ICommand DeleteCategoryCommand { get; }

    public CalendarViewModel()
    {
        Categories = new ObservableCollection<BudgetCategory>();
        Entries = new ObservableCollection<DailyBudgetEntry>();
        CategorySummaries = new ObservableCollection<CategoryBudgetSummary>();

        AddEntryCommand = new Command(AddEntry);
        AddCategoryCommand = new Command(AddCategory);
        DeleteCategoryCommand = new Command<BudgetCategory>(DeleteCategory);
    }

    private void AddCategory()
    {
        if (string.IsNullOrWhiteSpace(NewCategoryName) || NewCategoryLimit <= 0)
            return;

        Categories.Add(new BudgetCategory
        {
            Name = NewCategoryName.Trim(),
            MonthlyLimit = NewCategoryLimit,
            ColorHex = "#4CAF50"
        });

        NewCategoryName = string.Empty;
        NewCategoryLimit = 0;

        UpdateCategorySummaries();
    }

    private void DeleteCategory(BudgetCategory category)
    {
        if (category == null)
            return;

        // Remove entries tied to this category
        var relatedEntries = Entries
            .Where(e => e.Category == category.Name)
            .ToList();

        foreach (var entry in relatedEntries)
            Entries.Remove(entry);

        Categories.Remove(category);

        if (SelectedCategory == category)
            SelectedCategory = null;

        UpdateCategorySummaries();
    }

    private void AddEntry()
    {
        if (SelectedCategory == null || Amount <= 0)
            return;

        Entries.Add(new DailyBudgetEntry
        {
            Date = SelectedDate.Date,
            Category = SelectedCategory.Name,
            Amount = Amount
        });

        Amount = 0;

        UpdateCategorySummaries();
    }

    public decimal MonthlyTotal =>
        Entries
            .Where(e => e.Date.Month == SelectedDate.Month &&
                        e.Date.Year == SelectedDate.Year)
            .Sum(e => e.Amount);

    private void UpdateCategorySummaries()
    {
        CategorySummaries.Clear();

        foreach (var category in Categories)
        {
            var spent = Entries
                .Where(e =>
                    e.Category == category.Name &&
                    e.Date.Month == SelectedDate.Month &&
                    e.Date.Year == SelectedDate.Year)
                .Sum(e => e.Amount);

            CategorySummaries.Add(new CategoryBudgetSummary
            {
                Name = category.Name,
                MonthlyLimit = category.MonthlyLimit,
                MonthlySpent = spent
            });
        }

        OnPropertyChanged(nameof(MonthlyTotal));
    }

    public event PropertyChangedEventHandler PropertyChanged;

    protected void OnPropertyChanged([CallerMemberName] string name = "")
        => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
}