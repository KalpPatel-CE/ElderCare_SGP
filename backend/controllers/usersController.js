const pool = require('../db/db');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, user_code, full_name, email, role FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

exports.generateUserCode = async (req, res) => {
  try {
    const { role } = req.query;
    
    // Map role to prefix letter
    const prefixMap = { admin: 'A', family: 'F', caretaker: 'C' };
    const letter = prefixMap[role];
    if (!letter) return res.status(400).json({ error: 'Invalid role' });
    
    // Find all existing codes for this role prefix
    const result = await pool.query(
      `SELECT user_code FROM users WHERE user_code LIKE $1 ORDER BY user_code`,
      [`USR-${letter}%`]
    );
    
    // Find next available number
    const existingNumbers = result.rows.map(r => 
      parseInt(r.user_code.replace(`USR-${letter}`, ''))
    ).filter(n => !isNaN(n));
    
    let nextNum = 1;
    while (existingNumbers.includes(nextNum)) nextNum++;
    
    const generatedCode = `USR-${letter}${nextNum}`;
    res.json({ user_code: generatedCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating user code' });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { user_code, full_name, email, password, role } = req.body;

    // Check if user already exists
    const existing = await pool.query(
      'SELECT id FROM users WHERE user_code = $1 OR email = $2',
      [user_code, email]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'User code or email already exists' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (user_code, full_name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_code, full_name, email, role',
      [user_code, full_name, email, password_hash, role]
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

    // Get user info
    const userResult = await pool.query('SELECT id, role FROM users WHERE user_code = $1', [user_code]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = userResult.rows[0];

    // Check assignment count
    const countResult = await pool.query(
      'SELECT COUNT(*) as count FROM user_elder_map WHERE user_id = $1',
      [user.id]
    );
    const currentCount = parseInt(countResult.rows[0].count);

    // Enforce constraints
    if (user.role === 'family' && currentCount >= 2) {
      return res.status(400).json({ error: 'Family member can be assigned at most 2 elders' });
    }
    if (user.role === 'caretaker' && currentCount >= 6) {
      return res.status(400).json({ error: 'Caretaker can be assigned at most 6 elders' });
    }

    const result = await pool.query(
      `INSERT INTO user_elder_map (user_id, elder_id, relation_type)
       SELECT u.id, e.id, u.role
       FROM users u, elders e
       WHERE u.user_code = $1 AND e.elder_code = $2
       RETURNING *`,
      [user_code, elder_code]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error assigning elder to user' });
  }
};
