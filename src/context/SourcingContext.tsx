import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  RoleType,
  UserProfile,
  AgentId,
  SourcingEvent,
  ChatMessage,
  GovernanceConfig,
  AuditLogEntry,
  MultiAgentTrace,
  SupplierQuote,
  Supplier,
  SourcingRequirement,
  ScenarioEvalResult,
  ReplayEvalResult,
} from '../types';
import {
  USERS,
  AGENTS,
  INITIAL_GOVERNANCE_CONFIG,
  DRAFT_GOVERNANCE_CONFIG,
  INITIAL_SOURCING_EVENTS,
  SEEDED_AUDIT_LOGS,
  SCENARIO_EVAL_CASES,
  REPLAY_EVAL_CASES,
  MASTER_SUPPLIERS,
  HISTORICAL_CHAIR_POS,
} from '../data/mockData';

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  eventId?: string;
  isRead: boolean;
}

interface SourcingContextType {
  activeRole: RoleType;
  setActiveRole: (role: RoleType) => void;
  currentUser: UserProfile;
  events: SourcingEvent[];
  activeEvent: SourcingEvent;
  activeEventId: string;
  selectEvent: (id: string) => void;
  chatMessages: ChatMessage[];
  sendUserMessage: (content: string) => Promise<void>;
  
  // Gate approvals
  approveGate1: (specsUpdates?: Partial<SourcingRequirement>) => void;
  approveGate2: (updatedSuppliers?: Supplier[], responseDeadline?: string) => void;
  approveGate3: (supplierId: string, isOverride?: boolean, overrideReason?: string) => void;
  
  // Supplier simulation controls
  triggerSupplierQuote: (supplierId: string, forceOverdue?: boolean) => void;
  simulateAllSupplierQuotes: () => void;
  uploadOfflineQuote: (data: {
    supplierName: string;
    unitPrice: number;
    deliveryDate: string;
    warrantyMonths: number;
    notes: string;
    rawText: string;
  }) => void;
  
  // Questions / Explainability
  askWhyRecommendation: () => Promise<void>;
  askCheapestComplianceQuestion: () => Promise<void>;
  
  // Admin & Governance
  governanceConfig: GovernanceConfig;
  draftConfig: GovernanceConfig;
  isDraftSubmitted: boolean;
  updateDraftConfig: (updates: Partial<GovernanceConfig>) => void;
  scenarioEvals: ScenarioEvalResult[];
  replayEvals: ReplayEvalResult[];
  evalsRunCount: number;
  runReplayEvals: () => void;
  runScenarioEvals: () => void;
  submitDraftForApproval: () => void;
  approveAndPublishDraft: () => void;
  rejectDraft: (reason: string) => void;
  
  // Observability & Auditing
  auditLogs: AuditLogEntry[];
  traces: MultiAgentTrace[];
  notifications: NotificationItem[];
  markNotificationsRead: () => void;
  
  // Modals & UI helpers
  inspectedQuote: SupplierQuote | null;
  setInspectedQuote: (quote: SupplierQuote | null) => void;
  isOfflineModalOpen: boolean;
  setIsOfflineModalOpen: (open: boolean) => void;
  resetDemoData: () => void;
  loadPresetTrack: (track: 'repeat' | 'cold_start') => void;
  isAiThinking: boolean;
}

const SourcingContext = createContext<SourcingContextType | undefined>(undefined);

const STORAGE_KEY = 'autonomous_sourcing_state_v1';

export const SourcingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage if available
  const [activeRole, setActiveRole] = useState<RoleType>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_role`);
    return (saved as RoleType) || 'maya';
  });

  const [events, setEvents] = useState<SourcingEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_events`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved events', e);
      }
    }
    return INITIAL_SOURCING_EVENTS;
  });

  const [activeEventId, setActiveEventId] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_active_id`);
    return saved || 'evt_chair_repeat';
  });

  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_messages`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved messages', e);
      }
    }
    return {
      evt_chair_repeat: [
        {
          id: 'msg_init_user',
          eventId: 'evt_chair_repeat',
          sender: 'user',
          timestamp: '2026-10-13T10:15:00Z',
          content: 'I need 50 ergonomic chairs for our Dallas office by 15 October. Can you source them?',
        },
        {
          id: 'msg_init_agent1',
          eventId: 'evt_chair_repeat',
          sender: 'agent',
          agentId: 'intake_policy',
          agentName: 'Intake & Policy Agent',
          timestamp: '2026-10-13T10:15:08Z',
          content: 'Understood. Request classified as **Tail Spend** under Category: **Office Furniture & Seating (UNSPSC 56101504)**. Estimated value: **~$14,000**, well within your **$25,000** agent ceiling under Policy Parameter **v4.0**.\n\nNo active enterprise catalog master agreement applies for this quantity in Dallas. Policy requires a **Competitive 3-Quote Event**.',
          confidenceScore: 0.98,
        },
        {
          id: 'msg_init_agent2',
          eventId: 'evt_chair_repeat',
          sender: 'agent',
          agentId: 'category_supplier',
          agentName: 'Category & Supplier Agent',
          timestamp: '2026-10-13T10:15:22Z',
          content: 'I cross-referenced our purchase ledger and identified **3 prior POs** for similar seating (closest: `PO-39102`, Task chair, adjustable lumbar at $285/unit).\n\nI have drafted the Sourcing Specification card below for your review.',
          gateType: 1,
          interactivePayload: {
            type: 'spec_review',
          },
          confidenceScore: 0.95,
        },
      ],
      evt_cold_start: [
        {
          id: 'msg_cold_user',
          eventId: 'evt_cold_start',
          sender: 'user',
          timestamp: '2026-10-12T14:20:00Z',
          content: 'We need calibration services for our Leeds laboratory — first time buying it.',
        },
        {
          id: 'msg_cold_agent1',
          eventId: 'evt_cold_start',
          sender: 'agent',
          agentId: 'intake_policy',
          agentName: 'Intake & Policy Agent',
          timestamp: '2026-10-12T14:20:10Z',
          content: 'Received. Classified as **Laboratory Calibration Services (UNSPSC 81141504)**. Estimated cost £3,000 (well within $25K threshold). Direct contract search returned 0 matches.\n\n⚠️ **Cold-Start Flag**: No purchase history exists for this site/service. Policy routes to competitive quote with mandatory compliance verification.',
          confidenceScore: 0.94,
        },
        {
          id: 'msg_cold_agent2',
          eventId: 'evt_cold_start',
          sender: 'agent',
          agentId: 'category_supplier',
          agentName: 'Category & Supplier Agent',
          timestamp: '2026-10-12T14:20:25Z',
          content: 'I have compiled standard industry requirements from ISO standard guidelines for laboratory instrumentation. Please review and approve Gate 1.',
          gateType: 1,
          interactivePayload: {
            type: 'spec_review',
          },
          confidenceScore: 0.91,
        },
      ],
    };
  });

  const [governanceConfig, setGovernanceConfig] = useState<GovernanceConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_gov_config`);
    return saved ? JSON.parse(saved) : INITIAL_GOVERNANCE_CONFIG;
  });

  const [draftConfig, setDraftConfig] = useState<GovernanceConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_draft_config`);
    return saved ? JSON.parse(saved) : DRAFT_GOVERNANCE_CONFIG;
  });

  const [isDraftSubmitted, setIsDraftSubmitted] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_draft_submitted`) === 'true';
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    return saved ? JSON.parse(saved) : SEEDED_AUDIT_LOGS;
  });

  const [traces, setTraces] = useState<MultiAgentTrace[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_welcome',
      timestamp: '2026-10-13T10:15:00Z',
      title: 'Autonomous Sourcing Agent Initialized',
      message: 'Active policy version v4.0 loaded with $25,000 execution ceiling and 80/20 award weighting.',
      type: 'info',
      isRead: false,
    },
  ]);

  const [inspectedQuote, setInspectedQuote] = useState<SupplierQuote | null>(null);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [scenarioEvals, setScenarioEvals] = useState<ScenarioEvalResult[]>(SCENARIO_EVAL_CASES);
  const [replayEvals, setReplayEvals] = useState<ReplayEvalResult[]>(REPLAY_EVAL_CASES);
  const [evalsRunCount, setEvalsRunCount] = useState(0);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_role`, activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_active_id`, activeEventId);
  }, [activeEventId]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_messages`, JSON.stringify(messagesMap));
  }, [messagesMap]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_gov_config`, JSON.stringify(governanceConfig));
  }, [governanceConfig]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_draft_config`, JSON.stringify(draftConfig));
  }, [draftConfig]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_draft_submitted`, String(isDraftSubmitted));
  }, [isDraftSubmitted]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const currentUser = USERS[activeRole] || USERS.maya;
  const activeEvent = useMemo(() => {
    return events.find((e) => e.id === activeEventId) || events[0];
  }, [events, activeEventId]);

  const chatMessages = useMemo(() => {
    return messagesMap[activeEventId] || [];
  }, [messagesMap, activeEventId]);

  // Helper to append audit logs
  const addAuditEntry = (
    action: string,
    details: string,
    eventId?: string,
    eventNumber?: string,
    actorOverride?: string,
    roleOverride?: string
  ) => {
    const newEntry: AuditLogEntry = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      eventId: eventId || activeEvent?.id,
      eventNumber: eventNumber || activeEvent?.eventNumber,
      actor: actorOverride || currentUser.name,
      role: roleOverride || currentUser.badge,
      action,
      details,
      policyVersion: governanceConfig.version,
      hash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Helper to add agent trace
  const addTrace = (
    agentId: AgentId,
    operation: string,
    reasoning: string,
    policyChecks: string[],
    latencyMs = 320,
    confidence = 0.96
  ) => {
    const trace: MultiAgentTrace = {
      id: `tr_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      eventId: activeEvent.id,
      timestamp: new Date().toISOString(),
      agentId,
      agentName: AGENTS[agentId].name,
      operation,
      status: 'completed',
      latencyMs,
      confidence,
      reasoning,
      policyChecksPassed: policyChecks,
    };
    setTraces((prev) => [trace, ...prev]);
  };

  // Helper to append chat message
  const appendMessage = (msg: Omit<ChatMessage, 'id' | 'eventId'>) => {
    const fullMsg: ChatMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      eventId: activeEventId,
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeEventId]: [...(prev[activeEventId] || []), fullMsg],
    }));

    return fullMsg;
  };

  // Add notification
  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert') => {
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString(),
      title,
      message,
      type,
      eventId: activeEventId,
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Select another event
  const selectEvent = (id: string) => {
    setActiveEventId(id);
  };

  // Preset scenarios loader
  const loadPresetTrack = (track: 'repeat' | 'cold_start') => {
    if (track === 'repeat') {
      setActiveEventId('evt_chair_repeat');
    } else {
      setActiveEventId('evt_cold_start');
    }
  };

  // GATE 1: Requirement & Specification Approval
  const approveGate1 = (specUpdates?: Partial<SourcingRequirement>) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== activeEventId) return e;
        const updatedReq = {
          ...e.requirement,
          ...(specUpdates || {}),
        };
        return {
          ...e,
          status: 'gate2_launch_approval',
          requirement: updatedReq,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    addAuditEntry(
      'GATE1_SPEC_APPROVED',
      `Buyer approved Sourcing Specifications for ${activeEvent.requirement.title}. Mesh-back & ANSI/BIFMA criteria verified.`,
      activeEvent.id,
      activeEvent.eventNumber
    );

    addTrace(
      'category_supplier',
      'Generate Supplier Shortlist',
      'Searched internal supplier repository and historical POs. Identified 2 historical suppliers and 2 category-matched suppliers.',
      ['UNSPSC_CATEGORY_QUALIFIED', 'NO_SANCTIONS', 'ACTIVE_SUPPLIER_PROFILE']
    );

    appendMessage({
      sender: 'user',
      timestamp: new Date().toISOString(),
      content: 'Approved specifications. Yes, mesh-back with adjustable lumbar support.',
    });

    setTimeout(() => {
      appendMessage({
        sender: 'agent',
        agentId: 'category_supplier',
        agentName: 'Category & Supplier Agent',
        timestamp: new Date().toISOString(),
        content: `I've prepared a balanced shortlist of **4 suppliers** for **${activeEvent.eventNumber}**:\n- 2 suppliers with previous successful delivery history\n- 2 pre-qualified category partners\n\nConfigured Closure Policy: **Auto-close when 3 valid quotes are received** (or 4-day deadline).\n\nPlease review and approve Gate 2 to launch the RFQ.`,
        gateType: 2,
        interactivePayload: {
          type: 'supplier_review',
        },
        confidenceScore: 0.97,
      });

      addNotification(
        'Gate 1 Approved · Ready for Gate 2',
        `Supplier shortlist prepared with 4 candidates for ${activeEvent.eventNumber}.`,
        'info'
      );
    }, 600);
  };

  // GATE 2: Supplier List & Launch Approval
  const approveGate2 = (updatedSuppliers?: Supplier[], responseDeadline?: string) => {
    const finalDeadline = responseDeadline || activeEvent.rfqDeadline || '2026-10-17T17:00';
    const formattedDeadline = new Date(finalDeadline).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== activeEventId) return e;
        return {
          ...e,
          status: 'rfq_published',
          rfqDeadline: finalDeadline,
          invitedSuppliers: updatedSuppliers || e.invitedSuppliers,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    addAuditEntry(
      'GATE2_RFQ_LAUNCHED',
      `Buyer approved supplier shortlist (${activeEvent.invitedSuppliers.length} suppliers). RFQ published autonomously with response deadline: ${formattedDeadline}.`,
      activeEvent.id,
      activeEvent.eventNumber
    );

    addTrace(
      'event_agent',
      'Publish RFQ Event & Dispatch Invitations',
      `Transmitted digital RFQ package to ${activeEvent.invitedSuppliers.map((s) => s.name).join(', ')}. Set response deadline to ${formattedDeadline}. Early closure threshold at 3 quotes.`,
      ['SUPPLIER_INVITATION_DISPATCHED', 'RESPONSE_DEADLINE_TRACKED', 'CLOSURE_RULE_APPLIED', 'AUDIT_HASH_RECORDED']
    );

    appendMessage({
      sender: 'user',
      timestamp: new Date().toISOString(),
      content: `Go ahead. Send the RFQ to all invited suppliers. Response deadline set to ${formattedDeadline}.`,
    });

    setTimeout(() => {
      appendMessage({
        sender: 'agent',
        agentId: 'event_agent',
        agentName: 'Event Agent',
        timestamp: new Date().toISOString(),
        content: `🚀 **RFQ Published Successfully!**\n- Event Number: **${activeEvent.eventNumber}**\n- Invitations Dispatched: **${activeEvent.invitedSuppliers.length} suppliers**\n- Response Deadline: **${formattedDeadline}**\n- Closure Criteria: **Early closure upon receipt of 3 compliant quotes**\n\nI will monitor incoming quotes in real time, validate mandatory fields, enforce the response deadline, and flag any overdue responses.`,
        confidenceScore: 0.99,
      });

      addNotification(
        'RFQ Published with Deadline',
        `${activeEvent.eventNumber} is live. Response deadline: ${formattedDeadline}.`,
        'success'
      );
    }, 600);
  };

  // Helper: Calculate quote scoring based on active governance config
  const calculateQuoteScores = (quotes: SupplierQuote[]): SupplierQuote[] => {
    const compliantQuotes = quotes.filter((q) => !q.isExcluded);
    if (compliantQuotes.length === 0) return quotes;

    // Minimum price among compliant
    const minPrice = Math.min(...compliantQuotes.map((q) => q.unitPrice));

    const priceWeight = governanceConfig.awardWeights.priceWeight; // e.g. 80
    const complianceWeight = governanceConfig.awardWeights.complianceWeight; // e.g. 20

    const scored = quotes.map((quote) => {
      if (quote.isExcluded) {
        return {
          ...quote,
          scoreBreakdown: {
            priceScore: 0,
            complianceScore: 0,
            deliveryScore: 0,
            compositeScore: 0,
          },
          rank: 999,
        };
      }

      // Mathematical price scoring formula:
      // Price Score = (minPrice / unitPrice) * 100
      // For Supplier B: 280 / 280 * 100 = 100
      // For Supplier D: 280 / 292 * 100 = 95.89
      // Total composite = (priceScore * (priceWeight / 100)) + (complianceScore * (complianceWeight / 100))
      const priceScore = Math.round((minPrice / quote.unitPrice) * 1000) / 10;
      const complianceScore = 100; // Passed all mandatory criteria
      const deliveryScore = 95;

      // Weighted score:
      // Price contribution + Compliance contribution
      const compositeScore = Math.round(
        (priceScore * (priceWeight / 100) + complianceScore * (complianceWeight / 100)) * 10
      ) / 10;

      return {
        ...quote,
        scoreBreakdown: {
          priceScore,
          complianceScore,
          deliveryScore,
          compositeScore,
        },
      };
    });

    // Rank compliant quotes by compositeScore desc
    const compliantSorted = scored
      .filter((q) => !q.isExcluded)
      .sort((a, b) => (b.scoreBreakdown?.compositeScore || 0) - (a.scoreBreakdown?.compositeScore || 0));

    let rankCounter = 1;
    compliantSorted.forEach((q) => {
      q.rank = rankCounter++;
    });

    return scored;
  };

  // Trigger individual supplier quote
  const triggerSupplierQuote = (supplierId: string, forceOverdue = false) => {
    const deadlineStr = activeEvent.rfqDeadline || '2026-10-17T17:00';
    const deadlineDate = new Date(deadlineStr);
    let submissionDate = new Date();
    let isQuoteOverdue = forceOverdue;
    let overdueText = '';

    if (forceOverdue) {
      submissionDate = new Date(deadlineDate.getTime() + (4 * 3600 + 15 * 60) * 1000);
      isQuoteOverdue = true;
      overdueText = 'Late by 4h 15m';
    } else if (submissionDate.getTime() > deadlineDate.getTime()) {
      isQuoteOverdue = true;
      const diffMs = submissionDate.getTime() - deadlineDate.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      overdueText = `Late by ${diffHours}h ${diffMins}m`;
    }

    // Generate realistic quote based on supplier
    let newQuote: SupplierQuote;

    if (supplierId === 'sup_a') {
      newQuote = {
        quoteId: `Q-${Math.floor(1000 + Math.random() * 9000)}`,
        supplierId: 'sup_a',
        supplierName: 'Apex Workplace Interiors',
        submittedAt: submissionDate.toISOString(),
        unitPrice: 285,
        totalPrice: 285 * (activeEvent.requirement.quantity || 50),
        currency: activeEvent.requirement.currency || 'USD',
        promisedDeliveryDate: '2026-10-15',
        paymentTerms: 'Net 30',
        warrantyMonths: 36,
        complianceChecked: true,
        mandatoryCriteriaResponses: {
          'Delivery Date': 'Compliant (15 Oct)',
          'Mesh-back & Lumbar': 'Compliant',
          'ANSI/BIFMA X5.1': 'Compliant (Cert attached)',
          Warranty: '36 Months standard',
        },
        isExcluded: false,
        isOfflineExtracted: false,
        isOverdue: isQuoteOverdue,
        overdueDurationText: overdueText,
        quoteDocumentSnippet: 'Apex Workplace Quotation #AW-9218. 50x Aeron-Style Mesh Ergonomic Chairs. Total $14,250.00 FOB Dallas HQ.',
        notes: 'Includes white-glove floor delivery to 4th floor.',
      };
    } else if (supplierId === 'sup_b') {
      newQuote = {
        quoteId: `Q-7142`,
        supplierId: 'sup_b',
        supplierName: 'ErgoTech Commercial Seating',
        submittedAt: submissionDate.toISOString(),
        unitPrice: 280,
        totalPrice: 280 * (activeEvent.requirement.quantity || 50),
        currency: activeEvent.requirement.currency || 'USD',
        promisedDeliveryDate: '2026-10-12', // 3 days early!
        paymentTerms: 'Net 30',
        warrantyMonths: 60,
        complianceChecked: true,
        mandatoryCriteriaResponses: {
          'Delivery Date': 'Compliant (12 Oct - 3 days ahead of schedule)',
          'Mesh-back & Lumbar': 'Compliant',
          'ANSI/BIFMA X5.1': 'Compliant (Full test report #BT-401)',
          Warranty: '60 Months commercial warranty',
        },
        isExcluded: false,
        isOfflineExtracted: false,
        isOverdue: isQuoteOverdue,
        overdueDurationText: overdueText,
        quoteDocumentSnippet: 'ErgoTech Official Quotation #ET-2026-88. Unit price $280.00 x 50 = $14,000.00. Guaranteed dock arrival Oct 12.',
        notes: 'Preferred repeat vendor. Local inventory staged at Irving facility.',
      };
    } else if (supplierId === 'sup_c') {
      // Incomplete quotation (missing lead time)
      newQuote = {
        quoteId: `Q-9011`,
        supplierId: 'sup_c',
        supplierName: 'Northgate Contract Furnishings',
        submittedAt: submissionDate.toISOString(),
        unitPrice: 275,
        totalPrice: 275 * (activeEvent.requirement.quantity || 50),
        currency: activeEvent.requirement.currency || 'USD',
        promisedDeliveryDate: 'UNSPECIFIED / TBD',
        paymentTerms: 'Net 15',
        warrantyMonths: 24,
        complianceChecked: false,
        mandatoryCriteriaResponses: {
          'Delivery Date': 'UNANSWERED',
          'Mesh-back & Lumbar': 'Compliant',
          'ANSI/BIFMA X5.1': 'Compliant',
          Warranty: '24 Months',
        },
        isExcluded: true,
        exclusionReason: 'Lead time requirement not met / unanswered. Failed mandatory delivery gate.',
        isOfflineExtracted: false,
        isOverdue: isQuoteOverdue,
        overdueDurationText: overdueText,
        quoteDocumentSnippet: 'Northgate Bid #NG-441. Unit price $275.00. Lead time left blank due to supply chain backlog.',
        notes: 'Quotation flagged by Event Agent for missing mandatory delivery date.',
      };
    } else if (supplierId === 'sup_d') {
      newQuote = {
        quoteId: `Q-6490`,
        supplierId: 'sup_d',
        supplierName: 'SteelCraft Commercial Direct',
        submittedAt: submissionDate.toISOString(),
        unitPrice: 292,
        totalPrice: 292 * (activeEvent.requirement.quantity || 50),
        currency: activeEvent.requirement.currency || 'USD',
        promisedDeliveryDate: '2026-10-14',
        paymentTerms: 'Net 30',
        warrantyMonths: 48,
        complianceChecked: true,
        mandatoryCriteriaResponses: {
          'Delivery Date': 'Compliant (14 Oct)',
          'Mesh-back & Lumbar': 'Compliant',
          'ANSI/BIFMA X5.1': 'Compliant',
          Warranty: '48 Months commercial',
        },
        isExcluded: false,
        isOfflineExtracted: false,
        isOverdue: isQuoteOverdue,
        overdueDurationText: overdueText,
        quoteDocumentSnippet: 'SteelCraft Quotation #SC-904. 50 Executive Mesh Task Chairs @ $292.00 = $14,600.00.',
        notes: 'Category-matched vendor with Texas warehouse dispatch.',
      };
    } else if (supplierId === 'sup_calibra') {
      newQuote = {
        quoteId: `Q-CAL-104`,
        supplierId: 'sup_calibra',
        supplierName: 'Calibra Metrology Solutions Ltd',
        submittedAt: submissionDate.toISOString(),
        unitPrice: 2450,
        totalPrice: 2450,
        currency: 'GBP',
        promisedDeliveryDate: '2026-10-22',
        paymentTerms: 'Net 30',
        warrantyMonths: 12,
        complianceChecked: true,
        mandatoryCriteriaResponses: {
          'ISO 17025 Accreditation': 'VERIFIED (UKAS #0492)',
          'On-site field engineer': 'Included',
          '5-day certificate turnaround': 'Guaranteed',
        },
        isExcluded: false,
        isOfflineExtracted: false,
        isOverdue: isQuoteOverdue,
        overdueDurationText: overdueText,
        quoteDocumentSnippet: 'Calibra Proposal #CAL-26-809. Total £2,450.00 inclusive of calibration stickers and UKAS certificates.',
        notes: 'Fully accredited with ISO 17025 UKAS audit pack.',
      };
    } else if (supplierId === 'sup_precision') {
      // Precision Standards: Cheaper (£2,180) but missing mandatory ISO 17025!
      newQuote = {
        quoteId: `Q-PREC-330`,
        supplierId: 'sup_precision',
        supplierName: 'Precision Standards Lab UK',
        submittedAt: submissionDate.toISOString(),
        unitPrice: 2180,
        totalPrice: 2180,
        currency: 'GBP',
        promisedDeliveryDate: '2026-10-24',
        paymentTerms: 'Net 30',
        warrantyMonths: 6,
        complianceChecked: false,
        mandatoryCriteriaResponses: {
          'ISO 17025 Accreditation': 'MISSING / BLANK',
          'On-site field engineer': 'Included',
          '5-day certificate turnaround': 'Standard 10 days',
        },
        isExcluded: true,
        exclusionReason: 'Mandatory UKAS ISO/IEC 17025 accreditation missing. Compliance requirement cannot be waived by price.',
        isOfflineExtracted: false,
        isOverdue: isQuoteOverdue,
        overdueDurationText: overdueText,
        quoteDocumentSnippet: 'Precision Lab Quote #PL-992. Total £2,180.00. ISO accreditation field unpopulated.',
        notes: 'Cheapest numerical quote but non-compliant with mandatory laboratory standard.',
      };
    } else {
      // Generic supplier quote
      newQuote = {
        quoteId: `Q-GEN-${Math.floor(100 + Math.random() * 900)}`,
        supplierId,
        supplierName: `Supplier (${supplierId})`,
        submittedAt: submissionDate.toISOString(),
        unitPrice: 290,
        totalPrice: 290 * (activeEvent.requirement.quantity || 50),
        currency: activeEvent.requirement.currency || 'USD',
        promisedDeliveryDate: '2026-10-15',
        paymentTerms: 'Net 30',
        warrantyMonths: 36,
        complianceChecked: true,
        mandatoryCriteriaResponses: {
          'Delivery Date': 'Compliant',
        },
        isExcluded: false,
        isOfflineExtracted: false,
        isOverdue: isQuoteOverdue,
        overdueDurationText: overdueText,
      };
    }

    // Update state
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== activeEventId) return e;

        // Check if quote already exists
        const existingIdx = e.quotes.findIndex((q) => q.supplierId === supplierId);
        let updatedQuotes = [...e.quotes];
        if (existingIdx >= 0) {
          updatedQuotes[existingIdx] = newQuote;
        } else {
          updatedQuotes.push(newQuote);
        }

        // Recompute scores
        updatedQuotes = calculateQuoteScores(updatedQuotes);

        const compliantCount = updatedQuotes.filter((q) => !q.isExcluded).length;
        const totalReceived = updatedQuotes.length;

        // Check auto-closure condition
        const shouldClose = totalReceived >= 3 && compliantCount >= 2;
        const newStatus = shouldClose ? 'evaluation_ready' : 'quotes_received';

        return {
          ...e,
          quotes: updatedQuotes,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    // Audit and trace
    addAuditEntry(
      isQuoteOverdue
        ? 'SUPPLIER_QUOTE_OVERDUE_FLAGGED'
        : newQuote.isExcluded
        ? 'SUPPLIER_QUOTE_EXCLUDED'
        : 'SUPPLIER_QUOTE_INGESTED',
      `${newQuote.supplierName} submitted quotation of ${newQuote.currency === 'GBP' ? '£' : '$'}${newQuote.unitPrice.toLocaleString()}/unit (Total: ${newQuote.currency === 'GBP' ? '£' : '$'}${newQuote.totalPrice.toLocaleString()}). ${isQuoteOverdue ? `[OVERDUE: ${overdueText}]` : ''} ${newQuote.isExcluded ? `Excluded: ${newQuote.exclusionReason}` : 'Compliance passed.'}`,
      activeEvent.id,
      activeEvent.eventNumber,
      'Event Agent',
      'AI Agent'
    );

    addTrace(
      'event_agent',
      'Ingest & Validate Supplier Quotation',
      `Parsed quotation ${newQuote.quoteId} from ${newQuote.supplierName}. Checked response deadline ${new Date(deadlineStr).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}.`,
      isQuoteOverdue
        ? ['RESPONSE_DEADLINE_BREACH_FLAGGED: ' + overdueText]
        : newQuote.isExcluded
        ? ['EXCLUSION_RULE_TRIGGERED: ' + (newQuote.exclusionReason || '')]
        : ['MANDATORY_CRITERIA_VERIFIED', 'PRICING_NORMALIZED', 'DEADLINE_COMPLIANT']
    );

    // In-Chat Notification Card
    appendMessage({
      sender: 'agent',
      agentId: 'event_agent',
      agentName: 'Event Agent',
      timestamp: new Date().toISOString(),
      content: isQuoteOverdue
        ? `⚠️ **Overdue Quotation Received — Deadline Exceeded**\n**${newQuote.supplierName}** submitted their bid after the configured response deadline (${new Date(deadlineStr).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}).\n- Unit Price: **${newQuote.currency === 'GBP' ? '£' : '$'}${newQuote.unitPrice.toLocaleString()}**\n- Submission: **${new Date(newQuote.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}** (${overdueText})\n- Status: **FLAGGED AS OVERDUE** (Recorded in audit trail)`
        : newQuote.isExcluded
        ? `⚠️ **Quotation Ingested — Compliance Gap Detected**\n**${newQuote.supplierName}** submitted a quote of **${newQuote.currency === 'GBP' ? '£' : '$'}${newQuote.unitPrice}/unit**, but **failed mandatory policy check**:\n> *${newQuote.exclusionReason}*\n\nUnder active Governance Policy **v4.0**, this quotation has been **excluded from competitive ranking**.`
        : `📥 **New Quotation Received**\n**${newQuote.supplierName}** has submitted its formal quotation:\n- Unit Price: **${newQuote.currency === 'GBP' ? '£' : '$'}${newQuote.unitPrice.toLocaleString()}**\n- Total: **${newQuote.currency === 'GBP' ? '£' : '$'}${newQuote.totalPrice.toLocaleString()}**\n- Delivery Promised: **${newQuote.promisedDeliveryDate}**\n- Compliance: **Passed all mandatory requirements**`,
      interactivePayload: {
        type: 'spec_review',
        data: newQuote,
      },
      confidenceScore: 0.98,
    });

    addNotification(
      isQuoteOverdue ? `Overdue Quote: ${newQuote.supplierName}` : `Quote from ${newQuote.supplierName}`,
      isQuoteOverdue
        ? `Submitted after deadline (${overdueText}). Flagged for buyer inspection.`
        : newQuote.isExcluded
        ? `Excluded due to compliance gap`
        : `Received ${newQuote.currency === 'GBP' ? '£' : '$'}${newQuote.totalPrice.toLocaleString()}`,
      isQuoteOverdue ? 'warning' : newQuote.isExcluded ? 'warning' : 'success'
    );

    // If auto-closure triggered, transition Evaluation & Award Agent
    setTimeout(() => {
      // Re-read event quotes count
      const updatedTotal = (activeEvent.quotes?.length || 0) + 1;
      if (updatedTotal >= 3) {
        appendMessage({
          sender: 'agent',
          agentId: 'evaluation_award',
          agentName: 'Evaluation & Award Agent',
          timestamp: new Date().toISOString(),
          content: `🎯 **Event Closed & Evaluation Ready!**\n3 quotes have been ingested, satisfying the configured closure policy **2 days early**.\n\n- Received: **3 quotes**\n- Compliant: **2 quotes**\n- Disqualified: **1 quote (Supplier C - lead-time unanswered)**\n\nI have generated the weighted evaluation scorecard under **Policy v4.0 (80% Price / 20% Compliance)**. Please review the scorecard below.`,
          gateType: 3,
          interactivePayload: {
            type: 'scorecard',
          },
          confidenceScore: 0.99,
        });

        addNotification(
          'Evaluation Scorecard Ready',
          `Early closure criteria satisfied for ${activeEvent.eventNumber}. Scorecard ready for Gate 3 award approval.`,
          'info'
        );
      }
    }, 700);
  };

  // Simulate all remaining quotes in one click
  const simulateAllSupplierQuotes = () => {
    if (activeEvent.id === 'evt_chair_repeat') {
      triggerSupplierQuote('sup_b'); // ErgoTech ($280)
      setTimeout(() => triggerSupplierQuote('sup_d'), 500); // SteelCraft ($292)
      setTimeout(() => triggerSupplierQuote('sup_c'), 1000); // Northgate (Incomplete)
    } else {
      triggerSupplierQuote('sup_calibra'); // Calibra (£2,450 - ISO certified)
      setTimeout(() => triggerSupplierQuote('sup_precision'), 600); // Precision (£2,180 - missing ISO)
    }
  };

  // Upload Offline Quote
  const uploadOfflineQuote = (data: {
    supplierName: string;
    unitPrice: number;
    deliveryDate: string;
    warrantyMonths: number;
    notes: string;
    rawText: string;
  }) => {
    const offlineQuote: SupplierQuote = {
      quoteId: `Q-OFFLINE-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierId: `sup_off_${Date.now()}`,
      supplierName: data.supplierName,
      submittedAt: new Date().toISOString(),
      unitPrice: data.unitPrice,
      totalPrice: data.unitPrice * (activeEvent.requirement.quantity || 50),
      currency: activeEvent.requirement.currency || 'USD',
      promisedDeliveryDate: data.deliveryDate,
      paymentTerms: 'Net 30',
      warrantyMonths: data.warrantyMonths,
      complianceChecked: true,
      mandatoryCriteriaResponses: {
        'Delivery Date': `Compliant (${data.deliveryDate})`,
        'Extracted Specs': 'Validated from offline document',
      },
      isExcluded: false,
      isOfflineExtracted: true,
      quoteDocumentSnippet: data.rawText.substring(0, 200),
      notes: `[OFFLINE EXTRACTED] ${data.notes}`,
    };

    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== activeEventId) return e;
        const updatedQuotes = calculateQuoteScores([...e.quotes, offlineQuote]);
        return {
          ...e,
          quotes: updatedQuotes,
          status: 'evaluation_ready',
          updatedAt: new Date().toISOString(),
        };
      })
    );

    addAuditEntry(
      'OFFLINE_QUOTE_INGESTED',
      `Ingested offline quotation from ${data.supplierName} (${data.unitPrice}/unit). Document verified and flagged as Offline Extracted.`,
      activeEvent.id,
      activeEvent.eventNumber
    );

    addTrace(
      'event_agent',
      'Ingest & Parse Offline Document',
      `Processed uploaded quotation file for ${data.supplierName}. High confidence extraction (98.4%).`,
      ['OFFLINE_EXTRACTION_FLAGGED', 'HASH_PRESERVED', 'SCORING_WEIGHTS_APPLIED']
    );

    appendMessage({
      sender: 'agent',
      agentId: 'event_agent',
      agentName: 'Event Agent',
      timestamp: new Date().toISOString(),
      content: `📄 **Offline Quotation Ingested & Scored**\nExtracted details from document for **${data.supplierName}**:\n- Unit Price: **$${data.unitPrice.toLocaleString()}**\n- Total: **$${(data.unitPrice * (activeEvent.requirement.quantity || 50)).toLocaleString()}**\n- Delivery: **${data.deliveryDate}**\n- Badge: **Offline Extracted**\n\nThe quotation has been normalized and incorporated into the active evaluation scorecard.`,
      confidenceScore: 0.98,
    });

    addNotification(
      `Offline Quote Parsed (${data.supplierName})`,
      `Document parsed with $${data.unitPrice}/unit. Added to evaluation matrix.`,
      'success'
    );
  };

  // Ask Why Recommendation (Trust Exchange)
  const askWhyRecommendation = async () => {
    setIsAiThinking(true);
    appendMessage({
      sender: 'user',
      timestamp: new Date().toISOString(),
      content: 'Why is Supplier B recommended over Supplier D?',
    });

    // Try server-side Gemini first
    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: 'Why is Supplier B recommended over Supplier D?',
          context: {
            event: activeEvent.eventNumber,
            supplierB: {
              name: 'ErgoTech Commercial Seating (Supplier B)',
              unitPrice: 280,
              total: 14000,
              delivery: '12 Oct (3 days early)',
              warranty: '60 months',
              compliance: '100% passed',
              score: 89.2,
            },
            supplierD: {
              name: 'SteelCraft Commercial Direct (Supplier D)',
              unitPrice: 292,
              total: 14600,
              delivery: '14 Oct (1 day early)',
              warranty: '48 months',
              compliance: '100% passed',
              score: 83.0,
            },
            scoringPolicy: 'v4.0 (80% Price / 20% Compliance)',
            pointDifference: '6.2 points',
          },
        }),
      });

      const data = await response.json();
      if (data.response) {
        appendMessage({
          sender: 'agent',
          agentId: 'evaluation_award',
          agentName: 'Evaluation & Award Agent',
          timestamp: new Date().toISOString(),
          content: `${data.response}\n\n*Click on either supplier card below to inspect the verified quote evidence.*`,
          confidenceScore: 0.99,
        });
        setIsAiThinking(false);
        return;
      }
    } catch (e) {
      console.log('Using deterministic procurement explanation fallback', e);
    }

    // Deterministic explainability fallback as in slide 7
    setTimeout(() => {
      appendMessage({
        sender: 'agent',
        agentId: 'evaluation_award',
        agentName: 'Evaluation & Award Agent',
        timestamp: new Date().toISOString(),
        content: `📊 **Verifiable Mathematical Scoring Breakdown (Policy v4.0):**\n\n- **Unit Price Comparison**: **Supplier B quoted $280/unit** ($14,000 total) vs **Supplier D's $292/unit** ($14,600 total). That **$12/unit ($600 total)** price advantage accounts for the **6.2 point spread** under our 80% price weighting.\n- **Delivery Schedule**: Supplier B commits to delivery on **12 October** (3 days ahead of deadline), compared to **14 October** for Supplier D.\n- **Warranty & Quality**: Supplier B includes a **60-month commercial warranty** (vs 48 months for Supplier D).\n- **Compliance Status**: Both suppliers satisfy 100% of mandatory ANSI/BIFMA and mesh-back specifications.\n\n*You can click "Inspect Quote" on either supplier to examine the exact source PDF/email evidence.*`,
        confidenceScore: 0.99,
      });

      addTrace(
        'evaluation_award',
        'Generate Mathematical Scoring Explanation',
        'Calculated exact point variance between Supplier B and Supplier D: 80% * (280/292 normalized delta) = 6.2 pts.',
        ['EVALUATION_WEIGHTS_VERIFIED', 'AUDIT_TRAIL_RECONCILED']
      );

      setIsAiThinking(false);
    }, 600);
  };

  // Ask why not take cheapest in Cold Start
  const askCheapestComplianceQuestion = async () => {
    setIsAiThinking(true);
    appendMessage({
      sender: 'user',
      timestamp: new Date().toISOString(),
      content: 'Why not just award the cheapest supplier (£2,180)?',
    });

    setTimeout(() => {
      appendMessage({
        sender: 'agent',
        agentId: 'evaluation_award',
        agentName: 'Evaluation & Award Agent',
        timestamp: new Date().toISOString(),
        content: `🛑 **Mandatory Compliance Guard Active**\n\nThe cheapest quotation is indeed **Precision Standards Lab UK (£2,180)**, but its **UKAS ISO/IEC 17025 accreditation field is blank/missing** — and at Gate 1 you designated ISO 17025 as a **non-negotiable mandatory criterion**.\n\nUnder active Governance Policy **v4.0**, ranking on price alone would bury a critical regulatory and calibration compliance gap. Therefore, Precision Standards has been **disqualified**.\n\n**Calibra Metrology Solutions Ltd (£2,450)** is the lowest-priced **fully compliant** respondent with verified UKAS accreditation #0492 on file.`,
        confidenceScore: 0.99,
      });

      addTrace(
        'evaluation_award',
        'Enforce Mandatory Compliance Guard',
        'Blocked award to Precision Standards Lab UK (£2,180) due to unfulfilled ISO 17025 accreditation check.',
        ['COMPLIANCE_POLICY_GUARD_ACTIVE', 'MANDATORY_CRITERIA_ENFORCED']
      );

      setIsAiThinking(false);
    }, 600);
  };

  // GATE 3: Award Approval or Override
  const approveGate3 = (supplierId: string, isOverride = false, overrideReason?: string) => {
    const selectedSupplier = MASTER_SUPPLIERS.find((s) => s.id === supplierId);
    const selectedQuote = activeEvent.quotes.find((q) => q.supplierId === supplierId);
    const isRecommended = supplierId === 'sup_b' || supplierId === 'sup_calibra';
    const prNumber = activeEvent.id === 'evt_chair_repeat' ? 'PR-40218' : 'PR-40219';

    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== activeEventId) return e;
        return {
          ...e,
          status: 'awarded',
          awardedSupplierId: supplierId,
          awardedAt: new Date().toISOString(),
          isOverride,
          overrideReason: overrideReason || undefined,
          purchaseRequisitionId: prNumber,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    addAuditEntry(
      isOverride ? 'GATE3_AWARD_OVERRIDE_APPROVED' : 'GATE3_AWARD_RECOMMENDATION_APPROVED',
      isOverride
        ? `Buyer overrode agent recommendation and awarded ${selectedSupplier?.name || supplierId}. Reason recorded: "${overrideReason}". Generated ${prNumber}.`
        : `Buyer approved recommended award to ${selectedSupplier?.name || supplierId} (Total: ${selectedQuote?.currency === 'GBP' ? '£' : '$'}${selectedQuote?.totalPrice?.toLocaleString()}). Generated ${prNumber}.`,
      activeEvent.id,
      activeEvent.eventNumber
    );

    addTrace(
      'evaluation_award',
      'Finalize Award & Generate Purchase Requisition Package',
      `Committed award to ${selectedSupplier?.name}. Simulated transmission of supplier regret notifications. Linked Requisition ${prNumber}.`,
      ['GATE3_CONFIRMED', 'PR_READY_RECORD_GENERATED', 'REGRETS_PREPARED']
    );

    appendMessage({
      sender: 'user',
      timestamp: new Date().toISOString(),
      content: isOverride
        ? `I am overriding the recommendation and awarding ${selectedSupplier?.name || supplierId}. Rationale: ${overrideReason}`
        : `Approve the recommendation. Award ${selectedSupplier?.name || supplierId}.`,
    });

    setTimeout(() => {
      appendMessage({
        sender: 'agent',
        agentId: 'evaluation_award',
        agentName: 'Evaluation & Award Agent',
        timestamp: new Date().toISOString(),
        content: `🎉 **Award Confirmed & Requisition Ready!**\n\n- Supplier Awarded: **${selectedSupplier?.name}**\n- Final Agreed Value: **${selectedQuote?.currency === 'GBP' ? '£' : '$'}${selectedQuote?.totalPrice?.toLocaleString()}**\n- Requisition Created: **\`${prNumber}\`** (PO-Ready Handoff)\n- Audit Trace: **Saved with immutable cryptographic hash**\n- Regret Notices: Prepared autonomously for unsuccessful bidders.\n\nYou can review the complete Purchase-Requisition-Ready package in the right panel.`,
        interactivePayload: {
          type: 'award_summary',
          data: {
            supplierName: selectedSupplier?.name,
            totalPrice: selectedQuote?.totalPrice,
            currency: selectedQuote?.currency,
            prNumber,
            isOverride,
          },
        },
        confidenceScore: 1.0,
      });

      addNotification(
        `Event Awarded (${prNumber})`,
        `${selectedSupplier?.name} awarded for ${activeEvent.eventNumber}. Requisition ${prNumber} prepared.`,
        'success'
      );
    }, 600);
  };

  // General chat input handler
  const sendUserMessage = async (content: string) => {
    const text = content.trim();
    if (!text) return;

    appendMessage({
      sender: 'user',
      timestamp: new Date().toISOString(),
      content: text,
    });

    const lower = text.toLowerCase();

    // Contextual command matching
    if (lower.includes('why') && (lower.includes('b ahead') || lower.includes('recommend') || lower.includes('compare'))) {
      await askWhyRecommendation();
      return;
    }

    if (lower.includes('cheapest') || lower.includes('iso') || lower.includes('compliance')) {
      await askCheapestComplianceQuestion();
      return;
    }

    if (lower.includes('launch') || lower.includes('send') || lower.includes('go')) {
      if (activeEvent.status === 'gate2_launch_approval') {
        approveGate2();
        return;
      }
    }

    if (lower.includes('award') || lower.includes('approve')) {
      if (activeEvent.status === 'evaluation_ready' || activeEvent.status === 'quotes_received') {
        const topQuote = activeEvent.quotes.find((q) => q.rank === 1);
        if (topQuote) {
          approveGate3(topQuote.supplierId);
          return;
        }
      }
    }

    // Default conversational routing
    setIsAiThinking(true);
    setTimeout(() => {
      appendMessage({
        sender: 'agent',
        agentId: 'intake_policy',
        agentName: 'Intake & Policy Agent',
        timestamp: new Date().toISOString(),
        content: `I've registered your instruction: "${text}".\n\nAll actions in this session are governed under Parameter **${governanceConfig.version}**. Use the interactive approval cards or prompt chips to advance the sourcing gates.`,
        confidenceScore: 0.94,
      });
      setIsAiThinking(false);
    }, 500);
  };

  // Customer Admin: Update draft configuration
  const updateDraftConfig = (updates: Partial<GovernanceConfig>) => {
    setDraftConfig((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Run Replay Evals
  const runReplayEvals = () => {
    // Deterministic replay evaluation of 4 past events against draftConfig
    const updated = REPLAY_EVAL_CASES.map((ev) => {
      // If compliance weight increased to 30%, EVT-2026-0835 switches winner
      const isShifted = draftConfig.awardWeights.complianceWeight >= 25 && ev.eventId === 'EVT-2026-0835';
      return {
        ...ev,
        awardChanged: isShifted,
        newScore: Math.round((ev.originalScore + (draftConfig.awardWeights.complianceWeight > 20 ? 1.4 : -0.2)) * 10) / 10,
      };
    });
    setReplayEvals(updated);
    setEvalsRunCount((c) => c + 1);

    addAuditEntry(
      'REPLAY_EVALS_EXECUTED',
      `Customer Admin executed replay evaluations across ${updated.length} completed historical sourcing events against draft parameters ${draftConfig.version}.`,
      undefined,
      undefined,
      'Priya Sharma',
      'Customer Admin'
    );

    addNotification(
      'Replay Evaluations Completed',
      `Re-ran 4 historical events under draft ${draftConfig.version}. 1 award shift detected.`,
      'info'
    );
  };

  // Run Scenario Evals
  const runScenarioEvals = () => {
    setScenarioEvals((prev) =>
      prev.map((s) => ({
        ...s,
        durationMs: Math.floor(300 + Math.random() * 300),
        status: 'pass',
      }))
    );
    setEvalsRunCount((c) => c + 1);

    addAuditEntry(
      'SCENARIO_EVALS_EXECUTED',
      `Executed 4 automated edge-case scenario evals (Cold Start, Insufficient Quotes, Tied Scores, Offline Quote Extraction). All passed.`,
      undefined,
      undefined,
      'Priya Sharma',
      'Customer Admin'
    );

    addNotification(
      'Scenario Evals Passed',
      'All 4 hard-case scenario test suites passed deterministic checks.',
      'success'
    );
  };

  // Submit Draft for Approval (Enforcing Author / Approver separation)
  const submitDraftForApproval = () => {
    setIsDraftSubmitted(true);
    addAuditEntry(
      'CONFIG_DRAFT_SUBMITTED',
      `Priya Sharma submitted parameter draft ${draftConfig.version} for governance review to Alex Vance. Author/Approver separation enforced.`,
      undefined,
      undefined,
      'Priya Sharma',
      'Customer Admin'
    );

    addNotification(
      'Parameter Draft Submitted',
      `Draft ${draftConfig.version} submitted to Alex Vance for compliance sign-off.`,
      'warning'
    );
  };

  // Governance Approver: Approve and publish draft
  const approveAndPublishDraft = () => {
    const publishedVersion = draftConfig.version.replace('-draft', '');
    const publishedConfig: GovernanceConfig = {
      ...draftConfig,
      version: publishedVersion,
      status: 'active',
      publishedBy: 'alex',
      publishedAt: new Date().toISOString(),
    };

    setGovernanceConfig(publishedConfig);
    setIsDraftSubmitted(false);

    addAuditEntry(
      'CONFIG_PUBLISHED',
      `Alex Vance verified evaluation proofs and published Governance Policy Parameter ${publishedVersion} into production. Active ceiling: $${publishedConfig.budgetCeiling.toLocaleString()}, Weights: ${publishedConfig.awardWeights.priceWeight}/${publishedConfig.awardWeights.complianceWeight}.`,
      undefined,
      undefined,
      'Alex Vance',
      'Governance Approver'
    );

    addNotification(
      `Policy Parameter ${publishedVersion} Published!`,
      `New active governance parameters published by Alex Vance. Author/approver audit record created.`,
      'success'
    );
  };

  // Reject Draft
  const rejectDraft = (reason: string) => {
    setIsDraftSubmitted(false);
    addAuditEntry(
      'CONFIG_DRAFT_REJECTED',
      `Alex Vance rejected draft ${draftConfig.version}. Rationale: "${reason}". Returned to Customer Admin.`,
      undefined,
      undefined,
      'Alex Vance',
      'Governance Approver'
    );

    addNotification(
      'Draft Rejected',
      `Draft ${draftConfig.version} returned with comments: "${reason}".`,
      'alert'
    );
  };

  // Reset demo state
  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_events`);
    localStorage.removeItem(`${STORAGE_KEY}_active_id`);
    localStorage.removeItem(`${STORAGE_KEY}_messages`);
    localStorage.removeItem(`${STORAGE_KEY}_gov_config`);
    localStorage.removeItem(`${STORAGE_KEY}_draft_config`);
    localStorage.removeItem(`${STORAGE_KEY}_draft_submitted`);
    localStorage.removeItem(`${STORAGE_KEY}_audit`);
    window.location.reload();
  };

  return (
    <SourcingContext.Provider
      value={{
        activeRole,
        setActiveRole,
        currentUser,
        events,
        activeEvent,
        activeEventId,
        selectEvent,
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
        governanceConfig,
        draftConfig,
        isDraftSubmitted,
        updateDraftConfig,
        scenarioEvals,
        replayEvals,
        evalsRunCount,
        runReplayEvals,
        runScenarioEvals,
        submitDraftForApproval,
        approveAndPublishDraft,
        rejectDraft,
        auditLogs,
        traces,
        notifications,
        markNotificationsRead,
        inspectedQuote,
        setInspectedQuote,
        isOfflineModalOpen,
        setIsOfflineModalOpen,
        resetDemoData,
        loadPresetTrack,
        isAiThinking,
      }}
    >
      {children}
    </SourcingContext.Provider>
  );
};

export const useSourcing = () => {
  const context = useContext(SourcingContext);
  if (!context) {
    throw new Error('useSourcing must be used within a SourcingProvider');
  }
  return context;
};
