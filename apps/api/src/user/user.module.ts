import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AdminUserController } from './backend.controller'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [AdminUserController, UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
