import { getVenues, getEquipmentList, getVenueTypes } from "@/lib/data";
import { VenueBrowser } from "@/components/venues/venue-browser";

export default async function VenuesPage() {
  const allVenues = await getVenues();
  const equipmentList = await getEquipmentList();
  const venueTypes = await getVenueTypes();

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
