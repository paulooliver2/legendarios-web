export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  username: string
  password: string
  email?: string
  phone?: string
  pistaId?: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    name: string
    systemRole: string
    journeyStatus: string
  }
}
