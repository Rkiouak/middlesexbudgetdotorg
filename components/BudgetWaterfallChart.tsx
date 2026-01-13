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
// Source: Town Reports, CSV data, and comprehensive_analysis.md
// Includes ALL spending: operating, debt service, and emergency flood costs
const BUDGET_DATA = {
  fy2020: {
    total: 1151000,
    departments: {
      "Public Works": 585000,
      "Administration": 165000,
      "Fire Dept": 105000,
      "Public Safety": 82000,
      "Other": 84000,
    },
    debtService: 130000,  // FD debt + PW debt
    floodEmergency: 0,
  },
  fy2024: {
    total: 4994000,
    departments: {
      "Public Works": 1656000,
      "Administration": 708000,
      "Fire Dept": 176000,
      "Public Safety": 160000,
      "Other": 55000,
    },
    debtService: 1466000,  // FD debt ($293k) + PW debt ($1.17M) - includes flood-related debt
    floodEmergency: 828000,  // Unbudgeted flood disaster response
  },
};

// Calculate department changes (operating budget)
const departmentChanges = Object.keys(BUDGET_DATA.fy2024.departments).map((dept) => ({
  name: dept,
  change: BUDGET_DATA.fy2024.departments[dept as keyof typeof BUDGET_DATA.fy2024.departments] -
          (BUDGET_DATA.fy2020.departments[dept as keyof typeof BUDGET_DATA.fy2020.departments] || 0),
})).sort((a, b) => b.change - a.change);

// Add debt service and flood emergency changes
const debtServiceChange = BUDGET_DATA.fy2024.debtService - BUDGET_DATA.fy2020.debtService;
const floodEmergencyChange = BUDGET_DATA.fy2024.floodEmergency - BUDGET_DATA.fy2020.floodEmergency;

// Build waterfall data
interface WaterfallItem {
  name: string;
  value: number;
  displayValue: number;
  start: number;
  isTotal?: boolean;
  isPositive?: boolean;
  isDebt?: boolean;
  isFlood?: boolean;
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

  // Debt Service (separate column)
  if (debtServiceChange !== 0) {
    data.push({
      name: "Debt Service",
      value: Math.abs(debtServiceChange),
      displayValue: debtServiceChange,
      start: debtServiceChange >= 0 ? runningTotal : runningTotal + debtServiceChange,
      isPositive: debtServiceChange >= 0,
      isDebt: true,
    });
    runningTotal += debtServiceChange;
  }

  // Flood Emergency (separate column)
  if (floodEmergencyChange !== 0) {
    data.push({
      name: "Flood Emergency",
      value: Math.abs(floodEmergencyChange),
      displayValue: floodEmergencyChange,
      start: floodEmergencyChange >= 0 ? runningTotal : runningTotal + floodEmergencyChange,
      isPositive: floodEmergencyChange >= 0,
      isFlood: true,
    });
    runningTotal += floodEmergencyChange;
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
    let description = "";
    if (item.isFlood) {
      description = "2023 flood disaster response (unbudgeted)";
    } else if (item.isDebt) {
      description = "Includes flood-related debt financing";
    } else if (!item.isTotal) {
      description = item.isPositive ? "Increase from FY2020" : "Decrease from FY2020";
    }

    return (
      <div className="bg-white border border-gray-200 shadow-lg rounded px-3 py-2 text-sm">
        <p className="font-semibold text-gray-800">{item.name}</p>
        <p className="text-gray-700">
          {item.isTotal
            ? formatTooltipValue(item.displayValue, false)
            : formatTooltipValue(item.displayValue, true)}
        </p>
        {description && (
          <p className="text-gray-500 text-xs mt-1">{description}</p>
        )}
      </div>
    );
  }
  return null;
};

export default function BudgetWaterfallChart() {
  const totalChange = BUDGET_DATA.fy2024.total - BUDGET_DATA.fy2020.total;
  const growthPct = (totalChange / BUDGET_DATA.fy2020.total * 100).toFixed(0);

  return (
    <section className="py-6 px-4 border-b-2 border-gray-200 bg-white" aria-labelledby="waterfall-heading">
      <div className="max-w-4xl mx-auto">
        <h2 id="waterfall-heading" className="text-lg font-semibold text-gray-800 mb-1">
          Budget Growth: FY2020 → FY2024
        </h2>
        <p className="text-sm text-gray-600 mb-2">
          Total change: +${(totalChange / 1000000).toFixed(1)}M ({growthPct}% growth) — includes 2023 flood disaster costs
        </p>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs mb-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: '#1e4d2b' }}></span>
            <span className="text-gray-600">Budget Totals</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: '#059669' }}></span>
            <span className="text-gray-600">Operating Increases</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: '#ea580c' }}></span>
            <span className="text-gray-600">Debt Service</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: '#dc2626' }}></span>
            <span className="text-gray-600">Flood Emergency</span>
          </div>
        </div>

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
                        : entry.isFlood
                          ? '#dc2626' // Red for flood emergency
                          : entry.isDebt
                            ? '#ea580c' // Orange for debt service
                            : entry.isPositive
                              ? '#059669' // Emerald for operating increases
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
