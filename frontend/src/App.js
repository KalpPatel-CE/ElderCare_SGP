import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TermsOfService from './pages/TermsOfService';
import FamilyDashboard from './pages/FamilyDashboard';
import CaretakerDashboard from './pages/CaretakerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PaymentGateway from './pages/PaymentGateway';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/payment" element={<PaymentGateway />} />
        <Route path="/family" element={<ProtectedRoute role="family"><FamilyDashboard /></ProtectedRoute>} />
        <Route path="/caretaker" element={<ProtectedRoute role="caretaker"><CaretakerDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
