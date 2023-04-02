import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards
} from '@nestjs/common'
import { ForgetPassword } from '@prisma/client'
import { IAuth } from 'difport-interface'
import { Response } from 'express'
import { ResponseData } from '../utils/response'
import { AuthService } from './auth.service'
import { AuthDTO } from './dto/auth.dto'
import { ForgetPasswordDto } from './dto/forget-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { JwtAuthGuard } from './jwt-auth.guard'
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async auth(@Res() res: Response, @Body() body: AuthDTO) {
    try {
      const data = await this.authService.validateUser(body)
      const result: ResponseData<IAuth> = {
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
      throw new HttpException(message, HttpStatus.UNAUTHORIZED)
    }
  }

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
      throw new HttpException(message, HttpStatus.UNAUTHORIZED)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}
