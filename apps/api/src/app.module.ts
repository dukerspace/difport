import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { AllExceptionsFilter } from './all-exceptions.filter'
import { AuthModule } from './auth/auth.module'
import { HealthModule } from './health/health.module'
import { NotificationModule } from './notification/notification.module'
import { PrismaModule } from './prisma/prisma.module'
import { ReportModule } from './report/report.module'
import { UserModule } from './user/user.module'
import { WorkspaceModule } from './workspace/workspace.module'

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    UserModule,
    AuthModule,
    WorkspaceModule,
    ReportModule,
    NotificationModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }
  ]
})
export class AppModule {}
