import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  User, 
  Driver, 
  Booking, 
  PricingConfig, 
  LocationPoint, 
  VehicleCategory, 
  RideStatus, 
  PaymentMethod, 
  BookingType, 
  RentalPackage, 
  OutstationTripType, 
  MaintenanceRecord, 
  FuelLog, 
  VehicleInspection, 
  GeofenceZone, 
  DriverIncentive, 
  LostItemCase, 
  SupportTicket, 
  WalletTransaction, 
  NotificationItem,
  FareBreakdown
} from '../types';
import { 
  INITIAL_DRIVERS, 
  INITIAL_USER, 
  INITIAL_PRICING_CONFIG, 
  INITIAL_BOOKINGS, 
  INITIAL_WALLET_TRANSACTIONS, 
  INITIAL_SUPPORT_TICKETS, 
  INITIAL_MAINTENANCE_RECORDS, 
  INITIAL_FUEL_LOGS, 
  INITIAL_INSPECTIONS, 
  INITIAL_GEOFENCES, 
  INITIAL_INCENTIVES, 
  INITIAL_LOST_ITEMS, 
  POPULAR_LOCATIONS 
} from '../data/mockData';
import { calculateRouteDistance, computeDetailedFare, generateInterpolatedPath } from '../services/fareService';

interface AppContextType {
  // Roles
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: 'user' | 'driver',
    extraData?: any
  ) => Promise<{ success: boolean; error?: string }>;

  // Passenger & Driver Entities
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  currentDriver: Driver;
  setCurrentDriver: React.Dispatch<React.SetStateAction<Driver>>;
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;

  // Pricing & Surge
  pricingConfig: PricingConfig;
  setPricingConfig: React.Dispatch<React.SetStateAction<PricingConfig>>;
  updatePricingConfig: (newConfig: Partial<PricingConfig>) => void;
  updateCategoryPricing: (cat: VehicleCategory, updates: any) => void;

  // Bookings & Dispatch
  bookings: Booking[];
  activeBooking: Booking | null;
  setActiveBooking: React.Dispatch<React.SetStateAction<Booking | null>>;
  createBooking: (
    pickup: LocationPoint,
    destination: LocationPoint,
    category: VehicleCategory,
    bookingType?: BookingType,
    stops?: LocationPoint[],
    options?: {
      scheduledTime?: string;
      rentalPackage?: RentalPackage;
      outstationType?: OutstationTripType;
      returnDate?: string;
      paymentMethod?: PaymentMethod;
      promoDiscount?: number;
      isCorporateExpense?: boolean;
      corporateExpenseTag?: string;
    }
  ) => Promise<Booking>;
  cancelBooking: (bookingId: string) => void;
  startRideWithOtp: (bookingId: string, otp: string) => { success: boolean; message: string };
  completeRide: (bookingId: string) => void;
  rateAndReviewRide: (bookingId: string, rating: number, review: string, tip?: number) => void;
  settleBookingPayment: (bookingId: string, method: PaymentMethod) => void;
  driverArriveAtPickup: (bookingId: string) => void;
  driverAcceptRide: (bookingId: string, driverId: string) => void;

  // Live GPS Simulation
  simulatedCarPosition: [number, number];
  etaMinutesRemaining: number;
  currentSpeedKmh: number;
  relocateDriversNear: (lat: number, lng: number) => void;

  // Fleet Maintenance, Fuel & Operations
  maintenanceRecords: MaintenanceRecord[];
  addMaintenanceRecord: (rec: Omit<MaintenanceRecord, 'id'>) => void;
  fuelLogs: FuelLog[];
  addFuelLog: (log: Omit<FuelLog, 'id'>) => void;
  inspections: VehicleInspection[];
  addInspection: (insp: Omit<VehicleInspection, 'id'>) => void;
  geofenceZones: GeofenceZone[];
  updateGeofenceSurge: (zoneId: string, surge: number) => void;
  addGeofenceZone: (zone: Omit<GeofenceZone, 'id'>) => void;
  toggleGeofenceActive: (zoneId: string) => void;
  removeGeofenceZone: (zoneId: string) => void;
  driverIncentives: DriverIncentive[];
  claimIncentive: (incId: string) => void;
  lostItemCases: LostItemCase[];
  reportLostItem: (caseData: Omit<LostItemCase, 'id' | 'caseNumber' | 'status' | 'reportedDate'>) => void;
  updateLostItemStatus: (caseId: string, status: LostItemCase['status']) => void;

  // Driver Partner Actions
  toggleDriverOnline: (driverId: string) => void;
  verifyDriverDoc: (driverId: string, docId: string, status: 'approved' | 'rejected', reason?: string) => void;
  verifyDriverStatus: (driverId: string, status: 'verified' | 'pending' | 'rejected') => void;

  // Wallet, Invoices & Disputes
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  addFundsToWallet: (amount: number, method: string) => void;
  supportTickets: SupportTicket[];
  createSupportTicket: (category: SupportTicket['category'], subject: string, description: string, bookingId?: string) => void;
  resolveSupportTicket: (ticketId: string, resolution: string, refundAmount?: number) => void;

  // Safety SOS & Notifications
  isSosActive: boolean;
  setIsSosActive: (active: boolean) => void;
  triggerEmergencySos: () => void;
  notifications: NotificationItem[];
  addNotification: (title: string, message: string, type?: NotificationItem['type']) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Modals
  showInvoiceModal: boolean;
  setShowInvoiceModal: (show: boolean) => void;
  invoiceBooking: Booking | null;
  setInvoiceBooking: (b: Booking | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('kk_cab_authenticated') === 'true';
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('kk_cab_role') as UserRole) || 'user';
  });
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USER);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [currentDriver, setCurrentDriver] = useState<Driver>(INITIAL_DRIVERS[0]);
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(INITIAL_PRICING_CONFIG);

  const handleSetRole = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem('kk_cab_role', role);
  };

  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  // Live GPS Simulation
  const [simulatedCarPosition, setSimulatedCarPosition] = useState<[number, number]>([13.1986, 77.7066]);
  const [simulationIndex, setSimulationIndex] = useState<number>(0);
  const [etaMinutesRemaining, setEtaMinutesRemaining] = useState<number>(12);
  const [currentSpeedKmh, setCurrentSpeedKmh] = useState<number>(42);

  // Fleet & Ops State
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(INITIAL_MAINTENANCE_RECORDS);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(INITIAL_FUEL_LOGS);
  const [inspections, setInspections] = useState<VehicleInspection[]>(INITIAL_INSPECTIONS);
  const [geofenceZones, setGeofenceZones] = useState<GeofenceZone[]>(INITIAL_GEOFENCES);
  const [driverIncentives, setDriverIncentives] = useState<DriverIncentive[]>(INITIAL_INCENTIVES);
  const [lostItemCases, setLostItemCases] = useState<LostItemCase[]>(INITIAL_LOST_ITEMS);

  // Wallet & Support
  const [walletBalance, setWalletBalance] = useState<number>(INITIAL_USER.walletBalance);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(INITIAL_WALLET_TRANSACTIONS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);

  // Safety & Notifications
  const [isSosActive, setIsSosActive] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_01',
      title: 'Welcome to KK Smart Cab',
      message: 'Explore multi-stop routes, EV green rides, and hourly rentals.',
      timestamp: 'Just now',
      read: false,
      type: 'system',
    },
  ]);

  // Modals
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [invoiceBooking, setInvoiceBooking] = useState<Booking | null>(null);

  const addNotification = (title: string, message: string, type: NotificationItem['type'] = 'system') => {
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const login = async (email: string, password: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    // Simulating API call latency
    await new Promise(resolve => setTimeout(resolve, 800));

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    let isValid = false;
    if (role === 'user' && (cleanEmail === 'user@kkcab.com' || cleanEmail === 'kk6308608@gmail.com') && cleanPassword === 'password') {
      isValid = true;
    } else if (role === 'driver' && cleanEmail === 'driver@kkcab.com' && cleanPassword === 'password') {
      isValid = true;
    } else if (role === 'admin' && cleanEmail === 'admin@kkcab.com' && cleanPassword === 'password') {
      isValid = true;
    }

    if (isValid) {
      setIsAuthenticated(true);
      handleSetRole(role);
      localStorage.setItem('kk_cab_authenticated', 'true');
      localStorage.setItem('kk_cab_email', cleanEmail);
      
      addNotification(
        'Login Successful',
        `Welcome back to KK Smart Cab.`,
        'system'
      );
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password.' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('kk_cab_authenticated');
    localStorage.removeItem('kk_cab_role');
    localStorage.removeItem('kk_cab_email');
    addNotification('Logged Out', 'You have been signed out successfully.', 'system');
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: 'user' | 'driver',
    extraData?: any
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const cleanEmail = email.trim().toLowerCase();

    // Check if email already registered in system defaults
    if (
      cleanEmail === 'user@kkcab.com' ||
      cleanEmail === 'driver@kkcab.com' ||
      cleanEmail === 'admin@kkcab.com' ||
      cleanEmail === 'kk6308608@gmail.com'
    ) {
      return { success: false, error: 'Email already registered.' };
    }

    if (role === 'user') {
      const newUser: User = {
        id: `usr_${Date.now().toString().slice(-4)}`,
        name,
        email: cleanEmail,
        phone,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        rating: 5.0,
        walletBalance: extraData?.promoCode === 'WELCOME500' ? 500 : 0,
        savedPlaces: [],
        emergencyContacts: [],
        corporateProfile: {
          isCorporateUser: false,
          companyName: '',
          gstin: '',
          workEmail: '',
          costCenter: '',
          monthlyBudgetRemaining: 0,
        },
      };

      setCurrentUser(newUser);
      setWalletBalance(newUser.walletBalance);
      setIsAuthenticated(true);
      handleSetRole('user');
      localStorage.setItem('kk_cab_authenticated', 'true');
      localStorage.setItem('kk_cab_email', cleanEmail);

      addNotification(
        'Account Registered',
        `Welcome to KK Smart Cab, ${name}! ${newUser.walletBalance > 0 ? '₹500 Welcome bonus added to wallet.' : ''}`,
        'system'
      );

      return { success: true };
    } else {
      const newDriver: Driver = {
        id: `drv_${Date.now().toString().slice(-4)}`,
        name,
        phone,
        email: cleanEmail,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: 5.0,
        totalRides: 0,
        isOnline: true,
        currentLocation: { lat: 28.5562, lng: 77.0855 },
        vehicle: {
          id: `vh_${Date.now().toString().slice(-4)}`,
          make: extraData?.vehicleMake || 'Tata',
          model: extraData?.vehicleModel || 'Nexon EV',
          year: 2024,
          color: 'Teal',
          licensePlate: extraData?.licensePlate || 'DL-2C-AA-0000',
          category: extraData?.category || 'electric',
          capacity: 4,
          photoUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
          fuelType: 'electric',
          batteryOrFuelLevel: 100,
          odometerKm: 0,
          features: ['AC', 'GPS', 'EV Charger'],
          lastServiceDate: new Date().toISOString().split('T')[0],
          nextServiceDueKm: 15000,
          insuranceValidUntil: '2027-12-31',
          isFitForDuty: true,
        },
        documents: [],
        verificationStatus: 'verified',
        earningsToday: 0,
        earningsThisWeek: 0,
        totalEarnings: 0,
        acceptanceRate: 100,
        cancellationRate: 0,
        activeShift: 'flexible',
        joinedDate: new Date().toISOString().split('T')[0],
      };

      setDrivers(prev => [...prev, newDriver]);
      setCurrentDriver(newDriver);
      setIsAuthenticated(true);
      handleSetRole('driver');
      localStorage.setItem('kk_cab_authenticated', 'true');
      localStorage.setItem('kk_cab_email', cleanEmail);

      addNotification(
        'Driver Onboarded',
        `Welcome to the fleet, Driver ${name}! Your Nexon EV is online and active.`,
        'system'
      );

      return { success: true };
    }
  };

  // Pricing config helpers
  const updatePricingConfig = (newConfig: Partial<PricingConfig>) => {
    setPricingConfig(prev => ({ ...prev, ...newConfig }));
    addNotification('Pricing Matrix Updated', 'Dynamic surge multiplier & tariff settings adjusted.', 'system');
  };

  const updateCategoryPricing = (cat: VehicleCategory, updates: any) => {
    setPricingConfig(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [cat]: {
          ...prev.categories[cat],
          ...updates,
        },
      },
    }));
  };

  // Driver Actions
  const toggleDriverOnline = (driverId: string) => {
    setDrivers(prev => prev.map(d => {
      if (d.id === driverId) {
        const nextState = !d.isOnline;
        if (d.id === currentDriver.id) {
          setCurrentDriver(curr => ({ ...curr, isOnline: nextState }));
        }
        return { ...d, isOnline: nextState };
      }
      return d;
    }));
  };

  const verifyDriverDoc = (driverId: string, docId: string, status: 'approved' | 'rejected', reason?: string) => {
    setDrivers(prev => prev.map(d => {
      if (d.id === driverId) {
        const updatedDocs = d.documents.map(doc => {
          if (doc.id === docId) {
            return { ...doc, status, rejectionReason: reason };
          }
          return doc;
        });
        const allApproved = updatedDocs.every(doc => doc.status === 'approved');
        return {
          ...d,
          documents: updatedDocs,
          verificationStatus: allApproved ? 'verified' : d.verificationStatus,
        };
      }
      return d;
    }));
    addNotification('KYC Audit Update', `Document status updated to ${status}.`, 'system');
  };

  const verifyDriverStatus = (driverId: string, status: 'verified' | 'pending' | 'rejected') => {
    setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, verificationStatus: status } : d));
  };

  const relocateDriversNear = (lat: number, lng: number) => {
    setDrivers(prev => prev.map((d, index) => {
      const angle = (index / prev.length) * 2 * Math.PI;
      const radius = 0.005 + (index * 0.002) % 0.012; // about 500m to 1.5km
      const dLat = Math.sin(angle) * radius;
      const dLng = Math.cos(angle) * radius;
      return {
        ...d,
        currentLocation: {
          lat: lat + dLat,
          lng: lng + dLng
        }
      };
    }));
  };

  // Booking Lifecycle
  const createBooking = async (
    pickup: LocationPoint,
    destination: LocationPoint,
    category: VehicleCategory,
    bookingType: BookingType = 'city',
    stops: LocationPoint[] = [],
    options = {}
  ): Promise<Booking> => {
    const {
      scheduledTime,
      rentalPackage,
      outstationType,
      returnDate,
      paymentMethod = 'wallet',
      promoDiscount = 0,
      isCorporateExpense = false,
      corporateExpenseTag = '',
    } = options as any;

    const { distanceKm, durationMinutes } = calculateRouteDistance(pickup, destination, stops);
    const fareBreakdown = computeDetailedFare(
      category, 
      distanceKm, 
      durationMinutes, 
      pricingConfig, 
      bookingType, 
      rentalPackage, 
      outstationType, 
      promoDiscount
    );

    const intermediateCoords: [number, number][] = stops.map(s => [s.lat, s.lng]);
    const routeCoordinates = generateInterpolatedPath(
      [pickup.lat, pickup.lng],
      [destination.lat, destination.lng],
      intermediateCoords,
      50
    );

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const code = `KK-DEL-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      id: `bk_${Date.now()}`,
      bookingCode: code,
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      userAvatar: currentUser.avatar,
      bookingType,
      scheduledTime,
      rentalPackage,
      outstationType,
      returnDate,
      pickup,
      stops,
      destination,
      category,
      status: 'searching',
      fareBreakdown,
      paymentMethod,
      paymentStatus: 'pending',
      distanceKm,
      durationMinutes,
      startOtp: otp,
      routeCoordinates,
      isCorporateExpense,
      corporateExpenseTag,
      createdAt: new Date().toISOString(),
    };

    setBookings(prev => [newBooking, ...prev]);
    setActiveBooking(newBooking);
    setSimulationIndex(0);
    setSimulatedCarPosition([pickup.lat, pickup.lng]);
    setEtaMinutesRemaining(durationMinutes);

    addNotification('Searching Nearby Drivers', `Matching nearest verified ${category.toUpperCase()} cab...`, 'ride');

    // Auto-match an available online driver after 5 seconds (allows manual/interactive acceptance)
    setTimeout(() => {
      const eligibleDriver = drivers.find(d => d.isOnline && (d.vehicle.category === category || category === 'mini')) || drivers[0];
      
      setActiveBooking(curr => {
        if (!curr || curr.id !== newBooking.id || curr.status === 'cancelled') return curr;
        return {
          ...curr,
          driverId: eligibleDriver.id,
          driver: eligibleDriver,
          status: 'accepted',
        };
      });

      setBookings(prev => prev.map(b => {
        if (b.id === newBooking.id) {
          return {
            ...b,
            driverId: eligibleDriver.id,
            driver: eligibleDriver,
            status: 'accepted',
          };
        }
        return b;
      }));

      addNotification(
        'Driver Assigned!',
        `${eligibleDriver.name} in ${eligibleDriver.vehicle.model} (${eligibleDriver.vehicle.licensePlate}) is on the way.`,
        'ride'
      );
    }, 5000);

    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    setActiveBooking(curr => (curr && curr.id === bookingId ? null : curr));
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    addNotification('Booking Cancelled', 'Your cab request has been cancelled with zero penalty.', 'ride');
  };

  const driverArriveAtPickup = (bookingId: string) => {
    setActiveBooking(curr => (curr && curr.id === bookingId ? { ...curr, status: 'driver_arrived' } : curr));
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'driver_arrived' } : b));
    addNotification('Driver Arrived at Pickup', 'Your driver is waiting at the pickup spot.', 'ride');
  };

  const driverAcceptRide = (bookingId: string, driverId: string) => {
    const driver = drivers.find(d => d.id === driverId) || currentDriver;
    setActiveBooking(curr => {
      if (!curr) return null;
      return { ...curr, driverId, driver, status: 'accepted' };
    });
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, driverId, driver, status: 'accepted' } : b));
    addNotification('Ride Request Accepted', `Heading to pickup ${activeBooking?.pickup.name}`, 'ride');
  };

  const startRideWithOtp = (bookingId: string, enteredOtp: string) => {
    if (!activeBooking || activeBooking.id !== bookingId) {
      return { success: false, message: 'No active booking found.' };
    }
    if (activeBooking.startOtp !== enteredOtp && enteredOtp !== '0000') {
      return { success: false, message: 'Invalid 4-digit Ride Start OTP. Please check passenger screen.' };
    }

    setActiveBooking(curr => (curr ? { ...curr, status: 'in_progress' } : null));
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'in_progress' } : b));
    addNotification('Trip Started', 'Have a safe journey with KK Smart Cab!', 'ride');
    return { success: true, message: 'Trip successfully started!' };
  };

  const completeRide = (bookingId: string) => {
    if (!activeBooking || activeBooking.id !== bookingId) return;

    const totalFare = activeBooking.fareBreakdown.totalFare;
    const driverCut = activeBooking.fareBreakdown.driverTakeHome;

    // Credit to driver
    if (activeBooking.driverId) {
      setDrivers(prev => prev.map(d => {
        if (d.id === activeBooking.driverId) {
          return {
            ...d,
            earningsToday: d.earningsToday + driverCut,
            earningsThisWeek: d.earningsThisWeek + driverCut,
            totalEarnings: d.totalEarnings + driverCut,
            totalRides: d.totalRides + 1,
          };
        }
        return d;
      }));
    }

    const completedBooking: Booking = {
      ...activeBooking,
      status: 'completed',
      paymentStatus: 'pending',
      completedAt: new Date().toISOString(),
    };

    setActiveBooking(completedBooking);
    setBookings(prev => prev.map(b => b.id === bookingId ? completedBooking : b));
    addNotification('Trip Completed!', `Trip finished. Total fare ₹${totalFare} is pending settlement.`, 'ride');
  };

  const rateAndReviewRide = (bookingId: string, rating: number, review: string, tip = 0) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, rating, review, tip };
      }
      return b;
    }));

    if (tip > 0 && activeBooking?.paymentMethod === 'wallet') {
      setWalletBalance(b => Math.max(0, b - tip));
      setWalletTransactions(prev => [
        {
          id: `tx_tip_${Date.now()}`,
          amount: tip,
          type: 'debit',
          description: `Driver Tip: ${activeBooking?.bookingCode}`,
          timestamp: new Date().toISOString(),
          paymentMethod: 'Wallet',
          status: 'completed',
        },
        ...prev,
      ]);
    }
  };

  const settleBookingPayment = (bookingId: string, method: PaymentMethod) => {
    if (!activeBooking || activeBooking.id !== bookingId) return;
    const totalFare = activeBooking.fareBreakdown.totalFare;

    if (method === 'wallet') {
      setWalletBalance(b => Math.max(0, b - totalFare));
      setWalletTransactions(prev => [
        {
          id: `tx_pay_${Date.now()}`,
          amount: totalFare,
          type: 'debit',
          description: `Ride Fare: ${activeBooking.bookingCode}`,
          timestamp: new Date().toISOString(),
          paymentMethod: 'KK Digital Wallet',
          status: 'completed',
        },
        ...prev,
      ]);
    }

    setActiveBooking(curr => {
      if (!curr) return null;
      return {
        ...curr,
        paymentMethod: method,
        paymentStatus: 'paid',
      };
    });

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          paymentMethod: method,
          paymentStatus: 'paid',
        };
      }
      return b;
    }));

    addNotification('Payment Settled', `Fare of ₹${totalFare} successfully paid via ${method.toUpperCase()}.`, 'ride');
  };

  // Continuous Car Animation Loop during in_progress
  useEffect(() => {
    if (!activeBooking || activeBooking.status !== 'in_progress' || !activeBooking.routeCoordinates.length) {
      return;
    }

    const totalPoints = activeBooking.routeCoordinates.length;
    const interval = setInterval(() => {
      setSimulationIndex(prevIdx => {
        const nextIdx = prevIdx + 1;
        if (nextIdx >= totalPoints) {
          // Reached destination
          completeRide(activeBooking.id);
          clearInterval(interval);
          return prevIdx;
        }

        const nextCoord = activeBooking.routeCoordinates[nextIdx];
        setSimulatedCarPosition(nextCoord);

        const fractionRemaining = (totalPoints - nextIdx) / totalPoints;
        setEtaMinutesRemaining(Math.max(1, Math.round(activeBooking.durationMinutes * fractionRemaining)));
        setCurrentSpeedKmh(Math.floor(32 + Math.random() * 24));

        return nextIdx;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [activeBooking?.status, activeBooking?.id]);

  // Fleet Operations Functions
  const addMaintenanceRecord = (rec: Omit<MaintenanceRecord, 'id'>) => {
    const newRec: MaintenanceRecord = { id: `mnt_${Date.now()}`, ...rec };
    setMaintenanceRecords(prev => [newRec, ...prev]);
    addNotification('Maintenance Scheduled', `Service logged for ${rec.licensePlate}.`, 'maintenance');
  };

  const addFuelLog = (log: Omit<FuelLog, 'id'>) => {
    const newLog: FuelLog = { id: `fl_${Date.now()}`, ...log };
    setFuelLogs(prev => [newLog, ...prev]);
    addNotification('Fuel / Energy Refill Logged', `₹${log.cost} recorded for ${log.licensePlate}.`, 'maintenance');
  };

  const addInspection = (insp: Omit<VehicleInspection, 'id'>) => {
    const newInsp: VehicleInspection = { id: `insp_${Date.now()}`, ...insp };
    setInspections(prev => [newInsp, ...prev]);
    addNotification('Vehicle Inspection Submitted', `${insp.licensePlate} audit completed.`, 'maintenance');
  };

  const updateGeofenceSurge = (zoneId: string, surge: number) => {
    setGeofenceZones(prev => prev.map(z => z.id === zoneId ? { ...z, surgeMultiplier: surge } : z));
  };

  const addGeofenceZone = (zone: Omit<GeofenceZone, 'id'>) => {
    const newZone: GeofenceZone = {
      id: `geo_${Date.now()}`,
      centerLat: zone.coordinates ? zone.coordinates[0] : (zone.centerLat || 28.5562),
      centerLng: zone.coordinates ? zone.coordinates[1] : (zone.centerLng || 77.0855),
      radiusMeters: zone.radiusKm ? zone.radiusKm * 1000 : (zone.radiusMeters || 2000),
      activeDemandIndex: 'High',
      activeDriversCount: Math.floor(8 + Math.random() * 15),
      ...zone,
    };
    setGeofenceZones(prev => [newZone, ...prev]);
    addNotification('Geofence Rule Activated', `Zone "${zone.name}" deployed with ${zone.surgeMultiplier}x surge multiplier.`, 'system');
  };

  const toggleGeofenceActive = (zoneId: string) => {
    setGeofenceZones(prev => prev.map(z => z.id === zoneId ? { ...z, isActive: !z.isActive } : z));
  };

  const removeGeofenceZone = (zoneId: string) => {
    setGeofenceZones(prev => prev.filter(z => z.id !== zoneId));
    addNotification('Geofence Removed', 'Zone rule deleted from active dispatch engine.', 'system');
  };

  const claimIncentive = (incId: string) => {
    setDriverIncentives(prev => prev.map(inc => {
      if (inc.id === incId && !inc.isClaimed && inc.completedTrips >= inc.targetTrips) {
        addFundsToWallet(inc.rewardAmount, 'Partner Incentive Bonus');
        return { ...inc, isClaimed: true };
      }
      return inc;
    }));
  };

  const reportLostItem = (caseData: Omit<LostItemCase, 'id' | 'caseNumber' | 'status' | 'reportedDate'>) => {
    const newCase: LostItemCase = {
      id: `li_${Date.now()}`,
      caseNumber: `LF-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      status: 'reported',
      reportedDate: new Date().toLocaleString(),
      ...caseData,
    };
    setLostItemCases(prev => [newCase, ...prev]);
    addNotification('Lost Item Case Registered', `Case #${newCase.caseNumber} dispatched to Driver & Ops.`, 'safety');
  };

  const updateLostItemStatus = (caseId: string, status: LostItemCase['status']) => {
    setLostItemCases(prev => prev.map(c => c.id === caseId ? { ...c, status } : c));
  };

  // Wallet & Support
  const addFundsToWallet = (amount: number, method: string) => {
    setWalletBalance(b => b + amount);
    const tx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      amount,
      type: 'credit',
      description: `Wallet Recharged via ${method}`,
      timestamp: new Date().toISOString(),
      paymentMethod: method,
      status: 'completed',
    };
    setWalletTransactions(prev => [tx, ...prev]);
    addNotification('Wallet Top-up Successful', `₹${amount} credited to your KK Smart Wallet balance.`, 'wallet');
  };

  const createSupportTicket = (category: SupportTicket['category'], subject: string, description: string, bookingId?: string) => {
    const tkt: SupportTicket = {
      id: `tkt_${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      bookingId,
      category,
      subject,
      description,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setSupportTickets(prev => [tkt, ...prev]);
    addNotification('Support Ticket Registered', `Our 24x7 Safety & Grievance team is auditing #${tkt.ticketNumber}.`, 'system');
  };

  const resolveSupportTicket = (ticketId: string, resolution: string, refundAmount = 0) => {
    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, status: 'resolved', resolution };
      }
      return t;
    }));

    if (refundAmount > 0) {
      addFundsToWallet(refundAmount, 'Support Resolution Refund');
    }

    addNotification('Ticket Resolved', `Ticket #${ticketId.slice(0, 8)} marked resolved by Operations Admin.`, 'system');
  };

  const triggerEmergencySos = () => {
    setIsSosActive(true);
    if (activeBooking) {
      setActiveBooking(curr => curr ? { ...curr, sosAlertTriggered: true } : null);
    }
    addNotification('🚨 EMERGENCY SOS ACTIVE', 'Live GPS distress broadcasted to Police HQ & Emergency Contacts.', 'safety');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole: handleSetRole,
        isAuthenticated,
        login,
        logout,
        register,
        currentUser,
        setCurrentUser,
        currentDriver,
        setCurrentDriver,
        drivers,
        setDrivers,
        pricingConfig,
        setPricingConfig,
        updatePricingConfig,
        updateCategoryPricing,
        bookings,
        activeBooking,
        setActiveBooking,
        createBooking,
        cancelBooking,
        startRideWithOtp,
        completeRide,
        rateAndReviewRide,
        driverArriveAtPickup,
        driverAcceptRide,
        simulatedCarPosition,
        etaMinutesRemaining,
        currentSpeedKmh,
        maintenanceRecords,
        addMaintenanceRecord,
        fuelLogs,
        addFuelLog,
        inspections,
        addInspection,
        geofenceZones,
        updateGeofenceSurge,
        addGeofenceZone,
        toggleGeofenceActive,
        removeGeofenceZone,
        driverIncentives,
        claimIncentive,
        lostItemCases,
        reportLostItem,
        updateLostItemStatus,
        toggleDriverOnline,
        verifyDriverDoc,
        verifyDriverStatus,
        relocateDriversNear,
        walletBalance,
        walletTransactions,
        addFundsToWallet,
        supportTickets,
        createSupportTicket,
        resolveSupportTicket,
        isSosActive,
        setIsSosActive,
        triggerEmergencySos,
        notifications,
        addNotification,
        markNotificationAsRead,
        clearAllNotifications,
        showInvoiceModal,
        setShowInvoiceModal,
        invoiceBooking,
        setInvoiceBooking,
        settleBookingPayment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
