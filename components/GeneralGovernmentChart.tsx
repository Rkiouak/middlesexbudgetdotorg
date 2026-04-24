"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  ReferenceLine,
} from "recharts";

// Town Office Staff costs: Clerk, Ass't Clerk, Treasurer/Finance, Bookkeeper
// wages + payroll tax + retirement + unemployment + health + life/LTD + workers comp + dental/vision
// Excludes: Listers, Selectboard, FEMA, Town Administrator, auditing, supplies, etc.
// Source: Administration section of each fiscal year's Town Report CSV
const STAFF_DATA = [
  { year: "FY18", budget: 57515, note: "" },
  { year: "FY19", budget: 63365, note: "" },
  { year: "FY20", budget: 67350, note: "" },
  { year: "FY21", budget: 75377, note: "" },
  { year: "FY22", budget: 113065, note: "Wages nearly doubled ($58K→$93K)" },
  { year: "FY23", budget: 128699, note: "Health insurance tripled ($7.6K→$28.6K)" },
  { year: "FY24", budget: 135941, note: "" },
  { year: "FY25", budget: 141468, note: "" },
  { year: "FY26", budget: 174934, note: "Clerk/Treasurer split into two full-time roles" },
  { year: "FY27", budget: 245425, note: "Health jumps to $92K (MVP Gold plan)" },
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
    payload: (typeof STAFF_DATA)[number];
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const prevIndex = STAFF_DATA.findIndex((d) => d.year === item.year) - 1;
    const prev = prevIndex >= 0 ? STAFF_DATA[prevIndex] : null;
    const pctChange = prev
      ? (((item.budget - prev.budget) / prev.budget) * 100).toFixed(1)
      : null;

    return (
      <div className="bg-white border border-gray-200 shadow-lg rounded px-3 py-2 text-sm">
        <p className="font-semibold text-gray-800">
          {item.year}
          {item.year === "FY27" ? " (Proposed)" : ""}
        </p>
        <p className="text-gray-700">
          {formatCurrency(item.budget)}
          {pctChange && (
            <span className="text-gray-500 ml-1">
              ({Number(pctChange) > 0 ? "+" : ""}
              {pctChange}% YoY)
            </span>
          )}
        </p>
        {item.note && (
          <p className="text-gray-500 text-xs mt-1 max-w-52">{item.note}</p>
        )}
      </div>
    );
  }
  return null;
}

export default function GeneralGovernmentChart() {
  const first = STAFF_DATA[0].budget;
  const last = STAFF_DATA[STAFF_DATA.length - 1].budget;
  const totalGrowthPct = (((last - first) / first) * 100).toFixed(0);

  return (
    <section
      className="py-6 px-4 border-b border-gray-200 bg-gray-50"
      aria-labelledby="gen-gov-chart-heading"
    >
      <div className="max-w-4xl mx-auto">
        <h3
          id="gen-gov-chart-heading"
          className="text-lg font-semibold text-gray-800 mb-1"
        >
          Town Office Staff Costs: FY2018 &rarr; FY2027
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          <span className="italic">+{totalGrowthPct}% growth over 10 years</span>{" "}
          &middot; Clerk, Assistant Clerk, Treasurer &amp; benefits
        </p>

        <div
          className="h-64 md:h-72"
          role="img"
          aria-label="Bar chart showing Town Office staff costs from FY2018 to FY2027"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={STAFF_DATA}
              margin={{ top: 25, right: 10, left: 10, bottom: 5 }}
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
              <ReferenceLine y={0} stroke="#e5e7eb" />
              <Bar dataKey="budget" radius={[4, 4, 0, 0]}>
                {STAFF_DATA.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.year === "FY27"
                        ? "#0d9488" // Teal: proposed
                        : entry.year >= "FY26"
                          ? "#d97706" // Amber: restructured roles
                          : "#059669" // Green: baseline
                    }
                  />
                ))}
                <LabelList
                  dataKey="budget"
                  position="top"
                  formatter={(value) => {
                    if (typeof value !== 'number') return '';
                    return formatCurrency(value);
                  }}
                  style={{ fontSize: 9, fill: "#374151", fontWeight: 500 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Source: Town Reports FY2018–FY2026, FY2027 Proposed Budget. Includes
          office wages (Clerk, Ass&apos;t Clerk, Treasurer/Finance), payroll tax,
          retirement, health insurance, life/LTD, workers comp, and dental/vision.
          Excludes Listers, Selectboard, FEMA, Town Administrator.
        </p>
      </div>
    </section>
  );
}
