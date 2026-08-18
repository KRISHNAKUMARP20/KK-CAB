import { 
  LocationPoint, 
  VehicleCategory, 
  FareBreakdown, 
  PricingConfig, 
  BookingType, 
  RentalPackage, 
  OutstationTripType 
} from '../types';

export function calculateDistanceKm(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const directDistance = R * c;
  
  // Real world road factor (usually 1.35x crow-flies distance in NCR roads)
  return Math.round(directDistance * 1.35 * 10) / 10;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function calculateRouteDistance(
  pickup: LocationPoint, 
  destination: LocationPoint,
  stops: LocationPoint[] = []
): { distanceKm: number; durationMinutes: number } {
  let totalKm = 0;
  let current = pickup;

  for (const stop of stops) {
    totalKm += calculateDistanceKm(current.lat, current.lng, stop.lat, stop.lng);
    current = stop;
  }
  totalKm += calculateDistanceKm(current.lat, current.lng, destination.lat, destination.lng);

  if (totalKm < 2.5) totalKm = 3.2; // Minimum floor

  // Avg speed 28 km/h in city traffic + 5 min pickup buffer
  const durationMinutes = Math.round((totalKm / 26) * 60) + (stops.length * 8) + 4;

  return { distanceKm: Math.round(totalKm * 10) / 10, durationMinutes };
}

export function computeDetailedFare(
  category: VehicleCategory,
  distanceKm: number,
  durationMinutes: number,
  pricingConfig: PricingConfig,
  bookingType: BookingType = 'city',
  rentalPackage?: RentalPackage,
  outstationType?: OutstationTripType,
  promoDiscount = 0
): FareBreakdown {
  const catConfig = pricingConfig.categories[category];
  const surge = pricingConfig.isSurgeActive ? pricingConfig.surgeMultiplier : 1.0;

  let base = catConfig.baseFare;
  let distFare = distanceKm * catConfig.perKmRate;
  let timeFare = durationMinutes * catConfig.perMinRate;
  let tollEstimate = 0;
  let nightCharges = 0;

  if (bookingType === 'rentals' && rentalPackage) {
    if (rentalPackage === '2hr_20km') {
      base = catConfig.hourlyRentalBase * 1.0;
      distFare = Math.max(0, distanceKm - 20) * (catConfig.perKmRate * 1.2);
    } else if (rentalPackage === '4hr_40km') {
      base = catConfig.hourlyRentalBase * 1.8;
      distFare = Math.max(0, distanceKm - 40) * (catConfig.perKmRate * 1.2);
    } else if (rentalPackage === '8hr_80km') {
      base = catConfig.hourlyRentalBase * 3.4;
      distFare = Math.max(0, distanceKm - 80) * (catConfig.perKmRate * 1.2);
    } else if (rentalPackage === '12hr_120km') {
      base = catConfig.hourlyRentalBase * 4.8;
      distFare = Math.max(0, distanceKm - 120) * (catConfig.perKmRate * 1.2);
    }
    timeFare = 0;
  } else if (bookingType === 'outstation') {
    const isRound = outstationType === 'round_trip';
    const effectiveKm = isRound ? distanceKm * 2 : distanceKm;
    base = 500; // Driver allowance / day
    distFare = effectiveKm * catConfig.outstationPerKmRate;
    timeFare = 0;
    tollEstimate = isRound ? 450 : 250;
  }

  const subtotalBeforeSurge = Math.max(catConfig.minFare, base + distFare + timeFare);
  const surgeAmount = Math.round(subtotalBeforeSurge * (surge - 1.0));
  const subtotalWithSurge = subtotalBeforeSurge + surgeAmount + tollEstimate + nightCharges;
  
  const discountAmount = Math.min(promoDiscount, subtotalWithSurge * 0.4);
  const taxableAmount = Math.max(0, subtotalWithSurge - discountAmount);
  const gstAmount = Math.round(taxableAmount * pricingConfig.gstTaxRate);
  
  const totalFare = Math.round(taxableAmount + gstAmount);
  const platformCommission = Math.round(totalFare * (pricingConfig.platformFeePercent / 100));
  const driverTakeHome = Math.max(0, totalFare - platformCommission);

  return {
    baseFare: Math.round(base),
    distanceFare: Math.round(distFare),
    timeFare: Math.round(timeFare),
    surgeMultiplier: surge,
    surgeAmount,
    gstAmount,
    discount: Math.round(discountAmount),
    tollEstimate,
    nightCharges,
    totalFare,
    driverTakeHome,
    platformCommission,
  };
}

export function generateInterpolatedPath(
  start: [number, number],
  end: [number, number],
  intermediatePoints: [number, number][] = [],
  totalSteps = 40
): [number, number][] {
  const allWaypoints = [start, ...intermediatePoints, end];
  const fullPath: [number, number][] = [];

  for (let i = 0; i < allWaypoints.length - 1; i++) {
    const p1 = allWaypoints[i];
    const p2 = allWaypoints[i + 1];
    const segmentSteps = Math.max(8, Math.floor(totalSteps / (allWaypoints.length - 1)));

    for (let step = 0; step <= segmentSteps; step++) {
      const progress = step / segmentSteps;
      
      // Add natural city road jitter
      const jitterFactor = Math.sin(progress * Math.PI) * 0.0022;
      const lat = p1[0] + (p2[0] - p1[0]) * progress + (i % 2 === 0 ? jitterFactor : -jitterFactor);
      const lng = p1[1] + (p2[1] - p1[1]) * progress + (i % 2 === 1 ? jitterFactor : -jitterFactor);
      
      fullPath.push([lat, lng]);
    }
  }

  return fullPath;
}
