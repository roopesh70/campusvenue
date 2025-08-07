import { venues, equipmentList, venueTypes, bookings } from "@/lib/data";
import { VenueCalendar } from "@/components/venues/venue-calendar";

export default function CalendarPage() {
  return (
    <div className="space-y-6 h-full flex flex-col">
       <div>
        <h1 className="text-3xl font-headline tracking-tight">Venue Availability Calendar</h1>
        <p className="text-muted-foreground">View all bookings and events across campus venues.</p>
      </div>
      <VenueCalendar 
        allVenues={venues}
        equipmentList={equipmentList}
        venueTypes={venueTypes}
        bookings={bookings}
      />
    </div>
  );
}
