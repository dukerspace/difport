import { Injectable } from '@nestjs/common'
import { Workspace, WorkspaceRole } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateWorkspaceDto } from './dto/create-workspace.dto'
import { UpdateWorkspaceDto } from './dto/update-workspace.dto'

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateWorkspaceDto, userId?: number): Promise<Workspace> {
    return this.prisma.workspace.create({
      data: {
        ...data,
        teams: {
          create: {
            userId: userId,
            role: WorkspaceRole.OWNER
          }
        }
      }
    })
  }

  findAll(page: number, limit: number, userId?: number): Promise<Workspace[]> {
    const skip: number = page == 0 ? 1 : limit * (page - 1)
    return this.prisma.workspace.findMany({
      skip: skip,
      take: limit,
      where: {
        teams: {
          every: {
            userId: userId
          }
        }
      }
    })
  }

  findOne(id: string, userId?: number): Promise<Workspace> {
    return this.prisma.workspace.findFirstOrThrow({
      where: {
        id,
        teams: {
          every: {
            userId: userId
          }
        }
      }
    })
  }

  update(id: string, data: UpdateWorkspaceDto, userId?: number): Promise<Workspace> {
    return this.prisma.workspace.update({
      where: {
        id,
        teams: {
          every: {
            userId: userId
          }
        }
      },
      data
    })
  }

  remove(id: string, userId?: number): Promise<Workspace> {
    return this.prisma.workspace.delete({
      where: {
        id
      }
    })
  }

  count(userId?: number): Promise<number> {
    return this.prisma.workspace.count({
      where: {}
    })
  }
}
