import React, { useState } from 'react';
import { 
  Star, 
  CheckCircle2, 
  FileText, 
  Heart, 
  Smile, 
  Sparkles, 
  Share2, 
  X 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RideSummaryModal: React.FC = () => {
  const { 
    activeBooking, 
    rateAndReviewRide, 
    setActiveBooking, 
    setInvoiceBooking, 
    setShowInvoiceModal 
  } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [selectedTip, setSelectedTip] = useState<number>(30);
  const [reviewText, setReviewText] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!activeBooking || activeBooking.status !== 'completed') return null;

  const b = activeBooking;
  const fb = b.fareBreakdown;

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

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-slate-100 animate-in zoom-in-95 space-y-6">
        
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

        {/* Fare Summary Box */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Fare Paid</span>
            <div className="font-heading font-black text-2xl text-amber-400">
              ₹{fb.totalFare + selectedTip}
            </div>
            <span className="text-[10px] text-slate-400 font-mono capitalize">
              Via {b.paymentMethod.replace('_', ' ')}
            </span>
          </div>

          <button
            onClick={handleOpenInvoice}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 transition"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Tax Invoice</span>
          </button>
        </div>

        {!submitted ? (
          <div className="space-y-4">
            
            {/* 5-Star Rating */}
            <div className="text-center space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Rate Captain {b.driver?.name}
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
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-700 hover:text-amber-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Tip Selection */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Add Captain Gratuity / Tip:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[0, 20, 30, 50].map(tip => (
                  <button
                    key={tip}
                    onClick={() => setSelectedTip(tip)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      selectedTip === tip
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
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
              placeholder="Leave a comment (e.g. Great music & smooth driving)..."
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-amber-500"
            />

            {/* Submit button */}
            <button
              onClick={handleSubmitFeedback}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition"
            >
              Submit Feedback & Rating
            </button>

          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-xs text-emerald-400 font-bold">
              Thank you! Your feedback helps keep KK Smart Cab safe and exceptional.
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
    </div>
  );
};
