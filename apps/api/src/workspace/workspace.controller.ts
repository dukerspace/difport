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
import { Response } from 'express'
import { AuthGuard } from '../auth/guards/auth.guard'
import { IRequestWithUser } from '../auth/interfaces/user.interface'
import { ResponseData } from '../utils/response'
import { CreateWorkspaceDto } from './dto/create-workspace.dto'
import { UpdateWorkspaceDto } from './dto/update-workspace.dto'
import { WorkspaceGuard } from './guards/workspace.guard'
import { WorkspaceService } from './workspace.service'

@UseGuards(AuthGuard, WorkspaceGuard)
@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async create(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Body() body: CreateWorkspaceDto
  ) {
    try {
      const userId = req.user.id
      const query = await this.workspaceService.create(body, userId)
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
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Query('page') page: number,
    @Query('limit') limit: number
  ) {
    try {
      const userId = req.user.id
      const query = await this.workspaceService.findAll(+page || 1, +limit || 50, userId)
      const response = new ResponseData(true, query)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get(':wid')
  async findOne(@Req() req: IRequestWithUser, @Res() res: Response, @Param('id') wid: string) {
    try {
      const query = await this.workspaceService.findOne(wid)
      const response = new ResponseData(true, query)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.BAD_REQUEST)
    }
  }

  @Patch(':wid')
  async update(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('wid') wid: string,
    @Body() body: UpdateWorkspaceDto
  ) {
    try {
      const userId = req.user.id
      const query = await this.workspaceService.update(wid, body, userId)
      const response = new ResponseData(true, query)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.BAD_REQUEST)
    }
  }

  @Delete(':wid')
  async remove(@Req() req: IRequestWithUser, @Res() res: Response, @Param('id') wid: string) {
    try {
      const userId = req.user.id
      const query = await this.workspaceService.remove(wid, userId)
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
