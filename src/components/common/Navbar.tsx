import React, { useState } from 'react';
import { 
  Car, 
  ShieldAlert, 
  Wallet, 
  Bell, 
  User, 
  ShieldCheck, 
  ChevronDown, 
  Zap, 
  Bot,
  Activity,
  Layers,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { KkLogo } from './KkLogo';

interface NavbarProps {
  onRoleSwitch: (role: UserRole) => void;
  onOpenNotifications?: () => void;
  onOpenWallet?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRoleSwitch, onOpenNotifications, onOpenWallet }) => {
  const { 
    currentRole, 
    setCurrentRole, 
    currentUser, 
    currentDriver, 
    walletBalance, 
    notifications, 
    triggerEmergencySos, 
    activeBooking,
    pricingConfig,
    logout
  } = useApp();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-slate-800 backdrop-blur-md px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <KkLogo size="md" showText={false} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-lg tracking-tight text-white">
                KK <span className="text-cyan-400">SMART</span> CAB
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-500/30">
                PRO FLEET
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Intelligent Dispatch • Zero-Emissions EV & Multi-Stop
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 ml-auto">
          
          {/* Surge status indicator */}
          {pricingConfig.isSurgeActive && (
            <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 bg-cyan-500/20 border border-cyan-500/40 rounded-xl text-cyan-300 text-xs font-bold animate-pulse">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>{pricingConfig.surgeMultiplier}x Surge</span>
            </div>
          )}

          {/* Wallet Balance Pill */}
          {currentRole === 'user' && (
            <button
              onClick={onOpenWallet}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-xs text-slate-200 transition group shadow"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono font-black text-emerald-400 group-hover:text-emerald-300">
                ₹{walletBalance}
              </span>
            </button>
          )}

          {/* Emergency SOS Panic Button */}
          {currentRole !== 'admin' && (
            <button
              onClick={triggerEmergencySos}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 rounded-xl text-xs font-bold transition shadow-lg shadow-rose-600/10 active:scale-95"
              title="Emergency SOS Dispatch"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span className="hidden sm:inline">SOS</span>
            </button>
          )}

          {/* User Profile Avatar with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-1 focus:outline-none rounded-xl p-0.5 transition cursor-pointer"
            >
              <img
                src={currentRole === 'driver' ? currentDriver.avatar : currentUser.avatar}
                alt="User Profile"
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-slate-800 hover:ring-cyan-500 transition duration-200"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in space-y-4">
                {/* User Bio */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                  <img
                    src={currentRole === 'driver' ? currentDriver.avatar : currentUser.avatar}
                    alt="User Profile"
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-800"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-xs text-slate-100 truncate">
                      {currentRole === 'driver' ? currentDriver.name : currentRole === 'admin' ? 'Operations Admin' : currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {currentRole === 'driver' ? currentDriver.email : currentRole === 'admin' ? 'admin@kkcab.com' : currentUser.email}
                    </p>
                  </div>
                </div>

                {/* Role Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Portal Role</span>
                  <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded border ${
                    currentRole === 'admin'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : currentRole === 'driver'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                  }`}>
                    {currentRole === 'admin' ? 'Fleet Admin' : currentRole === 'driver' ? 'Captain' : 'Rider'}
                  </span>
                </div>

                {/* Sign Out Action */}
                <button
                  onClick={() => {
                    logout();
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full py-2.5 px-4 bg-slate-950 hover:bg-rose-600/10 text-rose-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout Session</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
