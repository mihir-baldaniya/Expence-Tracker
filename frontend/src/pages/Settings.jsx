import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  Globe,
  Wallet,
  Bell,
  ShieldCheck,
  Download,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
  X,
  Moon,
  Sun,
  CalendarDays,
  Languages,
  Palette,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

import "../assets/css/pages/Settings.css";

const STORAGE_KEY = "findash_settings";
const CURRENCY_EVENT = "findash_settings_changed";

const DEFAULT_SETTINGS = {
  currency: "INR",
  dateFormat: "DD/MM/YYYY",
  language: "English",
  theme: "light",
  monthlyBudget: "20000",
  budgetWarning: "80",
  savingsGoal: "50000",
  expenseNotifications: true,
  budgetAlerts: true,
  monthlySummary: true,
  unusualSpendingAlerts: true,
  emailNotifications: false,
};

const CURRENCY_OPTIONS = [
  { value: "INR", label: "Indian Rupee (₹)" },
];

const DOCUMENTS = {
  "Privacy Policy": `
FinDash Privacy Policy

FinDash stores your financial records and preferences in your browser's local storage in the current version.

Information stored may include expense descriptions, amounts, categories, dates, payment methods, profile information, and application settings.

Your browser's local storage remains on your device unless you use browser features, extensions, or other application functionality that access it.

You should avoid entering sensitive banking credentials, card numbers, passwords, or other confidential financial information.

Clearing your browser storage may remove locally saved FinDash data.

This document is a draft for demonstration purposes and is not legal advice.
  `,

  "Terms & Conditions": `
FinDash Terms & Conditions

FinDash is a financial tracking application designed to help users record and understand their spending.

You are responsible for the accuracy of the information you enter.

FinDash is not a bank, payment processor, accounting service, or licensed financial advisor.

The application is provided for informational and personal tracking purposes.

These terms are a draft for demonstration purposes and should be reviewed before production use.
  `,

  "Cookie Policy": `
FinDash Cookie Policy

The current FinDash application uses browser local storage to save application data and preferences.

Local storage is different from browser cookies.

Stored preferences may include your selected currency, theme, date format, and notification settings.

Removing site data from your browser may reset these preferences.

This document is a draft for demonstration purposes.
  `,

  "Financial Disclaimer": `
FinDash Financial Disclaimer

FinDash is intended for personal expense tracking and financial awareness.

The application does not provide investment, tax, legal, or professional financial advice.

Financial summaries and charts depend on the accuracy of the information entered by the user.

Currency selection changes the displayed currency format. It does not automatically convert stored amounts using live exchange rates.

Consult a qualified professional when you need financial advice.

This document is a draft for demonstration purposes.
  `,
};

function loadSettings() {
  try {
    const savedSettings = localStorage.getItem(STORAGE_KEY);

    if (savedSettings) {
      return {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(savedSettings),
      };
    }
  } catch (error) {
    console.error("Unable to load settings:", error);
  }

  return { ...DEFAULT_SETTINGS };
}

function Settings() {
  const [settings, setSettings] = useState(loadSettings);
  const [savedSettings, setSavedSettings] = useState(loadSettings);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [activeDocument, setActiveDocument] = useState(null);

  // Apply the selected theme.
  useEffect(() => {
    const applyTheme = () => {
      const isDark =
        settings.theme === "dark" ||
        (settings.theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      document.documentElement.classList.toggle("dark", isDark);
    };

    applyTheme();

    if (settings.theme !== "system") {
      return undefined;
    }

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    mediaQuery.addEventListener("change", applyTheme);

    return () => {
      mediaQuery.removeEventListener("change", applyTheme);
    };
  }, [settings.theme]);

  function updateSetting(name, value) {
    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  }

  function showMessage(text, type = "success") {
    setMessage(text);
    setMessageType(type);
  }

  // Validate and save settings.
  function handleSaveSettings(event) {
    event.preventDefault();

    const monthlyBudget = Number(settings.monthlyBudget);
    const savingsGoal = Number(settings.savingsGoal);
    const budgetWarning = Number(settings.budgetWarning);

    if (
      settings.monthlyBudget.trim() === "" ||
      !Number.isFinite(monthlyBudget) ||
      monthlyBudget < 0
    ) {
      showMessage("Please enter a valid monthly budget.", "error");
      return;
    }

    if (
      settings.savingsGoal.trim() === "" ||
      !Number.isFinite(savingsGoal) ||
      savingsGoal < 0
    ) {
      showMessage("Please enter a valid savings goal.", "error");
      return;
    }

    if (
      settings.budgetWarning.trim() === "" ||
      !Number.isFinite(budgetWarning) ||
      budgetWarning < 1 ||
      budgetWarning > 100
    ) {
      showMessage(
        "Budget warning must be between 1 and 100.",
        "error"
      );
      return;
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settings)
      );

      setSavedSettings({ ...settings });

      window.dispatchEvent(new Event(CURRENCY_EVENT));

      showMessage("Settings saved successfully!", "success");
    } catch (error) {
      console.error("Unable to save settings:", error);

      showMessage(
        "Unable to save settings. Please check your browser storage.",
        "error"
      );
    }
  }

  // Restore defaults.
  function handleResetSettings() {
    const confirmed = window.confirm(
      "Are you sure you want to reset all settings to their default values?"
    );

    if (!confirmed) return;

    try {
      const defaults = { ...DEFAULT_SETTINGS };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaults)
      );

      setSettings(defaults);
      setSavedSettings(defaults);

      window.dispatchEvent(new Event(CURRENCY_EVENT));

      showMessage("Settings restored to defaults.", "success");
    } catch (error) {
      console.error("Unable to reset settings:", error);

      showMessage("Unable to reset settings.", "error");
    }
  }

  // Discard unsaved changes.
  function handleDiscardChanges() {
    setSettings({ ...savedSettings });
    setMessage("");
  }

  // Export settings.
  function handleExportSettings() {
    try {
      const exportData = {
        application: "FinDash",
        exportedAt: new Date().toISOString(),
        settings,
      };

      const blob = new Blob(
        [JSON.stringify(exportData, null, 2)],
        { type: "application/json" }
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "findash-settings.json";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      showMessage("Settings exported successfully.", "success");
    } catch (error) {
      console.error("Unable to export settings:", error);

      showMessage("Unable to export settings.", "error");
    }
  }

  const hasUnsavedChanges =
    JSON.stringify(settings) !== JSON.stringify(savedSettings);

  return (
    <section className="settings-page">
      {/* Page Header */}
      <div className="settings-page-header">
        <div className="settings-heading-icon">
          <SettingsIcon size={23} />
        </div>

        <div className="settings-heading-content">
          <span className="settings-eyebrow">
            APPLICATION PREFERENCES
          </span>

          <h1>Settings</h1>

          <p>
            Customize your FinDash experience, financial preferences,
            and notifications.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetSettings}
          className="settings-reset-button"
        >
          <RotateCcw size={16} />
          Reset Defaults
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <div
          role="status"
          className={`settings-message settings-message-${messageType}`}
        >
          {messageType === "error" ? (
            <AlertCircle size={19} />
          ) : (
            <CheckCircle2 size={19} />
          )}

          <span>{message}</span>
        </div>
      )}

      {hasUnsavedChanges && (
        <div className="settings-unsaved-message">
          <AlertCircle size={17} />

          <span>
            You have unsaved changes. Save your settings to apply them.
          </span>
        </div>
      )}

      <form
        className="settings-form"
        onSubmit={handleSaveSettings}
      >
        {/* General Preferences */}
        <SettingsSection
          icon={<Globe size={20} />}
          title="General Preferences"
          description="Customize how FinDash displays information."
        >
          <div className="settings-fields-grid">
            <FormField
              icon={<Wallet size={17} />}
              label="Currency"
              description="Currency formatting used throughout the app."
            >
              <select
                value={settings.currency}
                onChange={(event) =>
                  updateSetting("currency", event.target.value)
                }
                className="settings-input"
              >
                {CURRENCY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              icon={<CalendarDays size={17} />}
              label="Date Format"
              description="Choose how dates appear in the application."
            >
              <select
                value={settings.dateFormat}
                onChange={(event) =>
                  updateSetting("dateFormat", event.target.value)
                }
                className="settings-input"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </FormField>

            <FormField
              icon={<Languages size={17} />}
              label="Language"
              description="Select your preferred interface language."
            >
              <select
                value={settings.language}
                onChange={(event) =>
                  updateSetting("language", event.target.value)
                }
                className="settings-input"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Gujarati">Gujarati</option>
              </select>
            </FormField>

            <FormField
              icon={<Palette size={17} />}
              label="Appearance"
              description="Choose a light, dark, or system-based theme."
            >
              <select
                value={settings.theme}
                onChange={(event) =>
                  updateSetting("theme", event.target.value)
                }
                className="settings-input"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">Use system preference</option>
              </select>
            </FormField>
          </div>

          <div className="settings-preference-preview">
            <div className="settings-preview-icon">
              {settings.theme === "dark" ? (
                <Moon size={20} />
              ) : (
                <Sun size={20} />
              )}
            </div>

            <div className="settings-preview-content">
              <h3>Preferences Preview</h3>

              <p>
                {settings.currency} · {settings.dateFormat} ·{" "}
                {settings.language} · {settings.theme}
              </p>
            </div>

            <CheckCircle2
              size={19}
              className="settings-preview-check"
            />
          </div>
        </SettingsSection>

        {/* Financial Preferences */}
        <SettingsSection
          icon={<Wallet size={20} />}
          title="Financial Preferences"
          description="Set your budget and savings targets."
        >
          <div className="settings-fields-grid">
            <FormField
              label={`Monthly Budget (${settings.currency})`}
              description="Your target spending limit for each month."
            >
              <NumberInput
                value={settings.monthlyBudget}
                onChange={(value) =>
                  updateSetting("monthlyBudget", value)
                }
                min="0"
                step="100"
                placeholder="20000"
              />
            </FormField>

            <FormField
              label="Budget Warning (%)"
              description="The percentage of your budget that triggers a warning."
            >
              <NumberInput
                value={settings.budgetWarning}
                onChange={(value) =>
                  updateSetting("budgetWarning", value)
                }
                min="1"
                max="100"
                step="1"
                placeholder="80"
              />
            </FormField>

            <FormField
              label={`Savings Goal (${settings.currency})`}
              description="Your target savings amount."
            >
              <NumberInput
                value={settings.savingsGoal}
                onChange={(value) =>
                  updateSetting("savingsGoal", value)
                }
                min="0"
                step="500"
                placeholder="50000"
              />
            </FormField>
          </div>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection
          icon={<Bell size={20} />}
          title="Notifications"
          description="Choose which notification preferences to enable."
        >
          <div className="settings-toggle-list">
            <ToggleSetting
              title="Expense Notifications"
              description="Notifications related to expense activity."
              checked={settings.expenseNotifications}
              onChange={(value) =>
                updateSetting("expenseNotifications", value)
              }
            />

            <ToggleSetting
              title="Budget Alerts"
              description="Alerts when spending approaches your budget limit."
              checked={settings.budgetAlerts}
              onChange={(value) =>
                updateSetting("budgetAlerts", value)
              }
            />

            <ToggleSetting
              title="Monthly Summary"
              description="Monthly spending summary notifications."
              checked={settings.monthlySummary}
              onChange={(value) =>
                updateSetting("monthlySummary", value)
              }
            />

            <ToggleSetting
              title="Unusual Spending Alerts"
              description="Alerts for potentially unusual spending."
              checked={settings.unusualSpendingAlerts}
              onChange={(value) =>
                updateSetting("unusualSpendingAlerts", value)
              }
            />

            <ToggleSetting
              title="Email Notifications"
              description="Save your preference for email notifications."
              checked={settings.emailNotifications}
              onChange={(value) =>
                updateSetting("emailNotifications", value)
              }
            />
          </div>

          <div className="settings-info-note">
            <AlertCircle size={16} />

            <p>
              These switches save your preferences. Actual notification
              delivery requires additional implementation.
            </p>
          </div>
        </SettingsSection>

        {/* Privacy and Legal */}
        <SettingsSection
          icon={<ShieldCheck size={20} />}
          title="Privacy & Legal"
          description="Review information about your data and use of FinDash."
        >
          <div className="settings-document-grid">
            {Object.keys(DOCUMENTS).map((documentName) => (
              <button
                key={documentName}
                type="button"
                onClick={() => setActiveDocument(documentName)}
                className="settings-document-button"
              >
                <div className="settings-document-icon">
                  <FileText size={19} />
                </div>

                <span>{documentName}</span>

                <ChevronRight
                  size={17}
                  className="settings-document-arrow"
                />
              </button>
            ))}
          </div>

          <p className="settings-legal-note">
            Legal documents are draft examples and should be reviewed
            before production use.
          </p>
        </SettingsSection>

        {/* Data Export */}
        <SettingsSection
          icon={<Download size={20} />}
          title="Data & Export"
          description="Download a copy of your current application settings."
        >
          <div className="settings-export-card">
            <div className="settings-export-icon">
              <Download size={21} />
            </div>

            <div className="settings-export-content">
              <h3>Export Settings</h3>

              <p>
                Download your preferences as a JSON file.
              </p>

              <span>
                Includes settings only, not expenses or profile data.
              </span>
            </div>

            <button
              type="button"
              onClick={handleExportSettings}
              className="settings-export-button"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </SettingsSection>

        {/* Help */}
        <SettingsSection
          icon={<HelpCircle size={20} />}
          title="Help & Information"
          description="Information about your current application setup."
        >
          <div className="settings-help-card">
            <div className="settings-help-icon">
              <HelpCircle size={21} />
            </div>

            <div>
              <h3>FinDash Financial Workspace</h3>

              <p>
                FinDash helps you record expenses, review spending
                patterns, and manage financial preferences.
              </p>

              <span>Current version: Frontend prototype</span>
            </div>
          </div>
        </SettingsSection>

        {/* Save Actions */}
        <div className="settings-save-bar">
          <div className="settings-save-status">
            <span
              className={`settings-save-indicator ${
                hasUnsavedChanges ? "is-pending" : "is-saved"
              }`}
            />

            <span>
              {hasUnsavedChanges
                ? "Unsaved changes"
                : "All changes saved"}
            </span>
          </div>

          <div className="settings-save-actions">
            <button
              type="button"
              onClick={handleDiscardChanges}
              disabled={!hasUnsavedChanges}
              className="settings-discard-button"
            >
              <X size={16} />
              Discard
            </button>

            <button
              type="submit"
              disabled={!hasUnsavedChanges}
              className="settings-save-button"
            >
              <Save size={17} />
              Save Settings
            </button>
          </div>
        </div>
      </form>

      {/* Legal Document Modal */}
      {activeDocument && (
        <div
          className="settings-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveDocument(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-document-title"
            className="settings-document-modal"
          >
            <div className="settings-modal-header">
              <div>
                <span>FINDASH LEGAL</span>

                <h2 id="settings-document-title">
                  {activeDocument}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setActiveDocument(null)}
                aria-label="Close document"
                className="settings-modal-close"
              >
                <X size={20} />
              </button>
            </div>

            <pre className="settings-document-content">
              {DOCUMENTS[activeDocument]}
            </pre>

            <div className="settings-modal-footer">
              <button
                type="button"
                onClick={() => setActiveDocument(null)}
                className="settings-modal-done-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* Reusable section */
function SettingsSection({
  icon,
  title,
  description,
  children,
}) {
  return (
    <section className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-icon">{icon}</div>

        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      {children}
    </section>
  );
}

/* Reusable form field */
function FormField({
  icon,
  label,
  description,
  children,
}) {
  return (
    <div className="settings-field">
      <label className="settings-field-label">
        {icon && (
          <span className="settings-field-label-icon">{icon}</span>
        )}

        {label}
      </label>

      {children}

      {description && (
        <p className="settings-field-description">{description}</p>
      )}
    </div>
  );
}

/* Reusable number input */
function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      className="settings-input"
    />
  );
}

/* Reusable toggle */
function ToggleSetting({
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="settings-toggle-row">
      <div className="settings-toggle-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`settings-toggle ${
          checked ? "is-checked" : ""
        }`}
      >
        <span />
      </button>
    </div>
  );
}

export default Settings;