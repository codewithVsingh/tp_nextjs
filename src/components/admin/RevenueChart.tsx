/**
 * RevenueChart — upgraded to support 4 chart modes:
 *   "trend"    → Paid/Pending/Overdue stacked bars (monthly trend)
 *   "stacked"  → legacy stacked bars with profit line
 *   "grouped"  → grouped bars
 *   "donut"    → subject/category revenue split (PieChart)
 */
import { useMemo } from "react";
import {
  ResponsiveContainer, BarChart, ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie,
  Cell, Sector,
} from "recharts";

interface BaseProps {
  data: any[];
  type: "trend" | "stacked" | "grouped" | "donut";
}

// ─── Shared tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 p-3 rounded-xl shadow-lg text-sm min-w-[160px]">
      <p className="text-gray-500 font-bold text-[11px] mb-1.5">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex justify-between items-center gap-4 py-0.5">
          <span className="font-bold flex items-center gap-1.5" style={{ color: entry.color }}>
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            {entry.name}
          </span>
          <span className="text-gray-900 font-black">₹{Number(entry.value).toLocaleString("en-IN")}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Donut tooltip ────────────────────────────────────────────────────────────
const DonutTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white border border-gray-200 p-3 rounded-xl shadow-lg text-sm">
      <p className="font-bold text-gray-900">{d.name}</p>
      <p className="text-emerald-700 font-black">₹{Number(d.value).toLocaleString("en-IN")}</p>
      <p className="text-[10px] text-gray-400">{d.payload.pct}% of total</p>
    </div>
  );
};

const DONUT_COLORS = ["#6366f1","#10b981","#f59e0b","#3b82f6","#ef4444","#8b5cf6","#14b8a6","#f97316"];

const Empty = () => (
  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
    No data available
  </div>
);

export const RevenueChart = ({ data, type }: BaseProps) => {
  const chartData = useMemo(() => data, [data]);
  if (chartData.length === 0) return <Empty />;

  // ── Trend: Paid / Pending / Overdue monthly bars ──────────────────────────
  if (type === "trend") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} tickLine={false} axisLine={false} dy={8} />
          <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} width={65} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(229,231,235,0.4)" }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
          <Bar dataKey="paid"    name="Collected"  stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} barSize={28} />
          <Bar dataKey="pending" name="Pending"    stackId="a" fill="#f59e0b" barSize={28} />
          <Bar dataKey="overdue" name="Overdue"    stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={28} />
          <Line type="monotone" dataKey="total" name="Total" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: "#6366f1" }} />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  // ── Donut: subject/category split ─────────────────────────────────────────
  if (type === "donut") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData} dataKey="amount" nameKey="label"
            cx="50%" cy="50%" outerRadius="70%" innerRadius="42%"
            strokeWidth={2} stroke="#fff"
            label={({ name, pct }) => `${name} (${pct}%)`}
            labelLine={false}
          >
            {chartData.map((_: any, i: number) => (
              <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<DonutTooltip />} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  // ── Grouped ───────────────────────────────────────────────────────────────
  if (type === "grouped") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B7280" }} tickLine={false} axisLine={false} dy={8} />
          <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(229,231,235,0.4)" }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
          <Bar dataKey="revenue" name="Agency Revenue" fill="#10B981" radius={[4, 4, 0, 0]} barSize={16} />
          <Bar dataKey="payout"  name="Tutor Payout"   fill="#6366F1" radius={[4, 4, 0, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // ── Stacked + profit line (legacy) ────────────────────────────────────────
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6B7280" }} tickLine={false} axisLine={false} dy={8} />
        <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(229,231,235,0.4)" }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: "13px", paddingTop: "16px" }} />
        <Bar dataKey="revenue" name="Agency Revenue" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} barSize={32} />
        <Bar dataKey="payout"  name="Tutor Payout"   stackId="a" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={32} />
        <Line type="monotone" dataKey="profit" name="Net Profit" stroke="#F59E0B" strokeWidth={3} dot={false}
          activeDot={{ r: 6, fill: "#F59E0B", stroke: "#FFF", strokeWidth: 2 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
