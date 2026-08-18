import React, { useState } from 'react';
import { 
  Wrench, 
  Fuel, 
  BatteryCharging, 
  Plus, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Car, 
  Calendar, 
  TrendingUp 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MaintenanceRecord, FuelLog } from '../../types';

export const AdminFleetOps: React.FC = () => {
  const { 
    maintenanceRecords, 
    addMaintenanceRecord, 
    fuelLogs, 
    addFuelLog, 
    drivers 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'maintenance' | 'fuel'>('maintenance');

  // New Maintenance Form
  const [vehiclePlate, setVehiclePlate] = useState('DL 01 AA 4082');
  const [serviceType, setServiceType] = useState<MaintenanceRecord['serviceType']>('routine');
  const [serviceCost, setServiceCost] = useState<number>(4500);
  const [vendorName, setVendorName] = useState('Toyota Authorized Workshop (Okhla)');
  const [serviceNotes, setServiceNotes] = useState('');
  const [mSuccess, setMSuccess] = useState(false);

  // New Fuel / EV Charging Form
  const [fuelPlate, setFuelPlate] = useState('DL 01 AA 4082');
  const [fuelType, setFuelType] = useState<FuelLog['fuelType']>('cng');
  const [fuelQty, setFuelQty] = useState<number>(14.5);
  const [fuelCost, setFuelCost] = useState<number>(1150);
  const [fuelStation, setFuelStation] = useState('IGL CNG Pump, Nehru Place');
  const [fSuccess, setFSuccess] = useState(false);

  const handleAddMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    addMaintenanceRecord({
      vehiclePlate,
      serviceType,
      cost: serviceCost,
      vendorName,
      notes: serviceNotes || 'Routine scheduled maintenance and brake fluid top-up.',
      status: 'completed',
    });
    setMSuccess(true);
    setServiceNotes('');
    setTimeout(() => setMSuccess(false), 3000);
  };

  const handleAddFuel = (e: React.FormEvent) => {
    e.preventDefault();
    addFuelLog({
      vehiclePlate: fuelPlate,
      fuelType,
      litersOrKwh: fuelQty,
      cost: fuelCost,
      stationName: fuelStation,
      odometerAtRefuel: 48200,
    });
    setFSuccess(true);
    setTimeout(() => setFSuccess(false), 3000);
  };

  const totalMaintenanceExpense = maintenanceRecords.reduce((sum, m) => sum + m.cost, 0);
  const totalFuelExpense = fuelLogs.reduce((sum, f) => sum + f.cost, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading font-black text-xl text-white">Fleet Maintenance & EV Charging Telemetry</h2>
          <p className="text-xs text-slate-400">Preventive servicing, brake inspections, fast charging logs, and garage invoices.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'maintenance'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Maintenance Logs</span>
          </button>
          <button
            onClick={() => setActiveTab('fuel')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'fuel'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Fuel className="w-3.5 h-3.5" />
            <span>Fuel & EV Charging</span>
          </button>
        </div>
      </div>

      {/* Expense Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Total Garage & Servicing Outlay</span>
            <Wrench className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-heading font-black text-2xl text-amber-400 mt-1">
            ₹{totalMaintenanceExpense.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{maintenanceRecords.length} service entries logged</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Fleet Fuel & Charging Outlay</span>
            <BatteryCharging className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-heading font-black text-2xl text-cyan-400 mt-1">
            ₹{totalFuelExpense.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{fuelLogs.length} refuel/charge transactions</span>
        </div>
      </div>

      {/* Tab 1: Maintenance Records */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          {/* Add Form */}
          <form onSubmit={handleAddMaintenance} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Log Vehicle Service / Garage Inspection:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Vehicle License Plate</label>
                <select
                  value={vehiclePlate}
                  onChange={e => setVehiclePlate(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500 font-mono"
                >
                  {drivers.map(d => (
                    <option key={d.id} value={d.vehicle.licensePlate}>
                      {d.vehicle.licensePlate} ({d.vehicle.make} {d.vehicle.model})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Service Type</label>
                <select
                  value={serviceType}
                  onChange={e => setServiceType(e.target.value as any)}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
                >
                  <option value="routine">Routine 10k km Servicing</option>
                  <option value="oil_change">Synthetic Engine Oil & Filter</option>
                  <option value="tire_change">Tire Rotation & Alignment</option>
                  <option value="brake_service">Brake Pad Replacement</option>
                  <option value="battery_check">EV Battery Health Diagnostic</option>
                  <option value="accident_repair">Bodywork / Paint Repair</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Service Cost (INR)</label>
                <input
                  type="number"
                  value={serviceCost}
                  onChange={e => setServiceCost(Number(e.target.value))}
                  required
                  className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500 font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Authorized Garage / Vendor</label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={e => setVendorName(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Inspection Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Brake pad wear at 20%, replaced cabin filter"
                  value={serviceNotes}
                  onChange={e => setServiceNotes(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Log Maintenance Record & Issue Fitness Certificate</span>
            </button>

            {mSuccess && (
              <p className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> Service Record Logged Successfully!
              </p>
            )}
          </form>

          {/* Records List */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Recent Servicing Logs:
            </span>

            {maintenanceRecords.map(m => (
              <div
                key={m.id}
                className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-amber-400 text-xs">{m.vehiclePlate || m.licensePlate}</span>
                    <span className="text-xs font-bold text-white capitalize">{m.serviceType.replace('_', ' ')}</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded uppercase">
                      {m.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{m.notes || 'Routine maintenance and inspection.'}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Vendor: {m.vendorName || m.garageName} • Performed: {m.serviceDate || m.date}
                  </p>
                </div>

                <div className="text-right">
                  <div className="font-mono font-black text-amber-400 text-base">₹{m.cost}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Fuel & EV Charging Logs */}
      {activeTab === 'fuel' && (
        <div className="space-y-6">
          {/* Add Fuel Form */}
          <form onSubmit={handleAddFuel} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Log Fleet Refuel or EV Fast Charge:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Vehicle Plate</label>
                <select
                  value={fuelPlate}
                  onChange={e => setFuelPlate(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500 font-mono"
                >
                  {drivers.map(d => (
                    <option key={d.id} value={d.vehicle.licensePlate}>
                      {d.vehicle.licensePlate} ({d.vehicle.fuelType.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Energy Type</label>
                <select
                  value={fuelType}
                  onChange={e => setFuelType(e.target.value as any)}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
                >
                  <option value="cng">CNG (kg)</option>
                  <option value="electric">EV Fast Charge (kWh)</option>
                  <option value="petrol">Petrol (Liters)</option>
                  <option value="diesel">Diesel (Liters)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Quantity (L / kg / kWh)</label>
                <input
                  type="number"
                  step="0.1"
                  value={fuelQty}
                  onChange={e => setFuelQty(Number(e.target.value))}
                  required
                  className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Total Cost (INR)</label>
                <input
                  type="number"
                  value={fuelCost}
                  onChange={e => setFuelCost(Number(e.target.value))}
                  required
                  className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500 font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Station / Charger Station Name</label>
              <input
                type="text"
                value={fuelStation}
                onChange={e => setFuelStation(e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Log Refuel Transaction</span>
            </button>

            {fSuccess && (
              <p className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> Energy Entry Added!
              </p>
            )}
          </form>

          {/* Logs List */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Recent Energy Transactions:
            </span>

            {fuelLogs.map(f => (
              <div
                key={f.id}
                className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-cyan-400 text-xs">{f.vehiclePlate || f.licensePlate}</span>
                    <span className="text-xs font-bold text-white uppercase">{f.fuelType || f.energyType}</span>
                    <span className="text-[11px] text-slate-400">({f.litersOrKwh || f.quantityUnits} units)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{f.stationName}</p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Logged: {f.timestamp || f.date} • Odo: {(f.odometerAtRefuel || f.odometerKm || 0).toLocaleString()} km
                  </p>
                </div>

                <div className="text-right">
                  <div className="font-mono font-black text-white text-base">₹{f.cost}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
