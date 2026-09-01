import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { SERVICE_CATALOGUE } from "../src/data/services";
import { Service } from "../src/models/Service";
import { AdminUser } from "../src/models/AdminUser";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error(
      "\n  MONGODB_URI is missing.\n  Create .env.local, paste your MongoDB connection string, then run this again.\n"
    );
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || "docseva" });
  console.log("Connected to MongoDB");

  let created = 0;
  let updated = 0;
  for (const service of SERVICE_CATALOGUE) {
    const existing = await Service.findOne({ slug: service.slug });
    if (existing) {
      await Service.updateOne({ slug: service.slug }, { $set: service });
      updated += 1;
    } else {
      await Service.create({
        ...service,
        seoTitle: `${service.title} Online — Apply, Track and Get It Delivered`,
        seoDescription: service.shortDescription,
      });
      created += 1;
    }
  }
  console.log(`Services: ${created} created, ${updated} updated`);

  const email = (process.env.ADMIN_EMAIL || "admin@docseva.in").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "ChangeMe@123";
  const existingAdmin = await AdminUser.findOne({ email });
  if (existingAdmin) {
    console.log(`Admin already exists: ${email}`);
  } else {
    await AdminUser.create({
      name: process.env.ADMIN_NAME || "Owner",
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "OWNER",
    });
    console.log(`Admin created -> ${email} / ${password}`);
    console.log("Change this password after your first login.");
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
