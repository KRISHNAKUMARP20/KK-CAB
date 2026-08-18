import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Star, 
  ShieldCheck, 
  Car, 
  Search,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Driver, DriverDocument } from '../../types';

export const AdminDrivers: React.FC = () => {
  const { drivers, verifyDriverDoc, verifyDriverStatus, toggleDriverOnline } = useApp();
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');

  const filteredDrivers = drivers.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery) ||
      d.vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter !== 'all' && d.verificationStatus !== statusFilter) return false;
    return matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white font-heading">
              Driver Partners & KYC Verification
            </h2>
            <p className="text-xs text-slate-400">
              Audit commercial licenses, background checks, and active duty roster
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search driver / car..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['all', 'verified', 'pending', 'rejected'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg capitalize transition ${
                  statusFilter === s ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Driver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrivers.map((driver) => {
          const isVerified = driver.verificationStatus === 'verified';
          const isPending = driver.verificationStatus === 'pending';

          return (
            <div
              key={driver.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={driver.avatar}
                      alt={driver.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-500/50"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white">{driver.name}</h3>
                      <p className="text-[11px] text-slate-400 font-mono">{driver.phone}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isVerified
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isPending
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {driver.verificationStatus}
                  </span>
                </div>

                {/* Vehicle Details */}
                <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vehicle:</span>
                    <span className="font-bold text-slate-200">{driver.vehicle.make} {driver.vehicle.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Plate:</span>
                    <span className="font-mono font-bold text-amber-400">{driver.vehicle.licensePlate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Class:</span>
                    <span className="uppercase font-bold text-slate-200">{driver.vehicle.category}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs py-1 border-t border-slate-800">
                  <div>
                    <p className="text-slate-500 text-[10px]">Rating</p>
                    <p className="font-bold text-amber-400">{driver.rating} ★</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px]">Rides</p>
                    <p className="font-bold text-white">{driver.totalRides}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px]">Status</p>
                    <span className={`text-[10px] font-bold ${driver.isOnline ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {driver.isOnline ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setSelectedDriver(driver)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Review KYC ({driver.documents.length})</span>
                </button>

                <button
                  onClick={() => toggleDriverOnline(driver.id)}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition ${
                    driver.isOnline
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                  title={driver.isOnline ? 'Force Offline' : 'Set Online'}
                >
                  {driver.isOnline ? 'Pause' : 'Online'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* KYC Review & Document Approval Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6 my-8">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white font-heading">
                  KYC Documents: {selectedDriver.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedDriver.phone} • {selectedDriver.vehicle.make} {selectedDriver.vehicle.model} ({selectedDriver.vehicle.licensePlate})
                </p>
              </div>
              <button
                onClick={() => setSelectedDriver(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Documents List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedDriver.documents.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No documents uploaded by this driver.</p>
              ) : (
                selectedDriver.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-200 text-sm">{doc.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Reg No: {doc.documentNumber} • Valid till {doc.expiryDate}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        doc.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {doc.status}
                      </span>
                    </div>

                    {/* Approve / Reject Controls */}
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          verifyDriverDoc(selectedDriver.id, doc.id, 'rejected', 'Document blurred or expired');
                          setSelectedDriver(null);
                        }}
                        className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white rounded-xl font-bold text-xs border border-rose-500/30 transition"
                      >
                        Reject Document
                      </button>

                      <button
                        onClick={() => {
                          verifyDriverDoc(selectedDriver.id, doc.id, 'approved');
                          setSelectedDriver(null);
                        }}
                        className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-xs shadow transition"
                      >
                        Approve & Verify
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick 1-click status override */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
              <span className="text-slate-400">Driver Account Status:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    verifyDriverStatus(selectedDriver.id, 'verified');
                    setSelectedDriver(null);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl"
                >
                  Verify All & Activate
                </button>
                <button
                  onClick={() => {
                    verifyDriverStatus(selectedDriver.id, 'rejected');
                    setSelectedDriver(null);
                  }}
                  className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-xl"
                >
                  Suspend Driver
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
