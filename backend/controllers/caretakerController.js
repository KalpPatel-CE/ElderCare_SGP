const pool = require('../db/db');

exports.getAssignment = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        sa.id, sa.request_id, sa.status, sa.assigned_at,
        cr.start_date, cr.end_date, cr.special_requirements,
        e.id as elder_id, e.full_name as elder_name, e.age, e.gender, e.elder_code,
        e.medical_history, e.allergies, e.emergency_contact, e.emergency_phone,
        sd.meal_plan, sd.dietary_restrictions, sd.meal_timings,
        sd.medication_location, sd.equipment_location,
        sd.emergency_instructions, sd.additional_notes,
        f.full_name as family_name, f.phone as family_phone
      FROM service_assignments sa
      JOIN caretaker_requests cr ON cr.id = sa.request_id
      JOIN elders e ON e.id = cr.elder_id
      JOIN service_details sd ON sd.request_id = cr.id
      JOIN families f ON f.id = cr.family_id
      WHERE sa.caretaker_id=$1 AND sa.status='active'
      ORDER BY sa.assigned_at DESC
      LIMIT 1
    `, [req.user.id]);
    res.json(result.rows[0] || null);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
};

exports.getElderMedications = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*
      FROM medications m
      JOIN elders e ON e.id = m.elder_id
      JOIN caretaker_requests cr ON cr.elder_id = e.id
      JOIN service_assignments sa ON sa.request_id = cr.id
      WHERE sa.caretaker_id = $1 AND sa.status = 'active' AND m.is_active = true
      ORDER BY m.created_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed' });
  }
};

exports.getElderActivities = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*
      FROM activities a
      JOIN elders e ON e.id = a.elder_id
      JOIN caretaker_requests cr ON cr.elder_id = e.id
      JOIN service_assignments sa ON sa.request_id = cr.id
      WHERE sa.caretaker_id = $1 AND sa.status = 'active'
      ORDER BY a.created_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed' });
  }
};

exports.getElderAppointments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ap.*
      FROM appointments ap
      JOIN service_assignments sa ON sa.request_id = ap.request_id
      WHERE sa.caretaker_id = $1 AND sa.status = 'active'
      ORDER BY ap.appointment_time ASC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed' });
  }
};

exports.submitCareLog = async (req, res) => {
  try {
    const { medications_given, activities_done, meals_served, observations } = req.body;
    const assignment = await pool.query(`
      SELECT sa.id, cr.elder_id FROM service_assignments sa
      JOIN caretaker_requests cr ON cr.id = sa.request_id
      WHERE sa.caretaker_id=$1 AND sa.status='active'
    `, [req.user.id]);
    if (!assignment.rows[0]) return res.status(400).json({ error: 'No active assignment' });
    const result = await pool.query(`
      INSERT INTO daily_care_logs (assignment_id, elder_id, caretaker_id, medications_given, activities_done, meals_served, observations)
      VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *
    `, [assignment.rows[0].id, assignment.rows[0].elder_id, req.user.id, medications_given, activities_done, meals_served, observations]);
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
};

exports.recordVitals = async (req, res) => {
  try {
    const { blood_pressure_systolic, blood_pressure_diastolic, blood_glucose, spo2, body_temperature, heart_rate, weight, notes } = req.body;
    const assignment = await pool.query(`
      SELECT sa.id, cr.elder_id FROM service_assignments sa
      JOIN caretaker_requests cr ON cr.id = sa.request_id
      WHERE sa.caretaker_id=$1 AND sa.status='active'
    `, [req.user.id]);
    if (!assignment.rows[0]) return res.status(400).json({ error: 'No active assignment' });

    const result = await pool.query(`
      INSERT INTO vitals_logs (assignment_id, elder_id, caretaker_id, blood_pressure_systolic, blood_pressure_diastolic, blood_glucose, spo2, body_temperature, heart_rate, weight, notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *
    `, [assignment.rows[0].id, assignment.rows[0].elder_id, req.user.id, blood_pressure_systolic, blood_pressure_diastolic, blood_glucose, spo2, body_temperature, heart_rate, weight, notes]);

    if (blood_pressure_systolic > 140 || spo2 < 95 || body_temperature > 38.5) {
      const elderRes = await pool.query('SELECT family_id FROM elders WHERE id=$1', [assignment.rows[0].elder_id]);
      await pool.query(`
        INSERT INTO alerts (family_id, elder_id, alert_type, message, severity)
        VALUES ($1,$2,$3,$4,$5)
      `, [elderRes.rows[0].family_id, assignment.rows[0].elder_id, 'abnormal_vitals',
         `Abnormal vitals recorded by caretaker. BP: ${blood_pressure_systolic}/${blood_pressure_diastolic}, SpO2: ${spo2}%`, 'high']);
    }

    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
};

exports.getPastAssignments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        sa.id, sa.request_id, sa.status, sa.assigned_at,
        cr.start_date, cr.end_date, cr.request_code,
        e.full_name as elder_name, e.age, e.elder_code
      FROM service_assignments sa
      JOIN caretaker_requests cr ON cr.id = sa.request_id
      JOIN elders e ON e.id = cr.elder_id
      WHERE sa.caretaker_id=$1
      ORDER BY sa.assigned_at DESC
      LIMIT 50
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] GET /caretaker/past-assignments:`, err.message);
    res.status(500).json({ error: 'Failed' });
  }
};

exports.completeAssignment = async (req, res) => {
  try {
    const assignment = await pool.query(`
      SELECT sa.id, sa.request_id, cr.family_id, cr.elder_id, cr.request_code
      FROM service_assignments sa
      JOIN caretaker_requests cr ON cr.id = sa.request_id
      WHERE sa.caretaker_id = $1 AND sa.status = 'active'
      ORDER BY sa.assigned_at DESC LIMIT 1
    `, [req.user.id]);

    if (!assignment.rows[0]) return res.status(400).json({ error: 'No active assignment found' });

    const a = assignment.rows[0];

    await pool.query('UPDATE service_assignments SET status = $1 WHERE id = $2', ['completed', a.id]);
    await pool.query('UPDATE caretaker_requests SET status = $1 WHERE id = $2', ['completed', a.request_id]);
    await pool.query(
      'UPDATE caretakers SET availability_status = $1, total_assignments = total_assignments + 1 WHERE id = $2',
      ['available', req.user.id]
    );

    await pool.query(`
      INSERT INTO alerts (family_id, elder_id, alert_type, message, severity)
      VALUES ($1, $2, $3, $4, $5)
    `, [a.family_id, a.elder_id, 'service_completed',
       `Service ${a.request_code} has been completed by your caretaker. Please make the final payment to close the service.`,
       'medium']);

    res.json({ message: 'Assignment completed successfully' });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] POST /caretaker/complete-assignment:`, err.message);
    res.status(500).json({ error: 'Failed to complete assignment' });
  }
};
