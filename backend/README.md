# Eldercare Backend API

A RESTful API backend for the Eldercare Management System, built with Express.js and PostgreSQL (Neon).

## Features

- ✓ User authentication with JWT
- ✓ Role-based access control (Admin, Family, Caretaker)
- ✓ Elder management
- ✓ Medication tracking
- ✓ Appointment scheduling
- ✓ Activity logging
- ✓ Event management
- ✓ Alert system

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon Serverless)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Neon PostgreSQL account

## Setup Instructions

### 1. Clone and Install

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
DATABASE_URL=postgresql://username:password@your-neon-host.aws.neon.tech/dbname?sslmode=require
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

### 3. Set Up Database

1. Create a free account at [Neon.tech](https://neon.tech/)
2. Create a new project and database
3. Copy the connection string from your Neon dashboard
4. Paste it into your `.env` file as `DATABASE_URL`
5. Run the database schema (see Database Schema section below)

### 4. Run the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user

### Users
- `GET /users` - Get all users (Admin only)
- `GET /users/:id` - Get user by ID

### Elders
- `GET /elders` - Get all elders
- `POST /elders` - Add new elder
- `GET /elders/:user_code` - Get elders by user code

### Medications
- `POST /medications` - Add medication
- `GET /medications/:elder_code` - Get medications by elder
- `PUT /medications/:id/status` - Update medication status

### Appointments
- `GET /appointments` - Get all appointments
- `POST /appointments` - Create appointment
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Delete appointment

### Activities
- `GET /activities` - Get all activities
- `POST /activities` - Log new activity

### Events
- `GET /events` - Get all events
- `POST /events` - Create event

### Alerts
- `GET /alerts` - Get all alerts
- `POST /alerts` - Create alert
- `PUT /alerts/:id` - Mark alert as read

## Database Schema

The application uses the following tables:

- `users` - User accounts with authentication
- `elders` - Elder profiles
- `user_elder_map` - Relationship mapping between users and elders
- `medications` - Medication records
- `appointments` - Appointment scheduling
- `activities` - Activity logs
- `events` - System events
- `alerts` - Alert notifications

## Project Structure

```
backend/
├── controllers/       # Business logic
├── db/                # Database connection
├── middleware/        # Auth and other middleware
├── routes/            # API route definitions
├── .env               # Environment variables (not in git)
├── .env.example       # Example environment file
├── .gitignore         # Git ignore rules
├── package.json       # Dependencies
├── server.js          # Application entry point
└── README.md          # This file
```

## Security Notes

- Never commit `.env` file to version control
- Use strong JWT secrets in production
- Always use HTTPS in production
- Regularly update dependencies

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC
