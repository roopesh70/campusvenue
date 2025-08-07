
'use client'

import { getVenues, getEquipmentList, getVenueTypes, getBookings } from "@/lib/data";
import type { Booking, Venue } from "@/lib/types";
import { CalendarClient } from "./calendar-client";
import { useAuth } from "@/components/providers/auth-provider";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";


function CalendarPageSkeleton() {
  return (
     <div className="space-y-6 h-full flex flex-col">
       <div>
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </div>
      <Skeleton className="h-[70vh] w-full" />
    </div>
  )
}


export default function CalendarPage() {
  const { user, loading: authLoading } = useAuth();
  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [equipmentList, setEquipmentList] = useState<string[]>([]);
  const [venueTypes, setVenueTypes] = useState<string[]>([]);
  const [bookings, setBookings] = useState<(Omit<Booking, 'status'> & { status: 'Approved' | 'Pending' | 'Rejected' | 'Maintenance' })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        if (!user) return;
        setLoading(true);
        const [venuesData, equipmentData, typesData, bookingsData] = await Promise.all([
            getVenues(),
            getEquipmentList(),
            getVenueTypes(),
            getBookings()
        ]);
        setAllVenues(venuesData);
        setEquipmentList(equipmentData);
        setVenueTypes(typesData);
        setBookings(bookingsData as any);
        setLoading(false);
    }
    fetchData();
  }, [user]);

  if (authLoading || (loading && user)) {
    return <CalendarPageSkeleton />
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
       <div>
        <h1 className="text-3xl font-headline tracking-tight">Venue Availability Calendar</h1>
        <p className="text-muted-foreground">View all bookings and events across campus venues.</p>
      </div>
      <CalendarClient
        allVenues={allVenues}
        equipmentList={equipmentList}
        venueTypes={venueTypes}
        bookings={bookings}
      />
    </div>
  );
}
