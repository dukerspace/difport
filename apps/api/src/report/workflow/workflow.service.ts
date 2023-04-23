import { Injectable } from '@nestjs/common'
import { ReportWorkflow } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateWorkflowDto } from './dto/create-workflow.dto'
import { UpdateWorkflowDto } from './dto/update-workflow.dto'

@Injectable()
export class WorkflowService {
  constructor(private readonly prisma: PrismaService) {}

  create(workspaceId: number, data: CreateWorkflowDto): Promise<ReportWorkflow> {
    const users = data.users.map((x) => {
      return {
        id: x.id
      }
    })

    const categories = data.categories.map((x) => {
      return {
        id: x.id
      }
    })

    return this.prisma.reportWorkflow.create({
      data: {
        workspaceId: workspaceId,
        name: data.name,
        users: {
          connect: users
        },
        categories: {
          connect: categories
        }
      }
    })
  }

  findAll(workspaceId: number, page: number, limit: number) {
    const skip: number = page == 0 ? 1 : limit * (page - 1)
    return this.prisma.reportWorkflow.findMany({
      where: {
        workspaceId: workspaceId
      },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            password: false
          }
        },
        categories: true
      },
      skip: skip,
      take: limit
    })
  }

  findOne(workspaceId: number, id: number) {
    return this.prisma.reportWorkflow.findFirst({
      where: {
        workspaceId: workspaceId,
        id: id
      },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            password: false
          }
        },
        categories: true
      }
    })
  }

  update(workspaceId: number, id: number, data: UpdateWorkflowDto): Promise<ReportWorkflow> {
    const users = data.users.map((x) => {
      return {
        id: x.id
      }
    })

    const categories = data.categories.map((x) => {
      return {
        id: x.id
      }
    })

    return this.prisma.reportWorkflow.update({
      where: {
        workspaceId: workspaceId,
        id: id
      },
      data: {
        workspaceId: workspaceId,
        name: data.name,
        users: {
          set: users
        },
        categories: {
          set: categories
        }
      },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            password: false
          }
        },
        categories: true
      }
    })
  }

  remove(workspaceId: number, id: number) {
    return this.prisma.reportWorkflow.delete({
      where: {
        workspaceId: workspaceId,
        id: id
      }
    })
  }

  count(workspaceId: number): Promise<number> {
    return this.prisma.reportWorkflow.count({
      where: {
        workspaceId: workspaceId
      }
    })
  }
}
