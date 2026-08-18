import React from 'react';
import { 
  Power, 
  TrendingUp, 
  Star, 
  Car, 
  Clock, 
  Fuel, 
  ShieldCheck, 
  MapPin, 
  Bell, 
  ChevronRight,
  BatteryCharging,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DriverDashboardProps {
  onOpenActiveRide: () => void;
  onOpenIncentives: () => void;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({ onOpenActiveRide, onOpenIncentives }) => {
  const { 
    currentDriver, 
    toggleDriverOnline, 
    activeBooking, 
    driverAcceptRide,
    driverIncentives 
  } = useApp();

  const isOnline = currentDriver.isOnline;
  const v = currentDriver.vehicle;
  const isEv = v.fuelType === 'electric';

  const pendingIncentives = driverIncentives.filter(i => !i.isClaimed);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-2xl space-y-6">
      
      {/* 1. Captain Duty Status & Telemetry Header */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentDriver.avatar}
            alt={currentDriver.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-500/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-black text-xl text-white">{currentDriver.name}</h2>
              <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded text-xs">
                {currentDriver.rating} ★ ({currentDriver.totalRides} Trips)
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {v.make} {v.model} • <span className="text-amber-400">{v.licensePlate}</span>
            </p>
          </div>
        </div>

        {/* Online / Offline Duty Switch */}
        <button
          onClick={() => toggleDriverOnline(currentDriver.id)}
          className={`px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-xl flex items-center gap-2 ${
            isOnline
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
          }`}
        >
          <Power className="w-4 h-4 stroke-[3]" />
          <span>{isOnline ? 'ON DUTY (Online)' : 'OFF DUTY (Offline)'}</span>
        </button>
      </div>

      {/* 2. Today's Telemetry & Performance Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Today's Payout</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-heading font-black text-2xl text-emerald-400">
            ₹{currentDriver.earningsToday}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Net 85% Split Take-home</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Acceptance Rate</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-heading font-black text-2xl text-white">
            {currentDriver.acceptanceRate}%
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">Top 5% Captain Tier</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{isEv ? 'EV Battery' : 'Fuel Level'}</span>
            {isEv ? <BatteryCharging className="w-4 h-4 text-cyan-400" /> : <Fuel className="w-4 h-4 text-amber-400" />}
          </div>
          <div className="font-heading font-black text-2xl text-white">
            {v.batteryOrFuelLevel}%
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Fit for Duty: Yes</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Active Shift</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-heading font-black text-lg text-amber-400 capitalize">
            {currentDriver.activeShift} Shift
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Surge Peak Priority</span>
        </div>
      </div>

      {/* 3. Incoming Ride Request Banner */}
      {activeBooking && activeBooking.status === 'searching' && isOnline && (
        <div className="bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-yellow-500/20 border-2 border-amber-500 rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
              <span className="font-heading font-black text-amber-400 uppercase text-xs tracking-wider">
                New Incoming Ride Dispatch!
              </span>
            </div>
            <div className="font-heading font-black text-2xl text-white">
              ₹{activeBooking.fareBreakdown.driverTakeHome}
              <span className="text-xs font-normal text-slate-400 ml-1">Earning</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1"></div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Pickup:</span>
                <p className="font-bold text-white">{activeBooking.pickup.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-400 mt-1"></div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Drop:</span>
                <p className="font-bold text-white">{activeBooking.destination.name}</p>
              </div>
            </div>

            <div className="flex justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
              <span>Distance: {activeBooking.distanceKm} km</span>
              <span>Est. Duration: {activeBooking.durationMinutes} mins</span>
              <span>Category: {activeBooking.category.toUpperCase()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => driverAcceptRide(activeBooking.id, currentDriver.id)}
              className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition"
            >
              ACCEPT RIDE (15s Countdown)
            </button>
          </div>
        </div>
      )}

      {/* 4. Active In-Trip Navigation Trigger (if active) */}
      {activeBooking && (activeBooking.status === 'accepted' || activeBooking.status === 'driver_arrived' || activeBooking.status === 'in_progress') && (
        <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
              <span className="font-heading font-black text-white text-base">
                Trip In Progress: {activeBooking.bookingCode}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Passenger: {activeBooking.userName} • {activeBooking.pickup.name} ➔ {activeBooking.destination.name}
            </p>
          </div>

          <button
            onClick={onOpenActiveRide}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition"
          >
            <span>Open Navigation Cockpit</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 5. Weekend Incentives & Bonus Milestones Preview */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Weekly Incentive Milestones:
            </span>
          </div>
          <button
            onClick={onOpenIncentives}
            className="text-amber-400 text-xs font-bold hover:underline"
          >
            View All ({pendingIncentives.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pendingIncentives.slice(0, 2).map(inc => (
            <div key={inc.id} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-bold text-xs text-white">{inc.title}</span>
                <span className="font-mono font-black text-emerald-400 text-xs">+₹{inc.rewardAmount}</span>
              </div>
              <p className="text-[11px] text-slate-400">{inc.description}</p>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
                <span>Progress: {inc.completedTrips} / {inc.targetTrips} trips</span>
                <span>Deadline: {inc.validUntil}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
