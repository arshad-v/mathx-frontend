import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iaioivhibyazmntdiadn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhaW9pdmhpYnlhem1udGRpYWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMjg3MjIsImV4cCI6MjA2MjYwNDcyMn0.2yYZQp_FgMso3noCFAT7mwlFZ-ab7xB6E4IQ0UaJkzE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
