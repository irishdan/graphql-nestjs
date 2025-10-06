import AbstractApplicationException, { ErrorType } from './abstract-application.exception';

export class ConflictException extends AbstractApplicationException {
  readonly error: ErrorType = 'Conflict';
  readonly code = 409;
}
