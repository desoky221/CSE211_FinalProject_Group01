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
 * File: pages/backend/database/enrollment/enrollmentModel.js
 * Description: Enrollment Model - MongoDB schema for event enrollments
 * Features: User-event relationships, enrollment timestamps
 */

import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Prevent duplicate enrollments
enrollmentSchema.index({ user: 1, event: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
export default Enrollment;

