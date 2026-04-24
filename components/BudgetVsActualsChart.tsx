"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

// Town Office Staff: budgeted vs actual spending
// Same scope as growth chart: Clerk, Ass't Clerk, Treasurer/Finance wages + all benefits
// Only years with both budgeted AND actual data available
// Source: Administration section of Town Report CSVs
const BUDGET_VS_ACTUAL = [
  {
    year: "FY18",
    budgeted: 57515,
    actual: 60744,
    note: "",
  },
  {
    year: "FY21",
    budgeted: 75377,
    actual: 81691,
    note: "Health actual $13.3K vs $7.3K budget",
  },
  {
    year: "FY22",
    budgeted: 113065,
    actual: 116111,
    note: "Health actual $19.4K vs $7.6K budget",
  },
  {
    year: "FY24",
    budgeted: 135941,
    actual: 128187,
    note: "",
  },
  {
    year: "FY25",
    budgeted: 141468,
    actual: 157330,
    note: "Wages over by $12K, overtime hours",
  },
];

const formatCurrency = (value: number) => {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  return `$${(value / 1000).toFixed(0)}K`;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    payload: (typeof BUDGET_VS_ACTUAL)[number];
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const variance = item.actual - item.budgeted;
    const variancePct = ((variance / item.budgeted) * 100).toFixed(0);

    return (
      <div className="bg-white border border-gray-200 shadow-lg rounded px-3 py-2 text-sm">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-gray-600">
          Budgeted: {formatCurrency(item.budgeted)}
        </p>
        <p className="text-gray-600">
          Actual: {formatCurrency(item.actual)}
        </p>
        <p
          className={`font-medium ${variance > 0 ? "text-red-600" : "text-emerald-600"}`}
        >
          {variance > 0 ? "+" : ""}
          {formatCurrency(variance)} ({variancePct}%)
        </p>
        {item.note && (
          <p className="text-gray-500 text-xs mt-1 max-w-52">{item.note}</p>
        )}
      </div>
    );
  }
  return null;
}

export default function BudgetVsActualsChart() {
  const firstBudget = BUDGET_VS_ACTUAL[0].budgeted;
  const lastActual = BUDGET_VS_ACTUAL[BUDGET_VS_ACTUAL.length - 1].actual;
  const totalPct = (((lastActual - firstBudget) / firstBudget) * 100).toFixed(0);

  return (
    <section
      className="py-6 px-4 border-b border-gray-200 bg-gray-50"
      aria-labelledby="budget-actuals-heading"
    >
      <div className="max-w-4xl mx-auto">
        <h3
          id="budget-actuals-heading"
          className="text-lg font-semibold text-gray-800 mb-1"
        >
          Town Office Staff: Budgeted vs. Actual Spending
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          FY18 budgeted to FY25 actual: <span className="italic">+{totalPct}%</span>
          {" "}&middot; what the town budgets and what it spends are often different
        </p>

        <div
          className="h-64 md:h-72"
          role="img"
          aria-label="Grouped bar chart comparing budgeted vs actual Town Office staff spending"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={BUDGET_VS_ACTUAL}
              margin={{ top: 15, right: 10, left: 10, bottom: 5 }}
            >
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11, fill: "#4b5563" }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                domain={[0, "auto"]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                iconType="square"
                iconSize={10}
              />
              <Bar
                dataKey="budgeted"
                name="Budgeted"
                fill="#1e4d2b"
                radius={[4, 4, 0, 0]}
              />
              <Bar dataKey="actual" name="Actual" radius={[4, 4, 0, 0]}>
                {BUDGET_VS_ACTUAL.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.actual > entry.budgeted ? "#dc2626" : "#6b7280"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Source: Town Reports. Includes office wages (Clerk, Ass&apos;t Clerk,
          Treasurer/Finance), payroll tax, retirement, health insurance,
          life/LTD, and workers comp. Only fiscal years with both budgeted and
          actual data are shown.
        </p>
      </div>
    </section>
  );
}
