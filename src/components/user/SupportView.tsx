import React, { useState } from 'react';
import { 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  PhoneCall, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportTicket } from '../../types';

export const SupportView: React.FC = () => {
  const { supportTickets, createSupportTicket, currentUser } = useApp();

  const [category, setCategory] = useState<SupportTicket['category']>('fare_dispute');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    createSupportTicket(category, subject, description);
    setSubmitted(true);
    setSubject('');
    setDescription('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-black text-xl text-white">24x7 Passenger Safety & Grievance Desk</h2>
            <p className="text-xs text-slate-400">Direct escalation desk for fare disputes, safety reviews, and refund claims.</p>
          </div>
        </div>

        <a
          href="tel:18005559988"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold border border-slate-700 transition"
        >
          <PhoneCall className="w-4 h-4 text-amber-400" />
          <span>Call 1800-KK-CAB (Toll Free)</span>
        </a>
      </div>

      {/* Ticket Filing Form */}
      <form onSubmit={handleSubmit} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
          Open Support Ticket:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Issue Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
            >
              <option value="fare_dispute">Fare Dispute / Toll Overcharge</option>
              <option value="driver_behavior">Driver Conduct / Cleanliness</option>
              <option value="lost_item">Lost Belongings Inquiry</option>
              <option value="safety">Safety & Driving Compliance</option>
              <option value="app_issue">App / Payment Error</option>
              <option value="other">Other Inquiry</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Subject Title</label>
            <input
              type="text"
              placeholder="Brief summary of grievance"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
              className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase">Detailed Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Please provide details including location, time, or transaction ID..."
            required
            className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
          <span>Submit Grievance Ticket</span>
        </button>

        {submitted && (
          <p className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" /> Ticket registered! Assigned support agent will resolve within 15 minutes.
          </p>
        )}
      </form>

      {/* Tickets List */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
          Your Active & Past Tickets:
        </span>

        <div className="space-y-3">
          {supportTickets.map(t => (
            <div
              key={t.id}
              className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 text-xs">{t.ticketNumber}</span>
                    <span className="text-xs font-bold text-white">{t.subject}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{t.description}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    t.status === 'resolved'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {t.status}
                </span>
              </div>

              {t.resolution && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl text-[11px] text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-400" />
                  <div>
                    <span className="font-bold">Resolution Note: </span>
                    {t.resolution}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
