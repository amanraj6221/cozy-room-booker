import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory room state
interface Room {
  roomNumber: number;
  floor: number;
  positionFromLift: number;
  occupied: boolean;
  justBooked: boolean;
}

// Global room state (persists across requests in the same function instance)
const roomState: Map<number, Room> = new Map();

// Initialize rooms
function initializeRooms(): void {
  if (roomState.size > 0) return;
  
  // Floors 1-9: 10 rooms each (101-110, 201-210, etc.)
  for (let floor = 1; floor <= 9; floor++) {
    for (let pos = 1; pos <= 10; pos++) {
      const roomNumber = floor * 100 + pos;
      roomState.set(roomNumber, {
        roomNumber,
        floor,
        positionFromLift: pos,
        occupied: false,
        justBooked: false,
      });
    }
  }
  
  // Floor 10: 7 rooms (1001-1007)
  for (let pos = 1; pos <= 7; pos++) {
    const roomNumber = 1000 + pos;
    roomState.set(roomNumber, {
      roomNumber,
      floor: 10,
      positionFromLift: pos,
      occupied: false,
      justBooked: false,
    });
  }
  
  console.log(`Initialized ${roomState.size} rooms`);
}

// Get all rooms as array
function getAllRooms(): Room[] {
  initializeRooms();
  return Array.from(roomState.values()).sort((a, b) => a.roomNumber - b.roomNumber);
}

// Get available rooms
function getAvailableRooms(): Room[] {
  return getAllRooms().filter(room => !room.occupied);
}

// Calculate travel time between two rooms
function calculateTravelTime(room1: Room, room2: Room): number {
  const verticalTime = Math.abs(room1.floor - room2.floor) * 2;
  const horizontalTime = Math.abs(room1.positionFromLift - room2.positionFromLift);
  return verticalTime + horizontalTime;
}

// Calculate total travel time for a set of rooms (first to last)
function calculateTotalTravelTime(rooms: Room[]): number {
  if (rooms.length <= 1) return 0;
  
  // Sort rooms by floor and position to find first and last
  const sorted = [...rooms].sort((a, b) => {
    if (a.floor !== b.floor) return a.floor - b.floor;
    return a.positionFromLift - b.positionFromLift;
  });
  
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  
  return calculateTravelTime(first, last);
}

// Generate all combinations of n items from array
function combinations<T>(arr: T[], n: number): T[][] {
  if (n === 0) return [[]];
  if (arr.length < n) return [];
  
  const result: T[][] = [];
  
  function backtrack(start: number, current: T[]) {
    if (current.length === n) {
      result.push([...current]);
      return;
    }
    
    for (let i = start; i < arr.length; i++) {
      current.push(arr[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }
  
  backtrack(0, []);
  return result;
}

// Find optimal room combination
function findOptimalRooms(numRooms: number): { rooms: Room[], travelTime: number } | null {
  const availableRooms = getAvailableRooms();
  
  if (availableRooms.length < numRooms) {
    return null;
  }
  
  // Group available rooms by floor
  const roomsByFloor: Map<number, Room[]> = new Map();
  for (const room of availableRooms) {
    if (!roomsByFloor.has(room.floor)) {
      roomsByFloor.set(room.floor, []);
    }
    roomsByFloor.get(room.floor)!.push(room);
  }
  
  let bestCombination: Room[] | null = null;
  let bestTravelTime = Infinity;
  
  // Priority 1: Try to find rooms on the same floor
  for (const [floor, floorRooms] of roomsByFloor) {
    if (floorRooms.length >= numRooms) {
      // Sort by position from lift
      const sorted = [...floorRooms].sort((a, b) => a.positionFromLift - b.positionFromLift);
      
      // Try all consecutive combinations
      for (let start = 0; start <= sorted.length - numRooms; start++) {
        const combo = sorted.slice(start, start + numRooms);
        const travelTime = calculateTotalTravelTime(combo);
        
        if (travelTime < bestTravelTime) {
          bestTravelTime = travelTime;
          bestCombination = combo;
        }
      }
      
      // Also try non-consecutive combinations on same floor
      const allCombos = combinations(sorted, numRooms);
      for (const combo of allCombos) {
        const travelTime = calculateTotalTravelTime(combo);
        if (travelTime < bestTravelTime) {
          bestTravelTime = travelTime;
          bestCombination = combo;
        }
      }
    }
  }
  
  // If we found same-floor rooms, return them
  if (bestCombination !== null) {
    return { rooms: bestCombination, travelTime: bestTravelTime };
  }
  
  // Priority 2: Cross-floor combinations - find minimum travel time
  // For efficiency, try combinations across adjacent floors first
  const floors = Array.from(roomsByFloor.keys()).sort((a, b) => a - b);
  
  // Try combinations across all floors, but limit for performance
  if (availableRooms.length <= 30) {
    // Small enough to try all combinations
    const allCombos = combinations(availableRooms, numRooms);
    for (const combo of allCombos) {
      const travelTime = calculateTotalTravelTime(combo);
      if (travelTime < bestTravelTime) {
        bestTravelTime = travelTime;
        bestCombination = combo;
      }
    }
  } else {
    // For larger sets, use a greedy approach with adjacent floors
    for (let i = 0; i < floors.length; i++) {
      let combinedRooms: Room[] = [];
      for (let j = i; j < floors.length && combinedRooms.length < numRooms; j++) {
        const floorRooms = roomsByFloor.get(floors[j]) || [];
        combinedRooms = [...combinedRooms, ...floorRooms];
      }
      
      if (combinedRooms.length >= numRooms) {
        // Sort by position to get closest rooms
        combinedRooms.sort((a, b) => a.positionFromLift - b.positionFromLift);
        
        const allCombos = combinations(combinedRooms.slice(0, Math.min(20, combinedRooms.length)), numRooms);
        for (const combo of allCombos) {
          const travelTime = calculateTotalTravelTime(combo);
          if (travelTime < bestTravelTime) {
            bestTravelTime = travelTime;
            bestCombination = combo;
          }
        }
      }
    }
  }
  
  if (bestCombination === null) {
    return null;
  }
  
  return { rooms: bestCombination, travelTime: bestTravelTime };
}

// Book rooms
function bookRooms(numRooms: number): { success: boolean; rooms?: Room[]; travelTime?: number; error?: string } {
  if (numRooms < 1 || numRooms > 5) {
    return { success: false, error: "Can only book 1-5 rooms at once" };
  }
  
  const result = findOptimalRooms(numRooms);
  
  if (!result) {
    return { success: false, error: "Not enough rooms available" };
  }
  
  // Clear previous justBooked flags
  for (const room of roomState.values()) {
    room.justBooked = false;
  }
  
  // Mark rooms as occupied and justBooked
  for (const room of result.rooms) {
    const stateRoom = roomState.get(room.roomNumber)!;
    stateRoom.occupied = true;
    stateRoom.justBooked = true;
  }
  
  console.log(`Booked ${numRooms} rooms: ${result.rooms.map(r => r.roomNumber).join(', ')}, Travel time: ${result.travelTime} mins`);
  
  return { 
    success: true, 
    rooms: result.rooms.sort((a, b) => a.roomNumber - b.roomNumber), 
    travelTime: result.travelTime 
  };
}

// Reset all bookings
function resetRooms(): void {
  for (const room of roomState.values()) {
    room.occupied = false;
    room.justBooked = false;
  }
  console.log("All rooms reset");
}

// Random occupancy
function randomOccupancy(): { occupiedCount: number } {
  resetRooms();
  
  const rooms = getAllRooms();
  const occupancyRate = 0.3 + Math.random() * 0.4; // 30-70% occupancy
  
  for (const room of rooms) {
    if (Math.random() < occupancyRate) {
      room.occupied = true;
    }
  }
  
  const occupiedCount = rooms.filter(r => r.occupied).length;
  console.log(`Random occupancy applied: ${occupiedCount}/${rooms.length} rooms occupied`);
  
  return { occupiedCount };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  initializeRooms();
  
  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    
    console.log(`Request: ${req.method} ${path}`);
    
    // GET /rooms - Get all rooms
    if (req.method === 'GET') {
      const rooms = getAllRooms();
      return new Response(JSON.stringify({ rooms }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // POST operations
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      const action = body.action || path;
      
      switch (action) {
        case 'book': {
          const numRooms = parseInt(body.numberOfRooms) || 0;
          const result = bookRooms(numRooms);
          return new Response(JSON.stringify(result), {
            status: result.success ? 200 : 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        case 'reset': {
          resetRooms();
          return new Response(JSON.stringify({ success: true, message: "All bookings reset" }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        case 'random-occupancy': {
          const result = randomOccupancy();
          return new Response(JSON.stringify({ success: true, ...result }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        default:
          return new Response(JSON.stringify({ error: "Unknown action" }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
      }
    }
    
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
