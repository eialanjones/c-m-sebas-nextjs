import useSWR from 'swr'
import type { CustomerBase } from '@/types/customer_base'
import { baseFetch } from '@/utils/api'

export function useCustomerBases() {
  const { data, error, isLoading, mutate } = useSWR<CustomerBase[]>(
    '/customer-bases',
    baseFetch
  )

  return {
    customerBases: data,
    isLoading,
    isError: error,
    mutate
  }
} 