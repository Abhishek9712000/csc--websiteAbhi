// Run once with: npm run seed
// Creates a default admin login and starter services.
// Safe to re-run - it won't duplicate existing records.

require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const Service = require("./models/Service");

const DEFAULT_ADMIN_USERNAME = "ashish";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD || "Ashish@123";

const starterServices = [
  // ============ IDENTITY DOCUMENTS ============
  {
    name: "PAN Card Apply",
    slug: "pan-card-apply",
    category: "Identity Documents",
    description: "New PAN Card application.",
    price: 199,
    requiredDocuments: ["Aadhaar card", "PAN card (if any)", "Passport size photo", "Signature on white paper"],
  },
  {
    name: "PAN Card Correction",
    slug: "pan-card-correction",
    category: "Identity Documents",
    description: "Correct name, DOB, photo or other details on existing PAN card.",
    price: 150,
    requiredDocuments: ["Existing PAN card copy", "Aadhaar card copy", "Proof for correction"],
  },
  {
    name: "Aadhaar Card Print / Update",
    slug: "aadhaar-print-update",
    category: "Identity Documents",
    description: "Print a copy of Aadhaar or update details.",
    price: 50,
    requiredDocuments: ["Existing Aadhaar number or enrolment slip"],
  },

  // ============ GOVERNMENT DOCUMENTS ============
  {
    name: "Aay Certificate (Income)",
    slug: "aay-certificate",
    category: "Government Documents",
    description: "Income Certificate application.",
    price: 80,
    requiredDocuments: ["Aadhaar card", "PAN card", "Passport size photo"],
  },
  {
    name: "Jati Certificate (Caste)",
    slug: "jati-certificate",
    category: "Government Documents",
    description: "Caste Certificate application.",
    price: 80,
    requiredDocuments: ["Aadhaar card", "Father's Caste Certificate", "Passport size photo"],
  },
  {
    name: "Niwas Certificate (Domicile)",
    slug: "niwas-certificate",
    category: "Government Documents",
    description: "Domicile Certificate application.",
    price: 80,
    requiredDocuments: ["Aadhaar card", "Pradhan Niwas", "Passport size photo"],
  },
  {
    name: "Ration Card Apply",
    slug: "ration-card-apply",
    category: "Government Documents",
    description: "New Ration Card application.",
    price: 99,
    requiredDocuments: ["Aay Praman Patra", "Aadhaar card", "Bank passbook", "Passport size photo"],
  },

  // ============ GOVERNMENT SCHEMES ============
  {
    name: "Ayushman Card Apply",
    slug: "ayushman-card-apply",
    category: "Government Schemes",
    description: "Ayushman Bharat card application.",
    price: 99,
    requiredDocuments: ["Aadhaar card", "Ration card", "Passport size photo"],
  },
  {
    name: "Labour Card Print",
    slug: "labour-card-print",
    category: "Government Schemes",
    description: "Labour card print service.",
    price: 149,
    requiredDocuments: ["Aadhaar card", "Passport size photo"],
  },
  {
    name: "PF Apply",
    slug: "pf-apply",
    category: "Government Schemes",
    description: "Provident Fund application.",
    price: 99,
    requiredDocuments: ["PF Number", "Bank passbook"],
  },
  {
    name: "Pension Apply",
    slug: "pension-apply",
    category: "Government Schemes",
    description: "Pension scheme application.",
    price: 99,
    requiredDocuments: ["Bank passbook", "Aadhaar card", "Aay Praman Patra", "Passport size photo"],
  },

  // ============ PRINTING ============
  {
    name: "Color Printout",
    slug: "color-printout",
    category: "Printing",
    description: "Color printing of documents.",
    price: 10,
    requiredDocuments: ["File(s) to print"],
  },
  {
    name: "Black & White Printout",
    slug: "bw-printout",
    category: "Printing",
    description: "Black and white printing.",
    price: 3,
    requiredDocuments: ["File(s) to print"],
  },
  {
    name: "Passport Size Photo",
    slug: "passport-size-photo",
    category: "Printing",
    description: "Passport size photo print (8 photos).",
    price: 36,
    requiredDocuments: ["Photo"],
  },
  {
    name: "Passport Photo (36 Photos)",
    slug: "passport-photo-36",
    category: "Printing",
    description: "Passport photo print - 36 copies.",
    price: 99,
    requiredDocuments: ["Photo"],
  },
  {
    name: "PVC Card Print",
    slug: "pvc-card-print",
    category: "Printing",
    description: "PVC card printing service.",
    price: 99,
    requiredDocuments: ["Aadhaar card or document to print"],
  },
  {
    name: "12x18 Size Photo Album",
    slug: "photo-album-12x18",
    category: "Printing",
    description: "12x18 size photo album printing.",
    price: 599,
    requiredDocuments: ["Photos to print"],
  },

  // ============ ONLINE SERVICES ============
  {
    name: "Online Form Filling",
    slug: "online-form-filling",
    category: "Online Services",
    description: "Assistance filling any government or private online form.",
    price: 99,
    requiredDocuments: ["Details/documents needed for the specific form"],
  },
];

async function seed() {
  await connectDB();

  // ========== ADMIN ==========
  const existingAdmin = await Admin.findOne({ username: DEFAULT_ADMIN_USERNAME });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
    await Admin.create({ username: DEFAULT_ADMIN_USERNAME, passwordHash, name: "Ashish Kumar Singh" });
    console.log(`Created admin login -> username: ${DEFAULT_ADMIN_USERNAME}  password: ${DEFAULT_ADMIN_PASSWORD}`);
    console.log("IMPORTANT: log in and change this password right away.");
  } else {
    console.log("Admin account already exists, skipping.");
  }

  // ========== DELETE OLD DUPLICATE SERVICES ==========
  const oldSlugs = [
    "electricity-bill-payment",
    "pan-card-new",
    "aay-jati-niwas",
  ];

  for (const slug of oldSlugs) {
    const deleted = await Service.findOneAndDelete({ slug });
    if (deleted) {
      console.log(`Removed old service: ${deleted.name} (${slug})`);
    }
  }

  // ========== ADD/UPDATE SERVICES ==========
  for (const s of starterServices) {
    const exists = await Service.findOne({ slug: s.slug });
    if (!exists) {
      await Service.create(s);
      console.log(`Added service: ${s.name} (₹${s.price})`);
    } else {
      await Service.updateOne({ slug: s.slug }, { $set: s });
      console.log(`Updated service: ${s.name} (₹${s.price})`);
    }
  }

  console.log("\n✅ Seeding complete.");
  console.log(`Total services: ${await Service.countDocuments()}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});