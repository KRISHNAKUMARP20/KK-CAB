import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  MapPin, 
  Users, 
  Car, 
  DollarSign, 
  Clock 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminAnalytics: React.FC = () => {
  const { bookings, drivers } = useApp();

  const hourlyDistribution = [
    { hour: '06:00 - 09:00', rides: 420, label: 'Morning Peak' },
    { hour: '09:00 - 12:00', rides: 310, label: 'Office Influx' },
    { hour: '12:00 - 16:00', rides: 240, label: 'Afternoon Steady' },
    { hour: '16:00 - 20:00', rides: 560, label: 'Evening Surge' },
    { hour: '20:00 - 00:00', rides: 380, label: 'Night Dining' },
    { hour: '00:00 - 06:00', rides: 95, label: 'Airport Red-Eye' },
  ];

  const categoryShare = [
    { name: 'Sedan (Dzire / Etios)', share: 38, color: 'bg-amber-400' },
    { name: 'Mini (WagonR)', share: 26, color: 'bg-emerald-400' },
    { name: 'Electric (EV Nex)', share: 18, color: 'bg-cyan-400' },
    { name: 'SUV (Ertiga / Innova)', share: 12, color: 'bg-indigo-400' },
    { name: 'Luxury (Audi / Merc)', share: 6, color: 'bg-purple-400' },
  ];

  const topHotspots = [
    { name: 'IGI Airport Terminal 3', rides: 1420, demand: 'Ultra High' },
    { name: 'Cyber City DLF Phase 2', rides: 1180, demand: 'High' },
    { name: 'New Delhi Railway Station (NDLS)', rides: 960, demand: 'High' },
    { name: 'Connaught Place Outer Circle', rides: 840, demand: 'Medium' },
    { name: 'Noida Sector 62 Electronic City', rides: 690, demand: 'Medium' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white font-heading">
              Fleet Operations & Demand Intelligence
            </h2>
            <p className="text-xs text-slate-400">
              Trip density heatmaps, category market penetration, and peak-hour surge metrics
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Hourly Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Hourly Trip Volume (24-Hour Cycle)</span>
            </h3>
            <span className="text-[10px] text-slate-400">Peak: 16:00 - 20:00</span>
          </div>

          <div className="space-y-3 pt-2">
            {hourlyDistribution.map((slot) => {
              const pct = Math.round((slot.rides / 560) * 100);
              return (
                <div key={slot.hour} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>{slot.hour} <span className="text-slate-500">({slot.label})</span></span>
                    <span className="font-mono font-bold text-white">{slot.rides} rides</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Revenue Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-400" />
              <span>Vehicle Class Market Share (%)</span>
            </h3>
            <span className="text-[10px] text-slate-400">Sedan Dominant</span>
          </div>

          <div className="space-y-4 pt-2">
            <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden flex">
              {categoryShare.map((cat, idx) => (
                <div
                  key={idx}
                  className={`h-full ${cat.color}`}
                  style={{ width: `${cat.share}%` }}
                  title={`${cat.name}: ${cat.share}%`}
                ></div>
              ))}
            </div>

            <div className="space-y-2.5">
              {categoryShare.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                    <span className="text-slate-300 font-medium">{cat.name}</span>
                  </div>
                  <span className="font-mono font-bold text-white">{cat.share}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Top Pickup Demand Hotspots */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-400" />
          <span>Top Pickup Geofences & Demand Hubs</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topHotspots.map((spot, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-amber-400 font-bold">#0{idx + 1} HOTSPOT</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                  {spot.demand}
                </span>
              </div>
              <p className="font-bold text-slate-100 text-sm">{spot.name}</p>
              <p className="text-slate-400 font-mono">{spot.rides} completed departures</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
