import type { Room } from "@/types/room";
import { RoomCell } from "./RoomCell";
import { Building2 } from "lucide-react";

interface FloorRowProps {
  floor: number;
  rooms: Room[];
}

export function FloorRow({ floor, rooms }: FloorRowProps) {
  const sortedRooms = [...rooms].sort((a, b) => a.positionFromLift - b.positionFromLift);

  return (
    <div className="flex items-center gap-2 md:gap-4 py-2">
      <div className="flex items-center justify-center w-16 md:w-20 shrink-0">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary">
          <Building2 className="h-3 w-3 md:h-4 md:w-4" />
          <span className="text-xs md:text-sm font-semibold">F{floor}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 md:gap-2 flex-wrap">
        {sortedRooms.map((room) => (
          <RoomCell key={room.roomNumber} room={room} />
        ))}
      </div>
    </div>
  );
}
