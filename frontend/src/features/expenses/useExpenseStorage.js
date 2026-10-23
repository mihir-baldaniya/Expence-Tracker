import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "findash_expenses";
const EXPENSES_CHANGED_EVENT = "findash_expenses_changed";

function readExpenses() {
  try {
    const savedExpenses = localStorage.getItem(STORAGE_KEY);

    if (savedExpenses === null) {
      return [];
    }

    const parsedExpenses = JSON.parse(savedExpenses);
    return Array.isArray(parsedExpenses) ? parsedExpenses : [];
  } catch (error) {
    console.error("Unable to load saved expenses:", error);
    return [];
  }
}

// A single shared in-memory source of truth for every page/component.
let expensesSnapshot = readExpenses();
const subscribers = new Set();

function notifySubscribers() {
  subscribers.forEach((subscriber) => subscriber());
}

function subscribe(subscriber) {
  subscribers.add(subscriber);

  return () => {
    subscribers.delete(subscriber);
  };
}

function getSnapshot() {
  return expensesSnapshot;
}

function commitExpenses(nextExpenses) {
  expensesSnapshot = nextExpenses;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextExpenses));
  } catch (error) {
    console.error("Unable to save expenses:", error);
  }

  // Update components in this tab immediately.
  notifySubscribers();

  // Also notify other app instances listening in this tab.
  window.dispatchEvent(
    new CustomEvent(EXPENSES_CHANGED_EVENT, {
      detail: nextExpenses,
    })
  );
}

// Keep the shared store in sync if localStorage changes in another tab.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;

    if (event.newValue === null) {
      expensesSnapshot = [];
    } else {
      try {
        const parsed = JSON.parse(event.newValue);
        expensesSnapshot = Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error("Unable to synchronize expenses:", error);
        expensesSnapshot = [];
      }
    }

    notifySubscribers();
  });

  window.addEventListener(EXPENSES_CHANGED_EVENT, (event) => {
    if (!Array.isArray(event.detail)) return;

    // Ignore our own event if it already points at the current snapshot.
    if (event.detail === expensesSnapshot) return;

    expensesSnapshot = event.detail;
    notifySubscribers();
  });
}

function useExpenseStorage() {
  const expenses = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot
  );

  const addExpense = useCallback((expense) => {
    const newExpense = {
      ...expense,
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      amount: Number(expense.amount),
    };

    commitExpenses([newExpense, ...expensesSnapshot]);
    return newExpense;
  }, []);

  const updateExpense = useCallback((id, updatedData) => {
    const nextExpenses = expensesSnapshot.map((expense) =>
      expense.id === id
        ? {
            ...expense,
            ...updatedData,
            amount: Number(updatedData.amount),
          }
        : expense
    );

    commitExpenses(nextExpenses);
  }, []);

  const deleteExpense = useCallback((id) => {
    commitExpenses(
      expensesSnapshot.filter((expense) => expense.id !== id)
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
