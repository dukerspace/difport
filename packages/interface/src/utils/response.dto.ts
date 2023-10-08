export type ResponsePaginateDTO<T = any> = {
  success: boolean
  total: number
  per_page: number
  page: number
  last_page: number
  data: T
}

export type ResponseDTO<T = any> = {
  success: boolean
  data: T
}

export type ErrorResponseDTO<T = any> = {
  success: boolean
  message: T
}

export type OkResponseDTO<T = any> = {
  success: boolean
  message: T
}
