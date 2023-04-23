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
import { Response } from 'express'
import { MSG_DELETE_SUCCESS } from 'src/utils/constant'
import { ResponseData, ResponsePaginate } from 'src/utils/response'
import { IRequestWithUser } from '../../auth/interfaces/user.interface'
import { WorkspaceService } from '../../workspace/workspace/workspace.service'
import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Controller('workspaces/:wid/reports/categories')
export class CategoryController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly categoryService: CategoryService
  ) {}

  @Post()
  async create(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('wid') wid: number,
    @Body() body: CreateCategoryDto
  ) {
    try {
      const check = await this.workspaceService.checkWorkspace(+wid)
      if (!check) {
        throw new HttpException('Workspace is not exist', HttpStatus.BAD_REQUEST)
      }

      const query = await this.categoryService.create(+wid, body)
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
      const query = await this.categoryService.findAll(+wid, currentPage, perPage)
      const total = await this.categoryService.count(+wid)
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
      const query = await this.categoryService.findOne(+wid, +id)
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
    @Body() body: UpdateCategoryDto
  ) {
    try {
      const check = await this.workspaceService.checkWorkspace(+wid)
      if (!check) {
        throw new HttpException('Workspace is not exist', HttpStatus.BAD_REQUEST)
      }

      const query = await this.categoryService.update(+wid, +id, body)
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

      await this.categoryService.remove(+wid, +id)
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
