import { useMemo, useState } from "react";
import "../assets/css/pages/Expenses.css";

import {
  Plus,
  Search,
  X,
  Wallet,
  ReceiptText,
  TrendingUp,
  CalendarDays,
  ArrowUpRight,
  SlidersHorizontal,
} from "lucide-react";

import ExpenseForm from "../features/expenses/ExpenseForm";
import ExpenseTable from "../features/expenses/ExpenseTable";
import useExpenseStorage from "../features/expenses/useExpenseStorage";
import { EXPENSE_CATEGORIES } from "../features/expenses/expenseData";

import {
  formatCurrency,
  useCurrency,
} from "../utils/currency";

const PAGE_SIZE = 5;

function Expenses() {
  const currency = useCurrency();

  const {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useExpenseStorage();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const filteredExpenses = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return expenses
      .filter((expense) => {
        const description = String(expense.description || "");

        const matchesSearch =
          !normalizedSearch ||
          description.toLowerCase().includes(normalizedSearch);

        const matchesCategory =
          selectedCategory === "All" ||
          expense.category === selectedCategory;

        const matchesStartDate =
          !startDate || expense.date >= startDate;

        const matchesEndDate =
          !endDate || expense.date <= endDate;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesStartDate &&
          matchesEndDate
        );
      })
      .sort((a, b) => {
        if (a.date !== b.date) {
          return String(b.date || "").localeCompare(
            String(a.date || "")
          );
        }

        return String(b.id).localeCompare(String(a.id), undefined, {
          numeric: true,
        });
      });
  }, [
    expenses,
    searchTerm,
    selectedCategory,
    startDate,
    endDate,
  ]);

  const filteredTotal = useMemo(
    () =>
      filteredExpenses.reduce(
        (total, expense) =>
          total + Number(expense.amount || 0),
        0
      ),
    [filteredExpenses]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredExpenses.length / PAGE_SIZE)
  );

  const visibleExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return filteredExpenses.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );
  }, [filteredExpenses, currentPage]);

  function clearFilters() {
    setSearchTerm("");
    setSelectedCategory("All");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  }

  function openCreateForm() {
    setEditingExpense(null);
    setIsFormOpen(true);
  }

  function openEditForm(expense) {
    setEditingExpense(expense);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingExpense(null);
  }

  function handleFormSubmit(formData) {
    if (editingExpense) {
      updateExpense(editingExpense.id, formData);
    } else {
      addExpense(formData);
    }

    closeForm();
    setCurrentPage(1);
  }

  function handleDelete(expense) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${expense.description}"?`
    );

    if (!confirmed) return;

    deleteExpense(expense.id);
    setCurrentPage(1);
  }

  function handlePageChange(page) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  }

  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedCategory !== "All" ||
    Boolean(startDate) ||
    Boolean(endDate);

  const summaryCards = [
    {
      title: "Total records",
      value: expenses.length,
      description: "All recorded expenses",
      icon: ReceiptText,
      variant: "records",
    },
    {
      title: "Filtered total",
      value: formatCurrency(filteredTotal, currency),
      description: "Based on current filters",
      icon: Wallet,
      variant: "total",
    },
    {
      title: "Matching expenses",
      value: filteredExpenses.length,
      description: "Expenses matching your search",
      icon: TrendingUp,
      variant: "matching",
    },
  ];

  return (
    <main className="expenses-page">
      {/* Page heading */}
      <section className="expenses-page-header">
        <div className="expenses-heading-content">
          <span className="expenses-eyebrow">
            <span className="expenses-status-dot" />
            Expense management
          </span>

          <h1 className="expenses-page-title">Expenses</h1>

          <p className="expenses-page-description">
            Manage your spending, organize transactions, and keep your
            expense records up to date.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="expenses-add-button"
        >
          <Plus size={19} strokeWidth={2} />
          <span>Add expense</span>
        </button>
      </section>

      {/* Summary cards */}
      <section className="expenses-summary-grid">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className={`expenses-summary-card expenses-summary-${card.variant}`}
            >
              <div className="expenses-summary-top">
                <span className="expenses-summary-label">
                  {card.title}
                </span>

                <div className="expenses-summary-icon">
                  <Icon size={20} strokeWidth={1.8} />
                </div>
              </div>

              <div className="expenses-summary-value">
                {card.value}
              </div>

              <div className="expenses-summary-bottom">
                <span className="expenses-summary-indicator" />
                <span>{card.description}</span>
              </div>
            </article>
          );
        })}
      </section>

      {/* Search and filters */}
      <section className="expenses-filter-card">
        <div className="expenses-filter-header">
          <div className="expenses-filter-heading">
            <div className="expenses-filter-heading-icon">
              <SlidersHorizontal size={18} />
            </div>

            <div>
              <h2>Find expenses</h2>
              <p>Search and filter your transactions.</p>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="expenses-clear-button"
            >
              <X size={16} />
              Clear filters
            </button>
          )}
        </div>

        <div className="expenses-filter-grid">
          {/* Search */}
          <div className="expenses-field expenses-search-field">
            <label htmlFor="expenseSearch">Search</label>

            <div className="expenses-input-wrapper">
              <Search size={17} />

              <input
                id="expenseSearch"
                type="search"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search description..."
              />
            </div>
          </div>

          {/* Category */}
          <div className="expenses-field">
            <label htmlFor="expenseCategory">Category</label>

            <select
              id="expenseCategory"
              value={selectedCategory}
              onChange={(event) => {
                setSelectedCategory(event.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All categories</option>

              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Start date */}
          <div className="expenses-field">
            <label htmlFor="startDate">From date</label>

            <div className="expenses-input-wrapper">
              <CalendarDays size={17} />

              <input
                id="startDate"
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(event) => {
                  setStartDate(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* End date */}
          <div className="expenses-field">
            <label htmlFor="endDate">To date</label>

            <div className="expenses-input-wrapper">
              <CalendarDays size={17} />

              <input
                id="endDate"
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => {
                  setEndDate(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        <div className="expenses-filter-footer">
          <p>
            <strong>{filteredExpenses.length}</strong>{" "}
            matching{" "}
            {filteredExpenses.length === 1 ? "expense" : "expenses"}
          </p>

          {hasActiveFilters && (
            <span className="expenses-filter-active">
              Filters applied
            </span>
          )}
        </div>
      </section>

      {/* Transactions */}
      <section className="expenses-transactions-section">
        <div className="expenses-transactions-heading">
          <div>
            <span className="expenses-section-eyebrow">
              TRANSACTION HISTORY
            </span>

            <h2>All transactions</h2>

            <p>Review and manage your expense records.</p>
          </div>

          <div className="expenses-transactions-total">
            <span>Filtered amount</span>
            <strong>
              {formatCurrency(filteredTotal, currency)}
            </strong>
          </div>
        </div>

        <div className="expenses-table-card">
          <ExpenseTable
            expenses={visibleExpenses}
            onEdit={openEditForm}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          {filteredExpenses.length > 0 && (
            <div className="expenses-table-footer">
              <span>
                Showing{" "}
                {Math.min(
                  (currentPage - 1) * PAGE_SIZE + 1,
                  filteredExpenses.length
                )}
                {"–"}
                {Math.min(
                  currentPage * PAGE_SIZE,
                  filteredExpenses.length
                )}{" "}
                of {filteredExpenses.length} expenses
              </span>

              <span className="expenses-footer-status">
                <span />
                Expense records
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Create / edit expense form */}
      {isFormOpen && (
        <ExpenseForm
          key={editingExpense?.id ?? "new-expense"}
          expense={editingExpense}
          onSubmit={handleFormSubmit}
          onClose={closeForm}
        />
      )}
    </main>
  );
}

export default Expenses;