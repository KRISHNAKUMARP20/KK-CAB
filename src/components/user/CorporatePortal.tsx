import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  CreditCard, 
  DollarSign, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Briefcase, 
  PieChart, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CorporatePortal: React.FC = () => {
  const { currentUser, bookings, setInvoiceBooking, setShowInvoiceModal } = useApp();
  const cp = currentUser.corporateProfile;

  const corporateBookings = bookings.filter(b => b.isCorporateExpense);
  const totalCorporateSpent = corporateBookings.reduce((sum, b) => sum + b.fareBreakdown.totalFare, 0);

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadMonthlyStatement = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-black">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-black text-xl text-white">{cp.companyName}</h2>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                Active Corporate Account
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              GSTIN: {cp.gstin} • Work Email: {cp.workEmail}
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadMonthlyStatement}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>{downloadSuccess ? 'Downloaded CSV & PDF' : 'Download Monthly GST Statement'}</span>
        </button>
      </div>

      {/* Budget & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Remaining Travel Allowance</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-heading font-black text-2xl text-emerald-400">
            ₹{cp.monthlyBudgetRemaining}
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full w-[72%] rounded-full"></div>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Month-to-Date Corporate Spends</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-heading font-black text-2xl text-cyan-400">
            ₹{totalCorporateSpent}
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-mono">{corporateBookings.length} rides billed to {cp.costCenter}</p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Corporate Travel Policy</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-heading font-bold text-sm text-white">
            Grade A Policy Active
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            • Allowed: Sedan, EV, SUV Prime<br />
            • Surge auto-approved up to 1.5x
          </p>
        </div>
      </div>

      {/* Corporate Travel Logs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
            Corporate Rides Billed to Company:
          </span>
          <span className="text-xs text-slate-400 font-mono">SAC Code 9964 Compliant</span>
        </div>

        <div className="space-y-3">
          {corporateBookings.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs bg-slate-950 rounded-2xl">
              No corporate rides tagged yet. Select "Bill to Company" during booking.
            </div>
          ) : (
            corporateBookings.map(b => (
              <div
                key={b.id}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-amber-400 text-xs">{b.bookingCode}</span>
                    <span className="text-xs font-bold text-white">
                      {b.pickup.name} ➔ {b.destination.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20">
                      Tag: {b.corporateExpenseTag || 'Business Travel'}
                    </span>
                    <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-sm text-amber-400">
                    ₹{b.fareBreakdown.totalFare}
                  </span>
                  <button
                    onClick={() => {
                      setInvoiceBooking(b);
                      setShowInvoiceModal(true);
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold rounded-xl border border-slate-700"
                  >
                    Invoice
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
