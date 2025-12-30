import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Ticket, RotateCcw, Shuffle, Loader2 } from "lucide-react";

interface BookingControlsProps {
  onBook: (numRooms: number) => Promise<void>;
  onReset: () => Promise<void>;
  onRandomOccupancy: () => Promise<void>;
  isLoading: boolean;
}

export function BookingControls({ onBook, onReset, onRandomOccupancy, isLoading }: BookingControlsProps) {
  const [numRooms, setNumRooms] = useState<string>("1");
  const { toast } = useToast();

  const handleBook = async () => {
    const num = parseInt(numRooms);
    if (isNaN(num) || num < 1) {
      toast({
        title: "Invalid Input",
        description: "Please enter a number between 1 and 5",
        variant: "destructive",
      });
      return;
    }
    if (num > 5) {
      toast({
        title: "Limit Exceeded",
        description: "Maximum 5 rooms can be booked at once",
        variant: "destructive",
      });
      return;
    }
    await onBook(num);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[1-5]$/.test(value)) {
      setNumRooms(value);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={1}
          max={5}
          value={numRooms}
          onChange={handleInputChange}
          className="w-20 text-center font-semibold"
          placeholder="1-5"
          disabled={isLoading}
        />
        <Button
          onClick={handleBook}
          disabled={isLoading || !numRooms}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Ticket className="h-4 w-4" />
          )}
          Book Rooms
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          onClick={onReset}
          disabled={isLoading}
          variant="outline"
          className="gap-2 border-border hover:bg-muted"
        >
          <RotateCcw className="h-4 w-4" />
          Reset All
        </Button>
        <Button
          onClick={onRandomOccupancy}
          disabled={isLoading}
          variant="outline"
          className="gap-2 border-border hover:bg-muted"
        >
          <Shuffle className="h-4 w-4" />
          Random Occupancy
        </Button>
      </div>
    </div>
  );
}
