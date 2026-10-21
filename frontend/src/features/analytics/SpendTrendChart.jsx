import { useMemo } from "react";
import { TrendingUp } from "lucide-react";

import "../../assets/css/analytics/SpendTrendChart.css";
import { formatCurrency, useCurrency } from "../../utils/currency";

function SpendTrendChart({ expenses = [] }) {
  const currency = useCurrency();

  const chartData = useMemo(() => {
    const totals = new Map();

    expenses.forEach((expense) => {
      const dateString = String(expense.date || "");
      const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

      const date = match
        ? new Date(
            Number(match[1]),
            Number(match[2]) - 1,
            Number(match[3])
          )
        : new Date(dateString);

      const amount = Number(expense.amount);

      if (!Number.isFinite(date.getTime()) || !Number.isFinite(amount)) {
        return;
      }

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      totals.set(key, (totals.get(key) || 0) + amount);
    });

    return Array.from(totals.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, amount]) => {
        const [year, month] = key.split("-").map(Number);

        return {
          month: new Date(year, month - 1, 1).toLocaleDateString(
            "en-IN",
            { month: "short", year: "2-digit" }
          ),
          amount,
        };
      });
  }, [expenses]);

  const totalSpending = chartData.reduce(
    (total, item) => total + item.amount,
    0
  );

  const averageSpending = chartData.length
    ? totalSpending / chartData.length
    : 0;

  // SVG chart dimensions
  const width = 700;
  const height = 260;
  const padding = { top: 25, right: 25, bottom: 40, left: 85 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const maxAmount = Math.max(
    1000,
    ...chartData.map((item) => item.amount)
  );

  const points = chartData.map((item, index) => {
    const x =
      chartData.length === 1
        ? padding.left + plotWidth / 2
        : padding.left +
          (index / (chartData.length - 1)) * plotWidth;

    const y =
      padding.top +
      plotHeight -
      (item.amount / maxAmount) * plotHeight;

    return { ...item, x, y };
  });

  const linePath = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${
          padding.top + plotHeight
        } L ${points[0].x} ${padding.top + plotHeight} Z`
      : "";

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <section className="spending-chart">
      <div className="spending-chart-header">
        <div>
          <span className="spending-chart-eyebrow">
            FINANCIAL ACTIVITY
          </span>

          <h2 className="spending-chart-title">
            Monthly Spending
          </h2>

          <p className="spending-chart-description">
            Track your expenses over time.
          </p>
        </div>

        <div className="spending-chart-icon">
          <TrendingUp size={20} color="#34764c" />
        </div>
      </div>

      <div className="spending-chart-summary">
        <div>
          <span className="spending-summary-label">
            Total recorded
          </span>

          <strong className="spending-summary-value">
            {formatCurrency(totalSpending, currency)}
          </strong>
        </div>

        <div className="spending-summary-divider" />

        <div>
          <span className="spending-summary-label">
            Monthly average
          </span>

          <strong className="spending-summary-value">
            {formatCurrency(averageSpending, currency)}
          </strong>
        </div>
      </div>

      <div className="spending-chart-body">
        {points.length > 0 ? (
          <svg
            className="spending-svg-chart"
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="Monthly spending trend"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient
                id="spendingSvgGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#34764c"
                  stopOpacity="0.24"
                />
                <stop
                  offset="100%"
                  stopColor="#34764c"
                  stopOpacity="0.02"
                />
              </linearGradient>
            </defs>

            {gridLines.map((fraction) => {
              const y = padding.top + plotHeight * fraction;
              const value = maxAmount * (1 - fraction);

              return (
                <g key={fraction}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="#e8eee7"
                    strokeDasharray="4 5"
                  />

                  <text
                    x={padding.left - 12}
                    y={y + 4}
                    textAnchor="end"
                    fill="#89948a"
                    fontSize="11"
                  >
                    {value >= 1000
                      ? `₹${Math.round(value / 1000)}k`
                      : `₹${Math.round(value)}`}
                  </text>
                </g>
              );
            })}

            <path d={areaPath} fill="url(#spendingSvgGradient)" />

            <path
              d={linePath}
              fill="none"
              stroke="#286745"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {points.map((point) => (
              <g key={point.month}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="#ffffff"
                  stroke="#286745"
                  strokeWidth="3"
                />

                <text
                  x={point.x}
                  y={height - 12}
                  textAnchor="middle"
                  fill="#738276"
                  fontSize="12"
                >
                  {point.month}
                </text>
              </g>
            ))}
          </svg>
        ) : (
          <div className="spending-chart-empty">
            <div className="spending-empty-icon">₹</div>
            <h3>No spending data yet</h3>
            <p>Add expenses to see your monthly spending trend.</p>
          </div>
        )}
      </div>

      <div className="spending-chart-footer">
        <span className="spending-chart-legend">
          <span className="spending-legend-dot" />
          Monthly expenses
        </span>

        <span className="spending-chart-period">
          {chartData.length}{" "}
          {chartData.length === 1 ? "month" : "months"} recorded
        </span>
      </div>
    </section>
  );
}

export default SpendTrendChart;