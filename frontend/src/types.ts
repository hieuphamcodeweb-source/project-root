export type UserStatus = 'active' | 'inactive' | 'pending' | 'banned'

export type UserRole = 'Staff' | 'Admin' | 'Member'

export interface UserRecord {
  id: number
  username: string
  dateRegistered: string
  role: UserRole
  status: UserStatus
}

export interface CreateUserPayload {
  username: string
  dateRegistered: string
  role: UserRole
  status: UserStatus
}
