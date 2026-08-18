export type UserRole = 'user' | 'driver' | 'admin';

export type RideStatus = 
  | 'idle'
  | 'searching'
  | 'accepted'
  | 'driver_arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type BookingType = 'city' | 'rentals' | 'outstation' | 'scheduled';

export type RentalPackage = '2hr_20km' | '4hr_40km' | '8hr_80km' | '12hr_120km';

export type OutstationTripType = 'one_way' | 'round_trip';

export type VehicleCategory = 'mini' | 'sedan' | 'electric' | 'suv' | 'luxury';

export type PaymentMethod = 'wallet' | 'upi' | 'card' | 'cash' | 'corporate_invoice';

export interface LocationPoint {
  name: string;
  address: string;
  lat: number;
  lng: number;
  landmark?: string;
}

export interface FareBreakdown {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  surgeMultiplier: number;
  surgeAmount: number;
  gstAmount: number;
  discount: number;
  tollEstimate: number;
  nightCharges: number;
  totalFare: number;
  driverTakeHome: number;
  platformCommission: number;
}

export interface FareSplitMember {
  name: string;
  phone: string;
  shareAmount: number;
  status: 'pending' | 'accepted' | 'paid';
}

export interface CorporateProfile {
  isCorporateUser: boolean;
  companyName: string;
  gstin: string;
  workEmail: string;
  costCenter: string;
  monthlyBudgetRemaining: number;
}

export interface Booking {
  id: string;
  bookingCode: string;
  userId: string;
  userName: string;
  userPhone: string;
  userAvatar: string;
  bookingType: BookingType;
  scheduledTime?: string;
  rentalPackage?: RentalPackage;
  outstationType?: OutstationTripType;
  returnDate?: string;
  
  pickup: LocationPoint;
  stops?: LocationPoint[];
  destination: LocationPoint;
  
  category: VehicleCategory;
  driverId?: string;
  driver?: Driver;
  status: RideStatus;
  
  fareBreakdown: FareBreakdown;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  
  distanceKm: number;
  durationMinutes: number;
  startOtp: string;
  routeCoordinates: [number, number][];
  
  rating?: number;
  review?: string;
  tip?: number;
  
  isCorporateExpense?: boolean;
  corporateExpenseTag?: string;
  splitMembers?: FareSplitMember[];
  
  sosAlertTriggered?: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface DriverDocument {
  id: string;
  type: 'driving_license' | 'vehicle_rc' | 'insurance' | 'police_clearance' | 'pollution_cert';
  name: string;
  documentNumber: string;
  expiryDate: string;
  fileUrl: string;
  status: 'approved' | 'pending' | 'rejected';
  rejectionReason?: string;
  uploadedAt: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  category: VehicleCategory;
  capacity: number;
  photoUrl: string;
  fuelType: 'petrol' | 'diesel' | 'cng' | 'electric';
  batteryOrFuelLevel: number; // percentage
  odometerKm: number;
  features: string[];
  lastServiceDate: string;
  nextServiceDueKm: number;
  insuranceValidUntil: string;
  isFitForDuty: boolean;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  rating: number;
  totalRides: number;
  isOnline: boolean;
  currentLocation: { lat: number; lng: number };
  vehicle: Vehicle;
  documents: DriverDocument[];
  verificationStatus: 'verified' | 'pending' | 'rejected';
  earningsToday: number;
  earningsThisWeek: number;
  totalEarnings: number;
  acceptanceRate: number;
  cancellationRate: number;
  activeShift: 'morning' | 'evening' | 'night' | 'flexible';
  joinedDate: string;
}

export interface DriverIncentive {
  id: string;
  title: string;
  description: string;
  targetTrips: number;
  completedTrips: number;
  rewardAmount: number;
  validUntil: string;
  isClaimed: boolean;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId?: string;
  licensePlate?: string;
  vehiclePlate?: string;
  serviceType: string;
  odometerKm?: number;
  cost: number;
  garageName?: string;
  vendorName?: string;
  notes?: string;
  status: 'completed' | 'scheduled' | 'in_progress' | string;
  date?: string;
  serviceDate?: string;
  nextDueKm?: number;
}

export interface FuelLog {
  id: string;
  vehicleId?: string;
  licensePlate?: string;
  vehiclePlate?: string;
  driverName?: string;
  energyType?: 'petrol' | 'diesel' | 'cng' | 'electric' | string;
  fuelType?: 'petrol' | 'diesel' | 'cng' | 'electric' | string;
  quantityUnits?: number; // Litres or kWh
  litersOrKwh?: number;
  cost: number;
  odometerKm?: number;
  odometerAtRefuel?: number;
  stationName: string;
  date?: string;
  timestamp?: string;
}

export interface VehicleInspection {
  id: string;
  vehicleId: string;
  licensePlate: string;
  inspectorName: string;
  date: string;
  tirePressureOk: boolean;
  acFilterOk: boolean;
  brakesOk: boolean;
  sanitizationDone: boolean;
  firstAidKitPresent: boolean;
  fireExtinguisherPresent: boolean;
  passed: boolean;
  notes: string;
}

export interface GeofenceZone {
  id: string;
  name: string;
  type: 'airport' | 'tech_park' | 'railway_station' | 'metro_hub' | 'commercial_district' | 'high_demand' | 'toll_gate' | 'restricted';
  centerLat?: number;
  centerLng?: number;
  coordinates?: [number, number];
  radiusMeters?: number;
  radiusKm?: number;
  surchargeFee?: number;
  activeDemandIndex?: 'Low' | 'Moderate' | 'High' | 'Surge Alert';
  surgeMultiplier: number;
  activeDriversCount?: number;
  color?: string;
  isActive?: boolean;
}

export interface LostItemCase {
  id: string;
  caseNumber: string;
  bookingCode: string;
  passengerName: string;
  passengerPhone: string;
  driverName: string;
  itemName: string;
  category: 'Electronics' | 'Wallet / Cards' | 'Luggage / Bag' | 'Keys / Documents' | 'Other';
  description: string;
  status: 'reported' | 'driver_contacted' | 'item_found' | 'in_transit_hub' | 'returned';
  reportedDate: string;
  resolutionDate?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  bookingId?: string;
  category: 'lost_item' | 'fare_dispute' | 'driver_behavior' | 'safety' | 'app_issue' | 'other';
  subject: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
  resolution?: string;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  timestamp: string;
  paymentMethod?: string;
  status: 'completed' | 'pending';
}

export interface UserSavedPlace {
  id: string;
  label: string;
  address: string;
  lat: number;
  lng: number;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  rating: number;
  walletBalance: number;
  savedPlaces: UserSavedPlace[];
  emergencyContacts: EmergencyContact[];
  corporateProfile: CorporateProfile;
}

export interface CategoryPricingConfig {
  name: string;
  baseFare: number;
  perKmRate: number;
  perMinRate: number;
  minFare: number;
  capacity: number;
  image: string;
  description: string;
  hourlyRentalBase: number;
  outstationPerKmRate: number;
}

export interface PricingConfig {
  surgeMultiplier: number;
  isSurgeActive: boolean;
  gstTaxRate: number; // e.g. 0.05 for 5%
  platformFeePercent: number; // e.g. 15%
  nightChargeMultiplier: number;
  categories: Record<VehicleCategory, CategoryPricingConfig>;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'ride' | 'wallet' | 'safety' | 'system' | 'maintenance' | 'corporate';
}
