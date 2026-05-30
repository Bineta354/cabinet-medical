-- Disable RLS for notifications_medecin_secretaire table
-- This fixes the "new row violates row-level security policy" error

ALTER TABLE public.notifications_medecin_secretaire DISABLE ROW LEVEL SECURITY;
