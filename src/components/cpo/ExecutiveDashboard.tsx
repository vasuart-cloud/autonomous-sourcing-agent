import React from 'react';
import {
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Award,
  Layers,
  Zap,
  Target,
  ArrowRight,
  AlertTriangle,
  FileCheck2,
  Lock,
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

export const ExecutiveDashboard: React.FC = () => {
  const quarterlyGrowth = [
    { quarter: 'Q1 2026', spend: 42000, buyers: 6 },
    { quarter: 'Q2 2026', spend: 78000, buyers: 10 },
    { quarter: 'Q3 2026', spend: 134000, buyers: 14 },
    { quarter: 'Q4 2026 (Est)', spend: 185000, buyers: 18 },
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Executive Sponsor View
            </span>
            <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded">
              CPO Dashboard
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Autonomous Sourcing: Tail Spend Under Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Governed tail spend coverage across $88M total indirect spend portfolio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-right">
            <span className="text-[10px] text-purple-800 font-bold uppercase">Total Managed Spend</span>
            <div className="text-lg font-bold text-purple-950 font-mono">$420M</div>
          </div>
          <div className="p-3 bg-teal-50 rounded-lg border border-teal-200 text-right">
            <span className="text-[10px] text-teal-800 font-bold uppercase">Total Tail Spend</span>
            <div className="text-lg font-bold text-teal-950 font-mono">$88M (21%)</div>
          </div>
        </div>
      </div>

      {/* North Star Hero & The Pairing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#172447] text-white p-6 rounded-xl border border-[#233564] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00E5D0] bg-[#00A99A]/20 px-2.5 py-0.5 rounded border border-[#00A99A]/30">
              North Star Metric
            </span>
            <span className="text-xs text-slate-300">Target: $250k / buyer / qtr</span>
          </div>

          <h2 className="text-2xl font-bold text-white">
            Tail spend competitively sourced per active buyer
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Moves only when the agent is adopted, trusted, and completing events — adoption alone cannot inflate it, and neither can speed.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Q4 Rate</span>
              <div className="text-xl font-bold font-mono text-[#00E5D0] mt-1">$185,000</div>
              <span className="text-[10px] text-emerald-400">↑ 38% QoQ</span>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Buyers</span>
              <div className="text-xl font-bold font-mono text-white mt-1">18 Tactical Buyers</div>
              <span className="text-[10px] text-slate-300">Maya Lin & Team</span>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Tail Captured</span>
              <div className="text-xl font-bold font-mono text-amber-300 mt-1">$2.4M</div>
              <span className="text-[10px] text-slate-300">Phase 1 Pilot</span>
            </div>
          </div>
        </div>

        {/* Why Not Savings Panel */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" /> Why Not Savings Yet?
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-1">
              Phase 1 Scope Boundary Decision
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Savings measurement is intentionally out of Phase 1 scope. Naming it as the North Star would mean reporting an unverifiable number before baseline contracts exist.
            </p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              BCG estimates <strong>5–10% cost savings</strong> on tail spend once actively managed. We unlock savings measurement in Phase 2.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
            <span className="font-bold text-slate-900">Gartner Projection:</span> ~60% of procurement organizations will adopt tail spend technology by 2030.
          </div>
        </div>
      </div>

      {/* The 4 Governance Pillars Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase text-purple-700 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> Pillar: Trust
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">84.2%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Acceptance w/o edit (Stable)</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">68.4% drill-down rate</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase text-blue-700 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Pillar: Adoption
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">142 Events</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Autonomously managed</div>
          <div className="text-[10px] text-blue-600 font-medium mt-1">16 repeat buyers (88%)</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase text-emerald-700 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Pillar: Efficiency
          </div>
          <div className="text-2xl font-bold text-emerald-800 mt-2 font-mono">8.4 mins</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Median need-to-live RFQ</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">72% faster than form</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase text-[#00A99A] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Pillar: Quality
          </div>
          <div className="text-2xl font-bold text-teal-800 mt-2 font-mono">98.6%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Offline extraction accuracy</div>
          <div className="text-[10px] text-teal-600 font-medium mt-1">Zero compliance gaps</div>
        </div>
      </div>

      {/* Roadmap & Commercial Go-To-Market */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roadmap */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-teal-600" />
            Product Roadmap: Sequenced by Trust Earned
          </h3>

          <div className="space-y-3 text-xs pt-1">
            <div className="p-3 bg-teal-50/70 border border-teal-300 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-950">MVP Phase 1: Defensible Award on Tail Spend (Current)</span>
                <span className="text-[10px] bg-[#00A99A] text-white px-2 py-0.5 rounded font-bold">
                  Active In Prod
                </span>
              </div>
              <p className="text-[11px] text-teal-800 mt-1">
                Level 2 autonomy (3 human gates), explainable awards, offline quotes, versioned admin parameters with Replay Evals.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Phase 2: Depth on Evaluation</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
                  Q1 2027
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Savings measurement against market index, automated negotiation bot, Deep Research supplier grounding, automated ERP PR/PO trigger.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Phase 3: Category Reach</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
                  Q3 2027
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Expands from 1 category to the entire $88M tail spend portfolio (MRO, IT consumables, lab services, facilities).
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Phase 4: Measured Autonomy</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
                  Trust Gated
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Policy-bounded auto-award (Level 3 autonomy) only once acceptance data justifies it — not an arbitrary calendar date.
              </p>
            </div>
          </div>
        </div>

        {/* Commercial GTM & Pricing */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-purple-600" />
            Go-to-Market & Commercial Pricing Options
          </h3>

          <div className="space-y-3 text-xs pt-1">
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950">
                  Recommended for Phase 1: Platform Entitlement
                </span>
                <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded font-bold">
                  Recommended
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-1">
                Paid entitlement on existing tenant permission model. Simple to meter, frictionless adoption.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Candidate: Per Event Consumed</span>
                <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                  Alternative
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Priced per sourcing event above included allowance. Scales with volume, but risks discouraging buyer usage.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Blocked Until Phase 2: Share of Savings</span>
                <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-semibold">
                  Blocked
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Share of measured savings. Best long-term story, but cannot compute until Phase 2 savings benchmarking is released.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
