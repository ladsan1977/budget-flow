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
            accounts: {
                Row: {
                    id: string
                    name: string
                    type: 'bank' | 'cash'
                    user_id: string
                    is_default: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    type: 'bank' | 'cash'
                    user_id: string
                    is_default?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    type?: 'bank' | 'cash'
                    user_id?: string
                    is_default?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "accounts_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    type: 'income' | 'expense' // Actualizado
                    icon: string | null
                    color: string | null
                    user_id: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    type: 'income' | 'expense' // Actualizado
                    icon?: string | null
                    color?: string | null
                    user_id: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    type?: 'income' | 'expense' // Actualizado
                    icon?: string | null
                    color?: string | null
                    user_id?: string
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "categories_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            transactions: {
                Row: {
                    id: string
                    amount: number
                    date: string
                    description: string | null
                    category_id: string | null // Ahora es opcional (para transfers)
                    account_id: string // Origen (Nuevo)
                    to_account_id: string | null // Destino (Nuevo)
                    type: 'income' | 'expense' | 'transfer' // Actualizado
                    expense_nature: 'fixed' | 'variable' | null // Nuevo
                    is_paid: boolean
                    user_id: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    amount: number
                    date: string
                    description?: string | null
                    category_id?: string | null
                    account_id: string
                    to_account_id?: string | null
                    type: 'income' | 'expense' | 'transfer'
                    expense_nature?: 'fixed' | 'variable' | null
                    is_paid?: boolean
                    user_id: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    amount?: number
                    date?: string
                    description?: string | null
                    category_id?: string | null
                    account_id?: string
                    to_account_id?: string | null
                    type?: 'income' | 'expense' | 'transfer'
                    expense_nature?: 'fixed' | 'variable' | null
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
                        foreignKeyName: "transactions_account_id_fkey"
                        columns: ["account_id"]
                        isOneToOne: false
                        referencedRelation: "accounts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "transactions_to_account_id_fkey"
                        columns: ["to_account_id"]
                        isOneToOne: false
                        referencedRelation: "accounts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "transactions_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            budgets: {
                Row: {
                    id: string
                    category_id: string | null // Agregado para Gauge por categoría
                    limit_amount: number
                    month_year: string
                    user_id: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    category_id?: string | null
                    limit_amount: number
                    month_year: string
                    user_id: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    category_id?: string | null
                    limit_amount?: number
                    month_year?: string
                    user_id?: string
                    created_at?: string
                    updated_at?: string
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
                    }
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