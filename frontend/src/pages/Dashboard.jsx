import { CalendarDays, ArrowUpRight, Leaf } from "lucide-react";

import "../assets/css/pages/Dashboard.css";

import SummaryCards from "../features/analytics/SummaryCards";
import SpendTrendChart from "../features/analytics/SpendTrendChart";
import CategoryBreakdown from "../features/analytics/CategoryBreakdown";
import RecentTransactions from "../features/expenses/RecentTransactions";

import useExpenseStorage from "../features/expenses/useExpenseStorage";

function Dashboard() {
  const { expenses } = useExpenseStorage();

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="dashboard-page">
      {/* Dashboard heading */}
      <section className="dashboard-header">
        <div className="dashboard-heading-content">
          <span className="dashboard-eyebrow">
            <span className="dashboard-status-dot" />
            Financial overview
          </span>

          <h1 className="dashboard-title">Dashboard</h1>

          <p className="dashboard-description">
            Track your spending and understand your financial activity.
          </p>
        </div>

        <div className="dashboard-date-card">
          <div className="dashboard-date-icon">
            <CalendarDays size={20} />
          </div>

          <div className="dashboard-date-content">
            <span>Today's date</span>
            <p>{currentDate}</p>
          </div>
        </div>
      </section>

      {/* Financial summary */}
      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <h2 className="dashboard-section-title">
              Financial summary
            </h2>

            <p className="dashboard-section-description">
              An overview of your recorded expenses.
            </p>
          </div>

          <span className="dashboard-section-badge">
            <Leaf size={15} />
            Financial overview
          </span>
        </div>

        <SummaryCards expenses={expenses} />
      </section>

      {/* Spending analytics */}
      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <h2 className="dashboard-section-title">
              Spending analytics
            </h2>

            <p className="dashboard-section-description">
              Explore your monthly spending and expense categories.
            </p>
          </div>
        </div>

        <div className="dashboard-analytics-grid">
          <div className="dashboard-panel dashboard-trend-panel">
            <SpendTrendChart expenses={expenses} />
          </div>

          <div className="dashboard-panel dashboard-category-panel">
            <CategoryBreakdown expenses={expenses} />
          </div>
        </div>
      </section>

      {/* Recent transactions */}
      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <h2 className="dashboard-section-title">
              Recent transactions
            </h2>

            <p className="dashboard-section-description">
              Review your latest recorded expenses.
            </p>
          </div>

          <span className="dashboard-activity-badge">
            <span className="dashboard-status-dot" />
            Recent activity
            <ArrowUpRight size={15} />
          </span>
        </div>

        <div className="dashboard-transactions-panel">
          <RecentTransactions expenses={expenses} />
        </div>
      </section>

    </main>
  );
}

export default Dashboard;