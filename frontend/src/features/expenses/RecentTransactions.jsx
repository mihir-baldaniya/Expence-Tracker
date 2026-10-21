import { ReceiptText, ArrowUpRight } from "lucide-react";

import "../../assets/css/expenses/RecentTransactions.css";

import {
  formatCurrency,
  useCurrency,
} from "../../utils/currency";

const CATEGORY_COLORS = {
  Food: "#34764c",
  Shopping: "#8b6baf",
  Utilities: "#d69a28",
  Transport: "#2697c7",
  Entertainment: "#d65b94",
  Other: "#899489",
};

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function RecentTransactions({ expenses = [] }) {
  const currency = useCurrency();

  const recentExpenses = [...expenses]
    .sort((first, second) =>
      String(second.date || "").localeCompare(
        String(first.date || "")
      )
    )
    .slice(0, 5);

  return (
    <section className="recent-transactions">
      {/* Header */}
      <div className="recent-transactions-header">
        <div className="recent-transactions-heading">
          <span className="transactions-eyebrow">
            YOUR ACTIVITY
          </span>

          <h2 className="transactions-title">
            Recent Transactions
          </h2>

          <p className="transactions-description">
            Your latest recorded expenses.
          </p>
        </div>

        <div className="transactions-count">
          <span className="transactions-count-dot" />
          {expenses.length}{" "}
          {expenses.length === 1 ? "transaction" : "transactions"}
        </div>
      </div>

      {/* Transaction Table */}
      {recentExpenses.length > 0 ? (
        <div className="transactions-table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Payment method</th>
                <th className="transactions-amount-heading">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {recentExpenses.map((expense) => {
                const categoryColor =
                  CATEGORY_COLORS[expense.category] ||
                  CATEGORY_COLORS.Other;

                return (
                  <tr key={expense.id}>
                    {/* Description */}
                    <td>
                      <div className="transaction-description-cell">
                        <div className="transaction-icon">
                          <ReceiptText
                            size={18}
                            strokeWidth={1.8}
                          />
                        </div>

                        <div className="transaction-description-content">
                          <span className="transaction-description">
                            {expense.description || "Untitled expense"}
                          </span>

                          <span className="transaction-date-mobile">
                            {formatDate(expense.date)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="transaction-category">
                        <span
                          className="transaction-category-dot"
                          style={{
                            backgroundColor: categoryColor,
                          }}
                        />

                        {expense.category || "Other"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="transaction-date">
                      {formatDate(expense.date)}
                    </td>

                    {/* Payment method */}
                    <td className="transaction-payment">
                      {expense.paymentMethod || "—"}
                    </td>

                    {/* Amount */}
                    <td className="transaction-amount-cell">
                      <span className="transaction-amount">
                        {formatCurrency(
                          Number(expense.amount || 0),
                          currency
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="transactions-empty">
          <div className="transactions-empty-icon">
            <ReceiptText size={23} />
          </div>

          <h3>No transactions yet</h3>

          <p>
            Your recorded expenses will appear here.
          </p>
        </div>
      )}

      {/* Footer */}
      {recentExpenses.length > 0 && (
        <div className="transactions-footer">
          <span>
            Showing {recentExpenses.length} of {expenses.length}{" "}
            transactions
          </span>

          <span className="transactions-footer-status">
            <span />
            Updated from recorded expenses
          </span>
        </div>
      )}
    </section>
  );
}

export default RecentTransactions;