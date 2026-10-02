// Run once with: node cleanup.js
// Deletes old duplicate services that have old slugs

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Service = require("./models/Service");

// Purane slugs jo delete karne hain
const OLD_SLUGS = [
  "aadhaar-update",
  "electricity-bill",
  "pan-card",
  "passport",
  "printing",
  "railway-ticket",
  "electricity-bill-payment",
  "aay-jati-niwas",
];

async function cleanup() {
  await connectDB();

  console.log("\n🔍 Searching for old services...\n");

  for (const slug of OLD_SLUGS) {
    const service = await Service.findOneAndDelete({ slug });
    if (service) {
      console.log(`❌ Deleted: ${service.name} (slug: ${slug})`);
    } else {
      console.log(`⏭️  Not found: ${slug}`);
    }
  }

  const remaining = await Service.countDocuments();
  console.log(`\n✅ Cleanup complete.`);
  console.log(`📊 Remaining services: ${remaining}`);
  process.exit(0);
}

cleanup().catch((err) => {
  console.error(err);
  process.exit(1);
});