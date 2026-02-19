const pool = require('../db/db');

exports.addAppointment = async (req, res) => {
  try {
    const {
      elder_code,
      doctor_name,
      department,
      hospital,
      appointment_time,
      user_code
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO appointments (elder_id, doctor_name, department, hospital, appointment_time, created_by)
      SELECT e.id, $2, $3, $4, $5, u.id
      FROM elders e, users u
      WHERE e.elder_code = $1 AND u.user_code = $6
      RETURNING *
      `,
      [elder_code, doctor_name, department, hospital, appointment_time, user_code]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding appointment');
  }
};

exports.getAppointmentsByElder = async (req, res) => {
  try {
    const { elder_code } = req.params;

    const result = await pool.query(
      `
      SELECT a.*
      FROM appointments a
      JOIN elders e ON e.id = a.elder_id
      WHERE e.elder_code = $1
      AND a.appointment_time >= CURRENT_TIMESTAMP
      ORDER BY a.appointment_time ASC
      `,
      [elder_code]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching appointments');
  }
};
