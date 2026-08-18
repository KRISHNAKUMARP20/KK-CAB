import React, { useState } from 'react';
import { 
  Navigation, 
  KeyRound, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  Gauge, 
  AlertCircle,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DriverActiveRideProps {
  onBackToDashboard: () => void;
}

export const DriverActiveRide: React.FC<DriverActiveRideProps> = ({ onBackToDashboard }) => {
  const { 
    activeBooking, 
    driverArriveAtPickup, 
    startRideWithOtp, 
    completeRide, 
    etaMinutesRemaining, 
    currentSpeedKmh, 
    triggerEmergencySos 
  } = useApp();

  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  if (!activeBooking) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
        <p className="text-slate-400 text-sm">No active ride assignment currently.</p>
        <button
          onClick={onBackToDashboard}
          className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
        >
          Return to Cockpit
        </button>
      </div>
    );
  }

  const b = activeBooking;

  const handleVerifyStartOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const res = startRideWithOtp(b.id, enteredOtp);
    if (!res.success) {
      setOtpError(res.message);
    } else {
      setOtpError('');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-2xl space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-amber-400 animate-pulse" />
            <h2 className="font-heading font-black text-lg text-white">Captain Turn-by-Turn Nav</h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Ride Code: <span className="text-amber-400 font-bold">{b.bookingCode}</span> • Net Fare: ₹{b.fareBreakdown.driverTakeHome}
          </p>
        </div>

        <button
          onClick={onBackToDashboard}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
        >
          Dashboard View
        </button>
      </div>

      {/* Passenger Info & Call */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={b.userAvatar}
            alt={b.userName}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-800"
          />
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Passenger</span>
            <p className="font-heading font-black text-sm text-white">{b.userName}</p>
            <p className="text-xs text-slate-400 font-mono">{b.userPhone}</p>
          </div>
        </div>

        <a
          href={`tel:${b.userPhone}`}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow"
        >
          <Phone className="w-4 h-4" />
          <span>Call Rider</span>
        </a>
      </div>

      {/* Live State Controls */}
      {b.status === 'accepted' && (
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
              Step 1: En Route to Pickup
            </span>
            <p className="text-sm font-bold text-white mt-1">📍 {b.pickup.name}</p>
            <p className="text-xs text-slate-400">{b.pickup.address}</p>
          </div>

          <button
            onClick={() => driverArriveAtPickup(b.id)}
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition"
          >
            I HAVE ARRIVED AT PICKUP LOCATION
          </button>
        </div>
      )}

      {b.status === 'driver_arrived' && (
        <form onSubmit={handleVerifyStartOtp} className="bg-slate-950 p-5 rounded-2xl border-2 border-amber-500 space-y-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
              Step 2: Enter Passenger 4-Digit OTP to Start Trip
            </span>
            <p className="text-xs text-slate-300 mt-1">
              Ask passenger for the 4-digit code displayed on their screen.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              maxLength={4}
              value={enteredOtp}
              onChange={e => setEnteredOtp(e.target.value)}
              placeholder="e.g. 4821"
              required
              className="w-44 bg-slate-900 border-2 border-amber-500 text-amber-400 font-mono font-black text-2xl text-center tracking-widest rounded-xl p-3 focus:outline-none"
            />

            <button
              type="submit"
              className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition"
            >
              Verify OTP & Start Ride
            </button>
          </div>

          {otpError && (
            <p className="text-xs text-rose-400 font-bold flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {otpError}
            </p>
          )}
        </form>
      )}

      {b.status === 'in_progress' && (
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                Step 3: In Transit to Destination
              </span>
              <p className="text-sm font-bold text-white mt-1">🎯 {b.destination.name}</p>
              <p className="text-xs text-slate-400">{b.destination.address}</p>
            </div>

            <div className="text-right font-mono">
              <span className="text-xs text-slate-400">ETA: {etaMinutesRemaining} mins</span>
              <div className="text-lg font-black text-white">{currentSpeedKmh} km/h</div>
            </div>
          </div>

          <button
            onClick={() => completeRide(b.id)}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition"
          >
            TRIP COMPLETED - COLLECT ₹{b.fareBreakdown.totalFare} FARE
          </button>
        </div>
      )}

      {/* SOS Button */}
      <div className="flex justify-start">
        <button
          onClick={triggerEmergencySos}
          className="px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Captain SOS Alert</span>
        </button>
      </div>

    </div>
  );
};
