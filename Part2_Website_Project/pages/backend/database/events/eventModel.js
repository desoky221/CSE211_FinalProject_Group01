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
 * File: pages/backend/database/events/eventModel.js
 * Description: Event Model - MongoDB schema for event data
 * Features: Event details, date/time, location, pricing, category
 */

import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        default: 0
    }
})

const Event = mongoose.model('Event', eventSchema);
export default Event;