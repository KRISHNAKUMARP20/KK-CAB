import React, { useState } from 'react';
import { 
  Car, 
  User, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Award,
  Github,
  Linkedin,
  Instagram,
  Mail
} from 'lucide-react';
import { RiderLoginView } from './RiderLoginView';
import { DriverLoginView } from './DriverLoginView';
import { AdminLoginView } from './AdminLoginView';
import { KkLogo } from './KkLogo';

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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-y-auto py-12 selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Decorative Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-slate-900/30 blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-5xl z-10 space-y-10">
        
        {/* Brand identity header */}
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <KkLogo size="lg" showText={true} className="flex-col text-center" />
          <p className="text-xs uppercase font-bold tracking-widest text-cyan-500/60 font-mono mt-1">
            Select Your Portal
          </p>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Book rides, drive with us, or manage the fleet. Please choose one of the options below.
          </p>
        </div>

        {/* Portal selector cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: User Portal */}
          <div 
            onClick={() => setActiveView('user')}
            className="group relative backdrop-blur-xl bg-slate-900/30 hover:bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 p-8 rounded-3xl cursor-pointer transition duration-300 shadow-2xl flex flex-col justify-between h-[340px]"
          >
            {/* Subtle top indicator border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent group-hover:via-cyan-500 transition duration-300"></div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition duration-300 shadow">
                <User className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-slate-100 group-hover:text-cyan-400 transition">
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

            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 group-hover:text-cyan-300 pt-4">
              <span>Go to User Portal</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
            </div>
          </div>

          {/* Card 2: Driver Portal */}
          <div 
            onClick={() => setActiveView('driver')}
            className="group relative backdrop-blur-xl bg-slate-900/30 hover:bg-slate-900/50 border border-slate-800 hover:border-emerald-500/40 p-8 rounded-3xl cursor-pointer transition duration-300 shadow-2xl flex flex-col justify-between h-[340px]"
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
            className="group relative backdrop-blur-xl bg-slate-900/30 hover:bg-slate-900/50 border border-slate-800 hover:border-rose-500/40 p-8 rounded-3xl cursor-pointer transition duration-300 shadow-2xl flex flex-col justify-between h-[340px]"
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
            <ShieldCheck className="w-4 h-4 text-cyan-500" />
            <span>Secure Connection</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-cyan-500" />
            <span>Electric Cars</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4 text-cyan-500" />
            <span>Verified System</span>
          </div>
        </div>

        {/* Social Links Footer */}
        <div className="flex flex-col items-center justify-center gap-3 pt-6 border-t border-slate-900/60">
          <div className="flex items-center gap-6">
            <a 
              href="https://github.com/KRISHNAKUMARP20" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-400 transition-colors duration-250"
              title="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/pkrishnakumar-kk/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-400 transition-colors duration-250"
              title="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="https://www.instagram.com/_kxixh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-400 transition-colors duration-250"
              title="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="mailto:kk6308608@gmail.com" 
              className="text-slate-400 hover:text-cyan-400 transition-colors duration-250"
              title="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
