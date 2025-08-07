
'use client'

import { Card, CardContent } from "@/components/ui/card"
import { getVenues, getUserBookings } from "@/lib/data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import { useEffect, useState } from "react"
import { Booking, Venue } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

function BookingsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
             <Skeleton className="h-12 w-full" />
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoading(true);
      const [bookingsData, venuesData] = await Promise.all([
          getUserBookings(user.id),
          getVenues()
      ]);
      setUserBookings(bookingsData as Booking[]);
      setAllVenues(venuesData);
      setLoading(false);
    }
    fetchData();
  }, [user]);

  const getBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'Approved': return 'default';
        case 'Pending': return 'secondary';
        case 'Rejected': return 'destructive';
        default: return 'outline';
    }
  };
  
  if (authLoading || (loading && user)) {
    return <BookingsPageSkeleton />
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground">A list of all your venue booking requests.</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userBookings.length > 0 ? userBookings.map(booking => {
                const venue = allVenues.find(v => v.id === booking.venueId);
                return (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.eventName}</TableCell>
                  <TableCell>{venue ? venue.name : 'N/A'}</TableCell>
                  <TableCell>{new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getBadgeVariant(booking.status)}>{booking.status}</Badge>
                  </TableCell>
                </TableRow>
              )}) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">You have not made any bookings yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
