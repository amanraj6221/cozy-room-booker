export function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-4 md:gap-6 p-4 rounded-lg bg-muted/50 border border-border">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded bg-room-available"></div>
        <span className="text-sm text-foreground">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded bg-room-occupied"></div>
        <span className="text-sm text-foreground">Occupied</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded bg-room-booked ring-2 ring-room-booked-light ring-offset-1 ring-offset-background"></div>
        <span className="text-sm text-foreground">Just Booked</span>
      </div>
    </div>
  );
}
