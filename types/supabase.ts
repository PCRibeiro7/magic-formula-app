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
      profits: {
        Row: {
          created_at: string
          profit: number
          ticker: string
          year: number
        }
        Insert: {
          created_at?: string
          profit: number
          ticker: string
          year: number
        }
        Update: {
          created_at?: string
          profit?: number
          ticker?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "profits_ticker_fkey"
            columns: ["ticker"]
            referencedRelation: "tickers"
            referencedColumns: ["ticker"]
          }
        ]
      }
      quotes: {
        Row: {
          created_at: string
          date: string
          quote: number | null
          ticker: string
        }
        Insert: {
          created_at?: string
          date: string
          quote?: number | null
          ticker: string
        }
        Update: {
          created_at?: string
          date?: string
          quote?: number | null
          ticker?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_ticker_fkey"
            columns: ["ticker"]
            referencedRelation: "tickers"
            referencedColumns: ["ticker"]
          }
        ]
      }
      tickers: {
        Row: {
          created_at: string
          last_updated: string | null
          last_updated_quotes: string | null
          ticker: string
        }
        Insert: {
          created_at?: string
          last_updated?: string | null
          last_updated_quotes?: string | null
          ticker: string
        }
        Update: {
          created_at?: string
          last_updated?: string | null
          last_updated_quotes?: string | null
          ticker?: string
        }
        Relationships: []
      }
    }
    Views: {
      profit_kings: {
        Row: {
          average_profit: number | null
          ticker: string | null
          years_count: number | null
          years_with_profit_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profits_ticker_fkey"
            columns: ["ticker"]
            referencedRelation: "tickers"
            referencedColumns: ["ticker"]
          }
        ]
      }
    }
    Functions: {
      get_momentum_table: {
        Args: {
          days_ago: number
        }
        Returns: {
          ticker: string
          date_current: string
          quote_current: number
          date_past: string
          quote_past: number
        }[]
      }
      get_valid_quote_date_ago: {
        Args: {
          days_ago: number
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
