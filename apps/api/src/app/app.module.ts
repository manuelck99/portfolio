import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { UserModule } from "./user/user.module"
import { ProjectModule } from "./project/project.module"
import { TechnologyModule } from "./technology/technology.module"
import { LoggingMiddleware } from "./logging/logging.middleware"

@Module({
  imports: [UserModule, ProjectModule, TechnologyModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware).forRoutes("*")
  }
}
