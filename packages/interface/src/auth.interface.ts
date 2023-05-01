export interface IAuthRequest {
  username: string
  password: string
}

export interface IAuthResponse {
  user: IUserInfo
  accessToken: string
  refreshToken: string
}

export interface IUserInfo {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
}
