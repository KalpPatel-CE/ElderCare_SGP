const pool = require('../db/db');

exports.getAllElders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM elders');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching elders');
  }
};

exports.addElder = async (req, res) => {
  try {
    const { elder_code, full_name, age, gender } = req.body;

    const result = await pool.query(
      `INSERT INTO elders (elder_code, full_name, age, gender)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [elder_code, full_name, age, gender]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding elder');
  }
};

exports.getEldersByUserCode = async (req, res) => {
  try {
    const { user_code } = req.params;

    const result = await pool.query(
      `
      SELECT e.*
      FROM elders e
      JOIN user_elder_map uem ON e.id = uem.elder_id
      JOIN users u ON u.id = uem.user_id
      WHERE u.user_code = $1
      `,
      [user_code]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching elders for user');
  }
};
