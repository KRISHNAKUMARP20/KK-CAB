import React, { useState } from 'react';
import { 
  Car, 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Fuel, 
  Activity, 
  Wrench,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VehicleCategory } from '../../types';

export const AdminVehicles: React.FC = () => {
  const { drivers } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const vehicles = drivers.map(d => ({
    ...d.vehicle,
    driverName: d.name,
    driverPhone: d.phone,
    isOnline: d.isOnline,
  }));

  const filteredVehicles = vehicles.filter(v => {
    const matchSearch = v.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.driverName.toLowerCase().includes(search.toLowerCase());

    if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
    return matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white font-heading">
              Smart Vehicle Fleet Telemetry
            </h2>
            <p className="text-xs text-slate-400">
              Cabin amenities, fuel levels, battery state of health, and RTO registration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search plate or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none capitalize"
          >
            <option value="all">All Classes</option>
            <option value="mini">Mini</option>
            <option value="sedan">Sedan</option>
            <option value="electric">Electric (EV)</option>
            <option value="suv">SUV</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>
      </div>

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map((v) => (
          <div
            key={v.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="relative">
                <img
                  src={v.photoUrl}
                  alt={v.model}
                  className="w-full h-40 object-cover rounded-2xl border border-slate-800"
                />
                <span className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur text-amber-400 font-mono font-bold text-xs px-2.5 py-1 rounded-xl border border-amber-500/30">
                  {v.licensePlate}
                </span>
                <span className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur text-slate-200 uppercase font-bold text-[10px] px-2.5 py-1 rounded-xl">
                  {v.category}
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-white font-heading">
                  {v.make} {v.model}
                </h3>
                <p className="text-xs text-slate-400">
                  Captain: <span className="text-slate-200 font-bold">{v.driverName}</span> ({v.driverPhone})
                </p>
              </div>

              {/* Telemetry Bar */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1">
                    {v.fuelType === 'electric' ? <Zap className="w-3.5 h-3.5 text-cyan-400" /> : <Fuel className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{v.fuelType === 'electric' ? 'Battery SoC' : 'Fuel Tank'}</span>
                  </span>
                  <span className="font-mono font-bold text-white">{v.batteryOrFuelLevel}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${v.batteryOrFuelLevel > 40 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${v.batteryOrFuelLevel}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>Year: {v.year} • {v.capacity} Seats</span>
                  <span className="text-emerald-400 font-bold">Fit for Highway</span>
                </div>
              </div>
            </div>

            {/* Features Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
              {v.features.map((f, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-lg border border-slate-800"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
