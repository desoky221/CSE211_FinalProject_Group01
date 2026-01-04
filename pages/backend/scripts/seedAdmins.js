import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../database/user/userModel.js';
import bcrypt from 'bcryptjs';

// Connect to database
await connectDB();

// 4 Static Admin Accounts
const adminAccounts = [
  {
    name: 'Admin One',
    email: 'admin1@eventsx.com',
    password: 'admin123',
    role: 'admin',
    governorate: 'Cairo'
  },
  {
    name: 'Admin Two',
    email: 'admin2@eventsx.com',
    password: 'admin123',
    role: 'admin',
    governorate: 'Giza'
  },
  {
    name: 'Admin Three',
    email: 'admin3@eventsx.com',
    password: 'admin123',
    role: 'admin',
    governorate: 'Alexandria'
  },
  {
    name: 'Admin Four',
    email: 'admin4@eventsx.com',
    password: 'admin123',
    role: 'admin',
    governorate: 'Cairo'
  }
];

// Seed admin accounts
async function seedAdmins() {
  try {
    console.log('Creating admin accounts...');
    
    for (const admin of adminAccounts) {
      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: admin.email });
      
      if (existingAdmin) {
        console.log(`Admin ${admin.email} already exists, skipping...`);
        continue;
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      
      // Create admin
      await User.create({
        ...admin,
        password: hashedPassword
      });
      
      console.log(`Created admin: ${admin.email}`);
    }
    
    console.log('Admin accounts created successfully!');
    console.log('\nAdmin Login Credentials:');
    console.log('Email: admin1@eventsx.com, admin2@eventsx.com, admin3@eventsx.com, admin4@eventsx.com');
    console.log('Password: admin123 (for all admins)');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admins:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the seed function
seedAdmins();

