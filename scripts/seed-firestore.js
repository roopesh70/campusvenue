// IMPORTANT: Before running this script, ensure you have set up Firebase Admin SDK.
// 1. Go to your Firebase Project Settings > Service Accounts.
// 2. Click "Generate new private key" and download the JSON file.
// 3. Save the file as 'service-account.json' in your project's root directory.
// 4. Ensure this file is listed in your .gitignore to keep it private.
// 5. Run `npm install firebase-admin` in your terminal.

const admin = require('firebase-admin');
const serviceAccount = require('../service-account.json');

// --- Your Firebase Project Configuration ---
// This is different from the client-side config.
// It's the database URL found in your Firebase console.
const databaseURL = "https://campusvenue.firebaseio.com";
// -----------------------------------------

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: databaseURL
  });
} catch (error) {
  if (error.code !== 'app/duplicate-app') {
    console.error('Firebase admin initialization error', error);
    process.exit(1);
  }
}

const db = admin.firestore();

const venues = [
  {
    id: 'main-auditorium',
    name: 'Main Auditorium',
    type: 'Auditorium',
    capacity: 1000,
    equipment: ['Projector', 'Sound System', 'Stage Lighting', 'AC'],
    building: 'A-Block',
    floor: 1,
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'cs-seminar-hall',
    name: 'Dept. of CS Seminar Hall',
    type: 'Hall',
    capacity: 150,
    equipment: ['Projector', 'Sound System', 'AC'],
    building: 'B-Block',
    floor: 2,
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'ece-seminar-hall',
    name: 'Dept. of ECE Seminar Hall',
    type: 'Hall',
    capacity: 120,
    equipment: ['Projector', 'AC'],
    building: 'C-Block',
    floor: 1,
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'sopanam-hall',
    name: 'Sopanam Hall',
    type: 'Hall',
    capacity: 300,
    equipment: ['Projector', 'Sound System', 'Stage'],
    building: 'Main-Block',
    floor: 0,
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'college-ground',
    name: 'College Ground',
    type: 'Outdoor',
    capacity: 5000,
    equipment: ['Open Space'],
    building: 'N/A',
    floor: 0,
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'main-conf-room',
    name: 'Main Conference Room',
    type: 'Meeting Room',
    capacity: 40,
    equipment: ['Projector', 'AC', 'Conference Table'],
    building: 'Admin-Block',
    floor: 2,
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'classroom-101',
    name: 'Classroom 101',
    type: 'Classroom',
    capacity: 60,
    equipment: ['Blackboard', 'Projector'],
    building: 'A-Block',
    floor: 1,
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'physics-lab',
    name: 'Physics Lab',
    type: 'Lab',
    capacity: 50,
    equipment: ['Lab Equipment', 'Workbenches'],
    building: 'D-Block',
    floor: 1,
    imageUrl: 'https://placehold.co/600x400.png',
  }
];

const seedVenues = async () => {
  const venuesCollection = db.collection('venues');
  console.log('Starting to seed venues...');
  
  const promises = venues.map(async (venue) => {
    try {
      await venuesCollection.doc(venue.id).set(venue);
      console.log(`- Added/updated venue: ${venue.name}`);
    } catch (error) {
      console.error(`  Error adding venue ${venue.name}:`, error);
    }
  });

  await Promise.all(promises);
  console.log('Seeding complete!');
};

seedVenues().then(() => {
    process.exit(0);
}).catch(error => {
    console.error('An error occurred during seeding:', error);
    process.exit(1);
});
