import {
  Pencil,
  Trash2,
  ReceiptText,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Wallet,
} from "lucide-react";

import "../../assets/css/expenses/ExpenseTable.css";

import {
  formatCurrency,
  useCurrency,
} from "../../utils/currency";

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

function ExpenseTable({
  expenses = [],
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}) {
  const currency = useCurrency();

  if (expenses.length === 0) {
    return (
      <div className="expense-table-empty">
        <div className="expense-empty-icon">
          <ReceiptText size={25} strokeWidth={1.7} />
        </div>

        <h3>No expenses found</h3>

        <p>
          Try changing your search or filters to find an expense.
        </p>
      </div>
    );
  }

  return (
    <section className="expense-table-component">
      <div className="expense-table-scroll">
        <table className="expense-records-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Date</th>
              <th>Payment method</th>
              <th className="expense-amount-heading">Amount</th>
              <th className="expense-actions-heading">Actions</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                {/* Description */}
                <td>
                  <div className="expense-description-cell">
                    <div className="expense-record-icon">
                      <ReceiptText size={18} strokeWidth={1.8} />
                    </div>

                    <div className="expense-description-content">
                      <p className="expense-record-description">
                        {expense.description || "Untitled expense"}
                      </p>

                      {expense.notes && (
                        <p
                          className="expense-record-notes"
                          title={expense.notes}
                        >
                          {expense.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td>
                  <span className="expense-record-category">
                    <span className="expense-record-category-dot" />
                    {expense.category || "Other"}
                  </span>
                </td>

                {/* Date */}
                <td>
                  <div className="expense-record-date">
                    <CalendarDays size={15} />
                    <span>{formatDate(expense.date)}</span>
                  </div>
                </td>

                {/* Payment */}
                <td>
                  <span className="expense-record-payment">
                    {expense.paymentMethod || "—"}
                  </span>
                </td>

                {/* Amount */}
                <td className="expense-record-amount-cell">
                  <span className="expense-record-amount">
                    {formatCurrency(
                      Number(expense.amount || 0),
                      currency
                    )}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <div className="expense-record-actions">
                    <button
                      type="button"
                      onClick={() => onEdit(expense)}
                      aria-label={`Edit ${expense.description}`}
                      title="Edit expense"
                      className="expense-action-button expense-edit-button"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(expense)}
                      aria-label={`Delete ${expense.description}`}
                      title="Delete expense"
                      className="expense-action-button expense-delete-button"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="expense-table-pagination">
        <div className="expense-pagination-information">
          <div className="expense-pagination-icon">
            <Wallet size={16} />
          </div>

          <p>
            Page <strong>{currentPage}</strong> of{" "}
            <strong>{totalPages}</strong>
          </p>
        </div>

        <div className="expense-pagination-buttons">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="expense-pagination-button"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="expense-pagination-button expense-pagination-next"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default ExpenseTable;