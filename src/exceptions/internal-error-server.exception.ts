import { HttpException, HttpStatus } from '@nestjs/common';
export class InternalErrorServerException extends HttpException {
  constructor(
    public message: string,
    status: HttpStatus,
  ) {
    super(message, status, {
      cause: new Error(),
      description: 'error server',
    });
  }
}
