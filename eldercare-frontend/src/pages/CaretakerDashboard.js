import { useEffect, useState } from "react";
import api from "../api";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import InteractiveElderCard from "../components/InteractiveElderCard";
import AlertCard from "../components/AlertCard";
import StatsCard from "../components/StatsCard";
import "../Dashboard.css";

function CaretakerDashboard() {
  const [elders, setElders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eldersRes, alertsRes] = await Promise.all([
        api.get(`/elders/user/${user.user_code}`),
        api.get(`/alerts/${user.user_code}`)
      ]);
      
      setElders(eldersRes.data);
      setAlerts(alertsRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <TopNavbar title="Caretaker Dashboard" />
          <div className="dashboard-content">
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopNavbar title="Caretaker Dashboard" />
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Caretaker Portal</h1>
            <p className="dashboard-subtitle">Manage and monitor assigned elders</p>
          </div>

          <div className="stats-grid">
            <StatsCard label="Assigned Elders" value={elders.length} color="#2563eb" />
            <StatsCard label="Active Alerts" value={alerts.length} color="#dc2626" />
          </div>

          {alerts.length > 0 && (
            <div className="card" style={{ marginBottom: '32px' }}>
              <h3 className="card-title">⚠️ Alerts</h3>
              {alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)}
            </div>
          )}

          <div>
            <h3 className="card-title" style={{ marginBottom: '20px' }}>👥 Assigned Elders</h3>
            {elders.length === 0 ? (
              <div className="card">
                <div className="empty-state">No elders assigned</div>
              </div>
            ) : (
              elders.map((elder) => (
                <InteractiveElderCard key={elder.id} elder={elder} userCode={user.user_code} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaretakerDashboard;
