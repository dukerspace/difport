import { Role } from '@prisma/client'
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateBackendDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsOptional()
  firstName: string

  @IsString()
  @IsOptional()
  lastName: string

  @IsNotEmpty()
  role: Role
}
