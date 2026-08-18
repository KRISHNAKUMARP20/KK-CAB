
import React, { useState } from 'react';
import { 
  Star, 
  CheckCircle2, 
  FileText, 
  Heart, 
  Smile, 
  Sparkles, 
  Share2, 
  X,
  CreditCard,
  Wallet,
  QrCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RideSummaryModal: React.FC = () => {
  const { 
    activeBooking, 
    rateAndReviewRide, 
    setActiveBooking, 
    setInvoiceBooking, 
    setShowInvoiceModal,
    settleBookingPayment,
    walletBalance
  } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [selectedTip, setSelectedTip] = useState<number>(30);
  const [reviewText, setReviewText] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [payMethod, setPayMethod] = useState<'wallet' | 'upi'>('upi');

  if (!activeBooking || activeBooking.status !== 'completed') return null;

  const b = activeBooking;
  const fb = b.fareBreakdown;
  const totalAmount = fb.totalFare;

  const handlePayRide = () => {
    settleBookingPayment(b.id, payMethod);
  };

  const handleSubmitFeedback = () => {
    rateAndReviewRide(b.id, rating, reviewText, selectedTip);
    setSubmitted(true);
  };

  const handleOpenInvoice = () => {
    setInvoiceBooking(b);
    setShowInvoiceModal(true);
  };

  const handleDone = () => {
    setActiveBooking(null);
  };

  const isPaid = b.paymentStatus === 'paid';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-slate-100 animate-in zoom-in-95 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Celebration Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="font-heading font-black text-2xl text-white">Trip Completed!</h2>
          <p className="text-xs text-slate-400">
            {b.pickup.name} ➔ {b.destination.name}
          </p>
        </div>

        {/* 1. PAYMENT FLOW (If pending) */}
        {!isPaid ? (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Outstanding Fare</span>
              <div className="font-heading font-black text-3xl text-cyan-400">
                ₹{totalAmount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Pay to this account QR code only to settle trip dues.</p>
            </div>

            {/* UPI QR Display (Pay to this QR code only) */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-805 flex flex-col items-center justify-center gap-4 text-center">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Scan QR code to pay</span>
              
              <div className="bg-white p-2 rounded-2xl shadow-xl shadow-cyan-500/5 relative border border-slate-850">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=kk6308608-1@oksbi%26pn=Krishna%20Kumar%26cu=INR%26am=${totalAmount}`} 
                  alt="UPI QR Code" 
                  className="w-44 h-44 bg-white rounded-xl object-contain"
                />
              </div>

              <div>
                <p className="text-xs font-black text-slate-200">UPI ID: <span className="font-mono text-cyan-400 select-all">kk6308608-1@oksbi</span></p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Account Payee: Krishna Kumar</p>
              </div>
            </div>

            <button
              onClick={handlePayRide}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 via-cyan-400 to-teal-300 hover:from-cyan-450 hover:to-teal-200 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-cyan-500/25 transition active:scale-95"
            >
              Confirm Payment Complete
            </button>
          </div>
        ) : (
          /* 2. FEEDBACK FLOW (After payment) */
          <div className="space-y-5 animate-in fade-in duration-200">
            
            {/* Payment Success Badge */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl flex items-center justify-between text-xs text-emerald-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold">Fare Payment Settled</span>
              </div>
              <button
                onClick={handleOpenInvoice}
                className="text-cyan-450 hover:underline font-bold text-[11px]"
              >
                View Invoice
              </button>
            </div>

            {!submitted ? (
              <div className="space-y-4">
                
                {/* 5-Star Rating */}
                <div className="text-center space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    Rate Driver {b.driver?.name}
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1.5 transition transform hover:scale-125"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating
                              ? 'text-cyan-450 fill-cyan-400'
                              : 'text-slate-700 hover:text-cyan-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tip Selection */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">
                    Add Driver Tip:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 20, 30, 50].map(tip => (
                      <button
                        key={tip}
                        onClick={() => setSelectedTip(tip)}
                        className={`py-2 rounded-xl text-xs font-bold border transition ${
                          selectedTip === tip
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {tip === 0 ? 'No Tip' : `₹${tip}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review feedback input */}
                <input
                  type="text"
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  placeholder="Leave a comment (e.g. Smooth driving)..."
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-cyan-500"
                />

                {/* Submit button */}
                <button
                  onClick={handleSubmitFeedback}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-cyan-400 to-teal-300 hover:from-cyan-450 hover:to-teal-200 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-cyan-500/25 transition"
                >
                  Submit Feedback & Rating
                </button>

              </div>
            ) : (
              <div className="text-center space-y-4 pt-2">
                <p className="text-xs text-emerald-400 font-bold">
                  Thank you! Your feedback helps keep our drivers safe and exceptional.
                </p>
                <button
                  onClick={handleDone}
                  className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition"
                >
                  Back to Home
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
