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
import { Response } from 'express'
import { ResponseData } from '../utils/response'
import { CreateWorkspaceDto } from './dto/create-workspace.dto'
import { UpdateWorkspaceDto } from './dto/update-workspace.dto'
import { WorkspaceService } from './workspace.service'

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async create(@Res() res: Response, @Body() body: CreateWorkspaceDto) {
    try {
      const query = await this.workspaceService.create(body)
      const response = new ResponseData(true, query)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message
        },
        HttpStatus.BAD_REQUEST
      )
    }
  }

  @Get()
  async findAll(@Res() res: Response, @Query('page') page: number, @Query('limit') limit: number) {
    try {
      const query = await this.workspaceService.findAll(page, limit)
      const response = new ResponseData(true, query)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message
        },
        HttpStatus.BAD_REQUEST
      )
    }
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    try {
      const query = await this.workspaceService.findOne(+id)
      const response = new ResponseData(true, query)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message
        },
        HttpStatus.BAD_REQUEST
      )
    }
  }

  @Patch(':id')
  async update(@Res() res: Response, @Param('id') id: string, @Body() body: UpdateWorkspaceDto) {
    try {
      const query = await this.workspaceService.update(+id, body)
      const response = new ResponseData(true, query)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message
        },
        HttpStatus.BAD_REQUEST
      )
    }
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    try {
      const query = await this.workspaceService.remove(+id)
      const response = new ResponseData(true, query)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message
        },
        HttpStatus.BAD_REQUEST
      )
    }
  }
}
