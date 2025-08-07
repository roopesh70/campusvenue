export interface Venue {
  id: string;
  name: string;
  type: 'Hall' | 'Lab' | 'Classroom';
  capacity: number;
  equipment: string[];
  building: string;
  floor: number;
  imageUrl: string;
}

export interface Booking {
  id: string;
  venueId: string;
  userId: string;
  eventName: string;
  date: string;
  timeSlot: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}
