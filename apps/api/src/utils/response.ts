export class ResponsePaginate<T> {
  success: boolean
  data?: T
  currentPage?: number
  perPage?: number
  total?: number

  constructor(success = true, data?: T, currentPage?: number, perPage?: number, total?: number) {
    this.success = success
    this.data = data
    this.currentPage = currentPage
    this.perPage = perPage
    this.total = total
  }
}

export class ResponseData<T> {
  success: boolean
  data?: T
  message?: string | null

  constructor(success = true, data?: T, message?: string) {
    this.success = success
    if (data) {
      this.data = data
    }
    if (message) {
      this.message = message
    }
  }
}

export interface IErrorMessage {
  field?: string
  message: string[]
}

export class ErrorResponse {
  success: boolean
  errors: IErrorMessage[]

  constructor(success = false, errors: IErrorMessage[]) {
    this.success = success
    this.errors = errors
  }
}
