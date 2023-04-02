import { IsEmail, IsOptional, IsString } from 'class-validator'

export class CreateUserDto {
  @IsString()
  username: string

  @IsString()
  password: string

  @IsEmail()
  email: string

  @IsString()
  @IsOptional()
  firstName: string

  @IsString()
  @IsOptional()
  lastName: string
}
