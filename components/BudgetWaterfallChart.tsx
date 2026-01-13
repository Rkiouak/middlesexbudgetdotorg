"use client";

import { useState } from "react";
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

// Budget data from FY2020 to FY2026 (6-year period)
// Source: Town Reports, comprehensive_analysis.md, and 2024.csv (contains FY2026 proposed)
// FY2026 operating budget: ~$1.89M (proposed)
// Flood costs were ADDITIONAL unbudgeted emergency spending in 2023
const BUDGET_DATA = {
  fy2020: {
    total: 1200000,  // ~$1.2M operating budget
    departments: {
      "Public Works": 620000,
      "Administration": 180000,
      "Fire Dept": 95000,
      "Public Safety": 82000,
      "Other": 223000,  // Recreation, Cemetery, Town Hall, etc.
    },
  },
  fy2026: {
    total: 1886000,  // ~$1.89M operating budget (proposed, from 2024.csv)
    departments: {
      "Public Works": 1090000,   // From CSV: $1,089,726
      "Administration": 329000,  // From CSV: $329,245
      "Fire Dept": 169000,       // From CSV: $169,129
      "Public Safety": 118000,   // From CSV: $117,971
      "Other": 180000,           // Gen Gov + Town Hall + Cemetery + Recreation
    },
    // 2023 flood costs - UNBUDGETED emergency spending, separate from operating budget
    floodEmergency: 2600000,  // $2.6M in unbudgeted emergency spending
  },
};

// Calculate totals
const fy2020Total = BUDGET_DATA.fy2020.total;
const fy2026Total = BUDGET_DATA.fy2026.total;
const fy2026TotalWithFlood = fy2026Total + BUDGET_DATA.fy2026.floodEmergency;

// Calculate department changes (operating budget)
const departmentChanges = Object.keys(BUDGET_DATA.fy2026.departments).map((dept) => ({
  name: dept,
  change: BUDGET_DATA.fy2026.departments[dept as keyof typeof BUDGET_DATA.fy2026.departments] -
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
  isDebt?: boolean;
  isFlood?: boolean;
}

function buildWaterfallData(includeFlood: boolean): WaterfallItem[] {
  const data: WaterfallItem[] = [];
  const startTotal = fy2020Total;
  const endTotal = includeFlood ? fy2026TotalWithFlood : fy2026Total;

  // Starting point
  data.push({
    name: "FY2020",
    value: startTotal,
    displayValue: startTotal,
    start: 0,
    isTotal: true,
  });

  // Each department's contribution
  let runningTotal = startTotal;

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

  if (includeFlood && BUDGET_DATA.fy2026.floodEmergency > 0) {
    // Flood Emergency - unbudgeted spending (2023 historical event)
    data.push({
      name: "Flood Costs",
      value: BUDGET_DATA.fy2026.floodEmergency,
      displayValue: BUDGET_DATA.fy2026.floodEmergency,
      start: runningTotal,
      isPositive: true,
      isFlood: true,
    });
    runningTotal += BUDGET_DATA.fy2026.floodEmergency;
  }

  // Ending point
  data.push({
    name: includeFlood ? "Total" : "FY2026",
    value: endTotal,
    displayValue: endTotal,
    start: 0,
    isTotal: true,
  });

  return data;
}

const waterfallDataNoFlood = buildWaterfallData(false);
const waterfallDataWithFlood = buildWaterfallData(true);

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
  includeFlood?: boolean;
}

function CustomTooltip({ active, payload, includeFlood }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    let description = "";
    if (item.isFlood) {
      description = "2023 flood disaster - unbudgeted emergency spending";
    } else if (!item.isTotal) {
      description = item.isPositive ? "Increase from FY2020" : "Decrease from FY2020";
    } else if (item.name === "FY2026" && !includeFlood) {
      description = "Proposed operating budget (excludes 2023 flood costs)";
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
}

interface WaterfallChartProps {
  data: WaterfallItem[];
  includeFlood: boolean;
}

function WaterfallChart({ data, includeFlood }: WaterfallChartProps) {
  return (
    <div className="h-72 md:h-80" role="img" aria-label={`Waterfall chart showing budget changes from FY2020 to FY2026 (Proposed)${includeFlood ? ' including 2023 flood costs' : ''}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
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
          <Tooltip content={<CustomTooltip includeFlood={includeFlood} />} />
          <ReferenceLine y={0} stroke="#e5e7eb" />

          {/* Invisible bar for positioning */}
          <Bar dataKey="start" stackId="stack" fill="transparent" />

          {/* Visible bar */}
          <Bar dataKey="value" stackId="stack" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
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
                const item = data.find(d => d.displayValue === value);
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
  );
}

export default function BudgetWaterfallChart() {
  const [floodAccordionOpen, setFloodAccordionOpen] = useState(false);

  const operatingChange = fy2026Total - fy2020Total;
  const operatingGrowthPct = (operatingChange / fy2020Total * 100).toFixed(0);

  const totalChangeWithFlood = fy2026TotalWithFlood - fy2020Total;
  const totalGrowthPctWithFlood = (totalChangeWithFlood / fy2020Total * 100).toFixed(0);

  return (
    <section className="py-6 px-4 border-b-2 border-gray-200 bg-white" aria-labelledby="waterfall-heading">
      <div className="max-w-4xl mx-auto">
        <h2 id="waterfall-heading" className="text-lg font-semibold text-gray-800 mb-1">
          Budget Growth: FY2020 → FY2026 (Proposed)
        </h2>
        <p className="text-sm text-gray-600 mb-2">
          Proposed operating budget change: +${(operatingChange / 1000000).toFixed(1)}M ({operatingGrowthPct}% growth)
        </p>

        {/* Legend for operating chart */}
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
            <span className="w-3 h-3 rounded" style={{ backgroundColor: '#dc2626' }}></span>
            <span className="text-gray-600">Decreases</span>
          </div>
        </div>

        {/* Operating budget waterfall (excludes flood) */}
        <WaterfallChart data={waterfallDataNoFlood} includeFlood={false} />

        <p className="text-xs text-gray-500 mt-3 mb-6">
          Source: Town of Middlesex Annual Reports. Public Works includes highway wages, equipment, materials, and maintenance.
        </p>

        {/* Accordion for flood costs */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setFloodAccordionOpen(!floodAccordionOpen)}
            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left transition-colors"
            aria-expanded={floodAccordionOpen}
            aria-controls="flood-chart-content"
          >
            <span className="text-sm font-medium text-gray-700">
              Including 2023 Flood Costs (+${(BUDGET_DATA.fy2026.floodEmergency / 1000000).toFixed(1)}M unbudgeted)
            </span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${floodAccordionOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {floodAccordionOpen && (
            <div id="flood-chart-content" className="p-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">
                Total with flood: +${(totalChangeWithFlood / 1000000).toFixed(1)}M ({totalGrowthPctWithFlood}% growth)
              </p>

              {/* Legend for flood chart */}
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
                  <span className="w-3 h-3 rounded" style={{ backgroundColor: '#dc2626' }}></span>
                  <span className="text-gray-600">Flood Costs (unbudgeted)</span>
                </div>
              </div>

              <WaterfallChart data={waterfallDataWithFlood} includeFlood={true} />

              <p className="text-xs text-gray-500 mt-3">
                The 2023 floods caused $2.6M in unbudgeted emergency spending. Town is awaiting FEMA reimbursement.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
