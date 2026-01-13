"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  LabelList,
} from "recharts";

// Budget data from FY2020 to FY2024 (5-year period)
// Source: Town Reports and comprehensive_analysis.md
const BUDGET_DATA = {
  fy2020: {
    total: 1083000,
    departments: {
      "Public Works": 585000,
      "Administration": 165000,
      "Fire Dept": 105000,
      "Public Safety": 82000,
      "Other": 146000,
    },
  },
  fy2024: {
    total: 1662000,
    departments: {
      "Public Works": 943000,
      "Administration": 246000,
      "Fire Dept": 156000,
      "Public Safety": 111000,
      "Other": 206000,
    },
  },
};

// Calculate department changes
const departmentChanges = Object.keys(BUDGET_DATA.fy2024.departments).map((dept) => ({
  name: dept,
  change: BUDGET_DATA.fy2024.departments[dept as keyof typeof BUDGET_DATA.fy2024.departments] -
          (BUDGET_DATA.fy2020.departments[dept as keyof typeof BUDGET_DATA.fy2020.departments] || 0),
})).sort((a, b) => b.change - a.change);

// Build waterfall data
interface WaterfallItem {
  name: string;
  value: number;
  displayValue: number;
  start: number;
  isTotal?: boolean;
  isPositive?: boolean;
}

function buildWaterfallData(): WaterfallItem[] {
  const data: WaterfallItem[] = [];

  // Starting point
  data.push({
    name: "FY2020",
    value: BUDGET_DATA.fy2020.total,
    displayValue: BUDGET_DATA.fy2020.total,
    start: 0,
    isTotal: true,
  });

  // Each department's contribution
  let runningTotal = BUDGET_DATA.fy2020.total;

  for (const dept of departmentChanges) {
    if (dept.change !== 0) {
      data.push({
        name: dept.name,
        value: Math.abs(dept.change),
        displayValue: dept.change,
        start: dept.change >= 0 ? runningTotal : runningTotal + dept.change,
        isPositive: dept.change >= 0,
      });
      runningTotal += dept.change;
    }
  }

  // Ending point
  data.push({
    name: "FY2024",
    value: BUDGET_DATA.fy2024.total,
    displayValue: BUDGET_DATA.fy2024.total,
    start: 0,
    isTotal: true,
  });

  return data;
}

const waterfallData = buildWaterfallData();

const formatCurrency = (value: number) => {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  return `$${(value / 1000).toFixed(0)}K`;
};

const formatTooltipValue = (value: number, isChange: boolean) => {
  const formatted = formatCurrency(Math.abs(value));
  if (isChange) {
    return value >= 0 ? `+${formatted}` : `-${formatted}`;
  }
  return formatted;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: WaterfallItem;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 shadow-lg rounded px-3 py-2 text-sm">
        <p className="font-semibold text-gray-800">{item.name}</p>
        <p className="text-gray-700">
          {item.isTotal
            ? formatTooltipValue(item.displayValue, false)
            : formatTooltipValue(item.displayValue, true)}
        </p>
        {!item.isTotal && (
          <p className="text-gray-500 text-xs mt-1">
            {item.isPositive ? "Increase" : "Decrease"} from FY2020
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function BudgetWaterfallChart() {
  return (
    <section className="py-6 px-4 border-b-2 border-gray-200 bg-white" aria-labelledby="waterfall-heading">
      <div className="max-w-4xl mx-auto">
        <h2 id="waterfall-heading" className="text-lg font-semibold text-gray-800 mb-1">
          Budget Growth: FY2020 → FY2024
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Change by department over 5 years (+${((BUDGET_DATA.fy2024.total - BUDGET_DATA.fy2020.total) / 1000).toFixed(0)}K total, {((BUDGET_DATA.fy2024.total - BUDGET_DATA.fy2020.total) / BUDGET_DATA.fy2020.total * 100).toFixed(1)}% growth)
        </p>

        <div className="h-72 md:h-80" role="img" aria-label="Waterfall chart showing budget changes by department from FY2020 to FY2024">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={waterfallData}
              margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#4b5563' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                domain={[0, 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#e5e7eb" />

              {/* Invisible bar for positioning */}
              <Bar dataKey="start" stackId="stack" fill="transparent" />

              {/* Visible bar */}
              <Bar dataKey="value" stackId="stack" radius={[4, 4, 0, 0]}>
                {waterfallData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.isTotal
                        ? '#1e4d2b' // Dark green for totals
                        : entry.isPositive
                          ? '#059669' // Emerald for increases
                          : '#dc2626' // Red for decreases
                    }
                  />
                ))}
                <LabelList
                  dataKey="displayValue"
                  position="top"
                  formatter={(value) => {
                    if (typeof value !== 'number') return '';
                    const item = waterfallData.find(d => d.displayValue === value);
                    if (!item) return '';
                    if (item.isTotal) {
                      return formatCurrency(value);
                    }
                    return value >= 0 ? `+${formatCurrency(value)}` : `-${formatCurrency(Math.abs(value))}`;
                  }}
                  style={{ fontSize: 10, fill: '#374151', fontWeight: 500 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Source: Town of Middlesex Annual Reports. Public Works includes highway wages, equipment, materials, and maintenance.
        </p>
      </div>
    </section>
  );
}
