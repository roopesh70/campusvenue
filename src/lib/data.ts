import type { Venue } from './types';

export const venues: Venue[] = [
  { id: 'v1', name: 'Lecture Hall A1', type: 'Hall', capacity: 150, equipment: ['Projector', 'Sound System', 'AC'], building: 'A', floor: 1, imageUrl: 'https://placehold.co/600x400.png' },
  { id: 'v2', name: 'Computer Lab 3B', type: 'Lab', capacity: 40, equipment: ['Projector', 'AC'], building: 'B', floor: 3, imageUrl: 'https://placehold.co/600x400.png' },
  { id: 'v3', name: 'Seminar Room C2', type: 'Classroom', capacity: 60, equipment: ['Projector'], building: 'C', floor: 2, imageUrl: 'https://placehold.co/600x400.png' },
  { id: 'v4', name: 'Main Auditorium', type: 'Hall', capacity: 500, equipment: ['Projector', 'Sound System', 'AC'], building: 'Main', floor: 0, imageUrl: 'https://placehold.co/600x400.png' },
  { id: 'v5', name: 'Physics Lab P1', type: 'Lab', capacity: 30, equipment: ['AC'], building: 'P', floor: 1, imageUrl: 'https://placehold.co/600x400.png' },
  { id: 'v6', name: 'Conference Room D4', type: 'Classroom', capacity: 25, equipment: ['Projector', 'AC'], building: 'D', floor: 4, imageUrl: 'https://placehold.co/600x400.png' },
];

export const bookings = [
  { id: 'b1', venueId: 'v1', userId: 'alex.j@example.edu', eventName: 'Guest Lecture on AI', date: '2024-08-15', timeSlot: '10:00 - 12:00', status: 'Approved' },
  { id: 'b2', venueId: 'v3', userId: 'ben.c@example.edu', eventName: 'Coding Club Weekly Meet', date: '2024-08-15', timeSlot: '14:00 - 16:00', status: 'Approved' },
  { id: 'b3', venueId: 'v2', userId: 'evelyn.r@example.edu', eventName: 'Advanced Programming Practical', date: '2024-08-16', timeSlot: '09:00 - 11:00', status: 'Approved' },
  { id: 'b4', venueId: 'v4', userId: 'ben.c@example.edu', eventName: 'Annual Tech Fest Inauguration', date: '2024-08-20', timeSlot: '10:00 - 11:00', status: 'Pending' },
  { id: 'b5', venueId: 'v1', userId: 'alex.j@example.edu', eventName: 'Debate Competition', date: '2024-08-22', timeSlot: '13:00 - 15:00', status: 'Rejected' },
];

export const equipmentList = ['Projector', 'Sound System', 'AC'];
export const venueTypes = ['Hall', 'Lab', 'Classroom'];
