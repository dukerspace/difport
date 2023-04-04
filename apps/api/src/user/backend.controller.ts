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
  Req,
  Res,
  UseGuards
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { hashSync } from 'bcrypt'
import { Response } from 'express'
import { UserRole } from 'src/auth/decorators/role.decorator'
import { AuthGuard } from '../auth/guards/auth.guard'
import { ResponseData, ResponsePaginate } from '../utils/response'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('admins/users')
@UserRole(Role.ADMIN)
@UseGuards(AuthGuard)
export class AdminUserController {
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
      throw new HttpException(message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Req() req,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('is_deleted') isDeleted: boolean
  ) {
    try {
      console.log('xxxx', req.user)
      const query = await this.userService.findAll(+page || 1, +limit || 50, isDeleted)
      const total = await this.userService.count()
      const response = new ResponsePaginate(true, query, page, limit, total)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.BAD_REQUEST)
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
      throw new HttpException(message, HttpStatus.BAD_REQUEST)
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
      throw new HttpException(message, HttpStatus.BAD_REQUEST)
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
      throw new HttpException(message, HttpStatus.BAD_REQUEST)
    }
  }
}
