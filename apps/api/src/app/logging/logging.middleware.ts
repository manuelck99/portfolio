import { Injectable, Logger, NestMiddleware } from "@nestjs/common"

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name)

  use(req: Request, res: Response, next: (error?: never) => void): void {
    this.logger.log(`${req.method} request to route ${req.url}`)
    next()
  }
}
