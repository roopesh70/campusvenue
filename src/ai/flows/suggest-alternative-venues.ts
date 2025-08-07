'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting alternative venues based on event requirements and venue availability.
 *
 * The flow takes in event details and venue preferences, and returns a list of suggested alternative venues.
 *   - suggestAlternativeVenues - The main function to call to get alternative venue suggestions.
 *   - SuggestAlternativeVenuesInput - The input type for the suggestAlternativeVenues function.
 *   - SuggestAlternativeVenuesOutput - The output type for the suggestAlternativeVenues function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAlternativeVenuesInputSchema = z.object({
  eventDetails: z.string().describe('Details of the event, including purpose and requirements.'),
  preferredVenueType: z.string().describe('The preferred type of venue (e.g., classroom, lab, hall).'),
  capacityNeeded: z.number().describe('The required capacity of the venue.'),
  equipmentNeeded: z.array(z.string()).describe('A list of equipment needed for the event (e.g., projector, sound system, AC).'),
  date: z.string().describe('The date of the event.'),
  timeSlot: z.string().describe('The time slot for the event.'),
});
export type SuggestAlternativeVenuesInput = z.infer<
  typeof SuggestAlternativeVenuesInputSchema
>;

const SuggestAlternativeVenuesOutputSchema = z.object({
  alternativeVenues: z.array(
    z.object({
      venueName: z.string().describe('The name of the alternative venue.'),
      venueType: z.string().describe('The type of the alternative venue.'),
      capacity: z.number().describe('The capacity of the alternative venue.'),
      availableEquipment: z.array(z.string()).describe('A list of available equipment in the venue.'),
      availability: z.string().describe('The availability of the venue on the given date and time.'),
      suitabilityScore: z.number().describe('A score indicating how well the venue matches the event requirements.'),
      reasoning: z.string().describe('Explanation of why the venue is suggested as alternative.')
    })
  ).describe('A list of suggested alternative venues.'),
});
export type SuggestAlternativeVenuesOutput = z.infer<
  typeof SuggestAlternativeVenuesOutputSchema
>;

export async function suggestAlternativeVenues(
  input: SuggestAlternativeVenuesInput
): Promise<SuggestAlternativeVenuesOutput> {
  return suggestAlternativeVenuesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAlternativeVenuesPrompt',
  input: {schema: SuggestAlternativeVenuesInputSchema},
  output: {schema: SuggestAlternativeVenuesOutputSchema},
  prompt: `You are an AI assistant designed to suggest alternative venues for events when the preferred venue is unavailable.

  Given the following event details and venue requirements, suggest a list of alternative venues that would be suitable for the event.
  Consider the venue type, capacity, equipment needed, and availability when making your suggestions. Provide a suitability score (0-100) and a reasoning for each suggestion.

  Event Details: {{{eventDetails}}}
  Preferred Venue Type: {{{preferredVenueType}}}
  Capacity Needed: {{{capacityNeeded}}}
  Equipment Needed: {{#each equipmentNeeded}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Date: {{{date}}}
  Time Slot: {{{timeSlot}}}
  
  Format your response as a JSON object that matches SuggestAlternativeVenuesOutputSchema schema.`, // Explicitly mentioning schema helps to format the response in a structured manner
});

const suggestAlternativeVenuesFlow = ai.defineFlow(
  {
    name: 'suggestAlternativeVenuesFlow',
    inputSchema: SuggestAlternativeVenuesInputSchema,
    outputSchema: SuggestAlternativeVenuesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
