import { GoogleGenAI, GenerateContentResponse, ThinkingLevel } from "@google/genai";
import { BusStop, TripStats, NavigationStep } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simple in-memory cache to avoid redundant calls
const instructionCache: Record<string, NavigationStep[]> = {};

export async function generateEnrichedInstructions(
  stops: BusStop[],
  stats: TripStats,
  language: string,
  retries = 3
): Promise<NavigationStep[]> {
  const cacheKey = `${stops.map(s => s.id).join('-')}-${language}`;
  if (instructionCache[cacheKey]) {
    console.log('Returning cached instructions for:', cacheKey);
    return instructionCache[cacheKey];
  }

  const prompt = `Generate detailed navigation instructions for a bus trip in Thiruvananthapuram, Kerala.
    Start Location: ${stops[0].name}
    Destination: ${stops[stops.length - 1].name}
    Intermediate Stops: ${stops.slice(1, -1).map(s => s.name).join(', ')}
    Total Distance: ${stats.distance.toFixed(2)} km
    Total Duration: ${Math.round(stats.duration)} mins
    Language: ${language === 'ml' ? 'Malayalam' : language === 'hi' ? 'Hindi' : 'English'}
    
    CRITICAL INSTRUCTIONS:
    1. ONLY include the stops provided above (Start, Intermediate, and Destination). Do not add any other stops from the bus's full route.
    2. For each bus stop, specify which side of the road the bus will stop on (e.g., "Left side" or "Right side" relative to the direction of travel).
    3. Include landmarks near each stop and walking tips for the first and last mile.
    4. Format as JSON array of objects: { "instruction": string, "type": "walk" | "bus" | "arrival", "lat": number, "lng": number }
    5. Return ONLY the JSON array.`;

  for (let i = 0; i < retries; i++) {
    try {
      const response: GenerateContentResponse = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (!text) throw new Error('No text returned from Gemini');
      
      const jsonStr = text.substring(text.indexOf('['), text.lastIndexOf(']') + 1);
      const steps = JSON.parse(jsonStr);
      
      // Cache the result
      instructionCache[cacheKey] = steps;
      return steps;
    } catch (error: any) {
      const isRateLimit = error?.message?.includes('429') || error?.status === 429 || error?.code === 429;
      
      if (isRateLimit && i < retries - 1) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        console.warn(`Gemini rate limit hit. Retrying in ${Math.round(delay)}ms...`);
        await sleep(delay);
        continue;
      }
      
      // If we hit a rate limit and have no more retries, or if it's a different error
      console.error(`Gemini instruction generation failed (Attempt ${i + 1}/${retries}):`, error);
      if (i === retries - 1) {
        // Return a basic fallback instead of throwing to prevent UI disruption
        return generateFallbackSteps(stops);
      }
    }
  }
  
  return generateFallbackSteps(stops);
}

function generateFallbackSteps(stops: BusStop[]): NavigationStep[] {
  return stops.map((s, i) => ({
    instruction: i === 0 
      ? `Board at ${s.name} (Left side)` 
      : i === stops.length - 1 
        ? `Arrive at ${s.name} (Left side). Thank you for traveling with Yathra!` 
        : `Continue journey through ${s.name} (Left side)`,
    type: i === 0 ? 'bus' : i === stops.length - 1 ? 'arrival' : 'bus',
    distance: 0,
    duration: 0,
    lat: s.lat,
    lng: s.lng
  }));
}
