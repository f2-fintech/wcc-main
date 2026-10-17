const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const doctorY = {
    'Richa malhan and Puneet Kaura': 0,
    'Aanchal Pandey': 8,
    'Anoop': 0,
    'Harvinder Singh': 0,
    'Pawni': 0,
    'Pooja': 8,
    'Avantika ': 8,
    'Meetu Singh': 12,
    'Pranjali Lanjewar': 12,
    'Sarath Chandra Ponnada': 18,
    'Sachin Chhikara': 18,
    'Divya Agarwal ': 18,
    'Ashish Yadav': 20,
    'Manpreet singh': 25,
    'Tushar Agarwal': 25,
    'Arshad khan': 32,
    'Prof Dr Pankaj Tripathi ': 0,
    'unit pal': 0,
    'Dipanwita Dutta': 15,
    'Sangeeta Gupta ': 15,
    'Anas khan': 15,
    'Bhaarath KS ': 15
  };

  for (const [name, y] of Object.entries(doctorY)) {
    const res = await db.collection('doctors').updateMany(
      { name: name },
      { $set: { focalPoint: { x: 50, y: y } } }
    );
    console.log('Updated', name, '-> y =', y, 'matched:', res.matchedCount);
  }

  // Set any other doctor with photo to default y: 15 instead of 50
  const defaultRes = await db.collection('doctors').updateMany(
    { name: { $nin: Object.keys(doctorY) }, photoUrl: { $ne: '' } },
    { $set: { focalPoint: { x: 50, y: 15 } } }
  );
  console.log('Default updated count:', defaultRes.modifiedCount);

  process.exit(0);
}
migrate();
