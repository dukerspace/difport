import { IsString } from 'class-validator'

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

export class AuthDTO {
  @IsString()
  username: string

  @IsString()
  password: string
}
