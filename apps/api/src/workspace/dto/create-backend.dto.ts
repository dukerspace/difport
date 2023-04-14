import { IsString } from 'class-validator'

export class CreateBackendDto {
  @IsString()
  name: string

  teams: CreateBackendTeamDto
}

export class CreateBackendTeamDto {
  userId: number
}
