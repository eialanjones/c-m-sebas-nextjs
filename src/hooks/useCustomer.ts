import useSWR from 'swr'
import type { Customer } from '@/types/customer'
import { baseFetch } from '@/utils/api'

export function useCustomer(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Customer>(
    id ? `/customers/${id}` : null,
    baseFetch
  )

  return {
    customer: data,
    isLoading,
    isError: error,
    mutate
  }
} 