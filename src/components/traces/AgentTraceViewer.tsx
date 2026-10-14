import React, { useState } from 'react';
import {
  GitBranch,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Building2,
  Radio,
  Scale,
  Sparkles,
} from 'lucide-react';
import { useSourcing } from '../../context/SourcingContext';

export const AgentTraceViewer: React.FC = () => {
  const { traces, activeEvent } = useSourcing();
  const [selectedAgentFilter, setSelectedAgentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>('trace_seed_1');

  // Seeded realistic traces if empty
  const displayTraces = [
    {
      id: 'trace_seed_1',
      timestamp: '2026-10-13T10:15:02Z',
      eventId: 'EVT-2026-1042',
      eventNumber: 'RFQ-2026-1042',
      category: 'Office Furniture & Seating',
      agentId: 'intake_policy',
      agentName: 'Intake & Policy Agent',
      operation: 'Requirement Classification & Policy Routing',
      latencyMs: 320,
      confidence: 0.98,
      status: 'completed',
      policyVersion: 'v4.0',
      reasoning: 'Extracted 50 task chairs for Dallas HQ. Assessed spend at $14,000 (inside $25,000 ceiling). Checked ERP master agreements: no active catalog contract. Policy requires 3-quote competitive event.',
      inputRecord: {
        rawInput: 'I need 50 ergonomic chairs for our Dallas office by 15 October.',
        detectedLocation: 'Dallas, TX',
        detectedItem: 'Ergonomic Task Chairs',
        quantity: 50,
      },
      outputRecord: {
        classification: 'Tail Spend (Eligible)',
        unspscCode: '56101504',
        route: 'Competitive Quote Event (3-Quote Rule)',
        gateStatus: 'Gate 1 Pending',
      },
      policyChecks: ['BUDGET_CEILING_PASS ($14k < $25k)', 'NO_EXISTING_CONTRACT_MATCH', 'TAIL_SPEND_CONFIRMED'],
    },
    {
      id: 'trace_seed_2',
      timestamp: '2026-10-13T10:15:18Z',
      eventId: 'EVT-2026-1042',
      eventNumber: 'RFQ-2026-1042',
      category: 'Office Furniture & Seating',
      agentId: 'category_supplier',
      agentName: 'Category & Supplier Agent',
      operation: 'Historical PO Cross-Reference & Specification Draft',
      latencyMs: 440,
      confidence: 0.96,
      status: 'completed',
      policyVersion: 'v4.0',
      reasoning: 'Retrieved 3 prior chair purchases (PO-39102, PO-38841, PO-37905). Synthesized technical specifications: mesh-back, adjustable lumbar, ANSI/BIFMA X5.1. Drafted balanced 4-supplier invitation shortlist.',
      inputRecord: {
        historicalPOCount: 3,
        closestMatch: 'PO-39102 ($285.00/unit, ErgoTech)',
      },
      outputRecord: {
        shortlist: ['Apex Workplace', 'ErgoTech Commercial', 'Northgate Contract', 'SteelCraft Direct'],
        closurePolicy: 'Auto-close upon 3 valid quotes',
      },
      policyChecks: ['UNSPSC_5610_VERIFIED', 'SANCTIONS_SCREEN_CLEAR', 'SUPPLIER_SHORTLIST_SIZE_4'],
    },
    {
      id: 'trace_seed_3',
      timestamp: '2026-10-13T10:17:05Z',
      eventId: 'EVT-2026-1042',
      eventNumber: 'RFQ-2026-1042',
      category: 'Office Furniture & Seating',
      agentId: 'event_agent',
      agentName: 'Event Agent',
      operation: 'Publish RFQ & Ingest Supplier Quotations',
      latencyMs: 280,
      confidence: 0.99,
      status: 'completed',
      policyVersion: 'v4.0',
      reasoning: 'Published RFQ following Gate 2 launch approval. Received 3 quotes. Disqualified Supplier C due to unanswered mandatory lead-time field. Triggered early closure rule 2 days ahead of deadline.',
      inputRecord: {
        invitedCount: 4,
        responsesReceived: 3,
      },
      outputRecord: {
        compliantQuotes: 2,
        excludedQuotes: 1,
        earlyClosureTriggered: true,
      },
      policyChecks: ['GATE2_HUMAN_APPROVAL_VERIFIED', 'EARLY_CLOSURE_CRITERIA_SATISFIED', 'EXCLUSION_RULE_LEADTIME'],
    },
    {
      id: 'trace_seed_4',
      timestamp: '2026-10-13T10:18:22Z',
      eventId: 'EVT-2026-1042',
      eventNumber: 'RFQ-2026-1042',
      category: 'Office Furniture & Seating',
      agentId: 'evaluation_award',
      agentName: 'Evaluation & Award Agent',
      operation: 'Multi-Factor Evaluation & Mathematical Award Recommendation',
      latencyMs: 380,
      confidence: 0.99,
      status: 'completed',
      policyVersion: 'v4.0',
      reasoning: 'Applied 80% price / 20% compliance weights. Supplier B scored 89.2 pts ($14,000, 12 Oct delivery); Supplier D scored 83.0 pts ($14,600, 14 Oct delivery). Math point difference: 6.2 pts directly attributable to $12/unit price advantage.',
      inputRecord: {
        weights: '80% Price / 20% Compliance',
        candidates: 2,
      },
      outputRecord: {
        recommendedSupplier: 'ErgoTech Commercial Seating (Supplier B)',
        rankDiff: '6.2 points ahead of Supplier D',
        purchaseRequisitionPrepared: 'PR-40218',
      },
      policyChecks: ['WEIGHTING_TOTAL_100_VERIFIED', 'COMPLIANCE_BARRIER_PASSED', 'GATE3_READY'],
    },
    ...traces,
  ];

  const filtered = displayTraces.filter((t) => {
    if (selectedAgentFilter !== 'all' && t.agentId !== selectedAgentFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.operation.toLowerCase().includes(q) ||
        t.reasoning.toLowerCase().includes(q) ||
        t.agentName.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A99A]">
              System Observability
            </span>
            <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded">
              Distributed Spans
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Multi-Agent Execution Traces & Spans
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full distributed execution tree with agent handoffs, latency measurements, policy checks, and evidence references.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter trace IDs or operations..."
              className="text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-[#00A99A]"
            />
          </div>

          <select
            value={selectedAgentFilter}
            onChange={(e) => setSelectedAgentFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Agents</option>
            <option value="intake_policy">01 Intake & Policy</option>
            <option value="category_supplier">02 Category & Supplier</option>
            <option value="event_agent">03 Event Agent</option>
            <option value="evaluation_award">04 Evaluation & Award</option>
          </select>
        </div>
      </div>

      {/* Traces List */}
      <div className="space-y-3">
        {filtered.map((tr) => {
          const isExpanded = expandedTraceId === tr.id;
          return (
            <div
              key={tr.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition"
            >
              <div
                onClick={() => setExpandedTraceId(isExpanded ? null : tr.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 select-none"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 ${
                      tr.agentId === 'intake_policy'
                        ? 'bg-[#00A99A]'
                        : tr.agentId === 'category_supplier'
                        ? 'bg-blue-600'
                        : tr.agentId === 'event_agent'
                        ? 'bg-[#F4A44C]'
                        : 'bg-purple-600'
                    }`}
                  >
                    {tr.agentId === 'intake_policy' && <ShieldCheck className="w-4 h-4" />}
                    {tr.agentId === 'category_supplier' && <Building2 className="w-4 h-4" />}
                    {tr.agentId === 'event_agent' && <Radio className="w-4 h-4" />}
                    {tr.agentId === 'evaluation_award' && <Scale className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{tr.agentName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">[{tr.id}]</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                        {tr.policyVersion}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium mt-0.5">{tr.operation}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <span className="font-mono text-teal-700 font-bold">{tr.latencyMs}ms</span>
                    <div className="text-[10px] text-slate-400">
                      Confidence {Math.round(tr.confidence * 100)}%
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                    Completed
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded Span Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      Why This Happened (Agent Decision Reasoning)
                    </span>
                    <p className="mt-1 p-3 bg-white rounded-lg border border-slate-200 text-slate-800 leading-relaxed font-sans">
                      {tr.reasoning}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                        Structured Inputs / Ingested Records
                      </span>
                      <pre className="mt-1 p-3 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-lg overflow-x-auto">
                        {JSON.stringify(tr.inputRecord || { eventId: tr.eventId }, null, 2)}
                      </pre>
                    </div>

                    <div>
                      <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                        Structured Outputs & State Handoff
                      </span>
                      <pre className="mt-1 p-3 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-lg overflow-x-auto">
                        {JSON.stringify(tr.outputRecord || { status: 'passed' }, null, 2)}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1.5">
                      Enforced Policy Invariants
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {((tr as any).policyChecks || (tr as any).policyChecksPassed || []).map((c: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-mono font-medium flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
