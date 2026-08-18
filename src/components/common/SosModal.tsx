import React, { useState } from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  Share2, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Radio,
  Siren
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SosModal: React.FC = () => {
  const { isSosActive, setIsSosActive, currentUser, activeBooking, simulatedCarPosition } = useApp();
  const [broadcastingAlert, setBroadcastingAlert] = useState(true);

  if (!isSosActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl max-w-lg w-full p-6 shadow-2xl shadow-rose-600/30 text-white animate-in zoom-in-95">
        
        {/* Header Alert */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center animate-pulse">
              <Siren className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-heading font-black text-xl text-rose-400">
                EMERGENCY SOS BROADCAST
              </h3>
              <p className="text-xs text-slate-300">
                Safety Operations Center & Police HQ Dispatched
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSosActive(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live GPS Coordinates banner */}
        <div className="my-5 bg-rose-950/40 border border-rose-500/30 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-rose-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-rose-400 animate-ping" />
              Live Telemetry Stream Active
            </span>
            <span className="font-mono">{new Date().toLocaleTimeString()}</span>
          </div>

          <div className="text-xs text-slate-300 font-mono bg-slate-950/60 p-2.5 rounded-xl">
            📍 Current GPS: {simulatedCarPosition[0].toFixed(5)}, {simulatedCarPosition[1].toFixed(5)}
            {activeBooking && (
              <div className="mt-1 text-[11px] text-amber-300">
                Vehicle: {activeBooking.driver?.vehicle.make} {activeBooking.driver?.vehicle.model} ({activeBooking.driver?.vehicle.licensePlate})
                <br />Captain: {activeBooking.driver?.name} ({activeBooking.driver?.phone})
              </div>
            )}
          </div>
        </div>

        {/* 1-Tap Emergency Dials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <a
            href="tel:112"
            className="flex items-center justify-center gap-2 p-3.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl shadow-lg transition"
          >
            <PhoneCall className="w-5 h-5" />
            <span>Call Police (112)</span>
          </a>

          <a
            href="tel:108"
            className="flex items-center justify-center gap-2 p-3.5 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-2xl shadow-lg transition"
          >
            <PhoneCall className="w-5 h-5" />
            <span>Medical Ambulance (108)</span>
          </a>
        </div>

        {/* Emergency Contacts Notify */}
        <div className="border-t border-slate-800 pt-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Emergency Contacts Alerted via SMS / WhatsApp:
          </p>
          <div className="space-y-2">
            {currentUser.emergencyContacts.map((contact, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs"
              >
                <div>
                  <span className="font-bold text-white">{contact.name}</span>
                  <span className="text-slate-400 ml-2 font-mono">{contact.phone}</span>
                </div>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SMS Sent
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dismiss safe button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsSosActive(false)}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
          >
            I am Safe / Deactivate Alert
          </button>
        </div>

      </div>
    </div>
  );
};
