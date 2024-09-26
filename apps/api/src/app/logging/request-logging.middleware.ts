import { Injectable, Logger, NestMiddleware } from "@nestjs/common"
import { Request, Response } from "express"
import { getLoggingMessage } from "./logging.utils"

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggingMiddleware.name)

  use(req: Request, res: Response, next: (error?: never) => void): void {
    this.logger.log(getLoggingMessage(`${req.method} ${req.path}`))
    next()
  }
}
