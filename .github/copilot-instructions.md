# Copilot Instructions for Eldercare Project

## Architecture Overview

**Eldercare** is a health monitoring system with two components:
- **Backend**: Express.js REST API (port 5000) with PostgreSQL database
- **Frontend**: React application (incomplete, minimal setup)

The backend uses a **controller-routes-database pattern**:
- `/routes/*.js` - Define REST endpoints by resource (elders, medications, appointments, etc.)
- `/controllers/*.js` - Implement business logic and database queries
- `/db/db.js` - PostgreSQL pool connection with environment-based credentials

## Critical Data Model Patterns

The system tracks **relationships using codes, not IDs**:
- Clients reference elders via `elder_code` (string identifier, not `id`)
- Clients reference users via `user_code` (string identifier, not `id`)
- Controllers use `JOIN` queries to map codes → internal IDs for database operations
- This decouples frontend from internal ID generation; **always preserve this pattern**

Example from `medicationsController.js`:
```javascript
INSERT INTO medications (elder_id, medicine_name, ...)
SELECT e.id, $2, $3, ...
FROM elders e, users u
WHERE e.elder_code = $1 AND u.user_code = $7
```

## Key Development Workflows

### Backend Setup
```bash
# Install dependencies
npm install
# Start with nodemon (auto-reload on file changes)
npm start  # runs nodemon server.js
```

### Database
- Uses PostgreSQL (`host: localhost`, `port: 5432`, `database: eldercare`)
- Password loaded from `.env` file (`DB_PASSWORD`)
- No migration/seeding scripts visible - schema must be pre-created in PostgreSQL

### API Endpoints (port 5000)
- `POST /elders` - Add elder, `POST /medications` - Add medication
- `POST /appointments` - Add appointment, `POST /events` - Add event
- `POST /activities` - Add activity, `GET` variants exist for retrieval
- All POST endpoints accept `elder_code` and `user_code` in request body

## Project-Specific Conventions

### Controller Functions
- Always use `async/await` with `try/catch`
- Query database using `pool.query()` with parameterized queries (`$1, $2...`)
- Use `JOIN` queries to resolve codes to IDs (never trust client IDs)
- Return records with `RETURNING *` clause for immediate response
- Send errors as: `res.status(500).send('Error message')`

### Route Definition
- Routes use named controller functions exported from `controllers/`
- No middleware validation visible - validation should occur in controllers
- Routes file pattern: `router.get/post(path, controllerFunction)`

### CORS & Middleware
- CORS enabled globally in `server.js` via `app.use(cors())`
- JSON parsing enabled: `app.use(express.json())`

## Integration Points & External Dependencies

| Dependency | Purpose | Version |
|---|---|---|
| `express` | HTTP server framework | ^5.2.1 |
| `pg` | PostgreSQL client | ^8.18.0 |
| `cors` | Cross-origin requests | ^2.8.6 |
| `dotenv` | Environment variables | ^17.2.3 |
| `nodemon` | Dev auto-reload | ^3.1.11 |

## Common Tasks

**Adding a new resource endpoint:**
1. Create `/routes/newresource.js` with Express router
2. Create `/controllers/newresourceController.js` with async handler functions
3. Import and mount route in `server.js`: `app.use('/newresource', newresourceRoutes)`
4. Follow code-to-ID mapping pattern if joining with `elders` or `users` tables

**Debugging database issues:**
- Check `.env` for `DB_PASSWORD` correctness
- Verify PostgreSQL is running on `localhost:5432`
- Table schema must exist before controller queries (no auto-migration)
- Use SQL logs in controller catch blocks for troubleshooting

## Files to Reference

- Architecture: [server.js](../eldercare-backend/server.js)
- Data patterns: [eldersController.js](../eldercare-backend/controllers/eldersController.js), [medicationsController.js](../eldercare-backend/controllers/medicationsController.js)
- Database: [db.js](../eldercare-backend/db/db.js)
