import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mlnuqdlsedrpeevgwbzz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sbnVxZGxzZWRycGVldmd3Ynp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4ODM5MTQsImV4cCI6MjA5MjQ1OTkxNH0.0kGJ9JhQBUHF05oNapgyOT_hu9cL0DF6NTmykuAl2VU'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
