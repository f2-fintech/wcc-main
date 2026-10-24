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
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Super Admin';

  if (!email || !password) {
    console.error("Error: ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env.local or environment.");
    console.error("Example: ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=yourStrongPassword node scripts/seedAdmin.js");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Error: ADMIN_PASSWORD must be at least 8 characters long.");
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI missing in .env.local");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  const existing = await AdminUser.findOne({ email: email.toLowerCase().trim() });
  const shouldUpdate = process.argv.includes('--update') || process.env.ADMIN_UPDATE === 'true';

  const passwordHash = await bcrypt.hash(password, 10);

  if (existing) {
    if (shouldUpdate) {
      existing.passwordHash = passwordHash;
      if (name) existing.name = name;
      await existing.save();
      console.log(`Admin user password updated successfully for: ${existing.email}`);
    } else {
      console.log(`Admin user already exists (${existing.email}). Pass --update or ADMIN_UPDATE=true to update credentials.`);
    }
  } else {
    await AdminUser.create({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'admin'
    });
    console.log(`Admin user created successfully for: ${email}`);
  }

  process.exit(0);
}

seed();
