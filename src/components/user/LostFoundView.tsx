import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Send, 
  ShieldCheck 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LostItemCase } from '../../types';

interface LostFoundViewProps {
  initialBookingCode?: string;
  initialDriverName?: string;
}

export const LostFoundView: React.FC<LostFoundViewProps> = ({
  initialBookingCode = '',
  initialDriverName = '',
}) => {
  const { lostItemCases, reportLostItem, currentUser } = useApp();

  const [bookingCode, setBookingCode] = useState(initialBookingCode || 'KK-DEL-9842');
  const [driverName, setDriverName] = useState(initialDriverName || 'Rajesh Sharma');
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<LostItemCase['category']>('Electronics');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !description.trim()) return;

    reportLostItem({
      bookingCode,
      passengerName: currentUser.name,
      passengerPhone: currentUser.phone,
      driverName,
      itemName,
      category,
      description,
    });

    setSubmitted(true);
    setItemName('');
    setDescription('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-black text-xl text-white">Lost & Found Recovery Desk</h2>
            <p className="text-xs text-slate-400">Report belongings left behind in cabs. 100% verified captain retrieval.</p>
          </div>
        </div>

        <div className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> 24x7 HQ Retrieval Team
        </div>
      </div>

      {/* Report Form */}
      <form onSubmit={handleSubmit} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
          File a Lost Item Claim:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Booking ID Code</label>
            <input
              type="text"
              value={bookingCode}
              onChange={e => setBookingCode(e.target.value)}
              required
              className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Captain Name (If known)</label>
            <input
              type="text"
              value={driverName}
              onChange={e => setDriverName(e.target.value)}
              className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Item Name / Model</label>
            <input
              type="text"
              placeholder="e.g. Black iPhone 15 Pro, Brown Leather Wallet"
              value={itemName}
              onChange={e => setItemName(e.target.value)}
              required
              className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
            >
              <option value="Electronics">Electronics (Phone, Earbuds, Laptop)</option>
              <option value="Wallet / Cards">Wallet / Cards / Cash</option>
              <option value="Luggage / Bag">Luggage / Handbag / Backpack</option>
              <option value="Keys / Documents">Keys / Passport / IDs</option>
              <option value="Other">Other Miscellaneous</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase">Detailed Description & Where Left</label>
          <textarea
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g. Left on the rear right seat near the seatbelt buckle..."
            required
            className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
          <span>Submit Lost Item Case to Safety Ops</span>
        </button>

        {submitted && (
          <p className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" /> Case logged! Our support desk has dispatched an instant alert to Captain {driverName}.
          </p>
        )}
      </form>

      {/* Active Lost & Found Cases List */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
          Recent Recovery Cases:
        </span>

        <div className="space-y-3">
          {lostItemCases.map(c => (
            <div
              key={c.id}
              className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-amber-400 text-xs">{c.caseNumber}</span>
                  <span className="text-xs font-bold text-white">{c.itemName}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {c.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{c.description}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1 font-mono">
                  <span>Ride: {c.bookingCode}</span> • <span>Captain: {c.driverName}</span> • <span>Logged: {c.reportedDate}</span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                    c.status === 'returned'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : c.status === 'item_found'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {c.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
