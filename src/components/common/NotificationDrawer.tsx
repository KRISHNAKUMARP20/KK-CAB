import React from 'react';
import { Bell, X, CheckCheck, Trash2, Car, ShieldAlert, CreditCard, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationItem } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useApp();

  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'ride': return <Car className="w-4 h-4 text-amber-400" />;
      case 'wallet': return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'safety': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'maintenance': return <Sparkles className="w-4 h-4 text-purple-400" />;
      default: return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-heading">Notifications</h3>
                <p className="text-[11px] text-slate-400">{notifications.length} total messages</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  title="Clear all"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg text-xs flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Clear</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500">
                <Bell className="w-10 h-10 stroke-1 mb-2 text-slate-600" />
                <p className="text-sm font-medium">No new notifications</p>
                <p className="text-xs text-slate-600 mt-0.5">You're all caught up with rides and alerts.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationAsRead(n.id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer relative overflow-hidden ${
                    n.read 
                      ? 'bg-slate-800/40 border-slate-800 text-slate-300' 
                      : 'bg-slate-800 border-amber-500/30 text-white shadow-lg shadow-black/20'
                  }`}
                >
                  {!n.read && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-700/60 shrink-0 mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-100">{n.title}</p>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-slate-500 mt-2 font-mono">
                        {n.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
