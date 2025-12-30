import type { Room } from "@/types/room";
import { Clock, MapPin, CheckCircle2 } from "lucide-react";

interface BookingResultProps {
  rooms: Room[];
  travelTime: number;
}

export function BookingResult({ rooms, travelTime }: BookingResultProps) {
  const sortedRooms = [...rooms].sort((a, b) => a.roomNumber - b.roomNumber);
  const floors = [...new Set(rooms.map(r => r.floor))].sort((a, b) => a - b);

  return (
    <div className="animate-slide-up p-4 md:p-6 rounded-xl bg-gradient-to-br from-room-booked/10 to-room-booked/5 border border-room-booked/30">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="h-5 w-5 text-room-booked" />
        <h3 className="text-lg font-display font-semibold text-foreground">Booking Confirmed</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-room-booked mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Rooms Assigned</p>
            <p className="font-semibold text-foreground">
              {sortedRooms.map(r => r.roomNumber).join(", ")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Floor{floors.length > 1 ? "s" : ""}: {floors.join(", ")}
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-hotel-gold mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Total Travel Time</p>
            <p className="font-semibold text-foreground">
              {travelTime} minute{travelTime !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Between first and last room
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
