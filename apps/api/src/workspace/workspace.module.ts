import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AdminUserController } from 'src/user/backend.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { UserModule } from '../user/user.module'
import { TeamController } from './team/team.controller'
import { TeamService } from './team/team.service'
import { WorkspaceController } from './workspace.controller'
import { WorkspaceService } from './workspace.service'

@Module({
  imports: [PrismaModule, JwtModule, UserModule],
  controllers: [AdminUserController, WorkspaceController, TeamController],
  providers: [WorkspaceService, TeamService],
  exports: [WorkspaceService, TeamService]
})
export class WorkspaceModule {}
