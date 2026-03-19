# Elder Health & Care Monitoring System - Frontend Structure

## Complete File Structure

```
eldercare-frontend/src/
├── components/
│   ├── Navbar.js          - Navigation bar with role display and logout
│   ├── ElderCard.js       - Reusable elder information card
│   ├── EventCard.js       - Color-coded event display (green/red)
│   ├── AlertCard.js       - Red-highlighted alert display
├── pages/
│   ├── Login.js           - Login page with backend authentication
│   ├── FamilyDashboard.js - Family member dashboard
│   ├── CaretakerDashboard.js - Caretaker dashboard
│   ├── AdminDashboard.js  - Admin dashboard with user/elder management
├── api.js                 - Axios instance for API calls
├── App.js                 - Main routing configuration
├── ProtectedRoute.js      - Route protection component
```

## Backend Routes Added

```
POST /auth/login          - User authentication
GET /users                - Get all users (admin)
GET /elders               - Get all elders
GET /elders/user/:user_code - Get elders by user
GET /events/today/:elder_code - Get today's events for elder
GET /alerts/:user_code    - Get alerts for user
```

## Features Implemented

### 1. Authentication System
- Login with user_code
- Backend validation against database
- localStorage persistence
- Role-based routing (family/caretaker/admin)

### 2. Route Protection
- ProtectedRoute component guards all dashboards
- Redirects to login if not authenticated
- Automatic logout functionality

### 3. Family Dashboard
- Displays assigned elders
- Shows today's events for each elder
- Color-coded events (green=taken, red=missed)
- Displays alerts with timestamps
- Uses reusable components

### 4. Caretaker Dashboard
- Same structure as Family Dashboard
- Shows assigned elders
- Displays alerts and activities
- Role-specific data fetching

### 5. Admin Dashboard
- View all users with roles
- View all elders
- Statistics cards (total counts)
- Table-based layout

### 6. Reusable Components
- Navbar: Shows role, logout button
- ElderCard: Elder details container
- EventCard: Color-coded event display
- AlertCard: Red-highlighted alerts

## User Flow

1. User enters user_code on login page
2. System validates against database via POST /auth/login
3. User object stored in localStorage
4. Redirect to role-specific dashboard:
   - family → /family
   - caretaker → /caretaker
   - admin → /admin
5. Dashboard fetches role-specific data
6. Logout clears localStorage and redirects to login

## API Integration

All API calls use the centralized api.js axios instance:
- Base URL: http://localhost:5000
- Automatic error handling
- Async/await pattern throughout

## Styling

- Clean, minimal inline styles
- Consistent spacing and colors
- Responsive layout
- Color coding:
  - Green (#ddffdd): Completed events
  - Red (#ffdddd): Missed events
  - Red (#ffcccc): Alerts
  - Blue (#e3f2fd): Admin stats
  - Purple (#f3e5f5): Admin stats

## State Management

- React useState for component state
- useEffect for data fetching
- localStorage for authentication persistence
- No external state management library needed

## Error Handling

- Try-catch blocks on all API calls
- User-friendly error messages
- Loading states during data fetch
- "No data available" messages for empty states

## Code Quality

- Functional components only
- Async/await for all API calls
- Modular component structure
- No hardcoded user codes
- Clean separation of concerns
