# ElderCare - Professional Caretaker Rental Platform

> A comprehensive platform connecting families with verified professional caretakers for elderly care services.

## 🎯 Project Overview

ElderCare is a full-stack web application that facilitates professional elderly care services by connecting families with background-verified caretakers. The platform supports three user roles with dedicated dashboards and features city-based caretaker matching for optimal service delivery.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- PostgreSQL database (Neon configured)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
# Configure .env file with DATABASE_URL and JWT_SECRET
node server.js
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📱 User Roles

### 1. Family Members
- Create elder profiles with medical history
- Manage medications and activities
- Set baseline vitals for reference
- Request caretaker services with city preference
- View assigned caretaker details
- Receive daily care logs and vitals reports

### 2. Caretakers
- View current assignment details
- Access elder's complete profile
- Todo-style task checklist for daily care
- Submit end-of-day care reports
- Record vital signs with automatic alerts
- View past assignments

### 3. Administrators
- View platform statistics
- Manage pending service requests
- Assign caretakers with city-based filtering
- Add and verify caretakers
- Manage family accounts
- Oversee all assignments

## 🌟 Key Features

### City-Based Matching
- Families specify service city when requesting caretaker
- System automatically filters caretakers from the same city
- Visual indicators (green badges) for city matches
- Graceful fallback to all available caretakers

### Smart Alerts
- Automatic alerts for abnormal vital signs
- Notifications for caretaker assignments
- Real-time updates for families

### Professional UI/UX
- Clean, modern design
- Responsive layouts
- Intuitive navigation
- Status badges and empty states
- Slide panels for forms

## 🛠️ Technology Stack

**Backend:**
- Node.js + Express.js
- PostgreSQL (Neon)
- JWT Authentication
- bcrypt for password hashing

**Frontend:**
- React 18
- React Router v6
- Axios
- CSS Modules

## 📊 Database Schema

17 tables including:
- User management (admins, families, caretakers, elders)
- Service management (requests, assignments, details)
- Care data (medications, activities, vitals, logs)
- System (alerts, appointments)

## 🔐 Demo Credentials

**Admin:**
- Email: admin@mail.com
- Password: password

**Test Caretakers:**
- CRT-1, CRT-3, CRT-5: Ahmedabad
- CRT-2: Surat
- CRT-4: Vadodara

## 📁 Project Structure

```
sgp/
├── backend/              # Express API server
│   ├── controllers/     # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & upload
│   └── db/              # Database connection
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   └── styles/      # Global styles
└── Documentation/       # Project documentation
```

## 📖 Documentation

- **FINAL_AUDIT_REPORT.md** - Complete system audit and metrics
- **CITY_FIXES_COMPLETE.md** - City-based matching implementation
- **FIXES_COMPLETE.md** - System redesign summary
- **DEMO_CREDENTIALS.md** - Login credentials for testing

## 🎓 Supported Cities

Ahmedabad, Surat, Vadodara, Rajkot, Bhavnagar, Jamnagar, Junagadh, Gandhinagar, Anand, Nadiad, Mehsana, Morbi, Surendranagar

## 🚦 Production Deployment

1. Set environment variables (DATABASE_URL, JWT_SECRET)
2. Deploy backend to hosting service (Render, Railway)
3. Deploy frontend to hosting service (Vercel, Netlify)
4. Update frontend API baseURL
5. Configure CORS for production domain

## ✅ System Status

- **Code Quality:** Clean, no console errors
- **Security:** JWT auth, password hashing, SQL injection prevention
- **Performance:** Optimized queries, efficient React renders
- **UX:** Responsive, intuitive, professional design
- **Status:** ✅ PRODUCTION READY

## 📝 API Endpoints

### Authentication
- POST /auth/login
- POST /auth/signup
- PUT /auth/change-password

### Family
- GET/POST /family/elder
- GET/POST/DELETE /family/medications
- GET/POST/DELETE /family/activities
- GET/POST /family/baseline-vitals
- GET/POST /family/requests
- GET /family/care-logs

### Caretaker
- GET /caretaker/assignment
- GET /caretaker/medications
- GET /caretaker/activities
- GET /caretaker/appointments
- POST /caretaker/care-log
- POST /caretaker/vitals
- GET /caretaker/past-assignments

### Admin
- GET /admin/stats
- GET /admin/requests/pending
- GET /admin/requests
- GET /admin/caretakers/available?city=X
- POST /admin/assign
- GET/POST /admin/caretakers
- PUT /admin/caretakers/:id/background-check
- GET /admin/families

## 🤝 Contributing

This is a complete production-ready system. For modifications:
1. Follow existing code structure
2. Maintain consistent naming conventions
3. Test all changes thoroughly
4. Update documentation

## 📄 License

Educational project - Gujarat Technological University

## 👥 Team

Senior Year Project - Computer Engineering

---

**Version:** 1.0.0  
**Status:** Production Ready ✅  
**Last Updated:** January 2025
