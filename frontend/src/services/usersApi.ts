import type { CreateUserPayload, UserRecord } from '../types'
import { getAuthHeader } from './auth'

interface UsersApiResponse {
  data: UserRecord[]
  total: number
  page: number
  pageSize: number
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001'

export async function getUsers(): Promise<UsersApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    headers: {
      ...getAuthHeader(),
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.status}`)
  }

  return (await response.json()) as UsersApiResponse
}

interface CreateUserApiResponse {
  message: string
  data: UserRecord
}

export async function createUser(payload: CreateUserPayload): Promise<CreateUserApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Failed to create user: ${response.status}`)
  }

  return (await response.json()) as CreateUserApiResponse
}

interface GetUserByIdApiResponse {
  data: UserRecord
}

export async function getUserById(id: number): Promise<GetUserByIdApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    headers: {
      ...getAuthHeader(),
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`)
  }

  return (await response.json()) as GetUserByIdApiResponse
}

interface UpdateUserApiResponse {
  message: string
  data: UserRecord
}

export async function updateUser(id: number, payload: CreateUserPayload): Promise<UpdateUserApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Failed to update user: ${response.status}`)
  }

  return (await response.json()) as UpdateUserApiResponse
}

interface DeleteUserApiResponse {
  message: string
  data: UserRecord
}

export async function deleteUser(id: number): Promise<DeleteUserApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeader(),
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to delete user: ${response.status}`)
  }

  return (await response.json()) as DeleteUserApiResponse
}
