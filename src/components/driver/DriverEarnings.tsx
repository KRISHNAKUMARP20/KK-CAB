import React, { useState } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  ArrowDownToLine, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Building2, 
  Zap 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DriverEarnings: React.FC = () => {
  const { currentDriver, addFundsToWallet } = useApp();

  const [payoutAmount, setPayoutAmount] = useState(currentDriver.earningsToday || 1850);
  const [bankAccount, setBankAccount] = useState('HDFC Bank •••• 4910');
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  const handleWithdraw = () => {
    if (payoutAmount <= 0) return;
    setPayoutSuccess(true);
    setTimeout(() => setPayoutSuccess(false), 4000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading font-black text-xl text-white">Captain Earnings & Payouts</h2>
          <p className="text-xs text-slate-400">85% Revenue Share • Instant IMPS Bank Transfers.</p>
        </div>

        <div className="text-[11px] bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded-xl border border-emerald-500/30">
          ✓ Daily Auto-Settlement Active
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-bold">Today's Net Earnings</span>
          <div className="font-heading font-black text-3xl text-emerald-400 mt-1">
            ₹{currentDriver.earningsToday}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">From completed trip commissions</span>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-bold">This Week's Gross</span>
          <div className="font-heading font-black text-3xl text-amber-400 mt-1">
            ₹{currentDriver.earningsThisWeek}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Includes weekend surge bonuses</span>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-bold">Lifetime Total Earnings</span>
          <div className="font-heading font-black text-3xl text-cyan-400 mt-1">
            ₹{currentDriver.totalEarnings}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Over {currentDriver.totalRides} verified rides</span>
        </div>
      </div>

      {/* Instant Bank Payout Box */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
          Instant Payout to Bank (IMPS 24x7):
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Transfer Amount (INR)</label>
            <input
              type="number"
              value={payoutAmount}
              onChange={e => setPayoutAmount(Number(e.target.value))}
              className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500 font-mono font-bold"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Linked Bank Account</label>
            <select
              value={bankAccount}
              onChange={e => setBankAccount(e.target.value)}
              className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
            >
              <option value="HDFC Bank •••• 4910">HDFC Bank (A/C: •••• 4910 | IFSC: HDFC0001201)</option>
              <option value="State Bank of India •••• 8821">State Bank of India (A/C: •••• 8821)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleWithdraw}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2"
        >
          <ArrowDownToLine className="w-4 h-4 stroke-[3]" />
          <span>Transfer ₹{payoutAmount} to {bankAccount}</span>
        </button>

        {payoutSuccess && (
          <p className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" /> IMPS Transfer Dispatched! Bank reference #IMPS20268819.
          </p>
        )}
      </div>

      {/* Fare Split Transparency Matrix */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
        <span className="text-xs font-bold text-slate-300">Revenue Split Model:</span>
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 pt-1">
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="font-bold text-emerald-400 text-base">85%</div>
            <p className="text-[11px] text-slate-400">Direct Captain Payout + 100% of Passenger Tips</p>
          </div>
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="font-bold text-amber-400 text-base">15%</div>
            <p className="text-[11px] text-slate-400">Platform Maintenance, GPS Routing & 24x7 Safety Desk</p>
          </div>
        </div>
      </div>

    </div>
  );
};
