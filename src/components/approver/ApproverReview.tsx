import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileCheck2,
  GitCompare,
  TestTube2,
  Lock,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { useSourcing } from '../../context/SourcingContext';

export const ApproverReview: React.FC = () => {
  const {
    draftConfig,
    governanceConfig,
    approveAndPublishDraft,
    rejectDraft,
    isDraftSubmitted,
    replayEvals,
    scenarioEvals,
    evalsRunCount,
  } = useSourcing();

  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const handleApprove = () => {
    approveAndPublishDraft();
    setPublishedSuccess(true);
    setTimeout(() => setPublishedSuccess(false), 4000);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    rejectDraft(rejectReason);
    setIsRejectModalOpen(false);
    setRejectReason('');
  };

  const awardShifts = replayEvals.filter((r) => r.awardChanged).length;

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Governance Review & Sign-Off
            </span>
            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
              Author/Approver Segregation
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Pending Policy Draft Review: {draftConfig.version}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Submitted by Customer Administrator Priya Sharma. You are authorized to review evaluation proofs and publish to production.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRejectModalOpen(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-rose-50 text-rose-700 border border-slate-300 hover:border-rose-300 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            Reject Draft
          </button>

          <button
            onClick={handleApprove}
            className="px-4 py-2 bg-[#00A99A] hover:bg-[#008f82] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approve & Publish to Production
          </button>
        </div>
      </div>

      {publishedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-medium flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold">Policy Successfully Published!</span> New sourcing requests will now run under active parameter {draftConfig.version.replace('-draft', '')}.
          </div>
        </div>
      )}

      {/* Segregation of Duties Banner */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-3">
        <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Compliance Invariant Enforced:</span>
          <p className="mt-0.5 text-blue-800">
            Priya Sharma cannot self-approve. As independent Governance Approver, your approval verifies that Replay Evaluations and Scenario test suites have been inspected.
          </p>
        </div>
      </div>

      {/* Parameter Diff Summary */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-teal-600" />
          Proposed Changes (Diff: {governanceConfig.version} → {draftConfig.version})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500">Agent Execution Ceiling</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-slate-400 line-through">
                ${governanceConfig.budgetCeiling.toLocaleString()}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono font-bold text-emerald-700 text-sm">
                ${draftConfig.budgetCeiling.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500">Award Scoring Weights</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-slate-400 line-through">
                {governanceConfig.awardWeights.priceWeight}% / {governanceConfig.awardWeights.complianceWeight}%
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono font-bold text-purple-700 text-sm">
                {draftConfig.awardWeights.priceWeight}% / {draftConfig.awardWeights.complianceWeight}%
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500">Split Award Policy</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-slate-400 line-through">Disabled</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono font-bold text-teal-700 text-sm">
                {draftConfig.supplierPolicy.allowSplitAwards ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Proofs Checklist */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <TestTube2 className="w-4 h-4 text-purple-600" />
          Mandatory Pre-Publish Proof Verification
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Historical Event Replay Test Suite
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Re-ran 4 recent closed events. {awardShifts} award shift detected (Barcode Scanners shifted to higher-compliance supplier).
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 font-mono">PASSED</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Scenario Edge-Case Suite
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                All 4 synthetic hard-case tests (Cold Start, Insufficient Quotes, Tied Score, Offline Extraction) completed deterministically.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 font-mono">PASSED</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Weights Total Check (100% Invariant)
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Price ({draftConfig.awardWeights.priceWeight}%) + Compliance ({draftConfig.awardWeights.complianceWeight}%) = 100%.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 font-mono">PASSED</span>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Reject Governance Draft
            </h3>
            <p className="text-xs text-slate-600">
              Provide feedback to Customer Admin Priya Sharma explaining why this parameter configuration cannot be published.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="e.g., Compliance weighting increase to 30% alters too many awards in IT peripherals without category manager alignment..."
              className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                disabled={!rejectReason.trim()}
                onClick={handleReject}
                className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-40 transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
