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

  if (totalKm < 0.1) totalKm = 0.1; // Prevent zero/negative distance

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
  
  // Strict calculation: perKmRate * distanceKm
  const rate = (bookingType === 'outstation' && outstationType === 'round_trip')
    ? catConfig.perKmRate * 2
    : catConfig.perKmRate;

  const totalFare = Math.round(distanceKm * rate);
  const platformCommission = Math.round(totalFare * (pricingConfig.platformFeePercent / 100));
  const driverTakeHome = Math.max(0, totalFare - platformCommission);

  return {
    baseFare: 0,
    distanceFare: totalFare,
    timeFare: 0,
    surgeMultiplier: 1.0,
    surgeAmount: 0,
    gstAmount: 0,
    discount: 0,
    tollEstimate: 0,
    nightCharges: 0,
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

export async function fetchRealRoadRoute(
  pickup: LocationPoint,
  destination: LocationPoint,
  stops: LocationPoint[] = []
): Promise<{ distanceKm: number; durationMinutes: number; routeCoordinates: [number, number][] }> {
  try {
    const waypoints = [
      `${pickup.lng},${pickup.lat}`,
      ...stops.map(s => `${s.lng},${s.lat}`),
      `${destination.lng},${destination.lat}`
    ].join(';');

    const url = `https://router.projectosrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('OSRM API request failed');
    
    const data = await response.json();
    if (data.code !== 'Ok' || !data.routes || !data.routes.length) {
      throw new Error('OSRM route code is not Ok');
    }

    const route = data.routes[0];
    const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
    const durationMinutes = Math.max(2, Math.round(route.duration / 60));
    
    // Convert [lng, lat] to [lat, lng] for Leaflet
    const routeCoordinates: [number, number][] = route.geometry.coordinates.map(
      (c: [number, number]) => [c[1], c[0]] as [number, number]
    );

    return { distanceKm, durationMinutes, routeCoordinates };
  } catch (error) {
    console.warn('OSRM Route fetch failed, using haversine fallback:', error);
    const { distanceKm, durationMinutes } = calculateRouteDistance(pickup, destination, stops);
    const intermediateCoords: [number, number][] = stops.map(s => [s.lat, s.lng]);
    const routeCoordinates = generateInterpolatedPath(
      [pickup.lat, pickup.lng],
      [destination.lat, destination.lng],
      intermediateCoords,
      50
    );
    return { distanceKm, durationMinutes, routeCoordinates };
  }
}
