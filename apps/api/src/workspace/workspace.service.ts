import { Injectable } from '@nestjs/common'
import { Workspace } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateWorkspaceDto } from './dto/create-workspace.dto'
import { UpdateWorkspaceDto } from './dto/update-workspace.dto'

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateWorkspaceDto): Promise<Workspace> {
    return this.prisma.workspace.create({
      data: data
    })
  }

  findAll(page: number, limit: number): Promise<Workspace[]> {
    const skip: number = page == 0 ? 1 : limit * (page - 1)
    return this.prisma.workspace.findMany({
      skip: skip,
      take: limit
    })
  }

  findOne(id: number): Promise<Workspace> {
    return this.prisma.workspace.findFirstOrThrow({
      where: {
        id
      }
    })
  }

  update(id: number, data: UpdateWorkspaceDto): Promise<Workspace> {
    return this.prisma.workspace.update({
      where: {
        id
      },
      data
    })
  }

  remove(id: number): Promise<Workspace> {
    return this.prisma.workspace.delete({
      where: {
        id
      }
    })
  }

  count(): Promise<number> {
    return this.prisma.workspace.count()
  }
}
