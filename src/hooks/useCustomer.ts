import useSWR from 'swr'
import type { Customer } from '@/types/customer'
import { baseFetch } from '@/utils/api'

export function useCustomer({userId, customerId}: {userId?: string, customerId?: string}) {
  const { data, error, isLoading, mutate } = useSWR<Customer>(
    userId ? '/customers/by-user' : customerId ? `/customers/${customerId}` : null,
    baseFetch
  )

  return {
    customer: data,
    isLoading,
    isError: error,
    mutate
  }
} 