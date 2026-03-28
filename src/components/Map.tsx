import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { BusStop, TripStats, NavigationStep } from '../types';
import { BUS_STOPS } from '../constants';
import { useTheme } from '../ThemeContext';
import { cn } from '../lib/utils';
import { Navigation, Plus, Minus, FileText } from 'lucide-react';

// Fix for default marker icons in Leaflet with React
const markerIcon2x = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const markerIcon = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const markerShadow = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

// Custom icons
const stopIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const busIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const userIcon = (heading: number) => L.divIcon({
  className: 'user-location-marker',
  html: `<div style="transform: rotate(${heading}deg); transition: transform 0.2s ease;">
          <div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-white mb-1"></div>
          </div>
        </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const destinationIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1483/1483336.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapProps {
  selectedStops?: BusStop[];
  fromStopId?: string;
  toStopId?: string;
  center?: [number, number];
  userLocation?: [number, number];
  userHeading?: number;
  onRouteStats?: (stats: TripStats) => void;
  isTracking?: boolean;
  onToggleTracking?: (tracking: boolean) => void;
  navigationSteps?: NavigationStep[];
  onStopSelect?: (stopId: string) => void;
}

function MapController({ 
  center, 
  zoom, 
  polyline, 
  walkingPolyline, 
  stops, 
  isTracking,
  userLocation
}: { 
  center: [number, number], 
  zoom?: number,
  polyline: [number, number][],
  walkingPolyline: [number, number][],
  stops: BusStop[],
  isTracking: boolean,
  userLocation?: [number, number]
}) {
  const map = useMap();

  // Handle Zoom Events
  useEffect(() => {
    const zoomIn = () => map.zoomIn();
    const zoomOut = () => map.zoomOut();
    const fitBounds = (e: any) => {
      if (e.detail?.points?.length > 1) {
        map.fitBounds(L.latLngBounds(e.detail.points), { padding: [50, 50], maxZoom: 16 });
      }
    };

    window.addEventListener('map-zoom-in', zoomIn);
    window.addEventListener('map-zoom-out', zoomOut);
    window.addEventListener('map-fit-bounds', fitBounds);

    return () => {
      window.removeEventListener('map-zoom-in', zoomIn);
      window.removeEventListener('map-zoom-out', zoomOut);
      window.removeEventListener('map-fit-bounds', fitBounds);
    };
  }, [map]);

  // Handle View Changes
  useEffect(() => {
    if (isTracking && userLocation) {
      map.setView(userLocation, 17, { animate: true });
    } else if (!isTracking) {
      const allPoints = [...walkingPolyline, ...polyline];
      if (allPoints.length > 1) {
        try {
          map.fitBounds(L.latLngBounds(allPoints), { padding: [50, 50], maxZoom: 16 });
        } catch (e) {
          console.error("Fit bounds failed", e);
        }
      } else if (stops.length > 0) {
        map.setView([stops[0].lat, stops[0].lng], 15, { animate: true });
      } else if (userLocation) {
        map.setView(userLocation, 15, { animate: true });
      } else {
        map.setView(center, zoom || 13, { animate: true });
      }
    }
  }, [map, isTracking, userLocation, polyline, walkingPolyline, stops, center, zoom]);

  // Handle Resize
  useEffect(() => {
    const timer = setTimeout(() => {
      if (map) map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

export default function Map({ 
  selectedStops = [], 
  fromStopId,
  toStopId,
  center = [8.4831, 76.9504],
  userLocation,
  userHeading = 0,
  onRouteStats,
  isTracking = false,
  onToggleTracking,
  navigationSteps = [],
  onStopSelect
}: MapProps) {
  const { theme } = useTheme();
  const [routePolyline, setRoutePolyline] = useState<[number, number][]>([]);
  const [walkingPolyline, setWalkingPolyline] = useState<[number, number][]>([]);
  const [eta, setEta] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [showAllStops, setShowAllStops] = useState(false);

  // Listen for "Pick on Map" mode
  useEffect(() => {
    const handleShowStops = () => {
      setShowAllStops(true);
      // Auto-hide after 10 seconds if no stop selected
      const timer = setTimeout(() => setShowAllStops(false), 10000);
      return () => clearTimeout(timer);
    };
    window.addEventListener('show-all-stops', handleShowStops);
    return () => window.removeEventListener('show-all-stops', handleShowStops);
  }, []);

  // Fetch OSRM Route
  useEffect(() => {
    if (selectedStops.length < 2) {
      setRoutePolyline([]);
      setWalkingPolyline([]);
      setEta(null);
      setDistance(null);
      return;
    }

    const fetchRoute = async () => {
      try {
        // 1. Fetch Walking Route to first stop if user location is available
        if (userLocation) {
          const walkCoords = `${userLocation[1]},${userLocation[0]};${selectedStops[0].lng},${selectedStops[0].lat}`;
          const walkResponse = await fetch(`https://router.project-osrm.org/route/v1/walking/${walkCoords}?overview=full&geometries=geojson`);
          const walkData = await walkResponse.json();
          if (walkData.code === 'Ok' && walkData.routes.length > 0) {
            setWalkingPolyline(walkData.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]] as [number, number]));
          }
        } else {
          setWalkingPolyline([]);
        }

        // 2. Fetch Bus Route between stops
        const coords = selectedStops.map(s => `${s.lng},${s.lat}`).join(';');
        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
        const data = await response.json();

        if (data.code === 'Ok' && data.routes.length > 0) {
          const polyline = data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]] as [number, number]);
          setRoutePolyline(polyline);
          
          const stats: TripStats = {
            distance: data.routes[0].distance / 1000,
            duration: data.routes[0].duration / 60,
            polyline
          };
          setEta(Math.round(stats.duration));
          setDistance(stats.distance);
          onRouteStats?.(stats);
        }
      } catch (error) {
        console.error('OSRM fetch failed, falling back to direct lines', error);
        const direct = selectedStops.map(s => [s.lat, s.lng] as [number, number]);
        setRoutePolyline(direct);
      }
    };

    fetchRoute();
    
    // Refresh route every 30s if tracking
    let interval: any;
    if (isTracking) {
      interval = setInterval(fetchRoute, 30000);
    }
    return () => clearInterval(interval);
  }, [selectedStops, isTracking, userLocation]);

  const handleDownloadGuide = () => {
    if (navigationSteps.length === 0) return;

    const text = `Yathra - Offline Journey Guide\n\n` + 
                 `Date: ${new Date().toLocaleString()}\n` +
                 `From: ${selectedStops[0]?.name || 'Unknown'}\n` +
                 `To: ${selectedStops[selectedStops.length - 1]?.name || 'Unknown'}\n\n` +
                 `OFFLINE TRANSCRIPT:\n` +
                 `-------------------\n` +
                 navigationSteps.map((s, i) => `${i + 1}. ${s.instruction}`).join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yathra-offline-guide.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Determine which stops to show
  const visibleStops = BUS_STOPS.filter(stop => {
    if (showAllStops) return true;
    if (selectedStops.some(s => s.id === stop.id)) return true;
    if (stop.id === fromStopId || stop.id === toStopId) return true;
    return false;
  });

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner bg-zinc-200 dark:bg-zinc-800">
      <MapContainer 
        center={center} 
        zoom={13} 
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <MapController 
          center={center}
          polyline={routePolyline}
          walkingPolyline={walkingPolyline}
          stops={selectedStops}
          isTracking={isTracking}
          userLocation={userLocation}
        />
        <TileLayer 
          url={theme === 'dark' 
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          } 
          attribution={theme === 'dark'
            ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        />

        {visibleStops.map((stop) => (
          <Marker 
            key={stop.id} 
            position={[stop.lat, stop.lng]}
            icon={selectedStops.find(s => s.id === stop.id) && stop.id === selectedStops[selectedStops.length - 1].id ? destinationIcon : stopIcon}
            eventHandlers={{
              click: () => {
                onStopSelect?.(stop.id);
                if (showAllStops) setShowAllStops(false);
              }
            }}
          >
            <Popup>
              <div className="p-1">
                <p className="font-bold text-zinc-900 dark:text-white">{stop.name}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {(() => {
                    const idx = selectedStops.findIndex(s => s.id === stop.id);
                    if (idx === -1) return 'Bus Stop (Click to select as destination)';
                    if (idx === 0) return 'Start Stop';
                    if (idx === selectedStops.length - 1) return 'Destination';
                    return 'Intermediate Stop';
                  })()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {walkingPolyline.length > 1 && (
          <>
            {/* Glow effect for walking */}
            <Polyline 
              positions={walkingPolyline} 
              color="#94a3b8" 
              weight={10} 
              opacity={0.15} 
            />
            <Polyline 
              positions={walkingPolyline} 
              color="#94a3b8" 
              weight={4} 
              opacity={0.6} 
              dashArray="10, 10"
            />
            <Marker position={walkingPolyline[Math.floor(walkingPolyline.length / 2)]} icon={L.divIcon({
              className: 'walking-label',
              html: `<div class="bg-zinc-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold shadow-sm whitespace-nowrap">WALK</div>`,
              iconSize: [40, 16],
              iconAnchor: [20, 8]
            })} />
          </>
        )}

        {routePolyline.length > 1 && (
          <>
            {/* Glow effect for bus route */}
            <Polyline 
              positions={routePolyline} 
              color="#2563eb" 
              weight={12} 
              opacity={0.2} 
            />
            <Polyline 
              positions={routePolyline} 
              color="#2563eb" 
              weight={6} 
              opacity={0.8} 
            />
            {eta !== null && routePolyline.length > 0 && (
              <Marker position={routePolyline[Math.floor(routePolyline.length / 2)]} icon={L.divIcon({
                className: 'eta-label',
                html: `<div class="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-lg whitespace-nowrap">${isTracking ? 'LIVE ' : ''}ETA: ${eta}m</div>`,
                iconSize: [80, 20],
                iconAnchor: [40, 10]
              })} />
            )}
          </>
        )}

        {userLocation && (
          <Marker 
            position={userLocation} 
            icon={selectedStops.length > 0 ? busIcon : userIcon(userHeading)}
          >
            <Popup>{selectedStops.length > 0 ? "Live Bus Location" : "You are here"}</Popup>
          </Marker>
        )}

        {/* Custom Zoom Controls */}
        <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2">
          {navigationSteps.length > 0 && (
            <button 
              onClick={handleDownloadGuide}
              className="w-10 h-10 bg-blue-600 border border-blue-700 rounded-xl shadow-lg flex items-center justify-center text-white hover:bg-blue-700 transition-all active:scale-90"
              title="Download Text Guide"
            >
              <FileText className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={() => {
              if (routePolyline.length > 1 || walkingPolyline.length > 1) {
                const allPoints = [...walkingPolyline, ...routePolyline];
                window.dispatchEvent(new CustomEvent('map-fit-bounds', { detail: { points: allPoints } }));
              }
            }}
            className="w-10 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-90"
            title="Recenter Route"
          >
            <Navigation className="w-5 h-5" />
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('map-zoom-in'))}
            className="w-10 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-90"
            title="Zoom In"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('map-zoom-out'))}
            className="w-10 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-90"
            title="Zoom Out"
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>
      </MapContainer>

      {/* Start Journey Button */}
      {selectedStops.length > 0 && (
        <div className="absolute top-6 left-6 z-[1000]">
          <button
            onClick={() => onToggleTracking?.(!isTracking)}
            className={cn(
              "px-6 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-2 transition-all active:scale-95",
              isTracking 
                ? "bg-red-600 text-white hover:bg-red-700" 
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {isTracking ? (
              <>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Stop Journey
              </>
            ) : (
              <>
                <Navigation className="w-5 h-5" />
                Start Journey
              </>
            )}
          </button>
        </div>
      )}

      {/* Live Stats Overlay (when tracking) */}
      {isTracking && distance !== null && eta !== null && (
        <div className="absolute top-20 left-6 z-[1000] animate-in slide-in-from-left-4 duration-500">
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl flex flex-col gap-2 min-w-[160px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Distance</span>
              <span className="text-sm font-bold text-blue-600">{distance.toFixed(1)} km</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Remaining</span>
              <span className="text-sm font-bold text-green-600">{eta} mins</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
