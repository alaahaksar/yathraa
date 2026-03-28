import React, { useState, useEffect } from 'react';
import { BUS_STOPS, ROUTES, TRANSLATIONS } from '../constants';
import { useTheme } from '../ThemeContext';
import { Search, MapPin, Navigation, Clock, Bus, ChevronRight, Copy, Check, Download } from 'lucide-react';
import { cn } from '../lib/utils';
import { Route, BusStop, NavigationStep } from '../types';

interface RouteFinderProps {
  onRouteFound: (route: Route, stops: BusStop[]) => void;
  onFromChange?: (stopId: string | undefined) => void;
  onToChange?: (stopId: string | undefined) => void;
  navigationSteps?: NavigationStep[];
  isGenerating?: boolean;
  userLocation?: [number, number, number];
}

function SearchableSelect({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder, 
  icon: Icon,
  onUseLocation,
  useLocationText = "Use My Location"
}: { 
  label: string; 
  value: string; 
  onChange: (val: string) => void; 
  options: BusStop[]; 
  placeholder: string;
  icon: any;
  onUseLocation?: () => void;
  useLocationText?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const selectedOption = options.find(o => o.id === value);
  const filteredOptions = options.filter(o => 
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
        {onUseLocation && (
          <div className="flex gap-2">
            <button 
              onClick={onUseLocation}
              className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <MapPin size={10} />
              {useLocationText}
            </button>
          </div>
        )}
      </div>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={isOpen ? search : (selectedOption?.name || '')}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => {
            setIsOpen(true);
            setSearch('');
          }}
          onBlur={() => {
            // Delay to allow clicking on option
            setTimeout(() => setIsOpen(false), 200);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <button
                  key={option.id}
                  onMouseDown={(e) => {
                    // Use onMouseDown instead of onClick to fire before onBlur
                    e.preventDefault();
                    onChange(option.id);
                    setSearch(option.name);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white text-sm"
                >
                  {option.name}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-zinc-500">No results found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RouteFinder({ 
  onRouteFound, 
  onFromChange,
  onToChange,
  navigationSteps = [], 
  isGenerating = false, 
  userLocation 
}: RouteFinderProps) {
  const { language } = useTheme();
  const t = TRANSLATIONS[language];

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [availableRoutes, setAvailableRoutes] = useState<Route[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isRefiningLocation, setIsRefiningLocation] = useState(false);

  useEffect(() => {
    onFromChange?.(from || undefined);
  }, [from, onFromChange]);

  useEffect(() => {
    onToChange?.(to || undefined);
  }, [to, onToChange]);

  useEffect(() => {
    const handleSelectStop = (e: any) => {
      setTo(e.detail.stopId);
    };
    window.addEventListener('select-destination-stop', handleSelectStop);
    return () => window.removeEventListener('select-destination-stop', handleSelectStop);
  }, []);

  const handleUseMyLocation = () => {
    if (!userLocation) {
      alert("Location access is required to use this feature.");
      return;
    }

    setIsRefiningLocation(true);

    // Wait for a few seconds to get a more accurate reading if current accuracy is low (> 50m)
    const findNearest = () => {
      let nearestStop = BUS_STOPS[0];
      let minDistance = Infinity;

      BUS_STOPS.forEach(stop => {
        const dist = calculateDistance(userLocation[0], userLocation[1], stop.lat, stop.lng);
        if (dist < minDistance) {
          minDistance = dist;
          nearestStop = stop;
        }
      });

      setFrom(nearestStop.id);
      setIsRefiningLocation(false);
    };

    if (userLocation[2] > 50) {
      // If accuracy is poor, wait up to 3 seconds for a better fix
      setTimeout(findNearest, 3000);
    } else {
      findNearest();
    }
  };

  const handleDownload = () => {
    if (navigationSteps.length === 0) return;

    const text = `Yathra - Offline Journey Guide\n\n` + 
                 `Date: ${new Date().toLocaleString()}\n` +
                 `From: ${BUS_STOPS.find(s => s.id === from)?.name || 'Unknown'}\n` +
                 `To: ${BUS_STOPS.find(s => s.id === to)?.name || 'Unknown'}\n\n` +
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

  const handleCopy = () => {
    const text = navigationSteps.map((s, i) => `${i + 1}. ${s.instruction}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFindRoutes = () => {
    if (!from || !to) return;

    // Find all routes that contain both from and to in the correct order
    const matchingRoutes = ROUTES.filter(r => {
      const fromIdx = r.stops.indexOf(from);
      const toIdx = r.stops.indexOf(to);
      return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
    });

    setAvailableRoutes(matchingRoutes);
    setSelectedRouteId(null);
    if (matchingRoutes.length === 0) {
      alert("No direct routes found between these locations.");
    }
  };

  const handleSelectRoute = (route: Route) => {
    setSelectedRouteId(route.id);
    const fromIdx = route.stops.indexOf(from);
    const toIdx = route.stops.indexOf(to);
    const relevantStops = route.stops.slice(fromIdx, toIdx + 1).map(id => 
      BUS_STOPS.find(s => s.id === id)!
    );
    onRouteFound(route, relevantStops);
  };

  React.useEffect(() => {
    if (from && to) {
      const matchingRoutes = ROUTES.filter(r => {
        const fromIdx = r.stops.indexOf(from);
        const toIdx = r.stops.indexOf(to);
        return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
      });
      setAvailableRoutes(matchingRoutes);
      if (matchingRoutes.length > 0) {
        handleSelectRoute(matchingRoutes[0]);
      }
    } else {
      setAvailableRoutes([]);
      setSelectedRouteId(null);
    }
  }, [from, to]);

  const selectedRoute = ROUTES.find(r => r.id === selectedRouteId);

  const calculateArrivalTime = (departureTime: string, totalDuration: number, totalStops: number, stopIndex: number) => {
    if (!departureTime) return "";
    
    // Parse departure time
    const [time, period] = departureTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period.toLowerCase() === 'pm' && hours !== 12) hours += 12;
    if (period.toLowerCase() === 'am' && hours === 12) hours = 0;
    
    // Calculate minutes from start
    const minutesPerStop = totalDuration / (totalStops - 1);
    const additionalMinutes = Math.round(stopIndex * minutesPerStop);
    
    // Add minutes
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + additionalMinutes);
    
    // Format back
    let h = date.getHours();
    const m = date.getMinutes();
    const p = h >= 12 ? 'pm' : 'am';
    h = h % 12;
    if (h === 0) h = 12;
    
    return `${h}:${m.toString().padStart(2, '0')} ${p}`;
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="space-y-4">
          {/* From */}
          <SearchableSelect
            label={t.from}
            value={from}
            onChange={(val) => {
              setFrom(val);
              setAvailableRoutes([]);
              setSelectedRouteId(null);
            }}
            options={BUS_STOPS}
            placeholder={t.selectLocation}
            icon={MapPin}
            onUseLocation={handleUseMyLocation}
            useLocationText={isRefiningLocation ? "Refining..." : userLocation && userLocation[2] < 30 ? "Current Location (High Accuracy)" : "Use My Location"}
          />

          {/* To */}
          <SearchableSelect
            label={t.to}
            value={to}
            onChange={(val) => {
              setTo(val);
              setAvailableRoutes([]);
              setSelectedRouteId(null);
            }}
            options={BUS_STOPS}
            placeholder={t.selectLocation}
            icon={Navigation}
            useLocationText="Pick on Map"
            onUseLocation={() => {
              window.dispatchEvent(new CustomEvent('show-all-stops'));
              alert("Click on any bus stop marker on the map to set it as your destination.");
            }}
          />

          <button
            onClick={handleFindRoutes}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            {t.findRoute}
          </button>
        </div>
      </div>

      {availableRoutes.length > 0 && !selectedRouteId && (
        <div className="space-y-3">
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider px-1">Available Buses</p>
          {availableRoutes.map(route => (
            <button
              key={route.id}
              onClick={() => handleSelectRoute(route)}
              className={cn(
                "w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group",
                selectedRouteId === route.id 
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20" 
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-blue-500"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex flex-col items-center justify-center",
                  selectedRouteId === route.id ? "bg-white/20" : "bg-zinc-100 dark:bg-zinc-800"
                )}>
                  <Bus size={20} className={selectedRouteId === route.id ? "text-white" : "text-blue-600"} />
                  <span className="text-[10px] font-bold mt-0.5">{route.busType === 'Fast Passenger' ? 'FP' : 'ORD'}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg leading-tight">
                      {calculateArrivalTime(
                        route.departureTime, 
                        route.duration, 
                        route.stops.length,
                        route.stops.indexOf(from)
                      )}
                    </p>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider",
                      selectedRouteId === route.id ? "bg-white/20 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                    )}>
                      ETA
                    </span>
                  </div>
                  <p className={cn(
                    "text-xs font-medium",
                    selectedRouteId === route.id ? "text-white/80" : "text-zinc-500"
                  )}>
                    {(() => {
                      const fromStop = BUS_STOPS.find(s => s.id === from);
                      const toStop = BUS_STOPS.find(s => s.id === to);
                      if (route.distance) {
                        return `${route.distance.toFixed(1)} km • ${route.duration} min • `;
                      }
                      if (fromStop && toStop) {
                        const dist = calculateDistance(fromStop.lat, fromStop.lng, toStop.lat, toStop.lng);
                        return `${dist.toFixed(1)} km • ${route.duration} min • `;
                      }
                      return "";
                    })()}
                    Original: {route.departureTime} • {route.busNumber}
                  </p>
                </div>
              </div>
              <ChevronRight className={cn(
                "w-5 h-5 transition-transform group-hover:translate-x-1",
                selectedRouteId === route.id ? "text-white" : "text-zinc-400"
              )} />
            </button>
          ))}
        </div>
      )}

      {selectedRouteId && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{t.routeFound}</h3>
            <button 
              onClick={() => setSelectedRouteId(null)}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Change Bus
            </button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
              <Bus className="w-4 h-4" />
              {selectedRoute?.busNumber}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6 text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{t.duration}: {selectedRoute?.duration} mins</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">{t.steps}</p>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
              {selectedRoute?.stops.slice(selectedRoute.stops.indexOf(from), selectedRoute.stops.indexOf(to) + 1).map((stopId, idx, arr) => {
                const stop = BUS_STOPS.find(s => s.id === stopId)!;
                return (
                  <div key={stopId} className="relative">
                    <div className={cn(
                      "absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 bg-white dark:bg-zinc-900 z-10",
                      idx === 0 ? "border-blue-600" : idx === arr.length - 1 ? "border-green-600" : "border-zinc-400"
                    )} />
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">{stop.name}</p>
                        {idx < arr.length - 1 && (
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-zinc-500">
                              {idx === 0 ? "Start journey" : "Continue to next stop"}
                            </p>
                            {(() => {
                              const nextStop = BUS_STOPS.find(s => s.id === arr[idx + 1])!;
                              const dist = calculateDistance(stop.lat, stop.lng, nextStop.lat, nextStop.lng);
                              return (
                                <span className="text-[10px] text-zinc-400 font-bold px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">
                                  {dist.toFixed(1)} km
                                </span>
                              );
                            })()}
                          </div>
                        )}
                        {idx === arr.length - 1 && (
                          <p className="text-xs text-green-600 font-medium mt-1">
                            Destination reached
                          </p>
                        )}
                      </div>
                      {selectedRoute?.departureTime && (
                        <div className="flex items-center gap-1 text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          <Clock className="w-3 h-3" />
                          {calculateArrivalTime(
                            selectedRoute.departureTime, 
                            selectedRoute.duration, 
                            selectedRoute.stops.length,
                            selectedRoute.stops.indexOf(stopId)
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {isGenerating && (
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm font-medium text-zinc-500">Generating detailed transcription...</p>
        </div>
      )}

      {navigationSteps.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{t.detailedTranscription}</h3>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={handleDownload}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500"
                title="Download transcription"
              >
                <Download className="w-4 h-4" />
              </button>
              <button 
                onClick={handleCopy}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500"
                title="Copy transcription"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {navigationSteps.map((step, idx) => (
              <div key={idx} className="flex gap-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                  {step.type === 'bus' ? <Bus size={16} className="text-blue-600" /> : 
                   step.type === 'walk' ? <Search size={16} className="text-zinc-500" /> : 
                   <MapPin size={16} className="text-green-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed">
                    {step.instruction}
                  </p>
                  {step.distance > 0 && (
                    <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-wider">
                      {step.distance.toFixed(1)}m • {Math.round(step.duration)}s
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
