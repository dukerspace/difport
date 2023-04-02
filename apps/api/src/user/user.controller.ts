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
  Query,
  Res
} from '@nestjs/common'
import { hashSync } from 'bcrypt'
import { Response } from 'express'
import { ResponseData, ResponsePaginate } from '../utils/response'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Res() res: Response, @Body() body: CreateUserDto) {
    try {
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
      throw new HttpException(message, HttpStatus.UNAUTHORIZED)
    }
  }

  @Get()
  async findAll(@Res() res: Response, @Query('page') page: number, @Query('limit') limit: number) {
    try {
      const query = await this.userService.findAll(page, limit)
      const total = await this.userService.count()
      const response = new ResponsePaginate(true, query, page, limit, total)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.UNAUTHORIZED)
    }
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    try {
      const query = await this.userService.findOne(+id)
      const response = new ResponseData(true, query)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.UNAUTHORIZED)
    }
  }

  @Patch(':id')
  async update(@Res() res: Response, @Param('id') id: string, @Body() body: UpdateUserDto) {
    try {
      const query = await this.userService.update(+id, body)
      const response = new ResponseData(true, query)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.UNAUTHORIZED)
    }
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    try {
      const query = await this.userService.remove(+id)
      const response = new ResponseData(true, query)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.UNAUTHORIZED)
    }
  }
}
