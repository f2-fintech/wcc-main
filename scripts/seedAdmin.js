const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const AdminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI missing in .env.local");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  const email = 'admin@whitecoatclub.com';
  const existing = await AdminUser.findOne({ email });

  if (existing) {
    console.log("Admin user already exists.");
  } else {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await AdminUser.create({
      name: 'Super Admin',
      email,
      passwordHash,
      role: 'admin'
    });
    console.log("Admin user created: admin@whitecoatclub.com / admin123");
  }

  process.exit(0);
}

seed();
