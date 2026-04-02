const pool = require('../db/db');
const bcrypt = require('bcrypt');

exports.getPendingRequests = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        cr.id, cr.request_code, cr.family_id, cr.elder_id, cr.start_date,
        cr.end_date, cr.status, cr.special_requirements, cr.service_city,
        cr.service_address, cr.created_at, cr.total_amount,
        e.full_name as elder_name, e.age, e.gender, e.elder_code,
        f.full_name as family_name, f.phone as family_phone,
        f.relation_to_elder, f.city as family_city
      FROM caretaker_requests cr
      JOIN elders e ON e.id = cr.elder_id
      JOIN families f ON f.id = cr.family_id
      WHERE cr.status='pending'
      ORDER BY cr.created_at ASC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        cr.id, cr.request_code, cr.status, cr.start_date, cr.end_date,
        cr.service_city, cr.created_at, cr.total_amount,
        e.full_name as elder_name, e.elder_code,
        f.full_name as family_name,
        c.full_name as caretaker_name,
        sa.status as assignment_status
      FROM caretaker_requests cr
      JOIN elders e ON e.id = cr.elder_id
      JOIN families f ON f.id = cr.family_id
      LEFT JOIN service_assignments sa ON sa.request_id = cr.id
      LEFT JOIN caretakers c ON c.id = sa.caretaker_id
      ORDER BY cr.created_at DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed' });
  }
};

exports.getAvailableCaretakers = async (req, res) => {
  try {
    const { city } = req.query;
    let query = `
      SELECT id, caretaker_code, full_name, phone, gender,
        city, state, address, experience_years, specialization,
        qualification, languages_spoken, availability_status,
        background_check_status, rating, total_assignments, photo_url
      FROM caretakers
      WHERE availability_status='available' AND is_active=true
    `;
    const params = [];
    if (city) {
      query += ` AND LOWER(city) = LOWER($1)`;
      params.push(city);
    }
    query += ` ORDER BY rating DESC, experience_years DESC`;
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed' });
  }
};

exports.assignCaretaker = async (req, res) => {
  try {
    const { request_id, caretaker_id } = req.body;
    const assignment = await pool.query(`
      INSERT INTO service_assignments (request_id, caretaker_id, assigned_by)
      VALUES ($1,$2,$3) RETURNING *
    `, [request_id, caretaker_id, req.user.id]);

    await pool.query(`UPDATE caretaker_requests SET status='confirmed' WHERE id=$1`, [request_id]);
    await pool.query(`UPDATE caretakers SET availability_status='busy', total_assignments = total_assignments + 1 WHERE id=$1`, [caretaker_id]);

    const reqRes = await pool.query('SELECT family_id, elder_id FROM caretaker_requests WHERE id=$1', [request_id]);
    const ctRes = await pool.query('SELECT full_name FROM caretakers WHERE id=$1', [caretaker_id]);
    await pool.query(`
      INSERT INTO alerts (family_id, elder_id, alert_type, message, severity)
      VALUES ($1,$2,$3,$4,$5)
    `, [reqRes.rows[0].family_id, reqRes.rows[0].elder_id, 'caretaker_assigned',
       `Great news! Your caretaker ${ctRes.rows[0].full_name} has been assigned and confirmed.`, 'low']);

    res.json(assignment.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed' });
  }
};

exports.addCaretaker = async (req, res) => {
  try {
    const {
      full_name, email, password, phone, date_of_birth, gender, address,
      experience_years, specialization, qualification, languages_spoken,
      id_proof_type, id_proof_number, city, state
    } = req.body;

    const existing = await pool.query('SELECT id FROM caretakers WHERE email=$1', [email]);
    if (existing.rows.length > 0)
      return res.status(409).json({ error: 'Email already registered' });

    const countRes = await pool.query('SELECT COUNT(*) FROM caretakers');
    const caretaker_code = `CRT-${parseInt(countRes.rows[0].count) + 1}`;
    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(`
      INSERT INTO caretakers (
        caretaker_code, full_name, email, password_hash, phone,
        date_of_birth, gender, address, experience_years,
        specialization, qualification, languages_spoken,
        id_proof_type, id_proof_number, city, state
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      RETURNING id, caretaker_code, full_name, email, phone,
        experience_years, specialization, availability_status, city, state
    `, [caretaker_code, full_name, email, hash, phone, date_of_birth,
        gender, address, experience_years, specialization, qualification,
        languages_spoken, id_proof_type, id_proof_number, city, state]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add caretaker' });
  }
};

exports.getAllCaretakers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, caretaker_code, full_name, email, phone,
        city, state, address, pincode, photo_url,
        experience_years, specialization, qualification,
        availability_status, background_check_status,
        rating, total_assignments, is_active
      FROM caretakers ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed' });
  }
};

exports.getAllFamilies = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        f.id, f.family_code, f.full_name, f.email, f.phone,
        f.city, f.state, f.relation_to_elder, f.is_active, f.created_at,
        e.full_name as elder_name, e.elder_code,
        (SELECT COUNT(*) FROM caretaker_requests WHERE family_id = f.id) as request_count
      FROM families f
      LEFT JOIN elders e ON e.family_id = f.id
      ORDER BY f.created_at DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed' });
  }
};

exports.uploadCaretakerPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const photoUrl = `/uploads/${req.file.filename}`;
    const result = await pool.query(
      'UPDATE caretakers SET photo_url=$1 WHERE id=$2 RETURNING id, photo_url',
      [photoUrl, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Photo upload failed' });
  }
};

exports.updateBackgroundCheck = async (req, res) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE caretakers SET background_check_status=$1 WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [families, caretakers, pending, active] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM families'),
      pool.query('SELECT COUNT(*) FROM caretakers'),
      pool.query("SELECT COUNT(*) FROM caretaker_requests WHERE status='pending'"),
      pool.query("SELECT COUNT(*) FROM service_assignments WHERE status='active'")
    ]);
    res.json({
      totalFamilies: parseInt(families.rows[0].count),
      totalCaretakers: parseInt(caretakers.rows[0].count),
      pendingRequests: parseInt(pending.rows[0].count),
      activeAssignments: parseInt(active.rows[0].count)
    });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] GET /admin/stats:`, err.message);
    res.status(500).json({ error: 'Failed' });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const result = await pool.query(`
      UPDATE caretaker_requests
      SET status = 'cancelled', rejection_reason = $1
      WHERE id = $2
      RETURNING *
    `, [reason || 'Rejected by admin', id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Request not found' });

    const req_data = result.rows[0];
    await pool.query(`
      INSERT INTO alerts (family_id, elder_id, alert_type, message, severity)
      VALUES ($1, $2, $3, $4, $5)
    `, [req_data.family_id, req_data.elder_id, 'request_rejected',
       `Your service request ${req_data.request_code} has been cancelled. Reason: ${reason || 'No reason provided'}`,
       'medium']);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] POST /admin/requests/:id/reject:`, err.message);
    res.status(500).json({ error: 'Failed to reject request' });
  }
};

exports.getElderReport = async (req, res) => {
  try {
    const { elder_code } = req.params;

    const [meds, activities, appointments, vitals] = await Promise.all([
      pool.query(`
        SELECT status, COUNT(*) as count 
        FROM medications m
        JOIN elders e ON e.id = m.elder_id
        WHERE e.elder_code = $1 
        GROUP BY status
      `, [elder_code]),
      pool.query(`
        SELECT status, COUNT(*) as count 
        FROM elder_activities ea
        JOIN elders e ON e.id = ea.elder_id
        WHERE e.elder_code = $1 
        GROUP BY status
      `, [elder_code]),
      pool.query(`
        SELECT status, COUNT(*) as count 
        FROM appointments a
        JOIN elders e ON e.id = a.elder_id
        WHERE e.elder_code = $1 
        GROUP BY status
      `, [elder_code]),
      pool.query(`
        SELECT v.blood_pressure_systolic, v.blood_pressure_diastolic,
               v.blood_glucose, v.glucose_type, v.spo2,
               v.body_temperature, v.heart_rate, v.weight, v.notes, v.recorded_at
        FROM vitals v
        JOIN elders e ON e.id = v.elder_id
        WHERE e.elder_code = $1
        ORDER BY v.recorded_at DESC LIMIT 10
      `, [elder_code])
    ]);

    res.json({
      medications: meds.rows,
      activities: activities.rows,
      appointments: appointments.rows,
      vitals: vitals.rows
    });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] GET /admin/report/:elder_code:`, err.message);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};
