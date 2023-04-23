import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { WorkspaceModule } from 'src/workspace/workspace.module'
import { PrismaModule } from '../prisma/prisma.module'
import { UserModule } from '../user/user.module'
import { ApprovalController } from './approval/approval.controller'
import { ApprovalService } from './approval/approval.service'
import { CategoryController } from './category/category.controller'
import { CategoryService } from './category/category.service'
import { ReportController } from './report/report.controller'
import { ReportService } from './report/report.service'
import { WorkflowController } from './workflow/workflow.controller'
import { WorkflowService } from './workflow/workflow.service'

@Module({
  imports: [PrismaModule, JwtModule, UserModule, WorkspaceModule],
  controllers: [CategoryController, WorkflowController, ApprovalController, ReportController],
  providers: [ReportService, WorkflowService, CategoryService, ApprovalService],
  exports: [ReportService, WorkflowService, CategoryService]
})
export class ReportModule {}
