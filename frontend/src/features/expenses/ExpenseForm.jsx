import { useEffect, useState } from "react";
import { X, ReceiptText } from "lucide-react";

import {
  EXPENSE_CATEGORIES,
  PAYMENT_METHODS,
} from "./expenseData";

import "../../assets/css/expenses/ExpenseForm.css";

const initialFormData = {
  description: "",
  amount: "",
  category: "Food",
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: "UPI",
  notes: "",
};

function ExpenseForm({ expense, onSubmit, onClose }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description ?? "",
        amount: String(expense.amount ?? ""),
        category: expense.category ?? "Food",
        date: expense.date ?? initialFormData.date,
        paymentMethod: expense.paymentMethod ?? "UPI",
        notes: expense.notes ?? "",
      });
    } else {
      setFormData({
        ...initialFormData,
        date: new Date().toISOString().slice(0, 10),
      });
    }

    setErrors({});
  }, [expense]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  }

  function validateForm() {
    const nextErrors = {};

    if (!formData.description.trim()) {
      nextErrors.description = "Description is required.";
    } else if (formData.description.trim().length > 100) {
      nextErrors.description =
        "Description cannot exceed 100 characters.";
    }

    const amount = Number(formData.amount);

    if (
      formData.amount.trim() === "" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      nextErrors.amount = "Enter an amount greater than zero.";
    }

    if (!formData.date || Number.isNaN(Date.parse(formData.date))) {
      nextErrors.date = "Select a valid date.";
    }

    if (!formData.category) {
      nextErrors.category = "Select a category.";
    }

    if (!formData.paymentMethod) {
      nextErrors.paymentMethod = "Select a payment method.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    onSubmit({
      ...formData,
      description: formData.description.trim(),
      amount: Number(formData.amount),
      notes: formData.notes.trim(),
    });
  }

  return (
    <div
      className="expense-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="expense-form-title"
        className="expense-modal"
      >
        {/* Modal Header */}
        <div className="expense-modal-header">
          <div className="expense-modal-heading">
            <div className="expense-modal-icon">
              <ReceiptText size={22} />
            </div>

            <div>
              <h2 id="expense-form-title">
                {expense ? "Edit expense" : "Add expense"}
              </h2>

              <p>Keep track of where your money goes.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close form"
            className="expense-modal-close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Expense Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="expense-form-body">
            {/* Description */}
            <div className="expense-form-field expense-field-full">
              <label htmlFor="description">
                Description <span>*</span>
              </label>

              <input
                id="description"
                name="description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                maxLength={100}
                placeholder="e.g. Grocery shopping"
                className={
                  errors.description ? "input-error" : ""
                }
              />

              <div className="expense-field-bottom">
                {errors.description ? (
                  <p className="expense-error">
                    {errors.description}
                  </p>
                ) : (
                  <span className="expense-field-hint">
                    Give your expense a clear name.
                  </span>
                )}

                <span className="expense-character-count">
                  {formData.description.length}/100
                </span>
              </div>
            </div>

            {/* Amount */}
            <div className="expense-form-field">
              <label htmlFor="amount">
                Amount <span>*</span>
              </label>

              <div
                className={`expense-amount-input ${
                  errors.amount ? "input-error" : ""
                }`}
              >
                <span className="expense-currency-symbol">₹</span>

                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>

              {errors.amount && (
                <p className="expense-error">{errors.amount}</p>
              )}
            </div>

            {/* Date */}
            <div className="expense-form-field">
              <label htmlFor="date">
                Expense date <span>*</span>
              </label>

              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className={errors.date ? "input-error" : ""}
              />

              {errors.date && (
                <p className="expense-error">{errors.date}</p>
              )}
            </div>

            {/* Category */}
            <div className="expense-form-field">
              <label htmlFor="category">
                Category <span>*</span>
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? "input-error" : ""}
              >
                {EXPENSE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {errors.category && (
                <p className="expense-error">{errors.category}</p>
              )}
            </div>

            {/* Payment Method */}
            <div className="expense-form-field">
              <label htmlFor="paymentMethod">
                Payment method <span>*</span>
              </label>

              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className={
                  errors.paymentMethod ? "input-error" : ""
                }
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>

              {errors.paymentMethod && (
                <p className="expense-error">
                  {errors.paymentMethod}
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="expense-form-field expense-field-full">
              <label htmlFor="notes">
                Notes <span className="expense-optional">(Optional)</span>
              </label>

              <textarea
                id="notes"
                name="notes"
                rows={3}
                maxLength={500}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional details..."
              />

              <span className="expense-character-count expense-notes-count">
                {formData.notes.length}/500
              </span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="expense-modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="expense-cancel-button"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="expense-submit-button"
            >
              {expense ? "Save changes" : "Add expense"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ExpenseForm;