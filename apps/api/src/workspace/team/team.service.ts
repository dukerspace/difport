import { Injectable } from '@nestjs/common'
import { WorkspaceRole, WorkspaceUser } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateTeamDto } from '../dto/create-team.dto'
import { UpdateTeamDto } from '../dto/update-team.dto'

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  create(workspaceId: string, data: CreateTeamDto): Promise<WorkspaceUser> {
    return this.prisma.workspaceUser.create({
      data: {
        workspaceId: workspaceId,
        ...data
      }
    })
  }

  findAll(workspaceId: string, page: number, limit: number): Promise<WorkspaceUser[]> {
    const skip: number = page == 0 ? 1 : limit * (page - 1)
    return this.prisma.workspaceUser.findMany({
      where: {
        workspaceId: workspaceId
      },
      skip: skip,
      take: limit
    })
  }

  findOne(workspaceId: string, id: number): Promise<WorkspaceUser> {
    return this.prisma.workspaceUser.findFirstOrThrow({
      where: {
        workspaceId: workspaceId,
        id
      }
    })
  }

  update(workspaceId: string, id: number, data: UpdateTeamDto): Promise<WorkspaceUser> {
    return this.prisma.workspaceUser.update({
      where: {
        workspaceId: workspaceId,
        id: id
      },
      data: data
    })
  }

  remove(workspaceId: string, id: number): Promise<WorkspaceUser> {
    return this.prisma.workspaceUser.delete({
      where: {
        workspaceId: workspaceId,
        id: id
      }
    })
  }

  count(workspaceId: string): Promise<number> {
    return this.prisma.workspaceUser.count({
      where: {
        workspaceId: workspaceId
      }
    })
  }

  async checkUser(workspaceId: string, userId: number, role?: WorkspaceRole): Promise<boolean> {
    const user: WorkspaceUser = await this.prisma.workspaceUser.findFirst({
      where: {
        workspaceId: workspaceId,
        userId: userId,
        role: {
          in: role
        }
      }
    })
    console.log('xxx', user)
    return user ? true : false
  }
}
