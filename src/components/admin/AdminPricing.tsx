import React, { useState } from 'react';
import { 
  Zap, 
  Car, 
  Save, 
  Percent, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  RefreshCw 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VehicleCategory } from '../../types';

export const AdminPricing: React.FC = () => {
  const { pricingConfig, updatePricingConfig, updateCategoryPricing } = useApp();

  const [surgeMultiplier, setSurgeMultiplier] = useState(pricingConfig.surgeMultiplier);
  const [isSurgeActive, setIsSurgeActive] = useState(pricingConfig.isSurgeActive);
  const [gstRate, setGstRate] = useState(pricingConfig.gstTaxRate * 100);

  const categories: VehicleCategory[] = ['mini', 'sedan', 'electric', 'suv', 'luxury'];

  const handleSaveGlobal = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricingConfig({
      surgeMultiplier,
      isSurgeActive,
      gstTaxRate: gstRate / 100,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white font-heading">
              Dynamic Pricing & Surge Matrix Engine
            </h2>
            <p className="text-xs text-slate-400">
              Configure per-km tariffs, high-demand surge multipliers, and tax rates
            </p>
          </div>
        </div>
      </div>

      {/* Global Surge & Demand Multiplier Form */}
      <form onSubmit={handleSaveGlobal} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white font-heading">
              Live City Surge Control
            </h3>
            <p className="text-xs text-slate-400">
              Automatically multiplies all base fares across high-demand geofenced zones
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsSurgeActive(!isSurgeActive)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              isSurgeActive
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isSurgeActive ? 'SURGE ACTIVE' : 'SURGE OFF'}</span>
          </button>
        </div>

        {/* Surge Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <label className="font-bold text-slate-300">Surge Multiplier Factor</label>
            <span className="font-mono font-black text-amber-400 text-sm">
              {surgeMultiplier}x
            </span>
          </div>
          <input
            type="range"
            min="1.0"
            max="3.0"
            step="0.1"
            value={surgeMultiplier}
            onChange={(e) => setSurgeMultiplier(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>1.0x (Normal)</span>
            <span>1.5x (Rain/Traffic)</span>
            <span>2.0x (Rush Hour)</span>
            <span>3.0x (Extreme Peak)</span>
          </div>
        </div>

        {/* GST Rate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
              Statutory GST Tax Rate (%)
            </label>
            <input
              type="number"
              value={gstRate}
              onChange={(e) => setGstRate(parseFloat(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
              Platform Take-rate (%)
            </label>
            <input
              type="number"
              disabled
              value={pricingConfig.platformFeePercent}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-400 font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Apply Surge & Tax Settings</span>
          </button>
        </div>
      </form>

      {/* Per Category Tariff Configuration Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-white font-heading">
          Category-wise Fare Rules (Per KM & Min Rates)
        </h3>

        <div className="space-y-3">
          {categories.map((cat) => {
            const config = pricingConfig.categories[cat];

            return (
              <div
                key={cat}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={config.image}
                      alt={config.name}
                      className="w-12 h-9 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-100">{config.name}</p>
                      <p className="text-[11px] text-slate-400">{config.capacity} Passengers • {config.description.slice(0, 35)}...</p>
                    </div>
                  </div>
                  <span className="font-mono uppercase font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-amber-500/20">
                    {cat}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Base Fare</label>
                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white">
                      <span className="text-slate-500 mr-1">₹</span>
                      <input
                        type="number"
                        value={config.baseFare}
                        onChange={(e) => updateCategoryPricing(cat, { baseFare: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-transparent outline-none font-mono font-bold text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Per KM Rate</label>
                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white">
                      <span className="text-slate-500 mr-1">₹</span>
                      <input
                        type="number"
                        step="0.5"
                        value={config.perKmRate}
                        onChange={(e) => updateCategoryPricing(cat, { perKmRate: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-transparent outline-none font-mono font-bold text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Per Min Rate</label>
                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white">
                      <span className="text-slate-500 mr-1">₹</span>
                      <input
                        type="number"
                        step="0.1"
                        value={config.perMinRate}
                        onChange={(e) => updateCategoryPricing(cat, { perMinRate: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-transparent outline-none font-mono font-bold text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Min Fare</label>
                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white">
                      <span className="text-slate-500 mr-1">₹</span>
                      <input
                        type="number"
                        value={config.minFare}
                        onChange={(e) => updateCategoryPricing(cat, { minFare: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-transparent outline-none font-mono font-bold text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
