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
 * File: pages/backend/controllers/eventController.js
 * Description: Event Controller - Handles all event-related operations
 * Features: CRUD operations for events, event filtering, random event selection
 */

import Event from '../database/events/eventModel.js';

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); // Sort by date ascending
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// Get a single event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// Update an event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true // Run schema validators
      }
    );
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

// Get events by category
export const getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const events = await Event.find({ category: category.toLowerCase() }).sort({ date: 1 });
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events by category',
      error: error.message
    });
  }
};

// Get 2 random events for recommendations
export const getRandomEvents = async (req, res) => {
  try {
    // Get total count of events
    const totalEvents = await Event.countDocuments();
    
    if (totalEvents === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }
    
    // If we have 2 or fewer events, return all
    if (totalEvents <= 2) {
      const events = await Event.find();
      return res.status(200).json({
        success: true,
        count: events.length,
        data: events
      });
    }
    
    // Get 2 random events using MongoDB's $sample aggregation
    const randomEvents = await Event.aggregate([
      { $sample: { size: 2 } }
    ]);
    
    res.status(200).json({
      success: true,
      count: randomEvents.length,
      data: randomEvents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching random events',
      error: error.message
    });
  }
};

