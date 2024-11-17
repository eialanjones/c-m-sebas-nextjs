import useSWR from 'swr'
import { baseFetch } from '@/utils/api'
import type { User } from '@/types/user'
import {clientApi} from '@/utils/api'

interface CreateUserData {
  email: string
  password: string
  userType: User['userType']
}

interface UpdateUserData {
  email?: string
  password?: string
  userType?: User['userType']
}

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<User[]>(
    '/users',
    baseFetch
  )

  const createUser = async (userData: CreateUserData) => {
    try {
      const response = await clientApi.post('/users', userData)
      await mutate()
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const updateUser = async (userId: string, userData: UpdateUserData) => {
    try {
      const response = await clientApi.put(`/users/${userId}`, userData)
      await mutate()
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      await clientApi.delete(`/users/${userId}`)
      await mutate() // Revalidate the users list
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
    updateUser,
    deleteUser
  }
} 