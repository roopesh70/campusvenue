import type { Venue as PrismaVenue, Booking as PrismaBooking, UserRole, VenueType, BookingStatus } from '@prisma/client';

export type { UserRole, VenueType, BookingStatus };

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
}

export interface Venue extends PrismaVenue {}

export interface Booking extends Omit<PrismaBooking, 'date'> {
  date: string; // Keep date as string for simplicity in current components
}
