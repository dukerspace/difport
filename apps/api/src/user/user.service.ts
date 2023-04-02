import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateUserDto): Promise<User> {
    const insert = {
      ...data,
      failLoginCount: 0
    }
    return this.prisma.user.create({
      data: insert
    })
  }

  findAll(page: number, limit: number): Promise<User[]> {
    const skip: number = page == 0 ? 1 : limit * (page - 1)
    return this.prisma.user.findMany({
      skip: skip,
      take: limit
    })
  }

  findOne(id: number): Promise<User> {
    return this.prisma.user.findFirstOrThrow({
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
    return this.prisma.user.delete({
      where: {
        id
      }
    })
  }

  count(): Promise<number> {
    return this.prisma.user.count()
  }
}
