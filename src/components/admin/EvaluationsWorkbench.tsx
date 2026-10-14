import React, { useState } from 'react';
import {
  TestTube2,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Clock,
  Layers,
  FileCheck2,
} from 'lucide-react';
import { useSourcing } from '../../context/SourcingContext';

export const EvaluationsWorkbench: React.FC = () => {
  const {
    draftConfig,
    scenarioEvals,
    replayEvals,
    runReplayEvals,
    runScenarioEvals,
    evalsRunCount,
    submitDraftForApproval,
    isDraftSubmitted,
  } = useSourcing();

  const [activeTab, setActiveTab] = useState<'replay' | 'scenario'>('replay');
  const [isRunning, setIsRunning] = useState(false);

  const handleRunAllEvals = () => {
    setIsRunning(true);
    setTimeout(() => {
      runReplayEvals();
      runScenarioEvals();
      setIsRunning(false);
    }, 700);
  };

  const awardShiftsCount = replayEvals.filter((r) => r.awardChanged).length;

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A99A]">
              Governance Proof Engine
            </span>
            <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded">
              Draft Target: {draftConfig.version}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Evaluations Workbench: Replay & Scenario Proofs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evals prove policy changes before production release. Replay tests historical events; Scenario tests edge cases.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunAllEvals}
            disabled={isRunning}
            className="px-4 py-2.5 bg-[#00A99A] hover:bg-[#008f82] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-2"
          >
            <Play className={`w-3.5 h-3.5 fill-white ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Simulating Evals...' : 'Run All Evaluations'}
          </button>
        </div>
      </div>

      {/* Proof before publish lifecycle callout */}
      <div className="p-4 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#00A99A] text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900">
              Mandatory Proof-Before-Publish Lifecycle
            </div>
            <div className="text-slate-600 mt-0.5">
              Draft ({draftConfig.version}) → Evaluated ({evalsRunCount} runs) → Submitted → Approver Sign-off → Published
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-semibold text-slate-500 block">Status</span>
          <span className="text-xs font-bold text-teal-800">
            {evalsRunCount > 0 ? '✓ Ready for Alex Vance Review' : 'Pending Replay Run'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold text-slate-600">
        <button
          onClick={() => setActiveTab('replay')}
          className={`pb-2.5 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'replay'
              ? 'border-[#00A99A] text-[#00A99A]'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <span>Replay Evaluations</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
            {replayEvals.length} events
          </span>
        </button>

        <button
          onClick={() => setActiveTab('scenario')}
          className={`pb-2.5 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'scenario'
              ? 'border-[#00A99A] text-[#00A99A]'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <span>Scenario Suite (Edge Cases)</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
            {scenarioEvals.length} suites
          </span>
        </button>
      </div>

      {/* Tab 1: Replay Evaluations */}
      {activeTab === 'replay' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Replay Simulation Results:</span>
              <p className="mt-0.5 text-amber-800">
                Simulating historical sourcing events under <strong>{draftConfig.version} (70% Price / 30% Compliance)</strong> reveals <strong>{awardShiftsCount} award shift</strong>. Higher compliance weight awards quality vendors over purely bottom-dollar bids.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Event Ref & Title</th>
                  <th className="p-3">Original Winner (v4.0)</th>
                  <th className="p-3">Simulated Winner (Draft)</th>
                  <th className="p-3 text-center">Outcome Shift</th>
                  <th className="p-3 text-right">Score Delta</th>
                  <th className="p-3">Audit Variance Analysis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {replayEvals.map((item) => (
                  <tr
                    key={item.eventId}
                    className={item.awardChanged ? 'bg-amber-50/60 font-medium' : 'hover:bg-slate-50'}
                  >
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{item.eventTitle}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.eventId}</div>
                    </td>
                    <td className="p-3 text-slate-700">{item.originalWinner}</td>
                    <td className="p-3">
                      <span className={item.awardChanged ? 'font-bold text-purple-700' : 'text-slate-800'}>
                        {item.newWinner}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {item.awardChanged ? (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-300">
                          Award Shifted
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          Unchanged
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono font-bold">
                      {item.originalScore} → {item.newScore}
                    </td>
                    <td className="p-3 text-slate-600 text-[11px] max-w-xs">{item.varianceNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Scenario Suite */}
      {activeTab === 'scenario' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenarioEvals.map((sc) => (
              <div
                key={sc.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs">{sc.name}</h3>
                    <span className="text-[10px] font-semibold text-slate-500">
                      Category: {sc.category}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Passed ({sc.durationMs}ms)
                  </span>
                </div>

                <p className="text-xs text-slate-600">{sc.description}</p>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-700">
                  <span className="font-semibold text-slate-900">Deterministic Result:</span>{' '}
                  {sc.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
