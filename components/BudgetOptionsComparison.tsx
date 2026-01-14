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

// Budget comparison: TEST B (Office Expansion) as base, TEST A (Town Admin) as additional
// Using TEST B department totals with flood debt normalized to General Government
// All totals include CIP (Capital Improvement Program)
const BUDGET_DATA = {
  fy2026: {
    totalTownBudget: 2027000,  // Total Town Budget FY2026 (with CIP)
    operatingBudget: 2027000,  // Using total town budget for waterfall consistency
    departments: {
      "Public Works": 1090000,
      "Administration": 329000,   // Base admin (excluding staffing decision)
      "Fire Dept": 169000,
      "Public Safety": 118000,
      "Office Expansion": 0,      // TEST B staffing approach
      "Town Admin": 0,            // TEST A additional
      "Other": 220000,
      "CIP": 101000,              // Capital Improvement Program
    },
  },
  fy2027_testB: {
    totalTownBudget: 2288000,  // TEST B Total Town Budget (from sheet)
    operatingBudget: 2288000,  // Using total town budget for waterfall consistency
    departments: {
      "Public Works": 1167000,    // Normalized (flood debt to Gen Gov)
      "Administration": 330000,   // Base admin (Listers + base office costs)
      "Fire Dept": 154000,
      "Public Safety": 118000,
      "Office Expansion": 100000, // Increased staff hours + part-time TA + FEMA PM
      "Town Admin": 0,            // Not in TEST B
      "Other": 293000,            // Gen Gov normalized + Town Hall + Cemetery + Rec
      "CIP": 126000,              // Capital Improvement Program
    },
  },
  fy2027_testA: {
    totalTownBudget: 2294000,  // TEST A Total Town Budget (from sheet)
    operatingBudget: 2294000,  // Using total town budget for waterfall consistency
    townAdminNet: 91000,  // Town Admin NET cost ($108K - $17K absorbed)
  },
};

// Calculate totals (use operating budget for waterfall, total town budget for percentages)
const fy2026Total = BUDGET_DATA.fy2026.operatingBudget;
const testBTotal = BUDGET_DATA.fy2027_testB.operatingBudget;
const testATotal = BUDGET_DATA.fy2027_testA.operatingBudget;
const townAdminAdditional = testATotal - testBTotal;  // ~$6K difference

// For percentage display, use Total Town Budget figures
const fy2026TownBudget = BUDGET_DATA.fy2026.totalTownBudget;
const testBTownBudget = BUDGET_DATA.fy2027_testB.totalTownBudget;
const testATownBudget = BUDGET_DATA.fy2027_testA.totalTownBudget;

// Calculate department changes (TEST B as base)
const departmentChanges = Object.keys(BUDGET_DATA.fy2027_testB.departments).map((dept) => ({
  name: dept,
  fy2026: BUDGET_DATA.fy2026.departments[dept as keyof typeof BUDGET_DATA.fy2026.departments],
  fy2027: BUDGET_DATA.fy2027_testB.departments[dept as keyof typeof BUDGET_DATA.fy2027_testB.departments],
  change: BUDGET_DATA.fy2027_testB.departments[dept as keyof typeof BUDGET_DATA.fy2027_testB.departments] -
          BUDGET_DATA.fy2026.departments[dept as keyof typeof BUDGET_DATA.fy2026.departments],
})).sort((a, b) => b.change - a.change);

interface WaterfallItem {
  name: string;
  value: number;
  displayValue: number;
  start: number;
  isTotal?: boolean;
  isPositive?: boolean;
  isOfficeExpansion?: boolean;
  isTownAdmin?: boolean;
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

  // Each department's contribution (excluding Options - handled separately)
  let runningTotal = fy2026Total;

  for (const dept of departmentChanges) {
    if (dept.change !== 0 && dept.name !== "Office Expansion" && dept.name !== "Town Admin") {
      data.push({
        name: dept.name,
        value: Math.abs(dept.change),
        displayValue: dept.change,
        start: dept.change >= 0 ? runningTotal : runningTotal + dept.change,
        isPositive: dept.change >= 0,
        percentChange: dept.fy2026 > 0 ? (dept.change / dept.fy2026) * 100 : undefined,
      });
      runningTotal += dept.change;
    }
  }

  // Office Expansion (TEST B staffing approach)
  const officeExpansion = departmentChanges.find(d => d.name === "Office Expansion");
  if (officeExpansion && officeExpansion.change > 0) {
    data.push({
      name: "Office Expansion",
      value: officeExpansion.change,
      displayValue: officeExpansion.change,
      start: runningTotal,
      isOfficeExpansion: true,
    });
    runningTotal += officeExpansion.change;
  }

  // Town Admin additional (TEST A over TEST B)
  if (townAdminAdditional > 0) {
    data.push({
      name: "Town Admin",
      value: townAdminAdditional,
      displayValue: townAdminAdditional,
      start: runningTotal,
      isTownAdmin: true,
    });
    runningTotal += townAdminAdditional;
  }

  // Ending point (TEST A total)
  data.push({
    name: "FY2027",
    value: testATotal,
    displayValue: testATotal,
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

    if (item.name === "Office Expansion") {
      description = "Increased Clerk's office hours, part-time Town Admin ($14.5K), FEMA Project Manager";
    } else if (item.name === "Town Admin") {
      description = "Additional cost for full Town Administrator position vs Office Expansion";
    } else if (item.name === "Other") {
      description = "General Government (normalized), Town Hall, Cemetery, Recreation";
    } else if (item.name === "Public Works") {
      description = "Highway operations, equipment debt (flood debt normalized to Gen Gov)";
    } else if (item.name === "Administration") {
      description = "Listers + base Clerk's office costs";
    } else if (item.name === "Fire Dept") {
      description = "Operations + debt service (tanker loan paid off)";
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

export default function BudgetOptionsComparison() {
  // Use Total Town Budget for percentage display
  const testBPct = ((testBTownBudget - fy2026TownBudget) / fy2026TownBudget * 100).toFixed(1);
  const testAPct = ((testATownBudget - fy2026TownBudget) / fy2026TownBudget * 100).toFixed(1);

  return (
    <>
      {/* Options explanation - outside amber section */}
      <section className="py-6 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Comparing the Two Budget Options</h2>
          <p className="text-sm text-gray-700 mb-3">
            The Select Board evaluated two approaches to address Middlesex&apos;s growing administrative needs. The <strong>Office Expansion</strong> option would increase existing Clerk&apos;s office hours (+$47K), add a part-time Town Admin ($14.5K), and hire a FEMA Project Manager ($20K)—relying on current staff to take on additional responsibilities. The <strong>Town Administrator</strong> option would hire a dedicated full-time position ($73K salary + $35K benefits = $108K gross), but absorbs $57K in existing roles: the full-time Assistant Town Clerk (~$40K), Selectboard Minute Taker ($7.5K), and FEMA coordinator ($9K)—resulting in a net cost of ~$51K.
          </p>

          <h3 className="text-base font-semibold text-gray-800 mb-2">Why Town Administrator is the Better Investment</h3>
          <p className="text-sm text-gray-700 mb-3">
            After two years of flood recovery, Middlesex faced a $10M problem without the expertise or staffing to manage it. Current Town Clerk Cheryl Grandfield is not running for re-election in 2026, and previous Town Clerk Sarah Merriman&apos;s work was split roughly 50-50 between Select Board assistance and clerk duties. As the budget committee noted, past employees &quot;probably worked excessive hours they did not get paid for.&quot; Adding more hours to already-burdened staff risks burnout without addressing the fundamental need for dedicated municipal expertise.
          </p>
          <p className="text-sm text-gray-700 mb-3">
            A Town Administrator brings professional capacity that Middlesex currently lacks. As Zara Vincent explained in her Front Porch Forum post, &quot;We need someone to be up to speed on the things this town is legally responsible for doing... Lawyer fees later will cost us far more than doing things right the first time.&quot; The position would focus on grant writing and reporting—work that other towns&apos; administrators regularly perform. If they secure just three $30K grants per year, the role pays for itself while bringing additional resources to town projects.
          </p>
          <p className="text-sm text-gray-700">
            The ~{formatCurrency(townAdminAdditional)} difference between options is a modest investment in sustainable governance. Select Board Chair Liz Scharf stated that &quot;town administrator is essential for next year or near future; workloads will continue to grow.&quot; Relying on volunteers and part-time staff to manage increasingly complex municipal operations is, as Vincent noted, &quot;an unreasonable and unsustainable expectation.&quot;
          </p>
        </div>
      </section>

      {/* Waterfall chart section */}
      <section className="py-6 px-4 border-b-2 border-gray-200 bg-amber-50" aria-labelledby="budget-options-heading">
        <div className="max-w-4xl mx-auto">
          <h3 id="budget-options-heading" className="text-lg font-semibold text-gray-800 mb-1">
            Two Budget Options Considered by Select Board
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            <span className="italic">Office Expansion (+{testBPct}%)</span> vs <span className="italic">Town Admin (+{testAPct}%)</span>
          </p>

          {/* Chart */}
          <div className="h-72 md:h-80" role="img" aria-label="Waterfall chart comparing budget options">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={waterfallData}
              margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#4b5563' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
                interval={0}
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
                        ? '#1e4d2b'   // Dark green for totals
                        : entry.isOfficeExpansion
                          ? '#7c3aed' // Purple for Office Expansion
                          : entry.isTownAdmin
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
                  style={{ fontSize: 9, fill: '#374151', fontWeight: 500 }}
                />
              </Bar>
            </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Source: FY2027 Proposed Budgets (provisional). Office Expansion Option increases existing staff hours; Town Admin Option adds ~{formatCurrency(townAdminAdditional)} for full position.
          </p>
        </div>
      </section>

      {/* Poem section */}
      <section className="py-6 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-gray-700 mb-4">
            Before the Select Board discussion of the two budget options at their special meeting, Chair Liz Scharf read this poem by Robert Frost:
          </p>
          <blockquote className="border-l-4 border-[#1e4d2b] pl-4 py-2 bg-gray-50 rounded-r">
            <p className="text-sm text-gray-800 italic font-serif leading-relaxed">
              When a friend calls to me from the road<br />
              And slows his horse to a meaning walk,<br />
              I don&apos;t stand still and look around<br />
              On all the hills I haven&apos;t hoed,<br />
              And shout from where I am, What is it?<br />
              No, not as there is a time to talk.<br />
              I thrust my hoe in the mellow ground,<br />
              Blade-end up and five feet tall,<br />
              And plod: I go up to the stone wall<br />
              For a friendly visit.
            </p>
            <footer className="mt-2 text-sm text-gray-600">
              — Robert Frost, &quot;A Time to Talk&quot;
            </footer>
          </blockquote>
        </div>
      </section>
    </>
  );
}
