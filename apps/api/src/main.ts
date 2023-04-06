import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ValidationError } from 'class-validator'
import { json, urlencoded } from 'express'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {})

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const msg = validationErrors.map((error: ValidationError) => {
          return {
            field: error.property,
            message: Object.values(error.constraints)
          }
        })

        return msg
      }
    })
  )

  app.use(json({ limit: '50mb' }))
  app.use(urlencoded({ extended: true, limit: '50mb' }))
  app.enableCors()
  app.setGlobalPrefix('api/v1')

  const port = process.env.PORT
  await app.listen(port)
}
bootstrap()
