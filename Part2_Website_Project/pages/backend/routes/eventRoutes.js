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
 * File: pages/backend/routes/eventRoutes.js
 * Description: Event Routes - Defines API endpoints for event operations
 * Features: Event CRUD operations, event filtering, random event selection
 */

import express from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByCategory,
  getRandomEvents
} from '../controllers/eventController.js';

const router = express.Router();

// Route to get all events
router.get('/', getAllEvents);

// Route to get events by category
router.get('/category/:category', getEventsByCategory);

// Route to get 2 random events (must be before /:id route)
router.get('/random', getRandomEvents);

// Route to get a single event by ID
router.get('/:id', getEventById);

// Route to create a new event
router.post('/', createEvent);

// Route to update an event
router.put('/:id', updateEvent);

// Route to delete an event
router.delete('/:id', deleteEvent);

export default router;

