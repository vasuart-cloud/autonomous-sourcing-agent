import React from 'react';
import { FileCheck2, CheckCircle2, Download, ExternalLink, ShieldCheck, Tag } from 'lucide-react';
import { useSourcing } from '../../context/SourcingContext';

export const RequisitionReadyView: React.FC = () => {
  const { events, setInspectedQuote } = useSourcing();
  const awardedEvents = events.filter((e) => e.status === 'awarded');

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Downstream ERP Handoff
            </span>
            <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded">
              {awardedEvents.length} PRs Generated
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Purchase Requisition Ready Packages
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Level 2 Autonomy output: Fully defensible supplier awards with linked quotes and audit evidence.
          </p>
        </div>
      </div>

      {awardedEvents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Awarded Packages Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Advance the 50 Ergonomic Chairs event through Gate 3 in the conversational workspace to generate PR-40218.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {awardedEvents.map((ev) => {
            const winnerQuote = ev.quotes.find((q) => q.supplierId === ev.awardedSupplierId);
            const isGBP = ev.requirement.currency === 'GBP';
            const curr = isGBP ? '£' : '$';

            return (
              <div
                key={ev.id}
                className="bg-white rounded-xl border border-emerald-300 p-6 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                        {ev.purchaseRequisitionId || 'PR-40218'}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base">{ev.title}</h3>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                      <span>Event: {ev.eventNumber}</span>
                      <span>Awarded: {new Date(ev.awardedAt || '').toLocaleDateString()}</span>
                      <span>Buyer: {ev.buyerName}</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Ready for ERP PO Release
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Awarded Vendor</span>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">
                      {winnerQuote?.supplierName || 'ErgoTech Commercial'}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Commitment</span>
                    <div className="font-bold text-emerald-700 text-sm font-mono mt-0.5">
                      {curr}{winnerQuote?.totalPrice?.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Delivery Commitment</span>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">
                      {winnerQuote?.promisedDeliveryDate}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Audit State</span>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">
                      Cryptographically Sealed
                    </div>
                  </div>
                </div>

                {/* Attached evidence */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-500 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#00A99A]" />
                    <span>Regret notices queued for {ev.invitedSuppliers.length - 1} unsuccessful suppliers.</span>
                  </div>

                  {winnerQuote && (
                    <button
                      onClick={() => setInspectedQuote(winnerQuote)}
                      className="px-3 py-1.5 bg-[#172447] hover:bg-[#233564] text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      View Package Evidence
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
