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
  Res,
  UseGuards
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Role } from '@prisma/client'
import { Response } from 'express'
import { UserRole } from '../../auth/decorators/role.decorator'
import { ResponseData } from '../../utils/response'
import { CreateWorkspaceDto } from '../dto/create-workspace.dto'
import { UpdateWorkspaceDto } from '../dto/update-workspace.dto'
import { WorkspaceService } from '../workspace.service'

@UserRole(Role.ADMIN)
@UseGuards(AuthGuard)
@Controller('admins/workspaces')
export class AdminController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async create(@Res() res: Response, @Body() body: CreateWorkspaceDto) {
    try {
      const query = await this.workspaceService.create(body)
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
  async findAll(@Res() res: Response, @Query('page') page: number, @Query('limit') limit: number) {
    try {
      const query = await this.workspaceService.findAll(1, page, limit)
      const response = new ResponseData(true, query)
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
      const query = await this.workspaceService.findOne(id)
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
  async update(@Res() res: Response, @Param('id') id: string, @Body() body: UpdateWorkspaceDto) {
    try {
      const query = await this.workspaceService.update(id, body)
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
      const query = await this.workspaceService.remove(id)
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
