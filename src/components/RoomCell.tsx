import { cn } from "@/lib/utils";
import type { Room } from "@/types/room";

interface RoomCellProps {
  room: Room;
}

export function RoomCell({ room }: RoomCellProps) {
  const getStatusStyles = () => {
    if (room.justBooked) {
      return "bg-room-booked text-primary-foreground shadow-md ring-2 ring-room-booked-light ring-offset-2 ring-offset-background";
    }
    if (room.occupied) {
      return "bg-room-occupied text-primary-foreground";
    }
    return "bg-room-available text-primary-foreground hover:bg-room-available-light";
  };

  const getStatusLabel = () => {
    if (room.justBooked) return "Just Booked";
    if (room.occupied) return "Occupied";
    return "Available";
  };

  return (
    <div
      className={cn(
        "room-cell relative flex items-center justify-center rounded-lg h-10 w-14 md:h-12 md:w-16 text-xs md:text-sm font-medium cursor-default select-none",
        getStatusStyles()
      )}
      title={`Room ${room.roomNumber} - ${getStatusLabel()}`}
    >
      <span className="font-semibold">{room.roomNumber}</span>
      {room.justBooked && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-room-booked-light opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-room-booked-light"></span>
        </span>
      )}
    </div>
  );
}
