import { BusStop, Route } from "./types";

export const BUS_STOPS: BusStop[] = [
  { id: "thiruvananthapuram", name: "Thiruvananthapuram (Central)", lat: 8.4831, lng: 76.9504 },
  { id: "palayam", name: "Palayam", lat: 8.5000, lng: 76.9500 },
  { id: "bakery-junction", name: "Bakery Junction", lat: 8.4950, lng: 76.9550 },
  { id: "vazhuthakkadu", name: "Vazhuthakkadu", lat: 8.4980, lng: 76.9630 },
  { id: "jagathy", name: "Jagathy", lat: 8.4950, lng: 76.9700 },
  { id: "poojappura", name: "Poojappura", lat: 8.4900, lng: 76.9800 },
  { id: "karamana", name: "Karamana", lat: 8.4800, lng: 76.9700 },
  { id: "pappancode", name: "Pappancode", lat: 8.4700, lng: 76.9800 },
  { id: "sct-college", name: "SCT College", lat: 8.4650, lng: 76.9850 },
  { id: "pmg", name: "PMG", lat: 8.5050, lng: 76.9480 },
  { id: "pattom", name: "Pattom", lat: 8.5241, lng: 76.9366 },
  { id: "medical-college", name: "Medical College Thiruvananthapuram", lat: 8.5226, lng: 76.9273 },
  { id: "eastfort", name: "Eastfort", lat: 8.4800, lng: 76.9450 },
  { id: "museum", name: "Museum", lat: 8.5080, lng: 76.9520 },
  { id: "temple", name: "Padmanabhaswamy Temple", lat: 8.4830, lng: 76.9430 },
  { id: "secretariat", name: "Secretariat", lat: 8.4981, lng: 76.9511 },
];

export const ROUTES: Route[] = [
  // Thampanoor to Poojappura
  {
    id: "tvm-poojappura-0530",
    from: "thiruvananthapuram",
    to: "poojappura",
    stops: ["thiruvananthapuram", "palayam", "bakery-junction", "vazhuthakkadu", "jagathy", "poojappura"],
    duration: 15,
    busNumber: "KSRTC-ORD-530-P",
    departureTime: "05:30 am",
    busType: "Ordinary"
  },
  {
    id: "tvm-poojappura-0600",
    from: "thiruvananthapuram",
    to: "poojappura",
    stops: ["thiruvananthapuram", "palayam", "bakery-junction", "vazhuthakkadu", "jagathy", "poojappura"],
    duration: 15,
    busNumber: "KSRTC-SF-600-P",
    departureTime: "06:00 am",
    busType: "Super Fast"
  },
  {
    id: "tvm-poojappura-0730",
    from: "thiruvananthapuram",
    to: "poojappura",
    stops: ["thiruvananthapuram", "palayam", "bakery-junction", "vazhuthakkadu", "jagathy", "poojappura"],
    duration: 15,
    busNumber: "KSRTC-ORD-730-P",
    departureTime: "07:30 am",
    busType: "Ordinary"
  },
  {
    id: "tvm-poojappura-0800",
    from: "thiruvananthapuram",
    to: "poojappura",
    stops: ["thiruvananthapuram", "palayam", "bakery-junction", "vazhuthakkadu", "jagathy", "poojappura"],
    duration: 15,
    busNumber: "KSRTC-ORD-800-P",
    departureTime: "08:00 am",
    busType: "Ordinary"
  },
  {
    id: "tvm-poojappura-0830",
    from: "thiruvananthapuram",
    to: "poojappura",
    stops: ["thiruvananthapuram", "palayam", "bakery-junction", "vazhuthakkadu", "jagathy", "poojappura"],
    duration: 15,
    busNumber: "KSRTC-SF-830-P",
    departureTime: "08:30 am",
    busType: "Super Fast"
  },
  {
    id: "tvm-poojappura-0840",
    from: "thiruvananthapuram",
    to: "poojappura",
    stops: ["thiruvananthapuram", "palayam", "bakery-junction", "vazhuthakkadu", "jagathy", "poojappura"],
    duration: 15,
    busNumber: "KSRTC-FP-840-P",
    departureTime: "08:40 am",
    busType: "Fast Passenger"
  },
  {
    id: "tvm-poojappura-0900",
    from: "thiruvananthapuram",
    to: "poojappura",
    stops: ["thiruvananthapuram", "palayam", "bakery-junction", "vazhuthakkadu", "jagathy", "poojappura"],
    duration: 15,
    busNumber: "KSRTC-SF-900-P",
    departureTime: "09:00 am",
    busType: "Super Fast"
  },
  {
    id: "tvm-poojappura-1200",
    from: "thiruvananthapuram",
    to: "poojappura",
    stops: ["thiruvananthapuram", "palayam", "bakery-junction", "vazhuthakkadu", "jagathy", "poojappura"],
    duration: 15,
    busNumber: "KSRTC-ORD-1200-P",
    departureTime: "12:00 pm",
    busType: "Ordinary"
  },
  // Thampanoor to Medical College
  {
    id: "tvm-mc-0630",
    from: "thiruvananthapuram",
    to: "medical-college",
    stops: ["thiruvananthapuram", "palayam", "pmg", "pattom", "medical-college"],
    duration: 20,
    busNumber: "KSRTC-ORD-630-MC",
    departureTime: "06:30 am",
    busType: "Ordinary"
  },
  {
    id: "tvm-mc-0730",
    from: "thiruvananthapuram",
    to: "medical-college",
    stops: ["thiruvananthapuram", "palayam", "pmg", "pattom", "medical-college"],
    duration: 20,
    busNumber: "KSRTC-SF-730-MC",
    departureTime: "07:30 am",
    busType: "Super Fast"
  },
  {
    id: "tvm-mc-0800",
    from: "thiruvananthapuram",
    to: "medical-college",
    stops: ["thiruvananthapuram", "palayam", "pmg", "pattom", "medical-college"],
    duration: 20,
    busNumber: "KSRTC-ORD-800-MC",
    departureTime: "08:00 am",
    busType: "Ordinary"
  },
  {
    id: "tvm-mc-0830",
    from: "thiruvananthapuram",
    to: "medical-college",
    stops: ["thiruvananthapuram", "palayam", "pmg", "pattom", "medical-college"],
    duration: 20,
    busNumber: "KSRTC-ORD-830-MC",
    departureTime: "08:30 am",
    busType: "Ordinary"
  },
  {
    id: "tvm-mc-0900",
    from: "thiruvananthapuram",
    to: "medical-college",
    stops: ["thiruvananthapuram", "palayam", "pmg", "pattom", "medical-college"],
    duration: 20,
    busNumber: "KSRTC-SF-900-MC",
    departureTime: "09:00 am",
    busType: "Super Fast"
  },
  {
    id: "tvm-mc-1030",
    from: "thiruvananthapuram",
    to: "medical-college",
    stops: ["thiruvananthapuram", "palayam", "pmg", "pattom", "medical-college"],
    duration: 20,
    busNumber: "KSRTC-FP-1030-MC",
    departureTime: "10:30 am",
    busType: "Fast Passenger"
  },
  {
    id: "tvm-mc-1100",
    from: "thiruvananthapuram",
    to: "medical-college",
    stops: ["thiruvananthapuram", "palayam", "pmg", "pattom", "medical-college"],
    duration: 20,
    busNumber: "KSRTC-SF-1100-MC",
    departureTime: "11:00 am",
    busType: "Super Fast"
  },
  {
    id: "tvm-mc-1130",
    from: "thiruvananthapuram",
    to: "medical-college",
    stops: ["thiruvananthapuram", "palayam", "pmg", "pattom", "medical-college"],
    duration: 20,
    busNumber: "KSRTC-ORD-1130-MC",
    departureTime: "11:30 am",
    busType: "Ordinary"
  },
  // Thampanoor to Padmanabhaswamy Temple
  {
    id: "tvm-temple-0530",
    from: "thiruvananthapuram",
    to: "temple",
    stops: ["thiruvananthapuram", "eastfort", "temple"],
    duration: 10,
    busNumber: "KSRTC-ORD-530-T",
    departureTime: "05:30 am",
    busType: "Ordinary"
  },
  {
    id: "tvm-temple-0730",
    from: "thiruvananthapuram",
    to: "temple",
    stops: ["thiruvananthapuram", "eastfort", "temple"],
    duration: 10,
    busNumber: "KSRTC-SF-730-T",
    departureTime: "07:30 am",
    busType: "Super Fast"
  },
  {
    id: "tvm-temple-0800",
    from: "thiruvananthapuram",
    to: "temple",
    stops: ["thiruvananthapuram", "eastfort", "temple"],
    duration: 10,
    busNumber: "KSRTC-ORD-800-T",
    departureTime: "08:00 am",
    busType: "Ordinary"
  },
  {
    id: "tvm-temple-0830",
    from: "thiruvananthapuram",
    to: "temple",
    stops: ["thiruvananthapuram", "eastfort", "temple"],
    duration: 10,
    busNumber: "KSRTC-ORD-830-T",
    departureTime: "08:30 am",
    busType: "Ordinary"
  },
  {
    id: "tvm-temple-0900",
    from: "thiruvananthapuram",
    to: "temple",
    stops: ["thiruvananthapuram", "eastfort", "temple"],
    duration: 10,
    busNumber: "KSRTC-E-900-T",
    departureTime: "09:00 am",
    busType: "Electric Bus"
  },
  {
    id: "tvm-temple-1030",
    from: "thiruvananthapuram",
    to: "temple",
    stops: ["thiruvananthapuram", "eastfort", "temple"],
    duration: 10,
    busNumber: "KSRTC-FP-1030-T",
    departureTime: "10:30 am",
    busType: "Fast Passenger"
  },
  {
    id: "tvm-temple-1100",
    from: "thiruvananthapuram",
    to: "temple",
    stops: ["thiruvananthapuram", "eastfort", "temple"],
    duration: 10,
    busNumber: "KSRTC-SF-1100-T",
    departureTime: "11:00 am",
    busType: "Super Fast"
  },
  {
    id: "tvm-temple-1130",
    from: "thiruvananthapuram",
    to: "temple",
    stops: ["thiruvananthapuram", "eastfort", "temple"],
    duration: 10,
    busNumber: "KSRTC-E-1130-T",
    departureTime: "11:30 am",
    busType: "Electric Bus"
  },
  // Thampanoor to Museum
  {
    id: "tvm-museum-0630",
    from: "thiruvananthapuram",
    to: "museum",
    stops: ["thiruvananthapuram", "palayam", "museum"],
    duration: 12,
    busNumber: "KSRTC-ORD-630-M",
    departureTime: "06:30 am",
    busType: "Ordinary"
  },
  {
    id: "tvm-museum-0730",
    from: "thiruvananthapuram",
    to: "museum",
    stops: ["thiruvananthapuram", "palayam", "museum"],
    duration: 12,
    busNumber: "KSRTC-SF-730-M",
    departureTime: "07:30 am",
    busType: "Super Fast"
  },
  {
    id: "tvm-museum-0800",
    from: "thiruvananthapuram",
    to: "museum",
    stops: ["thiruvananthapuram", "palayam", "museum"],
    duration: 12,
    busNumber: "KSRTC-ORD-800-M",
    departureTime: "08:00 am",
    busType: "Ordinary"
  },
  {
    id: "tvm-museum-0830",
    from: "thiruvananthapuram",
    to: "museum",
    stops: ["thiruvananthapuram", "palayam", "museum"],
    duration: 12,
    busNumber: "KSRTC-ORD-830-M",
    departureTime: "08:30 am",
    busType: "Ordinary"
  },
  {
    id: "tvm-museum-0900",
    from: "thiruvananthapuram",
    to: "museum",
    stops: ["thiruvananthapuram", "palayam", "museum"],
    duration: 12,
    busNumber: "KSRTC-SF-900-M",
    departureTime: "09:00 am",
    busType: "Super Fast"
  },
  {
    id: "tvm-museum-1030",
    from: "thiruvananthapuram",
    to: "museum",
    stops: ["thiruvananthapuram", "palayam", "museum"],
    duration: 12,
    busNumber: "KSRTC-FP-1030-M",
    departureTime: "10:30 am",
    busType: "Fast Passenger"
  },
  {
    id: "tvm-museum-1100",
    from: "thiruvananthapuram",
    to: "museum",
    stops: ["thiruvananthapuram", "palayam", "museum"],
    duration: 12,
    busNumber: "KSRTC-SF-1100-M",
    departureTime: "11:00 am",
    busType: "Super Fast"
  },
  {
    id: "tvm-museum-1130",
    from: "thiruvananthapuram",
    to: "museum",
    stops: ["thiruvananthapuram", "palayam", "museum"],
    duration: 12,
    busNumber: "KSRTC-ORD-1130-M",
    departureTime: "11:30 am",
    busType: "Ordinary"
  },
  // Poojappura to SCT College
  {
    id: "poojappura-sct-0630",
    from: "poojappura",
    to: "sct-college",
    stops: ["poojappura", "karamana", "pappancode", "sct-college"],
    duration: 20,
    busNumber: "KSRTC-ORD-630-S",
    departureTime: "06:30 am",
    busType: "Ordinary"
  },
  {
    id: "poojappura-sct-0730",
    from: "poojappura",
    to: "sct-college",
    stops: ["poojappura", "karamana", "pappancode", "sct-college"],
    duration: 15,
    busNumber: "KSRTC-SF-730-S",
    departureTime: "07:30 am",
    busType: "Super Fast"
  },
  {
    id: "poojappura-sct-0800",
    from: "poojappura",
    to: "sct-college",
    stops: ["poojappura", "karamana", "pappancode", "sct-college"],
    duration: 20,
    busNumber: "KSRTC-ORD-800-S",
    departureTime: "08:00 am",
    busType: "Ordinary"
  },
  {
    id: "poojappura-sct-0920",
    from: "poojappura",
    to: "sct-college",
    stops: ["poojappura", "karamana", "pappancode", "sct-college"],
    duration: 20,
    busNumber: "KSRTC-ORD-920-S",
    departureTime: "09:20 am",
    busType: "Ordinary"
  },
  {
    id: "poojappura-sct-1000",
    from: "poojappura",
    to: "sct-college",
    stops: ["poojappura", "karamana", "pappancode", "sct-college"],
    duration: 15,
    busNumber: "KSRTC-SF-1000-S",
    departureTime: "10:00 am",
    busType: "Super Fast"
  },
  {
    id: "poojappura-sct-1030",
    from: "poojappura",
    to: "sct-college",
    stops: ["poojappura", "karamana", "pappancode", "sct-college"],
    duration: 18,
    busNumber: "KSRTC-FP-1030-S",
    departureTime: "10:30 am",
    busType: "Fast Passenger"
  },
  {
    id: "poojappura-sct-1100",
    from: "poojappura",
    to: "sct-college",
    stops: ["poojappura", "karamana", "pappancode", "sct-college"],
    duration: 15,
    busNumber: "KSRTC-SF-1100-S",
    departureTime: "11:00 am",
    busType: "Super Fast"
  },
  {
    id: "poojappura-sct-1200",
    from: "poojappura",
    to: "sct-college",
    stops: ["poojappura", "karamana", "pappancode", "sct-college"],
    duration: 20,
    busNumber: "KSRTC-ORD-1200-S",
    departureTime: "12:00 pm",
    busType: "Ordinary"
  },
  // Poojappura to Thampanoor
  {
    id: "poojappura-tvm-0630",
    from: "poojappura",
    to: "thiruvananthapuram",
    stops: ["poojappura", "jagathy", "vazhuthakkadu", "bakery-junction", "palayam", "thiruvananthapuram"],
    duration: 30,
    busNumber: "KSRTC-ORD-630-T",
    departureTime: "06:30 am",
    busType: "Ordinary"
  },
  {
    id: "poojappura-tvm-0700",
    from: "poojappura",
    to: "thiruvananthapuram",
    stops: ["poojappura", "jagathy", "vazhuthakkadu", "bakery-junction", "palayam", "thiruvananthapuram"],
    duration: 25,
    busNumber: "KSRTC-SF-700-T",
    departureTime: "07:00 am",
    busType: "Super Fast"
  },
  {
    id: "poojappura-tvm-0800",
    from: "poojappura",
    to: "thiruvananthapuram",
    stops: ["poojappura", "jagathy", "vazhuthakkadu", "bakery-junction", "palayam", "thiruvananthapuram"],
    duration: 30,
    busNumber: "KSRTC-ORD-800-T",
    departureTime: "08:00 am",
    busType: "Ordinary"
  },
  {
    id: "poojappura-tvm-0830",
    from: "poojappura",
    to: "thiruvananthapuram",
    stops: ["poojappura", "jagathy", "vazhuthakkadu", "bakery-junction", "palayam", "thiruvananthapuram"],
    duration: 30,
    busNumber: "KSRTC-ORD-830-T",
    departureTime: "08:30 am",
    busType: "Ordinary"
  },
  {
    id: "poojappura-tvm-0900",
    from: "poojappura",
    to: "thiruvananthapuram",
    stops: ["poojappura", "jagathy", "vazhuthakkadu", "bakery-junction", "palayam", "thiruvananthapuram"],
    duration: 25,
    busNumber: "KSRTC-SF-900-T",
    departureTime: "09:00 am",
    busType: "Super Fast"
  },
  {
    id: "poojappura-tvm-1030",
    from: "poojappura",
    to: "thiruvananthapuram",
    stops: ["poojappura", "jagathy", "vazhuthakkadu", "bakery-junction", "palayam", "thiruvananthapuram"],
    duration: 28,
    busNumber: "KSRTC-FP-1030-T",
    departureTime: "10:30 am",
    busType: "Fast Passenger"
  },
  {
    id: "poojappura-tvm-1100",
    from: "poojappura",
    to: "thiruvananthapuram",
    stops: ["poojappura", "jagathy", "vazhuthakkadu", "bakery-junction", "palayam", "thiruvananthapuram"],
    duration: 25,
    busNumber: "KSRTC-SF-1100-T",
    departureTime: "11:00 am",
    busType: "Super Fast"
  },
  {
    id: "poojappura-tvm-1130",
    from: "poojappura",
    to: "thiruvananthapuram",
    stops: ["poojappura", "jagathy", "vazhuthakkadu", "bakery-junction", "palayam", "thiruvananthapuram"],
    duration: 30,
    busNumber: "KSRTC-ORD-1130-T",
    departureTime: "11:30 am",
    busType: "Ordinary"
  },
  // SCT College to Poojappura
  {
    id: "sct-poojappura-0630",
    from: "sct-college",
    to: "poojappura",
    stops: ["sct-college", "pappancode", "karamana", "poojappura"],
    duration: 20,
    busNumber: "KSRTC-ORD-630-P",
    departureTime: "06:30 am",
    busType: "Ordinary"
  },
  {
    id: "sct-poojappura-0700",
    from: "sct-college",
    to: "poojappura",
    stops: ["sct-college", "pappancode", "karamana", "poojappura"],
    duration: 15,
    busNumber: "KSRTC-SF-700-P",
    departureTime: "07:00 am",
    busType: "Super Fast"
  },
  {
    id: "sct-poojappura-0800",
    from: "sct-college",
    to: "poojappura",
    stops: ["sct-college", "pappancode", "karamana", "poojappura"],
    duration: 20,
    busNumber: "KSRTC-ORD-800-P",
    departureTime: "08:00 am",
    busType: "Ordinary"
  },
  {
    id: "sct-poojappura-0830",
    from: "sct-college",
    to: "poojappura",
    stops: ["sct-college", "pappancode", "karamana", "poojappura"],
    duration: 20,
    busNumber: "KSRTC-ORD-830-P",
    departureTime: "08:30 am",
    busType: "Ordinary"
  },
  {
    id: "sct-poojappura-0900",
    from: "sct-college",
    to: "poojappura",
    stops: ["sct-college", "pappancode", "karamana", "poojappura"],
    duration: 15,
    busNumber: "KSRTC-SF-900-P",
    departureTime: "09:00 am",
    busType: "Super Fast"
  },
  {
    id: "sct-poojappura-1030",
    from: "sct-college",
    to: "poojappura",
    stops: ["sct-college", "pappancode", "karamana", "poojappura"],
    duration: 18,
    busNumber: "KSRTC-FP-1030-P",
    departureTime: "10:30 am",
    busType: "Fast Passenger"
  },
  {
    id: "sct-poojappura-1100",
    from: "sct-college",
    to: "poojappura",
    stops: ["sct-college", "pappancode", "karamana", "poojappura"],
    duration: 15,
    busNumber: "KSRTC-SF-1100-P",
    departureTime: "11:00 am",
    busType: "Super Fast"
  },
  {
    id: "sct-poojappura-1130",
    from: "sct-college",
    to: "poojappura",
    stops: ["sct-college", "pappancode", "karamana", "poojappura"],
    duration: 20,
    busNumber: "KSRTC-ORD-1130-P",
    departureTime: "11:30 am",
    busType: "Ordinary"
  },
  // Medical College to Thampanoor
  {
    id: "medical-college-tvm-0630",
    from: "medical-college",
    to: "thiruvananthapuram",
    stops: ["medical-college", "pattom", "pmg", "palayam", "thiruvananthapuram"],
    duration: 30,
    busNumber: "KSRTC-ORD-630-M",
    departureTime: "06:30 am",
    busType: "Ordinary"
  },
  {
    id: "medical-college-tvm-0700",
    from: "medical-college",
    to: "thiruvananthapuram",
    stops: ["medical-college", "pattom", "pmg", "palayam", "thiruvananthapuram"],
    duration: 25,
    busNumber: "KSRTC-SF-700-M",
    departureTime: "07:00 am",
    busType: "Super Fast"
  },
  {
    id: "medical-college-tvm-0800",
    from: "medical-college",
    to: "thiruvananthapuram",
    stops: ["medical-college", "pattom", "pmg", "palayam", "thiruvananthapuram"],
    duration: 30,
    busNumber: "KSRTC-ORD-800-M",
    departureTime: "08:00 am",
    busType: "Ordinary"
  },
  {
    id: "medical-college-tvm-0830",
    from: "medical-college",
    to: "thiruvananthapuram",
    stops: ["medical-college", "pattom", "pmg", "palayam", "thiruvananthapuram"],
    duration: 30,
    busNumber: "KSRTC-ORD-830-M",
    departureTime: "08:30 am",
    busType: "Ordinary"
  },
  {
    id: "medical-college-tvm-0900",
    from: "medical-college",
    to: "thiruvananthapuram",
    stops: ["medical-college", "pattom", "pmg", "palayam", "thiruvananthapuram"],
    duration: 25,
    busNumber: "KSRTC-SF-900-M",
    departureTime: "09:00 am",
    busType: "Super Fast"
  },
  {
    id: "medical-college-tvm-1030",
    from: "medical-college",
    to: "thiruvananthapuram",
    stops: ["medical-college", "pattom", "pmg", "palayam", "thiruvananthapuram"],
    duration: 28,
    busNumber: "KSRTC-FP-1030-M",
    departureTime: "10:30 am",
    busType: "Fast Passenger"
  },
  {
    id: "medical-college-tvm-1100",
    from: "medical-college",
    to: "thiruvananthapuram",
    stops: ["medical-college", "pattom", "pmg", "palayam", "thiruvananthapuram"],
    duration: 25,
    busNumber: "KSRTC-SF-1100-M",
    departureTime: "11:00 am",
    busType: "Super Fast"
  },
  {
    id: "medical-college-tvm-1130",
    from: "medical-college",
    to: "thiruvananthapuram",
    stops: ["medical-college", "pattom", "pmg", "palayam", "thiruvananthapuram"],
    duration: 30,
    busNumber: "KSRTC-ORD-1130-M",
    departureTime: "11:30 am",
    busType: "Ordinary"
  },
  // Poojappura to Various Destinations (User provided data)
  {
    id: "poojappura-tvm-user",
    from: "poojappura",
    to: "thiruvananthapuram",
    stops: ["poojappura", "jagathy", "vazhuthakkadu", "bakery-junction", "palayam", "thiruvananthapuram"],
    duration: 11,
    distance: 5.0,
    busNumber: "KSRTC-ORD-USER-1",
    departureTime: "08:00 am",
    busType: "Ordinary"
  },
  {
    id: "poojappura-museum-user",
    from: "poojappura",
    to: "museum",
    stops: ["poojappura", "jagathy", "vazhuthakkadu", "palayam", "museum"],
    duration: 9,
    distance: 5.2,
    busNumber: "KSRTC-ORD-USER-2",
    departureTime: "08:15 am",
    busType: "Ordinary"
  },
  {
    id: "poojappura-mc-user",
    from: "poojappura",
    to: "medical-college",
    stops: ["poojappura", "jagathy", "vazhuthakkadu", "palayam", "pmg", "pattom", "medical-college"],
    duration: 15,
    distance: 8.1,
    busNumber: "KSRTC-ORD-USER-3",
    departureTime: "08:30 am",
    busType: "Ordinary"
  },
  {
    id: "poojappura-sec-user",
    from: "poojappura",
    to: "secretariat",
    stops: ["poojappura", "jagathy", "vazhuthakkadu", "bakery-junction", "secretariat"],
    duration: 8,
    distance: 3.5,
    busNumber: "KSRTC-ORD-USER-4",
    departureTime: "08:45 am",
    busType: "Ordinary"
  },
  {
    id: "poojappura-temple-user",
    from: "poojappura",
    to: "temple",
    stops: ["poojappura", "karamana", "eastfort", "temple"],
    duration: 10,
    distance: 4.2,
    busNumber: "KSRTC-ORD-USER-5",
    departureTime: "09:00 am",
    busType: "Ordinary"
  },
];

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ml', name: 'Malayalam' },
];

export const TRANSLATIONS = {
  en: {
    welcome: "Welcome to Yathra",
    login: "Login",
    signup: "Sign Up",
    from: "From",
    to: "To",
    findRoute: "Find Route",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    routeFound: "Route Found",
    steps: "Steps",
    duration: "Duration",
    bus: "Bus",
    selectLocation: "Select Location",
    detailedTranscription: "Detailed Transcription",
  },
  hi: {
    welcome: "यात्रा में आपका स्वागत है",
    login: "लॉगिन",
    signup: "साइन अप",
    from: "कहाँ से",
    to: "कहाँ तक",
    findRoute: "रास्ता खोजें",
    language: "भाषा",
    theme: "थीम",
    light: "लाइट",
    dark: "डार्क",
    routeFound: "रास्ता मिल गया",
    steps: "चरण",
    duration: "अवधि",
    bus: "बस",
    selectLocation: "स्थान चुनें",
    detailedTranscription: "विस्तृत प्रतिलेखन",
  },
  ml: {
    welcome: "യാത്രയിലേക്ക് സ്വാഗതം",
    login: "ലോഗിൻ",
    signup: "സൈൻ അപ്പ്",
    from: "എവിടെ നിന്ന്",
    to: "എവിടേക്ക്",
    findRoute: "വഴി കണ്ടെത്തുക",
    language: "ഭാഷ",
    theme: "തീം",
    light: "ലൈറ്റ്",
    dark: "ഡാർക്ക്",
    routeFound: "വഴി കണ്ടെത്തി",
    steps: "ഘട്ടങ്ങൾ",
    duration: "സമയം",
    bus: "ബസ്",
    selectLocation: "സ്ഥലം തിരഞ്ഞെടുക്കുക",
    detailedTranscription: "വിശദമായ വിവരണം",
  },
};
