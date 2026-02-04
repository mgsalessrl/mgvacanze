export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          role: 'user' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          role?: 'user' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          role?: 'user' | 'admin'
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: number
          property_id: number
          user_email: string
          user_id: string | null
          start_date: string
          end_date: string
          total_price: number
          status: 'pending' | 'confirmed' | 'paid' | 'cancelled'
          deposit_amount?: number | null
          deposit_status?: 'pending' | 'paid' | 'cancelled' | null
          balance_amount?: number | null
          balance_status?: 'pending' | 'paid' | 'cancelled' | null
          extra_services: Json
          created_at: string
        }
        Insert: {
          id?: number
          property_id: number
          user_email: string
          user_id?: string | null
          start_date: string
          end_date: string
          total_price?: number
          status?: 'pending' | 'confirmed' | 'paid' | 'cancelled'
          deposit_amount?: number | null
          deposit_status?: 'pending' | 'paid' | 'cancelled' | null
          balance_amount?: number | null
          balance_status?: 'pending' | 'paid' | 'cancelled' | null
          extra_services?: Json
          created_at?: string
        }
        Update: {
          id?: number
          property_id?: number
          user_email?: string
          user_id?: string | null
          start_date?: string
          end_date?: string
          total_price?: number
          status?: 'pending' | 'confirmed' | 'paid' | 'cancelled'
          deposit_amount?: number | null
          deposit_status?: 'pending' | 'paid' | 'cancelled' | null
          balance_amount?: number | null
          balance_status?: 'pending' | 'paid' | 'cancelled' | null
          extra_services?: Json
          created_at?: string
        }
        Relationships: []
      }
      extras: {
        Row: {
          id: number
          name: string
          description: string | null
          price: number
          category: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          price: number
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          price?: number
          category?: string | null
          created_at?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          id: number
          property_id: number | null
          boat_name: string
          start_date: string
          end_date: string
          guests: number
          customer_name: string
          customer_email: string
          customer_phone: string 
          rental_price: number
          discount_amount: number | null
          discount_type: string | null
          extras_price: number | null
          vat_amount: number | null
          total_price: number
          extras_snapshot: any
          status: string
          valid_until: string | null
          pdf_url: string | null
          notes: string | null
          created_at: string
          booking_id?: number | null
        }
        Insert: {
          id?: number
          property_id?: number | null
          boat_name: string
          start_date: string
          end_date: string
          guests: number
          customer_name: string
          customer_email: string
          customer_phone: string
          rental_price: number
          discount_amount?: number | null
          discount_type?: string | null
          extras_price?: number | null
          vat_amount?: number | null
          total_price: number
          extras_snapshot?: any
          status?: string
          valid_until?: string | null
          pdf_url?: string | null
          notes?: string | null
          created_at?: string
          booking_id?: number | null
        }
        Update: {
          id?: number
          property_id?: number | null
          boat_name?: string
          start_date?: string
          end_date?: string
          guests?: number
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          rental_price?: number
          discount_amount?: number | null
          discount_type?: string | null
          extras_price?: number | null
          vat_amount?: number | null
          total_price?: number
          extras_snapshot?: any
          status?: string
          valid_until?: string | null
          pdf_url?: string | null
          notes?: string | null
          created_at?: string
          booking_id?: number | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          id: number
          title: string
          description: string | null
          price: number | null
          city: string | null
          address: string | null
          lat: number | null
          lng: number | null
          bedrooms: number | null
          bathrooms: number | null
          guests: number | null
          area: number | null
          image_url: string | null
          specs: Json
          features: Json
          images: Json
          extra_options: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: number
          title: string
          description?: string | null
          price?: number | null
          city?: string | null
          address?: string | null
          lat?: number | null
          lng?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          guests?: number | null
          area?: number | null
          image_url?: string | null
          specs?: Json
          features?: Json
          images?: Json
          extra_options?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          price?: number | null
          city?: string | null
          address?: string | null
          lat?: number | null
          lng?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          guests?: number | null
          area?: number | null
          image_url?: string | null
          specs?: Json
          features?: Json
          images?: Json
          extra_options?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
