-- 🔥 REALIFY DATA: Swapping placeholders for real professional names 🔥
-- Run this in your Supabase SQL Editor

-- 1. Create a temporary mapping of names for leads
CREATE TEMP TABLE lead_names (id INT, name TEXT);
INSERT INTO lead_names (id, name) VALUES 
(1, 'Aarav Sharma'), (2, 'Priya Singh'), (3, 'Ishaan Gupta'), (4, 'Anjali Verma'), (5, 'Rohan Malhotra'),
(6, 'Sanya Iyer'), (7, 'Kabir Reddy'), (8, 'Meera Nair'), (9, 'Arjun Das'), (10, 'Zara Khan'),
(11, 'Vihaan Joshi'), (12, 'Ananya Bose'), (13, 'Reyansh Mittal'), (14, 'Kiara Patil'), (15, 'Aaryan Saxena'),
(16, 'Aditi Rao'), (17, 'Advait Kulkarni'), (18, 'Navya Hegde'), (19, 'Vivaan Chawla'), (20, 'Myra Kapoor');

-- 2. Update LEADS with real names
DO $$ 
DECLARE 
    r RECORD;
    v_name TEXT;
    v_idx INT := 1;
BEGIN 
    FOR r IN (SELECT id FROM leads WHERE name LIKE 'Student %' OR name IS NULL) LOOP
        v_name := (SELECT name FROM lead_names WHERE id = (v_idx % 20) + 1);
        UPDATE leads SET name = v_name || ' ' || (v_idx % 100) WHERE id = r.id;
        v_idx := v_idx + 1;
    END LOOP;
END $$;

-- 3. Create a temporary mapping for tutors
CREATE TEMP TABLE tutor_names (id INT, name TEXT);
INSERT INTO tutor_names (id, name) VALUES 
(1, 'Dr. Amit Trivedi'), (2, 'Prof. Sunita Deshmukh'), (3, 'Vikram Malhotra'), (4, 'Neha Aggarwal'), (5, 'Sanjay Kapoor'),
(6, 'Ritu Bhardwaj'), (7, 'Abhishek Chatterjee'), (8, 'Pooja Hegde'), (9, 'Manish Pandey'), (10, 'Shweta Tiwari');

-- 4. Update TUTORS with real names
DO $$ 
DECLARE 
    r RECORD;
    v_name TEXT;
    v_idx INT := 1;
BEGIN 
    FOR r IN (SELECT id FROM tutor_registrations WHERE name LIKE 'Tutor %' OR name IS NULL) LOOP
        v_name := (SELECT name FROM tutor_names WHERE id = (v_idx % 10) + 1);
        UPDATE tutor_registrations SET name = v_name || ' ' || (v_idx % 50) WHERE id = r.id;
        v_idx := v_idx + 1;
    END LOOP;
END $$;

-- 5. SYNC PAYMENTS: Pull real names from source tables
-- This ensures the ledger always matches the CRM
UPDATE payments p
SET 
  lead_name = COALESCE((SELECT name FROM leads l WHERE l.id = p.lead_id), p.lead_name),
  tutor_name = COALESCE((SELECT name FROM tutor_registrations t WHERE t.id = p.tutor_id), p.tutor_name)
WHERE lead_id IS NOT NULL OR tutor_id IS NOT NULL;

-- 6. Cleanup
DROP TABLE lead_names;
DROP TABLE tutor_names;

-- Verification
SELECT lead_name, tutor_name, amount, month FROM payments LIMIT 10;
