import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

import { IErrorMessage } from './utils/response'

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

    const msg =
      exception instanceof HttpException
        ? [{ message: [(exception.getResponse() as IErrorMessage).message] }]
        : (exception as IErrorMessage[])

    const responseBody = {
      success: false,
      errors: msg
    }
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}
