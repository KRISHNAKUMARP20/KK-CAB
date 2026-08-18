import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  DollarSign, 
  Search,
  Filter,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportTicket } from '../../types';

export const AdminComplaints: React.FC = () => {
  const { supportTickets, resolveSupportTicket, addFundsToWallet } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'investigating' | 'resolved'>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [refundAmount, setRefundAmount] = useState<string>('0');

  const filteredTickets = supportTickets.filter(t => {
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());

    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return matchSearch;
  });

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    const refund = parseFloat(refundAmount) || 0;
    resolveSupportTicket(selectedTicket.id, resolutionText, refund);

    setSelectedTicket(null);
    setResolutionText('');
    setRefundAmount('0');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white font-heading">
              Passenger Inquiries & Dispute Resolution
            </h2>
            <p className="text-xs text-slate-400">
              Lost item tracing, route dispute investigation, and instant refund credits
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search ticket or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none capitalize"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((tkt) => {
          const isResolved = tkt.status === 'resolved';

          return (
            <div
              key={tkt.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-amber-400 text-xs">{tkt.ticketNumber}</span>
                  <span className="text-[10px] uppercase font-bold bg-slate-950 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-800">
                    {tkt.category.replace('_', ' ')}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                    isResolved
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {tkt.status}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{tkt.subject}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{tkt.description}</p>
              </div>

              {tkt.resolution && (
                <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-2xl text-xs text-emerald-300">
                  <span className="font-bold">Staff Resolution Note: </span>
                  {tkt.resolution}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-500">
                <span>Created {new Date(tkt.createdAt).toLocaleString()}</span>

                {!isResolved && (
                  <button
                    onClick={() => {
                      setSelectedTicket(tkt);
                      setResolutionText('');
                      setRefundAmount('0');
                    }}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition"
                  >
                    Investigate & Resolve
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Resolution Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-heading">
                Resolve Ticket #{selectedTicket.ticketNumber}
              </h3>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1">
              <p className="font-bold text-slate-200">{selectedTicket.subject}</p>
              <p className="text-slate-400">{selectedTicket.description}</p>
            </div>

            <form onSubmit={handleResolve} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Official Resolution Message to Passenger
                </label>
                <textarea
                  rows={3}
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  placeholder="e.g. Lost item found and handed over to Captain. Refund of ₹50 initiated to wallet."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Optional Wallet Refund (₹ INR)
                </label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition"
                >
                  Mark Ticket Resolved
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
