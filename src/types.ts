export type Language = 'en' | 'hi' | 'ml';

export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface Route {
  id: string;
  from: string;
  to: string;
  stops: string[]; // IDs of BusStops
  duration: number; // in minutes
  busNumber: string;
  departureTime?: string;
  busType?: 'Ordinary' | 'Fast Passenger' | 'Super Fast' | 'Electric Bus';
  distance?: number; // in km
}

export interface NavigationStep {
  instruction: string;
  distance: number;
  duration: number;
  type: 'walk' | 'bus' | 'arrival';
  stopId?: string;
  lat: number;
  lng: number;
}

export interface TripStats {
  distance: number;
  duration: number;
  polyline: [number, number][];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  preferredLanguage: Language;
  theme: 'light' | 'dark';
}
