import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  ShieldCheck,
  Building2,
  Radio,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Eye,
  FileCheck2,
  Upload,
  Zap,
  Play,
  RotateCcw,
  Check,
  ChevronRight,
  Info,
  ChevronDown,
  Layers,
  Award,
  ExternalLink,
  PlusCircle,
  FileText,
  Calendar,
} from 'lucide-react';
import { useSourcing } from '../../context/SourcingContext';
import { AGENTS, MASTER_SUPPLIERS } from '../../data/mockData';
import { QuoteInspectionModal } from './QuoteInspectionModal';
import { OfflineQuoteModal } from './OfflineQuoteModal';
import { SourcingEvent, Supplier, SupplierQuote } from '../../types';

export const BuyerWorkspace: React.FC = () => {
  const {
    activeEvent,
    activeEventId,
    selectEvent,
    events,
    chatMessages,
    sendUserMessage,
    approveGate1,
    approveGate2,
    approveGate3,
    triggerSupplierQuote,
    simulateAllSupplierQuotes,
    uploadOfflineQuote,
    askWhyRecommendation,
    askCheapestComplianceQuestion,
    inspectedQuote,
    setInspectedQuote,
    isOfflineModalOpen,
    setIsOfflineModalOpen,
    isAiThinking,
    governanceConfig,
  } = useSourcing();

  const [inputMessage, setInputMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [overrideModalSupplier, setOverrideModalSupplier] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState('');
  const [isEditingSpecs, setIsEditingSpecs] = useState(false);
  const [meshBackChecked, setMeshBackChecked] = useState(true);
  const [lumbarSupportChecked, setLumbarSupportChecked] = useState(true);
  const [activeTraceTab, setActiveTraceTab] = useState<'timeline' | 'quotes' | 'req'>('timeline');
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);

  // Response Deadline Picker state for Tactical Buyer (Gate 2)
  const [responseDeadlineInput, setResponseDeadlineInput] = useState(() => {
    return activeEvent?.rfqDeadline || '2026-10-17T17:00';
  });

  // Keep deadline in sync when switching events
  useEffect(() => {
    if (activeEvent?.rfqDeadline) {
      setResponseDeadlineInput(activeEvent.rfqDeadline);
    }
  }, [activeEvent?.id, activeEvent?.rfqDeadline]);

  const setDeadlinePreset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(17, 0, 0, 0);
    const pad = (n: number) => String(n).padStart(2, '0');
    setResponseDeadlineInput(
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
    );
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiThinking]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendUserMessage(inputMessage);
    setInputMessage('');
  };

  const isGBP = activeEvent?.requirement?.currency === 'GBP';
  const curr = isGBP ? '£' : '$';

  // Filtered events for left panel
  const filteredEvents = events.filter((ev) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'awarded') return ev.status === 'awarded';
    if (filterStatus === 'active') return ev.status !== 'awarded';
    return true;
  });

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-100">
      {/* ================= LEFT PANEL: SOURCING QUEUE & CONVERSATIONS ================= */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Sourcing Conversations
            </h2>
            <p className="text-[11px] text-slate-500">Tail spend under active execution</p>
          </div>
          <button
            onClick={() => {
              // Quick new prompt
              sendUserMessage('I need 120 branded USB-C power adapters for Chicago summit next Friday, budget $3,500.');
            }}
            title="Start new sourcing request"
            className="p-1.5 rounded-lg bg-[#00A99A] text-white hover:bg-[#008f82] transition shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Filter chips */}
        <div className="p-2 border-b border-slate-100 flex gap-1 text-[11px] bg-white">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2 py-0.5 rounded font-medium transition ${
              filterStatus === 'all'
                ? 'bg-[#172447] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({events.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-2 py-0.5 rounded font-medium transition ${
              filterStatus === 'active'
                ? 'bg-[#172447] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Active ({events.filter((e) => e.status !== 'awarded').length})
          </button>
          <button
            onClick={() => setFilterStatus('awarded')}
            className={`px-2 py-0.5 rounded font-medium transition ${
              filterStatus === 'awarded'
                ? 'bg-[#172447] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Awarded ({events.filter((e) => e.status === 'awarded').length})
          </button>
        </div>

        {/* Events list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredEvents.map((ev) => {
            const isSelected = ev.id === activeEventId;
            return (
              <button
                key={ev.id}
                onClick={() => selectEvent(ev.id)}
                className={`w-full p-3 text-left transition ${
                  isSelected ? 'bg-teal-50/70 border-l-4 border-l-[#00A99A]' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono font-semibold text-slate-500">
                    {ev.eventNumber}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      ev.status === 'awarded'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ev.status === 'evaluation_ready'
                        ? 'bg-purple-100 text-purple-800'
                        : ev.status === 'rfq_published'
                        ? 'bg-amber-100 text-amber-800'
                        : ev.status === 'gate2_launch_approval'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {ev.status === 'awarded'
                      ? 'Awarded (PR-Ready)'
                      : ev.status === 'evaluation_ready'
                      ? 'Gate 3: Award Ready'
                      : ev.status === 'rfq_published'
                      ? 'Quotes Pending'
                      : ev.status === 'gate2_launch_approval'
                      ? 'Gate 2: Shortlist'
                      : 'Gate 1: Specs'}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 truncate">{ev.title}</div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between mt-1">
                  <span>
                    Est. {ev.requirement.currency === 'GBP' ? '£' : '$'}
                    {ev.requirement.targetBudget.toLocaleString()}
                  </span>
                  <span>{ev.quotes?.length || 0} quotes</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Level 2 Autonomy Disclaimer Card */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 leading-relaxed">
          <div className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00A99A]" />
            Level 2 Autonomy Guard
          </div>
          The agent executes all sourcing legwork, but requires human approval at Gate 1 (Spec), Gate 2 (Launch), and Gate 3 (Award).
        </div>
      </div>

      {/* ================= CENTER PANEL: CONVERSATIONAL AI & APPROVAL GATES ================= */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden border-r border-slate-200">
        {/* Event Header Banner */}
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#00A99A]">
                {activeEvent.eventNumber}
              </span>
              <span className="text-slate-300">·</span>
              <h1 className="text-sm font-bold text-slate-900">{activeEvent.title}</h1>
              {activeEvent.requirement.isColdStart && (
                <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  Cold-Start Category
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3 mt-1">
              <span>UNSPSC: {activeEvent.requirement.unspscCode}</span>
              <span>Target: {curr}{activeEvent.requirement.targetBudget.toLocaleString()}</span>
              <span>Delivery Date: {activeEvent.requirement.requiredDeliveryDate}</span>
              {activeEvent.rfqDeadline && (
                <span className="flex items-center gap-1 font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  <Clock className="w-3 h-3 text-blue-600" />
                  Deadline:{' '}
                  {new Date(activeEvent.rfqDeadline).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {activeEvent.quotes.some((q) => q.isOverdue) && (
                    <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-bold ml-1">
                      Overdue Flagged
                    </span>
                  )}
                </span>
              )}
              <span className="text-teal-700 font-medium">Policy: {activeEvent.appliedConfigVersion}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOfflineModalOpen(true)}
              className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              Upload Offline Quote
            </button>
          </div>
        </div>

        {/* Demo Controls Toolbar: Supplier Response Simulator */}
        <div className="px-4 py-2 bg-gradient-to-r from-[#172447] to-[#1f3160] text-white flex items-center justify-between text-xs shrink-0 select-none shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#00E5D0]" />
              Supplier Simulator:
            </span>
            <span className="text-slate-300 text-[11px]">Advance RFQ responses:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {activeEvent.id === 'evt_chair_repeat' ? (
              <>
                <button
                  onClick={() => triggerSupplierQuote('sup_b')}
                  className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-medium border border-white/15 transition flex items-center gap-1"
                >
                  <span>Supplier B ($280)</span>
                </button>
                <button
                  onClick={() => triggerSupplierQuote('sup_d')}
                  className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-medium border border-white/15 transition flex items-center gap-1"
                >
                  <span>Supplier D ($292)</span>
                </button>
                <button
                  onClick={() => triggerSupplierQuote('sup_c')}
                  className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded text-[11px] font-medium border border-rose-500/40 transition flex items-center gap-1"
                >
                  <span>Supplier C (Disqualified)</span>
                </button>
                <button
                  onClick={() => triggerSupplierQuote('sup_d', true)}
                  className="px-2 py-1 bg-amber-500/25 hover:bg-amber-500/35 text-amber-200 rounded text-[11px] font-semibold border border-amber-400/40 transition flex items-center gap-1"
                  title="Simulate supplier submitting after the response deadline"
                >
                  <Clock className="w-3 h-3 text-amber-300" />
                  <span>Simulate Overdue Bid</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => triggerSupplierQuote('sup_calibra')}
                  className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-medium border border-white/15 transition flex items-center gap-1"
                >
                  <span>Calibra (£2,450 ISO Certified)</span>
                </button>
                <button
                  onClick={() => triggerSupplierQuote('sup_precision')}
                  className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded text-[11px] font-medium border border-rose-500/40 transition flex items-center gap-1"
                >
                  <span>Precision (£2,180 Missing ISO)</span>
                </button>
                <button
                  onClick={() => triggerSupplierQuote('sup_precision', true)}
                  className="px-2 py-1 bg-amber-500/25 hover:bg-amber-500/35 text-amber-200 rounded text-[11px] font-semibold border border-amber-400/40 transition flex items-center gap-1"
                  title="Simulate supplier submitting after the response deadline"
                >
                  <Clock className="w-3 h-3 text-amber-300" />
                  <span>Simulate Overdue Bid</span>
                </button>
              </>
            )}

            <button
              onClick={simulateAllSupplierQuotes}
              className="px-2.5 py-1 bg-[#00A99A] hover:bg-[#008f82] text-white font-semibold rounded text-[11px] shadow-sm transition flex items-center gap-1"
            >
              <Play className="w-3 h-3 fill-white" />
              Simulate All
            </button>
          </div>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            const agentMeta = msg.agentId ? AGENTS[msg.agentId] : null;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                {!isUser ? (
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: agentMeta?.color || '#00A99A' }}
                  >
                    {msg.agentId === 'intake_policy' && <ShieldCheck className="w-4 h-4" />}
                    {msg.agentId === 'category_supplier' && <Building2 className="w-4 h-4" />}
                    {msg.agentId === 'event_agent' && <Radio className="w-4 h-4" />}
                    {msg.agentId === 'evaluation_award' && <Scale className="w-4 h-4" />}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#172447] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    ML
                  </div>
                )}

                {/* Message Bubble & Cards */}
                <div className={`space-y-2 flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
                  {/* Sender metadata */}
                  {!isUser && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">
                        {msg.agentName || 'Autonomous Sourcing Agent'}
                      </span>
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.2 rounded"
                        style={{
                          backgroundColor: `${agentMeta?.color}15`,
                          color: agentMeta?.color || '#00A99A',
                        }}
                      >
                        {agentMeta?.version || 'Governed Agent'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  )}

                  {/* Text content */}
                  <div
                    className={`p-4 rounded-xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#172447] text-white rounded-tr-none inline-block shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs whitespace-pre-wrap'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* ================= GATE 1 INTERACTIVE CARD: SPEC REVIEW ================= */}
                  {msg.gateType === 1 && activeEvent.status === 'gate1_spec_approval' && (
                    <div className="bg-white border-2 border-teal-500/50 rounded-xl p-4 shadow-md space-y-3 mt-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-[#00A99A]" />
                            Gate 1: Sourcing Requirement & Specification Review
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-[#00A99A] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          Human Approval Required
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="text-[11px] text-slate-500 font-medium">Item & Quantity</span>
                          <div className="font-bold text-slate-900 mt-0.5">
                            {activeEvent.requirement.quantity}x {activeEvent.requirement.title}
                          </div>
                        </div>

                        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="text-[11px] text-slate-500 font-medium">
                            Category & UNSPSC
                          </span>
                          <div className="font-bold text-slate-900 mt-0.5">
                            {activeEvent.requirement.category} ({activeEvent.requirement.unspscCode})
                          </div>
                        </div>

                        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="text-[11px] text-slate-500 font-medium">Delivery Destination</span>
                          <div className="font-bold text-slate-900 mt-0.5">
                            {activeEvent.requirement.deliveryLocation}
                          </div>
                        </div>

                        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="text-[11px] text-slate-500 font-medium">
                            Required On-Site By
                          </span>
                          <div className="font-bold text-slate-900 mt-0.5">
                            {activeEvent.requirement.requiredDeliveryDate}
                          </div>
                        </div>
                      </div>

                      {/* Mandatory specifications checkboxes */}
                      <div>
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                          Enforced Technical Criteria
                        </span>
                        <div className="space-y-1.5 text-xs">
                          {activeEvent.requirement.mandatoryCriteria.map((crit, idx) => (
                            <label
                              key={idx}
                              className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 cursor-pointer transition"
                            >
                              <input
                                type="checkbox"
                                defaultChecked
                                className="w-3.5 h-3.5 text-[#00A99A] rounded focus:ring-[#00A99A]"
                              />
                              <span className="font-medium text-slate-800">{crit}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Approval Action */}
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 italic">
                          Clicking approve commits specifications and advances to Gate 2.
                        </span>
                        <button
                          onClick={() => approveGate1()}
                          className="px-4 py-2 bg-[#00A99A] hover:bg-[#008f82] text-white font-bold text-xs rounded-lg shadow-md transition flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          Approve Specifications (Gate 1)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ================= GATE 2 INTERACTIVE CARD: SUPPLIER SHORTLIST REVIEW ================= */}
                  {msg.gateType === 2 && activeEvent.status === 'gate2_launch_approval' && (
                    <div className="bg-white border-2 border-blue-500/50 rounded-xl p-4 shadow-md space-y-3 mt-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div>
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-blue-600" />
                            Gate 2: Supplier Shortlist & RFQ Launch Approval
                          </span>
                          <p className="text-[11px] text-slate-500">
                            Auto-closure rule: Closes at 3 quotes (or 4 business days)
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {activeEvent.invitedSuppliers.length} Suppliers Recommended
                        </span>
                      </div>

                      {/* Supplier list */}
                      <div className="space-y-2">
                        {activeEvent.invitedSuppliers.map((sup, idx) => (
                          <div
                            key={sup.id}
                            className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between hover:bg-slate-100 transition"
                          >
                            <div className="min-w-0 flex-1 pr-3">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">{sup.name}</span>
                                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                                  {sup.location}
                                </span>
                                {sup.isPreferred && (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded">
                                    ★ Repeat Vendor
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600 mt-1">
                                <span className="font-semibold text-slate-700">Reason:</span> {sup.sourceReason}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-bold text-slate-800">
                                {sup.pastTransactions} prior POs
                              </span>
                              <div className="text-[10px] text-slate-500">Rating {sup.rating}/5.0</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Response Deadline Configuration for Maya */}
                      <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-blue-600" />
                            RFQ Response Deadline (Date & Time)
                          </span>
                          <span className="text-[10px] text-blue-700 font-semibold bg-blue-100/70 px-2 py-0.5 rounded border border-blue-200">
                            Enforced by Event Agent
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 items-center">
                          <input
                            type="datetime-local"
                            value={responseDeadlineInput}
                            onChange={(e) => setResponseDeadlineInput(e.target.value)}
                            className="w-full sm:w-auto flex-1 text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-md font-mono text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                          />
                          <div className="flex items-center gap-1 text-[10px]">
                            <button
                              type="button"
                              onClick={() => setDeadlinePreset(2)}
                              className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium transition"
                            >
                              +2 Days
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeadlinePreset(4)}
                              className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium transition"
                            >
                              +4 Days (Std)
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeadlinePreset(7)}
                              className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium transition"
                            >
                              +7 Days
                            </button>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-600 flex flex-wrap items-center justify-between pt-0.5">
                          <span>Responses arriving after this deadline will be tracked and flagged as overdue.</span>
                          <span className="font-semibold text-blue-900">
                            Deadline:{' '}
                            {new Date(responseDeadlineInput).toLocaleString([], {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Launch Action */}
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 italic">
                          Level 2 Gate: RFQ will only publish upon explicit buyer approval.
                        </span>
                        <button
                          onClick={() => approveGate2(activeEvent.invitedSuppliers, responseDeadlineInput)}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-md transition flex items-center gap-2"
                        >
                          <Radio className="w-4 h-4" />
                          Launch RFQ (Gate 2)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ================= GATE 3 INTERACTIVE CARD: EVALUATION SCORECARD ================= */}
                  {msg.gateType === 3 &&
                    (activeEvent.status === 'evaluation_ready' ||
                      activeEvent.status === 'quotes_received' ||
                      activeEvent.status === 'awarded') && (
                      <div className="bg-white border-2 border-purple-500/50 rounded-xl p-4 shadow-md space-y-4 mt-3 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div>
                            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                              <Scale className="w-4 h-4 text-purple-600" />
                              Gate 3: Evaluation Scorecard & Award Recommendation
                            </span>
                            <p className="text-[11px] text-slate-500">
                              Governed under Policy Parameter{' '}
                              <span className="font-semibold text-teal-700">
                                {governanceConfig.version} (
                                {governanceConfig.awardWeights.priceWeight}% Price /{' '}
                                {governanceConfig.awardWeights.complianceWeight}% Compliance)
                              </span>
                            </p>
                          </div>
                          <button
                            onClick={
                              activeEvent.id === 'evt_chair_repeat'
                                ? askWhyRecommendation
                                : askCheapestComplianceQuestion
                            }
                            className="px-2.5 py-1 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition flex items-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                            {activeEvent.id === 'evt_chair_repeat'
                              ? 'Why is B ahead of D?'
                              : 'Why not take cheapest?'}
                          </button>
                        </div>

                        {/* Scorecard comparison table */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                            <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                              <tr>
                                <th className="p-2.5">Rank</th>
                                <th className="p-2.5">Supplier</th>
                                <th className="p-2.5 text-right">Unit Price</th>
                                <th className="p-2.5 text-right">Total Bid</th>
                                <th className="p-2.5">Promised Delivery</th>
                                <th className="p-2.5">Compliance</th>
                                <th className="p-2.5 text-right">Score</th>
                                <th className="p-2.5 text-center">Quote</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {activeEvent.quotes.map((q) => {
                                const isWinner = q.rank === 1 && !q.isExcluded;
                                return (
                                  <tr
                                    key={q.quoteId}
                                    className={`${
                                      isWinner
                                        ? 'bg-purple-50/60 font-semibold'
                                        : q.isExcluded
                                        ? 'bg-rose-50/50 text-slate-400'
                                        : 'hover:bg-slate-50'
                                    }`}
                                  >
                                    <td className="p-2.5">
                                      {q.isExcluded ? (
                                        <span className="text-[10px] text-rose-600 font-bold">
                                          DISQ
                                        </span>
                                      ) : (
                                        <span
                                          className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] font-bold ${
                                            isWinner
                                              ? 'bg-purple-600 text-white'
                                              : 'bg-slate-200 text-slate-700'
                                          }`}
                                        >
                                          #{q.rank}
                                        </span>
                                      )}
                                    </td>
                                    <td className="p-2.5">
                                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                        {q.supplierName}
                                        {isWinner && (
                                          <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.2 rounded font-bold uppercase">
                                            Recommended
                                          </span>
                                        )}
                                        {q.isOfflineExtracted && (
                                          <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded">
                                            Offline
                                          </span>
                                        )}
                                        {q.isOverdue && (
                                          <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                                            <Clock className="w-2.5 h-2.5 text-amber-600" />
                                            Overdue ({q.overdueDurationText || 'Late'})
                                          </span>
                                        )}
                                      </div>
                                      {q.isExcluded && (
                                        <div className="text-[10px] text-rose-600 mt-0.5">
                                          {q.exclusionReason}
                                        </div>
                                      )}
                                    </td>
                                    <td className="p-2.5 text-right font-mono">
                                      {curr}{q.unitPrice.toLocaleString()}
                                    </td>
                                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                                      {curr}{q.totalPrice.toLocaleString()}
                                    </td>
                                    <td className="p-2.5">
                                      <span
                                        className={
                                          q.promisedDeliveryDate.includes('UNANSWERED')
                                            ? 'text-rose-600 font-bold'
                                            : 'text-slate-700'
                                        }
                                      >
                                        {q.promisedDeliveryDate}
                                      </span>
                                    </td>
                                    <td className="p-2.5">
                                      {q.isExcluded ? (
                                        <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                                          <AlertTriangle className="w-3 h-3" /> Failed
                                        </span>
                                      ) : (
                                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                                          <CheckCircle2 className="w-3 h-3" /> Passed
                                        </span>
                                      )}
                                    </td>
                                    <td className="p-2.5 text-right font-mono font-bold">
                                      {q.isExcluded ? (
                                        '0.0'
                                      ) : (
                                        <span className={isWinner ? 'text-purple-700' : 'text-slate-800'}>
                                          {q.scoreBreakdown?.compositeScore?.toFixed(1)} pts
                                        </span>
                                      )}
                                    </td>
                                    <td className="p-2.5 text-center">
                                      <button
                                        onClick={() => setInspectedQuote(q)}
                                        className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition"
                                        title="Inspect raw quote document"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Gate 3 Action buttons (Approve vs Override) */}
                        {activeEvent.status !== 'awarded' && (
                          <div className="pt-2 flex items-center justify-between">
                            <button
                              onClick={() => {
                                const eligible = activeEvent.quotes.filter((q) => !q.isExcluded);
                                if (eligible.length > 1) {
                                  setOverrideModalSupplier(eligible[1].supplierId);
                                }
                              }}
                              className="text-xs text-slate-600 hover:text-slate-900 underline font-medium"
                            >
                              Buyer Override Option...
                            </button>

                            <div className="flex items-center gap-2">
                              {activeEvent.quotes.find((q) => q.rank === 1 && !q.isExcluded) && (
                                <button
                                  onClick={() => {
                                    const winner = activeEvent.quotes.find(
                                      (q) => q.rank === 1 && !q.isExcluded
                                    );
                                    if (winner) approveGate3(winner.supplierId);
                                  }}
                                  className="px-5 py-2.5 bg-[#00A99A] hover:bg-[#008f82] text-white font-bold text-xs rounded-lg shadow-md transition flex items-center gap-2"
                                >
                                  <Award className="w-4 h-4" />
                                  Approve Recommended Award (Gate 3)
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  {/* ================= AWARD CONFIRMATION SUMMARY CARD ================= */}
                  {msg.interactivePayload?.type === 'award_summary' && (
                    <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4 shadow-md space-y-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Purchase Requisition Ready Record Prepared
                        </span>
                        <span className="text-xs font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                          {msg.interactivePayload.data?.prNumber || 'PR-40218'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                        <div className="p-2 bg-white rounded border border-emerald-200">
                          <span className="text-[10px] text-slate-500 font-medium">Awarded Supplier</span>
                          <div className="font-bold text-slate-900">
                            {msg.interactivePayload.data?.supplierName}
                          </div>
                        </div>

                        <div className="p-2 bg-white rounded border border-emerald-200">
                          <span className="text-[10px] text-slate-500 font-medium">Agreed PO Commitment</span>
                          <div className="font-bold text-emerald-700 font-mono">
                            {curr}
                            {msg.interactivePayload.data?.totalPrice?.toLocaleString()}
                          </div>
                        </div>

                        <div className="p-2 bg-white rounded border border-emerald-200">
                          <span className="text-[10px] text-slate-500 font-medium">Audit Compliance</span>
                          <div className="font-bold text-slate-800">
                            Verified · Immutable Hash
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-emerald-800 italic">
                        Downstream handoff: All quotations, scoring matrices, and approval timestamps are packaged for ERP release.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* AI Thinking Indicator */}
          {isAiThinking && (
            <div className="flex items-center gap-2 text-xs text-slate-500 p-3 bg-white rounded-lg border border-slate-200 w-fit">
              <Sparkles className="w-4 h-4 text-[#00A99A] animate-spin" />
              <span>Evaluation & Award Agent is computing verifiable evidence...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompt Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Suggested:
          </span>
          {activeEvent.id === 'evt_chair_repeat' ? (
            <>
              <button
                onClick={askWhyRecommendation}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition shrink-0"
              >
                "Why is Supplier B ahead of Supplier D?"
              </button>
              <button
                onClick={() => sendUserMessage('Show historical POs for Dallas office chairs')}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition shrink-0"
              >
                "Show historical chair POs"
              </button>
            </>
          ) : (
            <>
              <button
                onClick={askCheapestComplianceQuestion}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition shrink-0"
              >
                "Why can't we award the cheapest supplier (£2,180)?"
              </button>
              <button
                onClick={() =>
                  sendUserMessage('Check UKAS ISO 17025 accreditation certificate for Calibra')
                }
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition shrink-0"
              >
                "Check ISO 17025 certificate"
              </button>
            </>
          )}
          <button
            onClick={() => setIsOfflineModalOpen(true)}
            className="px-2.5 py-1 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-medium transition shrink-0 flex items-center gap-1"
          >
            <Upload className="w-3 h-3 text-[#00A99A]" />
            "Upload offline email quote"
          </button>
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your instruction or inquiry (e.g. 'Why is B ahead of D?', 'Approve Gate 1')..."
            className="flex-1 text-xs px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00A99A] focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="p-2.5 bg-[#172447] hover:bg-[#233564] disabled:opacity-40 text-white rounded-lg transition shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* ================= RIGHT PANEL: EVENT PROGRESS & AGENT OBSERVABILITY ================= */}
      <div className="w-80 bg-white flex flex-col border-l border-slate-200 shrink-0 overflow-y-auto">
        <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Execution Progress
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {activeEvent.appliedConfigVersion}
          </span>
        </div>

        {/* Workflow Progress Steps */}
        <div className="p-4 border-b border-slate-200">
          <div className="space-y-3">
            {[
              { label: 'Intake & Policy Check', done: true, current: false },
              {
                label: 'Gate 1: Specification Approval',
                done: activeEvent.status !== 'draft_intake' && activeEvent.status !== 'gate1_spec_approval',
                current: activeEvent.status === 'gate1_spec_approval',
              },
              {
                label: 'Gate 2: RFQ Launch Approval',
                done:
                  activeEvent.status !== 'draft_intake' &&
                  activeEvent.status !== 'gate1_spec_approval' &&
                  activeEvent.status !== 'gate2_launch_approval',
                current: activeEvent.status === 'gate2_launch_approval',
              },
              {
                label: 'Supplier Quotations Arrival',
                done: activeEvent.quotes.length >= 3 || activeEvent.status === 'awarded',
                current: activeEvent.status === 'rfq_published',
              },
              {
                label: 'Gate 3: Award Approval',
                done: activeEvent.status === 'awarded',
                current: activeEvent.status === 'evaluation_ready',
              },
              {
                label: 'PR-Ready Record Committed',
                done: activeEvent.status === 'awarded',
                current: false,
              },
            ].map((step, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                    step.done
                      ? 'bg-emerald-600 text-white'
                      : step.current
                      ? 'bg-[#00A99A] text-white ring-2 ring-teal-200 animate-pulse'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step.done ? <Check className="w-3 h-3" /> : idx + 1}
                </div>
                <span
                  className={`truncate ${
                    step.done
                      ? 'text-slate-900 font-medium'
                      : step.current
                      ? 'text-[#00A99A] font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tab switcher: Timeline / Quotations Matrix / Specs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600">
          <button
            onClick={() => setActiveTraceTab('timeline')}
            className={`flex-1 py-2 text-center border-b-2 transition ${
              activeTraceTab === 'timeline'
                ? 'border-[#00A99A] text-[#00A99A] bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Agent Timeline
          </button>
          <button
            onClick={() => setActiveTraceTab('quotes')}
            className={`flex-1 py-2 text-center border-b-2 transition ${
              activeTraceTab === 'quotes'
                ? 'border-[#00A99A] text-[#00A99A] bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Quotes ({activeEvent.quotes.length})
          </button>
          <button
            onClick={() => setActiveTraceTab('req')}
            className={`flex-1 py-2 text-center border-b-2 transition ${
              activeTraceTab === 'req'
                ? 'border-[#00A99A] text-[#00A99A] bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Specs & PO
          </button>
        </div>

        {/* Content based on tab */}
        <div className="flex-1 p-3 space-y-3 overflow-y-auto">
          {activeTraceTab === 'timeline' && (
            <div className="space-y-2.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Multi-Agent Telemetry & Traces
              </div>

              {[
                {
                  agent: 'Intake & Policy Agent',
                  op: 'Classify & Route Tail Spend',
                  time: '320ms',
                  conf: '98%',
                  checks: ['<$25k Ceiling', 'No Active Contract'],
                },
                {
                  agent: 'Category & Supplier Agent',
                  op: 'Retrieve 3 Chair POs & Shortlist 4 Vendors',
                  time: '480ms',
                  conf: '96%',
                  checks: ['UNSPSC 56101504', 'Historical PO-39102'],
                },
                {
                  agent: 'Event Agent',
                  op: 'RFQ Dispatched & Monitored',
                  time: '240ms',
                  conf: '99%',
                  checks: ['Early closure rule', '4 invitations sent'],
                },
                {
                  agent: 'Evaluation & Award Agent',
                  op: 'Mathematical Multi-Factor Scoring',
                  time: '390ms',
                  conf: '99%',
                  checks: ['80/20 weights', 'Lead time check'],
                },
              ].map((tr, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs hover:border-teal-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-[11px]">{tr.agent}</span>
                    <span className="text-[10px] text-teal-700 font-mono font-semibold">
                      {tr.time}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px] mt-0.5">{tr.op}</div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {tr.checks.map((c, i) => (
                      <span
                        key={i}
                        className="text-[9px] bg-slate-200/80 text-slate-700 px-1.5 py-0.2 rounded"
                      >
                        ✓ {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTraceTab === 'quotes' && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Received Quotations Summary
              </div>
              {activeEvent.quotes.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No quotes received yet.</p>
              ) : (
                activeEvent.quotes.map((q) => (
                  <div
                    key={q.quoteId}
                    onClick={() => setInspectedQuote(q)}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-teal-50/50 cursor-pointer transition text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate">{q.supplierName}</span>
                      <span className="font-mono font-bold text-teal-800">
                        {curr}{q.totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between mt-1">
                      <span>Rate: {curr}{q.unitPrice}/unit</span>
                      <span>Delivery: {q.promisedDeliveryDate}</span>
                    </div>
                    {q.isOverdue && (
                      <span className="text-[9px] text-amber-700 font-bold flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-amber-600" /> Overdue ({q.overdueDurationText || 'Late response'})
                      </span>
                    )}
                    {q.isExcluded && (
                      <span className="text-[9px] text-rose-600 font-bold block mt-1">
                        Disqualified: {q.exclusionReason}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTraceTab === 'req' && (
            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  Matched Historical PO
                </span>
                <div className="font-semibold text-slate-800 mt-0.5">
                  PO-39102 (ErgoTech · $285/unit)
                </div>
                <div className="text-[10px] text-slate-400">Prior purchase date: March 2026</div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  Target Delivery Location
                </span>
                <div className="font-semibold text-slate-800 mt-0.5">
                  {activeEvent.requirement.deliveryLocation}
                </div>
              </div>

              {activeEvent.purchaseRequisitionId && (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-300">
                  <span className="text-[10px] font-bold uppercase text-emerald-800">
                    ERP Requisition Link
                  </span>
                  <div className="text-base font-bold text-emerald-950 font-mono mt-0.5">
                    {activeEvent.purchaseRequisitionId}
                  </div>
                  <div className="text-[10px] text-emerald-700 mt-1">
                    Ready for ERP PO release with full audit trail attached.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quote Inspection Modal */}
      <QuoteInspectionModal
        quote={inspectedQuote}
        onClose={() => setInspectedQuote(null)}
      />

      {/* Offline Quote Modal */}
      <OfflineQuoteModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        onUpload={uploadOfflineQuote}
      />

      {/* Buyer Override Modal */}
      {overrideModalSupplier && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Buyer Award Override
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              You are overriding the autonomous agent recommendation. Policy requires a recorded justification for audit defense.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mandatory Override Justification:
              </label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                rows={3}
                placeholder="e.g., Selecting Supplier D due to existing master staging agreement in Austin depot..."
                className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00A99A] focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setOverrideModalSupplier(null)}
                className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800 font-medium"
              >
                Cancel
              </button>
              <button
                disabled={!overrideReason.trim()}
                onClick={() => {
                  approveGate3(overrideModalSupplier, true, overrideReason);
                  setOverrideModalSupplier(null);
                  setOverrideReason('');
                }}
                className="px-4 py-2 text-xs font-bold bg-[#172447] text-white rounded-lg disabled:opacity-40 hover:bg-[#233564] transition"
              >
                Confirm Override & Award
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
