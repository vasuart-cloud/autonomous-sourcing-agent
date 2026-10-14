import React from 'react';
import { History, Building2, Tag, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';
import { HISTORICAL_CHAIR_POS } from '../../data/mockData';

export const HistoricalPOLedger: React.FC = () => {
  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              ERP Purchase History
            </span>
            <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded">
              3 Chair POs Matched
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Historical PO Ledger & Item Specifications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            The Category & Supplier Agent retrieved these prior orders to author the RFQ specification card for Gate 1 review.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
            <tr>
              <th className="p-3">PO Number</th>
              <th className="p-3">Date</th>
              <th className="p-3">Historical Item Description</th>
              <th className="p-3">UNSPSC</th>
              <th className="p-3">Awarded Supplier</th>
              <th className="p-3">Location</th>
              <th className="p-3 text-right">Unit Rate</th>
              <th className="p-3 text-right">Total Spend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {HISTORICAL_CHAIR_POS.map((po) => (
              <tr key={po.poNumber} className="hover:bg-slate-50 transition">
                <td className="p-3 font-mono font-bold text-[#00A99A]">{po.poNumber}</td>
                <td className="p-3 text-slate-500">{po.date}</td>
                <td className="p-3 font-semibold text-slate-900">{po.item}</td>
                <td className="p-3 font-mono text-slate-500">{po.unspsc}</td>
                <td className="p-3 text-slate-800">{po.supplier}</td>
                <td className="p-3 text-slate-600">{po.location}</td>
                <td className="p-3 text-right font-mono font-bold">${po.unitPrice.toFixed(2)}</td>
                <td className="p-3 text-right font-mono font-bold text-slate-900">
                  ${po.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200 text-xs text-teal-900 flex items-start gap-3">
        <CheckCircle2 className="w-4 h-4 text-[#00A99A] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Autonomous Specification Extraction:</span>
          <p className="mt-0.5 text-teal-800 leading-relaxed">
            By analyzing PO-39102 ($285/unit), the agent pre-filled the requirements summary with mesh-back, adjustable lumbar support, and ANSI/BIFMA standards, eliminating 30+ minutes of manual form authoring for Tactical Buyer Maya.
          </p>
        </div>
      </div>
    </div>
  );
};
