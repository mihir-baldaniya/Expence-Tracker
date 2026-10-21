import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Tags } from "lucide-react";

import "../../assets/css/analytics/CategoryBreakdown.css";
import { formatCurrency, useCurrency } from "../../utils/currency";

const CATEGORY_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#0ea5e9",
  "#ec4899",
  "#8b5cf6",
];

function CategoryBreakdown({ expenses = [] }) {
  const currency = useCurrency();

  const categoryData = useMemo(() => {
    const totals = expenses.reduce((result, expense) => {
      const category = expense.category || "Other";
      const amount = Number(expense.amount || 0);

      if (!Number.isFinite(amount)) {
        return result;
      }

      result[category] = (result[category] || 0) + amount;

      return result;
    }, {});

    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((first, second) => second.value - first.value);
  }, [expenses]);

  const total = categoryData.reduce((sum, category) => sum + category.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) {
      return null;
    }

    const category = payload[0].payload;

    return (
      <div className="category-chart-tooltip">
        <span className="category-tooltip-label">{category.name}</span>

        <strong className="category-tooltip-amount">
          {formatCurrency(category.value, currency)}
        </strong>

        <span className="category-tooltip-percentage">
          {total > 0
            ? `${((category.value / total) * 100).toFixed(1)}% of expenses`
            : "0% of expenses"}
        </span>
      </div>
    );
  };

  return (
    <section className="category-breakdown">
      {/* Header */}
      <div className="category-breakdown-header">
        <div>
          <span className="category-breakdown-eyebrow">
            SPENDING DISTRIBUTION
          </span>

          <h2 className="category-breakdown-title">Expense Categories</h2>

          <p className="category-breakdown-description">
            Where your money goes
          </p>
        </div>

        <div className="category-breakdown-icon">
          <Tags size={19} strokeWidth={1.8} />
        </div>
      </div>

      {categoryData.length > 0 ? (
        <>
          {/* Chart */}
          <div className="category-chart-container">
            <div className="category-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="57%"
                    outerRadius="82%"
                    paddingAngle={3}
                    stroke="#ffffff"
                    strokeWidth={2}
                    isAnimationActive={false}
                  >
                    {categoryData.map((category, index) => (
                      <Cell
                        key={category.name}
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip />}
                    position={{ x: 0, y: 0 }}
                    wrapperStyle={{
                      left: "auto",
                      right: 0,
                      top: 0,
                      pointerEvents: "none",
                      zIndex: 10,
                    }}
                  />{" "}
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Center total */}
            <div className="category-chart-center">
              <span>Total expenses</span>

              <strong>{formatCurrency(total, currency)}</strong>

              <small>
                {categoryData.length}{" "}
                {categoryData.length === 1 ? "category" : "categories"}
              </small>
            </div>
          </div>

          {/* Category list */}
          <div className="category-list-header">
            <span>Category</span>
            <span>Amount</span>
          </div>

          <div className="category-list">
            {categoryData.map((category, index) => {
              const percentage = total > 0 ? (category.value / total) * 100 : 0;

              const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

              return (
                <div className="category-list-item" key={category.name}>
                  <div className="category-list-main">
                    <div className="category-list-name">
                      <span
                        className="category-color-dot"
                        style={{ backgroundColor: color }}
                      />

                      <span className="category-name">{category.name}</span>
                    </div>

                    <strong className="category-list-amount">
                      {formatCurrency(category.value, currency)}
                    </strong>
                  </div>

                  <div className="category-progress-track">
                    <div
                      className="category-progress-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="category-breakdown-footer">
            <span className="category-footer-dot" />

            <span>Based on recorded expenses</span>
          </div>
        </>
      ) : (
        <div className="category-breakdown-empty">
          <div className="category-empty-icon">
            <Tags size={22} />
          </div>

          <h3>No categories yet</h3>

          <p>Add expenses to see how your spending is distributed.</p>
        </div>
      )}
    </section>
  );
}

export default CategoryBreakdown;
