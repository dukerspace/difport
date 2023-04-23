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
  Res
} from '@nestjs/common'
import { WorkspaceRole } from '@prisma/client'
import { Response } from 'express'
import { IRequestWithUser } from '../../auth/interfaces/user.interface'
import { MSG_DELETE_SUCCESS } from '../../utils/constant'
import { ResponseData, ResponsePaginate } from '../../utils/response'
import { WorkspaceUserRole } from '../../workspace/decorators/workspace.decorator'
import { WorkspaceService } from '../../workspace/workspace/workspace.service'
import { CreateReportDto } from './dto/create-report.dto'
import { UpdateReportDto } from './dto/update-report.dto'
import { ReportService } from './report.service'

@WorkspaceUserRole([WorkspaceRole.OWNER, WorkspaceRole.ADMIN])
@Controller('workspaces/:wid/reports')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly workspaceService: WorkspaceService
  ) {}

  @Post()
  async create(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('wid') wid: number,
    @Body() body: CreateReportDto
  ) {
    try {
      const userId = req.user.id
      const check = await this.workspaceService.checkWorkspace(+wid)
      if (!check) {
        throw new HttpException('Workspace is not exist', HttpStatus.BAD_REQUEST)
      }

      const query = await this.reportService.create(+wid, userId, body)
      const response = new ResponseData(true, query)
      res.status(HttpStatus.CREATED).json(response)
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
    @Param('wid') wid: number,
    @Query('page') page: number,
    @Query('limit') limit: number
  ) {
    try {
      const check = await this.workspaceService.checkWorkspace(+wid)
      if (!check) {
        throw new HttpException('Workspace is not exist', HttpStatus.BAD_REQUEST)
      }
      const currentPage = page ? page : 1
      const perPage = limit ? limit : 50
      const query = await this.reportService.findAll(+wid, currentPage, perPage)
      const total = await this.workspaceService.count(+wid)
      const response = new ResponsePaginate(true, query, currentPage, perPage, total)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get(':id')
  async findOne(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('wid') wid: number,
    @Param('id') id: number
  ) {
    try {
      const check = await this.workspaceService.checkWorkspace(+wid)
      if (!check) {
        throw new HttpException('Workspace is not exist', HttpStatus.BAD_REQUEST)
      }
      const query = await this.reportService.findOne(+wid, +id)
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
  async update(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('wid') wid: number,
    @Param('id') id: number,
    @Body() body: UpdateReportDto
  ) {
    try {
      const check = await this.workspaceService.checkWorkspace(+wid)
      if (!check) {
        throw new HttpException('Workspace is not exist', HttpStatus.BAD_REQUEST)
      }

      const query = await this.reportService.update(+wid, +id, body)
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
  async remove(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('wid') wid: number,
    @Param('id') id: number
  ) {
    try {
      const check = await this.workspaceService.checkWorkspace(+wid)
      if (!check) {
        throw new HttpException('Workspace is not exist', HttpStatus.BAD_REQUEST)
      }

      await this.reportService.remove(+wid, +id)
      const response = new ResponseData(true, null, MSG_DELETE_SUCCESS)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.BAD_REQUEST)
    }
  }
}
