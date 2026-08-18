import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Gift, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  Zap 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const UserWallet: React.FC = () => {
  const { walletBalance, walletTransactions, addFundsToWallet } = useApp();
  const [rechargeAmount, setRechargeAmount] = useState<number>(500);
  const [selectedMethod, setSelectedMethod] = useState<string>('UPI (Google Pay / PhonePe)');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleTopUp = () => {
    if (rechargeAmount <= 0) return;
    addFundsToWallet(rechargeAmount, selectedMethod);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-2xl space-y-6">
      
      {/* Wallet Card */}
      <div className="bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-6 rounded-3xl text-slate-950 shadow-xl shadow-amber-500/20 relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-black uppercase tracking-wider opacity-80">
              KK Smart Digital Wallet
            </span>
            <div className="font-heading font-black text-4xl mt-1 tracking-tight">
              ₹{walletBalance}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-950/20 backdrop-blur-md flex items-center justify-center font-black">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-950/20 flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-1">
            <Gift className="w-4 h-4" /> 5% Instant Cashback on every ride
          </span>
          <span className="bg-slate-950 text-amber-400 px-2.5 py-1 rounded-xl text-[10px] font-black">
            1-TAP AUTOPAY READY
          </span>
        </div>
      </div>

      {/* Quick Recharge Console */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
          Instant Wallet Top-Up:
        </span>

        {/* Quick Amount Pills */}
        <div className="grid grid-cols-4 gap-2">
          {[200, 500, 1000, 2000].map(amt => (
            <button
              key={amt}
              onClick={() => setRechargeAmount(amt)}
              className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                rechargeAmount === amt
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              +₹{amt}
            </button>
          ))}
        </div>

        {/* Payment Gateway Options */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Select Payment Source</label>
          <select
            value={selectedMethod}
            onChange={e => setSelectedMethod(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-amber-500"
          >
            <option value="UPI (Google Pay / PhonePe)">UPI (Google Pay / PhonePe / Paytm)</option>
            <option value="Net Banking (HDFC / ICICI / SBI)">Net Banking (HDFC / ICICI / SBI / Axis)</option>
            <option value="Credit / Debit Card">Credit / Debit Card (Visa / Mastercard / RuPay)</option>
          </select>
        </div>

        {selectedMethod === 'UPI (Google Pay / PhonePe)' && (
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 flex flex-col items-center justify-center gap-3 text-center animate-in fade-in duration-250">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Scan with Google Pay / UPI App</span>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=kk6308608-1@oksbi%26pn=Krishna%20Kumar%26cu=INR%26am=${rechargeAmount}`} 
              alt="UPI QR Code" 
              className="w-44 h-44 bg-white p-2 rounded-2xl shadow-md border border-slate-700"
            />
            <div>
              <p className="text-[11px] font-bold text-slate-100">UPI ID: kk6308608-1@oksbi</p>
              <p className="text-[10px] text-slate-400 font-mono">Payee Name: Krishna Kumar</p>
            </div>
          </div>
        )}

        <button
          onClick={handleTopUp}
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add ₹{rechargeAmount} to KK Wallet</span>
        </button>

        {isSuccess && (
          <p className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" /> Wallet Recharged Successfully!
          </p>
        )}
      </div>

      {/* Transaction Passbook */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
          Transaction Passbook Statement:
        </span>

        <div className="space-y-2.5">
          {walletTransactions.map(tx => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    tx.type === 'credit'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {tx.type === 'credit' ? (
                    <ArrowDownLeft className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{tx.description}</p>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(tx.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`font-mono font-black text-sm ${
                    tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-200'
                  }`}
                >
                  {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                </span>
                <div className="text-[10px] text-slate-500 uppercase">{tx.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
