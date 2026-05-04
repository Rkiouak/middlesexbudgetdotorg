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
} from "recharts";

interface TownData {
  town: string;
  ratio: number;
  officeSpend: number;
  budget: number;
  isMiddlesex?: boolean;
  isReference?: boolean;
}

const OFFICE_ONLY: TownData[] = [
  { town: "East Montpelier", ratio: 10.25, officeSpend: 357000, budget: 3484309 },
  { town: "Wolcott", ratio: 9.87, officeSpend: 157005, budget: 1590000 },
  { town: "Starksboro", ratio: 8.15, officeSpend: 111736, budget: 1371119 },
  { town: "Cabot", ratio: 7.39, officeSpend: 142285, budget: 1924756 },
  { town: "Moretown", ratio: 7.22, officeSpend: 135637, budget: 1878380 },
  { town: "Barnet", ratio: 6.91, officeSpend: 117439, budget: 1700000 },
  { town: "Proctor", ratio: 6.43, officeSpend: 98800, budget: 1537638 },
  { town: "New Haven", ratio: 6.04, officeSpend: 94743, budget: 1568460 },
  { town: "Middlesex", ratio: 5.74, officeSpend: 129726, budget: 2261978, isMiddlesex: true },
  { town: "Corinth", ratio: 5.53, officeSpend: 88900, budget: 1608000 },
  { town: "Dorset", ratio: 5.45, officeSpend: 190794, budget: 3500000 },
  { town: "Fayston", ratio: 5.36, officeSpend: 119890, budget: 2235794 },
  { town: "Guilford", ratio: 5.20, officeSpend: 133602, budget: 2568436 },
  { town: "Londonderry", ratio: 5.01, officeSpend: 157775, budget: 3150324 },
  { town: "Calais", ratio: 4.15, officeSpend: 78246, budget: 1883254 },
  { town: "Huntington", ratio: 3.87, officeSpend: 97266, budget: 2510799 },
  { town: "Wilmington", ratio: 3.80, officeSpend: 211528, budget: 5569173 },
  { town: "Warren", ratio: 2.34, officeSpend: 126435, budget: 5411053 },
];

const WITH_ADMIN: TownData[] = [
  { town: "Starksboro", ratio: 11.49, officeSpend: 157600, budget: 1371119 },
  { town: "East Montpelier", ratio: 10.25, officeSpend: 357000, budget: 3484309 },
  { town: "Wolcott", ratio: 9.87, officeSpend: 157005, budget: 1590000 },
  { town: "Middlesex", ratio: 8.95, officeSpend: 202526, budget: 2261978, isMiddlesex: true },
  { town: "Calais", ratio: 8.78, officeSpend: 165274, budget: 1883254 },
  { town: "Guilford", ratio: 8.66, officeSpend: 222306, budget: 2568436 },
  { town: "Dorset", ratio: 8.45, officeSpend: 295854, budget: 3500000 },
  { town: "Huntington", ratio: 7.84, officeSpend: 196931, budget: 2510799 },
  { town: "Cabot", ratio: 7.39, officeSpend: 142285, budget: 1924756 },
  { town: "Moretown", ratio: 7.22, officeSpend: 135637, budget: 1878380 },
  { town: "Londonderry", ratio: 7.13, officeSpend: 224775, budget: 3150324 },
  { town: "Barnet", ratio: 6.91, officeSpend: 117439, budget: 1700000 },
  { town: "Proctor", ratio: 6.43, officeSpend: 98800, budget: 1537638 },
  { town: "Wilmington", ratio: 6.21, officeSpend: 345656, budget: 5569173 },
  { town: "New Haven", ratio: 6.04, officeSpend: 94743, budget: 1568460 },
  { town: "Corinth", ratio: 5.65, officeSpend: 90900, budget: 1608000 },
  { town: "Fayston", ratio: 5.36, officeSpend: 119890, budget: 2235794 },
  { town: "Warren", ratio: 3.90, officeSpend: 211094, budget: 5411053 },
];

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  return `$${(value / 1000).toFixed(0)}K`;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: TownData;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 shadow-lg rounded px-3 py-2 text-sm">
        <p className="font-semibold text-gray-800">
          {item.town}
          {item.isMiddlesex ? " (ours)" : ""}
        </p>
        <p className="text-gray-700">{item.ratio}% of budget</p>
        <p className="text-gray-500 text-xs">
          Office: {formatCurrency(item.officeSpend)} / Budget:{" "}
          {formatCurrency(item.budget)}
        </p>
      </div>
    );
  }
  return null;
}

function ComparisonBar({
  data,
  median,
  label,
}: {
  data: TownData[];
  median: number;
  label: string;
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">{label}</h4>
      <div
        className="h-[420px] md:h-[460px]"
        role="img"
        aria-label={`Horizontal bar chart: ${label}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 40, left: 5, bottom: 5 }}
          >
            <XAxis
              type="number"
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 10, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              domain={[0, "auto"]}
            />
            <YAxis
              type="category"
              dataKey="town"
              tick={{ fontSize: 10, fill: "#4b5563" }}
              axisLine={false}
              tickLine={false}
              width={95}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              x={median}
              stroke="#9ca3af"
              strokeDasharray="4 4"
              label={{
                value: `Median ${median}%`,
                position: "top",
                style: { fontSize: 10, fill: "#6b7280" },
              }}
            />
            <Bar dataKey="ratio" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isMiddlesex ? "#dc2626" : "#059669"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function TownOfficeComparisonChart() {
  return (
    <section
      className="py-6 px-4 border-b border-gray-200 bg-gray-50"
      aria-labelledby="town-comparison-heading"
    >
      <div className="max-w-4xl mx-auto">
        <h3
          id="town-comparison-heading"
          className="text-lg font-semibold text-gray-800 mb-1"
        >
          Office Spending as % of Municipal Budget: 18 Comparable Towns
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Middlesex in <span className="text-red-600 font-medium">red</span>,
          peer towns in <span className="text-emerald-600 font-medium">green</span>,
          dashed line = median
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <ComparisonBar
            data={OFFICE_ONLY}
            median={5.63}
            label="Office Only (excl. Town Admin)"
          />
          <ComparisonBar
            data={WITH_ADMIN}
            median={7.31}
            label="Office + Town Admin"
          />
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Source: Most recent available town reports and warned articles.
          Office spend = wages only (Clerk, Treasurer, Assistants). Town
          Admin/Manager salaries excluded from View 1, included in View 2.
        </p>
      </div>
    </section>
  );
}
