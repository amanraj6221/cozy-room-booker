import type { Room } from "@/types/room";
import { FloorRow } from "./FloorRow";
import { ArrowDown, DoorOpen } from "lucide-react";

interface RoomGridProps {
  rooms: Room[];
  isLoading: boolean;
}

export function RoomGrid({ rooms, isLoading }: RoomGridProps) {
  // Group rooms by floor
  const roomsByFloor = rooms.reduce<Record<number, Room[]>>((acc, room) => {
    if (!acc[room.floor]) {
      acc[room.floor] = [];
    }
    acc[room.floor].push(room);
    return acc;
  }, {});

  // Sort floors in descending order (top floor first)
  const floors = Object.keys(roomsByFloor)
    .map(Number)
    .sort((a, b) => b - a);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Building header */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2 text-muted-foreground">
          <DoorOpen className="h-5 w-5" />
          <span className="text-sm font-medium">Stairs/Lift</span>
          <ArrowDown className="h-4 w-4" />
        </div>
        <div className="text-xs text-muted-foreground">
          ← Rooms arranged left to right from stairs/lift
        </div>
      </div>

      {/* Floor rows */}
      <div className="space-y-1">
        {floors.map((floor) => (
          <FloorRow
            key={floor}
            floor={floor}
            rooms={roomsByFloor[floor]}
          />
        ))}
      </div>
    </div>
  );
}
