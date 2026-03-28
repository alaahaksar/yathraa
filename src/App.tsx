import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';
import Sidebar from './components/Sidebar';
import Map from './components/Map';
import RouteFinder from './components/RouteFinder';
import Auth from './components/Auth';
import { auth, onAuthStateChanged, signOut, db, doc, setDoc, getDoc, handleFirestoreError, OperationType } from './firebase';
import { GoogleGenAI } from "@google/genai";
import { Menu, Navigation, MapPin, Bus, Flag, ChevronRight, Info, Globe, ChevronDown, User } from 'lucide-react';
import { BusStop, Route, TripStats, NavigationStep, Language } from './types';
import { TRANSLATIONS, BUS_STOPS, LANGUAGES } from './constants';
import { cn } from './lib/utils';
import { generateEnrichedInstructions } from './services/geminiService';

function AppContent() {
  const { language, theme, setLanguage } = useTheme();
  const t = TRANSLATIONS[language];
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStops, setSelectedStops] = useState<BusStop[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New state for navigation
  const [userLocation, setUserLocation] = useState<[number, number, number] | undefined>();
  const [userHeading, setUserHeading] = useState(0);
  const [tripStats, setTripStats] = useState<TripStats | null>(null);
  const [navigationSteps, setNavigationSteps] = useState<NavigationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [arrivalNotification, setArrivalNotification] = useState<string | null>(null);
  const [isGeneratingInstructions, setIsGeneratingInstructions] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [fromStopId, setFromStopId] = useState<string | undefined>();
  const [toStopId, setToStopId] = useState<string | undefined>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Sync user profile to Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userDoc = await getDoc(userRef);
          if (!userDoc.exists()) {
            await setDoc(userRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || 'User',
              preferredLanguage: language,
              theme: theme,
            });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}`);
        }
      }
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [language, theme]);

  // User location tracking
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, heading, accuracy } = pos.coords;
        setUserLocation([latitude, longitude, accuracy]);
        if (heading !== null) setUserHeading(heading);
      },
      (err) => console.error('Geolocation error:', err),
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 0 
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Proximity detection
  useEffect(() => {
    if (!userLocation || navigationSteps.length === 0 || currentStepIndex >= navigationSteps.length) return;

    const currentStep = navigationSteps[currentStepIndex];
    
    // Simple distance formula (Haversine or similar)
    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371e3; // metres
      const φ1 = lat1 * Math.PI/180;
      const φ2 = lat2 * Math.PI/180;
      const Δφ = (lat2-lat1) * Math.PI/180;
      const Δλ = (lon2-lon1) * Math.PI/180;
      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    const dist = getDistance(userLocation[0], userLocation[1], currentStep.lat, currentStep.lng);

    if (dist < 100) { // 100m proximity
      if (currentStepIndex < navigationSteps.length - 1) {
        // Show arrival notification
        if (currentStep.type === 'bus' || currentStep.type === 'arrival') {
          setArrivalNotification(`Arriving at ${currentStep.instruction.split('at ')[1] || 'next stop'}`);
          setTimeout(() => setArrivalNotification(null), 5000);
        }
        setCurrentStepIndex(prev => prev + 1);
      }
    }
  }, [userLocation, navigationSteps, currentStepIndex]);

  // Generate Enriched Instructions with Gemini
  const generateInstructions = async (stops: BusStop[], stats: TripStats) => {
    setIsGeneratingInstructions(true);
    setNavigationSteps([]); // Clear previous
    try {
      const steps = await generateEnrichedInstructions(stops, stats, language);
      setNavigationSteps(steps);
      setCurrentStepIndex(0);
    } catch (error) {
      console.error('Gemini instruction generation failed after retries:', error);
      // Fallback basic steps
      const fallbackSteps: NavigationStep[] = stops.map((s, i) => ({
        instruction: i === 0 ? `Board at ${s.name} (Left side)` : i === stops.length - 1 ? `Arrive at ${s.name} (Left side)` : `Pass through ${s.name} (Left side)`,
        type: i === 0 ? 'bus' : i === stops.length - 1 ? 'arrival' : 'bus',
        distance: 0,
        duration: 0,
        lat: s.lat,
        lng: s.lng
      }));
      setNavigationSteps(fallbackSteps);
      setCurrentStepIndex(0);
    } finally {
      setIsGeneratingInstructions(false);
    }
  };

  useEffect(() => {
    if (selectedStops.length > 1 && tripStats && navigationSteps.length === 0) {
      generateInstructions(selectedStops, tripStats);
    }
  }, [selectedStops, tripStats, language, navigationSteps.length]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleRouteFound = (route: Route, stops: BusStop[]) => {
    setSelectedStops(stops);
    setIsTracking(false);
  };

  const handleStopSelect = (stopId: string) => {
    // If we have a 'from' stop, set this as 'to'
    // This requires communication with RouteFinder, but for now we can just alert
    // or use a global state if we had one.
    // Let's use a custom event to communicate with RouteFinder
    window.dispatchEvent(new CustomEvent('select-destination-stop', { detail: { stopId } }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative lg:ml-64">
        {/* Arrival Notification Pop-up */}
        {arrivalNotification && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[60] animate-in zoom-in duration-300">
            <div className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
              <Bus className="animate-bounce" />
              <p className="font-bold">{arrivalNotification}</p>
            </div>
          </div>
        )}

        {/* Navigation Overlay */}
        {navigationSteps.length > 0 && (
          <div className="absolute top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  {navigationSteps[currentStepIndex].type === 'bus' ? <Bus size={20} /> : <MapPin size={20} />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Next Step</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2">
                    {navigationSteps[currentStepIndex].instruction}
                  </p>
                </div>
              </div>
              
              {tripStats && (
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg">
                    <p className="text-[10px] text-zinc-500 uppercase">Distance</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{tripStats.distance.toFixed(1)} km</p>
                  </div>
                  <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg">
                    <p className="text-[10px] text-zinc-500 uppercase">ETA</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{Math.round(tripStats.duration)} mins</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <Navigation className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold">Yathra</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-zinc-200 dark:border-zinc-800">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <User size={16} />
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden flex flex-col lg:flex-row">
          {/* Controls Panel */}
          <div className="w-full lg:w-96 p-6 overflow-y-auto border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-10">
            <RouteFinder 
              onRouteFound={handleRouteFound} 
              onFromChange={setFromStopId}
              onToChange={setToStopId}
              navigationSteps={navigationSteps}
              isGenerating={isGeneratingInstructions}
              userLocation={userLocation}
            />
          </div>

          {/* Map Area */}
          <div className="flex-1 relative h-full">
            <Map 
              selectedStops={selectedStops} 
              fromStopId={fromStopId}
              toStopId={toStopId}
              userLocation={userLocation ? [userLocation[0], userLocation[1]] : undefined}
              userHeading={userHeading}
              onRouteStats={setTripStats}
              isTracking={isTracking}
              onToggleTracking={setIsTracking}
              navigationSteps={navigationSteps}
              onStopSelect={handleStopSelect}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
