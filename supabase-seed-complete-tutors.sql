-- SEED DATA: COMPLETE TUTOR PROFILES (Step 4)
-- This feeds high-quality, verified tutors for testing the marketplace

INSERT INTO tutor_registrations (
    name, phone, email, state, city, pincode, 
    subjects, classes, boards, teaching_mode, 
    languages, qualification, specialization, experience, 
    current_status, available_days, time_slots, expected_fees, 
    travel_willing, travel_radius, step_reached, status, created_at
) VALUES 
(
    'Dr. Arpit Sharma', '9876543210', 'arpit.sharma@example.com', 'Delhi', 'Delhi', '110001', 
    ARRAY['Physics', 'Mathematics'], ARRAY['Class 11', 'Class 12'], ARRAY['CBSE', 'ICSE'], 'Both', 
    ARRAY['English', 'Hindi'], 'Ph.D', 'Quantum Physics', '12 Years', 
    'Full-time Professional', ARRAY['Monday', 'Wednesday', 'Friday'], ARRAY['Evening', 'Afternoon'], '₹1200/hr', 
    'Yes', '10km', 4, 'approved', NOW() - INTERVAL '15 days'
),
(
    'Megha Iyer', '8765432109', 'megha.iyer@example.com', 'Karnataka', 'Bangalore', '560001', 
    ARRAY['Biology', 'Chemistry'], ARRAY['Class 9', 'Class 10'], ARRAY['ICSE', 'IB'], 'Online', 
    ARRAY['English', 'Kannada', 'Tamil'], 'M.Sc', 'Microbiology', '5 Years', 
    'School Teacher', ARRAY['Saturday', 'Sunday'], ARRAY['Morning'], '₹800/hr', 
    'No', '0km', 4, 'approved', NOW() - INTERVAL '5 days'
),
(
    'Vikram Malhotra', '7654321098', 'vikram.m@example.com', 'Maharashtra', 'Mumbai', '400001', 
    ARRAY['Accounts', 'Economics'], ARRAY['Class 12', 'College'], ARRAY['CBSE', 'State Board'], 'Both', 
    ARRAY['English', 'Hindi', 'Marathi'], 'CA (Chartered Accountant)', 'Commerce', '8 Years', 
    'Corporate Trainer', ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], ARRAY['Night'], '₹1500/hr', 
    'Yes', '5km', 4, 'approved', NOW() - INTERVAL '2 days'
),
(
    'Saira Banu', '6543210987', 'saira.banu@example.com', 'Rajasthan', 'Jaipur', '302001', 
    ARRAY['History', 'Geography'], ARRAY['Class 6', 'Class 7', 'Class 8'], ARRAY['CBSE'], 'Home', 
    ARRAY['Hindi', 'Urdu', 'English'], 'B.A, B.Ed', 'Humanities', '15 Years', 
    'Retiree', ARRAY['Monday', 'Wednesday', 'Friday'], ARRAY['Afternoon'], '₹500/hr', 
    'Yes', '15km', 4, 'approved', NOW() - INTERVAL '20 days'
),
(
    'Priya Saxena', '5432109876', 'priya.s@example.com', 'Uttar Pradesh', 'Lucknow', '226001', 
    ARRAY['Computer Science', 'Python'], ARRAY['Class 11', 'Class 12'], ARRAY['CBSE', 'IB'], 'Both', 
    ARRAY['English', 'Hindi'], 'B.Tech IT', 'Software Engineering', '3 Years', 
    'Freelancer', ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], ARRAY['Evening'], '₹1000/hr', 
    'Yes', '8km', 4, 'approved', NOW() - INTERVAL '1 day'
);

-- Seed join tables for these tutors to enable matching
-- (Assuming the master_subjects/classes tables are populated as per previous steps)

-- Note: In a real environment, we'd look up IDs, but for seed we can use logic if master tables are set.
-- For now, let's just ensure the summaries in tutor_registrations are ready as shown above.
