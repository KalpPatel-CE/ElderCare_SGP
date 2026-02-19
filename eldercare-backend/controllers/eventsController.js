const pool = require('../db/db');

exports.addEvent = async (req, res) => {
  try {
    const { elder_code, event_type, ref_id, status, notes } = req.body;

    const eventResult = await pool.query(
      `
      INSERT INTO elder_events (elder_id, event_type, ref_id, status, notes)
      SELECT e.id, $2, $3, $4, $5
      FROM elders e
      WHERE e.elder_code = $1
      RETURNING *
      `,
      [elder_code, event_type, ref_id, status, notes]
    );

    const event = eventResult.rows[0];

    // 🔥 If missed → create alert
    if (status === 'missed') {
      await pool.query(
        `
        INSERT INTO alerts (user_id, elder_id, alert_type, message)
        SELECT uem.user_id, e.id, 'missed_' || $2,
        'Elder missed ' || $2
        FROM elders e
        JOIN user_elder_map uem ON uem.elder_id = e.id
        WHERE e.elder_code = $1
        `,
        [elder_code, event_type]
      );
    }

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding event');
  }
};


// 1. Get all events of an elder
exports.getEventsByElder = async (req, res) => {
  try {
    const { elder_code } = req.params;

    const result = await pool.query(
      `
      SELECT ee.*
      FROM elder_events ee
      JOIN elders e ON e.id = ee.elder_id
      WHERE e.elder_code = $1
      ORDER BY ee.event_time DESC
      `,
      [elder_code]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching events');
  }
};

// 2. Get today's events
exports.getTodayEvents = async (req, res) => {
  try {
    const { elder_code } = req.params;

    const result = await pool.query(
      `
      SELECT ee.*
      FROM elder_events ee
      JOIN elders e ON e.id = ee.elder_id
      WHERE e.elder_code = $1
      AND DATE(ee.event_time) = CURRENT_DATE
      ORDER BY ee.event_time DESC
      `,
      [elder_code]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching today events');
  }
};

// 3. Get missed events
exports.getMissedEvents = async (req, res) => {
  try {
    const { elder_code } = req.params;

    const result = await pool.query(
      `
      SELECT ee.*
      FROM elder_events ee
      JOIN elders e ON e.id = ee.elder_id
      WHERE e.elder_code = $1
      AND ee.status = 'missed'
      ORDER BY ee.event_time DESC
      `,
      [elder_code]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching missed events');
  }
};
