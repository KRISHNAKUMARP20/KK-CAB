import React from 'react';
import { 
  Award, 
  Trophy, 
  CheckCircle2, 
  Clock, 
  Zap, 
  TrendingUp, 
  Star, 
  Gift 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DriverIncentives: React.FC = () => {
  const { driverIncentives, claimIncentive, drivers } = useApp();

  const sortedDrivers = [...drivers].sort((a, b) => b.rating - a.rating);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading font-black text-xl text-white">Captain Rewards & Leaderboard</h2>
          <p className="text-xs text-slate-400">Unlock weekly rush bonuses, zero cancellation rewards, and leaderboard prizes.</p>
        </div>

        <div className="text-[11px] bg-amber-500/20 text-amber-300 font-bold px-3 py-1 rounded-xl border border-amber-500/30 flex items-center gap-1">
          <Trophy className="w-3.5 h-3.5 text-amber-400" /> Season 12 Active
        </div>
      </div>

      {/* Active Milestones List */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
          Your Active Milestone Challenges:
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {driverIncentives.map(inc => {
            const isCompleted = inc.completedTrips >= inc.targetTrips;
            const pct = Math.min(100, Math.round((inc.completedTrips / inc.targetTrips) * 100));

            return (
              <div
                key={inc.id}
                className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-heading font-black text-sm text-white">{inc.title}</span>
                    <span className="font-mono font-black text-base text-emerald-400">
                      +₹{inc.rewardAmount}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1">{inc.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Progress: {inc.completedTrips} / {inc.targetTrips} rides</span>
                    <span>{pct}%</span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCompleted ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Valid: {inc.validUntil}
                    </span>

                    {inc.isClaimed ? (
                      <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Claimed
                      </span>
                    ) : isCompleted ? (
                      <button
                        onClick={() => claimIncentive(inc.id)}
                        className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow"
                      >
                        Claim ₹{inc.rewardAmount}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 font-bold">
                        {inc.targetTrips - inc.completedTrips} more to unlock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NCR Captain Leaderboard */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
          NCR Top Captains Leaderboard:
        </span>

        <div className="space-y-2.5">
          {sortedDrivers.map((drv, rank) => (
            <div
              key={drv.id}
              className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800/80"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                    rank === 0
                      ? 'bg-amber-400 text-slate-950'
                      : rank === 1
                      ? 'bg-slate-300 text-slate-950'
                      : rank === 2
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  #{rank + 1}
                </div>

                <img
                  src={drv.avatar}
                  alt={drv.name}
                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700"
                />

                <div>
                  <span className="font-bold text-xs text-white">{drv.name}</span>
                  <p className="text-[10px] text-slate-400">{drv.vehicle.model}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-amber-400 text-xs">{drv.rating} ★</div>
                <span className="text-[10px] text-slate-500 font-mono">{drv.totalRides} trips</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
