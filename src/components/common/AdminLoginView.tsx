import React, { useState } from 'react';
import { 
  Car, 
  Layers, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  AlertCircle,
  ChevronLeft,
  CheckCircle2,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KkLogo } from './KkLogo';

interface AdminLoginViewProps {
  onBack: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onBack }) => {
  const { login } = useApp();
  
  // Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await login(email, password, 'admin');
      if (!response.success) {
        setError(response.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('admin@kkcab.com');
    setPassword('password');
    setError(null);
    setIsLoading(true);

    try {
      const response = await login('admin@kkcab.com', 'password', 'admin');
      if (!response.success) {
        setError(response.error || 'Authentication failed.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-y-auto py-12 selection:bg-amber-500 selection:text-slate-950">
      
      {/* Decorative Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-rose-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-rose-500/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10 space-y-6">
        
        {/* Back navigation link */}
        <button 
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Portals</span>
        </button>

        {/* Brand identity header */}
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <KkLogo size="md" showText={true} className="flex-col text-center" />
        </div>

        {/* Form Card */}
        <div className="backdrop-blur-xl bg-slate-900/40 border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>

          <h2 className="text-lg font-bold font-heading text-slate-100 text-center mb-4">
            Operations Sign In
          </h2>
          
          <p className="text-[10px] text-slate-500 text-center mb-6 max-w-xs mx-auto">
            Authorized personnel only. Public registration is locked for this workspace environment.
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono pl-1">
                  Ops Email ID
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@kkcab.com"
                    className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-rose-500 transition placeholder-slate-650"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    System Access Key
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email || 'krishna');
                      setForgotSent(false);
                      setShowForgotModal(true);
                    }}
                    className="text-[10px] text-rose-400 hover:text-rose-350 font-medium transition cursor-pointer"
                  >
                    Forgot Access Key?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 pl-10 pr-10 py-3 rounded-xl text-sm focus:outline-none focus:border-rose-500 transition placeholder-slate-650"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-350 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember active session */}
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-rose-500 focus:ring-rose-500 focus:ring-offset-slate-900"
                />
                <span className="text-xs text-slate-400">Keep session active</span>
              </label>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-950/40 px-2.5 py-1 rounded-md border border-slate-800/40">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                <span>Encrypted Portal</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-rose-500 to-red-400 hover:from-rose-600 hover:to-red-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm tracking-wide shadow-lg shadow-rose-500/10 flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <>
                  <span>Launch Operations Control</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

          </form>

        </div>

        {/* Demo login shortcuts */}
        <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />
            <div>
              <p className="text-[10px] font-bold text-slate-200">Sandbox Admin Sandbox</p>
              <p className="text-[8px] text-slate-500 font-mono">admin@kkcab.com • password</p>
            </div>
          </div>
          <button
            onClick={handleQuickDemoLogin}
            disabled={isLoading}
            className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/40 rounded-xl text-[10px] font-bold text-slate-300 hover:text-rose-400 transition cursor-pointer"
          >
            One-Click Demo Entry
          </button>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-55 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-slate-100 animate-in zoom-in-95 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-heading font-black text-sm text-white">Reset System Access Key</h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-850 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSent ? (
              <div className="space-y-4 text-center py-4">
                <CheckCircle2 className="w-10 h-10 text-rose-400 mx-auto animate-bounce" />
                <p className="text-xs text-slate-300">
                  Access key instructions have been successfully sent to system administrator account <strong className="text-rose-450">{forgotEmail}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  Enter your system administrator username or email. We'll dispatch a recovery verification key to your master account.
                </p>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono pl-1">
                    System Username / Email
                  </label>
                  <input
                    type="text"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="krishna"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-rose-500 transition placeholder-slate-650"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (forgotEmail.trim()) {
                      setForgotSent(true);
                    }
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-rose-550 to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer"
                >
                  Request Verification Key
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
