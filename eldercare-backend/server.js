const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const medicationsRoutes = require('./routes/medications');
const eldersRoutes = require('./routes/elders');
const eventsRoutes = require('./routes/events');
const appointmentsRoutes = require('./routes/appointments');
const activitiesRoutes = require('./routes/activities');
const alertsRoutes = require('./routes/alerts');


const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Eldercare Backend Running');
});

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/events', eventsRoutes);
app.use('/elders', eldersRoutes);
app.use('/medications', medicationsRoutes);
app.use('/appointments', appointmentsRoutes);
app.use('/activities', activitiesRoutes);
app.use('/alerts', alertsRoutes);


app.listen(5000, () => {
  console.log('Server running on port 5000');
});
