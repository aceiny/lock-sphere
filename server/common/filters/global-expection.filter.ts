import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";
import { QueryFailedError } from "typeorm";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // Default to internal server error
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = "Internal server error";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseMessage = exception.getResponse();

      // Check if responseMessage is an object with a message property
      if (
        typeof responseMessage === "object" &&
        responseMessage !== null &&
        "message" in responseMessage
      ) {
        message = (responseMessage as any).message;
      } else if (typeof responseMessage === "string") {
        message = responseMessage;
      }
    } else if (exception instanceof QueryFailedError) {
      Logger.log(exception.message)
      status = HttpStatus.BAD_REQUEST;
      message = "Database query failed";
    } else if (exception instanceof Error) {
      message = exception.message;
    }
    Logger.log(message)
    response.status(status).json({
      status: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
