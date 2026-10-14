# Autonomous Sourcing Agent

### AI-Powered, Governed Tail Spend Sourcing

**Competitive sourcing for the 80% of transactions we never source today.**

## Overview

Autonomous Sourcing Agent is an agentic AI procurement prototype designed to transform how organizations manage tail-spend sourcing.

Traditional sourcing processes require buyers to manually identify suppliers, prepare RFQs, collect quotations, compare bids, and make award decisions. For low-value transactions, this effort often outweighs the perceived benefits of competitive sourcing.

Our solution uses **four specialized AI agents** to orchestrate the end-to-end sourcing process through a conversational interface, while maintaining human oversight, procurement governance, transparency, and auditability.

**Core principle:** The agent executes. The buyer decides. The customer administrator governs.

## Key Capabilities

### 1. Conversational Sourcing for Buyers

- Initiate sourcing requests using natural language.
- Automatically classify purchases and check procurement policies.
- Generate sourcing specifications using historical purchase orders.
- Recommend eligible suppliers with explanations.
- Launch RFQs after buyer approval.
- Receive supplier quotation notifications directly inside the chatbot.
- Compare supplier bids using configurable evaluation criteria.
- Ask AI agents to explain their recommendations using quotation evidence.
- Approve or override supplier awards.
- Generate award records and simulated purchase requisition references.

### 2. Multi-Agent Orchestration

The application coordinates four specialized agents:

| AI Agent | Responsibility |
|---|---|
| Intake & Policy Agent | Understand purchase requests, classify spend, check contracts, budgets, and policy eligibility. |
| Category & Supplier Agent | Generate requirements, identify suppliers, and prepare supplier recommendations. |
| Event Agent | Manage RFQs, supplier invitations, response tracking, and event closure. |
| Evaluation & Award Agent | Validate quotations, compare suppliers, generate recommendations, and capture award decisions. |

Every agent execution includes observable operations, decision explanations, supporting evidence, and traceability.

### 3. Human-in-the-Loop Approvals

The system operates with **Level 2 autonomy** and three mandatory approval gates:

- **Gate 1:** Buyer validates and approves sourcing requirements.
- **Gate 2:** Buyer reviews the supplier shortlist and authorizes RFQ publication.
- **Gate 3:** Buyer approves or overrides the recommended supplier award.

### 4. Customer Administrator Governance

Customer administrators can configure bounded category-level controls, including:

- Agent operating budget limits
- Procurement routing thresholds
- Supplier eligibility and exclusion rules
- Evaluation weights
- RFQ closure conditions
- Approval and escalation routing
- Configuration version management
- Replay and scenario evaluations before publication

Configuration publication requires separation between the configuration author and its approver.

### 5. Agent Observability and Auditability

The administration portal provides:

- Category-level performance dashboards
- Multi-agent execution traces
- Operation status and latency
- Decision explanations and evidence references
- Configuration versions
- Approval and override history
- Searchable audit logs
- Evaluation test results

## Example: Sourcing 50 Ergonomic Chairs

A buyer enters:

"I need 50 ergonomic chairs for our Dallas office by 15 October."

The Intake & Policy Agent checks eligibility. The Category & Supplier Agent reviews historical purchasing records and generates specifications.

After requirements and RFQ launch approvals, the Event Agent invites four suppliers and tracks their responses.

Supplier quotations appear as notifications inside the buyer's chat.

The Evaluation & Award Agent analyzes the responses and recommends Supplier B at $280 per chair ($14,000 total), compared with Supplier D at $292 per chair ($14,600 total).

The buyer can ask:

"Why is Supplier B recommended over Supplier D?"

The agent explains the commercial and compliance differences, with links to supporting quotation evidence.

Following the final buyer approval, the system generates a structured award record and simulated purchasing handoff.

## Technology Architecture

The proposed prototype uses:

- **Frontend:** React, TypeScript, Tailwind CSS
- **Conversational AI:** Google Gemini API
- **Agent architecture:** Four specialized agents with orchestration and state management
- **Governance:** Versioned policy configuration and role-based access controls
- **Observability:** Execution traces, event timelines, and audit logs
- **Prototype data:** Simulated suppliers, historical POs, sourcing events, and quotations

The precise technology stack depends on the implementation generated in Google AI Studio.

## Product Success Metrics

**North Star:** Tail spend competitively sourced per active buyer per quarter.

Supporting metrics are grouped into four dimensions:

| Dimension | Metrics |
|---|---|
| Trust | Award acceptance without edit, override rate, evidence drill-down, time to decision |
| Adoption | Agent-initiated events, active buyers, repeat buyers |
| Efficiency | Request-to-RFQ cycle time, buyer touches, automated closure |
| Quality | Category correction rate, supplier-list edit rate, offline quote extraction accuracy |

Award acceptance should always be assessed alongside decision time and evidence usage to detect automation bias.

## Prototype Scope

This Phase 1 prototype focuses on explainable sourcing decisions and governed automation.

**Included:** Conversational sourcing, multi-agent orchestration, RFQ simulation, supplier quotation notifications, evaluation, approval gates, governance configuration, traces, and audits.

**Excluded:** Autonomous awards without approval, AI negotiation, real ERP purchase-order creation, contract generation, and verified savings calculations.

Supplier messages, RFQs, and downstream purchasing references are simulated for demonstration.

## Project Objective

Demonstrate how agentic AI can make competitive sourcing economically practical for tail-spend transactions while maintaining enterprise-grade governance, buyer control, and evidence-backed procurement decisions.

The goal is not simply to automate sourcing tasks, but to create an AI-driven sourcing experience that buyers can **trust, understand, and defend**.
