import AbstractApplicationException, { ErrorType } from '~/common/exception/abstract-application.exception';

export class PermissionDeniedException extends AbstractApplicationException {
  readonly error: ErrorType = 'Forbidden';
  readonly code: number = 403;
}
