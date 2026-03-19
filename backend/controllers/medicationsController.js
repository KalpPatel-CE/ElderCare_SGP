const pool = require('../db/db');

exports.addMedication = async (req, res) => {
  try {
    const {
      elder_code,
      medicine_name,
      dosage,
      frequency,
      start_date,
      end_date,
      user_code
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO medications (elder_id, medicine_name, dosage, frequency, start_date, end_date, created_by)
      SELECT e.id, $2, $3, $4, $5, $6, u.id
      FROM elders e, users u
      WHERE e.elder_code = $1 AND u.user_code = $7
      RETURNING *
      `,
      [elder_code, medicine_name, dosage, frequency, start_date, end_date, user_code]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding medication');
  }
};

exports.getMedicationsByElder = async (req, res) => {
  try {
    const { elder_code } = req.params;

    const result = await pool.query(
      `
      SELECT m.*
      FROM medications m
      JOIN elders e ON e.id = m.elder_id
      WHERE e.elder_code = $1
      AND CURRENT_DATE BETWEEN m.start_date AND m.end_date
      ORDER BY m.created_at DESC
      `,
      [elder_code]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching medications');
  }
};

exports.updateMedicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE medications SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating medication status');
  }
};
