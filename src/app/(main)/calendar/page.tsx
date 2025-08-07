import { getVenues, getEquipmentList, getVenueTypes, getBookings } from "@/lib/data";
import type { Booking } from "@/lib/types";
import dynamic from 'next/dynamic'
import { Skeleton } from "@/components/ui/skeleton";

const VenueCalendar = dynamic(() => import('@/components/venues/venue-calendar').then(mod => mod.VenueCalendar), {
  ssr: false,
  loading: () => <Skeleton className="h-[70vh] w-full" />,
});


export default async function CalendarPage() {
  const allVenues = await getVenues();
  const equipmentList = await getEquipmentList();
  const venueTypes = await getVenueTypes();
  const bookings = (await getBookings()) as (Omit<Booking, 'status'> & { status: 'Approved' | 'Pending' | 'Rejected' | 'Maintenance' })[];


  return (
    <div className="space-y-6 h-full flex flex-col">
       <div>
        <h1 className="text-3xl font-headline tracking-tight">Venue Availability Calendar</h1>
        <p className="text-muted-foreground">View all bookings and events across campus venues.</p>
      </div>
      <VenueCalendar 
        allVenues={allVenues}
        equipmentList={equipmentList}
        venueTypes={venueTypes}
        bookings={bookings}
      />
    </div>
  );
}
