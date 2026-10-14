import React, { useState, useEffect } from 'react';
import { SourcingProvider, useSourcing } from './context/SourcingContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BuyerWorkspace } from './components/buyer/BuyerWorkspace';
import { HistoricalPOLedger } from './components/buyer/HistoricalPOLedger';
import { RequisitionReadyView } from './components/buyer/RequisitionReadyView';
import { GovernanceOverview } from './components/admin/GovernanceOverview';
import { CategoryGovernance } from './components/admin/CategoryGovernance';
import { AgentConfiguration } from './components/admin/AgentConfiguration';
import { EvaluationsWorkbench } from './components/admin/EvaluationsWorkbench';
import { CategoryMetrics } from './components/admin/CategoryMetrics';
import { AgentTraceViewer } from './components/traces/AgentTraceViewer';
import { AuditLogViewer } from './components/audit/AuditLogViewer';
import { ApproverReview } from './components/approver/ApproverReview';
import { ExecutiveDashboard } from './components/cpo/ExecutiveDashboard';

const AppContent: React.FC = () => {
  const { activeRole } = useSourcing();
  const [activeView, setActiveView] = useState('buyer_chat');

  // Sync view when role switches
  useEffect(() => {
    if (activeRole === 'maya') {
      setActiveView('buyer_chat');
    } else if (activeRole === 'priya') {
      setActiveView('admin_overview');
    } else if (activeRole === 'alex') {
      setActiveView('approver_drafts');
    } else if (activeRole === 'david') {
      setActiveView('cpo_overview');
    }
  }, [activeRole]);

  const renderMainView = () => {
    switch (activeView) {
      // Maya views
      case 'buyer_chat':
        return <BuyerWorkspace />;
      case 'buyer_history':
        return <HistoricalPOLedger />;
      case 'pr_ready':
        return <RequisitionReadyView />;

      // Priya views
      case 'admin_overview':
        return <GovernanceOverview />;
      case 'admin_categories':
        return <CategoryGovernance />;
      case 'admin_config':
        return <AgentConfiguration onNavigateToEvals={() => setActiveView('admin_evals')} />;
      case 'admin_evals':
        return <EvaluationsWorkbench />;
      case 'admin_metrics':
        return <CategoryMetrics />;
      case 'admin_traces':
        return <AgentTraceViewer />;
      case 'admin_audit':
        return <AuditLogViewer />;

      // Alex views
      case 'approver_drafts':
        return <ApproverReview />;

      // David views
      case 'cpo_overview':
        return <ExecutiveDashboard />;
      case 'cpo_pillars':
        return <CategoryMetrics />;

      default:
        return <BuyerWorkspace />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-sans antialiased text-slate-800">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 flex overflow-hidden">{renderMainView()}</main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <SourcingProvider>
      <AppContent />
    </SourcingProvider>
  );
}
