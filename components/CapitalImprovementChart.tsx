"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Capital Improvement Program (CIP) funding by category
// Before FY2019: No dedicated capital improvement funds — equipment purchased via emergency loans
// FY2019: First dedicated fund (Town Garage Building Fund, $5K)
// FY2020-2021: Town Hall Building Fund added ($10K)
// FY2022: CIP formalized with Bridge Fund and Paving & Construction Fund
// FY2025: Asset-Equipment Fund added ($50K) — biggest structural change
// Source: Town Reports and proposed budgets
const CIP_DATA = [
  {
    year: "FY18",
    buildings: 0,
    infrastructure: 0,
    equipment: 0,
    other: 0,
    total: 0,
  },
  {
    year: "FY19",
    buildings: 5000,
    infrastructure: 0,
    equipment: 0,
    other: 0,
    total: 5000,
  },
  {
    year: "FY20",
    buildings: 15000,
    infrastructure: 0,
    equipment: 0,
    other: 0,
    total: 15000,
  },
  {
    year: "FY21",
    buildings: 15000,
    infrastructure: 0,
    equipment: 0,
    other: 0,
    total: 15000,
  },
  {
    year: "FY22",
    buildings: 15000,
    infrastructure: 36000,
    equipment: 0,
    other: 0,
    total: 51000,
  },
  {
    year: "FY23",
    buildings: 15000,
    infrastructure: 26000,
    equipment: 0,
    other: 5000,
    total: 46000,
  },
  {
    year: "FY24",
    buildings: 15000,
    infrastructure: 36000,
    equipment: 0,
    other: 5000,
    total: 56000,
  },
  {
    year: "FY25",
    buildings: 35000,
    infrastructure: 36000,
    equipment: 50000,
    other: 5000,
    total: 126000,
  },
  {
    year: "FY26",
    buildings: 15000,
    infrastructure: 36000,
    equipment: 50000,
    other: 0,
    total: 101000,
  },
  {
    year: "FY27",
    buildings: 15000,
    infrastructure: 36000,
    equipment: 50000,
    other: 25000,
    total: 126000,
  },
];

const formatCurrency = (value: number) => {
  if (value === 0) return "$0";
  return `$${(value / 1000).toFixed(0)}K`;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    name: string;
    color: string;
    payload: (typeof CIP_DATA)[number];
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;

    const details: { label: string; items: string[] }[] = [];
    if (item.buildings > 0) {
      const parts = [];
      if (item.year >= "FY20") parts.push("Town Hall Building Fund");
      parts.push("Highway Garage Fund");
      details.push({ label: "Buildings", items: parts });
    }
    if (item.infrastructure > 0) {
      details.push({
        label: "Infrastructure",
        items: ["Bridge Fund", "Paving & Construction Fund"],
      });
    }
    if (item.equipment > 0) {
      details.push({
        label: "Equipment",
        items: ["Asset-Equipment Fund"],
      });
    }
    if (item.other > 0) {
      const parts = [];
      if (item.year === "FY27") {
        parts.push("Reappraisal Fund ($20K)");
        parts.push("Tennis Court Rehab ($5K)");
      } else {
        parts.push("Tennis Court Rehab");
      }
      details.push({ label: "Other", items: parts });
    }

    return (
      <div className="bg-white border border-gray-200 shadow-lg rounded px-3 py-2 text-sm">
        <p className="font-semibold text-gray-800">
          {label}
          {label === "FY27" ? " (Proposed)" : ""}
          {label === "FY18" ? " — No CIP" : ""}
        </p>
        <p className="text-gray-700 font-medium">
          Total: {formatCurrency(item.total)}
        </p>
        {details.length > 0 && (
          <div className="mt-1 text-xs text-gray-500 max-w-56">
            {details.map((d) => (
              <p key={d.label}>
                {d.label}: {d.items.join(", ")}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }
  return null;
}

export default function CapitalImprovementChart() {
  return (
    <section
      className="py-6 px-4 border-b border-gray-200 bg-gray-50"
      aria-labelledby="cip-chart-heading"
    >
      <div className="max-w-4xl mx-auto">
        <h3
          id="cip-chart-heading"
          className="text-lg font-semibold text-gray-800 mb-1"
        >
          Capital Improvement Funding: FY2018 &rarr; FY2027
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          From $0 to $126K &mdash; but is it enough for $3&ndash;4M in
          5-year capital needs?
        </p>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs mb-4">
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded"
              style={{ backgroundColor: "#1e4d2b" }}
            ></span>
            <span className="text-gray-600">
              Buildings (Town Hall, Garage)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded"
              style={{ backgroundColor: "#2563eb" }}
            ></span>
            <span className="text-gray-600">
              Infrastructure (Bridge, Paving)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded"
              style={{ backgroundColor: "#d97706" }}
            ></span>
            <span className="text-gray-600">Equipment</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded"
              style={{ backgroundColor: "#6b7280" }}
            ></span>
            <span className="text-gray-600">
              Other (Reappraisal, Tennis)
            </span>
          </div>
        </div>

        <div
          className="h-64 md:h-72"
          role="img"
          aria-label="Stacked bar chart showing Capital Improvement Program funding growth from FY2018 to FY2027"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={CIP_DATA}
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
                wrapperStyle={{ fontSize: 0, height: 0, overflow: "hidden" }}
              />
              <Bar
                dataKey="buildings"
                name="Buildings"
                stackId="cip"
                fill="#1e4d2b"
              />
              <Bar
                dataKey="infrastructure"
                name="Infrastructure"
                stackId="cip"
                fill="#2563eb"
              />
              <Bar
                dataKey="equipment"
                name="Equipment"
                stackId="cip"
                fill="#d97706"
              />
              <Bar
                dataKey="other"
                name="Other"
                stackId="cip"
                fill="#6b7280"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Source: Town Reports FY2018–FY2026, FY2027 Proposed Budget. Buildings
          = Town Hall Building Fund + Highway Garage Fund. Infrastructure =
          Bridge Fund + Paving &amp; Construction Fund. Equipment =
          Asset-Equipment Fund (added FY2025). Other = Reappraisal Fund (FY2027)
          + Tennis Court Rehab.
        </p>
      </div>
    </section>
  );
}
