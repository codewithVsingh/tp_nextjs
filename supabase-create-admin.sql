-- Run this in your Supabase SQL Editor to forcefully create or reset the Admin user.
-- This natively injects the correctly hashed 'Vikas@1947' password and auto-confirms the email so you don't get 'invalid_credentials'.

DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
BEGIN
    -- Check if user already exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tp@tutorsparliament.com') THEN
        
        -- Insert the core user record
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            new_user_id,
            'authenticated',
            'authenticated',
            'tp@tutorsparliament.com',
            crypt('Vikas@1947', gen_salt('bf')), -- Automatically hashes the password internally!
            now(), -- Auto-confirm the email
            '{"provider":"email","providers":["email"]}',
            '{}',
            now(),
            now()
        );

        -- Insert the identity provider record (required by Supabase GoTrue)
        INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            created_at,
            updated_at
        ) VALUES (
            new_user_id,
            new_user_id,
            format('{"sub":"%s","email":"%s"}', new_user_id::text, 'tp@tutorsparliament.com')::jsonb,
            'email',
            now(),
            now()
        );

    ELSE
        -- If the user somehow exists but was typo'd or unconfirmed, this forcefully resets their password and confirmed status
        UPDATE auth.users 
        SET encrypted_password = crypt('Vikas@1947', gen_salt('bf')),
            email_confirmed_at = COALESCE(email_confirmed_at, now())
        WHERE email = 'tp@tutorsparliament.com';
    END IF;
END $$;
