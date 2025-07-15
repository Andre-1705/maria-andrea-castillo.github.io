import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para la base de datos
export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string
          title: string
          description: string
          image: string
          video?: string
          link: string
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image: string
          video?: string
          link: string
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image?: string
          video?: string
          link?: string
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          email: string
          phone?: string
          company?: string
          message: string
          status: 'pending' | 'contacted' | 'completed' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string
          company?: string
          message: string
          status?: 'pending' | 'contacted' | 'completed' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          company?: string
          message?: string
          status?: 'pending' | 'contacted' | 'completed' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      contact_submissions: {
        Row: {
          id: number
          name: string
          email: string
          phone?: string | null
          company?: string | null
          message: string
          status?: string // acepta 'unread'
          created_at: string
          // updated_at no existe
        }
        Insert: {
          id?: number
          name: string
          email: string
          phone?: string | null
          company?: string | null
          message: string
          status?: string // acepta 'unread'
          created_at?: string
          // updated_at no existe
        }
        Update: {
          id?: number
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          message?: string
          status?: string
          created_at?: string
          // updated_at no existe
        }
      }
    }
  }
} 