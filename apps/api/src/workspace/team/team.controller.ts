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
import { IRequestWithUser } from 'src/auth/interfaces/user.interface'
import { ResponseData } from 'src/utils/response'
import { MSG_DELETE_SUCCESS } from '../../utils/constant'
import { WorkspaceUserRole } from '../decorators/workspace.decorator'
import { CreateTeamDto } from './dto/create-team.dto'
import { UpdateTeamDto } from './dto/update-team.dto'
import { TeamService } from './team.service'

@WorkspaceUserRole([WorkspaceRole.OWNER, WorkspaceRole.ADMIN])
@Controller('workspaces/:wid/teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  async create(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('wid') wid: number,
    @Body() body: CreateTeamDto
  ) {
    try {
      const userId = body.userId
      const check = await this.teamService.checkUser(+wid, userId)
      if (check) {
        throw new HttpException('User is exist', HttpStatus.BAD_REQUEST)
      }

      const query = await this.teamService.create(+wid, body)
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
      const query = await this.teamService.findAll(+wid, +page || 1, +limit || 50)
      const response = new ResponseData(true, query)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get(':teamId')
  async findOne(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('wid') wid: number,
    @Param('teamId') teamId: number
  ) {
    try {
      const query = await this.teamService.findOne(+wid, +teamId)
      if (!query) {
        throw new HttpException('User is not exits', HttpStatus.BAD_REQUEST)
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

  @Patch(':teamId')
  async update(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('wid') wid: number,
    @Param('teamId') teamId: number,
    @Body() body: UpdateTeamDto
  ) {
    try {
      const check = await this.teamService.findOne(+wid, +teamId)
      if (!check) {
        throw new HttpException('User is not exits', HttpStatus.BAD_REQUEST)
      }

      const query = await this.teamService.update(+wid, +teamId, body)
      const response = new ResponseData(true, query)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const message = {
        message: error.message
      }
      throw new HttpException(message, HttpStatus.BAD_REQUEST)
    }
  }

  @Delete(':teamId')
  async remove(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('wid') wid: number,
    @Param('teamId') teamId: number
  ) {
    try {
      const check = await this.teamService.findOne(+wid, +teamId)
      if (!check) {
        throw new HttpException('User is not exits', HttpStatus.BAD_REQUEST)
      }

      await this.teamService.remove(+wid, +teamId)
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
