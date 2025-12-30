import { supabase } from "@/integrations/supabase/client";
import type { Room, BookingResult, RoomsResponse } from "@/types/room";

const FUNCTION_NAME = "rooms";

export async function fetchRooms(): Promise<Room[]> {
  const { data, error } = await supabase.functions.invoke<RoomsResponse>(FUNCTION_NAME, {
    method: "GET",
  });

  if (error) {
    console.error("Error fetching rooms:", error);
    throw new Error(error.message || "Failed to fetch rooms");
  }

  return data?.rooms || [];
}

export async function bookRooms(numberOfRooms: number): Promise<BookingResult> {
  const { data, error } = await supabase.functions.invoke<BookingResult>(FUNCTION_NAME, {
    body: { action: "book", numberOfRooms },
  });

  if (error) {
    console.error("Error booking rooms:", error);
    return { success: false, error: error.message || "Failed to book rooms" };
  }

  return data || { success: false, error: "No response from server" };
}

export async function resetBookings(): Promise<void> {
  const { error } = await supabase.functions.invoke(FUNCTION_NAME, {
    body: { action: "reset" },
  });

  if (error) {
    console.error("Error resetting bookings:", error);
    throw new Error(error.message || "Failed to reset bookings");
  }
}

export async function randomOccupancy(): Promise<{ occupiedCount: number }> {
  const { data, error } = await supabase.functions.invoke<{ success: boolean; occupiedCount: number }>(FUNCTION_NAME, {
    body: { action: "random-occupancy" },
  });

  if (error) {
    console.error("Error applying random occupancy:", error);
    throw new Error(error.message || "Failed to apply random occupancy");
  }

  return { occupiedCount: data?.occupiedCount || 0 };
}
