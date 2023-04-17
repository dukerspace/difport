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

  async findAll(page: number, limit: number, userId: number): Promise<Workspace[]> {
    const skip: number = page == 0 ? 1 : limit * (page - 1)
    const result = await this.prisma.workspace.findMany({
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
    return result
  }

  findOne(id: number): Promise<Workspace> {
    return this.prisma.workspace.findFirstOrThrow({
      where: {
        id: id
      }
    })
  }

  update(id: number, data: UpdateWorkspaceDto, userId?: number): Promise<Workspace> {
    return this.prisma.workspace.update({
      where: {
        id,
        teams: {
          every: {
            userId: userId,
            role: {
              in: [WorkspaceRole.OWNER, WorkspaceRole.ADMIN]
            }
          }
        }
      },
      data
    })
  }

  async remove(id: number, userId?: number) {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id,
        teams: {
          every: {
            userId: userId,
            role: WorkspaceRole.OWNER
          }
        }
      }
    })

    await this.prisma.$transaction([
      // delete team
      this.prisma.workspaceUser.deleteMany({
        where: {
          workspaceId: workspace.id
        }
      }),
      // delete workspace
      this.prisma.workspace.delete({
        where: {
          id: workspace.id
        }
      })
    ])
  }

  count(userId: number): Promise<number> {
    return this.prisma.workspace.count({
      where: {
        teams: {
          every: {
            userId: userId
          }
        }
      }
    })
  }
}
