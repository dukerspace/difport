import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common'
import { hashSync } from 'bcrypt'
import { Response } from 'express'
import { Public } from 'src/auth/decorators/public.decorator'
import { RequestWithUser } from 'src/auth/interfaces/user.interface'
import { AuthGuard } from '../auth/guards/auth.guard'
import { ResponseData } from '../utils/response'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async create(@Res() res: Response, @Body() body: CreateUserDto) {
    try {
      const checkUser = await this.userService.findByUsername(body.username)
      if (checkUser) {
        const message = {
          message: 'username is exists'
        }
        throw new HttpException(message, HttpStatus.BAD_REQUEST)
      }

      const checkEmail = await this.userService.findByEmail(body.email)
      if (checkEmail) {
        const message = {
          message: 'email is exits'
        }
        throw new HttpException(message, HttpStatus.BAD_REQUEST)
      }

      const password = hashSync(body.password, 10)
      const data = {
        ...body,
        password: password
      }
      const query = await this.userService.create(data)
      const response = new ResponseData(true, query)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.BAD_REQUEST)
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: number) {
    try {
      const query = await this.userService.findByID(+id)
      const response = new ResponseData(true, query)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.BAD_REQUEST)
    }
  }

  @UseGuards(AuthGuard)
  @Patch('/me')
  async update(@Req() req: RequestWithUser, @Res() res: Response, @Body() body: UpdateUserDto) {
    try {
      const userId = req.user.id
      const query = await this.userService.update(userId, body)
      const response = new ResponseData(true, query)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.BAD_REQUEST)
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/me')
  async remove(@Req() req: RequestWithUser, @Res() res: Response) {
    try {
      const userId: number = +req.user.id
      const query = await this.userService.remove(userId)
      const response = new ResponseData(true, query)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.BAD_REQUEST)
    }
  }
}
