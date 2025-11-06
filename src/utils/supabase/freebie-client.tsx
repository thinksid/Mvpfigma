import { createClient } from '@supabase/supabase-js';

// Freebie Project Configuration (Social Proof Thermometer)
const FREEBIE_PROJECT_ID = 'dbojiegvkyvbmbivmppi';
const FREEBIE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRib2ppZWd2a3l2Ym1iaXZtcHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NDA0NDMsImV4cCI6MjA3NzQxNjQ0M30.vdXxqOosxNSzrt3c-VaQbeDuAltLtaP5Tj-UKx-sWQQ';

// Singleton Supabase client for Freebie project
let freebieSupabaseClient: ReturnType<typeof createClient> | null = null;

export function getFreebieSupabaseClient() {
  if (!freebieSupabaseClient) {
    freebieSupabaseClient = createClient(
      `https://${FREEBIE_PROJECT_ID}.supabase.co`,
      FREEBIE_ANON_KEY
    );
  }
  return freebieSupabaseClient;
}

export const freebieProjectId = FREEBIE_PROJECT_ID;
export const freebiePublicAnonKey = FREEBIE_ANON_KEY;
