import React, { useState } from 'react';
import { 
  Car, 
  User, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Award
} from 'lucide-react';
import { RiderLoginView } from './RiderLoginView';
import { DriverLoginView } from './DriverLoginView';
import { AdminLoginView } from './AdminLoginView';

export const PortalSelectorView: React.FC = () => {
  const [activeView, setActiveView] = useState<'select' | 'user' | 'driver' | 'admin'>('select');

  if (activeView === 'user') {
    return <RiderLoginView onBack={() => setActiveView('select')} />;
  }

  if (activeView === 'driver') {
    return <DriverLoginView onBack={() => setActiveView('select')} />;
  }

  if (activeView === 'admin') {
    return <AdminLoginView onBack={() => setActiveView('select')} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-y-auto py-12 selection:bg-amber-500 selection:text-slate-950">
      
      {/* Decorative Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-yellow-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-slate-900/30 blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-5xl z-10 space-y-10">
        
        {/* Brand identity header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-black shadow-xl shadow-amber-500/10 ring-4 ring-amber-500/10">
            <Car className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-4xl font-heading font-black tracking-tight text-white flex items-center justify-center gap-2">
              KK <span className="text-amber-400">Cab</span> Booking
            </h1>
            <p className="text-xs uppercase font-bold tracking-widest text-amber-500/60 font-mono mt-1">
              Select Your Portal
            </p>
          </div>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Book rides, drive with us, or manage the fleet. Please choose one of the options below.
          </p>
        </div>

        {/* Portal selector cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: User Portal */}
          <div 
            onClick={() => setActiveView('user')}
            className="group relative backdrop-blur-xl bg-slate-900/30 hover:bg-slate-900/50 border border-slate-800 hover:border-amber-500/40 p-8 rounded-3xl cursor-pointer transition duration-300 shadow-2xl flex flex-col justify-between h-[340px]"
          >
            {/* Subtle top indicator border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent group-hover:via-amber-500 transition duration-300"></div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition duration-300 shadow">
                <User className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-slate-100 group-hover:text-amber-400 transition">
                  User Portal
                </h2>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold font-mono mt-0.5">
                  Book Rides
                </p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Book cabs, select destinations, track active rides, check travel history, and manage your wallet.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 group-hover:text-amber-300 pt-4">
              <span>Go to User Portal</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
            </div>
          </div>

          {/* Card 2: Driver Portal */}
          <div 
            onClick={() => setActiveView('driver')}
            className="group relative backdrop-blur-xl bg-slate-900/30 hover:bg-slate-900/50 border border-slate-800 hover:border-amber-500/40 p-8 rounded-3xl cursor-pointer transition duration-300 shadow-2xl flex flex-col justify-between h-[340px]"
          >
            {/* Subtle top indicator border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent group-hover:via-emerald-500 transition duration-300"></div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition duration-300 shadow">
                <Car className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-slate-100 group-hover:text-emerald-400 transition">
                  Driver Portal
                </h2>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold font-mono mt-0.5">
                  Drive & Earn
                </p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive and accept ride requests, view routes and directions, track your earnings, and view incentives.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 group-hover:text-emerald-300 pt-4">
              <span>Go to Driver Portal</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
            </div>
          </div>

          {/* Card 3: Admin Portal */}
          <div 
            onClick={() => setActiveView('admin')}
            className="group relative backdrop-blur-xl bg-slate-900/30 hover:bg-slate-900/50 border border-slate-800 hover:border-amber-500/40 p-8 rounded-3xl cursor-pointer transition duration-300 shadow-2xl flex flex-col justify-between h-[340px]"
          >
            {/* Subtle top indicator border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500/30 to-transparent group-hover:via-rose-500 transition duration-300"></div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-slate-950 transition duration-300 shadow">
                <Layers className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-slate-100 group-hover:text-rose-400 transition">
                  Admin Portal
                </h2>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold font-mono mt-0.5">
                  Manage Fleet
                </p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manage drivers, view all bookings, set pricing, update geofences, and check user support tickets.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-rose-400 group-hover:text-rose-300 pt-4">
              <span>Go to Admin Portal</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
            </div>
          </div>

        </div>

        {/* Secure badge */}
        <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-6">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Secure Connection</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Electric Cars</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Verified System</span>
          </div>
        </div>

      </div>

    </div>
  );
};
