import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Clock, 
  Calendar, 
  Tag, 
  CreditCard, 
  Wallet, 
  Building2, 
  Check, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Info, 
  Users, 
  Briefcase,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  LocationPoint, 
  VehicleCategory, 
  BookingType, 
  RentalPackage, 
  OutstationTripType, 
  PaymentMethod 
} from '../../types';
import { POPULAR_LOCATIONS } from '../../data/mockData';
import { calculateRouteDistance, computeDetailedFare } from '../../services/fareService';

interface SearchableLocationInputProps {
  label: string;
  value: LocationPoint;
  onChange: (loc: LocationPoint) => void;
  iconColor: string;
  iconText: string;
  locations: LocationPoint[];
}

const SearchableLocationInput: React.FC<SearchableLocationInputProps> = ({
  label,
  value,
  onChange,
  iconColor,
  iconText,
  locations,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value.name);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchQuery(value.name);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery(value.name);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value]);

  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3 shadow-inner transition focus-within:border-cyan-500/50">
        <div className={`w-5 h-5 rounded-full ${iconColor} flex items-center justify-center text-[10px] font-black text-slate-950 shrink-0 shadow-md`}>
          {iconText}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">
            {label}
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              setIsOpen(true);
              setSearchQuery('');
            }}
            placeholder="Search city or landmark in India..."
            className="w-full bg-transparent text-slate-100 font-bold text-xs focus:outline-none cursor-text mt-0.5 placeholder-slate-650"
          />
        </div>
        {isOpen && (
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setSearchQuery(value.name);
            }}
            className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider shrink-0 transition"
          >
            Cancel
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1.5 max-h-56 bg-slate-900 border border-slate-800/80 rounded-2xl shadow-2xl overflow-y-auto z-50 divide-y divide-slate-800/40 backdrop-blur-md">
          {filteredLocations.length > 0 ? (
            filteredLocations.map((loc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(loc);
                  setSearchQuery(loc.name);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-slate-800/45 transition flex flex-col gap-0.5"
              >
                <div className="font-bold text-xs text-slate-100">{loc.name}</div>
                <div className="text-[10px] text-slate-500 line-clamp-1">{loc.address}</div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-slate-500">
              No matching Indian locations found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const BookCabView: React.FC = () => {
  const { 
    createBooking, 
    pricingConfig, 
    currentUser, 
    walletBalance,
    relocateDriversNear,
    pickup,
    setPickup,
    destination,
    setDestination,
    stops,
    setStops,
    distanceKm,
    durationMinutes,
    isLoadingRoute
  } = useApp();

  // Booking Mode
  const [bookingType, setBookingType] = useState<BookingType>('city');
  const [rentalPackage, setRentalPackage] = useState<RentalPackage>('4hr_40km');
  const [outstationType, setOutstationType] = useState<OutstationTripType>('one_way');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');

  // Relocate surrounding drivers near the active pickup coordinates
  useEffect(() => {
    if (pickup && relocateDriversNear) {
      relocateDriversNear(pickup.lat, pickup.lng);
    }
  }, [pickup, relocateDriversNear]);

  // Category & Payment
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>('sedan');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wallet');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [isCorporateExpense, setIsCorporateExpense] = useState(false);
  const [corporateExpenseTag, setCorporateExpenseTag] = useState('Client Meeting & Site Visit');

  // Promo Code
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Split fare
  const [splitFareActive, setSplitFareActive] = useState(false);

  // Dispatched State
  const [isDispatching, setIsDispatching] = useState(false);

  // Compute Live Route Metrics
  const fareBreakdown = computeDetailedFare(
    selectedCategory, 
    distanceKm, 
    durationMinutes, 
    pricingConfig, 
    bookingType, 
    rentalPackage, 
    outstationType, 
    appliedDiscount
  );

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'KKFIRST') {
      setAppliedDiscount(75);
      setPromoMessage({ text: 'First Ride Discount Applied!', success: true });
    } else if (code === 'SMART50') {
      setAppliedDiscount(50);
      setPromoMessage({ text: 'Smart Savings Applied!', success: true });
    } else if (code === 'GREENEV' && selectedCategory === 'electric') {
      setAppliedDiscount(60);
      setPromoMessage({ text: 'Zero-Emission Green Discount Applied!', success: true });
    } else {
      setPromoMessage({ text: 'Invalid promo code. Try KKFIRST or SMART50.', success: false });
    }
  };

  const handleAddStop = () => {
    if (stops.length >= 2) return;
    const nextSpot = POPULAR_LOCATIONS[2]; // Connaught Place
    setStops(prev => [...prev, nextSpot]);
  };

  const handleRemoveStop = (idx: number) => {
    setStops(prev => prev.filter((_, i) => i !== idx));
  };

  const handleConfirmRide = async () => {
    setIsDispatching(true);
    await createBooking(
      pickup,
      destination,
      selectedCategory,
      bookingType,
      stops,
      {
        rentalPackage: bookingType === 'rentals' ? rentalPackage : undefined,
        outstationType: bookingType === 'outstation' ? outstationType : undefined,
        scheduledTime: bookingType === 'scheduled' ? `${scheduledDate} ${scheduledTime}` : undefined,
        paymentMethod: isCorporateExpense ? 'corporate_invoice' : paymentMethod,
        promoDiscount: appliedDiscount,
        isCorporateExpense,
        corporateExpenseTag,
      }
    );
    setIsDispatching(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-2xl space-y-6">
      
      {/* 1. Trip Mode Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80">
        <button
          onClick={() => setBookingType('city')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            bookingType === 'city'
              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <span>🚗 Daily City</span>
        </button>

        <button
          onClick={() => setBookingType('rentals')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            bookingType === 'rentals'
              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <span>⏱️ Rentals</span>
        </button>

        <button
          onClick={() => setBookingType('outstation')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            bookingType === 'outstation'
              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <span>🛣️ Outstation</span>
        </button>

        <button
          onClick={() => setBookingType('scheduled')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            bookingType === 'scheduled'
              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <span>📅 Schedule</span>
        </button>
      </div>

      {/* Hourly Rentals Sub-options */}
      {bookingType === 'rentals' && (
        <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">
            Select Hourly Multi-Stop Package:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: '2hr_20km', label: '2 Hrs / 20 km' },
              { id: '4hr_40km', label: '4 Hrs / 40 km' },
              { id: '8hr_80km', label: '8 Hrs / 80 km' },
              { id: '12hr_120km', label: '12 Hrs / 120 km' },
            ].map(pkg => (
              <button
                key={pkg.id}
                onClick={() => setRentalPackage(pkg.id as RentalPackage)}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition ${
                  rentalPackage === pkg.id
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {pkg.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Outstation Sub-options */}
      {bookingType === 'outstation' && (
        <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-300 font-medium">Outstation Trip Format:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setOutstationType('one_way')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                outstationType === 'one_way'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              One-Way Drop
            </button>
            <button
              onClick={() => setOutstationType('round_trip')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                outstationType === 'round_trip'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Round Trip
            </button>
          </div>
        </div>
      )}

      {/* Schedule Date & Time Picker */}
      {bookingType === 'scheduled' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Pickup Date</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={e => setScheduledDate(e.target.value)}
              className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Pickup Time</label>
            <input
              type="time"
              value={scheduledTime}
              onChange={e => setScheduledTime(e.target.value)}
              className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      )}

      {/* 2. Route Waypoints Selector */}
      <div className="space-y-3">
        
        {/* Pickup Input */}
        <SearchableLocationInput
          label="Pickup Spot"
          value={pickup}
          onChange={setPickup}
          iconColor="bg-emerald-500"
          iconText="P"
          locations={POPULAR_LOCATIONS}
        />

        {/* Intermediate Stops */}
        {stops.map((stop, idx) => (
          <div key={idx} className="flex items-center gap-2 animate-in slide-in-from-top-2">
            <div className="flex-1">
              <SearchableLocationInput
                label={`Intermediate Stop #${idx + 1}`}
                value={stop}
                onChange={found => {
                  setStops(curr => curr.map((s, i) => i === idx ? found : s));
                }}
                iconColor="bg-cyan-400"
                iconText={`${idx + 1}`}
                locations={POPULAR_LOCATIONS}
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveStop(idx)}
              className="p-3 bg-slate-950 border border-slate-800 hover:bg-rose-500/10 hover:border-rose-500/30 text-slate-500 hover:text-rose-400 rounded-2xl transition self-stretch flex items-center justify-center shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Drop Input */}
        <SearchableLocationInput
          label="Drop Destination"
          value={destination}
          onChange={setDestination}
          iconColor="bg-rose-500"
          iconText="D"
          locations={POPULAR_LOCATIONS}
        />

        {/* Add Multi-Stop Waypoint Button */}
        {stops.length < 2 && (
          <button
            onClick={handleAddStop}
            className="w-full py-2 bg-slate-950 hover:bg-slate-800/80 border border-dashed border-slate-700 text-cyan-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Intermediate Waypoint Stop (+Pickup friend / Luggage drop)</span>
          </button>
        )}

      </div>

      {/* 3. Vehicle Category Selection Dropdown */}
      <div className="space-y-2 relative" ref={categoryDropdownRef}>
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2">
            Choose Vehicle Class:
            {isLoadingRoute && (
              <span className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-semibold animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0"></span>
                Calculating map route...
              </span>
            )}
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            {isLoadingRoute ? 'Calculating...' : `${distanceKm} km • ~${durationMinutes} mins`}
          </span>
        </div>

        {/* Custom Dropdown Trigger Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            className="w-full bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between shadow-inner transition focus:outline-none focus:border-cyan-500/50 hover:border-slate-700"
          >
            {(() => {
              const activeCat = pricingConfig.categories[selectedCategory];
              const activeFare = computeDetailedFare(
                selectedCategory,
                distanceKm,
                durationMinutes,
                pricingConfig,
                bookingType,
                rentalPackage,
                outstationType,
                appliedDiscount
              );
              return (
                <div className="flex items-center gap-3 w-full text-left">
                  <img
                    src={activeCat.image}
                    alt={activeCat.name}
                    className="w-12 h-9 rounded-xl object-cover border border-slate-850 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-black text-xs sm:text-sm text-white truncate pr-2">
                        {activeCat.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[10px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1 font-semibold text-slate-300">
                        <Users className="w-3 h-3 text-cyan-450 shrink-0" /> {activeCat.capacity} Seats
                      </span>
                      <span className="truncate max-w-[150px] sm:max-w-none">
                        {activeCat.description}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
            <ChevronDown className={`w-5 h-5 text-slate-400 ml-2 transition-transform duration-200 shrink-0 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Options Box */}
          {isCategoryDropdownOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-20 max-h-[280px] overflow-y-auto divide-y divide-slate-800/60 p-1.5 animate-in slide-in-from-top-2 duration-150">
              {(['mini', 'sedan', 'electric', 'suv', 'luxury'] as VehicleCategory[]).map(catKey => {
                const cat = pricingConfig.categories[catKey];
                const catFare = computeDetailedFare(
                  catKey,
                  distanceKm,
                  durationMinutes,
                  pricingConfig,
                  bookingType,
                  rentalPackage,
                  outstationType,
                  appliedDiscount
                );
                const isSelected = selectedCategory === catKey;

                return (
                  <div
                    key={catKey}
                    onClick={() => {
                      setSelectedCategory(catKey);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 hover:bg-slate-950/80 ${
                      isSelected ? 'bg-cyan-500/10 border-cyan-500/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-12 h-9 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`font-heading text-xs font-black truncate pr-2 ${isSelected ? 'text-cyan-400' : 'text-white'}`}>
                            {cat.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[10px] text-slate-400 mt-0.5">
                          <span className="flex items-center gap-0.5 font-semibold text-slate-300">
                            <Users className="w-2.5 h-2.5 text-cyan-450 shrink-0" /> {cat.capacity}
                          </span>
                          <span className="truncate">
                            {cat.description}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. Payment Options */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-300">Payment Option:</span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'wallet', label: `KK Wallet (₹${walletBalance})`, icon: Wallet },
              { id: 'upi', label: 'UPI / GPay', icon: CreditCard },
              { id: 'card', label: 'Credit Card', icon: CreditCard },
              { id: 'cash', label: 'Cash on Trip', icon: Tag },
            ].map(pm => (
              <button
                key={pm.id}
                onClick={() => {
                  setPaymentMethod(pm.id as PaymentMethod);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  paymentMethod === pm.id
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <pm.icon className="w-3.5 h-3.5" />
                <span>{pm.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Dispatch Action */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-2">
        <button
          onClick={handleConfirmRide}
          disabled={isDispatching}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 via-cyan-400 to-teal-300 hover:from-cyan-450 hover:to-teal-200 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-cyan-500/25 transition active:scale-95 flex items-center justify-center gap-2"
        >
          {isDispatching ? (
            <span>Matching Captain...</span>
          ) : (
            <>
              <span>Confirm & Dispatch Cab</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

    </div>
  );
};
