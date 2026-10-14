import React, { useState } from 'react';
import {
  FolderTree,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  PauseCircle,
  PlayCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import { useSourcing } from '../../context/SourcingContext';

export const CategoryGovernance: React.FC = () => {
  const { governanceConfig, updateDraftConfig, currentUser } = useSourcing();

  const [categories, setCategories] = useState([
    {
      id: 'cat_furniture',
      name: 'Office Furniture & Seating',
      unspscPrefix: '5610',
      status: 'active',
      isPilot: true,
      spendBand: '$2K – $25K',
      annualVolume: '$4.8M',
      requestsInScope: 340,
      riskLevel: 'Low',
      assignedApprover: 'Alex Vance',
      isExecutionPaused: false,
      rules: ['ANSI/BIFMA X5.1 compliance', 'Commercial 3-yr warranty', 'Standard 15-day lead time'],
    },
    {
      id: 'cat_it_consumables',
      name: 'IT Consumables & Peripherals',
      unspscPrefix: '4321',
      status: 'sandbox',
      isPilot: false,
      spendBand: '$1K – $15K',
      annualVolume: '$3.2M',
      requestsInScope: 520,
      riskLevel: 'Low',
      assignedApprover: 'Alex Vance',
      isExecutionPaused: false,
      rules: ['OEM or certified compatible', 'Fast 48h fulfillment', 'Serial tracking enabled'],
    },
    {
      id: 'cat_mro',
      name: 'Maintenance, Repair & Operations (MRO)',
      unspscPrefix: '3116',
      status: 'sandbox',
      isPilot: false,
      spendBand: '$500 – $20K',
      annualVolume: '$6.5M',
      requestsInScope: 410,
      riskLevel: 'Medium',
      assignedApprover: 'Alex Vance',
      isExecutionPaused: false,
      rules: ['OSHA/EPA compliance', 'Same-day emergency dispatch allowed', 'Catalog rate verification'],
    },
    {
      id: 'cat_lab_calib',
      name: 'Laboratory Calibration Services',
      unspscPrefix: '8114',
      status: 'active',
      isPilot: false,
      spendBand: '$1K – $25K',
      annualVolume: '$1.9M',
      requestsInScope: 95,
      riskLevel: 'High (Regulatory)',
      assignedApprover: 'Alex Vance',
      isExecutionPaused: false,
      rules: ['UKAS / NIST ISO 17025 mandatory', 'On-site engineer verification', '5-day cert turnaround'],
    },
  ]);

  const togglePause = (catId: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, isExecutionPaused: !c.isExecutionPaused } : c))
    );
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50">
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A99A]">
              Spend Categories & Scopes
            </span>
            <span className="text-xs bg-teal-50 text-teal-800 font-semibold px-2 py-0.5 rounded border border-teal-200">
              4 Categories Managed
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Category Governance & Autonomy Permissions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Office Furniture is the production pilot. Other categories can be simulated or enabled via Governance Version Approval.
          </p>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`bg-white rounded-xl border p-5 shadow-xs space-y-4 transition ${
              cat.status === 'active' ? 'border-teal-300 ring-1 ring-teal-100' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{cat.name}</h3>
                  {cat.isPilot && (
                    <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded">
                      PILOT
                    </span>
                  )}
                  {cat.isExecutionPaused && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                      PAUSED
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  UNSPSC Prefix: {cat.unspscPrefix} · Scope: {cat.spendBand}
                </div>
              </div>

              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  cat.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {cat.status === 'active' ? 'Production Active' : 'Sandbox Preview'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-medium">Annual Spend</span>
                <div className="font-bold text-slate-900 font-mono mt-0.5">{cat.annualVolume}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-medium">Txns in Scope</span>
                <div className="font-bold text-slate-900 font-mono mt-0.5">{cat.requestsInScope}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-medium">Compliance Risk</span>
                <div className="font-bold text-slate-900 mt-0.5">{cat.riskLevel}</div>
              </div>
            </div>

            {/* Enforced rules */}
            <div>
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Governed Category Rules
              </span>
              <div className="space-y-1">
                {cat.rules.map((r, i) => (
                  <div key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                    <span className="text-[#00A99A]">✓</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-400">
                Approver: <span className="text-slate-700 font-medium">{cat.assignedApprover}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePause(cat.id)}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium border transition flex items-center gap-1 ${
                    cat.isExecutionPaused
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {cat.isExecutionPaused ? (
                    <>
                      <PlayCircle className="w-3.5 h-3.5" /> Resume Agent
                    </>
                  ) : (
                    <>
                      <PauseCircle className="w-3.5 h-3.5" /> Pause Sourcing
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
