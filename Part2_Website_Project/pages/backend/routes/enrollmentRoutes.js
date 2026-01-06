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
 * File: pages/backend/routes/enrollmentRoutes.js
 * Description: Enrollment Routes - Defines API endpoints for enrollment operations
 * Features: Event enrollment, user enrollment retrieval, enrollment removal
 */

import express from 'express';
import {
  enrollInEvent,
  getUserEnrollments,
  unenrollFromEvent
} from '../controllers/enrollmentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/events/:eventId', enrollInEvent);
router.get('/my-enrollments', getUserEnrollments);
router.delete('/events/:eventId', unenrollFromEvent);

export default router;

