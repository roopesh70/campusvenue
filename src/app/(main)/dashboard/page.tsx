
'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, Hourglass, XCircle, Users } from "lucide-react"
import { getBookings, getVenues, getUserBookings } from "@/lib/data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import { useEffect, useState } from "react"
import { Booking, Venue } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
       <div>
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-1/3 mt-2" />
      </div>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
           <Skeleton className="h-4 w-1/2 mt-1" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoading(true);
      const [userBookingsData, allBookingsData, venuesData] = await Promise.all([
        getUserBookings(user.id),
        getBookings(),
        getVenues(),
      ]);
      setUserBookings(userBookingsData as Booking[]);
      setAllBookings(allBookingsData as Booking[]);
      setAllVenues(venuesData);
      setLoading(false);
    }
    fetchData();
  }, [user]);

  if (authLoading || (loading && user)) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    // AuthProvider should handle redirection, but this is a safeguard.
    return null;
  }

  const approvedCount = userBookings.filter(b => b.status === 'Approved').length;
  const pendingCount = userBookings.filter(b => b.status === 'Pending').length;
  const rejectedCount = userBookings.filter(b => b.status === 'Rejected').length;
  
  const upcomingBookings = userBookings
    .filter(b => b.status === 'Approved' && new Date(b.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const totalPendingForAdmin = allBookings.filter(b => b.status === 'Pending').length;

  const getBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'Approved': return 'default';
        case 'Pending': return 'secondary';
        case 'Rejected': return 'destructive';
        default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline tracking-tight">Welcome back, {user.name?.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">Here's a summary of your activities.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">bookings approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">requests pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">requests rejected</p>
          </CardContent>
        </Card>
        {user.role === 'Admin' && (
          <Card className="bg-primary/10 border-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Approvals</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPendingForAdmin}</div>
              <p className="text-xs text-muted-foreground">requests need review</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Upcoming Events</CardTitle>
          <CardDescription>A list of your upcoming approved bookings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingBookings.length > 0 ? upcomingBookings.map(booking => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.eventName}</TableCell>
                  <TableCell>{allVenues.find(v => v.id === booking.venueId)?.name}</TableCell>
                  <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                  <TableCell>{booking.timeSlot}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">You have no upcoming events.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
