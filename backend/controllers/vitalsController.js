const pool = require('../db/db');

exports.addVitals = async (req, res) => {
  try {
    const {
      elder_code,
      blood_pressure_systolic, blood_pressure_diastolic,
      blood_glucose, glucose_type,
      spo2, body_temperature, heart_rate, weight, notes
    } = req.body;

    const result = await pool.query(`
      INSERT INTO vitals (
        elder_id, recorded_by,
        blood_pressure_systolic, blood_pressure_diastolic,
        blood_glucose, glucose_type,
        spo2, body_temperature, heart_rate, weight, notes
      )
      SELECT e.id, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      FROM elders e WHERE e.elder_code = $1
      RETURNING *
    `, [
      elder_code, req.user.id,
      blood_pressure_systolic, blood_pressure_diastolic,
      blood_glucose, glucose_type,
      spo2, body_temperature, heart_rate, weight, notes
    ]);

    const v = req.body;
    const alerts = [];

    if (v.blood_pressure_systolic > 140 || v.blood_pressure_diastolic > 90)
      alerts.push({ type: 'high_bp', message: `High blood pressure recorded: ${v.blood_pressure_systolic}/${v.blood_pressure_diastolic} mmHg`, severity: 'high' });
    if (v.blood_pressure_systolic < 90 || v.blood_pressure_diastolic < 60)
      alerts.push({ type: 'low_bp', message: `Low blood pressure recorded: ${v.blood_pressure_systolic}/${v.blood_pressure_diastolic} mmHg`, severity: 'high' });
    if (v.spo2 && v.spo2 < 95)
      alerts.push({ type: 'low_spo2', message: `Low blood oxygen recorded: ${v.spo2}%`, severity: 'critical' });
    if (v.body_temperature && v.body_temperature > 38.5)
      alerts.push({ type: 'high_temp', message: `High temperature recorded: ${v.body_temperature}°C`, severity: 'high' });
    if (v.blood_glucose && v.blood_glucose > 200)
      alerts.push({ type: 'high_glucose', message: `High blood glucose recorded: ${v.blood_glucose} mg/dL`, severity: 'high' });

    for (const alert of alerts) {
      await pool.query(`
        INSERT INTO alerts (user_code, elder_code, alert_type, message, severity)
        SELECT u.user_code, e.elder_code, $3, $4, $5
        FROM elders e
        JOIN user_elder_map uem ON uem.elder_id = e.id
        JOIN users u ON u.id = uem.user_id
        WHERE e.elder_code = $1
        UNION
        SELECT u.user_code, $1, $3, $4, $5
        FROM users u WHERE u.role = 'admin'
      `, [elder_code, req.user.id, alert.type, alert.message, alert.severity]);
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] POST /vitals:`, err.message);
    res.status(500).json({ error: 'Failed to add vitals' });
  }
};

exports.getVitalsByElder = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.* FROM vitals v
      JOIN elders e ON e.id = v.elder_id
      WHERE e.elder_code = $1
      ORDER BY v.recorded_at DESC
      LIMIT 30
    `, [req.params.elder_code]);
    res.json(result.rows);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] GET /vitals/elder/:elder_code:`, err.message);
    res.status(500).json({ error: 'Failed to fetch vitals' });
  }
};

exports.getLatestVitals = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT ON (elder_id) v.*
      FROM vitals v
      JOIN elders e ON e.id = v.elder_id
      WHERE e.elder_code = $1
      ORDER BY elder_id, recorded_at DESC
    `, [req.params.elder_code]);
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] GET /vitals/elder/:elder_code/latest:`, err.message);
    res.status(500).json({ error: 'Failed to fetch latest vitals' });
  }
};
