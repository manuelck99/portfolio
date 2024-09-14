import { Logger } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app/app.module"
import { CatchAllExceptionFilter } from "./app/exception/catch-all-exception.filter"
import * as process from "node:process"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const prefix = "api"
  app.setGlobalPrefix(prefix)

  app.useGlobalFilters(new CatchAllExceptionFilter())

  const host = process.env.HOST ?? "localhost"
  const port = process.env.PORT ?? 3000
  await app.listen(port)

  Logger.log(`Application is running on: http://${host}:${port}/${prefix}`)
}

bootstrap().catch((error) => {
  console.error(error)
})
