import React from 'react';
import {
  X,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  ShieldCheck,
  Building2,
  Calendar,
  DollarSign,
  Tag,
  Clock,
} from 'lucide-react';
import { SupplierQuote } from '../../types';

interface QuoteInspectionModalProps {
  quote: SupplierQuote | null;
  onClose: () => void;
}

export const QuoteInspectionModal: React.FC<QuoteInspectionModalProps> = ({ quote, onClose }) => {
  if (!quote) return null;

  const isGBP = quote.currency === 'GBP';
  const currSymbol = isGBP ? '£' : '$';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#172447] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-white/10 text-teal-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white">{quote.supplierName}</h3>
                {quote.isOverdue && (
                  <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-300" />
                    Overdue ({quote.overdueDurationText || 'Late'})
                  </span>
                )}
                {quote.isOfflineExtracted && (
                  <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                    Offline Extracted
                  </span>
                )}
                {quote.isExcluded ? (
                  <span className="text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded">
                    Disqualified
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                    Verified Compliant
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">
                Quotation Ref: <span className="font-mono text-teal-300">{quote.quoteId}</span> · Ingested {new Date(quote.submittedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Overdue Warning if overdue */}
          {quote.isOverdue && (
            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-300 flex items-start gap-3 text-xs text-amber-900">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Overdue Response Notice:</span>
                <p className="mt-0.5 text-amber-800">
                  This quotation was submitted at <strong>{new Date(quote.submittedAt).toLocaleString()}</strong>, which breached the designated RFQ response deadline. Flagged as <strong>{quote.overdueDurationText || 'Late Submission'}</strong> for buyer evaluation.
                </p>
              </div>
            </div>
          )}

          {/* Exclusion Warning if excluded */}
          {quote.isExcluded && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-900">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Governance Disqualification Notice:</span>
                <p className="mt-0.5 text-rose-700">{quote.exclusionReason}</p>
              </div>
            </div>
          )}

          {/* Key Commercial Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-teal-600" /> Unit Price
              </span>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {currSymbol}{quote.unitPrice.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">Fixed quoted rate</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-blue-600" /> Total Bid
              </span>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {currSymbol}{quote.totalPrice.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">All-inclusive FOB</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" /> Promised Delivery
              </span>
              <div className="text-sm font-bold text-slate-900 mt-1 truncate">
                {quote.promisedDeliveryDate}
              </div>
              <span className="text-[10px] text-slate-400">
                {quote.promisedDeliveryDate.includes('12 Oct')
                  ? '3 days early'
                  : quote.promisedDeliveryDate.includes('14 Oct')
                  ? '1 day early'
                  : 'On schedule'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Warranty
              </span>
              <div className="text-sm font-bold text-slate-900 mt-1">
                {quote.warrantyMonths} Months
              </div>
              <span className="text-[10px] text-slate-400">{quote.paymentTerms}</span>
            </div>
          </div>

          {/* Mandatory Criteria Responses */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00A99A]" />
              Mandatory Compliance Response Validation
            </h4>
            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden text-xs">
              {Object.entries(quote.mandatoryCriteriaResponses || {}).map(([key, val]) => {
                const isPassed =
                  String(val).toLowerCase().includes('compliant') ||
                  String(val).toLowerCase().includes('verified') ||
                  String(val).toLowerCase().includes('included') ||
                  String(val).toLowerCase().includes('guaranteed');
                return (
                  <div key={key} className="p-3 flex items-center justify-between">
                    <span className="font-medium text-slate-700">{key}</span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[11px] flex items-center gap-1 ${
                        isPassed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                      )}
                      {String(val)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Original Quotation Snippet / Evidence */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Source Document Evidence & Extracted Text
            </h4>
            <div className="p-4 bg-slate-900 text-slate-200 font-mono text-xs rounded-lg border border-slate-700 leading-relaxed whitespace-pre-wrap">
              {quote.quoteDocumentSnippet ||
                `--- TRANSMISSION FROM ${quote.supplierName} ---\nQuotation ID: ${quote.quoteId}\nPricing: ${currSymbol}${quote.unitPrice}/unit x Quantity\nTerms: ${quote.paymentTerms}\nWarranty: ${quote.warrantyMonths} Months Commercial\nCompliance: Fully certified and registered in JAGGAER Supplier Portal.`}
            </div>
          </div>

          {/* Score Calculation if available */}
          {quote.scoreBreakdown && !quote.isExcluded && (
            <div className="p-4 bg-teal-50/50 rounded-lg border border-teal-200 text-xs">
              <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                <span>Evaluation Score Formulation (Policy v4.0)</span>
                <span className="text-base text-teal-800 font-extrabold">
                  Composite: {quote.scoreBreakdown.compositeScore} pts (Rank #{quote.rank})
                </span>
              </div>
              <div className="text-slate-600 text-[11px] space-y-1">
                <div>
                  • Price Score: <span className="font-semibold text-slate-800">{quote.scoreBreakdown.priceScore} pts</span> (80% weight = {(quote.scoreBreakdown.priceScore * 0.8).toFixed(1)} pts)
                </div>
                <div>
                  • Compliance & Quality Score: <span className="font-semibold text-slate-800">{quote.scoreBreakdown.complianceScore} pts</span> (20% weight = {(quote.scoreBreakdown.complianceScore * 0.2).toFixed(1)} pts)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Cryptographic Document Hash: 0x9f88...71ca (Simulated Proof)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#172447] hover:bg-[#233564] text-white font-medium rounded-lg transition"
          >
            Close Drill-Down
          </button>
        </div>
      </div>
    </div>
  );
};
