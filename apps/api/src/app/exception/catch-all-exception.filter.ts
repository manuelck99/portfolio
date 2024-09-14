import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common"
import { Response } from "express"

@Catch()
export class CatchAllExceptionFilter implements ExceptionFilter<unknown> {
  private readonly logger = new Logger(CatchAllExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let status: number
    let json
    if (exception instanceof HttpException) {
      status = exception.getStatus()
      json = {
        name: exception.name,
        statusCode: exception.getStatus(),
        message: exception.message,
        stack: exception.stack,
        cause: exception.cause,
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR
      json = {
        name: exception.name,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
        stack: exception.stack,
        cause: exception.cause,
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR
      json = {
        name: "UnknownError",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Something went wrong",
        cause: exception,
      }
    }

    this.logger.error(json)
    delete json.stack

    response.status(status).json(json)
  }
}
