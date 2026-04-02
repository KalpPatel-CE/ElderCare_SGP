-- Database Performance Optimization Script
-- Run this script to add indexes for faster queries

-- Indexes for families table
CREATE INDEX IF NOT EXISTS idx_families_email ON families(email);

-- Indexes for caretakers table
CREATE INDEX IF NOT EXISTS idx_caretakers_email ON caretakers(email);
CREATE INDEX IF NOT EXISTS idx_caretakers_availability ON caretakers(availability_status) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_caretakers_city ON caretakers(city) WHERE availability_status = 'available';

-- Indexes for elders table
CREATE INDEX IF NOT EXISTS idx_elders_family_id ON elders(family_id);
CREATE INDEX IF NOT EXISTS idx_elders_elder_code ON elders(elder_code);

-- Indexes for caretaker_requests table
CREATE INDEX IF NOT EXISTS idx_requests_family_id ON caretaker_requests(family_id);
CREATE INDEX IF NOT EXISTS idx_requests_elder_id ON caretaker_requests(elder_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON caretaker_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_service_city ON caretaker_requests(service_city);

-- Indexes for service_assignments table
CREATE INDEX IF NOT EXISTS idx_assignments_request_id ON service_assignments(request_id);
CREATE INDEX IF NOT EXISTS idx_assignments_caretaker_id ON service_assignments(caretaker_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON service_assignments(status);

-- Indexes for medications table
CREATE INDEX IF NOT EXISTS idx_medications_elder_id ON medications(elder_id);

-- Indexes for activities table
CREATE INDEX IF NOT EXISTS idx_activities_elder_id ON activities(elder_id);

-- Indexes for baseline_vitals table
CREATE INDEX IF NOT EXISTS idx_baseline_vitals_elder_id ON baseline_vitals(elder_id);

-- Indexes for daily_care_logs table
CREATE INDEX IF NOT EXISTS idx_care_logs_assignment_id ON daily_care_logs(assignment_id);
CREATE INDEX IF NOT EXISTS idx_care_logs_elder_id ON daily_care_logs(elder_id);
CREATE INDEX IF NOT EXISTS idx_care_logs_caretaker_id ON daily_care_logs(caretaker_id);

-- Indexes for vitals_logs table
CREATE INDEX IF NOT EXISTS idx_vitals_logs_assignment_id ON vitals_logs(assignment_id);
CREATE INDEX IF NOT EXISTS idx_vitals_logs_elder_id ON vitals_logs(elder_id);

-- Indexes for appointments table
CREATE INDEX IF NOT EXISTS idx_appointments_request_id ON appointments(request_id);
CREATE INDEX IF NOT EXISTS idx_appointments_elder_id ON appointments(elder_id);

-- Indexes for alerts table
CREATE INDEX IF NOT EXISTS idx_alerts_family_id ON alerts(family_id);
CREATE INDEX IF NOT EXISTS idx_alerts_elder_id ON alerts(elder_id);

-- Analyze tables for query planner optimization
ANALYZE families;
ANALYZE caretakers;
ANALYZE elders;
ANALYZE caretaker_requests;
ANALYZE service_assignments;
ANALYZE medications;
ANALYZE activities;
ANALYZE baseline_vitals;
ANALYZE daily_care_logs;
ANALYZE vitals_logs;
ANALYZE appointments;
ANALYZE alerts;
