import { useState, useEffect } from "react";
import api from "../api";
import EventCard from "./EventCard";
import MedicationForm from "./MedicationForm";
import ActivityForm from "./ActivityForm";
import AppointmentForm from "./AppointmentForm";
import StatusButtons from "./StatusButtons";

function InteractiveElderCard({ elder, userCode }) {
  const [events, setEvents] = useState([]);
  const [medications, setMedications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, [elder.elder_code]);

  const fetchAllData = async () => {
    try {
      const [eventsRes, medsRes, actsRes, appsRes] = await Promise.all([
        api.get(`/events/today/${elder.elder_code}`),
        api.get(`/medications/elder/${elder.elder_code}`),
        api.get(`/activities/elder/${elder.elder_code}`),
        api.get(`/appointments/elder/${elder.elder_code}`)
      ]);
      setEvents(eventsRes.data);
      setMedications(medsRes.data);
      setActivities(actsRes.data);
      setAppointments(appsRes.data);
    } catch (err) {
      console.error('Error fetching data');
    }
  };

  const handleMedicationSuccess = () => {
    setShowMedicationForm(false);
    fetchAllData();
  };

  const handleActivitySuccess = () => {
    setShowActivityForm(false);
    fetchAllData();
  };

  const handleAppointmentSuccess = () => {
    setShowAppointmentForm(false);
    fetchAllData();
  };

  const handleStatusUpdate = () => {
    fetchAllData();
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="elder-card">
      <div className="elder-header">
        <div className="elder-avatar">{getInitials(elder.full_name)}</div>
        <div className="elder-info">
          <h3>{elder.full_name}</h3>
          <div className="elder-meta">{elder.age} years • {elder.gender}</div>
        </div>
      </div>

      {/* Medications Section */}
      <div style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h4 className="section-title">💊 Medications</h4>
          <button onClick={() => setShowMedicationForm(!showMedicationForm)} className="btn btn-success">
            {showMedicationForm ? 'Cancel' : '+ Add Medication'}
          </button>
        </div>
        {showMedicationForm && (
          <MedicationForm
            elderCode={elder.elder_code}
            userCode={userCode}
            onSuccess={handleMedicationSuccess}
            onCancel={() => setShowMedicationForm(false)}
          />
        )}
        {medications.length === 0 ? (
          <div className="empty-state">No medications</div>
        ) : (
          medications.map((med) => (
            <div key={med.id} className="item-card">
              <div className="item-title">{med.medicine_name} - {med.dosage}</div>
              <div className="item-meta">Frequency: {med.frequency}</div>
              <StatusButtons elderCode={elder.elder_code} medication={med} onStatusUpdate={handleStatusUpdate} />
            </div>
          ))
        )}
      </div>

      {/* Today's Activity Section */}
      <div style={{ marginBottom: '24px' }}>
        <h4 className="section-title">📅 Today's Activity</h4>
        {events.length === 0 ? (
          <div className="empty-state">No activity recorded today</div>
        ) : (
          events.map((event) => <EventCard key={event.id} event={event} />)
        )}
      </div>

      {/* Scheduled Activities Section */}
      <div style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h4 className="section-title">🏋️ Scheduled Activities</h4>
          <button onClick={() => setShowActivityForm(!showActivityForm)} className="btn btn-primary">
            {showActivityForm ? 'Cancel' : '+ Schedule Activity'}
          </button>
        </div>
        {showActivityForm && (
          <ActivityForm
            elderCode={elder.elder_code}
            userCode={userCode}
            onSuccess={handleActivitySuccess}
            onCancel={() => setShowActivityForm(false)}
          />
        )}
        {activities.length === 0 ? (
          <div className="empty-state">No scheduled activities</div>
        ) : (
          activities.map((act) => (
            <div key={act.id} className="item-card">
              <div className="item-title">{act.activity_name}</div>
              <div className="item-meta">{new Date(act.schedule_time).toLocaleString()}</div>
            </div>
          ))
        )}
      </div>

      {/* Appointments Section */}
      <div>
        <div className="card-header">
          <h4 className="section-title">🏥 Upcoming Appointments</h4>
          <button onClick={() => setShowAppointmentForm(!showAppointmentForm)} className="btn" style={{ background: '#f59e0b', color: 'white' }}>
            {showAppointmentForm ? 'Cancel' : '+ Add Appointment'}
          </button>
        </div>
        {showAppointmentForm && (
          <AppointmentForm
            elderCode={elder.elder_code}
            userCode={userCode}
            onSuccess={handleAppointmentSuccess}
            onCancel={() => setShowAppointmentForm(false)}
          />
        )}
        {appointments.length === 0 ? (
          <div className="empty-state">No upcoming appointments</div>
        ) : (
          appointments.map((app) => (
            <div key={app.id} className="item-card">
              <div className="item-title">Dr. {app.doctor_name} - {app.department}</div>
              <div className="item-meta">{app.hospital}</div>
              <div className="item-meta">{new Date(app.appointment_time).toLocaleString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default InteractiveElderCard;
