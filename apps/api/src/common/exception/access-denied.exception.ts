import AbstractApplicationException, { ErrorType } from '~/common/exception/abstract-application.exception';

export class AccessDeniedException extends AbstractApplicationException {
  readonly error: ErrorType = 'Unauthorized';
  readonly code: number = 401;
}
