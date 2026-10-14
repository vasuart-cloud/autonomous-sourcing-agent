import React, { useState } from 'react';
import {
  Sliders,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  TestTube2,
  FileCheck2,
  Send,
  Eye,
  GitCompare,
  RotateCcw,
} from 'lucide-react';
import { useSourcing } from '../../context/SourcingContext';

interface AgentConfigurationProps {
  onNavigateToEvals?: () => void;
}

export const AgentConfiguration: React.FC<AgentConfigurationProps> = ({
  onNavigateToEvals,
}) => {
  const {
    governanceConfig,
    draftConfig,
    updateDraftConfig,
    submitDraftForApproval,
    isDraftSubmitted,
    currentUser,
  } = useSourcing();

  const [isDiffOpen, setIsDiffOpen] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Form values mirrored from draftConfig
  const ceiling = draftConfig.budgetCeiling;
  const directMax = draftConfig.routingThresholds.directSpendMax;
  const priceWeight = draftConfig.awardWeights.priceWeight;
  const complianceWeight = draftConfig.awardWeights.complianceWeight;

  const weightsValid = priceWeight + complianceWeight === 100;

  const handlePriceWeightChange = (newPrice: number) => {
    const clampedPrice = Math.max(0, Math.min(100, newPrice));
    updateDraftConfig({
      awardWeights: {
        priceWeight: clampedPrice,
        complianceWeight: 100 - clampedPrice,
      },
    });
  };

  const handleSaveDraft = () => {
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const toggleExclusionRule = (ruleId: string) => {
    const updated = draftConfig.exclusionRules.map((r) =>
      r.id === ruleId && !r.isProtected ? { ...r, enabled: !r.enabled } : r
    );
    updateDraftConfig({ exclusionRules: updated });
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A99A]">
              Agent Parameter Governance
            </span>
            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
              Draft Version: {draftConfig.version}
            </span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Active: {governanceConfig.version}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Autonomous Sourcing Levers & Policy Parameters
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customers govern agents through bounded, typed levers — not unrestricted free-text prompts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDiffOpen(!isDiffOpen)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition flex items-center gap-1.5"
          >
            <GitCompare className="w-3.5 h-3.5" />
            Compare Diffs
          </button>

          <button
            onClick={handleSaveDraft}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition"
          >
            Save Draft
          </button>

          <button
            onClick={submitDraftForApproval}
            disabled={!weightsValid || isDraftSubmitted}
            className="px-4 py-2 bg-[#00A99A] hover:bg-[#008f82] disabled:opacity-40 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            {isDraftSubmitted ? 'Submitted to Alex' : 'Submit for Approval'}
          </button>
        </div>
      </div>

      {/* Author / Approver Separation Notice */}
      <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-3">
        <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Author / Approver Separation Guard:</span>
          <p className="mt-0.5 text-blue-800">
            As Customer Administrator ({currentUser.name}), you author and evaluate drafts. Direct publication is restricted; parameter changes must be reviewed and published by Governance Approver <strong>Alex Vance</strong> after mandatory Evals pass.
          </p>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Draft parameters saved to persistent local store.
        </div>
      )}

      {/* Diff Viewer Modal / Card */}
      {isDiffOpen && (
        <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-700 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between text-teal-400 font-bold">
            <span>PARAMETER DIFF: {governanceConfig.version} (Active) → {draftConfig.version} (Draft)</span>
            <button
              onClick={() => setIsDiffOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕ Close
            </button>
          </div>
          <div className="space-y-1 text-[11px] leading-relaxed">
            <div>- budgetCeiling: ${governanceConfig.budgetCeiling.toLocaleString()}</div>
            <div className="text-emerald-400">+ budgetCeiling: ${draftConfig.budgetCeiling.toLocaleString()}</div>
            <div>- priceWeight: {governanceConfig.awardWeights.priceWeight}%</div>
            <div className="text-emerald-400">+ priceWeight: {draftConfig.awardWeights.priceWeight}%</div>
            <div>- complianceWeight: {governanceConfig.awardWeights.complianceWeight}%</div>
            <div className="text-emerald-400">+ complianceWeight: {draftConfig.awardWeights.complianceWeight}%</div>
            <div>- allowSplitAwards: {String(governanceConfig.supplierPolicy.allowSplitAwards)}</div>
            <div className="text-emerald-400">+ allowSplitAwards: {String(draftConfig.supplierPolicy.allowSplitAwards)}</div>
          </div>
        </div>
      )}

      {/* Main Parameters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Levers: Budget & Routing */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#00A99A]" />
            Spend Limits & Routing Thresholds
          </h3>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
              <span>Agent Execution Ceiling</span>
              <span className="font-mono text-teal-700 font-bold">${ceiling.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={10000}
              max={50000}
              step={5000}
              value={ceiling}
              onChange={(e) => updateDraftConfig({ budgetCeiling: Number(e.target.value) })}
              className="w-full accent-[#00A99A] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>$10,000 (Conservative)</span>
              <span>$25,000 (Default)</span>
              <span>$50,000 (Expansive)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <span className="text-xs font-bold text-slate-700 block">
              Automated Routing Gates
            </span>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Under $2,000</span>
                <span className="font-semibold text-slate-900">Direct Purchase Route</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">$2,000 – ${ceiling.toLocaleString()}</span>
                <span className="font-semibold text-teal-700">Competitive 3-Quote Event</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Above ${ceiling.toLocaleString()}</span>
                <span className="font-semibold text-purple-700">Strategic Full RFx Sourcing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Levers: Award Scoring Weights */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-600" />
              Award Evaluation Weights
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                weightsValid
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {weightsValid ? 'Totals 100%' : 'Must equal 100%'}
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Controls how the Evaluation & Award Agent scores supplier bids. Increasing compliance weighting prioritizes delivery reliability and warranty terms.
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                <span>Commercial / Price Weight</span>
                <span className="font-mono text-purple-700 font-bold">{priceWeight}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={90}
                step={5}
                value={priceWeight}
                onChange={(e) => handlePriceWeightChange(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                <span>Compliance, Quality & Delivery Weight</span>
                <span className="font-mono text-teal-700 font-bold">{complianceWeight}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                step={5}
                value={complianceWeight}
                onChange={(e) =>
                  handlePriceWeightChange(100 - Number(e.target.value))
                }
                className="w-full accent-[#00A99A] cursor-pointer"
              />
            </div>

            <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-200 text-xs text-purple-900">
              <span className="font-bold">Evals Requirement:</span> Replay evaluations are mandatory whenever weights are modified before submission to Alex.
            </div>
          </div>
        </div>
      </div>

      {/* Exclusion Rules Library & Closure Policy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predefined Exclusion Rules */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            Predefined Supplier Exclusion Rules
          </h3>
          <p className="text-xs text-slate-500">
            Rules automatically checked by Event and Evaluation agents before awarding.
          </p>

          <div className="space-y-2.5">
            {draftConfig.exclusionRules.map((rule) => (
              <label
                key={rule.id}
                className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer text-xs transition ${
                  rule.enabled
                    ? 'bg-rose-50/30 border-rose-200'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={rule.enabled}
                  disabled={rule.isProtected}
                  onChange={() => toggleExclusionRule(rule.id)}
                  className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{rule.name}</span>
                    {rule.isProtected && (
                      <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" /> Protected
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{rule.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Supplier Shortlist & Closure Policy */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            Supplier Shortlist & Closure Policy
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="font-bold text-slate-800">Minimum Suppliers Proposed</span>
                <p className="text-[11px] text-slate-500">Candidate vendors per event</p>
              </div>
              <span className="font-mono font-bold text-slate-900 text-sm">4 Suppliers</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="font-bold text-slate-800">Quotes Required for Closure</span>
                <p className="text-[11px] text-slate-500">Trigger for auto-closure</p>
              </div>
              <span className="font-mono font-bold text-slate-900 text-sm">3 Quotes</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="font-bold text-slate-800">Allow Early Event Closure</span>
                <p className="text-[11px] text-slate-500">Close before deadline when quotes met</p>
              </div>
              <span className="text-emerald-700 font-bold">Enabled</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="font-bold text-slate-800">Offline Quote Ingestion</span>
                <p className="text-[11px] text-slate-500">Allow buyers to upload emailed PDF quotes</p>
              </div>
              <span className="text-emerald-700 font-bold">Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
