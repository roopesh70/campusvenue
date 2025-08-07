import { venues, equipmentList, venueTypes } from "@/lib/data";
import { VenueBrowser } from "@/components/venues/venue-browser";

export default function VenuesPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-headline tracking-tight">Find a Venue</h1>
        <p className="text-muted-foreground">Browse and book available venues across the campus.</p>
      </div>
      <VenueBrowser 
        allVenues={venues}
        equipmentList={equipmentList}
        venueTypes={venueTypes}
      />
    </div>
  );
}
