import React from 'react';
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Users,
  DollarSign,
  FileText,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { useSourcing } from '../../context/SourcingContext';

export const GovernanceOverview: React.FC = () => {
  const { events, governanceConfig, auditLogs } = useSourcing();

  // Weekly sourcing events volume
  const weeklyActivityData = [
    { week: 'W1 Sep', events: 18, competitive: 15, direct: 3 },
    { week: 'W2 Sep', events: 24, competitive: 21, direct: 3 },
    { week: 'W3 Sep', events: 29, competitive: 26, direct: 3 },
    { week: 'W4 Sep', events: 35, competitive: 31, direct: 4 },
    { week: 'W1 Oct', events: 42, competitive: 38, direct: 4 },
    { week: 'W2 Oct', events: 48, competitive: 43, direct: 5 },
  ];

  // Category distribution
  const categoryData = [
    { name: 'Office Furniture', value: 48, color: '#00A99A' },
    { name: 'IT Consumables', value: 28, color: '#2563EB' },
    { name: 'Laboratory Services', value: 14, color: '#7C3AED' },
    { name: 'MRO & Facilities', value: 10, color: '#F4A44C' },
  ];

  // Approval Funnel
  const funnelData = [
    { stage: 'Need Intake', count: 180 },
    { stage: 'Gate 1 (Specs)', count: 172 },
    { stage: 'Gate 2 (Launch)', count: 168 },
    { stage: 'Quotes Received', count: 162 },
    { stage: 'Gate 3 (Award)', count: 158 },
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A99A]">
              Customer Administration Portal
            </span>
            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono">
              Active Policy: {governanceConfig.version}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Autonomous Tail Spend Governance & Oversight
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overseeing $38M tail spend under governed Level 2 multi-agent autonomy
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-lg bg-teal-50 border border-teal-200 text-right">
            <div className="text-[10px] uppercase font-bold text-teal-800">Agent Ceiling</div>
            <div className="text-base font-bold text-teal-900 font-mono">
              ${governanceConfig.budgetCeiling.toLocaleString()}
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-lg bg-slate-100 border border-slate-200 text-right">
            <div className="text-[10px] uppercase font-bold text-slate-600">Scoring Weights</div>
            <div className="text-base font-bold text-slate-900 font-mono">
              {governanceConfig.awardWeights.priceWeight}% / {governanceConfig.awardWeights.complianceWeight}%
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Eligible Tail Requests</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">1,120</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <span>↑ 18%</span>
            <span className="text-slate-400">vs prior quarter</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Competitively Sourced Tail</span>
            <DollarSign className="w-4 h-4 text-[#00A99A]" />
          </div>
          <div className="text-2xl font-bold text-teal-800 mt-2 font-mono">$2,410,000</div>
          <div className="text-[11px] text-teal-700 font-medium mt-1">
            80% transactions now sourced
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Award Acceptance (No Edit)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">84.2%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            15.8% Buyer Overrides recorded
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Median Cycle Time</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">8.4 mins</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            ↓ 72% from 30+ mins legacy form
          </div>
        </div>
      </div>

      {/* Two Column Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Events Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Weekly Autonomous Sourcing Throughput
              </h3>
              <p className="text-[11px] text-slate-500">
                Competitive 3-Quote Events vs Direct Threshold Routes
              </p>
            </div>
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              +240% Growth
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#172447',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="competitive" name="Competitive RFQ Event" fill="#00A99A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="direct" name="Direct Under $2K" fill="#233564" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Spend Share by Eligible Category
              </h3>
              <p className="text-[11px] text-slate-500">Office Furniture pilot driving initial volume</p>
            </div>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Pilot Category: Office Seating
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value}% of tail spend`, 'Share']}
                  contentStyle={{
                    backgroundColor: '#172447',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs pt-1">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-slate-700 font-medium">{c.name}</span>
                <span className="text-slate-400 font-mono text-[11px]">({c.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Buyer Approval Funnel & Governance Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Level 2 Autonomy Approval Funnel
          </h3>
          <p className="text-[11px] text-slate-500">
            Conversion across Gate 1 (Spec), Gate 2 (Launch), and Gate 3 (Award)
          </p>

          <div className="space-y-2.5 pt-2">
            {funnelData.map((step, idx) => {
              const pct = Math.round((step.count / funnelData[0].count) * 100);
              return (
                <div key={step.stage} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700">{step.stage}</span>
                    <span className="font-mono text-slate-900 font-bold">
                      {step.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00A99A] to-[#2563EB] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-3 bg-teal-50/50 rounded-lg border border-teal-200 text-xs text-teal-900 mt-2">
            <span className="font-bold">Zero Autonomy Leakage:</span> 100% of awarded events passed through all 3 human approval gates without bypass.
          </div>
        </div>

        {/* Recent Governance Audit Trail Preview */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Immutable Governance Audit Preview
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Append-Only</span>
          </div>

          <div className="space-y-2.5 overflow-hidden">
            {auditLogs.slice(0, 4).map((entry) => (
              <div
                key={entry.id}
                className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-800">{entry.action}</span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] mt-1 line-clamp-1">{entry.details}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>Actor: {entry.actor} ({entry.role})</span>
                  <span className="font-mono">{entry.hash}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
