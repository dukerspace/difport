import { ReportApprovalStatus } from '@prisma/client'
import { IsString } from 'class-validator'

export class CreateApprovalDto {
  @IsString()
  description: string

  @IsString()
  status: ReportApprovalStatus
}
