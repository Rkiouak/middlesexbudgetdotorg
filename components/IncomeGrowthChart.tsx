"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Income data from ACS 5-Year Estimates and FRED (2019-2024)
const incomeData = [
  {
    year: "2019",
    middlesexMedian: 82868,
    washCoMedian: 65879,
    middlesexPerCapita: 44152,
    washCoPerCapita: null,
  },
  {
    year: "2020",
    middlesexMedian: 96250,
    washCoMedian: 70061,
    middlesexPerCapita: 49890,
    washCoPerCapita: null,
  },
  {
    year: "2021",
    middlesexMedian: 98750,
    washCoMedian: 75692,
    middlesexPerCapita: 53412,
    washCoPerCapita: null,
  },
  {
    year: "2022",
    middlesexMedian: 108400,
    washCoMedian: 77432,
    middlesexPerCapita: 59750,
    washCoPerCapita: null,
  },
  {
    year: "2023",
    middlesexMedian: 112159,
    washCoMedian: 79916,
    middlesexPerCapita: 61818,
    washCoPerCapita: 45017,
  },
  {
    year: "2024",
    middlesexMedian: 116500,
    washCoMedian: 82713,
    middlesexPerCapita: 64200,
    washCoPerCapita: 46593,
  },
];

const lineColors = {
  middlesexMedian: "#1e4d2b",    // Dark green - Middlesex Median (PRIMARY)
  washCoMedian: "#6b7280",       // Gray - Washington County Median
  middlesexPerCapita: "#059669", // Emerald - Middlesex Per Capita
  washCoPerCapita: "#9ca3af",    // Light gray - Washington County Per Capita
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 shadow-lg rounded px-3 py-2 text-sm">
        <p className="font-semibold text-gray-800 mb-1">{label}{label === "2024" ? " (Projected)" : ""}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-xs">
            {entry.name}: {entry.value !== null ? `$${entry.value.toLocaleString()}` : "N/A"}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function IncomeGrowthChart() {
  return (
    <div className="not-prose my-6">
      <div className="h-72 md:h-80 bg-gray-50 rounded-lg p-4" role="img" aria-label="Line chart comparing Middlesex and Washington County income levels">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={incomeData}
            margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
          >
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: '#4b5563' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              domain={[30000, 130000]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="plainline"
            />

            {/* Middlesex Median Household - PRIMARY LINE */}
            <Line
              type="monotone"
              dataKey="middlesexMedian"
              name="Middlesex Median HH"
              stroke={lineColors.middlesexMedian}
              strokeWidth={3}
              dot={{ fill: lineColors.middlesexMedian, strokeWidth: 2, stroke: '#fff', r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
            />
            {/* Washington County Median */}
            <Line
              type="monotone"
              dataKey="washCoMedian"
              name="Wash. Co. Median HH"
              stroke={lineColors.washCoMedian}
              strokeWidth={2}
              dot={{ fill: lineColors.washCoMedian, strokeWidth: 0, r: 3 }}
              strokeDasharray="6 4"
            />
            {/* Middlesex Per Capita */}
            <Line
              type="monotone"
              dataKey="middlesexPerCapita"
              name="Middlesex Per Capita"
              stroke={lineColors.middlesexPerCapita}
              strokeWidth={2}
              dot={{ fill: lineColors.middlesexPerCapita, strokeWidth: 0, r: 3 }}
            />
            {/* Washington County Per Capita */}
            <Line
              type="monotone"
              dataKey="washCoPerCapita"
              name="Wash. Co. Per Capita"
              stroke={lineColors.washCoPerCapita}
              strokeWidth={1.5}
              dot={{ fill: lineColors.washCoPerCapita, strokeWidth: 0, r: 2 }}
              strokeDasharray="6 4"
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Sources: U.S. Census Bureau ACS 5-Year Estimates, FRED. 2024 values are inflation-adjusted projections. Washington County per capita data only available 2023+.
      </p>
    </div>
  );
}
