# Elder Health & Care Monitoring System - Quick Start Guide

## Prerequisites
- Node.js installed
- PostgreSQL installed and running
- Database 'eldercare' created with required tables

## Backend Setup

1. Navigate to backend directory:
```bash
cd eldercare-backend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Ensure .env file has correct database password:
```
DB_PASSWORD=your_postgres_password
```

4. Start backend server:
```bash
node server.js
```

Backend will run on: http://localhost:5000

## Frontend Setup

1. Navigate to frontend directory:
```bash
cd eldercare-frontend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Start React development server:
```bash
npm start
```

Frontend will run on: http://localhost:3000

## Testing the Application

### Test Users (ensure these exist in your database):

**Family User:**
- user_code: USR-F1
- role: family

**Caretaker User:**
- user_code: USR-C1
- role: caretaker

**Admin User:**
- user_code: USR-A1
- role: admin

### Login Flow:

1. Open http://localhost:3000
2. Enter a user_code (e.g., USR-F1)
3. Click Login
4. You'll be redirected to the appropriate dashboard based on role

### Dashboard Features:

**Family Dashboard (/family):**
- View assigned elders
- See today's events (color-coded: green=taken, red=missed)
- View alerts

**Caretaker Dashboard (/caretaker):**
- View assigned elders
- See today's activities
- View alerts

**Admin Dashboard (/admin):**
- View all users
- View all elders
- See total counts

### Logout:
- Click "Logout" button in navbar
- Redirects to login page
- localStorage cleared

## API Endpoints Available

### Authentication
- POST /auth/login - Login with user_code

### Users
- GET /users - Get all users (admin)

### Elders
- GET /elders - Get all elders
- GET /elders/user/:user_code - Get elders by user
- POST /elders - Add new elder

### Events
- GET /events/today/:elder_code - Get today's events
- POST /events - Create new event

### Alerts
- GET /alerts/:user_code - Get alerts for user

### Medications
- POST /medications - Add medication

### Appointments
- POST /appointments - Add appointment

### Activities
- POST /activities - Add activity

## Troubleshooting

### Backend not connecting to database:
- Check PostgreSQL is running
- Verify .env DB_PASSWORD is correct
- Ensure 'eldercare' database exists

### Frontend not connecting to backend:
- Ensure backend is running on port 5000
- Check api.js baseURL is http://localhost:5000

### Login not working:
- Verify user exists in database with correct user_code
- Check browser console for errors
- Verify backend /auth/login endpoint is working

### Route protection not working:
- Clear localStorage
- Try logging in again
- Check browser console for errors

## Project Structure

```
sgp/
├── eldercare-backend/
│   ├── controllers/     - Business logic
│   ├── routes/          - API endpoints
│   ├── db/              - Database connection
│   └── server.js        - Express server
│
└── eldercare-frontend/
    └── src/
        ├── components/  - Reusable UI components
        ├── pages/       - Dashboard pages
        ├── api.js       - Axios configuration
        ├── App.js       - Main routing
        └── ProtectedRoute.js - Route guard
```

## Features Implemented

✅ Backend authentication with database
✅ Role-based routing (family/caretaker/admin)
✅ Route protection
✅ Family dashboard with elders and events
✅ Caretaker dashboard with assigned elders
✅ Admin dashboard with user management
✅ Reusable components (Navbar, Cards)
✅ Color-coded event status
✅ Alert system
✅ Logout functionality
✅ Loading states
✅ Error handling
✅ Clean UI with inline styling

## Next Steps (Optional Enhancements)

- Add form to create new elders
- Add form to log events
- Add date picker for historical events
- Add user profile page
- Add password authentication
- Add role-based access control middleware
- Add data visualization charts
- Add real-time notifications
