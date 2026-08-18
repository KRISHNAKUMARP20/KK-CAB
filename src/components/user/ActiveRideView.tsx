import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  ShieldAlert, 
  Clock, 
  Gauge, 
  Users, 
  KeyRound, 
  Share2, 
  X, 
  Send, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FareSplitMember } from '../../types';

export const ActiveRideView: React.FC = () => {
  const { 
    activeBooking, 
    cancelBooking, 
    completeRide, 
    etaMinutesRemaining, 
    currentSpeedKmh, 
    triggerEmergencySos,
    driverAcceptRide,
    drivers
  } = useApp();

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'driver'; text: string; time: string }>>([
    { sender: 'driver', text: "Hello! I am navigating towards your pickup location.", time: "2 min ago" }
  ]);

  // Fare Split Modal
  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [splitPhone, setSplitPhone] = useState('');
  const [splitName, setSplitName] = useState('');
  const [splitMembers, setSplitMembers] = useState<FareSplitMember[]>([]);

  if (!activeBooking) return null;

  const b = activeBooking;
  const d = b.driver;

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    const msg = { sender: 'user' as const, text: chatInput.trim(), time: 'Just now' };
    setChatMessages(prev => [...prev, msg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'driver', text: "Got it, reaching in 2 minutes!", time: 'Just now' }
      ]);
    }, 1200);
  };

  const handleAddSplitMember = () => {
    if (!splitPhone.trim() || !splitName.trim()) return;
    const count = splitMembers.length + 2; // +1 rider, +1 this friend
    const share = Math.round(b.fareBreakdown.totalFare / count);
    
    const newMember: FareSplitMember = {
      name: splitName,
      phone: splitPhone,
      shareAmount: share,
      status: 'pending',
    };

    setSplitMembers(prev => [...prev, newMember]);
    setSplitName('');
    setSplitPhone('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-2xl space-y-6">
      
      {/* 1. Status & 4-Digit Ride Start OTP Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <h3 className="font-heading font-black text-lg text-white capitalize">
              {b.status === 'searching' && 'Searching Nearest Driver...'}
              {b.status === 'accepted' && 'Driver is Arriving'}
              {b.status === 'driver_arrived' && 'Driver Arrived at Pickup'}
              {b.status === 'in_progress' && 'Trip In Progress'}
            </h3>
          </div>
          <p className="text-xs text-slate-450 mt-0.5">
            Booking ID: <span className="font-mono text-amber-400">{b.bookingCode}</span>
          </p>
        </div>

        {/* 4-Digit OTP Box */}
        <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/40 p-3 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-300">Ride Start OTP</span>
            <div className="font-mono font-black text-xl tracking-widest text-amber-400">
              {b.startOtp}
            </div>
          </div>
        </div>
      </div>

      {/* Driver Simulation Acceptance Panel */}
      {b.status === 'searching' && (
        <div className="bg-slate-950 p-5 rounded-2xl border-2 border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <p className="text-xs font-bold text-slate-200">
              Ride request sent to driver! Waiting for driver to accept...
            </p>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            You can switch to the Driver Portal to accept this request on the dashboard, or click the button below to simulate driver acceptance.
          </p>
          <button
            onClick={() => {
              const eligibleDriver = drivers.find(d => d.isOnline) || drivers[0];
              driverAcceptRide(b.id, eligibleDriver.id);
            }}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
          >
            Accept Ride as Driver (Simulation)
          </button>
        </div>
      )}

      {/* 2. Driver & Vehicle Info Card */}
      {d && (
        <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={d.avatar}
              alt={d.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-base text-white">{d.name}</span>
                <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                  {d.rating} ★ ({d.totalRides} trips)
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {d.vehicle.make} {d.vehicle.model} • <span className="text-slate-400">{d.vehicle.color}</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono font-black text-xs bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-amber-400">
                  {d.vehicle.licensePlate}
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3 h-3" /> Police Verified
                </span>
              </div>
            </div>
          </div>

          {/* Quick Communication Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`tel:${d.phone}`}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call</span>
            </a>

            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Chat</span>
            </button>
          </div>
        </div>
      )}

      {/* In-Ride Live Chat Drawer */}
      {chatOpen && (
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
            <span>Direct Message with Driver</span>
            <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-2 text-xs">
            {chatMessages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-2.5 rounded-xl max-w-[80%] ${
                    m.sender === 'user' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-500 mt-0.5">{m.time}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendChatMessage()}
              placeholder="e.g. I am standing near Gate 2..."
              className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleSendChatMessage}
              className="p-2 bg-amber-500 text-slate-950 rounded-xl"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. In-Trip Telemetry (Speedometer & ETA) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Estimated Arrival</span>
          </div>
          <div className="font-heading font-black text-2xl text-white">
            {etaMinutesRemaining} <span className="text-xs font-normal text-slate-400">mins</span>
          </div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs mb-1">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span>Live Speed</span>
          </div>
          <div className="font-heading font-black text-2xl text-white">
            {currentSpeedKmh} <span className="text-xs font-normal text-slate-400">km/h</span>
          </div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center col-span-2 sm:col-span-1">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs mb-1">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Fare</span>
          </div>
          <div className="font-heading font-black text-2xl text-amber-400">
            ₹{b.fareBreakdown.totalFare}
          </div>
        </div>
      </div>

      {/* 4. Split Fare with Friends Trigger */}
      <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-cyan-400" />
          <div>
            <span className="text-xs font-bold text-white">Split Fare with Co-Passengers</span>
            <p className="text-[10px] text-slate-400">Share UPI payment link with friends</p>
          </div>
        </div>

        <button
          onClick={() => setSplitModalOpen(true)}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold rounded-xl transition"
        >
          Split Fare
        </button>
      </div>

      {/* Split Fare Drawer Modal */}
      {splitModalOpen && (
        <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
            <span>Co-Passenger Fare Split Link</span>
            <button onClick={() => setSplitModalOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Friend's Name"
              value={splitName}
              onChange={e => setSplitName(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs p-2 rounded-xl focus:outline-none"
            />
            <input
              type="tel"
              placeholder="Phone / UPI Mobile (+91)"
              value={splitPhone}
              onChange={e => setSplitPhone(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs p-2 rounded-xl focus:outline-none"
            />
          </div>

          <button
            onClick={handleAddSplitMember}
            className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl"
          >
            Add Co-Passenger & Generate UPI Link
          </button>

          {splitMembers.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              {splitMembers.map((sm, i) => (
                <div key={i} className="flex justify-between items-center text-xs bg-slate-900 p-2 rounded-lg">
                  <span>{sm.name} ({sm.phone})</span>
                  <span className="font-mono text-cyan-400 font-bold">₹{sm.shareAmount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Safety Panic & Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={triggerEmergencySos}
          className="px-4 py-3 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition"
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Emergency SOS</span>
        </button>

        {b.status !== 'in_progress' ? (
          <button
            onClick={() => cancelBooking(b.id)}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-300 rounded-2xl text-xs font-bold transition"
          >
            Cancel Trip
          </button>
        ) : (
          <button
            onClick={() => completeRide(b.id)}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl text-xs font-black transition"
          >
            End Trip & Pay
          </button>
        )}
      </div>

    </div>
  );
};
