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
 * File: pages/backend/database/user/userModel.js
 * Description: User Model - MongoDB schema for user data
 * Features: User registration fields, password hashing, profile picture support
 */

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    governorate: {
        type: String,
        required: true
    },
    birthday: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', '']
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    enrolledEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;

