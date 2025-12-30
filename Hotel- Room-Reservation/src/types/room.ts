export interface Room {
  roomNumber: number;
  floor: number;
  positionFromLift: number;
  occupied: boolean;
  justBooked: boolean;
}

export interface BookingResult {
  success: boolean;
  rooms?: Room[];
  travelTime?: number;
  error?: string;
}

export interface RoomsResponse {
  rooms: Room[];
}
