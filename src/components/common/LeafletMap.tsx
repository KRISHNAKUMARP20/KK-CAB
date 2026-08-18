import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { LocationPoint, Driver, RideStatus, GeofenceZone } from '../../types';

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  pickup?: LocationPoint | null;
  destination?: LocationPoint | null;
  stops?: LocationPoint[];
  drivers?: Driver[];
  activeDriverPosition?: [number, number] | null;
  routeCoordinates?: [number, number][];
  geofences?: GeofenceZone[];
  rideStatus?: RideStatus;
  onMapClick?: (lat: number, lng: number) => void;
  interactive?: boolean;
  className?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center = [28.5850, 77.1650],
  zoom = 12,
  pickup,
  destination,
  stops = [],
  drivers = [],
  activeDriverPosition,
  routeCoordinates,
  geofences = [],
  rideStatus = 'idle',
  onMapClick,
  interactive = true,
  className = 'h-full w-full',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [center[0], center[1]] as L.LatLngTuple,
        zoom,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Dark/Voyager tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;

      if (onMapClick) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          onMapClick(e.latlng.lat, e.latlng.lng);
        });
      }

      mapInstanceRef.current = map;
    }

    return () => {
      // Keep instance intact across lightweight rerenders
    };
  }, []);

  // Update Markers, Geofence Circles, Route Polylines
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // 1. Render Geofence Zones (if provided)
    geofences.forEach(geo => {
      const isSurge = geo.surgeMultiplier > 1.0;
      const circle = L.circle([geo.centerLat, geo.centerLng], {
        radius: geo.radiusMeters,
        color: isSurge ? '#f59e0b' : '#38bdf8',
        fillColor: isSurge ? '#f59e0b' : '#38bdf8',
        fillOpacity: isSurge ? 0.18 : 0.08,
        weight: 1.5,
        dashArray: isSurge ? '4, 4' : undefined,
      });

      circle.bindTooltip(
        `<div class="p-1 text-xs">
          <div class="font-bold text-amber-400">${geo.name}</div>
          <div class="text-[10px] text-slate-300">Surge: ${geo.surgeMultiplier}x • Demand: ${geo.activeDemandIndex}</div>
        </div>`,
        { permanent: false, direction: 'top' }
      );
      markersLayer.addLayer(circle);
    });

    // 2. Render Pickup Marker
    if (pickup) {
      const pickupIcon = L.divIcon({
        className: 'custom-pin-pickup',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute -top-1 w-7 h-7 bg-emerald-500 rounded-full opacity-40 animate-ping"></div>
            <div class="w-7 h-7 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-slate-950 shadow-xl font-bold text-[11px]">
              P
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const pMarker = L.marker([pickup.lat, pickup.lng], { icon: pickupIcon });
      pMarker.bindPopup(`
        <div class="p-2 text-xs">
          <span class="bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px] uppercase">Pickup</span>
          <p class="font-bold text-white mt-1 text-sm">${pickup.name}</p>
          <p class="text-slate-400 text-[11px]">${pickup.address}</p>
        </div>
      `);
      markersLayer.addLayer(pMarker);
    }

    // 3. Render Intermediate Stops
    stops.forEach((stop, idx) => {
      const stopIcon = L.divIcon({
        className: 'custom-pin-stop',
        html: `
          <div class="w-6 h-6 bg-cyan-500 border-2 border-white rounded-full flex items-center justify-center text-slate-950 shadow-lg font-bold text-[10px]">
            ${idx + 1}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      const sMarker = L.marker([stop.lat, stop.lng], { icon: stopIcon });
      sMarker.bindPopup(`
        <div class="p-1.5 text-xs">
          <span class="bg-cyan-500/20 text-cyan-400 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">Stop #${idx + 1}</span>
          <p class="font-bold text-white text-xs mt-0.5">${stop.name}</p>
        </div>
      `);
      markersLayer.addLayer(sMarker);
    });

    // 4. Render Destination Marker
    if (destination) {
      const dropIcon = L.divIcon({
        className: 'custom-pin-drop',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-7 h-7 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-white shadow-xl font-bold text-[11px]">
              D
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const dMarker = L.marker([destination.lat, destination.lng], { icon: dropIcon });
      dMarker.bindPopup(`
        <div class="p-2 text-xs">
          <span class="bg-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded text-[10px] uppercase">Destination</span>
          <p class="font-bold text-white mt-1 text-sm">${destination.name}</p>
          <p class="text-slate-400 text-[11px]">${destination.address}</p>
        </div>
      `);
      markersLayer.addLayer(dMarker);
    }

    // 5. Render Surrounding Fleet Drivers (when not in exclusive active ride)
    if (rideStatus === 'idle' || rideStatus === 'searching') {
      drivers.forEach((drv) => {
        if (!drv.isOnline) return;
        const isEv = drv.vehicle.category === 'electric';
        const cabColor = isEv ? 'bg-cyan-400 border-cyan-200' : 'bg-amber-400 border-amber-200';

        const carIcon = L.divIcon({
          className: 'custom-fleet-cab',
          html: `
            <div class="relative group">
              <div class="w-6 h-6 ${cabColor} rounded-full border-2 shadow-lg flex items-center justify-center text-slate-950 font-black text-[10px]">
                🚖
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const cMarker = L.marker([drv.currentLocation.lat, drv.currentLocation.lng], { icon: carIcon });
        cMarker.bindTooltip(`
          <div class="p-1 text-xs">
            <div class="font-bold text-white">${drv.name} (${drv.vehicle.model})</div>
            <div class="text-[10px] text-amber-400 font-mono">${drv.vehicle.licensePlate} • ${drv.rating} ★</div>
          </div>
        `, { direction: 'top' });
        markersLayer.addLayer(cMarker);
      });
    }

    // 6. Render Active In-Trip Simulated Car
    if (activeDriverPosition) {
      const activeCarIcon = L.divIcon({
        className: 'custom-active-cab',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-10 h-10 bg-amber-400 rounded-full opacity-30 animate-ping"></div>
            <div class="w-8 h-8 bg-gradient-to-tr from-amber-500 to-amber-300 border-2 border-slate-950 rounded-full flex items-center justify-center text-slate-950 shadow-2xl font-black text-sm">
              🚕
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const carMarker = L.marker([activeDriverPosition[0], activeDriverPosition[1]], { icon: activeCarIcon });
      markersLayer.addLayer(carMarker);
    }

    // 7. Render Route Polyline
    if (routeCoordinates && routeCoordinates.length > 1) {
      const latLngs = routeCoordinates.map(c => [c[0], c[1]] as L.LatLngTuple);
      
      // Glow polyline
      const glowLine = L.polyline(latLngs, {
        color: '#f59e0b',
        weight: 6,
        opacity: 0.35,
      });
      markersLayer.addLayer(glowLine);

      // Sharp main polyline
      const mainLine = L.polyline(latLngs, {
        color: '#fbbf24',
        weight: 3.5,
        opacity: 0.95,
      });
      markersLayer.addLayer(mainLine);

      // Auto fit bounds smoothly
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
    } else if (pickup && destination) {
      const bounds = L.latLngBounds([[pickup.lat, pickup.lng], [destination.lat, destination.lng]]);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [pickup, destination, stops, drivers, activeDriverPosition, routeCoordinates, geofences, rideStatus]);

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-slate-800 shadow-2xl ${className}`}>
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
};
