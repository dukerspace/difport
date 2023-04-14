import { WorkspaceRole } from '@prisma/client'
import { IsNotEmpty } from 'class-validator'

export class CreateTeamDto {
  @IsNotEmpty()
  userId: number

  @IsNotEmpty()
  role: WorkspaceRole
}
