const pool = require('../db/db');

exports.addActivity = async (req, res) => {
  try {
    const { elder_code, activity_name, schedule_time, user_code } = req.body;

    const result = await pool.query(
      `
      INSERT INTO elder_activities (elder_id, activity_id, schedule_time, created_by)
      SELECT e.id, a.id, $3, u.id
      FROM elders e, activities_master a, users u
      WHERE e.elder_code = $1
      AND a.activity_name = $2
      AND u.user_code = $4
      RETURNING *
      `,
      [elder_code, activity_name, schedule_time, user_code]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding activity');
  }
};

exports.getActivitiesByElder = async (req, res) => {
  try {
    const { elder_code } = req.params;

    const result = await pool.query(
      `
      SELECT ea.*, am.activity_name
      FROM elder_activities ea
      JOIN elders e ON e.id = ea.elder_id
      JOIN activities_master am ON am.id = ea.activity_id
      WHERE e.elder_code = $1
      ORDER BY ea.schedule_time DESC
      `,
      [elder_code]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching activities');
  }
};

exports.getActivitiesMaster = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM activities_master ORDER BY activity_name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching activities master');
  }
};
