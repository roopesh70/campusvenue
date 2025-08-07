
'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { suggestAlternativeVenues, SuggestAlternativeVenuesOutput } from '@/ai/flows/suggest-alternative-venues';
import { AlternativeVenuesDialog } from './alternative-venues-dialog';
import type { Venue } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { createBooking } from '@/lib/actions';
import { useAuth } from '../providers/auth-provider';


const bookingFormSchema = z.object({
  eventName: z.string().min(3, 'Event name must be at least 3 characters.'),
  eventDetails: z.string().min(10, 'Event details must be at least 10 characters.'),
  date: z.date({
    required_error: "A date is required.",
  }),
  timeSlot: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*-\s*([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format. Use HH:MM - HH:MM."),
  document: z.any().optional(),
});

export function BookingDialog({ venue }: { venue: Venue }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [alternatives, setAlternatives] = useState<SuggestAlternativeVenuesOutput['alternativeVenues'] | null>(null);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      eventName: '',
      eventDetails: '',
      timeSlot: '10:00 - 12:00',
    },
  });

  async function onSubmit(values: z.infer<typeof bookingFormSchema>) {
    if (!user) {
      toast({ title: 'Not Logged In', description: 'You must be logged in to create a booking.', variant: 'destructive' });
      return;
    }
    
    setIsChecking(true);
    
    const result = await createBooking({ ...values, venueId: venue.id, userId: user.id });

    if (result.error) {
       toast({
        title: 'Conflict Detected!',
        description: result.error,
        variant: 'destructive',
      });
      try {
        const aiInput = {
          eventDetails: values.eventDetails,
          preferredVenueType: venue.type,
          capacityNeeded: venue.capacity,
          equipmentNeeded: venue.equipment,
          date: format(values.date, 'yyyy-MM-dd'),
          timeSlot: values.timeSlot,
        };
        const aiResult = await suggestAlternativeVenues(aiInput);
        setAlternatives(aiResult.alternativeVenues);
        setShowAlternatives(true);
        setIsOpen(false); // Close current booking dialog
      } catch (error) {
        console.error('AI suggestion error:', error);
        toast({
          title: 'Error',
          description: 'Could not fetch alternative suggestions at this time.',
          variant: 'destructive',
        });
      }
    } else if (result.success) {
      toast({
        title: 'Request Submitted',
        description: result.success,
      });
      setIsOpen(false);
      form.reset();
    }
    setIsChecking(false);
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">Book Now</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book {venue.name}</DialogTitle>
            <DialogDescription>
              Fill in the details for your event. Click submit to send for approval.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="eventName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Guest Lecture" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Details</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the purpose of your event." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0,0,0,0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="timeSlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Slot</FormLabel>
                      <FormControl>
                        <Input placeholder="10:00 - 12:00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supporting Document (PDF/Image)</FormLabel>
                    <FormControl>
                      <Input type="file" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isChecking}>
                  {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isChecking ? 'Checking...' : 'Submit Request'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <AlternativeVenuesDialog
        isOpen={showAlternatives}
        onOpenChange={setShowAlternatives}
        venues={alternatives}
      />
    </>
  );
}
