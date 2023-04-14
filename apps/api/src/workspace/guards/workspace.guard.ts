import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { jwtConstants } from '../../auth/constants'
import { TeamService } from '../team/team.service'

@Injectable()
export class WorkspaceGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly teamService: TeamService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    const payload = await this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret
    })

    const workspaceId = request.params.wid

    const check = await this.teamService.checkUser(workspaceId, payload.sub)
    if (check) {
      return true
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
