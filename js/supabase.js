const SUPABASE_URL = "https://qtoahowstzrvbhmddnbr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0b2Fob3dzdHpydmJobWRkbmJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMjcwNjksImV4cCI6MjA5MzcwMzA2OX0.wdPjtpQmQxkluV3NhyFSt-ocM6HSOMt-Z5GmAvXmwR8";

// CDN exposes the *library* on window.supabase (createClient, etc.). The *client* must be a
// separate name so pages never accidentally call .from() on the library object.
const supabaseLib = window.supabase;
if (!supabaseLib || typeof supabaseLib.createClient !== "function") {
  console.error("Supabase JS library missing: load @supabase/supabase-js before js/supabase.js.");
} else {
  window.globalHrSupabase = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
