/**
 * CSE211 Web Programming - Fall 2025-2026
 * Final Course Project - Group 01
 * EventsX - Dynamic Responsive Event Planner Web Application
 * 
 * Team Members:
 * - Ibrahim Hassan - 223104567
 * - George Karm Hosney Fayz - 223106365
 * - Youssef Ahmed Ibrahim - 223101109
 * - Abdallah Mostafa Mahdy - 223104683
 * 
 * File: pages/backend/config/db.js
 * Description: Database Configuration - MongoDB connection setup
 * Features: MongoDB connection, connection error handling, environment variable support
 */

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // MongoDB connection string - update this with your MongoDB URI
    // For local MongoDB: mongodb://localhost:27017/your-database-name
    // For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database-name
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://youahmibr18_db_user:OeS4oVbq2Fo5sd1D@cluster0.ufmr2xd.mongodb.net/eventsx?retryWrites=true&w=majority';
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;

