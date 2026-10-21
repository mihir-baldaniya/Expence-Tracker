import { useEffect, useState } from "react";

const SETTINGS_STORAGE_KEY = "findash_settings";
const CURRENCY_EVENT = "findash_settings_changed";

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

export function useCurrency() {
  const [currency, setCurrency] = useState("INR");

  useEffect(() => {
    function enforceIndianCurrency() {
      try {
        const savedSettings = localStorage.getItem(
          SETTINGS_STORAGE_KEY
        );

        const settings = savedSettings
          ? JSON.parse(savedSettings)
          : {};

        if (settings.currency !== "INR") {
          localStorage.setItem(
            SETTINGS_STORAGE_KEY,
            JSON.stringify({
              ...settings,
              currency: "INR",
            })
          );
        }
      } catch (error) {
        console.error("Unable to update currency settings:", error);
      }

      setCurrency("INR");
    }

    enforceIndianCurrency();

    window.addEventListener(
      CURRENCY_EVENT,
      enforceIndianCurrency
    );

    window.addEventListener("storage", enforceIndianCurrency);

    return () => {
      window.removeEventListener(
        CURRENCY_EVENT,
        enforceIndianCurrency
      );

      window.removeEventListener(
        "storage",
        enforceIndianCurrency
      );
    };
  }, []);

  return currency;
}