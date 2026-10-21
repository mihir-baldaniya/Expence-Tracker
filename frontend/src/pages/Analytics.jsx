import { useMemo, useState } from "react";
import {
  CalendarDays,
  IndianRupee,
  Receipt,
  TrendingUp,
  TrendingDown,
  Wallet,
  RotateCcw,
  ChartNoAxesCombined,
} from "lucide-react";

import "../assets/css/pages/Analytics.css";

import useExpenseStorage from "../features/expenses/useExpenseStorage";
import CategoryBreakdown from "../features/analytics/CategoryBreakdown";
import SpendTrendChart from "../features/analytics/SpendTrendChart";

import {
  formatCurrency,
  useCurrency,
} from "../utils/currency";

function Analytics() {
  const { expenses } = useExpenseStorage();
  const currency = useCurrency();

  const [period, setPeriod] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const months = useMemo(() => {
    const uniqueMonths = [
      ...new Set(
        expenses
          .filter((expense) => expense.date)
          .map((expense) => String(expense.date).slice(0, 7))
      ),
    ];

    return uniqueMonths.sort((a, b) => b.localeCompare(a));
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    const now = new Date();

    const currentMonth = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
    ].join("-");

    return expenses.filter((expense) => {
      if (!expense.date) return false;

      const expenseDate = new Date(`${expense.date}T00:00:00`);

      if (Number.isNaN(expenseDate.getTime())) return false;

      if (selectedMonth !== "all") {
        return String(expense.date).slice(0, 7) === selectedMonth;
      }

      if (period === "month") {
        return String(expense.date).slice(0, 7) === currentMonth;
      }

      if (period === "30days") {
        const startDate = new Date(now);
        startDate.setDate(now.getDate() - 29);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);

        return expenseDate >= startDate && expenseDate <= endDate;
      }

      if (period === "year") {
        return expenseDate.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [expenses, period, selectedMonth]);

  const analytics = useMemo(() => {
    const total = filteredExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount || 0),
      0
    );

    const categoryTotals = filteredExpenses.reduce((result, expense) => {
      const category = expense.category || "Other";

      result[category] =
        (result[category] || 0) + Number(expense.amount || 0);

      return result;
    }, {});

    const categories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    const categoryCounts = filteredExpenses.reduce((result, expense) => {
      const category = expense.category || "Other";

      result[category] = (result[category] || 0) + 1;

      return result;
    }, {});

    const highestExpense = filteredExpenses.reduce(
      (highest, expense) =>
        Number(expense.amount || 0) > Number(highest?.amount || 0)
          ? expense
          : highest,
      null
    );

    const averageExpense =
      filteredExpenses.length > 0
        ? total / filteredExpenses.length
        : 0;

    return {
      total,
      count: filteredExpenses.length,
      categories,
      categoryCounts,
      topCategory: categories[0] || null,
      highestExpense,
      averageExpense,
    };
  }, [filteredExpenses]);

  const resetFilters = () => {
    setPeriod("all");
    setSelectedMonth("all");
  };

  const selectedPeriodLabel =
    selectedMonth !== "all"
      ? new Date(`${selectedMonth}-01T00:00:00`).toLocaleDateString(
          "en-IN",
          {
            month: "long",
            year: "numeric",
          }
        )
      : {
          all: "All time",
          month: "This month",
          "30days": "Last 30 days",
          year: "This year",
        }[period];

  return (
    <section className="analytics-page">
      {/* Page Header */}
      <div className="analytics-page-header">
        <div className="analytics-heading">
          <div className="analytics-heading-icon">
            <ChartNoAxesCombined size={23} />
          </div>

          <div>
            <h1>Analytics</h1>

            <p>
              Understand your spending patterns and financial trends.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="analytics-filters">
          <label className="analytics-filter">
            <CalendarDays size={17} />

            <select
              value={period}
              onChange={(event) => {
                setPeriod(event.target.value);
                setSelectedMonth("all");
              }}
              aria-label="Filter analytics by period"
            >
              <option value="all">All time</option>
              <option value="month">This month</option>
              <option value="30days">Last 30 days</option>
              <option value="year">This year</option>
            </select>
          </label>

          <label className="analytics-month-filter">
            <select
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              aria-label="Filter analytics by month"
            >
              <option value="all">All months</option>

              {months.map((month) => (
                <option key={month} value={month}>
                  {new Date(`${month}-01T00:00:00`).toLocaleDateString(
                    "en-IN",
                    {
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={resetFilters}
            className="analytics-reset-button"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Selected Period */}
      <div className="analytics-period-note">
        <span className="analytics-period-dot" />

        Showing analytics for
        <strong>{selectedPeriodLabel}</strong>

        <span className="analytics-period-count">
          {analytics.count} {analytics.count === 1 ? "transaction" : "transactions"}
        </span>
      </div>

      {/* Summary Cards */}
      <div className="analytics-summary-grid">
        <SummaryCard
          title="Total Spending"
          value={formatCurrency(analytics.total, currency)}
          subtitle="Total expenses in this period"
          icon={<Wallet size={21} />}
          variant="green"
        />

        <SummaryCard
          title="Transactions"
          value={analytics.count.toLocaleString("en-IN")}
          subtitle="Recorded expenses"
          icon={<Receipt size={21} />}
          variant="blue"
        />

        <SummaryCard
          title="Average Expense"
          value={formatCurrency(analytics.averageExpense, currency)}
          subtitle="Average per transaction"
          icon={<IndianRupee size={21} />}
          variant="purple"
        />

        <SummaryCard
          title="Top Category"
          value={analytics.topCategory?.category || "No data"}
          subtitle={
            analytics.topCategory
              ? `${formatCurrency(
                  analytics.topCategory.amount,
                  currency
                )} spent`
              : "No expenses available"
          }
          icon={<TrendingUp size={21} />}
          variant="orange"
        />
      </div>

      {/* Charts */}
      <div className="analytics-charts-grid">
        <div className="analytics-panel analytics-chart-panel">
          <div className="analytics-panel-header">
            <div>
              <h2>Spending Trend</h2>
              <p>Track how your expenses change over time.</p>
            </div>

            <div className="analytics-panel-icon">
              <TrendingUp size={19} />
            </div>
          </div>

          {filteredExpenses.length > 0 ? (
            <SpendTrendChart expenses={filteredExpenses} />
          ) : (
            <EmptyState message="No expenses found for this period." />
          )}
        </div>

        <div className="analytics-panel analytics-chart-panel">
          <div className="analytics-panel-header">
            <div>
              <h2>Category Breakdown</h2>
              <p>Explore where your money is being spent.</p>
            </div>

            <div className="analytics-panel-icon">
              <ChartNoAxesCombined size={19} />
            </div>
          </div>

          {filteredExpenses.length > 0 ? (
            <CategoryBreakdown expenses={filteredExpenses} />
          ) : (
            <EmptyState message="No category data available." />
          )}
        </div>
      </div>

      {/* Category Details */}
      <div className="analytics-panel analytics-category-details">
        <div className="analytics-panel-header">
          <div>
            <h2>Category Details</h2>
            <p>
              A detailed breakdown of expenses by category.
            </p>
          </div>

          <span className="analytics-section-badge">
            {analytics.categories.length}{" "}
            {analytics.categories.length === 1 ? "category" : "categories"}
          </span>
        </div>

        {analytics.categories.length > 0 ? (
          <div className="analytics-table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Share of spending</th>
                  <th>Transactions</th>
                </tr>
              </thead>

              <tbody>
                {analytics.categories.map((item, index) => (
                  <tr key={item.category}>
                    <td>
                      <div className="analytics-category-name">
                        <span
                          className={`analytics-category-number category-number-${index % 5}`}
                        >
                          {item.category.charAt(0).toUpperCase()}
                        </span>

                        <span>{item.category}</span>
                      </div>
                    </td>

                    <td className="analytics-table-amount">
                      {formatCurrency(item.amount, currency)}
                    </td>

                    <td>
                      <div className="analytics-share-cell">
                        <div className="analytics-share-track">
                          <div
                            className="analytics-share-fill"
                            style={{
                              width: `${item.percentage}%`,
                            }}
                          />
                        </div>

                        <span>
                          {item.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="analytics-transaction-badge">
                        {analytics.categoryCounts[item.category] || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="Add expenses to see category details." />
        )}
      </div>

      {/* Highest Expense */}
      {analytics.highestExpense && (
        <div className="analytics-highest-expense">
          <div className="analytics-highest-icon">
            <TrendingDown size={22} />
          </div>

          <div className="analytics-highest-info">
            <span className="analytics-highest-label">
              Highest Expense
            </span>

            <h3>{analytics.highestExpense.description}</h3>

            <p>
              {analytics.highestExpense.category || "Other"}
              <span>·</span>
              {analytics.highestExpense.date
                ? new Date(
                    `${analytics.highestExpense.date}T00:00:00`
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Date unavailable"}
            </p>
          </div>

          <div className="analytics-highest-amount">
            <span>Amount</span>

            <strong>
              {formatCurrency(
                Number(analytics.highestExpense.amount || 0),
                currency
              )}
            </strong>
          </div>
        </div>
      )}
    </section>
  );
}

function SummaryCard({ title, value, subtitle, icon, variant }) {
  return (
    <article className={`analytics-summary-card variant-${variant}`}>
      <div className="analytics-summary-top">
        <span className="analytics-summary-title">{title}</span>

        <div className="analytics-summary-icon">{icon}</div>
      </div>

      <div className="analytics-summary-value">{value}</div>

      <p className="analytics-summary-subtitle">{subtitle}</p>

      <div className="analytics-summary-bottom-line" />
    </article>
  );
}

function EmptyState({ message }) {
  return (
    <div className="analytics-empty-state">
      <div className="analytics-empty-icon">
        <ChartNoAxesCombined size={22} />
      </div>

      <p>{message}</p>
    </div>
  );
}

export default Analytics;