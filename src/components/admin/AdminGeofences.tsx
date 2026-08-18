import React, { useState } from 'react';
import { 
  Layers, 
  MapPin, 
  Plus, 
  Trash2, 
  Zap, 
  Plane, 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  Sliders 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GeofenceZone } from '../../types';

export const AdminGeofences: React.FC = () => {
  const { geofenceZones, addGeofenceZone, toggleGeofenceActive, removeGeofenceZone } = useApp();

  const [zoneName, setZoneName] = useState('');
  const [zoneType, setZoneType] = useState<GeofenceZone['type']>('airport');
  const [lat, setLat] = useState<number>(28.5562);
  const [lng, setLng] = useState<number>(77.1000);
  const [radiusKm, setRadiusKm] = useState<number>(4.0);
  const [surcharge, setSurcharge] = useState<number>(150);
  const [multiplier, setMultiplier] = useState<number>(1.4);
  const [color, setColor] = useState('#f59e0b');

  const [createdMsg, setCreatedMsg] = useState(false);

  const handleCreateZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneName.trim()) return;

    addGeofenceZone({
      name: zoneName,
      type: zoneType,
      coordinates: [lat, lng],
      radiusKm,
      surchargeFee: surcharge,
      surgeMultiplier: multiplier,
      color,
      isActive: true,
    });

    setCreatedMsg(true);
    setZoneName('');
    setTimeout(() => setCreatedMsg(false), 3000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading font-black text-xl text-white">Geofenced Zones & Dynamic Surges</h2>
          <p className="text-xs text-slate-400">Configure airport surcharges, tech park boundaries, and restricted toll perimeters.</p>
        </div>

        <div className="text-[11px] bg-amber-500/20 text-amber-300 font-bold px-3 py-1 rounded-xl border border-amber-500/30">
          {geofenceZones.filter(z => z.isActive).length} Live Active Polygons
        </div>
      </div>

      {/* Create New Zone Form */}
      <form onSubmit={handleCreateZone} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
          Draw & Define New Geofence Perimeter:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Zone Name</label>
            <input
              type="text"
              placeholder="e.g. DLF Cyber City Core Hub"
              value={zoneName}
              onChange={e => setZoneName(e.target.value)}
              required
              className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Zone Type</label>
            <select
              value={zoneType}
              onChange={e => setZoneType(e.target.value as any)}
              className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
            >
              <option value="airport">Airport Terminal / Runway Perimeter</option>
              <option value="tech_park">Tech Park / Corporate Cluster</option>
              <option value="high_demand">High Demand Surge Hotspot</option>
              <option value="toll_gate">Expressway Toll Plaza Gate</option>
              <option value="restricted">Restricted / No-Entry Area</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Radius (km)</label>
            <input
              type="number"
              step="0.5"
              value={radiusKm}
              onChange={e => setRadiusKm(Number(e.target.value))}
              required
              className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Center Latitude</label>
            <input
              type="number"
              step="0.0001"
              value={lat}
              onChange={e => setLat(Number(e.target.value))}
              className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Center Longitude</label>
            <input
              type="number"
              step="0.0001"
              value={lng}
              onChange={e => setLng(Number(e.target.value))}
              className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Fixed Surcharge (₹)</label>
            <input
              type="number"
              value={surcharge}
              onChange={e => setSurcharge(Number(e.target.value))}
              className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Demand Multiplier (x)</label>
            <input
              type="number"
              step="0.1"
              value={multiplier}
              onChange={e => setMultiplier(Number(e.target.value))}
              className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 font-mono focus:outline-none text-amber-400 font-bold"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Deploy Geofence Rule to Fleet Engine</span>
        </button>

        {createdMsg && (
          <p className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Geofence rule successfully deployed to dispatch nodes!
          </p>
        )}
      </form>

      {/* Geofences List */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
          Configured Active Geofence Perimeters:
        </span>

        <div className="space-y-3">
          {geofenceZones.map(zone => (
            <div
              key={zone.id}
              className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-950 font-black"
                  style={{ backgroundColor: zone.color }}
                >
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{zone.name}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded uppercase font-mono">
                      {zone.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Radius: {zone.radiusKm} km • Surcharge: ₹{zone.surchargeFee} • Surge: {zone.surgeMultiplier}x
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleGeofenceActive(zone.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    zone.isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {zone.isActive ? 'Active' : 'Disabled'}
                </button>

                <button
                  onClick={() => removeGeofenceZone(zone.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
