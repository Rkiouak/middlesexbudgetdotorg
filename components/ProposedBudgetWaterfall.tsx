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

// Budget data: FY2026 (current) vs FY2027 (proposed)
// FY2026 from fy2026.csv (approved budget)
// FY2027 from fy2027.csv with flood debt normalized to General Government
// Town Administrator: NET cost = $108K gross - $57K absorbed roles (Minute Taker $7.5K, FEMA $9K, Town Clerk Asst $40K)
const BUDGET_DATA = {
  fy2026: {
    total: 2027000,  // Total Town Budget from fy2026.csv (includes CIP)
    departments: {
      "Public Works": 1090000,   // Highway operations + debt
      "Administration": 329000,  // Admin + Listers
      "Fire Dept": 169000,       // Fire operations + debt
      "Public Safety": 118000,   // Ambulance, health officer, etc.
      "Town Admin": 0,           // NEW POSITION in FY2027
      "Other": 220000,           // Gen Gov + Town Hall + Cemetery + Recreation
      "CIP": 101000,             // Capital Improvement Program
    },
  },
  fy2027: {
    total: 2294000,  // Total Town Budget (proposed, ~$2,293,703 rounded)
    departments: {
      "Public Works": 1167000,   // Normalized (flood debt moved to Gen Gov)
      "Administration": 429000,  // Clerk/Treasurer split to 2 FT roles + health insurance increases
      "Fire Dept": 154000,       // -9% (tanker loan paid off)
      "Public Safety": 118000,   // Flat
      "Town Admin": 51000,       // NET: $108K gross - $57K absorbed roles
      "Other": 249000,           // Gen Gov + Town Hall + Cemetery + Rec
      "CIP": 126000,             // Capital Improvement Program
    },
  },
};

// Calculate totals
const fy2026Total = BUDGET_DATA.fy2026.total;
const fy2027Total = BUDGET_DATA.fy2027.total;

// Calculate department changes
const departmentChanges = Object.keys(BUDGET_DATA.fy2027.departments).map((dept) => ({
  name: dept,
  fy2026: BUDGET_DATA.fy2026.departments[dept as keyof typeof BUDGET_DATA.fy2026.departments],
  fy2027: BUDGET_DATA.fy2027.departments[dept as keyof typeof BUDGET_DATA.fy2027.departments],
  change: BUDGET_DATA.fy2027.departments[dept as keyof typeof BUDGET_DATA.fy2027.departments] -
          BUDGET_DATA.fy2026.departments[dept as keyof typeof BUDGET_DATA.fy2026.departments],
})).sort((a, b) => b.change - a.change);

// Build waterfall data
interface WaterfallItem {
  name: string;
  value: number;
  displayValue: number;
  start: number;
  isTotal?: boolean;
  isPositive?: boolean;
  isNew?: boolean;
  percentChange?: number;
}

function buildWaterfallData(): WaterfallItem[] {
  const data: WaterfallItem[] = [];

  // Starting point
  data.push({
    name: "FY2026",
    value: fy2026Total,
    displayValue: fy2026Total,
    start: 0,
    isTotal: true,
  });

  // Each department's contribution
  let runningTotal = fy2026Total;

  for (const dept of departmentChanges) {
    if (dept.change !== 0) {
      const isNewPosition = dept.fy2026 === 0 && dept.fy2027 > 0;
      data.push({
        name: dept.name,
        value: Math.abs(dept.change),
        displayValue: dept.change,
        start: dept.change >= 0 ? runningTotal : runningTotal + dept.change,
        isPositive: dept.change >= 0,
        isNew: isNewPosition,
        percentChange: isNewPosition ? undefined : (dept.change / dept.fy2026) * 100,
      });
      runningTotal += dept.change;
    }
  }

  // Ending point
  data.push({
    name: "FY2027",
    value: fy2027Total,
    displayValue: fy2027Total,
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

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    let description = "";
    if (item.name === "Town Admin") {
      description = "Town Administrator NET: $108K gross minus $57K absorbed roles (Minute Taker, FEMA, full-time Town Clerk Asst)";
    } else if (item.name === "Other") {
      description = "General Government, Town Hall, Cemetery, Recreation";
    } else if (item.name === "Public Works") {
      description = "Highway operations, equipment debt, materials (flood debt normalized)";
    } else if (item.name === "Administration") {
      description = "Clerk and Treasurer split to two FT positions (previously combined), plus health insurance increases";
    } else if (item.name === "Fire Dept") {
      description = "Operations + debt service (tanker loan paid off in FY2026)";
    } else if (item.name === "CIP") {
      description = "Capital Improvement Program: Town Hall Building Fund, Asset-Equipment Fund, Reappraisal Fund";
    } else if (!item.isTotal) {
      description = item.isPositive ? "Increase from FY2026" : "Decrease from FY2026";
    }

    return (
      <div className="bg-white border border-gray-200 shadow-lg rounded px-3 py-2 text-sm">
        <p className="font-semibold text-gray-800">
          {item.name}
          {item.name === "FY2027" ? " (Proposed)" : ""}
          {item.name === "FY2026" ? " (Current)" : ""}
        </p>
        <p className="text-gray-700">
          {item.isTotal
            ? formatTooltipValue(item.displayValue, false)
            : formatTooltipValue(item.displayValue, true)}
          {item.percentChange !== undefined && (
            <span className="text-gray-500 ml-1">
              ({item.percentChange > 0 ? "+" : ""}{item.percentChange.toFixed(0)}%)
            </span>
          )}
        </p>
        {description && (
          <p className="text-gray-500 text-xs mt-1 max-w-48">{description}</p>
        )}
      </div>
    );
  }
  return null;
}

export default function ProposedBudgetWaterfall() {
  const totalChange = fy2027Total - fy2026Total;
  const growthPct = ((totalChange / fy2026Total) * 100).toFixed(1);

  return (
    <>
      {/* Budget increase explanation - outside amber section */}
      <section className="py-6 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Explaining the Proposed FY2027 Budget</h2>
          <p className="text-sm text-gray-700 mb-3">
            <strong>Public Works</strong> shows increases in winter sand (+$35K) and trucking (+$40K). These reflect a return to normal budgeting after the Road Crew saved the town roughly $150-200K over the past 4-5 years by extracting sand from a pre-existing Middlesex sand pit—savings that are no longer available. Legal fees rose from $7.5K to $30K for ongoing flood recovery matters, and auditing doubled to $30K due to the complexity of flood-related finances.
          </p>
          <p className="text-sm text-gray-700 mb-3">
            <strong>Administration</strong> reflects two changes: the previously combined Clerk/Treasurer role is now split into two full-time positions, and health insurance costs increased after the Select Board voted in November to switch from the high-deductible plan ($6,000 individual / $12,000 family deductibles) to an MVP Gold plan with lower deductibles. The decision followed a presentation from town employees and discussion of the financial burden the high-deductible plan placed on staff. Dental and vision coverage were also added for the first time. Vermont small group premiums continue rising—MVP plans increased 2.5% and Blue Cross 4.4% for 2026.
          </p>
          <p className="text-sm text-gray-700 mb-3">
            These increases are partially offset by <strong>debt payoffs</strong>: the Fire Department tanker loan (-$15K) and Highway&apos;s Freightliner dump truck (-$22K) are both paid off this year, providing some relief.
          </p>
          <p className="text-sm text-gray-700">
            The Select Board considered two approaches to address the town&apos;s growing administrative workload: either increase hours for existing employees and find ways to fund additional work from Select Board members, or hire a new <strong>Town Administrator</strong>. The Town Administrator option adds $51K net to the budget—a $73K salary plus $35K in benefits ($108K gross), offset by $57K in consolidated roles (Selectboard Minute Taker $7.5K, FEMA coordinator $9K, and full-time Town Clerk Assistant ~$40K). As shown in the waterfall chart below, the Town Administrator is only about $6K more than the alternative &quot;Office Expansion&quot; approach, while providing dedicated professional capacity for grant writing, municipal compliance, and flood recovery coordination.
          </p>
        </div>
      </section>

      {/* Waterfall chart section */}
      <section className="py-6 px-4 border-b-2 border-gray-200 bg-amber-50" aria-labelledby="proposed-waterfall-heading">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs font-semibold bg-amber-200 text-amber-800 rounded">
              PROVISIONAL
            </span>
            <h3 id="proposed-waterfall-heading" className="text-lg font-semibold text-gray-800">
              Proposed Budget: FY2026 → FY2027
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            <span className="italic">{growthPct}% increase</span> · Pre-Town Meeting vote
          </p>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-xs mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: '#1e4d2b' }}></span>
              <span className="text-gray-600">Budget Totals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: '#0d9488' }}></span>
              <span className="text-gray-600">Town Admin</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: '#059669' }}></span>
              <span className="text-gray-600">Increases</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: '#dc2626' }}></span>
              <span className="text-gray-600">Decreases</span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-72 md:h-80" role="img" aria-label="Waterfall chart showing proposed budget changes from FY2026 to FY2027">
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
                        : entry.isNew
                          ? '#0d9488' // Teal for Town Admin
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
            Source: FY2027 Proposed Budget (provisional). Debt service reductions offset some Public Works and Fire Dept increases.
          </p>
        </div>
      </section>
    </>
  );
}
