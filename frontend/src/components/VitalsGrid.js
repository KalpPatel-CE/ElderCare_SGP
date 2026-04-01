import './VitalsGrid.css';

function VitalsGrid({ vitals }) {
  if (!vitals) return null;

  const isAbnormal = (key, value) => {
    if (key === 'blood_pressure_systolic' && value > 140) return true;
    if (key === 'spo2' && value < 95) return true;
    if (key === 'body_temperature' && value > 38.5) return true;
    return false;
  };

  const vitalsConfig = [
    { key: 'blood_pressure', label: 'Blood Pressure', unit: 'mmHg', getValue: () => vitals.blood_pressure_systolic && vitals.blood_pressure_diastolic ? `${vitals.blood_pressure_systolic}/${vitals.blood_pressure_diastolic}` : '-' },
    { key: 'blood_glucose', label: 'Blood Glucose', unit: 'mg/dL', getValue: () => vitals.blood_glucose || '-' },
    { key: 'spo2', label: 'SpO2', unit: '%', getValue: () => vitals.spo2 || '-' },
    { key: 'body_temperature', label: 'Temperature', unit: '°C', getValue: () => vitals.body_temperature || '-' },
    { key: 'heart_rate', label: 'Heart Rate', unit: 'bpm', getValue: () => vitals.heart_rate || '-' },
    { key: 'weight', label: 'Weight', unit: 'kg', getValue: () => vitals.weight || '-' }
  ];

  return (
    <div className="vitals-grid">
      {vitalsConfig.map(({ key, label, unit, getValue }) => {
        const value = getValue();
        const abnormal = key === 'blood_pressure_systolic' ? isAbnormal('blood_pressure_systolic', vitals.blood_pressure_systolic) :
                        key === 'spo2' ? isAbnormal('spo2', vitals.spo2) :
                        key === 'body_temperature' ? isAbnormal('body_temperature', vitals.body_temperature) : false;
        
        return (
          <div key={key} className="vitals-cell">
            <div className={`vitals-value ${abnormal ? 'vitals-value-abnormal' : ''}`}>{value}</div>
            <div className="vitals-label">{label}</div>
            <div className="vitals-unit">{unit}</div>
          </div>
        );
      })}
    </div>
  );
}

export default VitalsGrid;
