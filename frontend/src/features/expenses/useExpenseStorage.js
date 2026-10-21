import { useCallback, useEffect, useState } from "react";
import { sampleExpenses } from "./expenseData";

const STORAGE_KEY = "findash_expenses";
const EXPENSES_CHANGED_EVENT = "findash_expenses_changed";

function loadExpenses() {
  try {
    const savedExpenses = localStorage.getItem(STORAGE_KEY);

    if (savedExpenses !== null) {
      const parsedExpenses = JSON.parse(savedExpenses);

      if (Array.isArray(parsedExpenses)) {
        return parsedExpenses;
      }
    }
  } catch (error) {
    console.error("Unable to load saved expenses:", error);
  }

  return sampleExpenses;
}

function saveExpenses(expenses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));

    // Notify other hook instances in the same browser tab.
    window.dispatchEvent(
      new CustomEvent(EXPENSES_CHANGED_EVENT, {
        detail: expenses,
      })
    );
  } catch (error) {
    console.error("Unable to save expenses:", error);
  }
}

function useExpenseStorage() {
  const [expenses, setExpenses] = useState(loadExpenses);

  // Initialize localStorage only when it has no saved data.
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === null) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(sampleExpenses)
        );
      }
    } catch (error) {
      console.error("Unable to initialize expense storage:", error);
    }
  }, []);

  // Save changes made by this hook instance.
  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  // Synchronize this hook instance with updates from other instances.
  useEffect(() => {
    const handleCustomChange = (event) => {
      if (Array.isArray(event.detail)) {
        setExpenses(event.detail);
      }
    };

    // Synchronize changes made in another browser tab.
    const handleStorageChange = (event) => {
      if (event.key !== STORAGE_KEY) return;

      if (event.newValue === null) {
        setExpenses(sampleExpenses);
        return;
      }

      try {
        const parsedExpenses = JSON.parse(event.newValue);

        if (Array.isArray(parsedExpenses)) {
          setExpenses(parsedExpenses);
        }
      } catch (error) {
        console.error("Unable to synchronize expenses:", error);
      }
    };

    window.addEventListener(
      EXPENSES_CHANGED_EVENT,
      handleCustomChange
    );

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        EXPENSES_CHANGED_EVENT,
        handleCustomChange
      );

      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  const addExpense = useCallback((expense) => {
    const newExpense = {
      ...expense,
      id: crypto.randomUUID(),
      amount: Number(expense.amount),
    };

    setExpenses((previousExpenses) => [
      newExpense,
      ...previousExpenses,
    ]);

    return newExpense;
  }, []);

  const updateExpense = useCallback((id, updatedData) => {
    setExpenses((previousExpenses) =>
      previousExpenses.map((expense) =>
        expense.id === id
          ? {
              ...expense,
              ...updatedData,
              amount: Number(updatedData.amount),
            }
          : expense
      )
    );
  }, []);

  const deleteExpense = useCallback((id) => {
    setExpenses((previousExpenses) =>
      previousExpenses.filter((expense) => expense.id !== id)
    );
  }, []);

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
  };
}

export default useExpenseStorage;