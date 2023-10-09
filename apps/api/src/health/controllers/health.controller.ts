import { Controller, Get, HttpStatus, Res } from '@nestjs/common'
import { Response } from 'express'

interface IHealth {
  message: string
}

@Controller('healthz')
export class HealthController {
  @Get('/')
  async health(@Res() res: Response) {
    const response: IHealth = {
      message: 'health'
    }
    res.status(HttpStatus.OK).json(response)
  }
}
