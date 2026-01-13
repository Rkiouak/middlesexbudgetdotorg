"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";

// Data from comprehensive_analysis.md tables (2020-2025)
const inflationData = [
  {
    year: "2020",
    budget: 2.36,    // FY2020 budget increase
    cpiU: 1.3,
    eci: 2.7,
    nhcci: 6.5,
    materials: 2.5,
  },
  {
    year: "2021",
    budget: 11.45,   // FY2021 budget increase
    cpiU: 4.0,
    eci: 2.6,
    nhcci: -3.0,
    materials: 13.4,
  },
  {
    year: "2022",
    budget: 4.45,    // FY2022 budget increase
    cpiU: 7.1,
    eci: 3.8,
    nhcci: 20.0,
    materials: 15.8,
  },
  {
    year: "2023",
    budget: 8.73,    // FY2023 budget increase
    cpiU: 3.3,
    eci: 4.6,
    nhcci: 25.2,
    materials: 5.6,
  },
  {
    year: "2024",
    budget: 10.24,   // FY2024 budget increase
    cpiU: 3.4,
    eci: 4.8,
    nhcci: 12.2,
    materials: 3.2,
  },
  {
    year: "2025",
    budget: 11.36,   // FY2025 budget increase
    cpiU: 2.7,       // estimated
    eci: 3.5,
    nhcci: 4.0,      // estimated
    materials: 2.6,
  },
];

const lineColors = {
  budget: "#1e4d2b",    // Dark green - Middlesex budget
  cpiU: "#6b7280",      // Gray - CPI-U
  eci: "#0ea5e9",       // Sky blue - ECI
  nhcci: "#ea580c",     // Orange - Highway costs
  materials: "#8b5cf6", // Purple - Materials
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 shadow-lg rounded px-3 py-2 text-sm">
        <p className="font-semibold text-gray-800 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-xs">
            {entry.name}: {entry.value > 0 ? "+" : ""}{entry.value.toFixed(1)}%
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function InflationComparisonChart() {
  return (
    <section className="py-6 px-4 border-b-2 border-gray-200 bg-white" aria-labelledby="inflation-chart-heading">
      <div className="max-w-4xl mx-auto">
        <h2 id="inflation-chart-heading" className="text-lg font-semibold text-gray-800 mb-1">
          Budget Growth vs. Inflation Indices (2020-2025)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Middlesex budget increases compared to CPI-U, government wages (ECI), highway construction (NHCCI), and road materials
        </p>

        <div className="h-72 md:h-80" role="img" aria-label="Line chart comparing budget growth to various inflation indices">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={inflationData}
              margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
            >
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11, fill: '#4b5563' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                domain={[-5, 30]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="line"
              />
              <ReferenceLine y={0} stroke="#e5e7eb" strokeDasharray="3 3" />

              <Line
                type="monotone"
                dataKey="budget"
                name="Middlesex Budget"
                stroke={lineColors.budget}
                strokeWidth={3}
                dot={{ fill: lineColors.budget, strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="cpiU"
                name="CPI-U"
                stroke={lineColors.cpiU}
                strokeWidth={2}
                dot={{ fill: lineColors.cpiU, strokeWidth: 0, r: 3 }}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="eci"
                name="ECI (Gov. Wages)"
                stroke={lineColors.eci}
                strokeWidth={2}
                dot={{ fill: lineColors.eci, strokeWidth: 0, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="nhcci"
                name="Highway Costs"
                stroke={lineColors.nhcci}
                strokeWidth={2}
                dot={{ fill: lineColors.nhcci, strokeWidth: 0, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="materials"
                name="Materials"
                stroke={lineColors.materials}
                strokeWidth={2}
                dot={{ fill: lineColors.materials, strokeWidth: 0, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Sources: Town Reports, BLS CPI-U Northeast, BLS Employment Cost Index, FHWA NHCCI, BLS PPI Construction Materials. 2025 values are estimates.
        </p>
      </div>
    </section>
  );
}
