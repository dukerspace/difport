import { Injectable } from '@nestjs/common'
import { ReportCategory } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  create(workspaceId: number, data: CreateCategoryDto): Promise<ReportCategory> {
    return this.prisma.reportCategory.create({
      data: {
        workspaceId: workspaceId,
        ...data
      }
    })
  }

  findAll(workspaceId: number, page: number, limit: number): Promise<ReportCategory[]> {
    const skip: number = page == 0 ? 1 : limit * (page - 1)
    return this.prisma.reportCategory.findMany({
      where: {
        workspaceId: workspaceId
      },
      skip: skip,
      take: limit
    })
  }

  findOne(workspaceId: number, id: number): Promise<ReportCategory> {
    return this.prisma.reportCategory.findFirstOrThrow({
      where: {
        workspaceId: workspaceId,
        id
      }
    })
  }

  update(workspaceId: number, id: number, data: UpdateCategoryDto): Promise<ReportCategory> {
    return this.prisma.reportCategory.update({
      where: {
        workspaceId: workspaceId,
        id: id
      },
      data: data
    })
  }

  remove(workspaceId: number, id: number): Promise<ReportCategory> {
    return this.prisma.reportCategory.delete({
      where: {
        workspaceId: workspaceId,
        id: id
      }
    })
  }

  count(workspaceId: number): Promise<number> {
    return this.prisma.reportCategory.count({
      where: {
        workspaceId: workspaceId
      }
    })
  }
}
