import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const { status, message, data } = this.getErrorDetails(exception);

    // Log the error for debugging
    this.logError(exception, request);

    // Send a consistent error response
    response.status(status).json({
      status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      ...data, // Include additional error data if present
    });
  }

  private getErrorDetails(exception: unknown): {
    status: number;
    message: string;
    data: Record<string, any>;
  } {
    // Default error details
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let data: Record<string, any> = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'object' && response !== null) {
        // If the response is an object, extract message and additional data
        message = (response as any).message || message;
        data = { ...response }; // Include all properties from the response
      } else if (typeof response === 'string') {
        // If the response is a string, use it as the message
        message = response;
      }
    } else if (exception instanceof QueryFailedError) {
      // Handle TypeORM database errors
      status = HttpStatus.BAD_REQUEST;
      message = 'Database query failed';
      data = { details: exception.message }; // Include database error details
    } else if (exception instanceof Error) {
      // Handle generic errors
      message = exception.message;
      data = { details: exception.stack }; // Include stack trace for debugging
    }

    return { status, message, data };
  }

  private logError(exception: unknown, request: any): void {
    if (exception instanceof HttpException) {
      // Log HTTP exceptions with their status and message
      /*
      this.logger.error(
        `HTTP Exception: ${exception.getStatus()} - ${exception.message}`,
        exception.stack,
      );*/
    } else if (exception instanceof QueryFailedError) {
      // Log database errors with the query and parameters
      this.logger.error(
        `Database Error: ${exception.message}`,
        exception.stack,
      );
    } else if (exception instanceof Error) {
      // Log generic errors with their stack trace
      this.logger.error(`Unexpected Error: ${exception.message}`, exception.stack);
    } else {
      // Log unknown errors
      this.logger.error(`Unhandled Error: ${JSON.stringify(exception)}`);
    }

    // Log request details for context
    this.logger.error(`Request URL: ${request.url}`);
    this.logger.error(`Request Method: ${request.method}`);
    this.logger.error(`Request Body: ${JSON.stringify(request.body)}`);
  }
}