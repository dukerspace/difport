export interface IUserInfo {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
}

export interface IAuth {
  user: IUserInfo
  accessToken: string
}
