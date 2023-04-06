import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from '@prisma/client'
import { UserService } from 'src/user/user.service'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<Role>('userRole', [
      context.getHandler(),
      context.getClass()
    ])

    if (!requiredRole) {
      return true
    }

    const req = context.switchToHttp().getRequest()
    const user = await this.userService.findByID(req.user.id)
    return user.role == requiredRole
  }
}
