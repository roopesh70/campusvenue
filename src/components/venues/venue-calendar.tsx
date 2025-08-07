'use client'

import { useState, useMemo, useEffect } from 'react';
import type { Venue, Booking } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

interface VenueCalendarProps {
  allVenues: Venue[];
  equipmentList: string[];
  venueTypes: string[];
  bookings: (Omit<Booking, 'status'> & { status: 'Approved' | 'Pending' | 'Rejected' | 'Maintenance' })[];
}

export function VenueCalendar({
  allVenues,
  equipmentList,
  venueTypes,
  bookings,
}: VenueCalendarProps) {
  const [capacity, setCapacity] = useState('');
  const [type, setType] = useState('all');
  const [equipment, setEquipment] = useState('all');
  const [building, setBuilding] = useState('all');
  const [floor, setFloor] = useState('all');

  // isClient state to prevent hydration mismatch with FullCalendar
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true)
  }, []);

  const uniqueBuildings = useMemo(() => [...new Set(allVenues.map(v => v.building))], [allVenues]);
  const uniqueFloors = useMemo(() => [...new Set(allVenues.map(v => v.floor.toString()))].sort((a,b) => parseInt(a) - parseInt(b)), [allVenues]);

  const filteredVenues = useMemo(() => {
    const venueMap = new Map(allVenues.map(v => [v.id, v]));
    const filteredVenueIds = allVenues
      .filter((venue) => {
        if (capacity && venue.capacity < parseInt(capacity)) return false;
        if (type !== 'all' && venue.type !== type) return false;
        if (equipment !== 'all' && !venue.equipment.includes(equipment)) return false;
        if (building !== 'all' && venue.building !== building) return false;
        if (floor !== 'all' && venue.floor.toString() !== floor) return false;
        return true;
      })
      .map(v => v.id);
    
    return new Set(filteredVenueIds);
  }, [allVenues, capacity, type, equipment, building, floor]);

  const calendarEvents = useMemo(() => {
    const venueMap = new Map(allVenues.map(v => [v.id, v]));
    return bookings
      .filter(booking => filteredVenues.has(booking.venueId))
      .map(booking => {
        const venue = venueMap.get(booking.venueId);
        const [startTime, endTime] = booking.timeSlot.split(' - ');
        const startDateTime = new Date(`${booking.date}T${startTime}:00`);
        const endDateTime = new Date(`${booking.date}T${endTime}:00`);

        return {
          id: booking.id,
          title: `${venue?.name}: ${booking.eventName}`,
          start: startDateTime,
          end: endDateTime,
          extendedProps: {
            status: booking.status,
            venueName: venue?.name,
            eventName: booking.eventName,
          },
          className: `fc-event-${booking.status.toLowerCase()}`,
          'data-status': booking.status,
        };
      });
  }, [bookings, filteredVenues, allVenues]);

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <div className="flex-grow flex flex-col gap-4">
      <Card>
        <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                <div className="space-y-1">
                    <label htmlFor="capacity" className="text-xs font-medium">Capacity</label>
                    <Input id="capacity" type="number" placeholder="Min" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label htmlFor="type" className="text-xs font-medium">Type</label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="all">All</SelectItem>{venueTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <label htmlFor="equipment" className="text-xs font-medium">Equipment</label>
                    <Select value={equipment} onValueChange={setEquipment}>
                        <SelectTrigger id="equipment"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="all">Any</SelectItem>{equipmentList.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <label htmlFor="building" className="text-xs font-medium">Building</label>
                    <Select value={building} onValueChange={setBuilding}>
                        <SelectTrigger id="building"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="all">All</SelectItem>{uniqueBuildings.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <label htmlFor="floor" className="text-xs font-medium">Floor</label>
                    <Select value={floor} onValueChange={setFloor}>
                        <SelectTrigger id="floor"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="all">All</SelectItem>{uniqueFloors.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <Button onClick={() => { setCapacity(''); setType('all'); setEquipment('all'); setBuilding('all'); setFloor('all'); }} variant="outline">Reset</Button>
            </div>
        </CardContent>
      </Card>
      
      <Card className="flex-grow">
        <CardContent className="p-4 h-full">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={calendarEvents}
                height="100%"
                editable={false}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
            />
        </CardContent>
      </Card>
    </div>
  );
}
