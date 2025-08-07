
import { db } from './firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import type { Venue, Booking } from './types';

// Helper to convert Firestore Timestamps to serializable strings
const transformDoc = (doc: any) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    // Convert any Timestamp fields to ISO strings
    ...(data.date && data.date instanceof Timestamp && { date: data.date.toDate().toISOString().split('T')[0] }),
    ...(data.createdAt && data.createdAt instanceof Timestamp && { createdAt: data.createdAt.toMillis() }),
  };
};

export const getVenues = async (): Promise<Venue[]> => {
  const venuesCol = collection(db, 'venues');
  const venueSnapshot = await getDocs(venuesCol);
  const venueList = venueSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Venue));
  return venueList;
};

export const getBookings = async (): Promise<any[]> => {
  const bookingsCol = collection(db, 'bookings');
  const bookingSnapshot = await getDocs(bookingsCol);
  const bookingList = bookingSnapshot.docs.map(transformDoc);
  return bookingList;
};

export const getUserBookings = async (userId: string): Promise<any[]> => {
    if (!userId) return [];
    const bookingsCol = collection(db, 'bookings');
    const q = query(bookingsCol, where('userId', '==', userId));
    const bookingSnapshot = await getDocs(q);
    return bookingSnapshot.docs.map(transformDoc);
};


export const getEquipmentList = async (): Promise<string[]> => {
    const venues = await getVenues();
    const equipmentSet = new Set(venues.flatMap(v => v.equipment));
    return Array.from(equipmentSet);
};

export const getVenueTypes = async (): Promise<string[]> => {
    const venues = await getVenues();
    const venueTypesSet = new Set(venues.map(v => v.type));
    return Array.from(venueTypesSet);
};
