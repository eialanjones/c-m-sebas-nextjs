import useSWR from 'swr'
import { baseFetch } from '@/utils/api'
import type { User } from '@/types/user'
import { clientApi } from '@/utils/api'

interface CreateUserData {
  email: string
  password: string
  userType: User['userType']
}

interface UpdateUserData {
  email?: string
  password?: string
  userType?: User['userType']
  active?: boolean
}

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<User[]>(
    '/users',
    baseFetch,
    {
      keepPreviousData: true,
    }
  )

  const createUser = async (userData: CreateUserData) => {
    try {
      const response = await clientApi.post('/users', userData)
      await mutate(undefined, { revalidate: true })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const updateUser = async (userId: string, userData: UpdateUserData) => {
    try {
      const response = await clientApi.patch(`/users/${userId}`, userData)
      await mutate();
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    users: data,
    isLoading,
    isError: error,
    mutate,
    createUser,
    updateUser
  }
} 