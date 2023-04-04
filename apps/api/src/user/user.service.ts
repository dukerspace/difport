import { Injectable } from '@nestjs/common'
import { Role, User } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateUserDto): Promise<User> {
    const insert = {
      ...data,
      failLoginCount: 0,
      role: Role.USER
    }
    return this.prisma.user.create({
      data: insert
    })
  }

  findAll(page: number, limit: number, isDeleted: boolean): Promise<User[]> {
    const skip: number = page == 1 ? 0 : limit * (page - 1)
    return this.prisma.user.findMany({
      skip: skip,
      take: limit,
      where: {
        isDeleted: isDeleted
      }
    })
  }

  findOne(id: number): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        id
      }
    })
  }

  update(id: number, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: {
        id
      },
      data
    })
  }

  remove(id: number): Promise<User> {
    const data = {
      isDeleted: true
    }
    return this.prisma.user.update({
      where: {
        id
      },
      data: data
    })
  }

  count(): Promise<number> {
    return this.prisma.user.count()
  }
}
