// client/src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

// Get these from your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- 1. Create and Export the Single Client ---
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- 2. Add All Your Auth Functions Here ---
export async function signInWithPassword({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
  if (error) throw error;
  return data;
}

export async function signUp({ email, password, options }) {
  const { data, error } = await supabase.auth.signUp({ email, password, options });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}