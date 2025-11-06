import { createClient } from '@supabase/supabase-js';

// DIY Generations Project Configuration
const DIY_PROJECT_ID = 'oqjgvzaedlwarmyjlsoz';
const DIY_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xamd2emFlZGx3YXJteWpsc296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODYxMDYsImV4cCI6MjA3Nzc2MjEwNn0.GqxEM1JbbCcBj5m2sORBIvWX_JD5JrdYkkdidvp5Hzc';

// Singleton Supabase client for DIY project
let diySupabaseClient: ReturnType<typeof createClient> | null = null;

export function getDIYSupabaseClient() {
  if (!diySupabaseClient) {
    diySupabaseClient = createClient(
      `https://${DIY_PROJECT_ID}.supabase.co`,
      DIY_ANON_KEY
    );
  }
  return diySupabaseClient;
}

export const diyProjectId = DIY_PROJECT_ID;
export const diyPublicAnonKey = DIY_ANON_KEY;
