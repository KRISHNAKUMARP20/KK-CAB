import React, { useState } from 'react';
import { 
  FileText, 
  RotateCcw, 
  Search, 
  MapPin, 
  Calendar, 
  Star, 
  Building2, 
  HelpCircle, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';

interface UserRideHistoryProps {
  onRebook: (pickup: any, destination: any, category: any) => void;
  onReportLostItem: (bookingCode: string, driverName: string) => void;
}

export const UserRideHistory: React.FC<UserRideHistoryProps> = ({ onRebook, onReportLostItem }) => {
  const { bookings, currentUser, setInvoiceBooking, setShowInvoiceModal } = useApp();
  const [filter, setFilter] = useState<'all' | 'corporate' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const userBookings = bookings.filter(b => b.userId === currentUser.id);

  const filteredBookings = userBookings.filter(b => {
    if (filter === 'corporate' && !b.isCorporateExpense) return false;
    if (filter === 'completed' && b.status !== 'completed') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.bookingCode.toLowerCase().includes(q) ||
        b.pickup.name.toLowerCase().includes(q) ||
        b.destination.name.toLowerCase().includes(q) ||
        (b.driver?.name && b.driver.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenInvoice = (b: Booking) => {
    setInvoiceBooking(b);
    setShowInvoiceModal(true);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-black text-xl text-white">Ride History & Passbook</h2>
          <p className="text-xs text-slate-400">Review past journeys, download GST invoices, and re-book routes.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'all' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Rides ({userBookings.length})
          </button>
          <button
            onClick={() => setFilter('corporate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'corporate' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Corporate Tagged
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by Booking ID, destination, or captain..."
          className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Rides List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No matching rides found in your history.
          </div>
        ) : (
          filteredBookings.map(b => (
            <div
              key={b.id}
              className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800/90 space-y-4 hover:border-slate-700 transition"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-amber-400 text-xs bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {b.bookingCode}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" /> {new Date(b.createdAt).toLocaleDateString()} at {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {b.isCorporateExpense && (
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-cyan-500/30">
                      <Building2 className="w-3 h-3" /> Corporate Expense
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      b.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>

              {/* Route Points */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1"></div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Pickup</span>
                    <p className="font-bold text-white">{b.pickup.name}</p>
                  </div>
                </div>

                {b.stops && b.stops.length > 0 && (
                  <div className="pl-4 border-l border-cyan-500/30 ml-1 space-y-1">
                    {b.stops.map((s, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1"></div>
                        <p className="text-[11px] text-cyan-200">Stop #{idx + 1}: {s.name}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-rose-400 mt-1"></div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Drop</span>
                    <p className="font-bold text-white">{b.destination.name}</p>
                  </div>
                </div>
              </div>

              {/* Driver & Fare Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  {b.driver ? (
                    <>
                      <img
                        src={b.driver.avatar}
                        alt={b.driver.name}
                        className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-700"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-white">{b.driver.name}</span>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {b.driver.vehicle.model} • {b.driver.vehicle.licensePlate}
                        </p>
                      </div>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400">Standard Fleet Dispatch</span>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Paid</span>
                    <div className="font-heading font-black text-lg text-amber-400">
                      ₹{b.fareBreakdown.totalFare + (b.tip || 0)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenInvoice(b)}
                      className="p-2 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl border border-slate-700 transition"
                      title="Download GST Invoice"
                    >
                      <FileText className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onReportLostItem(b.bookingCode, b.driver?.name || 'Assigned Captain')}
                      className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 rounded-xl border border-slate-700 transition"
                      title="Report Lost Item"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onRebook(b.pickup, b.destination, b.category)}
                      className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-Book</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
