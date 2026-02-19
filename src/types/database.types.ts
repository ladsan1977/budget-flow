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
            categories: {
                Row: {
                    id: string
                    name: string
                    type: 'income' | 'fixed' | 'variable'
                    icon: string | null
                    color: string | null
                    user_id: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    type: 'income' | 'fixed' | 'variable'
                    icon?: string | null
                    color?: string | null
                    user_id: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    type?: 'income' | 'fixed' | 'variable'
                    icon?: string | null
                    color?: string | null
                    user_id?: string
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            transactions: {
                Row: {
                    id: string
                    amount: number
                    date: string
                    description: string
                    category_id: string
                    type: 'income' | 'fixed' | 'variable'
                    is_paid: boolean
                    user_id: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    amount: number
                    date: string
                    description: string
                    category_id: string
                    type: 'income' | 'fixed' | 'variable'
                    is_paid?: boolean
                    user_id: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    amount?: number
                    date?: string
                    description?: string
                    category_id?: string
                    type?: 'income' | 'fixed' | 'variable'
                    is_paid?: boolean
                    user_id?: string
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "transactions_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "transactions_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            budgets: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    user_id: string
                    category_id: string
                    limit_amount: number
                    month_year: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    user_id: string
                    category_id: string
                    limit_amount: number
                    month_year: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    user_id?: string
                    category_id?: string
                    limit_amount?: number
                    month_year?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "budgets_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "budgets_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
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
    }
}
