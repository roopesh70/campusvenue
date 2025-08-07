'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getSession } from './auth';
import { revalidatePath } from 'next/cache';

const bookingFormSchema = z.object({
  eventName: z.string().min(3, 'Event name must be at least 3 characters.'),
  eventDetails: z.string().min(10, 'Event details must be at least 10 characters.'),
  date: z.date({
    required_error: "A date is required.",
  }),
  timeSlot: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*-\s*([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format. Use HH:MM - HH:MM."),
  venueId: z.string()
});

export async function createBooking(values: z.infer<typeof bookingFormSchema>) {
    const session = await getSession();
    if (!session?.user) {
        return { error: 'You must be logged in to book a venue.' };
    }

    const validatedFields = bookingFormSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: 'Invalid input.' };
    }

    const { venueId, date, timeSlot, eventName, eventDetails } = validatedFields.data;

    // TODO: More sophisticated time conflict check
    const existingBooking = await prisma.booking.findFirst({
        where: {
            venueId,
            date: date,
            timeSlot,
            status: { in: ['Approved', 'Pending'] }
        },
    });

    if (existingBooking) {
        return { error: 'This time slot is already booked or pending approval.' };
    }

    try {
        await prisma.booking.create({
            data: {
                userId: session.user.id,
                venueId,
                eventName,
                eventDetails,
                date,
                timeSlot,
                status: 'Pending',
            },
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
