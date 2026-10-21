import {
  Wallet,
  CalendarDays,
  TrendingUp,
  ReceiptText,
} from "lucide-react";

import "../../assets/css/analytics/SummaryCards.css";

import {
  formatCurrency,
  useCurrency,
} from "../../utils/currency";

function SummaryCards({ expenses = [] }) {
  const currency = useCurrency();

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  );

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);

      return (
        !Number.isNaN(expenseDate.getTime()) &&
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    })
    .reduce(
      (total, expense) => total + Number(expense.amount || 0),
      0
    );

  const averageExpense =
    expenses.length > 0 ? totalExpenses / expenses.length : 0;

  const cards = [
    {
      title: "Total Expenses",
      amount: totalExpenses,
      description: "Across all transactions",
      icon: Wallet,
      variant: "total",
    },
    {
      title: "This Month",
      amount: monthlyExpenses,
      description: "Recorded this month",
      icon: CalendarDays,
      variant: "monthly",
    },
    {
      title: "Average Expense",
      amount: averageExpense,
      description: "Average per transaction",
      icon: TrendingUp,
      variant: "average",
    },
    {
      title: "Transactions",
      amount: expenses.length,
      description: "Total recorded entries",
      icon: ReceiptText,
      variant: "transactions",
      isCount: true,
    },
  ];

  return (
    <div className="summary-cards-grid">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.title}
            className={`summary-card summary-card-${card.variant}`}
          >
            <div className="summary-card-top">
              <span className="summary-card-label">
                {card.title}
              </span>

              <div className="summary-card-icon">
                <Icon size={19} strokeWidth={1.8} />
              </div>
            </div>

            <div className="summary-card-amount">
              {card.isCount
                ? card.amount
                : formatCurrency(card.amount, currency)}
            </div>

            <div className="summary-card-bottom">
              <span className="summary-card-indicator">
                <span />
                {card.description}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default SummaryCards;