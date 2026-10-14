import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Sliders,
  Filter,
  Layers,
  Award,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export const CategoryMetrics: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('q3_q4');

  // Trend data for North Star Metric
  const northStarTrend = [
    { quarter: 'Q1 2026 (Manual)', value: 42000, buyers: 6 },
    { quarter: 'Q2 2026 (Piloting)', value: 78000, buyers: 10 },
    { quarter: 'Q3 2026 (Agent v3)', value: 134000, buyers: 14 },
    { quarter: 'Q4 2026 (Agent v4)', value: 185000, buyers: 18 },
  ];

  // Bias detection pairing: Acceptance rate vs Time-to-decision vs Drill-down rate
  const biasPairingTrend = [
    { month: 'Jun', acceptance: 74, timeToDecision: 6.8, drillDownRate: 62 },
    { month: 'Jul', acceptance: 79, timeToDecision: 5.5, drillDownRate: 64 },
    { month: 'Aug', acceptance: 82, timeToDecision: 4.8, drillDownRate: 66 },
    { month: 'Sep', acceptance: 84, timeToDecision: 4.2, drillDownRate: 68 },
    { month: 'Oct', acceptance: 85, timeToDecision: 4.1, drillDownRate: 70 },
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A99A]">
              Analytics & Measurement
            </span>
            <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
              Phase 1 Instrumentation
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Category Metrics & North Star Performance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Measured against trust, adoption, efficiency, quality — with strict automation bias safeguards.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#00A99A]"
          >
            <option value="all">All Sourcing Categories</option>
            <option value="furniture">Office Furniture & Seating</option>
            <option value="lab">Lab Calibration Services</option>
          </select>
        </div>
      </div>

      {/* NORTH STAR METRIC HERO CARD */}
      <div className="bg-[#172447] text-white p-6 rounded-xl border border-[#233564] shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#00A99A]/20 text-[#00E5D0] px-2.5 py-0.5 rounded border border-[#00A99A]/30">
                Core North Star Metric
              </span>
              <span className="text-xs text-slate-300">Phase 1 Target</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Tail spend competitively sourced per active buyer
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Measured per quarter. Moves only when the agent is adopted, trusted, and successfully completing events — adoption alone cannot inflate it, and neither can speed.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Current Q4 Rate</span>
                <div className="text-2xl font-bold font-mono text-[#00E5D0]">$185,000 / buyer</div>
              </div>
              <div className="border-l border-white/10 pl-4">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Buyers</span>
                <div className="text-2xl font-bold font-mono text-white">18 Buyers</div>
              </div>
            </div>
          </div>

          {/* Why Not Savings Callout */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-md text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Why not savings as the North Star?</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Savings measurement is intentionally out of Phase 1 MVP scope. Naming it as the North Star would mean reporting a speculative number we cannot yet compute without historical contract baseline skew. Phase 1 wins on adoption and trust.
            </p>
          </div>
        </div>
      </div>

      {/* THE PAIRING WE WON'T BREAK CALLOUT */}
      <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl text-xs text-amber-900 space-y-1 shadow-xs">
        <div className="font-bold flex items-center gap-2 text-amber-950">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          The Pairing We Won't Break: Automation Bias Guard
        </div>
        <p className="leading-relaxed text-amber-900 text-[11px]">
          <strong>Acceptance rate is never displayed alone.</strong> An acceptance rate climbing while time-to-decision and evidence drill-down both plummet is evidence of buyer rubber-stamping (automation bias) — on a conventional dashboard it would read as a triumph. Acceptance without edit is also our gate: we do not widen autonomy until human oversight holds steady.
        </p>
      </div>

      {/* 4 SUPPORTING METRIC PILLARS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Trust */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> 01 Trust
            </span>
            <span className="text-xs font-bold text-slate-900">High</span>
          </div>

          <div className="space-y-2 text-xs divide-y divide-slate-100">
            <div className="pt-1 flex justify-between">
              <span className="text-slate-600">Acceptance w/o edit</span>
              <span className="font-bold font-mono text-slate-900">84.2%</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-slate-600">Buyer override rate</span>
              <span className="font-bold font-mono text-slate-900">15.8%</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-slate-600">Evidence drill-down rate</span>
              <span className="font-bold font-mono text-slate-900">68.4%</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-slate-600">Time to decision (Gate 3)</span>
              <span className="font-bold font-mono text-slate-900">4.2 mins</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Adoption */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> 02 Adoption
            </span>
            <span className="text-xs font-bold text-slate-900">+42% QoQ</span>
          </div>

          <div className="space-y-2 text-xs divide-y divide-slate-100">
            <div className="pt-1 flex justify-between">
              <span className="text-slate-600">Agent-initiated events</span>
              <span className="font-bold font-mono text-slate-900">142</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-slate-600">Active tactical buyers</span>
              <span className="font-bold font-mono text-slate-900">18</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-slate-600">Repeat buyers (&gt;2 events)</span>
              <span className="font-bold font-mono text-slate-900">16 (88%)</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-slate-600">Buyer drop-out rate</span>
              <span className="font-bold font-mono text-slate-900">4.1%</span>
            </div>
          </div>
        </div>

        {/* Pillar 3: Efficiency */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> 03 Efficiency
            </span>
            <span className="text-xs font-bold text-slate-900">3.6x Faster</span>
          </div>

          <div className="space-y-2 text-xs divide-y divide-slate-100">
            <div className="pt-1 flex justify-between">
              <span className="text-slate-600">Need-to-live RFQ median</span>
              <span className="font-bold font-mono text-emerald-700">8.4 mins</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-slate-600">Legacy form setup</span>
              <span className="font-mono text-slate-400 line-through">30+ mins</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-slate-600">Buyer touches per event</span>
              <span className="font-bold font-mono text-slate-900">2.4</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-slate-600">Auto-closed on criteria</span>
              <span className="font-bold font-mono text-slate-900">74.0%</span>
            </div>
          </div>
        </div>

        {/* Pillar 4: Quality */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A99A] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> 04 Quality
            </span>
            <span className="text-xs font-bold text-slate-900">98.6% Acc</span>
          </div>

          <div className="space-y-2 text-xs divide-y divide-slate-100">
            <div className="pt-1 flex justify-between">
              <span className="text-slate-600">Category correction rate</span>
              <span className="font-bold font-mono text-slate-900">8.8%</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-slate-600">Supplier list edit rate</span>
              <span className="font-bold font-mono text-slate-900">14.2%</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-slate-600">Offline quote extraction</span>
              <span className="font-bold font-mono text-teal-700">98.6%</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-slate-600">Compliance leakages</span>
              <span className="font-bold font-mono text-emerald-600">0 (Zero)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart: The Pairing We Won't Break Visualization */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Automation Bias Safeguard: Acceptance vs Drill-Down Rate vs Time
            </h3>
            <p className="text-[11px] text-slate-500">
              Drill-down rate stays elevated as acceptance rises, verifying genuine human review.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            Healthy Oversight
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={biasPairingTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#172447',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
              />
              <Line
                type="monotone"
                dataKey="acceptance"
                name="Award Acceptance %"
                stroke="#00A99A"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="drillDownRate"
                name="Evidence Drill-Down %"
                stroke="#7C3AED"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="timeToDecision"
                name="Time to Decision (min)"
                stroke="#F4A44C"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
