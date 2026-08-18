import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  FileText, 
  Car, 
  User, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Clock 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';

export const AdminBookings: React.FC = () => {
  const { bookings, setShowInvoiceModal, setInvoiceBooking } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = bookings.filter(b => {
    const matchSearch = b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      b.userName.toLowerCase().includes(search.toLowerCase()) ||
      b.pickup.name.toLowerCase().includes(search.toLowerCase()) ||
      b.destination.name.toLowerCase().includes(search.toLowerCase());

    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    return matchSearch;
  });

  const handleOpenInvoice = (b: Booking) => {
    setInvoiceBooking(b);
    setShowInvoiceModal(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white font-heading">
              Global Bookings & Dispatch Registry
            </h2>
            <p className="text-xs text-slate-400">
              Audit all customer rides, fare splits, route telemetry, and invoices
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search booking code or rider..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="accepted">Accepted</option>
            <option value="searching">Searching</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3.5">Code</th>
                <th className="p-3.5">Passenger</th>
                <th className="p-3.5">Assigned Captain</th>
                <th className="p-3.5">Class</th>
                <th className="p-3.5">Pickup → Drop</th>
                <th className="p-3.5">Distance</th>
                <th className="p-3.5">Fare (INR)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-mono font-bold text-white">{b.bookingCode}</td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <img src={b.userAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-semibold text-slate-200">{b.userName}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-200">
                    {b.driver ? (
                      <span className="font-medium text-slate-200">{b.driver.name}</span>
                    ) : (
                      <span className="text-slate-500 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="p-3.5 font-mono font-bold uppercase text-amber-400">
                    {b.category}
                  </td>
                  <td className="p-3.5 max-w-xs truncate text-slate-300">
                    {b.pickup.name} → {b.destination.name}
                  </td>
                  <td className="p-3.5 font-mono text-slate-400">{b.distanceKm} km</td>
                  <td className="p-3.5 font-mono font-black text-emerald-400">
                    ₹{b.fareBreakdown.totalFare}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        b.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : b.status === 'cancelled'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {b.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleOpenInvoice(b)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-lg border border-slate-700 text-xs transition inline-flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
