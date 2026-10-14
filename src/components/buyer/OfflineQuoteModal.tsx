import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

interface OfflineQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: {
    supplierName: string;
    unitPrice: number;
    deliveryDate: string;
    warrantyMonths: number;
    notes: string;
    rawText: string;
  }) => void;
}

export const OfflineQuoteModal: React.FC<OfflineQuoteModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  if (!isOpen) return null;

  const [supplierName, setSupplierName] = useState('Workspace Dynamics Direct');
  const [unitPrice, setUnitPrice] = useState<number>(288);
  const [deliveryDate, setDeliveryDate] = useState('2026-10-13');
  const [warrantyMonths, setWarrantyMonths] = useState<number>(36);
  const [notes, setNotes] = useState('Extracted from sales quote email sent to buyer inbox.');
  const [isSimulatingExtract, setIsSimulatingExtract] = useState(false);
  const [confidence, setConfidence] = useState(98.6);

  const sampleEmailText = `From: sales@workspacedynamics.com
To: maya.lin@enterprise.com
Date: Oct 13, 2026, 9:42 AM
Subject: Quote: 50 Mesh Task Chairs - Dallas Delivery

Hi Maya,
Following up on your RFQ notification, Workspace Dynamics can supply 50 commercial ergonomic mesh task chairs at $288.00 each ($14,400.00 total). 
Delivery will be completed to your Dallas facility by October 13, 2026.
Standard 36-month commercial warranty and ANSI/BIFMA certification included.

Best regards,
Mark Thompson
VP Sales, Workspace Dynamics`;

  const handleApplySample = () => {
    setIsSimulatingExtract(true);
    setTimeout(() => {
      setSupplierName('Workspace Dynamics Direct');
      setUnitPrice(288);
      setDeliveryDate('2026-10-13');
      setWarrantyMonths(36);
      setConfidence(98.8);
      setIsSimulatingExtract(false);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpload({
      supplierName,
      unitPrice: Number(unitPrice),
      deliveryDate,
      warrantyMonths: Number(warrantyMonths),
      notes,
      rawText: sampleEmailText,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#172447] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Upload className="w-5 h-5 text-[#00A99A]" />
            <div>
              <h3 className="text-base font-bold text-white">Ingest Offline Supplier Quote</h3>
              <p className="text-xs text-slate-300">
                Parse emailed quotes, PDF bids & prevent spend leakage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#00A99A] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Automated Document Parser Active:</span>
              <p className="mt-0.5 text-teal-800">
                Extracted fields will be tagged with <span className="font-semibold underline">Offline Extracted</span> and normalized into the active evaluation matrix.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Source Quote Document</span>
            <button
              type="button"
              onClick={handleApplySample}
              className="text-xs text-[#00A99A] hover:underline font-medium"
            >
              Load Sample Emailed Quote
            </button>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-600 max-h-28 overflow-y-auto whitespace-pre-wrap">
            {sampleEmailText}
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Extracted Commercial Terms
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {confidence}% Confidence
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Supplier Legal Name
              </label>
              <input
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00A99A] focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Quoted Unit Price ($)
                </label>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  required
                  step="0.01"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00A99A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Promised Delivery Date
                </label>
                <input
                  type="text"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00A99A] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Warranty (Months)
                </label>
                <input
                  type="number"
                  value={warrantyMonths}
                  onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00A99A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Extraction Tag
                </label>
                <input
                  type="text"
                  disabled
                  value="OFFLINE_EXTRACTED_V4"
                  className="w-full text-xs px-3 py-2 bg-slate-100 border border-slate-200 text-slate-500 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSimulatingExtract}
              className="px-4 py-2 text-xs font-semibold bg-[#00A99A] hover:bg-[#008f82] text-white rounded-lg shadow transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Ingest & Evaluate Quote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
