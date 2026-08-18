import React, { useState } from 'react';
import { 
  Car, 
  FileText, 
  ShieldCheck, 
  Fuel, 
  BatteryCharging, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Upload, 
  Calendar 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DriverVehicleDocs: React.FC = () => {
  const { currentDriver } = useApp();
  const v = currentDriver.vehicle;
  const docs = currentDriver.documents;
  const isEv = v.fuelType === 'electric';

  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSimulateUpload = () => {
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading font-black text-xl text-white">Vehicle Telemetry & RTO KYC Documents</h2>
          <p className="text-xs text-slate-400">Manage vehicle fitness, insurance, and statutory transport documents.</p>
        </div>

        <div className="text-[11px] bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> RTO Commercial Permit Active
        </div>
      </div>

      {/* Vehicle Specs & Health Card */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Assigned Vehicle</span>
          <h3 className="font-heading font-black text-lg text-white mt-1">
            {v.make} {v.model} ({v.year})
          </h3>
          <p className="text-xs font-mono text-amber-400 mt-0.5">{v.licensePlate}</p>
          <p className="text-xs text-slate-400">{v.color} • {v.capacity} Passengers</p>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Telemetry & Odometer</span>
          <div className="font-heading font-black text-lg text-white mt-1">
            {v.odometerKm.toLocaleString()} <span className="text-xs font-normal text-slate-400">km</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold mt-1">
            {isEv ? <BatteryCharging className="w-4 h-4" /> : <Fuel className="w-4 h-4" />}
            <span>{v.batteryOrFuelLevel}% {isEv ? 'Battery SoC' : 'Fuel Level'}</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Maintenance & Fitness</span>
          <div className="text-xs text-slate-200 mt-1 space-y-0.5">
            <p>Last Service: <span className="font-mono text-slate-400">{v.lastServiceDate}</span></p>
            <p>Next Due: <span className="font-mono text-amber-400">{v.nextServiceDueKm.toLocaleString()} km</span></p>
            <p>Insurance Expiry: <span className="font-mono text-slate-400">{v.insuranceValidUntil}</span></p>
          </div>
        </div>
      </div>

      {/* RTO KYC Documents Checklist */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
            Statutory KYC Compliance Checklist:
          </span>
          <button
            onClick={handleSimulateUpload}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1 border border-slate-700"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Renewal Document</span>
          </button>
        </div>

        {uploadSuccess && (
          <p className="text-xs text-emerald-400 font-bold bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Document uploaded to AI Studio Audit queue for Ops approval.
          </p>
        )}

        <div className="space-y-2.5">
          {docs.map(doc => (
            <div
              key={doc.id}
              className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{doc.name}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        doc.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : doc.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400">
                    Doc #{doc.documentNumber} • Valid until {doc.expiryDate}
                  </p>
                </div>
              </div>

              <div className="text-xs font-mono text-slate-500">
                Uploaded: {doc.uploadedAt}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
