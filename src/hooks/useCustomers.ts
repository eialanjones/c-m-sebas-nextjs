import useSWR from 'swr'
import type { Customer } from '@/types/customer'
import { baseFetch } from '@/utils/api'

export function useCustomers() {
  const { data, error, isLoading, mutate } = useSWR<Customer[]>(
    '/customers',
    baseFetch
  )

  return {
    customers: data,
    isLoading,
    isError: error,
    mutate
  }
} 