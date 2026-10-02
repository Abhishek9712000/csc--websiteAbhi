require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: "ashish" });

    if (existingAdmin) {
      console.log("Admin already exists!");
      process.exit();
    }

    // Hash password
    const passwordHash = await bcrypt.hash("Ashish@123", 10);

    // Create admin
    const admin = new Admin({
      username: "ashish",
      passwordHash,
      name: "Ashish Kumar Singh",
    });

    await admin.save();

    console.log("================================");
    console.log("✅ Admin Created Successfully!");
    console.log("Username : ashish");
    console.log("Password : Ashish@123");
    console.log("================================");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();