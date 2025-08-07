
'use client'

import { getVenues, getEquipmentList, getVenueTypes } from "@/lib/data";
import { VenueBrowser } from "@/components/venues/venue-browser";
import { useAuth } from "@/components/providers/auth-provider";
import { useEffect, useState } from "react";
import { Venue } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

function VenuesPageSkeleton() {
  return (
     <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </div>
       <div className="p-4 bg-card border rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
       </div>
    </div>
  )
}

export default function VenuesPage() {
  const { user, loading: authLoading } = useAuth();
  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [equipmentList, setEquipmentList] = useState<string[]>([]);
  const [venueTypes, setVenueTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoading(true);
      const [venuesData, equipmentData, typesData] = await Promise.all([
        getVenues(),
        getEquipmentList(),
        getVenueTypes()
      ]);
      setAllVenues(venuesData);
      setEquipmentList(equipmentData);
      setVenueTypes(typesData);
      setLoading(false);
    }
    fetchData();
  }, [user]);

  if (authLoading || (loading && user)) {
    return <VenuesPageSkeleton />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-headline tracking-tight">Find a Venue</h1>
        <p className="text-muted-foreground">Browse and book available venues across the campus.</p>
      </div>
      <VenueBrowser 
        allVenues={allVenues}
        equipmentList={equipmentList}
        venueTypes={venueTypes}
      />
    </div>
  );
}
