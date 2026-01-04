import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Event from '../database/events/eventModel.js';

// Connect to database
await connectDB();

// Sample events data
const sampleEvents = [
  {
    title: 'Web Design Sprint',
    description: 'Learn modern web design techniques and best practices',
    date: new Date('2026-01-10'),
    location: 'Lab A - Main Campus',
    category: 'workshop',
    cost: 10
  },
  {
    title: 'Career Prep Seminar',
    description: 'Get ready for your career with tips from industry experts',
    date: new Date('2026-02-05'),
    location: 'Auditorium - Building 3',
    category: 'seminar',
    cost: 0
  },
  {
    title: 'Research Poster Day',
    description: 'Showcase your research and network with peers',
    date: new Date('2026-03-18'),
    location: 'Hall C - Innovation Center',
    category: 'seminar',
    cost: 5
  },
  {
    title: 'Networking Night',
    description: 'Connect with professionals and fellow students',
    date: new Date('2026-04-02'),
    location: 'Conference Room 2',
    category: 'networking',
    cost: 15
  },
  {
    title: 'Python Programming Workshop',
    description: 'Hands-on Python programming workshop for beginners',
    date: new Date('2026-04-15'),
    location: 'Computer Lab B',
    category: 'workshop',
    cost: 12
  },
  {
    title: 'AI & Machine Learning Summit',
    description: 'Explore the latest trends in AI and Machine Learning',
    date: new Date('2026-05-10'),
    location: 'Main Auditorium',
    category: 'summit',
    cost: 20
  },
  {
    title: 'Entrepreneurship Workshop',
    description: 'Learn how to start your own business',
    date: new Date('2026-07-20'),
    location: 'Business Center',
    category: 'workshop',
    cost: 60
  }
];

// Seed the database
async function seedEvents() {
  try {
    // Clear existing events (optional - comment out if you want to keep existing data)
    await Event.deleteMany({});
    console.log('Cleared existing events');
    
    // Insert sample events
    const events = await Event.insertMany(sampleEvents);
    console.log(`Successfully seeded ${events.length} events`);
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding events:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the seed function
seedEvents();

