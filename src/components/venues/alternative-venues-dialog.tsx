'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { SuggestAlternativeVenuesOutput } from '@/ai/flows/suggest-alternative-venues';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '../ui/scroll-area';

interface AlternativeVenuesDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  venues: SuggestAlternativeVenuesOutput['alternativeVenues'] | null;
}

export function AlternativeVenuesDialog({
  isOpen,
  onOpenChange,
  venues,
}: AlternativeVenuesDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alternative Venues Found</DialogTitle>
          <DialogDescription>
            Your preferred slot has a conflict. Here are some AI-powered
            suggestions.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
        {venues && venues.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {venues.map((venue, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>
                  <div className="flex justify-between w-full pr-4">
                    <span>{venue.venueName}</span>
                    <Badge>{venue.suitabilityScore}% Match</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">{venue.reasoning}</p>
                    <div className="text-sm">
                      <p><strong>Type:</strong> {venue.venueType}</p>
                      <p><strong>Capacity:</strong> {venue.capacity}</p>
                      <p><strong>Availability:</strong> {venue.availability}</p>
                       <p><strong>Equipment:</strong> {venue.availableEquipment.join(', ')}</p>
                    </div>
                    <Button className="w-full" size="sm">Book This Instead</Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No alternative venues could be found at this time.
          </p>
        )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
