import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { HotelHeader } from "@/components/HotelHeader";
import { StatsBar } from "@/components/StatsBar";
import { BookingControls } from "@/components/BookingControls";
import { Legend } from "@/components/Legend";
import { RoomGrid } from "@/components/RoomGrid";
import { BookingResult } from "@/components/BookingResult";
import { fetchRooms, bookRooms, resetBookings, randomOccupancy } from "@/lib/api";
import type { Room } from "@/types/room";

const Index = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastBooking, setLastBooking] = useState<{ rooms: Room[]; travelTime: number } | null>(null);
  const { toast } = useToast();

  const loadRooms = useCallback(async () => {
    try {
      const data = await fetchRooms();
      setRooms(data);
    } catch (error) {
      console.error("Failed to load rooms:", error);
      toast({
        title: "Error Loading Rooms",
        description: "Failed to fetch room data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const handleBook = async (numRooms: number) => {
    setIsLoading(true);
    setLastBooking(null);
    
    try {
      const result = await bookRooms(numRooms);
      
      if (result.success && result.rooms) {
        setLastBooking({ rooms: result.rooms, travelTime: result.travelTime || 0 });
        toast({
          title: "Booking Successful",
          description: `${result.rooms.length} room(s) booked with ${result.travelTime} min travel time`,
        });
        await loadRooms();
      } else {
        toast({
          title: "Booking Failed",
          description: result.error || "Unable to complete booking",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Error",
        description: "An error occurred while processing your booking",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    setLastBooking(null);
    
    try {
      await resetBookings();
      toast({
        title: "Reset Complete",
        description: "All bookings have been cleared",
      });
      await loadRooms();
    } catch (error) {
      console.error("Reset error:", error);
      toast({
        title: "Reset Failed",
        description: "Failed to reset bookings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandomOccupancy = async () => {
    setIsLoading(true);
    setLastBooking(null);
    
    try {
      const result = await randomOccupancy();
      toast({
        title: "Random Occupancy Applied",
        description: `${result.occupiedCount} rooms are now occupied`,
      });
      await loadRooms();
    } catch (error) {
      console.error("Random occupancy error:", error);
      toast({
        title: "Error",
        description: "Failed to apply random occupancy",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        <div className="space-y-6 md:space-y-8">
          {/* Header */}
          <HotelHeader />

          {/* Stats */}
          <StatsBar rooms={rooms} />

          {/* Booking Controls */}
          <div className="p-4 md:p-6 rounded-xl bg-card border border-border shadow-card">
            <h2 className="text-lg font-display font-semibold text-foreground mb-4">
              Book Rooms
            </h2>
            <BookingControls
              onBook={handleBook}
              onReset={handleReset}
              onRandomOccupancy={handleRandomOccupancy}
              isLoading={isLoading}
            />
          </div>

          {/* Last Booking Result */}
          {lastBooking && (
            <BookingResult rooms={lastBooking.rooms} travelTime={lastBooking.travelTime} />
          )}

          {/* Legend */}
          <Legend />

          {/* Room Grid */}
          <div className="p-4 md:p-6 rounded-xl bg-card border border-border shadow-card">
            <h2 className="text-lg font-display font-semibold text-foreground mb-4">
              Building Layout
            </h2>
            <RoomGrid rooms={rooms} isLoading={isLoading} />
          </div>

          {/* Algorithm Info */}
          <div className="p-4 md:p-6 rounded-xl bg-muted/50 border border-border">
            <h3 className="text-md font-display font-semibold text-foreground mb-3">
              Booking Algorithm
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-hotel-gold font-bold">1.</span>
                <span>Priority: Book rooms on the same floor when possible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-hotel-gold font-bold">2.</span>
                <span>Minimize total travel time between first and last room</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-hotel-gold font-bold">3.</span>
                <span>Horizontal travel: 1 min/room • Vertical travel: 2 min/floor</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
