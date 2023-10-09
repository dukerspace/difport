import { Body, Controller, HttpException, HttpStatus, Post, Res } from '@nestjs/common'
import { ForgetPassword } from '@prisma/client'
import { AuthDTO, ForgetPasswordDto, IAuthResponse, ResetPasswordDto } from 'difport-interface'
import { Response } from 'express'
import { ResponseData } from '../../utils/response'
import { Public } from '../decorators/public.decorator'
import { AuthService } from '../services/auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async auth(@Res() res: Response, @Body() body: AuthDTO) {
    try {
      const data = await this.authService.validateUser(body)
      const result: ResponseData<IAuthResponse> = {
        success: true,
        data: data
      }
      res.status(HttpStatus.OK).json(result)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.UNAUTHORIZED)
    }
  }

  @Public()
  @Post('password/forget')
  async passwordForget(@Res() res: Response, @Body() body: ForgetPasswordDto) {
    try {
      const data = await this.authService.forgetPassword(body)
      const result: ResponseData<ForgetPassword> = {
        success: true,
        message: 'Please check link in your email'
      }
      res.status(HttpStatus.OK).json(result)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.BAD_GATEWAY)
    }
  }

  @Public()
  @Post('password/reset')
  async passwordReset(@Res() res: Response, @Body() body: ResetPasswordDto) {
    try {
      const data = await this.authService.resetPassword(body)
      const result: ResponseData<ForgetPassword> = {
        success: true,
        message: 'Password has changed'
      }
      res.status(HttpStatus.OK).json(result)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.BAD_GATEWAY)
    }
  }
}
