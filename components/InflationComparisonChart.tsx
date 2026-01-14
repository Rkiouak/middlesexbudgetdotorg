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

// Data from comprehensive_analysis.md tables (2020-2026)
// 2025 and 2026 values are estimates
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
  {
    year: "2026",
    budget: 9.83,    // FY2026 budget increase
    cpiU: null,      // not yet available
    eci: null,       // not yet available
    nhcci: null,     // not yet available
    materials: null, // not yet available
  },
  {
    year: "2027",
    budget: 13.16,   // FY2027 budget increase (proposed)
    cpiU: null,      // not yet available
    eci: null,       // not yet available
    nhcci: null,     // not yet available
    materials: null, // not yet available
  },
];

const lineColors = {
  budget: "#1e4d2b",    // Dark green - Middlesex budget (PRIMARY)
  cpiU: "#9ca3af",      // Light gray - CPI-U
  eci: "#7dd3fc",       // Light sky blue - ECI
  nhcci: "#fdba74",     // Light orange - Highway costs
  materials: "#c4b5fd", // Light purple - Materials
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
        <p className="font-semibold text-gray-800 mb-1">{label}{label === "2027" ? " (Proposed)" : ""}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-xs">
            {entry.name}: {entry.value !== null ? `${entry.value > 0 ? "+" : ""}${entry.value.toFixed(1)}%` : "N/A"}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function InflationComparisonChart() {
  return (
    <div className="not-prose">
      <div className="h-72 md:h-80 bg-gray-50 rounded-lg p-4" role="img" aria-label="Line chart comparing budget growth to various inflation indices">
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
              wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }}
              iconType="plainline"
              formatter={(value) => (
                <span style={{
                  color: value === "Middlesex Budget" ? '#1e4d2b' : '#6b7280',
                  fontWeight: value === "Middlesex Budget" ? 600 : 400
                }}>
                  {value}
                </span>
              )}
            />
            <ReferenceLine y={0} stroke="#e5e7eb" strokeDasharray="3 3" />

            {/* Middlesex Budget - PRIMARY LINE */}
            <Line
              type="monotone"
              dataKey="budget"
              name="Middlesex Budget"
              stroke={lineColors.budget}
              strokeWidth={4}
              dot={{ fill: lineColors.budget, strokeWidth: 2, stroke: '#fff', r: 5 }}
              activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }}
            />
            {/* Secondary lines - all dashed/dotted, thinner, less prominent */}
            <Line
              type="monotone"
              dataKey="cpiU"
              name="CPI-U"
              stroke={lineColors.cpiU}
              strokeWidth={1.5}
              dot={{ fill: lineColors.cpiU, strokeWidth: 0, r: 2 }}
              strokeDasharray="6 4"
            />
            <Line
              type="monotone"
              dataKey="eci"
              name="ECI (Gov. Wages)"
              stroke={lineColors.eci}
              strokeWidth={1.5}
              dot={{ fill: lineColors.eci, strokeWidth: 0, r: 2 }}
              strokeDasharray="6 4"
            />
            <Line
              type="monotone"
              dataKey="nhcci"
              name="Highway Costs"
              stroke={lineColors.nhcci}
              strokeWidth={1.5}
              dot={{ fill: lineColors.nhcci, strokeWidth: 0, r: 2 }}
              strokeDasharray="6 4"
            />
            <Line
              type="monotone"
              dataKey="materials"
              name="Materials"
              stroke={lineColors.materials}
              strokeWidth={1.5}
              dot={{ fill: lineColors.materials, strokeWidth: 0, r: 2 }}
              strokeDasharray="6 4"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Sources: Town Reports, BLS CPI-U Northeast, BLS Employment Cost Index, FHWA NHCCI, BLS PPI Construction Materials. 2025 inflation values are estimates. FY2027 budget is proposed; 2026-2027 inflation indices not yet available.
      </p>
    </div>
  );
}
