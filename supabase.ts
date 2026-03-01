// lib/supabase.ts
// Supabase browser client - safe to use in frontend
// Uses only NEXT_PUBLIC_ vars (anon key is designed to be public)

import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          plan: 'free' | 'pro'
          created_at: string
        }
        Update: {
          full_name?: string
          plan?: 'free' | 'pro'
        }
      }
      messages: {
        Row: {
          id: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          conversation_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          role: 'user' | 'assistant'
          content: string
          conversation_id: string
        }
      }
      daily_usage: {
        Row: {
          id: string
          user_id: string
          date: string
          message_count: number
        }
      }
    }
    Functions: {
      increment_daily_usage: {
        Args: { p_user_id: string }
        Returns: number
      }
    }
  }
}

// Singleton browser client
let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function getSupabaseClient() {
  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Missing Supabase env vars. Copy .env.example to .env.local and fill in your values.'
      )
    }

    client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return client
}

export const supabase = getSupabaseClient()
