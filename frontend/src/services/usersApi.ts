import type { CreateUserPayload, UserRecord } from '../types'

interface UsersApiResponse {
  data: UserRecord[]
  total: number
  page: number
  pageSize: number
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

export async function getUsers(): Promise<UsersApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/users`)

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
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Failed to create user: ${response.status}`)
  }

  return (await response.json()) as CreateUserApiResponse
}

interface DeleteUserApiResponse {
  message: string
  data: UserRecord
}

export async function deleteUser(id: number): Promise<DeleteUserApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to delete user: ${response.status}`)
  }

  return (await response.json()) as DeleteUserApiResponse
}
