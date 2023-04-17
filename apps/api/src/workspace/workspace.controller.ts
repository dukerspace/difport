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
import { WorkspaceRole } from '@prisma/client'
import { Response } from 'express'
import { AuthGuard } from '../auth/guards/auth.guard'
import { IRequestWithUser } from '../auth/interfaces/user.interface'
import { MSG_DELETE_SUCCESS, MSG_WORKSPACE_NOT_FOUND } from '../utils/constant'
import { ResponseData, ResponsePaginate } from '../utils/response'
import { WorkspaceUserRole } from './decorators/workspace.decorator'
import { CreateWorkspaceDto } from './dto/create-workspace.dto'
import { UpdateWorkspaceDto } from './dto/update-workspace.dto'
import { WorkspaceService } from './workspace.service'

@UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Query('page') page: number,
    @Query('limit') limit: number
  ) {
    try {
      const currentPage = page ? page : 1
      const perPage = limit ? limit : 50
      const userId = req.user.id
      const query = await this.workspaceService.findAll(currentPage, perPage, userId)
      const total = await this.workspaceService.count(userId)
      const response = new ResponsePaginate(true, query, currentPage, perPage, total)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.BAD_REQUEST)
    }
  }

  @WorkspaceUserRole([WorkspaceRole.OWNER, WorkspaceRole.ADMIN])
  @Get(':wid')
  async findOne(@Req() req: IRequestWithUser, @Res() res: Response, @Param('wid') wid: number) {
    try {
      const query = await this.workspaceService.findOne(+wid)
      if (!query) {
        throw new HttpException(MSG_WORKSPACE_NOT_FOUND, HttpStatus.BAD_REQUEST)
      }
      const response = new ResponseData(true, query)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.BAD_REQUEST)
    }
  }

  @WorkspaceUserRole([WorkspaceRole.OWNER, WorkspaceRole.ADMIN])
  @Patch(':wid')
  async update(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('wid') wid: number,
    @Body() body: UpdateWorkspaceDto
  ) {
    try {
      const check = await this.workspaceService.findOne(+wid)
      if (!check) {
        throw new HttpException(MSG_WORKSPACE_NOT_FOUND, HttpStatus.BAD_REQUEST)
      }
      const userId = req.user.id
      const query = await this.workspaceService.update(+wid, body, userId)
      const response = new ResponseData(true, query)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.BAD_REQUEST)
    }
  }

  @WorkspaceUserRole([WorkspaceRole.OWNER, WorkspaceRole.ADMIN])
  @Delete(':wid')
  async remove(@Req() req: IRequestWithUser, @Res() res: Response, @Param('wid') wid: number) {
    try {
      const check = await this.workspaceService.findOne(+wid)
      if (!check) {
        throw new HttpException(MSG_WORKSPACE_NOT_FOUND, HttpStatus.BAD_REQUEST)
      }
      const userId = req.user.id
      await this.workspaceService.remove(+wid, userId)
      const response = new ResponseData(true, false, MSG_DELETE_SUCCESS)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.BAD_REQUEST)
    }
  }
}
