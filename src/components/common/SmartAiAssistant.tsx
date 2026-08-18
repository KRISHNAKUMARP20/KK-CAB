import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Car, 
  Zap, 
  HelpCircle, 
  MapPin,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  quickPrompts?: string[];
}

export const SmartAiAssistant: React.FC = () => {
  const { pricingConfig, geofenceZones } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm_1',
      sender: 'ai',
      text: "Hello! I'm your KK Smart Cab Dispatch & Travel AI. Ask me about fares, vehicle luggage sizes, EV range, outstation packages, or safety features.",
      timestamp: 'Just now',
      quickPrompts: [
        'Airport to Cyber Hub estimate',
        'We are 5 people with luggage, what cab?',
        'How do Hourly Rentals work?',
        'Delhi to Agra Outstation pricing',
      ],
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      let quickPrompts: string[] = [];
      const lower = text.toLowerCase();

      if (lower.includes('airport') && (lower.includes('cyber') || lower.includes('estimate') || lower.includes('fare'))) {
        reply = `For IGI Airport (T3) ➔ DLF Cyber City (~14.8 km):\n• KK Mini: ~₹230\n• KK Sedan: ~₹300 (Recommended for 2-3 bags)\n• KK Green EV: ~₹285 (Zero emissions)\n• KK SUV Prime: ~₹410 (6 passengers / 4 suitcases)\n\nNote: Current airport zone surge is ${pricingConfig.surgeMultiplier}x.`;
        quickPrompts = ['Book Sedan now', 'Book Green EV', 'Add intermediate stop'];
      } else if (lower.includes('5 people') || lower.includes('luggage') || lower.includes('group') || lower.includes('suv')) {
        reply = `For 5+ passengers and multiple large suitcases, **KK SUV Prime (Toyota Innova Crysta / Ertiga)** is the ideal choice. It offers 6 captain seats, expansive boot space with roof rack carrier option, and dual-zone air conditioning.`;
        quickPrompts = ['Check SUV fares', 'Hourly SUV rental'];
      } else if (lower.includes('rental') || lower.includes('hourly')) {
        reply = `KK Hourly Rentals allow you to keep the cab and captain for multiple stops without booking repeatedly:\n• **2 Hrs / 20 km**: Base ₹350 (Mini) | ₹500 (Sedan)\n• **4 Hrs / 40 km**: Base ₹630 (Mini) | ₹900 (Sedan)\n• **8 Hrs / 80 km**: Base ₹1,190 (Mini) | ₹1,700 (Sedan)\n• **12 Hrs / 120 km**: Full day city tour package.`;
        quickPrompts = ['Book 4hr Rental', 'Book 8hr Rental'];
      } else if (lower.includes('outstation') || lower.includes('agra') || lower.includes('jaipur')) {
        reply = `KK Outstation covers round-trips and one-way drops across North India:\n• **Delhi ➔ Agra (Taj Mahal)**: ~210 km (One-way ~₹3,150 Sedan | Round-trip ~₹5,800 with driver daily allowance + Yamuna Expressway toll).\n• **Delhi ➔ Jaipur (Pink City)**: ~270 km.\nAll outstation cabs are verified commercial tourist permit vehicles.`;
        quickPrompts = ['Outstation Agra booking', 'Check toll inclusions'];
      } else if (lower.includes('lost') || lower.includes('item') || lower.includes('phone') || lower.includes('wallet')) {
        reply = `Don't worry! KK Smart Cab has a dedicated **Lost & Found System**:\n1. Open your Ride History and tap 'Report Lost Item'\n2. Our safety desk immediately flags Captain & HQ\n3. You will receive live recovery status updates with door delivery.`;
        quickPrompts = ['Open Lost & Found', 'Contact 24x7 Safety'];
      } else if (lower.includes('corporate') || lower.includes('business') || lower.includes('gst')) {
        reply = `With **KK Corporate Commute**, employees can tag rides for automated corporate billing with monthly GST-compliant consolidated invoices (SAC Code 9964) directly billed to your company cost center.`;
        quickPrompts = ['View Corporate Profile', 'Corporate expense policy'];
      } else {
        reply = `I can help you dispatch the right cab, calculate transparent GST fares across 5 categories, configure multi-stop routes, or connect with 24x7 emergency safety. How can I assist your trip today?`;
        quickPrompts = ['Fare matrix', 'EV Green benefits', 'Airport pickup'];
      }

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickPrompts,
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-tr from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-full shadow-2xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all group"
      >
        <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="text-xs tracking-wide">Smart AI Help</span>
      </button>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[540px] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-black text-sm text-white">KK AI Dispatcher</h4>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Online • Fare & Route Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl whitespace-pre-line leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{m.timestamp}</span>

                {/* Quick Suggestion Chips */}
                {m.quickPrompts && m.quickPrompts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {m.quickPrompts.map((qp, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(qp)}
                        className="text-[10px] bg-slate-800 hover:bg-amber-500/20 hover:border-amber-500/40 text-amber-300 border border-slate-700 px-2.5 py-1 rounded-full transition flex items-center gap-1 text-left"
                      >
                        <span>{qp}</span>
                        <ChevronRight className="w-2.5 h-2.5 opacity-60" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-slate-400 bg-slate-800/60 px-3 py-2 rounded-2xl w-fit border border-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about fares, outstation, rentals..."
              className="flex-1 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputMessage.trim()}
              className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 rounded-xl transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
