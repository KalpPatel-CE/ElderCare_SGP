const pool = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { full_name, user_code, email, password, role } = req.body;

    if (!full_name || !user_code || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await pool.query(
      'SELECT * FROM users WHERE user_code = $1 OR email = $2',
      [user_code, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User code or email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (full_name, user_code, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_code, email, role',
      [full_name, user_code, email, password_hash, role]
    );

    res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { user_code, password } = req.body;

    if (!user_code) {
      return res.status(400).json({ error: 'User code is required' });
    }

    const result = await pool.query(
      'SELECT id, user_code, email, role, password_hash FROM users WHERE user_code = $1',
      [user_code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Support both old and new login
    if (password && user.password_hash) {
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid password' });
      }
    } else if (password && !user.password_hash) {
      return res.status(401).json({ error: 'User has no password. Please signup.' });
    }

    const token = jwt.sign(
      { id: user.id, user_code: user.user_code, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        user_code: user.user_code,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error during login' });
  }
};
