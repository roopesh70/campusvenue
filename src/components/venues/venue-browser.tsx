'use client';

import { useState, useMemo } from 'react';
import type { Venue } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Projector, Wind, Thermometer, Tag, Building, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BookingDialog } from './booking-dialog';
import { Separator } from '../ui/separator';

interface VenueBrowserProps {
  allVenues: Venue[];
  equipmentList: string[];
  venueTypes: string[];
}

export function VenueBrowser({
  allVenues,
  equipmentList,
  venueTypes,
}: VenueBrowserProps) {
  const [capacity, setCapacity] = useState('');
  const [type, setType] = useState('all');
  const [equipment, setEquipment] = useState('all');

  const filteredVenues = useMemo(() => {
    return allVenues.filter((venue) => {
      if (capacity && venue.capacity < parseInt(capacity)) {
        return false;
      }
      if (type !== 'all' && venue.type !== type) {
        return false;
      }
      if (equipment !== 'all' && !venue.equipment.includes(equipment)) {
        return false;
      }
      return true;
    });
  }, [allVenues, capacity, type, equipment]);

  return (
    <div className="space-y-8">
      <div className="p-4 bg-card border rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label htmlFor="capacity" className="text-sm font-medium">Capacity (min)</label>
            <Input
              id="capacity"
              type="number"
              placeholder="e.g. 50"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium">Venue Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type" className="w-full bg-background">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {venueTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
             <label htmlFor="equipment" className="text-sm font-medium">Equipment</label>
            <Select value={equipment} onValueChange={setEquipment}>
              <SelectTrigger id="equipment" className="w-full bg-background">
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Equipment</SelectItem>
                {equipmentList.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => { setCapacity(''); setType('all'); setEquipment('all'); }} variant="outline">Reset Filters</Button>
        </div>
      </div>
      
      {filteredVenues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <Card key={venue.id} className="flex flex-col">
              <CardHeader className="p-0">
                <Image
                  src={venue.imageUrl}
                  alt={venue.name}
                  width={600}
                  height={400}
                  className="rounded-t-lg object-cover aspect-[3/2]"
                  data-ai-hint="lecture hall classroom"
                />
              </CardHeader>
              <CardContent className="pt-6 flex-grow">
                <CardTitle className="font-headline text-xl mb-2">{venue.name}</CardTitle>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5"><Tag className="w-4 h-4"/> {venue.type}</div>
                  <div className="flex items-center gap-1.5"><Users className="w-4 h-4"/> {venue.capacity} Capacity</div>
                  <div className="flex items-center gap-1.5"><Building className="w-4 h-4"/> Building {venue.building}</div>
                  <div className="flex items-center gap-1.5"><Layers className="w-4 h-4"/> Floor {venue.floor}</div>
                </div>
                <Separator className="my-4"/>
                <h4 className="font-medium mb-2">Available Equipment</h4>
                <div className="flex flex-wrap gap-2">
                  {venue.equipment.map(eq => <Badge key={eq} variant="secondary">{eq}</Badge>)}
                </div>
              </CardContent>
              <CardFooter>
                <BookingDialog venue={venue} />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
            <p>No venues match your criteria.</p>
        </div>
      )}
    </div>
  );
}
