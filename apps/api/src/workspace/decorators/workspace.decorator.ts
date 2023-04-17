import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common'
import { WorkspaceRole } from '@prisma/client'
import { AuthGuard } from '../../auth/guards/auth.guard'
import { WorkspaceGuard } from '../guards/workspace.guard'

export const WorkspaceUserRole = (roles: WorkspaceRole[]) => {
  return applyDecorators(SetMetadata('workspaceRole', roles), UseGuards(AuthGuard, WorkspaceGuard))
}
