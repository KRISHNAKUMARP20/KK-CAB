import React from 'react';
import { 
  Activity, 
  Car, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp, 
  Layers, 
  ShieldCheck, 
  MapPin, 
  Zap,
  Wrench,
  Fuel
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LeafletMap } from '../common/LeafletMap';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const { 
    drivers, 
    bookings, 
    pricingConfig, 
    geofenceZones, 
    maintenanceRecords, 
    fuelLogs, 
    lostItemCases,
    activityLogs
  } = useApp();

  const totalRevenue = bookings.reduce((sum, b) => sum + b.fareBreakdown.totalFare, 0);
  const platformRevenue = bookings.reduce((sum, b) => sum + b.fareBreakdown.platformCommission, 0);
  const activeOnlineDrivers = drivers.filter(d => d.isOnline).length;
  const activeTripsCount = bookings.filter(b => b.status === 'in_progress' || b.status === 'accepted').length;

  return (
    <div className="space-y-6">
      
      {/* 1. Global Fleet Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Online Captains</span>
            <Car className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-heading font-black text-3xl text-white">
            {activeOnlineDrivers} <span className="text-xs font-normal text-slate-400">/ {drivers.length}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live GPS Tracked
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Gross City GMV</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-heading font-black text-3xl text-emerald-400">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1">
            Platform Cut: ₹{platformRevenue.toLocaleString()} (15%)
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Active Trips</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-heading font-black text-3xl text-cyan-400">
            {activeTripsCount}
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1">
            Avg Duration: 28 mins
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Surge Multiplier</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-heading font-black text-3xl text-amber-400">
            {pricingConfig.isSurgeActive ? `${pricingConfig.surgeMultiplier}x` : '1.0x (Normal)'}
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1">
            {geofenceZones.length} Geofence Zones Active
          </span>
        </div>
      </div>

      {/* 2. City Fleet GPS Map View */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading font-black text-lg text-white">Delhi NCR Real-Time Fleet GPS & Demand Radar</h3>
            <p className="text-xs text-slate-400">Monitor vehicle distribution, geofences, and airport surge clusters.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('geofences')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 transition"
            >
              Configure Geofences
            </button>
            <button
              onClick={() => onNavigateTab('fleet_ops')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs rounded-xl border border-slate-700 transition"
            >
              Fleet Maintenance
            </button>
          </div>
        </div>

        <div className="h-[420px] w-full">
          <LeafletMap
            drivers={drivers}
            geofences={geofenceZones}
            center={[28.5850, 77.1650]}
            zoom={11}
          />
        </div>
      </div>

      {/* 3. Live Dispatch Queue Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-heading font-black text-lg text-white">Recent Global Dispatch Registry</h3>
          <button
            onClick={() => onNavigateTab('bookings')}
            className="text-amber-400 text-xs font-bold hover:underline"
          >
            View All ({bookings.length})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-800">
                <th className="p-3">Ride ID</th>
                <th className="p-3">Passenger</th>
                <th className="p-3">Route</th>
                <th className="p-3">Captain</th>
                <th className="p-3">Category</th>
                <th className="p-3">Total Fare</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {bookings.slice(0, 5).map(b => (
                <tr key={b.id} className="hover:bg-slate-950/40">
                  <td className="p-3 font-mono font-bold text-amber-400">{b.bookingCode}</td>
                  <td className="p-3 font-medium text-white">{b.userName}</td>
                  <td className="p-3 max-w-xs truncate">{b.pickup.name} ➔ {b.destination.name}</td>
                  <td className="p-3">{b.driver?.name || 'Searching...'}</td>
                  <td className="p-3 uppercase font-mono text-[10px]">{b.category}</td>
                  <td className="p-3 font-mono font-bold text-white">₹{b.fareBreakdown.totalFare}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        b.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : b.status === 'in_progress'
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Rider & Captain Live Operations Activity Monitor */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-2xl space-y-4">
        <div>
          <h3 className="font-heading font-black text-lg text-white">Rider & Captain Live Operations Monitor</h3>
          <p className="text-xs text-slate-400">Real-time status feed tracking user log-ins, cab requests, driver acceptance, and payments.</p>
        </div>

        {activityLogs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            No live activities logged yet. Actions will populate here as drivers and riders interact with the portal.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-800">
                  <th className="p-3">Time</th>
                  <th className="p-3">User/Driver</th>
                  <th className="p-3">Portal Role</th>
                  <th className="p-3">Logged Action</th>
                  <th className="p-3 text-right">System Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {activityLogs.slice(0, 10).map(log => (
                  <tr key={log.id} className="hover:bg-slate-950/40">
                    <td className="p-3 font-mono text-slate-400">{log.timestamp}</td>
                    <td className="p-3 font-semibold text-white">{log.userName}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.role === 'admin' 
                          ? 'bg-rose-500/20 text-rose-300' 
                          : log.role === 'driver' 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : 'bg-cyan-500/20 text-cyan-300'
                      }`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-200">{log.action}</td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.status === 'Success'
                          ? 'bg-emerald-500/25 text-emerald-400 border border-emerald-500/30'
                          : log.status === 'Pending'
                          ? 'bg-amber-500/25 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/25 text-rose-400 border border-rose-500/30'
                      }`}>
                        {log.status === 'Success' ? '✓ Working Perfectly' : log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
