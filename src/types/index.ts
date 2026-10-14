export type RoleType = 'maya' | 'priya' | 'alex' | 'david';

export interface UserProfile {
  id: RoleType;
  name: string;
  title: string;
  department: string;
  avatar: string;
  badge: string;
  spendBook: string;
  tailSpend: string;
  goal: string;
  roleDescription: string;
}

export type AgentId = 'intake_policy' | 'category_supplier' | 'event_agent' | 'evaluation_award';

export interface AgentInfo {
  id: AgentId;
  name: string;
  shortName: string;
  description: string;
  color: string;
  iconName: string;
  version: string;
}

export type EventStatus =
  | 'draft_intake'
  | 'gate1_spec_approval'
  | 'draft_rfq'
  | 'gate2_launch_approval'
  | 'rfq_published'
  | 'quotes_received'
  | 'evaluation_ready'
  | 'gate3_award_approval'
  | 'awarded'
  | 'cancelled';

export interface SourcingRequirement {
  title: string;
  category: string;
  unspscCode: string;
  description: string;
  quantity: number;
  unit: string;
  targetBudget: number;
  currency: string;
  deliveryLocation: string;
  requiredDeliveryDate: string;
  isColdStart: boolean;
  mandatoryCriteria: string[];
  historicalPOCount?: number;
  matchedHistoricalPO?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactEmail: string;
  location: string;
  rating: number; // 0-5
  pastTransactions: number;
  isPreferred: boolean;
  isPreQualified: boolean;
  riskCategory: 'Low' | 'Medium' | 'High';
  tags: string[];
  sourceReason: string;
}

export interface QuoteLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SupplierQuote {
  quoteId: string;
  supplierId: string;
  supplierName: string;
  submittedAt: string;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  promisedDeliveryDate: string;
  paymentTerms: string;
  warrantyMonths: number;
  complianceChecked: boolean;
  mandatoryCriteriaResponses: Record<string, boolean | string>;
  isExcluded: boolean;
  exclusionReason?: string;
  isOfflineExtracted: boolean;
  isOverdue?: boolean;
  overdueDurationText?: string;
  scoreBreakdown?: {
    priceScore: number; // 0 - 100
    complianceScore: number; // 0 - 100
    deliveryScore: number; // 0 - 100
    compositeScore: number; // 0 - 100
  };
  rank?: number;
  notes?: string;
  quoteDocumentSnippet?: string;
}

export interface SourcingEvent {
  id: string;
  eventNumber: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  buyerId: string;
  buyerName: string;
  status: EventStatus;
  requirement: SourcingRequirement;
  invitedSuppliers: Supplier[];
  quotes: SupplierQuote[];
  recommendedSupplierId?: string;
  recommendedReason?: string;
  awardedSupplierId?: string;
  awardedAt?: string;
  isOverride?: boolean;
  overrideReason?: string;
  purchaseRequisitionId?: string;
  rfqDeadline?: string;
  closureRule: {
    targetQuoteCount: number;
    autoCloseOnQuotes: boolean;
    deadlineDays: number;
  };
  appliedConfigVersion: string;
}

export interface ChatMessage {
  id: string;
  eventId: string;
  sender: 'user' | 'agent';
  agentId?: AgentId;
  agentName?: string;
  timestamp: string;
  content: string;
  gateType?: 1 | 2 | 3;
  interactivePayload?: {
    type: 'spec_review' | 'supplier_review' | 'scorecard' | 'award_summary';
    data?: any;
  };
  confidenceScore?: number;
  evidenceSnippets?: Array<{
    supplierName: string;
    text: string;
    quoteRef: string;
  }>;
}

export interface ExclusionRuleConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  isProtected?: boolean;
}

export interface GovernanceConfig {
  version: string;
  status: 'active' | 'draft' | 'archived';
  createdBy: string;
  createdAt: string;
  publishedBy?: string;
  publishedAt?: string;
  budgetCeiling: number; // e.g. 25000
  routingThresholds: {
    directSpendMax: number; // e.g. 2000
    quoteEventMax: number; // e.g. 25000
  };
  awardWeights: {
    priceWeight: number; // e.g. 80
    complianceWeight: number; // e.g. 20
  };
  supplierPolicy: {
    minSuppliersProposed: number;
    minQuotesForClosure: number;
    allowEarlyClosure: boolean;
    allowOfflineQuotes: boolean;
    allowSplitAwards: boolean;
  };
  exclusionRules: ExclusionRuleConfig[];
  enabledCategories: Array<{
    id: string;
    name: string;
    unspscPrefix: string;
    active: boolean;
    annualSpend: string;
  }>;
  approvalRouting: {
    requiresBuyerGate1: boolean;
    requiresBuyerGate2: boolean;
    requiresBuyerGate3: boolean;
    escalateAboveBudget: boolean;
  };
}

export interface ReplayEvalResult {
  eventId: string;
  eventTitle: string;
  originalWinner: string;
  newWinner: string;
  awardChanged: boolean;
  originalScore: number;
  newScore: number;
  varianceNote: string;
}

export interface ScenarioEvalResult {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'pass' | 'fail' | 'warn';
  explanation: string;
  durationMs: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventId?: string;
  eventNumber?: string;
  actor: string;
  role: string;
  action: string;
  details: string;
  policyVersion: string;
  ipAddress?: string;
  hash: string;
}

export interface MultiAgentTrace {
  id: string;
  eventId: string;
  eventNumber?: string;
  category?: string;
  timestamp: string;
  agentId: AgentId;
  agentName: string;
  operation: string;
  status: 'completed' | 'blocked' | 'in_progress';
  latencyMs: number;
  inputTokens?: number;
  confidence: number;
  reasoning: string;
  policyChecksPassed?: string[];
  policyChecks?: string[];
  policyVersion?: string;
  inputRecord?: any;
  outputRecord?: any;
}
