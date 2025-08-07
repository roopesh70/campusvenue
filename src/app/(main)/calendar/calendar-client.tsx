'use client';

import type { Venue, Booking } from "@/lib/types";
import dynamic from 'next/dynamic'
import { Skeleton } from "@/components/ui/skeleton";

const VenueCalendar = dynamic(() => import('@/components/venues/venue-calendar').then(mod => mod.VenueCalendar), {
  ssr: false,
  loading: () => <Skeleton className="h-[70vh] w-full" />,
});

interface CalendarClientProps {
    allVenues: Venue[];
    equipmentList: string[];
    venueTypes: string[];
    bookings: (Omit<Booking, 'status'> & { status: 'Approved' | 'Pending' | 'Rejected' | 'Maintenance' })[];
}

export function CalendarClient({ allVenues, equipmentList, venueTypes, bookings }: CalendarClientProps) {
    return (
        <VenueCalendar 
            allVenues={allVenues}
            equipmentList={equipmentList}
            venueTypes={venueTypes}
            bookings={bookings}
        />
    )
}
