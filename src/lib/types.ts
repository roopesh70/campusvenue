
export type UserRole = 'Admin' | 'Faculty' | 'Club Leader' | 'Student';

export type BookingStatus = 'Approved' | 'Pending' | 'Rejected' | 'Maintenance';

export type VenueType = 'Classroom' | 'Lab' | 'Hall' | 'Auditorium' | 'Meeting Room';

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
}

export interface Venue {
  id: string;
  name: string;
  type: VenueType;
  capacity: number;
  equipment: string[];
  building: string;
  floor: number;
  imageUrl: string;
}

export interface Booking {
  id: string;
  userId: string;
  venueId: string;
  eventName: string;
  eventDetails: string;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  createdAt: any; // Firestore timestamp
}
