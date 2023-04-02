import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { compare, hashSync } from 'bcrypt'
import { IAuth } from 'difport-interface'
import { nanoid } from 'nanoid/non-secure'
import { PrismaService } from '../prisma/prisma.service'
import { AuthDTO } from './dto/auth.dto'
import { ForgetPasswordDto } from './dto/forget-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUser(auth: AuthDTO): Promise<IAuth> {
    const user = await this.prisma.user.findFirst({
      where: {
        username: auth.username
      }
    })
    if (!user) throw new Error('User not found.')

    const match = await compare(auth.password, user.password)
    if (!match) throw new Error('Password incorrect')

    if (user && match) {
      const { password, ...result } = user

      const payload = { username: result.username, sub: user.id }
      const token = this.jwtService.sign(payload)

      return {
        user: result,
        accessToken: token
      }
    }
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }

  getCookieWithJwtToken(token: string) {
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXPIRATION_TIME}`
  }

  getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`
  }

  // @todo email service
  async forgetPassword(data: ForgetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: data.email
      }
    })

    if (!user) throw new Error('User not found')

    const forgot = await this.prisma.forgetPassword.findFirst({
      where: {
        userId: user.id
      }
    })

    const token = nanoid(30)
    if (!forgot) {
      const data = {
        userId: user.id,
        token: token
      }
      await this.prisma.forgetPassword.create({
        data: data
      })
    } else {
      await this.prisma.forgetPassword.update({
        where: {
          id: forgot.id
        },
        data: {
          token: token
        }
      })
    }
  }

  async resetPassword(data: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: data.email
      }
    })

    if (!user) throw new Error('User not found')

    const reset = await this.prisma.forgetPassword.findFirst({
      where: {
        userId: user.id,
        token: data.token
      }
    })

    if (!reset) {
      throw Error('Token not found')
    }

    if (data.newPassword != data.confirmPassword) throw Error('Password not match')
    const password = hashSync(data.newPassword, 10)
    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        password: password
      }
    })

    await this.prisma.forgetPassword.delete({
      where: {
        id: reset.id
      }
    })
  }
}
