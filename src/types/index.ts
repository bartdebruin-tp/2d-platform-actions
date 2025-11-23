// Global type definitions voor het Vue project

// User types
export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  createdAt: Date
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
  timestamp: number
}

export interface ApiError {
  code: string
  message: string
  details?: unknown
}

// Component Props types
export interface BaseComponentProps {
  id?: string
  className?: string
  disabled?: boolean
}

// Event types
export interface CustomEvent<T = unknown> {
  type: string
  payload: T
  timestamp: number
}

// Store types
export interface StoreState {
  loading: boolean
  error: string | null
  data: unknown
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Vue Router types
export interface RouteParams {
  [key: string]: string | string[]
}

export interface RouteQuery {
  [key: string]: string | string[] | undefined
}

// Form types
export interface FormField<T = string> {
  value: T
  error?: string
  touched: boolean
  required: boolean
}

export interface FormState {
  [key: string]: FormField
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'

export interface ThemeConfig {
  theme: Theme
  primaryColor: string
  secondaryColor: string
}