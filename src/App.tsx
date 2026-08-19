import React, { useState, useEffect, useRef } from 'react';
import { 
  Car, 
  MapPin, 
  Clock, 
  CreditCard, 
  ShieldAlert, 
  Building2, 
  HelpCircle, 
  User, 
  Award, 
  FileText, 
  Wrench, 
  Zap, 
  Users, 
  Layers, 
  BarChart3, 
  Fuel, 
  History, 
  Search,
  Bell,
  Compass,
  Navigation,
  Sparkles,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { LeafletMap } from './components/common/LeafletMap';
import { SosModal } from './components/common/SosModal';
import { InvoiceModal } from './components/common/InvoiceModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { SmartAiAssistant } from './components/common/SmartAiAssistant';
import { PortalSelectorView } from './components/common/PortalSelectorView';
import { PwaInstallPrompt } from './components/common/PwaInstallPrompt';

// Passenger Components
import { BookCabView } from './components/user/BookCabView';
import { ActiveRideView } from './components/user/ActiveRideView';
import { UserRideHistory } from './components/user/UserRideHistory';
import { UserWallet } from './components/user/UserWallet';
import { UserProfile } from './components/user/UserProfile';
import { CorporatePortal } from './components/user/CorporatePortal';
import { LostFoundView } from './components/user/LostFoundView';
import { SupportView } from './components/user/SupportView';
import { RideSummaryModal } from './components/user/RideSummaryModal';

// Driver Components
import { DriverDashboard } from './components/driver/DriverDashboard';
import { DriverActiveRide } from './components/driver/DriverActiveRide';
import { DriverEarnings } from './components/driver/DriverEarnings';
import { DriverVehicleDocs } from './components/driver/DriverVehicleDocs';
import { DriverIncentives } from './components/driver/DriverIncentives';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminFleetOps } from './components/admin/AdminFleetOps';
import { AdminGeofences } from './components/admin/AdminGeofences';
import { AdminPricing } from './components/admin/AdminPricing';
import { AdminDrivers } from './components/admin/AdminDrivers';
import { AdminVehicles } from './components/admin/AdminVehicles';
import { AdminBookings } from './components/admin/AdminBookings';
import { AdminComplaints } from './components/admin/AdminComplaints';
import { AdminAnalytics } from './components/admin/AdminAnalytics';

function MainApp() {
  const { 
    currentRole, 
    setCurrentRole, 
    activeBooking, 
    drivers,
    simulatedCarPosition,
    geofenceZones,
    pricingConfig,
    isAuthenticated,
    pickup,
    destination,
    stops,
    bookingRouteCoordinates
  } = useApp();

  // User Tabs: 'book' | 'active' | 'rides' | 'wallet' | 'corporate' | 'lostfound' | 'support' | 'profile'
  const [userTab, setUserTab] = useState<string>('book');
  
  // Driver Tabs: 'dashboard' | 'active' | 'earnings' | 'docs' | 'incentives'
  const [driverTab, setDriverTab] = useState<string>('dashboard');

  // Auto-switch tabs to active when a booking starts
  const prevActiveBookingRef = useRef(activeBooking);
  useEffect(() => {
    if (activeBooking && !prevActiveBookingRef.current) {
      setUserTab('active');
      setDriverTab('active');
    }
    prevActiveBookingRef.current = activeBooking;
  }, [activeBooking]);

  // Admin Tabs: 'dashboard' | 'geofences' | 'fleetops' | 'pricing' | 'drivers' | 'vehicles' | 'bookings' | 'complaints' | 'analytics'
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  // Notification Drawer
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Lost & Found navigation prefill state
  const [lostFoundPrefill, setLostFoundPrefill] = useState<{ bookingCode: string; driverName: string }>({
    bookingCode: '',
    driverName: '',
  });

  const handleRebook = () => {
    setUserTab('book');
  };

  const handleReportLostItem = (bookingCode: string, driverName: string) => {
    setLostFoundPrefill({ bookingCode, driverName });
    setUserTab('lostfound');
  };

  if (!isAuthenticated) {
    return <PortalSelectorView />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navigation */}
      <Navbar 
        onRoleSwitch={() => {}}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenWallet={() => setUserTab('wallet')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* ========================================================================= */}
        {/* PASSENGER VIEW                                                            */}
        {/* ========================================================================= */}
        {currentRole === 'user' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Passenger Secondary Tab Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <button
                onClick={() => setUserTab('book')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  userTab === 'book'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Book Cab</span>
              </button>

              {activeBooking && (
                <button
                  onClick={() => setUserTab('active')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap relative ${
                    userTab === 'active'
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  <Navigation className="w-4 h-4" />
                  <span>Live Trip ({activeBooking.status.replace('_', ' ')})</span>
                </button>
              )}

              <button
                onClick={() => setUserTab('rides')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  userTab === 'rides'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <History className="w-4 h-4" />
                <span>My Rides</span>
              </button>

              <button
                onClick={() => setUserTab('wallet')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  userTab === 'wallet'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>KK Wallet</span>
              </button>

              <button
                onClick={() => setUserTab('corporate')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  userTab === 'corporate'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Corporate Commute</span>
              </button>

              <button
                onClick={() => setUserTab('lostfound')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  userTab === 'lostfound'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Lost & Found</span>
              </button>

              <button
                onClick={() => setUserTab('support')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  userTab === 'support'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>24x7 Grievance</span>
              </button>

              <button
                onClick={() => setUserTab('profile')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  userTab === 'profile'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile & SOS</span>
              </button>
            </div>

            {/* Passenger Tab Contents */}
            <div className="space-y-6">
              {userTab === 'book' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-7">
                    <BookCabView />
                  </div>
                  <div className="lg:col-span-5 sticky top-20 h-[520px] lg:h-[620px]">
                    <LeafletMap 
                      pickup={pickup}
                      destination={destination}
                      stops={stops}
                      routeCoordinates={bookingRouteCoordinates}
                      drivers={drivers}
                      geofences={geofenceZones}
                      rideStatus="idle"
                    />
                  </div>
                </div>
              )}

              {userTab === 'active' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-7">
                    <ActiveRideView />
                  </div>
                  <div className="lg:col-span-5 sticky top-20 h-[520px] lg:h-[620px]">
                    <LeafletMap 
                      pickup={activeBooking?.pickup}
                      destination={activeBooking?.destination}
                      stops={activeBooking?.stops}
                      activeDriverPosition={simulatedCarPosition}
                      routeCoordinates={activeBooking?.routeCoordinates}
                      rideStatus={activeBooking?.status}
                      geofences={geofenceZones}
                    />
                  </div>
                </div>
              )}

              {userTab === 'rides' && (
                <UserRideHistory 
                  onRebook={handleRebook}
                  onReportLostItem={handleReportLostItem}
                />
              )}

              {userTab === 'wallet' && <UserWallet />}
              {userTab === 'corporate' && <CorporatePortal />}
              {userTab === 'lostfound' && (
                <LostFoundView 
                  initialBookingCode={lostFoundPrefill.bookingCode}
                  initialDriverName={lostFoundPrefill.driverName}
                />
              )}
              {userTab === 'support' && <SupportView />}
              {userTab === 'profile' && <UserProfile />}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* DRIVER PARTNER VIEW                                                       */}
        {/* ========================================================================= */}
        {currentRole === 'driver' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Driver Secondary Tab Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <button
                onClick={() => setDriverTab('dashboard')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  driverTab === 'dashboard'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Driver Dashboard</span>
              </button>

              {activeBooking && (
                <button
                  onClick={() => setDriverTab('active')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap relative ${
                    driverTab === 'active'
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  <Navigation className="w-4 h-4" />
                  <span>Map Navigation</span>
                </button>
              )}

              <button
                onClick={() => setDriverTab('earnings')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  driverTab === 'earnings'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Earnings & Instant Payout</span>
              </button>

              <button
                onClick={() => setDriverTab('incentives')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  driverTab === 'incentives'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Rewards & Targets</span>
              </button>

              <button
                onClick={() => setDriverTab('docs')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  driverTab === 'docs'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Vehicle & Driver Documents</span>
              </button>
            </div>

            {/* Driver Tab Contents */}
            <div className="space-y-6">
              {driverTab === 'dashboard' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-7">
                    <DriverDashboard 
                      onOpenActiveRide={() => setDriverTab('active')}
                      onOpenIncentives={() => setDriverTab('incentives')}
                    />
                  </div>
                  <div className="lg:col-span-5 sticky top-20 h-[520px] lg:h-[620px]">
                    <LeafletMap 
                      drivers={drivers}
                      geofences={geofenceZones}
                      rideStatus="idle"
                    />
                  </div>
                </div>
              )}

              {driverTab === 'active' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-7">
                    <DriverActiveRide 
                      onBackToDashboard={() => setDriverTab('dashboard')}
                    />
                  </div>
                  <div className="lg:col-span-5 sticky top-20 h-[520px] lg:h-[620px]">
                    <LeafletMap 
                      pickup={activeBooking?.pickup}
                      destination={activeBooking?.destination}
                      stops={activeBooking?.stops}
                      activeDriverPosition={simulatedCarPosition}
                      routeCoordinates={activeBooking?.routeCoordinates}
                      rideStatus={activeBooking?.status}
                      geofences={geofenceZones}
                    />
                  </div>
                </div>
              )}

              {driverTab === 'earnings' && <DriverEarnings />}
              {driverTab === 'incentives' && <DriverIncentives />}
              {driverTab === 'docs' && <DriverVehicleDocs />}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* FLEET OPERATIONS ADMIN VIEW                                               */}
        {/* ========================================================================= */}
        {currentRole === 'admin' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Admin Navigation Tab Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <button
                onClick={() => setAdminTab('dashboard')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  adminTab === 'dashboard'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Command Dashboard</span>
              </button>

              <button
                onClick={() => setAdminTab('geofences')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  adminTab === 'geofences'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Geofences & Surge Polygons</span>
              </button>

              <button
                onClick={() => setAdminTab('fleetops')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  adminTab === 'fleetops'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Maintenance & Energy Logs</span>
              </button>

              <button
                onClick={() => setAdminTab('pricing')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  adminTab === 'pricing'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Tariff Matrix & Commissions</span>
              </button>

              <button
                onClick={() => setAdminTab('drivers')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  adminTab === 'drivers'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Drivers & KYC</span>
              </button>

              <button
                onClick={() => setAdminTab('vehicles')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  adminTab === 'vehicles'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Fleet Inventory & EVs</span>
              </button>

              <button
                onClick={() => setAdminTab('bookings')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  adminTab === 'bookings'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Dispatch Logs & Invoices</span>
              </button>

              <button
                onClick={() => setAdminTab('complaints')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  adminTab === 'complaints'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Grievance & Refund Desk</span>
              </button>

              <button
                onClick={() => setAdminTab('analytics')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  adminTab === 'analytics'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics & Demand Heatmaps</span>
              </button>
            </div>

            {/* Admin Tab Content */}
            <div className="space-y-6">
              {adminTab === 'dashboard' && (
                <AdminDashboard onNavigateTab={(tab) => setAdminTab(tab)} />
              )}
              {adminTab === 'geofences' && <AdminGeofences />}
              {adminTab === 'fleetops' && <AdminFleetOps />}
              {adminTab === 'pricing' && <AdminPricing />}
              {adminTab === 'drivers' && <AdminDrivers />}
              {adminTab === 'vehicles' && <AdminVehicles />}
              {adminTab === 'bookings' && <AdminBookings />}
              {adminTab === 'complaints' && <AdminComplaints />}
              {adminTab === 'analytics' && <AdminAnalytics />}
            </div>

          </div>
        )}

      </main>

      {/* Global Modals, Drawers & AI Assistant */}
      <SosModal />
      <InvoiceModal />
      <RideSummaryModal />
      <NotificationDrawer 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
      <SmartAiAssistant />
      <PwaInstallPrompt />

      {/* Sleek Footer */}
      <footer className="border-t border-slate-900/80 bg-slate-950/90 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-slate-200">KK SMART CAB</span>
            <span>•</span>
            <span>Zero Emissions EV & Intelligent Multi-Stop Dispatch</span>
          </div>
          <p className="font-mono text-[11px] text-slate-400">
            Certified ISO 9001 Fleet Operations • 24x7 Safety SOS Network
          </p>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
