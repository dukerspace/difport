import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

import { IErrorMessage } from './utils/response'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost

    if (process.env.APP_ENV == 'develop') {
      console.log('error', exception)
    }

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
