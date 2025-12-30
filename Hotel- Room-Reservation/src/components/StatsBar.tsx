import type { Room } from "@/types/room";
import { Building, DoorOpen, DoorClosed } from "lucide-react";

interface StatsBarProps {
  rooms: Room[];
}

export function StatsBar({ rooms }: StatsBarProps) {
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => !r.occupied).length;
  const occupiedRooms = rooms.filter(r => r.occupied).length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      <div className="p-4 rounded-lg bg-card border border-border shadow-card">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <Building className="h-4 w-4" />
          <span className="text-xs uppercase tracking-wide">Total Rooms</span>
        </div>
        <p className="text-2xl font-display font-bold text-foreground">{totalRooms}</p>
      </div>
      
      <div className="p-4 rounded-lg bg-card border border-border shadow-card">
        <div className="flex items-center gap-2 text-room-available mb-1">
          <DoorOpen className="h-4 w-4" />
          <span className="text-xs uppercase tracking-wide">Available</span>
        </div>
        <p className="text-2xl font-display font-bold text-room-available">{availableRooms}</p>
      </div>
      
      <div className="p-4 rounded-lg bg-card border border-border shadow-card">
        <div className="flex items-center gap-2 text-room-occupied mb-1">
          <DoorClosed className="h-4 w-4" />
          <span className="text-xs uppercase tracking-wide">Occupied</span>
        </div>
        <p className="text-2xl font-display font-bold text-room-occupied">{occupiedRooms}</p>
      </div>
      
      <div className="p-4 rounded-lg bg-card border border-border shadow-card">
        <div className="flex items-center gap-2 text-hotel-gold mb-1">
          <span className="text-xs uppercase tracking-wide">Occupancy Rate</span>
        </div>
        <p className="text-2xl font-display font-bold text-hotel-gold">{occupancyRate}%</p>
      </div>
    </div>
  );
}
