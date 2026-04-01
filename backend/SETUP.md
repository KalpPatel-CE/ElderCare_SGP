# Quick Setup Guide

## Prerequisites
- Node.js v16+ installed
- Neon PostgreSQL account (free tier available)

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your credentials
```

Required environment variables:
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `JWT_SECRET` - A secure random string for JWT signing
- `PORT` - Server port (default: 5000)

### 3. Set Up Database

#### Option A: Using Neon Dashboard (Recommended)
1. Go to https://console.neon.tech
2. Open SQL Editor
3. Copy contents of `database-schema.sql`
4. Paste and execute in SQL Editor

#### Option B: Using psql CLI
```bash
psql "your-neon-connection-string" -f database-schema.sql
```

### 4. Seed Test Data (Optional)
```bash
npm run seed
```

This creates test users:
- Admin: admin@eldercare.com / password123
- Family: ramesh@example.com / password123
- Caretaker: sarah@example.com / password123

### 5. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on http://localhost:5000

### 6. Test the API

Health check:
```bash
curl http://localhost:5000
```

Expected response:
```json
{
  "status": "running",
  "message": "Eldercare Backend API",
  "version": "1.0.0"
}
```

## Common Issues

### Database Connection Failed
- Check your DATABASE_URL in .env
- Ensure your IP is whitelisted in Neon dashboard
- Verify internet connection

### Port Already in Use
- Change PORT in .env file
- Or kill the process using port 5000

### JWT Secret Missing
- Make sure JWT_SECRET is set in .env
- Generate a secure random string

## Project Structure
```
backend/
├── controllers/     # Business logic
├── db/             # Database connection
├── middleware/     # Auth middleware
├── routes/         # API routes
├── utils/          # Helper functions
├── .env            # Environment variables (not in git)
├── .env.example    # Example environment file
├── database-schema.sql  # Database schema
├── seed.js         # Test data seeder
└── server.js       # Entry point
```

## Next Steps
- Read the full README.md for API documentation
- Test API endpoints using Postman or curl
- Start building your frontend!

## Need Help?
- Check README.md for detailed documentation
- Review database-schema.sql for table structures
- Examine controllers/ for API logic examples
