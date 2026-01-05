# EventsX - Dynamic Responsive Event Planner Web Application

**CSE211 Web Programming - Fall 2025-2026**  
**Final Course Project - Group 00**

## Project Overview

EventsX is a fully responsive, multi-page personal event planner web application that allows users to browse upcoming events, register for events, calculate event-related budgets, search/filter events, and display events dynamically using JavaScript.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [File Structure](#file-structure)
- [Code Organization](#code-organization)
- [Browser Compatibility](#browser-compatibility)
- [Validation](#validation)
- [Deployment](#deployment)
- [Team Members](#team-members)
- [AI Assistance](#ai-assistance)

## Features

### User Features
- **User Authentication**: Secure registration and login system with JWT tokens
- **Event Browsing**: Browse all available events with detailed information
- **Event Filtering**: Filter events by keyword, category, location, and date
- **Event Enrollment**: Enroll in events with automatic budget calculator integration
- **Budget Calculator**: Calculate total event costs including:
  - Ticket prices (sum of all enrolled events)
  - Transportation costs (based on governorate distance)
  - Accommodation costs
  - Grand total calculation
- **Student Dashboard**: View enrolled events, statistics, and recommended events
- **Profile Management**: Update profile information and upload profile pictures
- **Role-Based Access**: Different interfaces for students and administrators

### Admin Features
- **Event Management**: Create new events with full details
- **Event Administration**: Manage all events in the system

## Technology Stack

### Frontend
- **HTML5**: Semantic markup with proper structure
- **CSS3**: Modern styling with Flexbox layouts
- **JavaScript (ES6+)**: Dynamic functionality and API integration
- **LocalStorage**: Client-side data persistence

### Backend
- **Node.js**: Server runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing

## Project Structure

```
Part2_Website_Project/
├── index.html                 # Home page
├── pages/
│   ├── about.html            # About Us page
│   ├── contact.html           # Contact page
│   ├── login.html             # Login page
│   ├── registration.html      # Registration page
│   ├── events.html            # Events catalog page
│   ├── student-dashboard.html # Student dashboard
│   ├── profile.html           # User profile page
│   ├── budget-calculator.html # Budget calculator
│   ├── privacy.html           # Privacy policy
│   ├── terms.html             # Terms of service
│   ├── thank-you.html         # Thank you page
│   ├── css/                   # Stylesheets
│   │   ├── common.css         # Shared styles
│   │   ├── index.css          # Home page styles
│   │   ├── registration.css  # Registration/login styles
│   │   ├── events.css        # Events page styles
│   │   ├── student-dashboard.css
│   │   └── ...
│   ├── scripts/               # Frontend JavaScript
│   │   ├── auth.js           # Authentication logic
│   │   ├── common.js         # Shared utilities
│   │   ├── dashboard.js     # Dashboard functionality
│   │   ├── event-filter.js  # Event filtering/enrollment
│   │   ├── budget-calculator.js
│   │   ├── profile.js       # Profile management
│   │   ├── registration.js # Registration validation
│   │   └── validation.js   # Form validation
│   ├── images/               # Image assets
│   ├── videos/               # Video assets
│   └── backend/              # Backend server
│       ├── server.js        # Express server
│       ├── config/
│       │   └── db.js        # Database configuration
│       ├── controllers/     # Request handlers
│       │   ├── authController.js
│       │   ├── eventController.js
│       │   └── enrollmentController.js
│       ├── routes/          # API routes
│       │   ├── authRoutes.js
│       │   ├── eventRoutes.js
│       │   └── enrollmentRoutes.js
│       ├── middleware/     # Custom middleware
│       │   └── auth.js     # Authentication middleware
│       └── database/       # Database models
│           ├── user/
│           │   └── userModel.js
│           ├── events/
│           │   └── eventModel.js
│           └── enrollment/
│               └── enrollmentModel.js
├── package.json             # Node.js dependencies
├── package-lock.json       # Dependency lock file
└── README.md              # This file
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CSE211_FinalProject_Group00/Part2_Website_Project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the `pages/backend/` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/eventsx
   JWT_SECRET=your-secret-key-change-in-production
   PORT=3000
   ```

4. **Start MongoDB**
   Ensure MongoDB is running on your system or configure cloud MongoDB connection.

5. **Start the backend server**
   ```bash
   cd pages/backend
   node server.js
   ```
   Or with nodemon for development:
   ```bash
   nodemon server.js
   ```

6. **Open the application**
   - Open `index.html` in a web browser
   - Or use a local server (e.g., Live Server extension in VS Code)
   - The application will connect to the backend API at `http://localhost:3000`

## Configuration

### Backend Configuration
- **Port**: Default is 3000, can be changed via `PORT` environment variable
- **Database**: MongoDB connection string in `.env` file
- **JWT Secret**: Change in production environment

### Frontend Configuration
- **API URL**: Currently set to `http://localhost:3000/api`
- Update in respective JavaScript files if backend URL changes

## Running the Application

### Development Mode

1. **Start MongoDB** (if using local instance)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd pages/backend
   npm start
   # or
   nodemon server.js
   ```

3. **Open Frontend**
   - Use a local development server (Live Server, http-server, etc.)
   - Or open `index.html` directly in browser (some features may not work)

### Production Mode

1. Build and deploy backend to hosting service
2. Update API URLs in frontend JavaScript files
3. Deploy frontend to web hosting service
4. Configure CORS if frontend and backend are on different domains

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/profile` - Update user profile

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `GET /api/events/random` - Get random events (for recommendations)
- `POST /api/events` - Create new event (admin only)

### Enrollments
- `GET /api/enrollments/my-enrollments` - Get user's enrollments
- `POST /api/enrollments/events/:eventId` - Enroll in event

## File Structure

### HTML Files
All HTML files follow HTML5 semantic structure with proper accessibility attributes.

### CSS Files
- Organized by page/component
- Uses CSS3 features including Flexbox
- Responsive design with media queries
- CSS variables for theming

### JavaScript Files
All JavaScript files follow SOLID principles:
- **Single Responsibility**: Each module has one clear purpose
- **DRY (Don't Repeat Yourself)**: Shared functions extracted to common modules
- **Modular Structure**: Clear separation of concerns
- **JSDoc Comments**: Comprehensive function documentation

## Code Organization

### Frontend Scripts

#### `auth.js`
- Authentication operations
- Login/registration form handling
- Password visibility toggle
- Token management

#### `common.js`
- Shared utilities
- Profile dropdown management
- Navigation helpers
- UI initialization

#### `dashboard.js`
- Dashboard data loading
- Statistics calculation
- Event rendering
- Recommended events

#### `event-filter.js`
- Event filtering logic
- Enrollment management
- Admin event creation
- Role-based UI

#### `budget-calculator.js`
- Budget calculations
- Transportation cost calculation
- Event management
- Total calculation

#### `profile.js`
- Profile data loading
- Profile picture upload
- Profile updates
- File validation

#### `registration.js` & `validation.js`
- Form validation
- Input validation functions
- Error display

### Backend Structure

#### Controllers
- Handle business logic
- Process requests
- Return responses

#### Routes
- Define API endpoints
- Apply middleware
- Route to controllers

#### Models
- Define database schemas
- Data validation
- Relationships

#### Middleware
- Authentication verification
- Request validation
- Error handling

## Browser Compatibility

The application is tested and compatible with:
- ✅ Microsoft Edge (current version)
- ✅ Firefox (current version)
- ✅ Google Chrome (current version)
- ✅ Opera (current version)
- ✅ Safari (Mac and Windows)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Validation

### HTML Validation
All HTML files are validated against W3C HTML5 standards. Validation screenshots are stored in the project documentation.

### CSS Validation
All CSS files are validated against W3C CSS3 standards.

### JavaScript Validation
JavaScript code follows ES6+ standards and is validated using ESLint.

### Form Validation
- Client-side validation for immediate feedback
- Server-side validation for security
- Password strength requirements:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character

## Deployment

### Recommended Hosting Services
- **Tiiny Host**: https://tiiny.host
- **ICDSoft**: https://www.icdsoft.com/
- **AccuWebHosting**: https://www.accuwebhosting.com/
- **Hostinger**: https://www.hostinger.com
- **Infinityfree**: https://www.infinityfree.com
- **Amazon Web Services**: https://aws.amazon.com/
- **Google Cloud**: https://cloud.google.com

### Deployment Steps

1. **Backend Deployment**
   - Deploy Node.js backend to hosting service (Heroku, Railway, Render, etc.)
   - Configure environment variables
   - Set up MongoDB database (MongoDB Atlas recommended)

2. **Frontend Deployment**
   - Upload HTML, CSS, JavaScript files to web hosting
   - Update API URLs in JavaScript files to point to deployed backend
   - Test all functionality

3. **Database Setup**
   - Create MongoDB database
   - Configure connection string
   - Seed initial data if needed

## Team Members

**Group 00**
- [Team Member 1 Name] - [ID]
- [Team Member 2 Name] - [ID]
- [Team Member 3 Name] - [ID]
- [Team Member 4 Name] - [ID]

### Responsibilities
- All team members contributed to coding, report integration, quality check, and code submission.

## AI Assistance

### AI Tools Used
- ChatGPT
- GitHub Copilot
- Claude

### AI-Assisted Components
- Code refactoring and optimization
- Documentation generation
- Code structure improvements
- Bug fixes and debugging

### Acknowledgment
All AI-assisted code and content is documented in the project report's "AI Assistance Appendix" as required by the course guidelines.

## Additional Documentation

- **Website Map**: See `Part3_Documentation/Website_Map.pdf`
- **Validation Report**: See `Part3_Documentation/Validation_Report.pdf`
- **Browser Testing Report**: See `Part3_Documentation/Browser_Testing_Report.pdf`
- **AI Tools Usage**: See `Part3_Documentation/AI_Tools_Usage_Documentation.pdf`

## License

This project is developed for educational purposes as part of CSE211 Web Programming course.

## Contact

For questions or issues, please contact the development team or course instructor.

---

**Submission Date**: Sunday, January 5, 2026  
**Course**: CSE211 Web Programming - Fall 2025-2026  
**Project**: Final Course Project - EventsX

