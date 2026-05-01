const pool = require('../db/db');
const { getCache, setCache, clearCache } = require('../utils/cache');

exports.getElder = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM elders WHERE family_id=$1', [req.user.id]
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch elder' });
  }
};

exports.saveElder = async (req, res) => {
  try {
    const { full_name, age, gender, medical_history, allergies, emergency_contact, emergency_phone } = req.body;
    const existing = await pool.query('SELECT id, elder_code FROM elders WHERE family_id=$1', [req.user.id]);

    if (existing.rows.length > 0) {
      const result = await pool.query(`
        UPDATE elders SET full_name=$1, age=$2, gender=$3,
        medical_history=$4, allergies=$5,
        emergency_contact=$6, emergency_phone=$7
        WHERE family_id=$8 RETURNING *
      `, [full_name, age, gender, medical_history, allergies, emergency_contact, emergency_phone, req.user.id]);
      res.json(result.rows[0]);
    } else {
      const countRes = await pool.query('SELECT COUNT(*) FROM elders');
      const elder_code = `ELD-${parseInt(countRes.rows[0].count) + 101}`;
      const result = await pool.query(`
        INSERT INTO elders (elder_code, family_id, full_name, age, gender, medical_history, allergies, emergency_contact, emergency_phone)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
      `, [elder_code, req.user.id, full_name, age, gender, medical_history, allergies, emergency_contact, emergency_phone]);
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save elder profile' });
  }
};

exports.getMedications = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*
      FROM medications m
      JOIN elders e ON e.id = m.elder_id
      WHERE e.family_id = $1
      ORDER BY m.created_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
};

exports.addMedication = async (req, res) => {
  try {
    const { medicine_name, dosage, frequency, instructions } = req.body;
    const elder = await pool.query('SELECT id FROM elders WHERE family_id=$1', [req.user.id]);
    const result = await pool.query(`
      INSERT INTO medications (elder_id, medicine_name, dosage, frequency, instructions)
      VALUES ($1,$2,$3,$4,$5) RETURNING *
    `, [elder.rows[0].id, medicine_name, dosage, frequency, instructions]);
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
};

exports.deleteMedication = async (req, res) => {
  try {
    await pool.query('DELETE FROM medications WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
};

exports.getActivities = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*
      FROM activities a
      JOIN elders e ON e.id = a.elder_id
      WHERE e.family_id = $1
      ORDER BY a.created_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
};

exports.addActivity = async (req, res) => {
  try {
    const { activity_name, preferred_time, duration_minutes, notes } = req.body;
    const elder = await pool.query('SELECT id FROM elders WHERE family_id=$1', [req.user.id]);
    const result = await pool.query(`
      INSERT INTO activities (elder_id, activity_name, preferred_time, duration_minutes, notes)
      VALUES ($1,$2,$3,$4,$5) RETURNING *
    `, [elder.rows[0].id, activity_name, preferred_time, duration_minutes, notes]);
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
};

exports.deleteActivity = async (req, res) => {
  try {
    await pool.query('DELETE FROM activities WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
};

exports.getBaselineVitals = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT bv.*
      FROM baseline_vitals bv
      JOIN elders e ON e.id = bv.elder_id
      WHERE e.family_id = $1
    `, [req.user.id]);
    res.json(result.rows[0] || null);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
};

exports.saveBaselineVitals = async (req, res) => {
  try {
    const { blood_pressure_systolic, blood_pressure_diastolic, blood_glucose, heart_rate, weight, notes } = req.body;
    const elder = await pool.query('SELECT id FROM elders WHERE family_id=$1', [req.user.id]);
    const existing = await pool.query('SELECT id FROM baseline_vitals WHERE elder_id=$1', [elder.rows[0].id]);
    if (existing.rows.length > 0) {
      const result = await pool.query(`
        UPDATE baseline_vitals SET blood_pressure_systolic=$1, blood_pressure_diastolic=$2,
        blood_glucose=$3, heart_rate=$4, weight=$5, notes=$6, updated_at=NOW()
        WHERE elder_id=$7 RETURNING *
      `, [blood_pressure_systolic, blood_pressure_diastolic, blood_glucose, heart_rate, weight, notes, elder.rows[0].id]);
      res.json(result.rows[0]);
    } else {
      const result = await pool.query(`
        INSERT INTO baseline_vitals (elder_id, blood_pressure_systolic, blood_pressure_diastolic, blood_glucose, heart_rate, weight, notes)
        VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *
      `, [elder.rows[0].id, blood_pressure_systolic, blood_pressure_diastolic, blood_glucose, heart_rate, weight, notes]);
      res.json(result.rows[0]);
    }
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
};

exports.getRequests = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT ON (cr.id)
        cr.id, cr.request_code, cr.family_id, cr.elder_id, cr.start_date, 
        cr.end_date, cr.status, cr.special_requirements, cr.service_address, 
        cr.service_city, cr.created_at, cr.total_amount,
        cr.advance_paid, cr.final_paid,
        cr.advance_transaction_id, cr.final_transaction_id,
        cr.rejection_reason,
        sa.caretaker_id, sa.status as assignment_status,
        c.full_name as caretaker_name, c.phone as caretaker_phone,
        c.experience_years, c.specialization, c.rating, c.photo_url,
        c.city as caretaker_city, c.background_check_status
      FROM caretaker_requests cr
      LEFT JOIN service_assignments sa ON sa.request_id = cr.id
      LEFT JOIN caretakers c ON c.id = sa.caretaker_id
      WHERE cr.family_id=$1
      ORDER BY cr.id, cr.created_at DESC
      LIMIT 50
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] GET /family/requests:`, err.message);
    res.status(500).json({ error: 'Failed' });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { payment_type } = req.body;
    const { id } = req.params;

    if (payment_type === 'advance') {
      const txnId = 'TXN-ADV-' + Date.now();
      const result = await pool.query(`
        UPDATE caretaker_requests
        SET advance_paid = true,
            advance_paid_at = NOW(),
            advance_transaction_id = $1,
            payment_status = 'advance_paid'
        WHERE id = $2 AND family_id = $3
        RETURNING *
      `, [txnId, id, req.user.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Request not found' });
      clearCache(`family_dashboard_${req.user.id}`);
      res.json(result.rows[0]);
    } else if (payment_type === 'final') {
      const txnId = 'TXN-FIN-' + Date.now();
      const result = await pool.query(`
        UPDATE caretaker_requests
        SET final_paid = true,
            final_paid_at = NOW(),
            final_transaction_id = $1,
            payment_status = 'paid'
        WHERE id = $2 AND family_id = $3
        RETURNING *
      `, [txnId, id, req.user.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Request not found' });
      clearCache(`family_dashboard_${req.user.id}`);
      res.json(result.rows[0]);
    } else {
      res.status(400).json({ error: 'Invalid payment_type' });
    }
  } catch (err) {
    console.error(`[${new Date().toISOString()}] POST /family/requests/:id/payment:`, err.message);
    res.status(500).json({ error: 'Failed to update payment' });
  }
};

exports.createRequest = async (req, res) => {
  try {
    const {
      start_date, end_date, special_requirements,
      service_address, service_city,
      meal_plan, dietary_restrictions, meal_timings,
      medication_location, equipment_location,
      emergency_instructions, additional_notes,
      appointments
    } = req.body;

    const elder = await pool.query('SELECT id, elder_code FROM elders WHERE family_id=$1', [req.user.id]);
    if (!elder.rows[0]) return res.status(400).json({ error: 'Please create elder profile first' });

    const countRes = await pool.query('SELECT COUNT(*) FROM caretaker_requests');
    const request_code = `REQ-${parseInt(countRes.rows[0].count) + 1}`;

    // Calculate service amount
    const start = new Date(start_date);
    const end = new Date(end_date);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const ratePerDay = 800; // ₹800 per day base rate
    const total_amount = days * ratePerDay;

    // Check if total_amount column exists, if not insert without it
    let requestResult;
    try {
      requestResult = await pool.query(`
        INSERT INTO caretaker_requests
          (request_code, family_id, elder_id, start_date, end_date,
           special_requirements, service_address, service_city, total_amount)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *
      `, [request_code, req.user.id, elder.rows[0].id,
          start_date, end_date, special_requirements,
          service_address, service_city, total_amount]);
    } catch (colErr) {
      // If total_amount column doesn't exist, insert without it
      requestResult = await pool.query(`
        INSERT INTO caretaker_requests
          (request_code, family_id, elder_id, start_date, end_date,
           special_requirements, service_address, service_city)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
      `, [request_code, req.user.id, elder.rows[0].id,
          start_date, end_date, special_requirements,
          service_address, service_city]);
      // Add total_amount to the returned object
      requestResult.rows[0].total_amount = total_amount;
    }

    const request = requestResult.rows[0];

    await pool.query(`
      INSERT INTO service_details (request_id, meal_plan, dietary_restrictions, meal_timings, medication_location, equipment_location, emergency_instructions, additional_notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `, [request.id, meal_plan, dietary_restrictions, meal_timings, medication_location, equipment_location, emergency_instructions, additional_notes]);

    if (appointments && appointments.length > 0) {
      for (const apt of appointments) {
        await pool.query(`
          INSERT INTO appointments (request_id, elder_id, title, doctor_name, hospital, appointment_time, notes)
          VALUES ($1,$2,$3,$4,$5,$6,$7)
        `, [request.id, elder.rows[0].id, apt.title, apt.doctor_name, apt.hospital, apt.appointment_time, apt.notes]);
      }
    }

    clearCache(`family_dashboard_${req.user.id}`);
    res.status(201).json(request);
  } catch (err) {
    console.error('Create request error:', err);
    res.status(500).json({ error: err.message || 'Failed to create request' });
  }
};

exports.getCareLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        dcl.id, dcl.log_date, dcl.medications_given, dcl.activities_done,
        dcl.meals_served, dcl.observations, dcl.created_at,
        c.full_name as caretaker_name
      FROM daily_care_logs dcl
      JOIN service_assignments sa ON sa.id = dcl.assignment_id
      JOIN caretakers c ON c.id = dcl.caretaker_id
      JOIN caretaker_requests cr ON cr.id = sa.request_id
      WHERE cr.family_id=$1
      ORDER BY dcl.log_date DESC
      LIMIT 30
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
};

exports.payAdvance = async (req, res) => {
  try {
    const txnId = 'TXN-ADV-' + Date.now();
    const result = await pool.query(`
      UPDATE caretaker_requests
      SET advance_paid = true,
          advance_paid_at = NOW(),
          advance_transaction_id = $1,
          status = 'pending',
          payment_status = 'advance_paid'
      WHERE id = $2 AND family_id = $3
      RETURNING *
    `, [txnId, req.params.id, req.user.id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Request not found' });

    clearCache(`family_dashboard_${req.user.id}`);
    res.json({ message: 'Advance payment successful', transaction_id: txnId, request: result.rows[0] });
  } catch (err) {
    console.error('payAdvance error:', err.message);
    res.status(500).json({ error: err.message || 'Payment failed' });
  }
};

exports.payFinal = async (req, res) => {
  try {
    const txnId = 'TXN-FIN-' + Date.now();
    const result = await pool.query(`
      UPDATE caretaker_requests
      SET final_paid = true,
          final_paid_at = NOW(),
          final_transaction_id = $1,
          status = 'completed',
          payment_status = 'paid'
      WHERE id = $2 AND family_id = $3
      RETURNING *
    `, [txnId, req.params.id, req.user.id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Request not found' });

    // Free up caretaker availability
    await pool.query(`
      UPDATE caretakers SET availability_status = 'available'
      WHERE id = (
        SELECT caretaker_id FROM service_assignments
        WHERE request_id = $1
      )
    `, [req.params.id]);

    // Update assignment status
    await pool.query(`
      UPDATE service_assignments SET status = 'completed'
      WHERE request_id = $1
    `, [req.params.id]);

    clearCache(`family_dashboard_${req.user.id}`);
    res.json({ message: 'Final payment successful', transaction_id: txnId, request: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment failed' });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const cacheKey = `family_dashboard_${req.user.id}`;
    const cached = getCache(cacheKey, 5000); // 5 second cache only
    if (cached) {
      return res.json(cached);
    }

    const result = await pool.query(`
      SELECT 
        e.id, e.elder_code, e.full_name, e.age, e.gender, 
        e.medical_history, e.allergies, e.emergency_contact, e.emergency_phone,
        
        (SELECT COALESCE(json_agg(m.*), '[]'::json)
         FROM medications m 
         WHERE m.elder_id = e.id) AS medications,
        
        (SELECT COALESCE(json_agg(a.*), '[]'::json)
         FROM activities a 
         WHERE a.elder_id = e.id) AS activities,
        
        (SELECT COALESCE(json_agg(cl.*), '[]'::json)
         FROM (SELECT dcl.id, dcl.log_date, dcl.medications_given, dcl.activities_done,
                      dcl.meals_served, dcl.observations, dcl.created_at,
                      c.full_name as caretaker_name
               FROM daily_care_logs dcl
               JOIN service_assignments sa ON sa.id = dcl.assignment_id
               JOIN caretakers c ON c.id = dcl.caretaker_id
               JOIN caretaker_requests cr ON cr.id = sa.request_id
               WHERE cr.elder_id = e.id
               ORDER BY dcl.log_date DESC
               LIMIT 30) cl) AS care_logs,
        
        (SELECT COALESCE(json_agg(r.*), '[]'::json)
         FROM (SELECT DISTINCT ON (cr.id)
                 cr.id, cr.request_code, cr.family_id, cr.elder_id, cr.start_date, 
                 cr.end_date, cr.status, cr.special_requirements, cr.service_address, 
                 cr.service_city, cr.created_at, cr.total_amount,
                 cr.advance_paid, cr.final_paid,
                 cr.advance_transaction_id, cr.final_transaction_id,
                 cr.rejection_reason,
                 sa.caretaker_id, sa.status as assignment_status,
                 c.full_name as caretaker_name, c.phone as caretaker_phone,
                 c.experience_years, c.specialization, c.rating, c.photo_url,
                 c.city as caretaker_city, c.background_check_status
               FROM caretaker_requests cr
               LEFT JOIN service_assignments sa ON sa.request_id = cr.id
               LEFT JOIN caretakers c ON c.id = sa.caretaker_id
               WHERE cr.elder_id = e.id
               ORDER BY cr.id, cr.created_at DESC
               LIMIT 50) r) AS requests,
        
        (SELECT row_to_json(bv.*) 
         FROM baseline_vitals bv 
         WHERE bv.elder_id = e.id 
         LIMIT 1) AS baseline_vitals
      
      FROM elders e
      WHERE e.family_id = $1
      LIMIT 1
    `, [req.user.id]);

    if (!result.rows[0]) {
      const emptyData = {
        elder: null,
        medications: [],
        activities: [],
        care_logs: [],
        requests: [],
        baseline_vitals: null
      };
      return res.json(emptyData);
    }

    const data = result.rows[0];
    const responseData = {
      elder: {
        id: data.id,
        elder_code: data.elder_code,
        full_name: data.full_name,
        age: data.age,
        gender: data.gender,
        medical_history: data.medical_history,
        allergies: data.allergies,
        emergency_contact: data.emergency_contact,
        emergency_phone: data.emergency_phone
      },
      medications: data.medications || [],
      activities: data.activities || [],
      care_logs: data.care_logs || [],
      requests: data.requests || [],
      baseline_vitals: data.baseline_vitals || null
    };

    // Cache for 30 seconds
    setCache(cacheKey, responseData);
    res.json(responseData);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] GET /family/dashboard:`, err.message);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
};
