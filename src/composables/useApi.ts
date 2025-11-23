import { ref, type Ref } from 'vue'

// Types lokaal definiëren voor dit voorbeeld
interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
  timestamp: number
}

interface ApiError {
  code: string
  message: string
  details?: unknown
}

interface User {
  id: number
  name: string
  email: string
}

// Types voor API responses

export interface UseApiReturn<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<ApiError | null>
  execute: (url: string, options?: RequestInit) => Promise<T | null>
  reset: () => void
}

/**
 * Composable voor API calls met TypeScript
 * Generic type support voor verschillende data types
 */
export function useApi<T = unknown>(): UseApiReturn<T> {
  // Reactive state voor API calls met expliciete typing
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref<boolean>(false)
  const error = ref<ApiError | null>(null)

  const execute = async (url: string, options: RequestInit = {}): Promise<T | null> => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<T> = await response.json()
      
      if (result.success) {
        data.value = result.data
        return result.data
      } else {
        throw new Error(result.message || 'API call failed')
      }
    } catch (err) {
      const apiError: ApiError = {
        code: 'FETCH_ERROR',
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        details: err
      }
      error.value = apiError
      return null
    } finally {
      loading.value = false
    }
  }

  const reset = (): void => {
    data.value = null
    loading.value = false
    error.value = null
  }

  return {
    data,
    loading,
    error,
    execute,
    reset
  }
}

/**
 * Specifieke composable voor User API calls
 */
export function useUserApi() {
  return useApi<User[]>()
}

// User type verplaatst naar boven