import React from 'react';
import {
  MessageSquare,
  History,
  FileCheck2,
  LayoutDashboard,
  FolderTree,
  Sliders,
  TestTube2,
  BarChart3,
  GitBranch,
  FileText,
  ShieldAlert,
  Compass,
  CheckCheck,
  TrendingUp,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useSourcing } from '../../context/SourcingContext';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const { activeRole, currentUser, events } = useSourcing();

  // Navigation items based on active role
  const getNavItems = () => {
    switch (activeRole) {
      case 'maya':
        return [
          {
            id: 'buyer_chat',
            label: 'Conversational Sourcing',
            icon: MessageSquare,
            badge: events.filter((e) => e.status !== 'awarded').length.toString(),
            desc: 'JAI Chat, Gate Approvals & RFQ Tracker',
          },
          {
            id: 'buyer_history',
            label: 'Historical PO Ledger',
            icon: History,
            desc: 'Prior chair POs & UNSPSC matching',
          },
          {
            id: 'pr_ready',
            label: 'PO-Ready Award Packages',
            icon: FileCheck2,
            badge: events.filter((e) => e.status === 'awarded').length.toString(),
            desc: 'PR-40218 & downstream handoffs',
          },
        ];

      case 'priya':
        return [
          {
            id: 'admin_overview',
            label: 'Overview & KPIs',
            icon: LayoutDashboard,
            desc: 'Tail spend under management',
          },
          {
            id: 'admin_categories',
            label: 'Category Governance',
            icon: FolderTree,
            badge: '4',
            desc: 'Scope & risk controls',
          },
          {
            id: 'admin_config',
            label: 'Agent Configuration',
            icon: Sliders,
            badge: 'v4.0',
            desc: 'Ceiling, weights & exclusions',
          },
          {
            id: 'admin_evals',
            label: 'Evaluations Workbench',
            icon: TestTube2,
            badge: 'Evals',
            desc: 'Replay & scenario proof suites',
          },
          {
            id: 'admin_metrics',
            label: 'Category Metrics',
            icon: BarChart3,
            desc: 'North Star & automation bias check',
          },
          {
            id: 'admin_traces',
            label: 'Multi-Agent Traces',
            icon: GitBranch,
            desc: 'Distributed observability',
          },
          {
            id: 'admin_audit',
            label: 'Audit Log & Evidence',
            icon: FileText,
            desc: 'Append-only decision ledger',
          },
        ];

      case 'alex':
        return [
          {
            id: 'approver_drafts',
            label: 'Pending Policy Drafts',
            icon: ShieldAlert,
            badge: '1 Draft',
            desc: 'Author/approver separation review',
          },
          {
            id: 'admin_evals',
            label: 'Evaluation Audit & Diffs',
            icon: TestTube2,
            desc: 'Inspect Replay variances before publish',
          },
          {
            id: 'admin_audit',
            label: 'Governance Audit Trail',
            icon: FileText,
            desc: 'Publication & parameter changes',
          },
        ];

      case 'david':
        return [
          {
            id: 'cpo_overview',
            label: 'North Star Dashboard',
            icon: TrendingUp,
            desc: 'Tail spend competitively sourced',
          },
          {
            id: 'cpo_pillars',
            label: '4 Governance Pillars',
            icon: Layers,
            desc: 'Trust, Adoption, Quality & Efficiency',
          },
          {
            id: 'admin_audit',
            label: 'Audit Lineage',
            icon: FileText,
            desc: 'Evidence for Board & Internal Audit',
          },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-[#111c38] text-slate-300 flex flex-col border-r border-[#1e2f5b] select-none shrink-0">
      {/* Persona Context Card */}
      <div className="p-4 border-b border-[#1e2f5b] bg-[#0c152a]">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
          Active Workspace
        </div>
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover border border-[#00A99A]"
          />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-white truncate">{currentUser.name}</div>
            <div className="text-xs text-teal-400 font-medium truncate">{currentUser.badge}</div>
            <div className="text-[11px] text-slate-400 truncate">{currentUser.spendBook}</div>
          </div>
        </div>
        <div className="mt-2.5 p-2 rounded bg-[#172447] text-[11px] text-slate-300 border border-[#233564] leading-relaxed">
          <span className="font-semibold text-teal-300">Goal:</span> {currentUser.goal}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
          {activeRole === 'maya'
            ? 'Tactical Sourcing'
            : activeRole === 'priya'
            ? 'Governance & System Rules'
            : activeRole === 'alex'
            ? 'Governance Approval'
            : 'Executive Overview'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition group ${
                isActive
                  ? 'bg-[#00A99A] text-white font-semibold shadow-md'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-400'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#172447] text-teal-300 border border-[#233564]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <div
                  className={`text-[10px] truncate ${
                    isActive ? 'text-teal-100' : 'text-slate-400'
                  }`}
                >
                  {item.desc}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Orchestration Agents Indicator */}
      <div className="p-3 border-t border-[#1e2f5b] bg-[#0c152a] text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#00A99A]" />
            Agent Swarm Status
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold">4 Active</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          <div className="bg-[#172447] p-1.5 rounded border border-[#233564] text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00A99A]"></span>
            <span className="truncate">01 Intake & Policy</span>
          </div>
          <div className="bg-[#172447] p-1.5 rounded border border-[#233564] text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="truncate">02 Cat & Supplier</span>
          </div>
          <div className="bg-[#172447] p-1.5 rounded border border-[#233564] text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F4A44C]"></span>
            <span className="truncate">03 Event Agent</span>
          </div>
          <div className="bg-[#172447] p-1.5 rounded border border-[#233564] text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span className="truncate">04 Eval & Award</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
