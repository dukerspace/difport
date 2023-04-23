import { ReportStatus } from '@prisma/client'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateReportDto {
  @IsString()
  title: string

  @IsString()
  description: string

  @IsOptional()
  categories?: ids[] | undefined

  @IsNumber()
  @IsOptional()
  mapLat?: number | undefined

  @IsNumber()
  @IsOptional()
  mapLng?: number | undefined

  @IsString()
  status: ReportStatus

  @IsBoolean()
  published: boolean
}

class ids {
  @IsNumber()
  id: number
}
