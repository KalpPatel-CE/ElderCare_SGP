const pool = require('../db/db');

exports.getAlertsByUser = async (req, res) => {
  try {
    const { user_code } = req.params;

    const result = await pool.query(
      `
      SELECT a.*
      FROM alerts a
      JOIN users u ON u.id = a.user_id
      WHERE u.user_code = $1
      ORDER BY a.created_at DESC
      `,
      [user_code]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching alerts");
  }
};
