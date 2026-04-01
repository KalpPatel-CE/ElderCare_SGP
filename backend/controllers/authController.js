const pool = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = null;
    let role = null;

    const adminRes = await pool.query(
      'SELECT * FROM admins WHERE email=$1', [email]
    );
    if (adminRes.rows.length > 0) {
      user = adminRes.rows[0];
      role = 'admin';
    }

    if (!user) {
      const familyRes = await pool.query(
        'SELECT * FROM families WHERE email=$1', [email]
      );
      if (familyRes.rows.length > 0) {
        user = familyRes.rows[0];
        role = 'family';
      }
    }

    if (!user) {
      const caretakerRes = await pool.query(
        'SELECT * FROM caretakers WHERE email=$1', [email]
      );
      if (caretakerRes.rows.length > 0) {
        user = caretakerRes.rows[0];
        role = 'caretaker';
      }
    }

    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, role, code: user.admin_code || user.family_code || user.caretaker_code },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role,
        code: user.admin_code || user.family_code || user.caretaker_code
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.signup = async (req, res) => {
  try {
    const { full_name, email, password, phone, relation_to_elder,
            address, city, state, pincode, terms_accepted } = req.body;

    if (!terms_accepted)
      return res.status(400).json({ error: 'You must accept the Terms of Service' });

    const existing = await pool.query('SELECT id FROM families WHERE email=$1', [email]);
    if (existing.rows.length > 0)
      return res.status(409).json({ error: 'Email already registered' });

    const countRes = await pool.query('SELECT COUNT(*) FROM families');
    const family_code = `FAM-${parseInt(countRes.rows[0].count) + 1}`;
    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(`
      INSERT INTO families (family_code, full_name, email, password_hash, phone,
        relation_to_elder, address, city, state, pincode, terms_accepted)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING id, family_code, full_name, email, phone, city, relation_to_elder
    `, [family_code, full_name, email, hash, phone,
        relation_to_elder, address, city, state || 'Gujarat', pincode, true]);

    res.status(201).json({ message: 'Account created successfully', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
};

exports.getTestimonials = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id, role } = req.user;
    const table = role === 'admin' ? 'admins' : role === 'family' ? 'families' : 'caretakers';
    const userRes = await pool.query(`SELECT * FROM ${table} WHERE id=$1`, [id]);
    const user = userRes.rows[0];
    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) return res.status(400).json({ error: 'Current password is incorrect' });
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query(`UPDATE ${table} SET password_hash=$1 WHERE id=$2`, [hash, id]);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update password' });
  }
};
