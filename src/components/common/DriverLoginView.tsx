import React, { useState } from 'react';
import { 
  Car, 
  User, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  AlertCircle,
  Phone,
  CheckCircle2,
  ChevronLeft,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VehicleCategory } from '../../types';
import { KkLogo } from './KkLogo';

interface DriverLoginViewProps {
  onBack: () => void;
}

export const DriverLoginView: React.FC<DriverLoginViewProps> = ({ onBack }) => {
  const { login, register } = useApp();
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Vehicle details
  const [vehicleMake, setVehicleMake] = useState('Tata');
  const [vehicleModel, setVehicleModel] = useState('Nexon EV');
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleCategory, setVehicleCategory] = useState<VehicleCategory>('electric');

  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await login(email, password, 'driver');
      if (!response.success) {
        setError(response.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name || !phone || !licensePlate) {
      setError('Please fill in all required registration fields.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await register(name, email, phone, password, 'driver', {
        vehicleMake,
        vehicleModel,
        licensePlate,
        category: vehicleCategory
      });

      if (response.success) {
        setSuccessMsg('Captain onboarding successful! Authenticating dashboard...');
        setTimeout(() => {
          login(email, password, 'driver');
        }, 1500);
      } else {
        setError(response.error || 'Onboarding registration failed.');
      }
    } catch (err) {
      setError('Server onboarding failure. Check connection settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('driver@kkcab.com');
    setPassword('password');
    setError(null);
    setIsLoading(true);

    try {
      const response = await login('driver@kkcab.com', 'password', 'driver');
      if (!response.success) {
        setError(response.error || 'Authentication failed.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError(null);
    setSuccessMsg(null);
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setLicensePlate('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-y-auto py-12 selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Decorative Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none"></div>

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
          
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>

          <h2 className="text-lg font-bold font-heading text-slate-100 text-center mb-6">
            {isRegistering ? 'Captain Onboarding Registration' : 'Captain Sign In'}
          </h2>

          <form onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit} className="space-y-5">
            
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="space-y-4">
              
              {/* Registration specific fields */}
              {isRegistering && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono pl-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Vijay Kumar"
                        className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition placeholder-slate-600"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono pl-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 99999 88888"
                        className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition placeholder-slate-600"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono pl-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isRegistering ? 'captain@domain.com' : 'driver@kkcab.com'}
                    className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition placeholder-slate-600"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Security Password
                  </label>
                  {!isRegistering && (
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email || 'driver@kkcab.com');
                        setForgotSent(false);
                        setShowForgotModal(true);
                      }}
                      className="text-[10px] text-emerald-400/80 hover:text-emerald-300 font-medium transition cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
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
                    className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 pl-10 pr-10 py-3 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition placeholder-slate-600"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Vehicle specific fields on registration */}
              {isRegistering && (
                <div className="space-y-4 pt-2 border-t border-slate-800/40">
                  <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-emerald-400 pl-1">
                    Onboarded Vehicle Details
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Make
                      </label>
                      <select
                        value={vehicleMake}
                        onChange={(e) => setVehicleMake(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 text-slate-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition cursor-pointer"
                      >
                        <option value="Tata">Tata Motors</option>
                        <option value="Mahindra">Mahindra</option>
                        <option value="Hyundai">Hyundai</option>
                        <option value="BYD">BYD EV</option>
                        <option value="Maruti Suzuki">Maruti Suzuki</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Model
                      </label>
                      <input
                        type="text"
                        value={vehicleModel}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        placeholder="Nexon EV"
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition placeholder-slate-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                        License Plate
                      </label>
                      <input
                        type="text"
                        value={licensePlate}
                        onChange={(e) => setLicensePlate(e.target.value)}
                        placeholder="DL-2C-AB-9988"
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition placeholder-slate-650 font-mono uppercase"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Category
                      </label>
                      <select
                        value={vehicleCategory}
                        onChange={(e) => setVehicleCategory(e.target.value as VehicleCategory)}
                        className="w-full bg-slate-950 border border-slate-850 text-slate-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition cursor-pointer"
                      >
                        <option value="electric">⚡ Electric EV</option>
                        <option value="mini">🚗 Mini (Hatchback)</option>
                        <option value="sedan">🚘 Sedan (Comfort)</option>
                        <option value="suv">🚙 SUV (Spacious)</option>
                        <option value="luxury">✨ Luxury Partner</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Remember active session */}
            {!isRegistering && (
              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
                  />
                  <span className="text-xs text-slate-400">Keep session active</span>
                </label>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-950/40 px-2.5 py-1 rounded-md border border-slate-800/40">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Secure Portal</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <>
                  <span>{isRegistering ? 'Onboard & Connect' : 'Launch Captain Cockpit'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

          </form>

          {/* Toggle link */}
          <div className="text-center pt-5 border-t border-slate-800/40 mt-5">
            <button
              onClick={toggleMode}
              className="text-xs text-slate-400 hover:text-emerald-450 transition font-medium cursor-pointer"
            >
              {isRegistering 
                ? 'Already have an account? Sign In here' 
                : "Want to join the fleet? Onboard Driver Partner Account"
              }
            </button>
          </div>

        </div>

        {/* Demo login shortcuts */}
        {!isRegistering && (
          <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-[10px] font-bold text-slate-200">Sandbox Captain Sandbox</p>
                <p className="text-[8px] text-slate-500 font-mono">driver@kkcab.com • password</p>
              </div>
            </div>
            <button
              onClick={handleQuickDemoLogin}
              disabled={isLoading}
              className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-xl text-[10px] font-bold text-slate-300 hover:text-emerald-400 transition cursor-pointer"
            >
              One-Click Demo Entry
            </button>
          </div>
        )}

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-55 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-slate-100 animate-in zoom-in-95 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-heading font-black text-sm text-white">Reset Captain Password</h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-850 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSent ? (
              <div className="space-y-4 text-center py-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                <p className="text-xs text-slate-300">
                  Password reset link and instructions have been successfully sent to <strong className="text-emerald-450">{forgotEmail}</strong>.
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
                  Enter your registered captain email address below. We'll send you a secure link to reset your driver partner credentials.
                </p>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono pl-1">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="driver@kkcab.com"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition placeholder-slate-650"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (forgotEmail.trim()) {
                      setForgotSent(true);
                    }
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 via-emerald-450 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer"
                >
                  Send Reset Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
