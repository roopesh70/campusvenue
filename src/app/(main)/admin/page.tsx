
'use client'
import { useAuth } from "@/components/providers/auth-provider"
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldCheck } from "lucide-react";

export default function AdminPage() {
  const { user } = useAuth();

  if (user?.role !== 'Admin') {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">Manage bookings, users, and system settings.</p>
      </div>
       <Card>
        <CardContent className="flex flex-col items-center justify-center text-center gap-4 min-h-[50vh]">
          <div className="rounded-full border border-dashed p-4">
            <div className="rounded-full bg-muted p-6">
             <ShieldCheck className="w-16 h-16 text-muted-foreground" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-4">Under Construction</h2>
          <p className="text-muted-foreground max-w-md">
            The admin panel is currently being developed. Soon, you'll be able to manage all aspects of CampusVenue from this dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
