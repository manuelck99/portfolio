import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common"
import { UserModule } from "./user/user.module"
import { ProjectModule } from "./project/project.module"
import { TechnologyModule } from "./technology/technology.module"
import { RequestLoggingMiddleware } from "./logging/request-logging.middleware"

@Module({
  imports: [UserModule, ProjectModule, TechnologyModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestLoggingMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL })
  }
}
