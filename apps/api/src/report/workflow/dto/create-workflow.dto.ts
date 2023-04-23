import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateWorkflowDto {
  @IsString()
  name: string

  @IsOptional()
  users: ids[]

  @IsOptional()
  categories: ids[]
}

class ids {
  @IsNumber()
  id: number
}
