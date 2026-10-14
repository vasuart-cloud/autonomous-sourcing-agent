import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  Filter,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useSourcing } from '../../context/SourcingContext';

export const AuditLogViewer: React.FC = () => {
  const { auditLogs } = useSourcing();
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const filtered = auditLogs.filter((log) => {
    if (filterAction !== 'all' && !log.action.includes(filterAction)) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        log.details.toLowerCase().includes(q) ||
        log.actor.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.id.toLowerCase().includes(q) ||
        (log.eventNumber && log.eventNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const exportCSV = () => {
    const headers = 'ID,Timestamp,Actor,Role,Action,Event,Details,PolicyVersion,Hash\n';
    const rows = filtered
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.actor}","${l.role}","${l.action}","${l.eventNumber || ''}","${l.details.replace(/"/g, '""')}","${l.policyVersion}","${l.hash}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sourcing_audit_log_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filtered, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `sourcing_audit_log_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A99A]">
              Compliance & Audit Trail
            </span>
            <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-500" /> Append-Only Ledger
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Immutable Audit Trail & Decision Lineage
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically hashed audit records capturing every requirement edit, policy check, gate approval, and award override.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={exportJSON}
            className="px-3 py-2 bg-[#172447] hover:bg-[#233564] text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit records by actor, action, or event number..."
            className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-[#00A99A]"
          />
        </div>

        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:outline-hidden"
        >
          <option value="all">All Action Types</option>
          <option value="GATE">Gate Approvals</option>
          <option value="CONFIG">Policy Configuration</option>
          <option value="QUOTE">Supplier Quotes</option>
          <option value="EVAL">Evaluations & Proofs</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
            <tr>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Actor & Role</th>
              <th className="p-3">Action Event</th>
              <th className="p-3">Reference</th>
              <th className="p-3">Details & Rationale</th>
              <th className="p-3 font-mono">Hash Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition">
                <td className="p-3 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                  {new Date(log.timestamp).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </td>
                <td className="p-3">
                  <div className="font-bold text-slate-900">{log.actor}</div>
                  <div className="text-[10px] text-slate-400">{log.role}</div>
                </td>
                <td className="p-3">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono ${
                      log.action.includes('GATE3') || log.action.includes('PUBLISHED')
                        ? 'bg-purple-100 text-purple-800'
                        : log.action.includes('GATE1') || log.action.includes('GATE2')
                        ? 'bg-teal-100 text-teal-800'
                        : log.action.includes('EXCLUDED')
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="p-3 font-mono text-slate-600">
                  {log.eventNumber || log.policyVersion}
                </td>
                <td className="p-3 text-slate-700 max-w-md leading-relaxed">{log.details}</td>
                <td className="p-3 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                  {log.hash}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
