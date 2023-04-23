import { Injectable } from '@nestjs/common'
import { Report, ReportStatus } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateReportDto } from './dto/create-report.dto'
import { UpdateReportDto } from './dto/update-report.dto'

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  create(workspaceId: number, userId: number, data: CreateReportDto): Promise<Report> {
    const { categories, ...insert } = data
    return this.prisma.report.create({
      data: {
        workspaceId: workspaceId,
        userId: userId,
        status: ReportStatus.WAITING,
        step: 1,
        categories: {
          connect: data.categories
        },
        ...insert
      },
      include: {
        categories: true
      }
    })
  }

  findAll(workspaceId: number, page: number, limit: number): Promise<Report[]> {
    const skip: number = page == 0 ? 1 : limit * (page - 1)
    return this.prisma.report.findMany({
      where: {
        workspaceId: workspaceId
      },
      include: {
        categories: true
      },
      skip: skip,
      take: limit
    })
  }

  findOne(workspaceId: number, id: number): Promise<Report> {
    return this.prisma.report.findFirstOrThrow({
      where: {
        workspaceId: workspaceId,
        id
      },
      include: {
        categories: true
      }
    })
  }

  update(workspaceId: number, id: number, data: UpdateReportDto): Promise<Report> {
    const { categories, ...update } = data
    return this.prisma.report.update({
      where: {
        workspaceId: workspaceId,
        id: id
      },
      data: {
        categories: {
          set: categories
        },
        ...update
      },
      include: {
        categories: true
      }
    })
  }

  remove(workspaceId: number, id: number): Promise<Report> {
    return this.prisma.report.delete({
      where: {
        workspaceId: workspaceId,
        id: id
      }
    })
  }

  count(workspaceId: number): Promise<number> {
    return this.prisma.report.count({
      where: {
        workspaceId: workspaceId
      }
    })
  }
}
