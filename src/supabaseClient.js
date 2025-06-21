import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cqtkqpmhqzefdjbtztfj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxdGtxcG1ocXplZmRqYnR6dGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MjAyMjIsImV4cCI6MjA2NjA5NjIyMn0.OdZXglnbBjAOXfwjsNd1KObU45DTECD9AkKPF-QW3hU'

export const supabase = createClient(supabaseUrl, supabaseKey)
