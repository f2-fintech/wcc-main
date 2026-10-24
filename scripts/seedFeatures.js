const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const FeatureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Feature = mongoose.models.Feature || mongoose.model('Feature', FeatureSchema);

const SEED_FEATURES = [
  {
    title: "Financial Conversations",
    description:
      "Understand important financial concepts, ask questions and gain perspectives from professionals who work in the financial ecosystem.",
    imageUrl:
      "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba68eadd15b40670e6090f/photos/d61c3869-e468-4ed7-b63a-1fd72e365275.JPG",
    order: 1,
    isActive: true,
  },
  {
    title: "Doctor-to-Doctor Networking",
    description:
      "Meet fellow doctors, exchange experiences and build relationships with people who understand your professional journey.",
    imageUrl:
      "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba6895dd15b40670e608f0/photos/6f788fe0-9b3e-4083-b75a-03c96b7ce8fa.JPG",
    order: 2,
    isActive: true,
  },
  {
    title: "Knowledge Sessions",
    description:
      "Hear from experienced professionals and experts on subjects relevant to life beyond medicine.",
    imageUrl:
      "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba68eadd15b40670e6090f/photos/15104109-6cba-47a2-a1d9-8916d22b577a.JPG",
    order: 3,
    isActive: true,
  },
  {
    title: "Meaningful Conversations",
    description:
      "No rigid agenda. No unnecessary formality. Just relevant conversations, useful insights and an opportunity to learn something new.",
    imageUrl:
      "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba68cddd15b40670e60906/photos/e6da52a0-ade6-4b0c-94f6-de471d9e5305.JPG",
    order: 4,
    isActive: true,
  },
  {
    title: "Community Experiences",
    description:
      "Every edition is an opportunity to meet new people, reconnect with peers and become part of something bigger.",
    imageUrl:
      "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba6893dd15b40670e608d4/photos/e176366b-38bf-499f-98ee-e478e63d6497.JPG",
    order: 5,
    isActive: true,
  },
];

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is missing in .env.local");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB successfully.");

    const shouldForceUpdate = process.argv.includes('--force') || process.argv.includes('--update');

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const item of SEED_FEATURES) {
      const existing = await Feature.findOne({ title: item.title });

      if (existing) {
        if (shouldForceUpdate) {
          existing.description = item.description;
          existing.imageUrl = item.imageUrl;
          existing.order = item.order;
          existing.isActive = item.isActive;
          await existing.save();
          updatedCount++;
          console.log(`[UPDATED] ${item.title}`);
        } else {
          skippedCount++;
          console.log(`[EXISTS] ${item.title} (use --update to overwrite)`);
        }
      } else {
        await Feature.create(item);
        createdCount++;
        console.log(`[CREATED] ${item.title}`);
      }
    }

    console.log("\n--- Seeding Summary ---");
    console.log(`Created: ${createdCount}`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped (already exist): ${skippedCount}`);
    console.log(`Total in seed list: ${SEED_FEATURES.length}`);

    await mongoose.disconnect();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding features:", err);
    process.exit(1);
  }
}

seed();
