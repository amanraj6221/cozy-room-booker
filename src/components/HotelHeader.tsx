import { Hotel, Sparkles } from "lucide-react";

export function HotelHeader() {
  return (
    <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-hotel-navy-light p-6 md:p-8 text-primary-foreground shadow-lg">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
      
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-secondary/20 backdrop-blur-sm">
            <Hotel className="h-8 w-8 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight">
              Grand Vista Hotel
            </h1>
            <p className="text-primary-foreground/80 text-sm md:text-base">
              Room Reservation System
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/20 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-secondary" />
          <span className="text-sm font-medium">Smart Booking Algorithm</span>
        </div>
      </div>
      
      <div className="relative mt-6 pt-6 border-t border-primary-foreground/20 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-primary-foreground/60">Total Floors</p>
          <p className="font-semibold">10 Floors</p>
        </div>
        <div>
          <p className="text-primary-foreground/60">Total Rooms</p>
          <p className="font-semibold">97 Rooms</p>
        </div>
        <div>
          <p className="text-primary-foreground/60">Max Booking</p>
          <p className="font-semibold">5 Rooms/Request</p>
        </div>
        <div>
          <p className="text-primary-foreground/60">Algorithm</p>
          <p className="font-semibold">Min Travel Time</p>
        </div>
      </div>
    </header>
  );
}
