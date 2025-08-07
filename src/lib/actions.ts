
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { getAuth } from "firebase/auth";


const bookingFormSchema = z.object({
  eventName: z.string().min(3, 'Event name must be at least 3 characters.'),
  eventDetails: z.string().min(10, 'Event details must be at least 10 characters.'),
  date: z.date({
    required_error: "A date is required.",
  }),
  timeSlot: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*-\s*([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format. Use HH:MM - HH:MM."),
  venueId: z.string(),
  userId: z.string(),
});

export async function createBooking(values: Omit<z.infer<typeof bookingFormSchema>, 'userId'> & { userId: string } ) {

    if (!values.userId) {
        return { error: 'You must be logged in to book a venue.' };
    }

    const validatedFields = bookingFormSchema.safeParse(values);
    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return { error: 'Invalid input.' };
    }

    const { venueId, date, timeSlot, eventName, eventDetails, userId } = validatedFields.data;

    // Firestore conflict check
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, 
        where('venueId', '==', venueId),
        where('date', '==', Timestamp.fromDate(date)),
        where('timeSlot', '==', timeSlot),
        where('status', 'in', ['Approved', 'Pending'])
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        return { error: 'This time slot is already booked or pending approval.' };
    }

    try {
        await addDoc(collection(db, "bookings"), {
            userId: userId,
            venueId,
            eventName,
            eventDetails,
            date: Timestamp.fromDate(date),
            timeSlot,
            status: 'Pending',
            createdAt: Timestamp.now(),
        });
        
        revalidatePath('/bookings');
        revalidatePath('/dashboard');
        revalidatePath('/calendar');
        
        return { success: 'Your booking request has been submitted for approval.' };

    } catch (error) {
        console.error('Booking creation error:', error);
        return { error: 'Something went wrong. Please try again.' };
    }
}
