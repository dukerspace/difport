import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

import { ErrorResponse } from './utils/response'

interface IErrorMSG {
  statusCode: number
  message: string[] | string
  error: string
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    const httpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const err =
      exception instanceof HttpException
        ? (exception?.getResponse() as IErrorMSG)
        : HttpStatus.INTERNAL_SERVER_ERROR

    const msg =
      exception instanceof HttpException
        ? err
        : exception instanceof Error
        ? exception.message
        : exception

    const responseBody: ErrorResponse = {
      success: false,
      messages: msg
    }
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}
