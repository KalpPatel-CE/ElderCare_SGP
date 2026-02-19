const pool = require('../db/db');

exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, user_code, role FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { user_code, role } = req.body;

    const result = await pool.query(
      'INSERT INTO users (user_code, role) VALUES ($1, $2) RETURNING id, user_code, role',
      [user_code, role]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding user' });
  }
};

exports.assignElderToUser = async (req, res) => {
  try {
    const { user_code, elder_code } = req.body;

    const result = await pool.query(
      `
      INSERT INTO user_elder_map (user_id, elder_id)
      SELECT u.id, e.id
      FROM users u, elders e
      WHERE u.user_code = $1 AND e.elder_code = $2
      RETURNING *
      `,
      [user_code, elder_code]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error assigning elder to user' });
  }
};
