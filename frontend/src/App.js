import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FamilyDashboard from "./pages/FamilyDashboard";
import CaretakerDashboard from "./pages/CaretakerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/family" element={<ProtectedRoute><FamilyDashboard /></ProtectedRoute>} />
        <Route path="/caretaker" element={<ProtectedRoute><CaretakerDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
