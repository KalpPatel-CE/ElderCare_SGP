-- PHASE 1: Database Schema Updates for Elder Care Business Platform

-- Add address fields to families
ALTER TABLE families
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city VARCHAR(50),
ADD COLUMN IF NOT EXISTS state VARCHAR(50) DEFAULT 'Gujarat',
ADD COLUMN IF NOT EXISTS pincode VARCHAR(10);

-- Add address + photo fields to caretakers
ALTER TABLE caretakers
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city VARCHAR(50),
ADD COLUMN IF NOT EXISTS state VARCHAR(50) DEFAULT 'Gujarat',
ADD COLUMN IF NOT EXISTS pincode VARCHAR(10),
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Add service address to caretaker_requests
ALTER TABLE caretaker_requests
ADD COLUMN IF NOT EXISTS service_address TEXT,
ADD COLUMN IF NOT EXISTS service_city VARCHAR(50);

-- Add a terms_accepted field to families
ALTER TABLE families
ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT false;

-- Create a static testimonials table for landing page
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_name VARCHAR(100),
  city VARCHAR(50),
  message TEXT,
  rating INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed cities test data
-- Update existing family test account
UPDATE families SET city = 'Ahmedabad', state = 'Gujarat', address = '12 Patel Nagar, Satellite', pincode = '380015' WHERE email = 'family@mail.com';

-- Update existing caretaker test account
UPDATE caretakers SET city = 'Ahmedabad', state = 'Gujarat', address = '45 Navrangpura, Near Stadium', pincode = '380009' WHERE email = 'caretaker@mail.com';

-- Add more test caretakers across cities
INSERT INTO caretakers (
  caretaker_code, full_name, email, password_hash, phone,
  gender, date_of_birth, address, city, state, pincode,
  experience_years, specialization, qualification,
  languages_spoken, availability_status, background_check_status,
  rating, total_assignments
) VALUES
  ('CRT-2', 'Meera Shah', 'meera@care.com',
   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
   '9898989801', 'Female', '1990-05-15',
   '78 Adajan, Near Surat Railway Station', 'Surat', 'Gujarat', '395009',
   7, 'Dementia Care', 'Certified Nursing Assistant',
   'Hindi, Gujarati, English', 'available', 'verified', 4.8, 23),

  ('CRT-3', 'Rajesh Mehta', 'rajesh@care.com',
   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
   '9898989802', 'Male', '1985-11-20',
   '23 Fatehgunj, Vadodara', 'Vadodara', 'Gujarat', '390002',
   10, 'Post-Surgery Care', 'General Nursing',
   'Hindi, Gujarati', 'available', 'verified', 4.9, 41),

  ('CRT-4', 'Priya Joshi', 'priya@care.com',
   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
   '9898989803', 'Female', '1992-03-08',
   '56 Kalawad Road, Rajkot', 'Rajkot', 'Gujarat', '360005',
   4, 'Elderly Care', 'Certified Nursing Assistant',
   'Hindi, Gujarati', 'available', 'verified', 4.6, 12),

  ('CRT-5', 'Dinesh Patel', 'dinesh@care.com',
   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
   '9898989804', 'Male', '1988-07-25',
   '34 Maninagar, Ahmedabad', 'Ahmedabad', 'Gujarat', '380008',
   8, 'Palliative Care', 'Registered Nurse',
   'Hindi, Gujarati, English', 'available', 'verified', 4.7, 31)
ON CONFLICT (email) DO NOTHING;

-- Seed testimonials
INSERT INTO testimonials (family_name, city, message, rating) VALUES
  ('Ramesh Patel', 'Ahmedabad', 'ElderCare assigned us a wonderful caretaker within 24 hours. My father is in safe hands and I can focus on work with complete peace of mind.', 5),
  ('Sunita Desai', 'Surat', 'The caretaker was professional, punctual and genuinely caring. The daily reports gave us full visibility. Highly recommended.', 5),
  ('Vikram Shah', 'Vadodara', 'Background verified, trained, and trustworthy. We have been using ElderCare for 3 months now. Best decision we made for our mother.', 5),
  ('Anita Joshi', 'Rajkot', 'The portal made it so easy to share my mother-in-law''s medical history and routine. The caretaker followed everything perfectly.', 4);
