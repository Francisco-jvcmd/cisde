import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Lead {
  id?: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  consent: boolean;
  created_at?: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  published_at: string;
  slug: string;
}
