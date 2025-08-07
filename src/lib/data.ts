import prisma from './prisma';

export const getVenues = () => prisma.venue.findMany();
export const getBookings = () => prisma.booking.findMany();
export const getEquipmentList = async () => {
    const venues = await prisma.venue.findMany({ select: { equipment: true } });
    const equipmentSet = new Set(venues.flatMap(v => v.equipment));
    return Array.from(equipmentSet);
};
export const getVenueTypes = async () => {
    const venueTypes = await prisma.venue.findMany({ select: { type: true }, distinct: ['type'] });
    return venueTypes.map(vt => vt.type);
};
